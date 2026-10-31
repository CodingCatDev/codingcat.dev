import { env } from "cloudflare:workers";

export const DEFAULT_MEDIA_LIBRARY_ID = "mlttp0BZbCpV";

export type MediaLibraryEnvironment = "production" | "dev";
export type MediaLibraryCategory =
	| "editorial"
	| "guest"
	| "sponsor"
	| "portal-vault";
export type MediaLibraryVisibility = "public" | "private-vault";

/**
 * Deterministic folder IDs inside `tree.${mediaLibraryId}` so `/Production/*` and `/Dev/*`
 * remain strictly separated in the shared organization Media Library.
 */
export function getMediaLibraryFolderIds(mediaLibraryId: string) {
	const treeId = `tree.${mediaLibraryId}`;
	return {
		treeId,
		production: {
			root: "dir-production",
			editorial: "dir-production-editorial",
			guest: "dir-production-guests",
			sponsor: "dir-production-sponsors",
			"portal-vault": "dir-production-portal-vault",
		},
		dev: {
			root: "dir-dev",
			editorial: "dir-dev-editorial",
			guest: "dir-dev-guests",
			sponsor: "dir-dev-sponsors",
			"portal-vault": "dir-dev-portal-vault",
		},
	};
}

export function resolveMediaLibraryConfig() {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const projectId = workerEnv.PUBLIC_SANITY_PROJECT_ID || "hfh83o0w";
	const dataset: MediaLibraryEnvironment =
		workerEnv.PUBLIC_SANITY_DATASET === "dev" ? "dev" : "production";
	const mediaLibraryId =
		workerEnv.SANITY_MEDIA_LIBRARY_ID ||
		workerEnv.PUBLIC_SANITY_MEDIA_LIBRARY_ID ||
		DEFAULT_MEDIA_LIBRARY_ID;
	const token =
		workerEnv.SANITY_MEDIA_LIBRARY_TOKEN ||
		workerEnv.SANITY_API_WRITE_TOKEN ||
		workerEnv.SANITY_AUTH_TOKEN ||
		workerEnv.SANITY_WRITE_TOKEN ||
		"";

	return {
		projectId,
		dataset,
		mediaLibraryId,
		token: token.trim().replace(/^["']|["']$/g, ""),
	};
}

let foldersInitializedForLibrary = "";

/**
 * Idempotently creates `tree.${mediaLibraryId}` and the `/Production/*` and `/Dev/*`
 * `sanity.directory` folder hierarchy inside Sanity Media Library (`mlttp0BZbCpV`).
 */
export async function ensureMediaLibraryFolders(
	mediaLibraryId: string,
	token: string,
): Promise<boolean> {
	if (!mediaLibraryId || !token) {
		return false;
	}
	if (foldersInitializedForLibrary === mediaLibraryId) {
		return true;
	}

	const ids = getMediaLibraryFolderIds(mediaLibraryId);
	const mutations = [
		{
			createIfNotExists: {
				_id: ids.treeId,
				_type: "sanity.tree",
				name: "folders",
			},
		},
		// Top-level environment folders
		{
			createIfNotExists: {
				_id: ids.production.root,
				_type: "sanity.directory",
				name: "Production",
				parent: { _type: "reference", _ref: ids.treeId },
			},
		},
		{
			createIfNotExists: {
				_id: ids.dev.root,
				_type: "sanity.directory",
				name: "Dev",
				parent: { _type: "reference", _ref: ids.treeId },
			},
		},
		// Production subfolders
		{
			createIfNotExists: {
				_id: ids.production.editorial,
				_type: "sanity.directory",
				name: "Editorial",
				parent: { _type: "reference", _ref: ids.production.root },
			},
		},
		{
			createIfNotExists: {
				_id: ids.production.guest,
				_type: "sanity.directory",
				name: "Guests",
				parent: { _type: "reference", _ref: ids.production.root },
			},
		},
		{
			createIfNotExists: {
				_id: ids.production.sponsor,
				_type: "sanity.directory",
				name: "Sponsors",
				parent: { _type: "reference", _ref: ids.production.root },
			},
		},
		{
			createIfNotExists: {
				_id: ids.production["portal-vault"],
				_type: "sanity.directory",
				name: "Portal-Vault",
				parent: { _type: "reference", _ref: ids.production.root },
			},
		},
		// Dev subfolders
		{
			createIfNotExists: {
				_id: ids.dev.editorial,
				_type: "sanity.directory",
				name: "Editorial",
				parent: { _type: "reference", _ref: ids.dev.root },
			},
		},
		{
			createIfNotExists: {
				_id: ids.dev.guest,
				_type: "sanity.directory",
				name: "Guests",
				parent: { _type: "reference", _ref: ids.dev.root },
			},
		},
		{
			createIfNotExists: {
				_id: ids.dev.sponsor,
				_type: "sanity.directory",
				name: "Sponsors",
				parent: { _type: "reference", _ref: ids.dev.root },
			},
		},
		{
			createIfNotExists: {
				_id: ids.dev["portal-vault"],
				_type: "sanity.directory",
				name: "Portal-Vault",
				parent: { _type: "reference", _ref: ids.dev.root },
			},
		},
	];

	try {
		const res = await fetch(
			`https://api.sanity.io/v2025-02-19/media-libraries/${mediaLibraryId}/mutate`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ mutations }),
			},
		);
		if (res.ok) {
			foldersInitializedForLibrary = mediaLibraryId;
			return true;
		}
		return false;
	} catch {
		return false;
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface MediaLibraryDualUploadResult {
	mediaLibraryId: string;
	mediaLibraryAssetId: string;
	assetInstanceId: string;
	folderId: string;
	gdr: {
		_type: "globalDocumentReference";
		_ref: string;
		_weak: true;
	};
}

/**
 * Uploads bytes to Sanity Media Library (`mlttp0BZbCpV`) inside the target
 * `/Production/<Category>` or `/Dev/<Category>` folder, patches `aspects.metadata`,
 * and links the asset to the project dataset with exponential backoff.
 *
 * Returns `null` if the active token lacks organization Media Library permissions
 * so the caller can gracefully keep its dataset-local asset upload intact.
 */
export async function uploadAndLinkMediaLibraryAsset(params: {
	bytes: Uint8Array;
	filename: string;
	category: MediaLibraryCategory;
	visibility: MediaLibraryVisibility;
	title?: string;
	description?: string;
	altText?: string;
	creditLine?: string;
	partnerSlug?: string;
	docType?: string;
	tags?: string[];
}): Promise<MediaLibraryDualUploadResult | null> {
	const { projectId, dataset, mediaLibraryId, token } =
		resolveMediaLibraryConfig();
	if (!token || !mediaLibraryId) {
		return null;
	}

	const folderIds = getMediaLibraryFolderIds(mediaLibraryId);
	const envFolders = folderIds[dataset] || folderIds.production;
	const targetFolderId = envFolders[params.category] || envFolders.editorial;

	const foldersReady = await ensureMediaLibraryFolders(mediaLibraryId, token);

	const uploadQuery = new URLSearchParams({
		filename: params.filename,
		autoGenerateTitle: "true",
		...(foldersReady ? { parent: targetFolderId } : {}),
	});

	const uploadUrl = `https://api.sanity.io/v2024-06-24/media-libraries/${mediaLibraryId}/upload?${uploadQuery.toString()}`;

	try {
		const uploadRes = await fetch(uploadUrl, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Bearer ${token}`,
			},
			body: params.bytes as unknown as BodyInit,
		});

		if (!uploadRes.ok) {
			return null;
		}

		const uploadJson = (await uploadRes.json()) as {
			asset?: { _id?: string };
			assetInstance?: { _id?: string };
		};
		const mediaLibraryAssetId = uploadJson?.asset?._id;
		const assetInstanceId = uploadJson?.assetInstance?._id;
		if (!mediaLibraryAssetId || !assetInstanceId) {
			return null;
		}

		// Patch `aspects.metadata` (and `parent` folder if not set during upload)
		const aspectPatch: Record<string, unknown> = {
			"aspects.metadata": {
				environment: dataset,
				visibility: params.visibility,
				category: params.category,
				partnerSlug: params.partnerSlug || "",
				docType: params.docType || "",
				title: params.title || params.filename,
				description: params.description || "",
				altText: params.altText || params.title || "",
				creditLine: params.creditLine || "",
				originalFilename: params.filename,
				tags: params.tags || [],
			},
		};
		if (foldersReady) {
			aspectPatch.parent = { _type: "reference", _ref: targetFolderId };
		}

		await fetch(
			`https://api.sanity.io/v2024-06-24/media-libraries/${mediaLibraryId}/mutate`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					mutations: [
						{
							patch: {
								id: mediaLibraryAssetId,
								setIfMissing: { aspects: {} },
								set: aspectPatch,
							},
						},
					],
				}),
			},
		).catch(() => null);

		// Link Media Library asset to dataset with exponential backoff (1s -> 2s -> 4s -> 8s)
		const linkUrl = `https://${projectId}.api.sanity.io/v2025-02-19/assets/media-library-link/${dataset}`;
		for (let attempt = 0; attempt <= 4; attempt++) {
			const linkRes = await fetch(linkUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					mediaLibraryId,
					assetInstanceId,
					assetId: mediaLibraryAssetId,
				}),
			});
			if (linkRes.ok) {
				break;
			}
			const errText = await linkRes.text();
			if (
				(errText.includes("not ready") ||
					linkRes.status === 409 ||
					linkRes.status === 425) &&
				attempt < 4
			) {
				await sleep(1000 * 2 ** attempt);
				continue;
			}
			break;
		}

		return {
			mediaLibraryId,
			mediaLibraryAssetId,
			assetInstanceId,
			folderId: targetFolderId,
			gdr: {
				_type: "globalDocumentReference",
				_ref: `media-library:${mediaLibraryId}:${mediaLibraryAssetId}`,
				_weak: true,
			},
		};
	} catch {
		return null;
	}
}
