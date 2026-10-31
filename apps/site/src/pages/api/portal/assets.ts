import type { APIRoute } from "astro";
import {
	extractPortalAllowedEmails,
	verifyPortalRequestAuth,
} from "@/lib/portal-security";
import { uploadAndLinkMediaLibraryAsset } from "@/lib/sanity/media-library";
import { getSanityServerClient } from "@/lib/sanity/write-client";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Portal-Key, X-Portal-Email",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export async function ensureSanityMediaTags(
	client: any,
	tagNames: string[],
): Promise<Array<{ _type: "reference"; _ref: string; _key: string }>> {
	const refs: Array<{ _type: "reference"; _ref: string; _key: string }> = [];
	for (const rawName of tagNames) {
		const slug = rawName
			.toLowerCase()
			.replace(/[^a-z0-9:-]/g, "-")
			.replace(/-+/g, "-")
			.slice(0, 64);
		if (!slug) continue;
		const tagId = `media-tag-${slug.replace(/:/g, "-")}`;
		try {
			await client.createIfNotExists({
				_id: tagId,
				_type: "media.tag",
				name: { _type: "slug", current: slug },
			});
			refs.push({
				_type: "reference",
				_ref: tagId,
				_key: `tag-${slug.replace(/:/g, "-").slice(0, 24)}`,
			});
		} catch {
			// Ignore if media.tag creation is skipped
		}
	}
	return refs;
}

/**
 * Token-gated asset download proxy for private Sanity Media Library files.
 * GET /api/portal/assets?token=spt_...&assetId=file-...
 */
