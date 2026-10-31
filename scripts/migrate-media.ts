import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_MEDIA_LIBRARY_ID = "mlttp0BZbCpV";

export type MediaLibraryCategory =
	| "editorial"
	| "guest"
	| "sponsor"
	| "portal-vault";
export type MediaLibraryVisibility = "public" | "private-vault";

export interface MigrateMediaOptions {
	projectId: string;
	dataset: string;
	mediaLibraryId: string;
	sanityToken: string;
	imagesDir: string;
	filesDir: string;
	dataFilePath: string;
	assetsFilePath: string;
	stateFilePath?: string;
	isDryRun?: boolean;
	isVerbose?: boolean;
	testImageName?: string;
	includeAspects?: boolean;
}

interface SanityDocument {
	_id: string;
	_type: string;
	[key: string]: any;
}

export interface UploadResult {
	assetId: string;
	assetInstanceId: string;
}

interface AssetStateRecord {
	filename: string;
	hash: string;
	kind: "image" | "file";
	assetId: string;
	assetInstanceId: string;
	folderId?: string;
	category?: MediaLibraryCategory;
	visibility?: MediaLibraryVisibility;
	linkedDatasets: string[];
	aspectSynced?: boolean;
	patchedDocFields: string[];
	updatedAt: string;
}

interface MigrationStateFile {
	version: 1;
	mediaLibraryId: string;
	assetsByHash: Record<string, AssetStateRecord>;
}

interface AssetProcessingResult {
	filename: string;
	hash: string;
	kind: "image" | "file";
	category: MediaLibraryCategory;
	visibility: MediaLibraryVisibility;
	folderId: string;
	success: boolean;
	skippedUpload?: boolean;
	skippedLink?: boolean;
	docsPatchedCount: number;
	error?: string;
}

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

/**
 * Idempotently creates `tree.${mediaLibraryId}` and the `/Production/*` and `/Dev/*`
 * `sanity.directory` folder hierarchy inside Sanity Media Library (`mlttp0BZbCpV`).
 */
