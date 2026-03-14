#!/usr/bin/env node

/**
 * Cloudinary → Sanity Asset Migration Tool (Sanity-First Approach)
 *
 * Instead of enumerating ALL Cloudinary assets, this script starts by
 * scanning Sanity documents to discover which Cloudinary assets are
 * actually referenced, then migrates only those.
 *
 * Usage:
 *   node migrate.mjs                  # full migration
 *   node migrate.mjs --dry-run        # preview only
 *   node migrate.mjs --phase=1,2      # run specific phases
 *   node migrate.mjs --concurrency=10 # override parallelism
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import fetch from 'node-fetch';
import pLimit from 'p-limit';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Resolve __dirname for ES modules ────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── File paths ──────────────────────────────────────────────────────────────
const DISCOVERY_FILE = path.join(__dirname, 'discovered-references.json');
const UNIQUE_URLS_FILE = path.join(__dirname, 'unique-cloudinary-urls.json');
const MAPPING_FILE = path.join(__dirname, 'asset-mapping.json');
const REPORT_FILE = path.join(__dirname, 'migration-report.json');

// ─── Parse CLI flags ─────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    dryRun: false,
    phases: null,       // null = all phases
    concurrency: null,  // null = use env or default
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      flags.dryRun = true;
    } else if (arg.startsWith('--phase=')) {
      flags.phases = arg.replace('--phase=', '').split(',').map(Number);
    } else if (arg.startsWith('--concurrency=')) {
      flags.concurrency = parseInt(arg.replace('--concurrency=', ''), 10);
    }
  }

  return flags;
}

const FLAGS = parseArgs();

// ─── Configuration ───────────────────────────────────────────────────────────
const DRY_RUN = FLAGS.dryRun || process.env.DRY_RUN === 'true';
const CONCURRENCY = FLAGS.concurrency || parseInt(process.env.CONCURRENCY, 10) || 5;
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'ajonp';
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_TOKEN;
const API_VERSION = '2024-01-01';

// URL patterns that indicate a Cloudinary reference
const CLOUDINARY_PATTERNS = [
  `res.cloudinary.com/${CLOUD_NAME}`,
  'media.codingcat.dev',
];

// ─── Validate env ────────────────────────────────────────────────────────────
function validateEnv() {
  const required = [
    ['SANITY_PROJECT_ID', SANITY_PROJECT_ID],
    ['SANITY_TOKEN', SANITY_TOKEN],
  ];

  const missing = required.filter(([, val]) => !val).map(([name]) => name);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   Copy env-example.txt to .env and fill in your credentials.');
    process.exit(1);
  }
}

// ─── Configure Sanity client ─────────────────────────────────────────────────
function initSanityClient() {
  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    token: SANITY_TOKEN,
    apiVersion: API_VERSION,
    useCdn: false,
  });
}

// ─── Utility: logging ────────────────────────────────────────────────────────
function log(phase, message) {
  const prefix = DRY_RUN ? '[DRY-RUN] ' : '';
  console.log(`${prefix}[Phase ${phase}] ${message}`);
}

function logInfo(message) {
  const prefix = DRY_RUN ? '[DRY-RUN] ' : '';
  console.log(`${prefix}${message}`);
}

// ─── Utility: retry with exponential back-off ────────────────────────────────
async function withRetry(fn, { retries = 3, baseDelay = 1000, label = 'operation' } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) {
        console.error(`   ✗ ${label} failed after ${retries} attempts: ${err.message}`);
        throw err;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
      console.warn(`   ⚠ ${label} attempt ${attempt} failed (${err.message}), retrying in ${Math.round(delay)}ms…`);
      await sleep(delay);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Utility: safe JSON file I/O ─────────────────────────────────────────────
async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Utility: MIME type from format / extension ──────────────────────────────
function guessMimeType(url) {
  const mimeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
    tiff: 'image/tiff',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    pdf: 'application/pdf',
    json: 'application/json',
    csv: 'text/csv',
    txt: 'text/plain',
    zip: 'application/zip',
  };

  if (url) {
    const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
    if (ext && mimeMap[ext]) return mimeMap[ext];
  }

  return 'application/octet-stream';
}

// ─── Utility: determine resource type from URL or MIME ───────────────────────
function guessResourceType(url) {
  const mime = guessMimeType(url);
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'file';
}

// ─── Utility: extract filename from a URL ────────────────────────────────────
function extractFilenameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/');
    return segments[segments.length - 1] || 'unnamed';
  } catch {
    return 'unnamed';
  }
}

// ─── Utility: extract public_id from a Cloudinary URL ────────────────────────
function extractPublicIdFromUrl(url) {
  // Standard Cloudinary URL:
  //   https://res.cloudinary.com/{cloud}/{resource_type}/upload/v{version}/{public_id}.{format}
  // Custom CNAME:
  //   https://media.codingcat.dev/{resource_type}/upload/v{version}/{public_id}.{format}
  try {
    const u = new URL(url);
    const pathname = u.pathname;

    // Find the upload/ segment and take everything after it
    const uploadIdx = pathname.indexOf('/upload/');
    if (uploadIdx === -1) {
      // Try without /upload/ — might be a fetch or other delivery type
      const parts = pathname.split('/').filter(Boolean);
      // Remove cloud name if present, resource_type, type
      return parts.slice(-1)[0]?.split('.')[0] || null;
    }

    let afterUpload = pathname.substring(uploadIdx + '/upload/'.length);

    // Strip version prefix (v1234567890/)
    afterUpload = afterUpload.replace(/^v\d+\//, '');

    // Strip file extension
    const lastDot = afterUpload.lastIndexOf('.');
    if (lastDot > 0) {
      afterUpload = afterUpload.substring(0, lastDot);
    }

    return afterUpload || null;
  } catch {
    return null;
  }
}

// ─── Utility: check if a string contains a Cloudinary reference ──────────────
function containsCloudinaryRef(str) {
  if (typeof str !== 'string') return false;
  return CLOUDINARY_PATTERNS.some((p) => str.includes(p));
}

// ─── Utility: extract all Cloudinary URLs from a string ──────────────────────
function extractCloudinaryUrls(str) {
  const standardRegex = new RegExp(
    `https?://res\\.cloudinary\\.com/${escapeRegex(CLOUD_NAME)}/[^\\s"'<>)\\]]+`,
    'g'
  );
  const cnameRegex = /https?:\/\/media\.codingcat\.dev\/[^\s"'<>)\]]+/g;

  const standardMatches = str.match(standardRegex) || [];
  const cnameMatches = str.match(cnameRegex) || [];
  return [...new Set([...standardMatches, ...cnameMatches])];
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Utility: build Sanity CDN URL from asset ID ─────────────────────────────
function sanityAssetUrl(assetId) {
  // Sanity asset IDs look like: image-abc123-1920x1080-jpg
  // CDN URL: https://cdn.sanity.io/images/{projectId}/{dataset}/{hash}-{dims}.{ext}
  const parts = assetId.split('-');
  if (parts.length < 3) return null;

  const type = parts[0]; // 'image' or 'file'
  const assetType = type === 'image' ? 'images' : 'files';
  const idParts = parts.slice(1);
  const ext = idParts.pop();
  const filenamePart = idParts.join('-') + '.' + ext;

  return `https://cdn.sanity.io/${assetType}/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${filenamePart}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1: Discover Cloudinary References in Sanity
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Recursively walk an object and find all Cloudinary references.
 * Handles both:
 *   - cloudinary.asset objects (from the Sanity Cloudinary plugin)
 *   - Plain URL strings containing Cloudinary domains
 *
 * Returns an array of:
 *   { path, type: 'cloudinary.asset'|'url'|'embedded', value, url, publicId }
 */