export const GET: APIRoute = async ({ request, url }) => {
	const token = url.searchParams.get("token")?.trim();
	const assetId = url.searchParams.get("assetId")?.trim();

	if (!token || !assetId) {
		return new Response(
			JSON.stringify({ ok: false, message: "token and assetId are required" }),
			{
				status: 400,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const { client } = getSanityServerClient();
	const ownerDoc = await client.fetch<Record<string, any> | null>(
		`*[_type in ["sponsorLead", "booking", "guest"] && (portalToken == $token || legacyPortalToken == $token || _id == $token || _id == "private." + $token || _id == "private.sponsorLead-" + $token || _id == "sponsorLead-" + $token)][0]{
			_id,
			portalToken,
			legacyPortalToken,
			guestEmail,
			contactEmail,
			coordinatorEmail,
			coordinatorEmails,
			allowedEmails,
			sharedAssets
		}`,
		{ token },
	);

	if (!ownerDoc) {
		return new Response(
			JSON.stringify({ ok: false, message: "Invalid or expired portal token" }),
			{
				status: 403,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const canonicalToken = ownerDoc.portalToken || token;
	const auth = await verifyPortalRequestAuth({
		request,
		url,
		token: canonicalToken,
		allowedEmails: extractPortalAllowedEmails(ownerDoc),
	});
	if (!auth.authorized) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Please unlock the studio portal with your invited email to download private vault assets.",
			}),
			{
				status: 403,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const assetDoc = await client.fetch<{
		url?: string;
		originalFilename?: string;
		mimeType?: string;
	} | null>(
		`*[_id == $assetId && _type in ["sanity.fileAsset", "sanity.imageAsset"]][0]{
			url,
			originalFilename,
			mimeType
		}`,
		{ assetId },
	);

	if (!assetDoc?.url) {
		return new Response(
			JSON.stringify({ ok: false, message: "Asset not found in Media Library" }),
			{
				status: 404,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const upstream = await fetch(assetDoc.url);
	if (!upstream.ok || !upstream.body) {
		return new Response("Failed to stream asset", {
			status: 502,
			headers: CORS_HEADERS,
		});
	}

	const filename = assetDoc.originalFilename || "codingcat-vault-asset";
	return new Response(upstream.body, {
		status: 200,
		headers: {
			...CORS_HEADERS,
			"Content-Type":
				assetDoc.mimeType ||
				upstream.headers.get("Content-Type") ||
				"application/octet-stream",
			"Content-Disposition": `inline; filename="${filename.replace(/"/g, "")}"`,
			"Cache-Control": "private, max-age=3600",
		},
	});
};

/**
 * POST /api/portal/assets
 * Uploads a file or links an asset into Sanity Media Library, tags it with
 * sanity-plugin-media tags (private-vault, source:direct|passionfroot, partner:slug),
 * and appends it to `sharedAssets[]` on the matching sponsorLead and/or booking document.
 */
export const POST: APIRoute = async ({ request, url }) => {
	const { client, canWrite } = getSanityServerClient();
	if (!canWrite) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Sanity write token is not configured in this environment.",
			}),
			{
				status: 503,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const contentType = request.headers.get("content-type") || "";
	let token = "";
	let docId = "";
	let title = "";
	let category = "brief";
	let visibility: "private" | "public" = "private";
	let uploadedBy: "partner" | "codingcat" | "passionfroot" = "partner";
	let externalUrl = "";
	let uploadedFile: File | null = null;

	if (contentType.includes("multipart/form-data")) {
		const form = await request.formData();
		token = String(form.get("token") || "").trim();
		docId = String(form.get("docId") || "").trim();
		title = String(form.get("title") || "").trim();
		category = String(form.get("category") || "brief").trim();
		visibility =
			String(form.get("visibility") || "private") === "public"
				? "public"
				: "private";
		const rawBy = String(form.get("uploadedBy") || "partner");
		uploadedBy =
			rawBy === "codingcat" || rawBy === "passionfroot" ? rawBy : "partner";
		externalUrl = String(form.get("externalUrl") || "").trim();
		const fileField = form.get("file");
		if (fileField instanceof File && fileField.size > 0) {
			uploadedFile = fileField;
		}
	} else {
		try {
			const json = (await request.json()) as Record<string, any>;
			token = String(json.token || "").trim();
			docId = String(json.docId || "").trim();
			title = String(json.title || "").trim();
			category = String(json.category || "brief").trim();
			visibility = json.visibility === "public" ? "public" : "private";
			uploadedBy =
				json.uploadedBy === "codingcat" || json.uploadedBy === "passionfroot"
					? json.uploadedBy
					: "partner";
			externalUrl = String(json.externalUrl || "").trim();
		} catch {
			return new Response(
				JSON.stringify({ ok: false, message: "Invalid request payload" }),
				{
					status: 400,
					headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
				},
			);
		}
	}

	if (!token && !docId) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "token or docId is required to attach vault assets",
			}),
			{
				status: 400,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const targetDocs = await client.fetch<
		Array<{
			_id: string;
			_type: string;
			portalToken?: string;
			legacyPortalToken?: string;
			companyName?: string;
			company?: string;
			guestName?: string;
			guestEmail?: string;
			contactEmail?: string;
			source?: string;
			bookingSource?: string;
		}>
	>(
		`*[_type in ["sponsorLead", "booking"] && (
			($token != "" && (portalToken == $token || legacyPortalToken == $token)) ||
			($docId != "" && (_id == $docId || _id == "private." + $docId)) ||
			($token != "" && (_id == "private.sponsorLead-" + $token || _id == "sponsorLead-" + $token))
		)]{
			_id,
			_type,
			portalToken,
			legacyPortalToken,
			companyName,
			company,
			guestName,
			guestEmail,
			contactEmail,
			coordinatorEmail,
			coordinatorEmails,
			allowedEmails,
			source,
			bookingSource
		}`,
		{ token, docId },
	);

	if (!targetDocs || targetDocs.length === 0) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Studio portal not found.",
			}),
			{
				status: 404,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const primaryDoc = targetDocs[0];
	const resolvedToken =
		primaryDoc?.portalToken ||
		token ||
		docId.replace(/^(private\.)?sponsorLead-/, "");

	const auth = await verifyPortalRequestAuth({
		request,
		url: url ?? new URL(request.url),
		token: resolvedToken,
		allowedEmails: extractPortalAllowedEmails(...targetDocs),
	});
	if (!auth.authorized) {
		return new Response(
			JSON.stringify({
				ok: false,
				message:
					"Unauthorized: Please verify your invited guest email before uploading to the Studio Vault.",
			}),
			{
				status: 403,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}
	const partnerLabel =
		primaryDoc?.companyName ||
		primaryDoc?.company ||
		primaryDoc?.guestName ||
		resolvedToken;
	const isPassionfroot =
		primaryDoc?.source === "passionfroot" ||
		primaryDoc?.bookingSource === "passionfroot" ||
		uploadedBy === "passionfroot";

	let assetId: string | undefined;
	let mediaLibraryId: string | undefined;
	let mediaLibraryAssetId: string | undefined;
	let mediaLibraryFolderId: string | undefined;
	let mediaGdr:
		| { _type: "globalDocumentReference"; _ref: string; _weak: true }
		| undefined;
	let mimeType: string | undefined;
	let fileSize: number | undefined;
	let resolvedUrl = externalUrl;

	if (uploadedFile) {
		const arrayBuf = await uploadedFile.arrayBuffer();
		const bytes = new Uint8Array(arrayBuf);
		const isImg = (uploadedFile.type || "").startsWith("image/");
		const uploadedAsset = await client.assets.upload(
			isImg ? "image" : "file",
			bytes as unknown as Blob,
			{
				filename: uploadedFile.name,
				contentType: uploadedFile.type || "application/octet-stream",
				title: title || uploadedFile.name,
			},
		);
		assetId = uploadedAsset._id;
		mimeType = uploadedFile.type || "application/octet-stream";
		fileSize = uploadedFile.size;
		if (!title) {
			title = uploadedFile.name;
		}

		const tagStrings = [
			visibility === "private" ? "private-vault" : "public-brand-asset",
			isPassionfroot ? "source:passionfroot" : "source:direct",
			`partner:${partnerLabel}`,
			`category:${category}`,
		];

		// Dual-write into Sanity Media Library (`mlttp0BZbCpV`) under `/Production/Portal-Vault` or `/Dev/Portal-Vault`
		const mlResult = await uploadAndLinkMediaLibraryAsset({
			bytes,
			filename: uploadedFile.name,
			category: "portal-vault",
			visibility: visibility === "private" ? "private-vault" : "public",
			title: title || uploadedFile.name,
			partnerSlug: partnerLabel,
			docType: primaryDoc?._type || "booking",
			tags: tagStrings,
		});
		if (mlResult) {
			mediaLibraryId = mlResult.mediaLibraryId;
			mediaLibraryAssetId = mlResult.mediaLibraryAssetId;
			mediaLibraryFolderId = mlResult.folderId;
			mediaGdr = mlResult.gdr;
		}

		// Also tag dataset-local asset for legacy `sanity-plugin-media` compatibility
		const tagRefs = await ensureSanityMediaTags(client, tagStrings);
		if (tagRefs.length > 0) {
			try {
				await client
					.patch(uploadedAsset._id)
					.set({ "opt.media.tags": tagRefs })
					.commit();
			} catch {
				// Non-fatal
			}
		}

		const origin = url?.origin ?? new URL(request.url).origin;
		resolvedUrl =
			visibility === "private"
				? `${origin}/api/portal/assets?token=${encodeURIComponent(resolvedToken)}&assetId=${encodeURIComponent(uploadedAsset._id)}`
				: uploadedAsset.url;
	}

	if (!resolvedUrl && !assetId) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Please provide either a file upload or an externalUrl.",
			}),
			{
				status: 400,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			},
		);
	}

	const newAssetEntry = {
		_key: `vault-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
		title: title || "Shared Studio Asset",
		category,
		visibility,
		uploadedBy,
		uploadedAt: new Date().toISOString(),
		...(assetId ? { assetId } : {}),
		...(mediaLibraryId ? { mediaLibraryId } : {}),
		...(mediaLibraryAssetId ? { mediaLibraryAssetId } : {}),
		...(mediaLibraryFolderId ? { mediaLibraryFolderId } : {}),
		...(mediaGdr ? { media: mediaGdr } : {}),
		...(mimeType ? { mimeType } : {}),
		...(fileSize ? { fileSize } : {}),
		externalUrl: resolvedUrl,
	};

	const updatedIds: string[] = [];
	if (targetDocs && targetDocs.length > 0) {
		for (const d of targetDocs) {
			await client
				.patch(d._id)
				.setIfMissing({ sharedAssets: [] })
				.append("sharedAssets", [newAssetEntry])
				.commit();
			updatedIds.push(d._id);
		}
	} else if (resolvedToken) {
		const rawLeadId = docId || `private.sponsorLead-${resolvedToken}`;
		const fallbackLeadId = rawLeadId.startsWith("private.")
			? rawLeadId
			: `private.${rawLeadId}`;
		await client.createIfNotExists({
			_id: fallbackLeadId,
			_type: "sponsorLead",
			companyName: partnerLabel,
			contactEmail: "sponsors@codingcat.dev",
			portalToken: resolvedToken,
			source: isPassionfroot ? "passionfroot" : "booking",
			billingProvider: isPassionfroot ? "passionfroot" : "stripe",
			status: "new",
			sharedAssets: [newAssetEntry],
		});
		updatedIds.push(fallbackLeadId);
	}

	return new Response(
		JSON.stringify({
			ok: true,
			asset: newAssetEntry,
			updatedDocIds: updatedIds,
		}),
		{
			status: 200,
			headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
		},
	);
};