export async function bootstrapMediaLibraryFolders(
	mediaLibraryId: string,
	token: string,
	isDryRun: boolean,
	isVerbose: boolean,
): Promise<void> {
	const ids = getMediaLibraryFolderIds(mediaLibraryId);
	if (isDryRun) {
		logVerbose(
			isVerbose,
			`DRY RUN: Would ensure folder tree ${ids.treeId} with /Production/{Editorial,Guests,Sponsors,Portal-Vault} and /Dev/{Editorial,Guests,Sponsors,Portal-Vault}`,
		);
		return;
	}

	const mutations = [
		{
			createIfNotExists: {
				_id: ids.treeId,
				_type: "sanity.tree",
				name: "folders",
			},
		},
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
	if (!res.ok) {
		const errText = await res.text();
		logVerbose(
			isVerbose,
			`Warning: Could not bootstrap Media Library folders (${res.status}): ${errText}`,
		);
	} else {
		logVerbose(
			isVerbose,
			`Verified Media Library folder hierarchy under ${ids.treeId}`,
		);
	}
}

/**
 * Classifies an asset into `/Production/{Editorial,Guests,Sponsors,Portal-Vault}`
 * (or `/Dev/*`) and determines its visibility (`public` vs `private-vault`)
 * based on the referencing documents in `data.ndjson` and legacy `media.tag` values.
 */
export function classifyAssetForFolderAndAspects(params: {
	dataset: string;
	mediaLibraryId: string;
	referencingDocTypes: string[];
	referencingDocSlugs: string[];
	assetTags: string[];
}): {
	category: MediaLibraryCategory;
	visibility: MediaLibraryVisibility;
	folderId: string;
	primaryDocType: string;
	partnerSlug: string;
} {
	const {
		dataset,
		mediaLibraryId,
		referencingDocTypes,
		referencingDocSlugs,
		assetTags,
	} = params;
	const folderMap = getMediaLibraryFolderIds(mediaLibraryId);
	const envKey = dataset === "dev" ? "dev" : "production";
	const envFolders = folderMap[envKey];

	const hasPrivateTag = assetTags.some(
		(t) => t === "private-vault" || t.startsWith("private"),
	);
	const partnerTag = assetTags.find((t) => t.startsWith("partner:"));
	const partnerSlug = partnerTag
		? partnerTag.slice("partner:".length)
		: referencingDocSlugs[0] || "";

	let category: MediaLibraryCategory = "editorial";
	if (
		hasPrivateTag ||
		referencingDocTypes.includes("booking") ||
		referencingDocTypes.includes("sponsorLead")
	) {
		category = "portal-vault";
	} else if (referencingDocTypes.includes("sponsor")) {
		category = "sponsor";
	} else if (
		referencingDocTypes.includes("guest") ||
		referencingDocTypes.includes("author")
	) {
		category = "guest";
	} else {
		category = "editorial";
	}

	const visibility: MediaLibraryVisibility =
		category === "portal-vault" || hasPrivateTag ? "private-vault" : "public";

	return {
		category,
		visibility,
		folderId: envFolders[category],
		primaryDocType: referencingDocTypes[0] || "unreferenced",
		partnerSlug,
	};
}

/**
 * Lightweight zero-dependency `.env` loader so the script works with `npx tsx`
 * whether or not `dotenv` is installed in the working directory.
 */
function loadDotEnvFile(envFilePath: string): void {
	if (!fs.existsSync(envFilePath)) return;
	const raw = fs.readFileSync(envFilePath, "utf8");
	for (const line of raw.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIdx = trimmed.indexOf("=");
		if (eqIdx === -1) continue;
		const key = trimmed.slice(0, eqIdx).trim();
		let val = trimmed.slice(eqIdx + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		if (process.env[key] === undefined) {
			process.env[key] = val;
		}
	}
}

loadDotEnvFile(path.resolve(process.cwd(), ".env"));

function parseCliArgs() {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const isVerbose = args.includes("--verbose");
	const includeAspects = args.includes("--include-aspects");
	const testImageIndex = args.indexOf("--test-image");
	const testImageName =
		testImageIndex !== -1 ? args[testImageIndex + 1] : undefined;
	const BATCH_SIZE = 20;

	return {
		isDryRun,
		isVerbose,
		testImageName,
		includeAspects,
		BATCH_SIZE,
	};
}

function logVerbose(isVerbose: boolean, ...args: any[]) {
	if (isVerbose) {
		console.log(...args);
	}
}

function logStatus(isVerbose: boolean, message: string) {
	if (!isVerbose && process.stdout.isTTY) {
		process.stdout.write("\r".padEnd(process.stdout.columns || 80) + "\r");
	}
	console.log(message);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function validatePathSegment(segment: string, index: number): void {
	if (segment === undefined || segment === null || segment === "") {
		throw new Error(
			`Invalid path segment at index ${index}: segment is empty or undefined`,
		);
	}
	if (!Number.isNaN(Number(segment))) {
		return;
	}
	if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(segment)) {
		throw new Error(
			`Invalid property name at index ${index}: "${segment}" (must start with a letter or underscore and contain only alphanumeric characters and underscores)`,
		);
	}
}

export function buildFieldPath(fieldPath: string[]): string {
	if (!fieldPath || fieldPath.length === 0) {
		throw new Error("Field path cannot be empty");
	}
	fieldPath.forEach((segment, index) => validatePathSegment(segment, index));

	let built = fieldPath[0];
	for (let i = 1; i < fieldPath.length; i++) {
		const segment = fieldPath[i];
		if (/^\d+$/.test(segment) || segment.startsWith("[")) {
			built += `[${segment}]`;
		} else {
			built += `.${segment}`;
		}
	}
	return built;
}

export function findAssetReferences(
	doc: SanityDocument,
	prefix: "image@file://./images/" | "file@file://./files/",
): {
	docId: string;
	docType: string;
	docSlug: string;
	path: string;
	fieldPath: string[];
	existingMediaRef?: string;
}[] {
	const results: {
		docId: string;
		docType: string;
		docSlug: string;
		path: string;
		fieldPath: string[];
		existingMediaRef?: string;
	}[] = [];

	const docSlug =
		typeof doc.slug?.current === "string"
			? doc.slug.current
			: typeof doc.portalToken === "string"
				? doc.portalToken
				: "";

	function traverse(obj: any, currentPath: string[] = []) {
		if (!obj || typeof obj !== "object") return;

		if (
			typeof obj._sanityAsset === "string" &&
			obj._sanityAsset.startsWith(prefix)
		) {
			const assetRelPath = obj._sanityAsset.slice(prefix.length);
			const existingMediaRef =
				obj.media &&
				obj.media._type === "globalDocumentReference" &&
				typeof obj.media._ref === "string"
					? obj.media._ref
					: undefined;
			results.push({
				docId: doc._id,
				docType: doc._type || "unknown",
				docSlug,
				path: assetRelPath,
				fieldPath: [...currentPath],
				existingMediaRef,
			});
		}

		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === "object" && value !== null) {
				traverse(value, [...currentPath, key]);
			}
		}
	}

	traverse(doc);
	return results;
}

function verifyFile(filePath: string): { exists: boolean; size: number } {
	try {
		if (!fs.existsSync(filePath)) {
			return { exists: false, size: 0 };
		}
		const stats = fs.statSync(filePath);
		return { exists: true, size: stats.size };
	} catch (error: any) {
		console.error(
			`Error verifying file ${filePath}: ${error?.message || error}`,
		);
		return { exists: false, size: 0 };
	}
}

/**
 * Rate limiter enforcing both a maximum requests-per-second rate (25 req/s)
 * and a maximum concurrent in-flight limit (25 concurrent requests).
 */
export class RateLimiter {
	private queue: (() => Promise<void>)[] = [];
	private processing = false;
	private lastRequestTime = 0;
	private activeRequests = 0;

	constructor(
		private requestsPerSecond = 25,
		private maxConcurrent = 25,
	) {}

	async enqueue<T>(fn: () => Promise<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.queue.push(async () => {
				try {
					this.activeRequests++;
					const result = await fn();
					this.activeRequests--;
					resolve(result);
				} catch (error) {
					this.activeRequests--;
					reject(error);
				}
			});
			void this.processQueue();
		});
	}

	private async processQueue(): Promise<void> {
		if (this.processing) return;
		this.processing = true;

		const minTimeBetweenRequests = 1000 / this.requestsPerSecond;

		while (this.queue.length > 0) {
			if (this.activeRequests >= this.maxConcurrent) {
				await sleep(25);
				continue;
			}

			const now = Date.now();
			const elapsed = now - this.lastRequestTime;
			if (elapsed < minTimeBetweenRequests) {
				await sleep(minTimeBetweenRequests - elapsed);
			}

			const nextTask = this.queue.shift();
			if (!nextTask) break;
			this.lastRequestTime = Date.now();
			void nextTask();
		}

		this.processing = false;
	}
}

