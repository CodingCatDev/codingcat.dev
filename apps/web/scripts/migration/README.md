# Cloudinary → Sanity Asset Migration (Sanity-First)

A production-grade Node.js tool that migrates Cloudinary assets to Sanity using
a **Sanity-first** approach: it starts by scanning your Sanity documents to
discover which Cloudinary assets are actually referenced, then migrates only
those assets and rewrites all references.

## Why Sanity-First?

The previous approach enumerated **all** Cloudinary assets and uploaded them
blindly. This was wasteful because:

- Many Cloudinary assets may not be referenced by any Sanity document
- It uploaded assets that were never needed, wasting time and storage
- It couldn't handle the Sanity Cloudinary plugin's `cloudinary.asset` type

The new approach:

1. **Discovers** what's actually used in Sanity
2. **Extracts** a deduplicated list of Cloudinary URLs
3. **Migrates** only what's needed
4. **Updates** all references in-place
5. **Reports** a full summary

---

## Prerequisites

| Requirement | Why |
|---|---|
| **Node.js ≥ 18** | Native `fetch` support & ES-module compatibility |
| **Sanity project** | Project ID, dataset name, and a **write-enabled** API token |

> **Note:** Cloudinary API credentials are no longer required! The script
> downloads assets directly from their public URLs. You only need Cloudinary
> credentials if your assets are private/restricted.

## Quick Start

```bash
# 1. Install dependencies
cd migration
npm install

# 2. Create your .env from the template
cp env-example.txt .env
# Then fill in your real credentials

# 3. Run the full migration (dry-run first!)
npm run migrate:dry-run

# 4. Run for real
npm run migrate
```

## Environment Variables

Copy `env-example.txt` to `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `SANITY_PROJECT_ID` | ✅ | Sanity project ID |
| `SANITY_DATASET` | ✅ | Sanity dataset (e.g. `production`) |
| `SANITY_TOKEN` | ✅ | Sanity API token with **write** access |
| `CLOUDINARY_CLOUD_NAME` | | Cloudinary cloud name (default: `ajonp`) |
| `CONCURRENCY` | | Max parallel uploads (default: `5`) |
| `DRY_RUN` | | Set to `true` to preview without writing |

## CLI Flags

```bash
node migrate.mjs                  # Full migration, all phases
node migrate.mjs --dry-run        # Preview mode — no writes
node migrate.mjs --phase=1        # Run only Phase 1
node migrate.mjs --phase=1,2      # Run Phases 1 & 2
node migrate.mjs --phase=3,4      # Run Phases 3 & 4 (uses cached data)
node migrate.mjs --concurrency=10 # Override parallel upload limit
```

## What Each Phase Does

### Phase 1 — Discover Cloudinary References in Sanity

Scans **all** Sanity documents (excluding built-in asset types) to find any
that reference Cloudinary. Handles two types of references:

#### `cloudinary.asset` objects (Sanity Cloudinary Plugin)

The [sanity-plugin-cloudinary](https://github.com/sanity-io/sanity-plugin-cloudinary)
stores assets as objects with `_type: "cloudinary.asset"` containing fields like
`public_id`, `secure_url`, `resource_type`, `format`, etc.

#### Plain URL strings

Any string field containing:
- `res.cloudinary.com/ajonp` (standard Cloudinary URL)
- `media.codingcat.dev` (custom CNAME domain)

This includes both standalone URL fields and URLs embedded in text/markdown content.

**Output:** `discovered-references.json` — list of documents with their Cloudinary references.

### Phase 2 — Extract Unique Cloudinary URLs

Deduplicates all discovered references into a unique list of Cloudinary asset
URLs that need to be migrated. Tracks which documents reference each URL.

**Output:** `unique-cloudinary-urls.json` — deduplicated URL list with metadata:
```json
{
  "cloudinaryUrl": "https://res.cloudinary.com/ajonp/image/upload/v123/folder/photo.jpg",
  "cloudinaryPublicId": "folder/photo",
  "resourceType": "image",
  "sourceDocIds": ["doc-abc", "doc-def"]
}
```

### Phase 3 — Download & Upload Assets

Downloads each unique Cloudinary asset and uploads it to Sanity's asset pipeline.

**Output:** `asset-mapping.json` — mapping between Cloudinary and Sanity:
```json
{
  "cloudinaryUrl": "https://res.cloudinary.com/ajonp/image/upload/v123/folder/photo.jpg",
  "cloudinaryPublicId": "folder/photo",
  "sanityAssetId": "image-abc123-1920x1080-jpg",
  "sanityUrl": "https://cdn.sanity.io/images/{projectId}/{dataset}/abc123-1920x1080.jpg",
  "sourceDocIds": ["doc-abc", "doc-def"]
}
```

- **Resume support**: assets already in the mapping are skipped automatically.
- Retries failed downloads/uploads up to 3× with exponential back-off.

### Phase 4 — Update References

Patches Sanity documents to replace Cloudinary references with Sanity references:

| Reference Type | Action |
|---|---|
| `cloudinary.asset` object | Replaced with `{ _type: "image", asset: { _type: "reference", _ref: "..." } }` |
| Full URL string | Replaced with Sanity CDN URL |
| Embedded URL in text | URL swapped inline within the text |

All patches are applied inside **transactions** for atomicity (one transaction per document).

### Phase 5 — Report

Prints a summary to the console and writes a detailed report:

```
══════════════════════════════════════════════════════════
  MIGRATION SUMMARY
══════════════════════════════════════════════════════════
  Documents with refs:        42
  Total references found:     128
    cloudinary.asset objects:  35
    URL string fields:        61
    Embedded URLs in text:    32
  Unique Cloudinary URLs:     87
  Assets uploaded to Sanity:  87
  Document fields updated:    128
  Errors:                     0
══════════════════════════════════════════════════════════
```

**Output:** `migration-report.json`

## Generated Files

| File | Phase | Description |
|---|---|---|
| `discovered-references.json` | 1 | Documents with Cloudinary references |
| `unique-cloudinary-urls.json` | 2 | Deduplicated Cloudinary URLs to migrate |
| `asset-mapping.json` | 3 | Cloudinary → Sanity asset mapping |
| `migration-report.json` | 5 | Full migration report |

## Resuming an Interrupted Migration

The script is fully resumable:

1. **Phase 1** is skipped if `discovered-references.json` exists.
2. **Phase 2** is skipped if `unique-cloudinary-urls.json` exists.
3. **Phase 3** skips any asset already present in `asset-mapping.json`.
4. **Phases 4–5** are idempotent — re-running them is safe.

To start completely fresh, delete the generated JSON files:

```bash
rm -f discovered-references.json unique-cloudinary-urls.json asset-mapping.json migration-report.json
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `401 Unauthorized` from Sanity | Check `SANITY_TOKEN` has write permissions |
| Download fails for private assets | Add Cloudinary credentials to `.env` and modify the download logic |
| Script hangs | Check network; the script logs progress for every asset |
| Partial migration | Just re-run — resume picks up where it left off |
| `cloudinary.asset` not detected | Ensure the field has `_type: "cloudinary.asset"` in the document |
| Custom CNAME not detected | Add your domain to `CLOUDINARY_PATTERNS` in the script |
