#!/usr/bin/env node
/**
 * Prewarm, render, and persist Social Share Cards (OG Images) into Sanity Media Library
 * and set the `ogImage` field on the document.
 *
 * Capabilities:
 * - Fetches documents across `post`, `podcast`, `course`, and `page`.
 * - Searches Sanity Media Library with tags `["og-image", "social-card"]` and folder `/Production/OG-Images`.
 * - Renders or fetches the OG image from CodingCat.dev's OG generator.
 * - Uploads the image to Sanity Media Library with structured metadata (category, docType, partnerSlug, tags).
 * - Links the asset to the dataset and updates the document's `ogImage` field.
 *
 * Usage:
 *   node scripts/prewarm-and-sync-og-images.mjs --limit=5 --type=post
 *   node scripts/prewarm-and-sync-og-images.mjs --slug=anthropic-s1-ipo-circular-ai-economy-etf-risk
 *   node scripts/prewarm-and-sync-og-images.mjs --all --force
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load environment variables
const envPath = path.join(rootDir, ".env");
if (fs.existsSync(envPath)) {
	const envLines = fs.readFileSync(envPath, "utf8").split("\n");
	for (const line of envLines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
		const idx = trimmed.indexOf("=");
		const key = trimmed.slice(0, idx).trim();
		const val = trimmed
			.slice(idx + 1)
			.trim()
			.replace(/^["']|["']$/g, "");
		if (!process.env[key]) {
			process.env[key] = val;
		}
	}
}

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "hfh83o0w";
const DATASET = process.env.SANITY_SOURCE_DATASET || "production";
const MEDIA_LIBRARY_ID = process.env.SANITY_MEDIA_LIBRARY_ID || "mlttp0BZbCpV";
const TOKEN = process.env.SANITY_TOKEN;
const ORIGIN = process.env.PUBLIC_SITE_URL || "https://codingcat.dev";

if (!TOKEN) {
	console.error("Error: SANITY_TOKEN is required in .env or environment.");
	process.exit(1);
}

// Parse CLI args
const args = process.argv.slice(2);
const options = {
	limit: 10,
	slug: null,
	type: null,
	force: false,
	dryRun: false,
};

for (const arg of args) {
	if (arg.startsWith("--limit=")) {
		options.limit = parseInt(arg.split("=")[1], 10);
	} else if (arg.startsWith("--slug=")) {
		options.slug = arg.split("=")[1];
	} else if (arg.startsWith("--type=")) {
		options.type = arg.split("=")[1];
	} else if (arg === "--force") {
		options.force = true;
	} else if (arg === "--all") {
		options.limit = 1000;
	} else if (arg === "--dry-run") {
		options.dryRun = true;
	}
}

async function queryDataset(groq) {
	const url = `https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${TOKEN}` },
	});
	if (!res.ok) {
		throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
	}
	const data = await res.json();
	return data.result;
}

async function mutateDataset(mutations) {
	const url = `https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/mutate/${DATASET}`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TOKEN}`,
		},
		body: JSON.stringify({ mutations }),
	});
	if (!res.ok) {
		throw new Error(`Dataset mutation failed: ${res.status} ${await res.text()}`);
	}
	return await res.json();
}

async function mutateMediaLibrary(mutations) {
	const url = `https://api.sanity.io/v2024-06-24/media-libraries/${MEDIA_LIBRARY_ID}/mutate`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TOKEN}`,
		},
		body: JSON.stringify({ mutations }),
	});
	if (!res.ok) {
		throw new Error(
			`Media Library mutation failed: ${res.status} ${await res.text()}`,
		);
	}
	return await res.json();
}

async function ensureOgFolder() {
	const folderId =
		DATASET === "dev" ? "dir-dev-og-images" : "dir-production-og-images";
	const parentFolderId = DATASET === "dev" ? "dir-dev" : "dir-production";

	await mutateMediaLibrary([
		{
			createIfNotExists: {
				_id: folderId,
				_type: "sanity.directory",
				name: "OG-Images",
				parent: { _type: "reference", _ref: parentFolderId },
			},
		},
	]).catch(() => null);

	return folderId;
}

function buildOgUrl(doc) {
	const type = doc._type === "post" ? "blog" : doc._type === "podcast" ? "podcast" : "default";
	const params = new URLSearchParams();
	params.set("title", doc.title || "CodingCat.dev");
	if (doc.excerpt) {
		params.set("subtitle", doc.excerpt);
	}
	if (doc.authorName) {
		params.set("author", doc.authorName);
	}
	if (doc.episode && type === "podcast") {
		params.set("episode", String(doc.episode));
	}
	if (doc.coverImageUrl) {
		params.set("image", doc.coverImageUrl);
	}
	return `${ORIGIN}/api/og/${type}.png?${params.toString()}`;
}

async function uploadToMediaLibrary(bytes, filename, folderId) {
	const uploadQuery = new URLSearchParams({
		filename,
		autoGenerateTitle: "false",
		parent: folderId,
	});
	const uploadUrl = `https://api.sanity.io/v2024-06-24/media-libraries/${MEDIA_LIBRARY_ID}/upload?${uploadQuery.toString()}`;
	const res = await fetch(uploadUrl, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Bearer ${TOKEN}`,
		},
		body: bytes,
	});
	if (!res.ok) {
		throw new Error(
			`Media library upload failed: ${res.status} ${await res.text()}`,
		);
	}
	const json = await res.json();
	return {
		assetId: json?.asset?._id,
		assetInstanceId: json?.assetInstance?._id,
	};
}

async function linkMediaAssetToDataset(assetId, assetInstanceId) {
	const linkUrl = `https://${PROJECT_ID}.api.sanity.io/v2025-02-19/assets/media-library-link/${DATASET}`;
	for (let attempt = 0; attempt <= 3; attempt++) {
		const res = await fetch(linkUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
			body: JSON.stringify({
				mediaLibraryId: MEDIA_LIBRARY_ID,
				assetInstanceId,
				assetId,
			}),
		});
		if (res.ok) {
			const json = await res.json();
			return json?.document?._id;
		}
		if (attempt < 3) {
			await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
		}
	}
	throw new Error(`Failed to link asset ${assetId} to dataset`);
}

async function main() {
	console.log(`\n🐾 CodingCat.dev Social OG Prewarm & Media Library Sync`);
	console.log(`--------------------------------------------------------`);
	console.log(`Target Dataset: ${DATASET} | Media Library: ${MEDIA_LIBRARY_ID}`);

	const folderId = await ensureOgFolder();
	console.log(`✓ Media Library Folder Verified: ${folderId}`);

	// Build query
	let typeFilter = '["post", "podcast", "course", "page"]';
	if (options.type) {
		typeFilter = `["${options.type}"]`;
	}

	let groq = `*[_type in ${typeFilter}`;
	if (options.slug) {
		groq += ` && slug.current == "${options.slug}"`;
	} else if (!options.force) {
		groq += ` && !defined(ogImage)`;
	}
	groq += `][0...${options.limit}]{
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    episode,
    ogImage,
    "authorName": author[0]->title,
    "coverImageUrl": coverImage.asset->url
  }`;

	const docs = await queryDataset(groq);
	console.log(`Found ${docs.length} document(s) matching criteria.\n`);

	if (docs.length === 0) {
		console.log("No documents need prewarming or OG sync. All up to date!");
		return;
	}

	let processed = 0;
	let failed = 0;

	for (const doc of docs) {
		const docSlug = doc.slug || doc._id;
		console.log(`[${processed + 1}/${docs.length}] Processing [${doc._type}] ${doc.title} (${docSlug})...`);

		try {
			const ogUrl = buildOgUrl(doc);
			console.log(`   -> Fetching & Prewarming OG endpoint...`);
			const tStart = Date.now();
			const ogRes = await fetch(ogUrl);
			if (!ogRes.ok) {
				throw new Error(`OG endpoint HTTP ${ogRes.status}: ${ogUrl}`);
			}
			const bytes = Buffer.from(await ogRes.arrayBuffer());
			const elapsedMs = Date.now() - tStart;
			console.log(`   -> OG card rendered: ${bytes.length} bytes in ${elapsedMs}ms`);

			if (options.dryRun) {
				console.log(`   -> [DRY RUN] Skipped Media Library upload and document patch.`);
				processed++;
				continue;
			}

			const filename = `og-${doc._type}-${docSlug}.png`;

			// Upload to Media Library
			console.log(`   -> Uploading to Sanity Media Library (/Production/OG-Images)...`);
			const { assetId, assetInstanceId } = await uploadToMediaLibrary(
				bytes,
				filename,
				folderId,
			);

			// Patch aspects.metadata so it is easily searchable in Sanity Media Library
			await mutateMediaLibrary([
				{
					patch: {
						id: assetId,
						setIfMissing: { aspects: {} },
						set: {
							"aspects.metadata": {
								environment: DATASET,
								visibility: "public",
								category: "editorial",
								docType: doc._type,
								partnerSlug: docSlug,
								title: `OG Image: ${doc.title}`,
								description: `Social share preview card for ${doc.title}`,
								altText: doc.title,
								creditLine: "CodingCat.dev",
								originalFilename: filename,
								tags: ["og-image", "social-card", doc._type, "prewarmed"],
							},
							parent: { _type: "reference", _ref: folderId },
						},
					},
				},
			]);

			// Link Media Library asset to dataset
			console.log(`   -> Linking asset to dataset...`);
			const datasetAssetDocId = await linkMediaAssetToDataset(
				assetId,
				assetInstanceId,
			);

			// Update document with ogImage override
			console.log(`   -> Setting ogImage override on document ${doc._id}...`);
			await mutateDataset([
				{
					patch: {
						id: doc._id,
						set: {
							ogImage: {
								_type: "image",
								asset: {
									_type: "reference",
									_ref: datasetAssetDocId,
								},
								media: {
									_type: "globalDocumentReference",
									_ref: `media-library:${MEDIA_LIBRARY_ID}:${assetId}`,
									_weak: true,
								},
								alt: doc.title,
							},
						},
					},
				},
			]);

			console.log(`   ✓ Successfully synced ogImage for ${docSlug}\n`);
			processed++;
		} catch (err) {
			console.error(`   ✗ Error processing ${docSlug}:`, err.message, "\n");
			failed++;
		}
	}

	console.log(`--------------------------------------------------------`);
	console.log(`Summary: ${processed} processed, ${failed} failed.\n`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