/**
 * Persistent state helper for idempotency across re-runs.
 */
function loadMigrationState(
	stateFilePath: string,
	mediaLibraryId: string,
): MigrationStateFile {
	try {
		if (fs.existsSync(stateFilePath)) {
			const parsed = JSON.parse(
				fs.readFileSync(stateFilePath, "utf8"),
			) as MigrationStateFile;
			if (
				parsed &&
				parsed.version === 1 &&
				parsed.mediaLibraryId === mediaLibraryId &&
				parsed.assetsByHash
			) {
				return parsed;
			}
		}
	} catch {
		// Fall back to fresh state if unreadable
	}
	return {
		version: 1,
		mediaLibraryId,
		assetsByHash: {},
	};
}

function saveMigrationState(
	stateFilePath: string,
	state: MigrationStateFile,
	isDryRun: boolean,
): void {
	if (isDryRun) return;
	const tmpPath = `${stateFilePath}.tmp`;
	fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2), "utf8");
	fs.renameSync(tmpPath, stateFilePath);
}

/**
 * Step 1: Upload image/file to Sanity Media Library:
 * POST https://api.sanity.io/v2024-06-24/media-libraries/{mediaLibraryId}/upload?filename=<name>&autoGenerateTitle=true&parent=<folderId>
 */
async function uploadAsset(
	mediaLibraryId: string,
	token: string,
	assetPath: string,
	folderId: string,
	isVerbose: boolean,
): Promise<UploadResult> {
	const baseUrl = `https://api.sanity.io/v2024-06-24/media-libraries/${mediaLibraryId}/upload`;
	const filename = path.basename(assetPath);

	const fileInfo = verifyFile(assetPath);
	if (!fileInfo.exists) {
		throw new Error(`File not found: ${assetPath}`);
	}
	if (fileInfo.size === 0) {
		throw new Error(`File is empty: ${assetPath}`);
	}

	const queryParams = new URLSearchParams({
		filename,
		autoGenerateTitle: "true",
		...(folderId ? { parent: folderId } : {}),
	}).toString();
	const url = `${baseUrl}?${queryParams}`;

	logVerbose(isVerbose, "Uploading asset:", {
		mediaLibraryId,
		folderId,
		assetPath,
		url,
	});

	const body = fs.readFileSync(assetPath);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Bearer ${token}`,
		},
		body,
	});

	const responseText = await response.text();
	if (!response.ok) {
		throw new Error(
			`Upload HTTP Error: ${response.status} ${response.statusText} (${responseText})`,
		);
	}

	let parsedResponse: any;
	try {
		parsedResponse = JSON.parse(responseText);
	} catch (parseError: any) {
		throw new Error(
			`Failed to parse upload response: ${parseError?.message} (${responseText})`,
		);
	}

	const assetId = parsedResponse?.asset?._id;
	const assetInstanceId = parsedResponse?.assetInstance?._id;

	if (!assetId || !assetInstanceId) {
		throw new Error(
			`Required ID(s) missing in upload response (assetId=${assetId}, assetInstanceId=${assetInstanceId}): ${responseText}`,
		);
	}

	logVerbose(
		isVerbose,
		`Uploaded ${filename} into ${folderId} -> assetId: ${assetId}, assetInstanceId: ${assetInstanceId}`,
	);
	return { assetId, assetInstanceId };
}

/**
 * Step 2: Link Media Library asset to dataset:
 * POST https://{projectId}.api.sanity.io/v2025-02-19/assets/media-library-link/{dataset}
 * Retries with exponential backoff (1s -> 2s -> 4s -> 8s -> 16s -> 32s, max 6 retries)
 * while the Media Library asset is not ready.
 */
async function linkMediaLibraryAsset(
	token: string,
	projectId: string,
	dataset: string,
	mediaLibraryId: string,
	assetInstanceId: string,
	assetId: string,
	isVerbose: boolean,
): Promise<any> {
	const baseUrl = `https://${projectId}.api.sanity.io/v2025-02-19/assets/media-library-link/${dataset}`;
	const maxRetries = 6; // 1s, 2s, 4s, 8s, 16s, 32s
	const baseDelay = 1000;
	const maxBackoffDelay = 32000;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			logVerbose(
				isVerbose,
				`Linking Media Library asset (attempt ${attempt + 1}/${maxRetries + 1}):`,
				{
					url: baseUrl,
					mediaLibraryId,
					assetId,
					assetInstanceId,
				},
			);

			const response = await fetch(baseUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					mediaLibraryId,
					assetInstanceId,
					assetId,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				const isNotReady =
					errorText.includes("Media library asset is not ready") ||
					errorText.includes("not ready") ||
					response.status === 409 ||
					response.status === 425 ||
					response.status === 503;

				if (isNotReady && attempt < maxRetries) {
					const delay = Math.min(baseDelay * 2 ** attempt, maxBackoffDelay);
					logVerbose(
						isVerbose,
						`Asset ${assetId} not ready yet; retrying in ${delay}ms (retry ${attempt + 1}/${maxRetries})`,
					);
					await sleep(delay);
					continue;
				}

				throw new Error(
					`Link HTTP Error: ${response.status} ${response.statusText} (${errorText})`,
				);
			}

			const result = await response.json();
			logVerbose(
				isVerbose,
				`Linked asset ${assetId} on attempt ${attempt + 1}`,
			);
			return result;
		} catch (error: any) {
			const msg = String(error?.message || error);
			const isTransientNetwork =
				msg.includes("fetch") ||
				msg.includes("network") ||
				msg.includes("ECONNRESET") ||
				msg.includes("ETIMEDOUT");

			if (isTransientNetwork && attempt < maxRetries) {
				const delay = Math.min(baseDelay * 2 ** attempt, maxBackoffDelay);
				logVerbose(
					isVerbose,
					`Transient network error while linking ${assetId}; retrying in ${delay}ms (retry ${attempt + 1}/${maxRetries}): ${msg}`,
				);
				await sleep(delay);
				continue;
			}

			throw new Error(
				`Failed to link Media Library asset (ID: ${assetId}): ${msg}`,
			);
		}
	}

	throw new Error(
		`Failed to link Media Library asset (ID: ${assetId}): Maximum retry attempts (${maxRetries}) exceeded`,
	);
}