function findCloudinaryRefs(obj, currentPath = '') {
  const results = [];

  if (obj === null || obj === undefined) return results;

  // Check for cloudinary.asset plugin objects
  if (typeof obj === 'object' && !Array.isArray(obj) && obj._type === 'cloudinary.asset') {
    const url = obj.secure_url || obj.url || null;
    const publicId = obj.public_id || (url ? extractPublicIdFromUrl(url) : null);

    // If no URL in the object, construct one from public_id
    let resolvedUrl = url;
    if (!resolvedUrl && publicId && obj.resource_type && obj.format) {
      resolvedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/${obj.resource_type}/upload/${publicId}.${obj.format}`;
    }

    if (resolvedUrl || publicId) {
      results.push({
        path: currentPath,
        type: 'cloudinary.asset',
        value: obj,
        url: resolvedUrl,
        publicId: publicId,
        resourceType: obj.resource_type || 'image',
        format: obj.format || null,
      });
    }
    return results; // Don't recurse into cloudinary.asset children
  }

  // Check for raw Cloudinary objects (old format without _type)
  if (typeof obj === 'object' && !Array.isArray(obj) && obj.public_id && (obj.secure_url || obj.url) && !obj._type) {
    const url = obj.secure_url || obj.url || null;
    const publicId = obj.public_id;
    if (url) {
      results.push({
        path: currentPath,
        type: 'raw-cloudinary-object',
        url: url,
        publicId: publicId,
        resourceType: obj.resource_type || 'image',
        format: obj.format || null,
      });
    }
    return results; // Don't recurse into raw Cloudinary object children (derived[], etc.)
  }

  if (typeof obj === 'string') {
    if (containsCloudinaryRef(obj)) {
      // Skip URLs that are inside cloudinary.asset sub-fields (derived, url, secure_url)
      // These will be replaced when the parent cloudinary.asset object is swapped out
      const skipPatterns = ['.derived[', '.secure_url', '.url'];
      const isSubField = skipPatterns.some((p) => currentPath.includes(p)) &&
        (currentPath.includes('coverImage') || currentPath.includes('videoCloudinary') || currentPath.includes('ogImage'));
      if (isSubField) {
        return results;
      }

      const urls = extractCloudinaryUrls(obj);
      const isFullUrl = obj.trim().startsWith('http') && !obj.includes(' ') && urls.length === 1;

      if (isFullUrl) {
        results.push({
          path: currentPath,
          type: 'url',
          value: obj,
          url: urls[0],
          publicId: extractPublicIdFromUrl(urls[0]),
        });
      } else if (urls.length > 0) {
        // Embedded URL(s) in text content
        for (const u of urls) {
          results.push({
            path: currentPath,
            type: 'embedded',
            value: obj,
            url: u,
            publicId: extractPublicIdFromUrl(u),
          });
        }
      }
    }
    return results;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      results.push(...findCloudinaryRefs(obj[i], `${currentPath}[${i}]`));
    }
    return results;
  }

  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      results.push(...findCloudinaryRefs(value, nextPath));
    }
  }

  return results;
}

async function phase1_discoverReferences(sanityClient) {
  log(1, '── Discovering Cloudinary references in Sanity documents ──');

  // Check for cached discovery
  const cached = await readJsonFile(DISCOVERY_FILE);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    log(1, `Found cached discovery with ${cached.length} documents. Delete ${DISCOVERY_FILE} to re-scan.`);
    return cached;
  }

  // Fetch all documents (excluding Sanity's own asset types)
  log(1, 'Fetching all documents from Sanity…');

  let allDocs = [];
  const batchSize = 2000;
  let lastId = '';

  while (true) {
    const paginatedQuery = `*[
      _type != "sanity.imageAsset" &&
      _type != "sanity.fileAsset" &&
      _id > $lastId
    ] | order(_id asc) [0...${batchSize}] { ... }`;

    const batch = await withRetry(
      () => sanityClient.fetch(paginatedQuery, { lastId }),
      { label: `Fetch Sanity documents batch after ${lastId || 'start'}` }
    );

    if (!batch || batch.length === 0) break;

    allDocs = allDocs.concat(batch);
    lastId = batch[batch.length - 1]._id;
    log(1, `  Fetched ${allDocs.length} documents so far…`);

    if (batch.length < batchSize) break;
  }

  log(1, `Total documents fetched: ${allDocs.length}`);

  // Scan each document for Cloudinary references
  const docsWithRefs = [];

  for (const doc of allDocs) {
    const refs = findCloudinaryRefs(doc);
    if (refs.length > 0) {
      docsWithRefs.push({
        _id: doc._id,
        _type: doc._type,
        refs,
      });
    }
  }

  log(1, `Found ${docsWithRefs.length} documents with Cloudinary references`);

  let cloudinaryAssetCount = 0;
  let rawCloudinaryCount = 0;
  let urlCount = 0;
  let embeddedCount = 0;

  for (const d of docsWithRefs) {
    log(1, `  ${d._type} (${d._id}): ${d.refs.length} reference(s)`);
    for (const r of d.refs) {
      log(1, `    ${r.path} [${r.type}] → ${r.url || r.publicId || '(no url)'}`);
      if (r.type === 'cloudinary.asset') cloudinaryAssetCount++;
      else if (r.type === 'raw-cloudinary-object') rawCloudinaryCount++;
      else if (r.type === 'url') urlCount++;
      else if (r.type === 'embedded') embeddedCount++;
    }
  }

  log(1, `\n  Breakdown: ${cloudinaryAssetCount} cloudinary.asset objects, ${rawCloudinaryCount} raw Cloudinary objects, ${urlCount} URL fields, ${embeddedCount} embedded URLs`);

  // Save to disk for resume
  if (!DRY_RUN) {
    await writeJsonFile(DISCOVERY_FILE, docsWithRefs);
    log(1, `Saved discovery to ${DISCOVERY_FILE}`);
  }

  return docsWithRefs;
}

// ─── Utility: strip Cloudinary transformations from URL ──────────────────────
function stripTransformations(url) {
  // Cloudinary URL format: .../upload/[transformations/]v{version}/{public_id}.{ext}
  // Strip everything between /upload/ and /v{version}/
  return url.replace(
    /(\/upload\/)((?:[a-z_][a-z0-9_,:]+(?:\/|$))*)(v\d+\/)/i,
    '$1$3'
  );
}

// ─── Utility: get canonical original URL for a Cloudinary reference ──────────
function getOriginalUrl(ref) {
  if (ref.publicId && ref.resourceType) {
    const ext = ref.format || (ref.resourceType === 'video' ? 'mp4' : 'png');
    return `https://media.codingcat.dev/${ref.resourceType}/upload/${ref.publicId}.${ext}`;
  }
  // Fallback: strip transformations from the URL
  return stripTransformations(ref.url);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2: Extract Unique Cloudinary URLs
// ═══════════════════════════════════════════════════════════════════════════════

async function phase2_extractUniqueUrls(docsWithRefs) {
  log(2, '── Extracting unique Cloudinary URLs ──');

  // Check for cached URL list
  const cached = await readJsonFile(UNIQUE_URLS_FILE);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    log(2, `Found cached URL list with ${cached.length} unique URLs. Delete ${UNIQUE_URLS_FILE} to re-extract.`);
    return cached;
  }

  // Build a map: url → { url, publicId, resourceType, sourceDocIds }
  const urlMap = new Map();

  for (const doc of docsWithRefs) {
    for (const ref of doc.refs) {
      if (!ref.url) continue;

      // Get the canonical original URL (strips transformations, uses CNAME)
      const originalUrl = getOriginalUrl(ref);

      if (urlMap.has(originalUrl)) {
        // Add this doc as another source
        const entry = urlMap.get(originalUrl);
        if (!entry.sourceDocIds.includes(doc._id)) {
          entry.sourceDocIds.push(doc._id);
        }
      } else {
        urlMap.set(originalUrl, {
          cloudinaryUrl: originalUrl,
          cloudinaryPublicId: ref.publicId || extractPublicIdFromUrl(originalUrl),
          resourceType: ref.resourceType || guessResourceType(originalUrl),
          sourceDocIds: [doc._id],
        });
      }
    }
  }

  const uniqueUrls = Array.from(urlMap.values());

  log(2, `Total unique Cloudinary URLs to migrate: ${uniqueUrls.length}`);

  // Log breakdown by resource type
  const byType = {};
  for (const u of uniqueUrls) {
    byType[u.resourceType] = (byType[u.resourceType] || 0) + 1;
  }
  for (const [type, count] of Object.entries(byType)) {
    log(2, `  ${type}: ${count}`);
  }

  // Save to disk for resume
  if (!DRY_RUN) {
    await writeJsonFile(UNIQUE_URLS_FILE, uniqueUrls);
    log(2, `Saved unique URL list to ${UNIQUE_URLS_FILE}`);
  }

  return uniqueUrls;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3: Download & Upload Assets to Sanity
// ═══════════════════════════════════════════════════════════════════════════════

async function phase3_downloadAndUpload(uniqueUrls) {
  log(3, '── Downloading & uploading assets to Sanity ──');
  log(3, `Concurrency: ${CONCURRENCY} | Total unique URLs: ${uniqueUrls.length}`);

  // Load existing mapping for resume
  let mapping = (await readJsonFile(MAPPING_FILE)) || [];
  const existingUrls = new Set(mapping.map((m) => m.cloudinaryUrl));

  const toProcess = uniqueUrls.filter((u) => !existingUrls.has(u.cloudinaryUrl));
  log(3, `Skipping ${uniqueUrls.length - toProcess.length} already-migrated assets`);
  log(3, `Assets to migrate: ${toProcess.length}`);

  if (toProcess.length === 0) {
    log(3, 'Nothing to do — all assets already migrated.');
    return mapping;
  }

  const limit = pLimit(CONCURRENCY);
  let completed = 0;
  let errors = 0;
  const errorDetails = [];

  const tasks = toProcess.map((entry) =>
    limit(async () => {
      const { cloudinaryUrl, cloudinaryPublicId, resourceType, sourceDocIds } = entry;
      const filename = extractFilenameFromUrl(cloudinaryUrl);
      const mimeType = guessMimeType(cloudinaryUrl);
      const isImage = resourceType === 'image';

      try {
        // Step 1: Download from Cloudinary
        const downloadRes = await withRetry(
          () => fetch(cloudinaryUrl),
          { label: `Download ${cloudinaryPublicId || cloudinaryUrl}` }
        );

        if (!downloadRes.ok) {
          throw new Error(`Download failed: HTTP ${downloadRes.status} for ${cloudinaryUrl}`);
        }

        const buffer = await downloadRes.buffer();

        if (DRY_RUN) {
          completed++;
          log(3, `  [${completed}/${toProcess.length}] Would upload: ${cloudinaryPublicId || cloudinaryUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);
          return;
        }

        // Step 2: Upload to Sanity
        const assetType = isImage ? 'images' : 'files';
        const uploadUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/${assetType}/${SANITY_DATASET}?filename=${encodeURIComponent(filename)}`;

        const uploadRes = await withRetry(
          async () => {
            const res = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                'Content-Type': mimeType,
                Authorization: `Bearer ${SANITY_TOKEN}`,
              },
              body: buffer,
            });

            if (!res.ok) {
              const body = await res.text();
              throw new Error(`Upload failed: HTTP ${res.status} — ${body}`);
            }

            return res.json();
          },
          { label: `Upload ${cloudinaryPublicId || cloudinaryUrl}` }
        );

        const sanityDoc = uploadRes.document;
        const sanityUrl = sanityAssetUrl(sanityDoc._id);

        const mappingEntry = {
          cloudinaryUrl,
          cloudinaryPublicId: cloudinaryPublicId || null,
          sanityAssetId: sanityDoc._id,
          sanityUrl: sanityUrl || sanityDoc.url,
          sourceDocIds,
        };

        mapping.push(mappingEntry);

        // Persist mapping incrementally for resume safety
        await writeJsonFile(MAPPING_FILE, mapping);

        completed++;
        log(3, `  [${completed}/${toProcess.length}] ✓ ${cloudinaryPublicId || cloudinaryUrl} → ${sanityDoc._id}`);
      } catch (err) {
        errors++;
        errorDetails.push({ cloudinaryUrl, cloudinaryPublicId, error: err.message });
        console.error(`  ✗ [${completed + errors}/${toProcess.length}] Failed: ${cloudinaryPublicId || cloudinaryUrl} — ${err.message}`);
      }
    })
  );

  await Promise.all(tasks);

  log(3, `\nPhase 3 complete: ${completed} uploaded, ${errors} errors`);
  if (errorDetails.length > 0) {
    log(3, 'Errors:');
    for (const e of errorDetails) {
      log(3, `  - ${e.cloudinaryPublicId || e.cloudinaryUrl}: ${e.error}`);
    }
  }

  return mapping;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4: Update References in Sanity Documents
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Given a Cloudinary URL, find the matching Sanity asset in the mapping.
 */
function findMappingForUrl(url, mapping, refPublicId) {
  // Try exact URL match first
  let entry = mapping.find((m) => m.cloudinaryUrl === url);
  if (entry) return entry;

  // Try matching by the ref's own publicId (from the Cloudinary object)
  if (refPublicId) {
    entry = mapping.find((m) => m.cloudinaryPublicId === refPublicId);
    if (entry) return entry;
  }

  // Try matching by stripped/canonical URL
  const strippedUrl = stripTransformations(url);
  if (strippedUrl !== url) {
    entry = mapping.find((m) => m.cloudinaryUrl === strippedUrl);
    if (entry) return entry;
  }

  // Try matching by public_id extracted from the URL
  const publicId = extractPublicIdFromUrl(url);
  if (publicId) {
    entry = mapping.find((m) => m.cloudinaryPublicId === publicId);
    if (entry) return entry;

    // Fuzzy: check if the URL contains the mapping's public_id
    for (const m of mapping) {
      if (m.cloudinaryPublicId && url.includes(m.cloudinaryPublicId)) {
        return m;
      }
    }
  }

  // Try matching by filename as last resort
  const urlFilename = url.split('/').pop()?.split('?')[0];
  if (urlFilename) {
    for (const m of mapping) {
      const mappingFilename = m.cloudinaryUrl.split('/').pop()?.split('?')[0];
      if (urlFilename === mappingFilename) {
        return m;
      }
    }
  }

  return null;
}

async function phase4_updateReferences(sanityClient, docsWithRefs, mapping) {
  log(4, '── Updating Cloudinary references in Sanity documents ──');

  if (docsWithRefs.length === 0) {
    log(4, 'No documents to update.');
    return [];
  }

  const changes = [];
  let updatedDocs = 0;
  let updatedFields = 0;
  let skippedFields = 0;

  for (const docInfo of docsWithRefs) {
    const { _id: docId, _type: docType, refs } = docInfo;
    let transaction = sanityClient.transaction();
    let hasPatches = false;

    for (const ref of refs) {
      const { path: fieldPath, type: refType, url: refUrl, value } = ref;

      if (!refUrl) {
        log(4, `  ⚠ No URL for reference at ${docId}.${fieldPath} — skipping`);
        skippedFields++;
        continue;
      }

      const mappingEntry = findMappingForUrl(refUrl, mapping, ref.publicId);

      if (!mappingEntry) {
        log(4, `  ⚠ No mapping found for URL: ${refUrl} (in ${docId} at ${fieldPath})`);
        skippedFields++;
        continue;
      }

      const sanityId = mappingEntry.sanityAssetId;
      const cdnUrl = mappingEntry.sanityUrl || sanityAssetUrl(sanityId);

      if (refType === 'cloudinary.asset' || refType === 'raw-cloudinary-object') {
        // ── Replace entire cloudinary.asset or raw Cloudinary object with Sanity image/file reference ──
        const isImage = (ref.resourceType || 'image') === 'image';
        const refObj = isImage
          ? {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: sanityId,
              },
            }
          : {
              _type: 'file',
              asset: {
                _type: 'reference',
                _ref: sanityId,
              },
            };

        const change = {
          docId,
          docType,
          fieldPath,
          action: 'replace_cloudinary_asset',
          from: refUrl,
          to: sanityId,
        };
        changes.push(change);

        if (!DRY_RUN) {
          transaction = transaction.patch(docId, (p) => p.set({ [fieldPath]: refObj }));
          hasPatches = true;
        }

        log(4, `  ${docId}: ${fieldPath} [cloudinary.asset] → ${isImage ? 'image' : 'file'} ref ${sanityId}`);
        updatedFields++;

      } else if (refType === 'url') {
        // ── Full URL field — replace with Sanity CDN URL ──
        const newUrl = cdnUrl || refUrl;

        const change = {
          docId,
          docType,
          fieldPath,
          action: 'replace_url',
          from: refUrl,
          to: newUrl,
        };
        changes.push(change);

        if (!DRY_RUN && cdnUrl) {
          transaction = transaction.patch(docId, (p) => p.set({ [fieldPath]: newUrl }));
          hasPatches = true;
        }

        log(4, `  ${docId}: ${fieldPath} [url] → ${newUrl}`);
        updatedFields++;

      } else if (refType === 'embedded') {
        // ── Embedded URL in text — replace inline ──
        const newValue = value.replace(
          new RegExp(escapeRegex(refUrl), 'g'),
          cdnUrl || refUrl
        );

        const change = {
          docId,
          docType,
          fieldPath,
          action: 'replace_embedded_url',
          from: refUrl,
          to: cdnUrl || refUrl,
        };
        changes.push(change);

        if (!DRY_RUN && cdnUrl) {
          transaction = transaction.patch(docId, (p) => p.set({ [fieldPath]: newValue }));
          hasPatches = true;
        }

        log(4, `  ${docId}: ${fieldPath} [embedded] → replaced URL`);
        updatedFields++;
      }
    }

    // Commit the transaction for this document
    if (hasPatches && !DRY_RUN) {
      try {
        await withRetry(
          () => transaction.commit(),
          { label: `Commit patches for ${docId}` }
        );
        updatedDocs++;
        log(4, `  ✓ Committed changes for ${docId}`);
      } catch (err) {
        console.error(`  ✗ Failed to commit changes for ${docId}: ${err.message}`);
        changes.push({
          docId,
          docType,
          action: 'error',
          error: err.message,
        });
      }
    } else if (DRY_RUN) {
      updatedDocs++;
    }
  }

  log(4, `\nPhase 4 complete: ${updatedDocs} documents, ${updatedFields} fields updated, ${skippedFields} skipped`);
  return changes;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 5: Report
// ═══════════════════════════════════════════════════════════════════════════════

async function phase5_report(docsWithRefs, uniqueUrls, mapping, changes) {
  log(5, '── Migration Report ──');

  const totalRefs = docsWithRefs.reduce((sum, d) => sum + d.refs.length, 0);
  const cloudinaryAssetRefs = docsWithRefs.reduce(
    (sum, d) => sum + d.refs.filter((r) => r.type === 'cloudinary.asset').length,
    0
  );
  const rawCloudinaryRefs = docsWithRefs.reduce(
    (sum, d) => sum + d.refs.filter((r) => r.type === 'raw-cloudinary-object').length,
    0
  );
  const urlRefs = docsWithRefs.reduce(
    (sum, d) => sum + d.refs.filter((r) => r.type === 'url').length,
    0
  );
  const embeddedRefs = docsWithRefs.reduce(
    (sum, d) => sum + d.refs.filter((r) => r.type === 'embedded').length,
    0
  );

  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    summary: {
      totalDocumentsWithRefs: docsWithRefs.length,
      totalReferencesFound: totalRefs,
      cloudinaryAssetObjects: cloudinaryAssetRefs,
      rawCloudinaryObjects: rawCloudinaryRefs,
      urlStringRefs: urlRefs,
      embeddedUrlRefs: embeddedRefs,
      uniqueCloudinaryUrls: uniqueUrls.length,
      assetsUploaded: mapping.length,
      fieldsUpdated: changes.filter((c) => c.action !== 'error').length,
      errors: changes.filter((c) => c.action === 'error').length,
    },
    assetMapping: mapping,
    documentChanges: changes,
  };

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  MIGRATION SUMMARY');
  console.log('══════════════════════════════════════════════════════════');
  console.log(`  Mode:                       ${DRY_RUN ? 'DRY RUN (no changes written)' : 'LIVE'}`);
  console.log(`  Documents with refs:        ${report.summary.totalDocumentsWithRefs}`);
  console.log(`  Total references found:     ${report.summary.totalReferencesFound}`);
  console.log(`    cloudinary.asset objects:  ${report.summary.cloudinaryAssetObjects}`);
  console.log(`    raw Cloudinary objects:    ${report.summary.rawCloudinaryObjects}`);
  console.log(`    URL string fields:        ${report.summary.urlStringRefs}`);
  console.log(`    Embedded URLs in text:    ${report.summary.embeddedUrlRefs}`);
  console.log(`  Unique Cloudinary URLs:     ${report.summary.uniqueCloudinaryUrls}`);
  console.log(`  Assets uploaded to Sanity:  ${report.summary.assetsUploaded}`);
  console.log(`  Document fields updated:    ${report.summary.fieldsUpdated}`);
  console.log(`  Errors:                     ${report.summary.errors}`);
  console.log('══════════════════════════════════════════════════════════\n');

  if (!DRY_RUN) {
    await writeJsonFile(REPORT_FILE, report);
    logInfo(`Detailed report saved to ${REPORT_FILE}`);
  } else {
    logInfo('Dry run — no report file written. Remove --dry-run to execute.');
  }

  return report;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   Cloudinary → Sanity Asset Migration (Sanity-First)    ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE — no changes will be written\n');
  }

  validateEnv();
  const sanityClient = initSanityClient();

  const shouldRun = (phase) => !FLAGS.phases || FLAGS.phases.includes(phase);

  let docsWithRefs = [];
  let uniqueUrls = [];
  let mapping = [];
  let changes = [];

  // ── Phase 1: Discover Cloudinary references in Sanity ──
  if (shouldRun(1)) {
    docsWithRefs = await phase1_discoverReferences(sanityClient);
  } else {
    docsWithRefs = (await readJsonFile(DISCOVERY_FILE)) || [];
    logInfo(`Loaded ${docsWithRefs.length} discovered docs from cache (Phase 1 skipped)`);
  }

  // ── Phase 2: Extract unique Cloudinary URLs ──
  if (shouldRun(2)) {
    uniqueUrls = await phase2_extractUniqueUrls(docsWithRefs);
  } else {
    uniqueUrls = (await readJsonFile(UNIQUE_URLS_FILE)) || [];
    logInfo(`Loaded ${uniqueUrls.length} unique URLs from cache (Phase 2 skipped)`);
  }

  // ── Phase 3: Download & Upload ──
  if (shouldRun(3)) {
    mapping = await phase3_downloadAndUpload(uniqueUrls);
  } else {
    mapping = (await readJsonFile(MAPPING_FILE)) || [];
    logInfo(`Loaded ${mapping.length} mappings from cache (Phase 3 skipped)`);
  }

  // ── Phase 4: Update references ──
  if (shouldRun(4)) {
    // Ensure we have discovery data even if Phase 1 was skipped
    if (docsWithRefs.length === 0 && !shouldRun(1)) {
      docsWithRefs = (await readJsonFile(DISCOVERY_FILE)) || [];
      if (docsWithRefs.length === 0) {
        log(4, 'No discovery data available — running Phase 1 now…');
        docsWithRefs = await phase1_discoverReferences(sanityClient);
      }
    }
    // Ensure we have mapping data even if Phase 3 was skipped
    if (mapping.length === 0 && !shouldRun(3)) {
      mapping = (await readJsonFile(MAPPING_FILE)) || [];
    }
    changes = await phase4_updateReferences(sanityClient, docsWithRefs, mapping);
  }

  // ── Phase 5: Report (always runs) ──
  await phase5_report(docsWithRefs, uniqueUrls, mapping, changes);
}

// ── Run ──────────────────────────────────────────────────────────────────────
main().catch((err) => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