/**
 * Parse NDJSON file line-by-line using Node's native readline interface.
 */
async function readNdjsonFile(filePath: string): Promise<SanityDocument[]> {
	const docs: SanityDocument[] = [];
	const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	for await (const line of rl) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		docs.push(JSON.parse(trimmed) as SanityDocument);
	}
	return docs;
}

/**
 * Process a single image or file through:
 * 1. Classify target folder (`/Production/*` vs `/Dev/*`) and visibility (`public` vs `private-vault`)
 * 2. Upload with `?parent=<folderId>` (idempotent via state cache)
 * 3. Link to dataset with exponential backoff (idempotent via state cache)
 * 4. Scan data.ndjson references and patch `.media` GDR in batches of 10
 * 5. Optional `--include-aspects`: patch `aspects.metadata`
 */
async function processSingleAsset(params: {
	kind: "image" | "file";
	filename: string;
	index: number;
	totalInRun: number;
	assetDir: string;
	mediaLibraryId: string;
	sanityToken: string;
	projectId: string;
	dataset: string;
	documentUpdateLimiter: RateLimiter;
	mediaLibraryLimiter: RateLimiter;
	aspectUpdateLimiter: RateLimiter;
	parsedDocuments: SanityDocument[];
	parsedAssets: Record<string, any>;
	tags: Map<string, string>;
	state: MigrationStateFile;
	stateFilePath: string;
	isDryRun: boolean;
	isVerbose: boolean;
	includeAspects: boolean;
}): Promise<AssetProcessingResult> {
	const {
		kind,
		filename,
		index,
		totalInRun,
		assetDir,
		mediaLibraryId,
		sanityToken,
		projectId,
		dataset,
		documentUpdateLimiter,
		mediaLibraryLimiter,
		aspectUpdateLimiter,
		parsedDocuments,
		parsedAssets,
		tags,
		state,
		stateFilePath,
		isDryRun,
		isVerbose,
		includeAspects,
	} = params;

	const hash = filename.split("-")[0].split(".")[0];
	const progressLabel = `(${index + 1}/${totalInRun})`;

	// Pre-scan references and legacy tags so we know which folder and aspect classification this asset belongs to
	const prefix =
		kind === "image" ? "image@file://./images/" : "file@file://./files/";
	const allMatchingRefs: {
		docId: string;
		docType: string;
		docSlug: string;
		fieldPath: string[];
		existingMediaRef?: string;
	}[] = [];

	for (const doc of parsedDocuments) {
		const refs = findAssetReferences(doc, prefix);
		const matches = refs.filter((ref) => ref.path.startsWith(hash));
		for (const match of matches) {
			allMatchingRefs.push(match);
		}
	}

	const legacyAsset =
		parsedAssets[`${kind}-${hash}`] ||
		parsedAssets[`image-${hash}`] ||
		parsedAssets[`file-${hash}`];
	const assetTags = (
		legacyAsset?.opt?.media?.tags
			?.map((tag: any) => tags.get(tag._ref))
			.filter(Boolean) || []
	) as string[];

	const classification = classifyAssetForFolderAndAspects({
		dataset,
		mediaLibraryId,
		referencingDocTypes: Array.from(
			new Set(allMatchingRefs.map((r) => r.docType)),
		),
		referencingDocSlugs: Array.from(
			new Set(allMatchingRefs.map((r) => r.docSlug).filter(Boolean)),
		),
		assetTags,
	});

	const result: AssetProcessingResult = {
		filename,
		hash,
		kind,
		category: classification.category,
		visibility: classification.visibility,
		folderId: classification.folderId,
		success: false,
		docsPatchedCount: 0,
	};

	try {
		logVerbose(
			isVerbose,
			`\nProcessing ${kind} ${filename} ${progressLabel} -> folder=${classification.folderId} (${classification.category}/${classification.visibility})`,
		);
		const filepath = path.resolve(assetDir, filename);

		// Check idempotency state from previous runs
		let stateEntry = state.assetsByHash[hash];
		let uploadResult: UploadResult | undefined = stateEntry
			? {
					assetId: stateEntry.assetId,
					assetInstanceId: stateEntry.assetInstanceId,
				}
			: undefined;

		// 1. Upload Step
		if (uploadResult) {
			result.skippedUpload = true;
			logVerbose(
				isVerbose,
				`Idempotent skip upload ${progressLabel}: ${filename} already uploaded as ${uploadResult.assetId}`,
			);
		} else if (isDryRun) {
			uploadResult = {
				assetId: `dry-run-asset-${hash}`,
				assetInstanceId: `${kind}-${hash}-dryrun`,
			};
			logVerbose(
				isVerbose,
				`DRY RUN ${progressLabel}: Would upload ${filename} to Media Library ${mediaLibraryId} in folder ${classification.folderId} with autoGenerateTitle=true`,
			);
		} else {
			uploadResult = await mediaLibraryLimiter.enqueue(() =>
				uploadAsset(
					mediaLibraryId,
					sanityToken,
					filepath,
					classification.folderId,
					isVerbose,
				),
			);
			stateEntry = {
				filename,
				hash,
				kind,
				assetId: uploadResult.assetId,
				assetInstanceId: uploadResult.assetInstanceId,
				folderId: classification.folderId,
				category: classification.category,
				visibility: classification.visibility,
				linkedDatasets: [],
				aspectSynced: false,
				patchedDocFields: [],
				updatedAt: new Date().toISOString(),
			};
			state.assetsByHash[hash] = stateEntry;
			saveMigrationState(stateFilePath, state, isDryRun);
		}

		const { assetId, assetInstanceId } = uploadResult;

		// 2. Link Step
		const alreadyLinked = Boolean(
			stateEntry?.linkedDatasets?.includes(dataset),
		);
		if (alreadyLinked) {
			result.skippedLink = true;
			logVerbose(
				isVerbose,
				`Idempotent skip link ${progressLabel}: ${filename} (${assetId}) already linked to dataset ${dataset}`,
			);
		} else if (isDryRun) {
			logVerbose(
				isVerbose,
				`DRY RUN ${progressLabel}: Would link ${filename} (assetId=${assetId}, assetInstanceId=${assetInstanceId}) to dataset ${dataset}`,
			);
		} else {
			await mediaLibraryLimiter.enqueue(() =>
				linkMediaLibraryAsset(
					sanityToken,
					projectId,
					dataset,
					mediaLibraryId,
					assetInstanceId,
					assetId,
					isVerbose,
				),
			);
			if (stateEntry) {
				if (!stateEntry.linkedDatasets.includes(dataset)) {
					stateEntry.linkedDatasets.push(dataset);
				}
				stateEntry.updatedAt = new Date().toISOString();
				saveMigrationState(stateFilePath, state, isDryRun);
			}
		}

		// 3. Patch unpatched document references in batches of 10
		const expectedGdrRef = `media-library:${mediaLibraryId}:${assetId}`;
		const matchingDocs: { docId: string; fieldPath: string[] }[] = [];

		for (const match of allMatchingRefs) {
			const fieldKey = `${match.docId}::${buildFieldPath(match.fieldPath)}.media`;
			const alreadyPatchedInExport = match.existingMediaRef === expectedGdrRef;
			const alreadyPatchedInState = Boolean(
				stateEntry?.patchedDocFields?.includes(fieldKey),
			);
			if (alreadyPatchedInExport || alreadyPatchedInState) {
				logVerbose(
					isVerbose,
					`Idempotent skip patch: ${fieldKey} already points to ${expectedGdrRef}`,
				);
				continue;
			}
			matchingDocs.push({ docId: match.docId, fieldPath: match.fieldPath });
		}

		logVerbose(
			isVerbose,
			`Found ${matchingDocs.length} unpatched document reference(s) for ${filename}.`,
		);

		if (isDryRun) {
			logVerbose(
				isVerbose,
				`DRY RUN ${progressLabel}: Would patch ${matchingDocs.length} document reference(s) in batches of 10 for ${filename}`,
			);
			result.docsPatchedCount = matchingDocs.length;
		} else if (matchingDocs.length > 0) {
			const docBatchSize = 10;
			let failedBatchCount = 0;

			for (let i = 0; i < matchingDocs.length; i += docBatchSize) {
				const batch = matchingDocs.slice(i, i + docBatchSize);
				const mutations = batch.map((doc) => ({
					patch: {
						id: doc.docId,
						set: {
							[`${buildFieldPath(doc.fieldPath)}.media`]: {
								_type: "globalDocumentReference",
								_ref: expectedGdrRef,
								_weak: true,
							},
						},
					},
				}));

				const mutateUrl = `https://${projectId}.api.sanity.io/v2025-02-19/data/mutate/${dataset}`;

				await documentUpdateLimiter.enqueue(async () => {
					try {
						const response = await fetch(mutateUrl, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${sanityToken}`,
							},
							body: JSON.stringify({ mutations }),
						});

						if (!response.ok) {
							const errorBody = await response.text();
							logVerbose(
								isVerbose,
								"Failed to update document batch:",
								errorBody,
							);
							failedBatchCount++;
							return;
						}

						result.docsPatchedCount += batch.length;
						if (stateEntry) {
							for (const item of batch) {
								const key = `${item.docId}::${buildFieldPath(item.fieldPath)}.media`;
								if (!stateEntry.patchedDocFields.includes(key)) {
									stateEntry.patchedDocFields.push(key);
								}
							}
							stateEntry.updatedAt = new Date().toISOString();
							saveMigrationState(stateFilePath, state, isDryRun);
						}

						logVerbose(
							isVerbose,
							`Patched batch of ${batch.length} document(s) for ${filename}`,
						);
					} catch (fetchError: any) {
						logVerbose(
							isVerbose,
							"Error during document batch patch:",
							fetchError?.message || fetchError,
						);
						failedBatchCount++;
					}
				});
			}

			if (failedBatchCount > 0) {
				throw new Error(
					`${failedBatchCount} document mutation batch(es) failed for ${filename}`,
				);
			}
		}

		// 4. Optional: Copy Media Plugin metadata + environment/folder classification into `aspects.metadata`
		if (includeAspects) {
			if (stateEntry?.aspectSynced) {
				logVerbose(
					isVerbose,
					`Idempotent skip aspect ${progressLabel}: aspects.metadata already synced for ${filename}`,
				);
			} else {
				const metadataPayload = {
					environment: dataset === "dev" ? "dev" : "production",
					visibility: classification.visibility,
					category: classification.category,
					partnerSlug: classification.partnerSlug,
					docType: classification.primaryDocType,
					title: legacyAsset?.title || "",
					description: legacyAsset?.description || "",
					tags: assetTags,
					creditLine: legacyAsset?.creditLine || "",
					altText: legacyAsset?.altText || "",
					originalFilename: legacyAsset?.originalFilename || filename,
				};

				if (isDryRun) {
					logVerbose(
						isVerbose,
						`DRY RUN ${progressLabel}: Would patch aspects.metadata on ${assetId}:`,
						metadataPayload,
					);
				} else {
					const mutations = JSON.stringify({
						mutations: [
							{
								patch: {
									id: assetId,
									setIfMissing: { aspects: {} },
									set: {
										"aspects.metadata": metadataPayload,
										parent: {
											_type: "reference",
											_ref: classification.folderId,
										},
									},
								},
							},
						],
					});

					await aspectUpdateLimiter.enqueue(async () => {
						const url = `https://api.sanity.io/v2024-06-24/media-libraries/${mediaLibraryId}/mutate`;
						const response = await fetch(url, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${sanityToken}`,
							},
							body: mutations,
						});
						if (!response.ok) {
							const errorText = await response.text();
							throw new Error(
								`Failed to update aspects.metadata for ${filename}: ${response.status} ${errorText}`,
							);
						}
						if (stateEntry) {
							stateEntry.aspectSynced = true;
							stateEntry.updatedAt = new Date().toISOString();
							saveMigrationState(stateFilePath, state, isDryRun);
						}
						logVerbose(
							isVerbose,
							`Updated aspects.metadata for ${filename} (${assetId})`,
						);
					});
				}
			}
		}

		result.success = true;
		return result;
	} catch (error: any) {
		result.error = error?.message || String(error);
		logVerbose(isVerbose, `Error processing ${filename}: ${result.error}`);
		return result;
	}
}

export async function migrateMedia(
	options: MigrateMediaOptions,
): Promise<void> {
	const {
		projectId,
		dataset,
		mediaLibraryId = DEFAULT_MEDIA_LIBRARY_ID,
		sanityToken,
		imagesDir,
		filesDir,
		dataFilePath,
		assetsFilePath,
		stateFilePath = path.resolve(
			path.dirname(dataFilePath),
			`.media-migration-state-${dataset}.json`,
		),
		isDryRun = false,
		isVerbose = false,
		testImageName,
		includeAspects = false,
	} = options;

	if (!sanityToken || sanityToken.trim() === "") {
		throw new Error(
			"SANITY_TOKEN not provided. Run 'npx sanity debug --secrets' or set SANITY_TOKEN in .env.",
		);
	}
	if (!mediaLibraryId || mediaLibraryId.trim() === "") {
		throw new Error(
			"SANITY_MEDIA_LIBRARY_ID is not set. Define it in your .env file.",
		);
	}
	if (!projectId || projectId.trim() === "") {
		throw new Error("SANITY_PROJECT_ID is not set. Define it in your .env file.");
	}
	if (!dataset || dataset.trim() === "") {
		throw new Error(
			"SANITY_SOURCE_DATASET is not set. Define it in your .env file.",
		);
	}
	if (!dataFilePath || !fs.existsSync(dataFilePath)) {
		throw new Error(`DATA_FILE_PATH not found: ${dataFilePath}`);
	}
	if (!assetsFilePath || !fs.existsSync(assetsFilePath)) {
		throw new Error(`ASSETS_FILE_PATH not found: ${assetsFilePath}`);
	}

	const hasImagesDir = Boolean(imagesDir && fs.existsSync(imagesDir));
	const hasFilesDir = Boolean(filesDir && fs.existsSync(filesDir));

	if (!hasImagesDir && !hasFilesDir) {
		throw new Error(
			`Neither IMAGES_DIR (${imagesDir}) nor FILES_DIR (${filesDir}) exists.`,
		);
	}

	logStatus(isVerbose, `Project ID:       ${projectId}`);
	logStatus(isVerbose, `Source Dataset:   ${dataset}`);
	logStatus(isVerbose, `Media Library ID: ${mediaLibraryId}`);
	logStatus(isVerbose, `Data File:        ${dataFilePath}`);
	logStatus(isVerbose, `Assets File:      ${assetsFilePath}`);
	logStatus(isVerbose, `State File:       ${stateFilePath}`);

	// Bootstrap `/Production/*` and `/Dev/*` folders in Media Library
	await bootstrapMediaLibraryFolders(
		mediaLibraryId,
		sanityToken,
		isDryRun,
		isVerbose,
	);

	// Rate limiters: 25 requests/second, 25 max concurrent
	const mediaLibraryLimiter = new RateLimiter(25, 25);
	const documentUpdateLimiter = new RateLimiter(25, 25);
	const aspectUpdateLimiter = new RateLimiter(25, 25);

	// Load idempotency state file
	const state = loadMigrationState(stateFilePath, mediaLibraryId);

	// Load NDJSON documents
	const parsedDocuments = await readNdjsonFile(dataFilePath);
	logStatus(
		isVerbose,
		`Loaded ${parsedDocuments.length} document(s) from ${path.basename(dataFilePath)}.`,
	);

	// Load assets.json
	const parsedAssets: Record<string, any> = JSON.parse(
		fs.readFileSync(assetsFilePath, "utf8"),
	);

	// Collect `media.tag` documents from the export for `--include-aspects`
	const tags = new Map<string, string>();
	for (const doc of parsedDocuments) {
		if (doc._type === "media.tag" && doc.name?.current) {
			tags.set(doc._id, doc.name.current);
		}
	}

	const allImageFiles = hasImagesDir
		? fs
				.readdirSync(imagesDir)
				.filter((f) => !f.startsWith("."))
				.sort()
		: [];
	const allFileFiles = hasFilesDir
		? fs
				.readdirSync(filesDir)
				.filter((f) => !f.startsWith("."))
				.sort()
		: [];

	logStatus(
		isVerbose,
		`Found ${allImageFiles.length} image(s) and ${allFileFiles.length} file(s) in export archive.`,
	);

	let imageFilesToProcess = allImageFiles;
	let fileFilesToProcess = allFileFiles;

	if (testImageName) {
		const matchedImage = allImageFiles.find((f) => f === testImageName);
		const matchedFile = allFileFiles.find((f) => f === testImageName);
		if (!matchedImage && !matchedFile) {
			throw new Error(
				`--test-image "${testImageName}" was not found in ${imagesDir} or ${filesDir}`,
			);
		}
		imageFilesToProcess = matchedImage ? [matchedImage] : [];
		fileFilesToProcess = matchedFile ? [matchedFile] : [];
		logStatus(
			isVerbose,
			`--test-image specified: processing only "${testImageName}"`,
		);
	}

	const BATCH_SIZE = 20;
	const BATCH_PAUSE_MS = 500;

	let overallProcessedCount = 0;
	let overallErrorCount = 0;
	let overallDocsPatched = 0;
	const folderBreakdown: Record<string, number> = {};

	// Process images in batches of 20 with a 500ms pause between batches
	const totalImageBatches = Math.ceil(imageFilesToProcess.length / BATCH_SIZE);
	for (let batchIndex = 0; batchIndex < totalImageBatches; batchIndex++) {
		const batchStart = batchIndex * BATCH_SIZE;
		const currentBatch = imageFilesToProcess.slice(
			batchStart,
			batchStart + BATCH_SIZE,
		);
		const batchNumber = batchIndex + 1;

		const results = await Promise.all(
			currentBatch.map((filename, idx) =>
				processSingleAsset({
					kind: "image",
					filename,
					index: batchStart + idx,
					totalInRun: imageFilesToProcess.length,
					assetDir: imagesDir,
					mediaLibraryId,
					sanityToken,
					projectId,
					dataset,
					documentUpdateLimiter,
					mediaLibraryLimiter,
					aspectUpdateLimiter,
					parsedDocuments,
					parsedAssets,
					tags,
					state,
					stateFilePath,
					isDryRun,
					isVerbose,
					includeAspects,
				}),
			),
		);

		const succeeded = results.filter((r) => r.success);
		const failed = results.filter((r) => !r.success);
		overallProcessedCount += succeeded.length;
		overallErrorCount += failed.length;
		for (const r of succeeded) {
			folderBreakdown[r.folderId] = (folderBreakdown[r.folderId] || 0) + 1;
		}
		overallDocsPatched += results.reduce(
			(acc, r) => acc + r.docsPatchedCount,
			0,
		);

		logStatus(
			isVerbose,
			`Image Batch ${batchNumber}/${totalImageBatches} ${isDryRun ? "simulated" : "completed"}: ${succeeded.length}/${currentBatch.length} succeeded`,
		);

		if (failed.length > 0) {
			for (const f of failed) {
				logStatus(isVerbose, `  - [ERROR] ${f.filename}: ${f.error}`);
			}
		}

		if (batchIndex < totalImageBatches - 1 && !isDryRun) {
			await sleep(BATCH_PAUSE_MS);
		}
	}

	// Process files in batches of 20 with a 500ms pause between batches
	const totalFileBatches = Math.ceil(fileFilesToProcess.length / BATCH_SIZE);
	for (let batchIndex = 0; batchIndex < totalFileBatches; batchIndex++) {
		const batchStart = batchIndex * BATCH_SIZE;
		const currentBatch = fileFilesToProcess.slice(
			batchStart,
			batchStart + BATCH_SIZE,
		);
		const batchNumber = batchIndex + 1;

		const results = await Promise.all(
			currentBatch.map((filename, idx) =>
				processSingleAsset({
					kind: "file",
					filename,
					index: batchStart + idx,
					totalInRun: fileFilesToProcess.length,
					assetDir: filesDir,
					mediaLibraryId,
					sanityToken,
					projectId,
					dataset,
					documentUpdateLimiter,
					mediaLibraryLimiter,
					aspectUpdateLimiter,
					parsedDocuments,
					parsedAssets,
					tags,
					state,
					stateFilePath,
					isDryRun,
					isVerbose,
					includeAspects,
				}),
			),
		);

		const succeeded = results.filter((r) => r.success);
		const failed = results.filter((r) => !r.success);
		overallProcessedCount += succeeded.length;
		overallErrorCount += failed.length;
		for (const r of succeeded) {
			folderBreakdown[r.folderId] = (folderBreakdown[r.folderId] || 0) + 1;
		}
		overallDocsPatched += results.reduce(
			(acc, r) => acc + r.docsPatchedCount,
			0,
		);

		logStatus(
			isVerbose,
			`File Batch ${batchNumber}/${totalFileBatches} ${isDryRun ? "simulated" : "completed"}: ${succeeded.length}/${currentBatch.length} succeeded`,
		);

		if (failed.length > 0) {
			for (const f of failed) {
				logStatus(isVerbose, `  - [ERROR] ${f.filename}: ${f.error}`);
			}
		}

		if (batchIndex < totalFileBatches - 1 && !isDryRun) {
			await sleep(BATCH_PAUSE_MS);
		}
	}

	logStatus(isVerbose, "\n--- Sanity Media Library Migration Summary ---");
	logStatus(
		isVerbose,
		`Mode:                              ${isDryRun ? "DRY RUN (no writes performed)" : "LIVE"}`,
	);
	logStatus(
		isVerbose,
		`Media Library ID:                  ${mediaLibraryId}`,
	);
	logStatus(
		isVerbose,
		`Source Dataset:                    ${dataset}`,
	);
	logStatus(
		isVerbose,
		`Images discovered in archive:      ${allImageFiles.length}`,
	);
	logStatus(
		isVerbose,
		`Files discovered in archive:       ${allFileFiles.length}`,
	);
	logStatus(
		isVerbose,
		`Images processed in this run:      ${imageFilesToProcess.length}`,
	);
	logStatus(
		isVerbose,
		`Files processed in this run:       ${fileFilesToProcess.length}`,
	);
	logStatus(
		isVerbose,
		`Assets succeeded in this run:      ${overallProcessedCount}`,
	);
	logStatus(
		isVerbose,
		`Document field refs ${isDryRun ? "to patch" : "patched"}:      ${overallDocsPatched}`,
	);
	logStatus(isVerbose, "\nFolder Routing Breakdown:");
	for (const [folderId, count] of Object.entries(folderBreakdown)) {
		logStatus(isVerbose, `  • ${folderId.padEnd(30)} ${count} asset(s)`);
	}
	if (overallErrorCount > 0) {
		logStatus(
			isVerbose,
			`Assets with errors in this run:    ${overallErrorCount}`,
		);
	}
}

// Execute when invoked directly via `tsx`
const isDirectRun =
	process.argv[1] &&
	path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectRun) {
	const args = parseCliArgs();

	if (args.isDryRun) {
		logStatus(args.isVerbose, "\n=== DRY RUN MODE ===");
		logStatus(
			args.isVerbose,
			"No writes will be sent to Sanity Media Library or the dataset.\n",
		);
	}

	const sanityToken = process.env.SANITY_TOKEN || "";
	const projectId = process.env.SANITY_PROJECT_ID || "hfh83o0w";
	const dataset = process.env.SANITY_SOURCE_DATASET || "production";
	const mediaLibraryId =
		process.env.SANITY_MEDIA_LIBRARY_ID || DEFAULT_MEDIA_LIBRARY_ID;

	const imagesDir = process.env.IMAGES_DIR
		? path.resolve(process.env.IMAGES_DIR)
		: path.resolve(__dirname, "export", "images");
	const filesDir = process.env.FILES_DIR
		? path.resolve(process.env.FILES_DIR)
		: path.resolve(__dirname, "export", "files");
	const dataFilePath = process.env.DATA_FILE_PATH
		? path.resolve(process.env.DATA_FILE_PATH)
		: path.resolve(__dirname, "export", "data.ndjson");
	const assetsFilePath = process.env.ASSETS_FILE_PATH
		? path.resolve(process.env.ASSETS_FILE_PATH)
		: path.resolve(__dirname, "export", "assets.json");

	migrateMedia({
		projectId,
		dataset,
		mediaLibraryId,
		sanityToken,
		imagesDir,
		filesDir,
		dataFilePath,
		assetsFilePath,
		isDryRun: args.isDryRun,
		isVerbose: args.isVerbose,
		testImageName: args.testImageName,
		includeAspects: args.includeAspects,
	}).catch((error: any) => {
		console.error("\n--- MIGRATION SCRIPT ERROR ---");
		console.error(error?.message || error);
		process.exit(1);
	});
}
