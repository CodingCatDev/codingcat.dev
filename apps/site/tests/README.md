# Automated Dual-Track E2E Test Suite Architecture

## 1. Overview & Architecture

The test suite for `@codingcatdev/site` implements the **Dual-Track E2E Testing Methodology**, ensuring 100% route, feed, schema, and baseline contract parity between the legacy Next.js application and the Astro 7 SSR Cloudflare Workers target.

### Dual-Track Strategy
1. **Track 1 — Integrated Route & Handler Contract Verification**:
   - Executes Astro 7 endpoints, route logic, pagination resolvers, XML serializers, dynamic OG generators, and draft mode security middleware directly against runtime contracts.
   - Verifies HTTP status codes (200, 301, 302, 404), HTTP headers (`Cache-Control`, `X-Robots-Tag`, `Content-Type`), and security protections.
2. **Track 2 — Pre-Migration Baseline Specification Verification**:
   - Compares output against canonical baseline snapshots in `apps/site/baseline/`.
   - Validates all 472 indexed sitemap URLs, 50 podcast RSS items (with iTunes namespaces and verbatim Sanity `_id` GUIDs), 50 blog RSS items, JSON feed schema v1, and `robots.txt` directives.

---

## 2. Test Suite Organization & Tiers

The test suite is structured into four progressive tiers located in `apps/site/tests/`:

| File | Tier | Coverage Scope | Test Count |
|---|---|---|---|
| `apps/site/tests/tier1-features.test.mjs` | **Tier 1** | Feature Coverage across Public Routes, Feeds, Sitemap, Robots, OG Images, Draft Mode | 33 tests |
| `apps/site/tests/tier2-boundaries.test.mjs` | **Tier 2** | Boundary & Corner Cases: Pagination bounds, Non-existent slugs, Podcast GUIDs, Enclosures, XML/CDATA, Stega cleaning | 35 tests |
| `apps/site/tests/tier3-combinations.test.mjs` | **Tier 3** | Cross-Feature Combinations: Redirect rules (301/302), Canonical resolution, Dynamic OG fallback typography, Edge cache poisoning protection | 25 tests |
| `apps/site/tests/tier4-baseline-contract.test.mjs` | **Tier 4** | Real-World Baseline Contracts: 472 Sitemap URLs, 50 Podcast items, 50 Blog items, JSON Feeds, Robots.txt | 22 tests |
| `apps/site/tests/run-e2e.mjs` | **Master Runner** | Orchestrates test execution, tier filtering, and executive summary reporting | 139 checks |

---

## 3. How to Run the Tests

The test suite is designed for frictionless execution in CI and local developer environments using the native Node.js 22 test runner (`node:test`). No external test dependencies are required.

### Run All Tiers (Master Runner)
```bash
node apps/site/tests/run-e2e.mjs
```

### Run Individual Tiers
```bash
# Run Tier 1 only
node apps/site/tests/run-e2e.mjs --tier=1

# Run Tier 2 only
node apps/site/tests/run-e2e.mjs --tier=2

# Run Tier 3 only
node apps/site/tests/run-e2e.mjs --tier=3

# Run Tier 4 only
node apps/site/tests/run-e2e.mjs --tier=4
```

### Native Node Test Runner Invocation
```bash
node --test apps/site/tests/*.test.mjs
```

---

## 4. Feature Inventory Matrix

| Feature Area | Key Routes / Endpoints | Primary Contract | Boundary & Defense Contract |
|---|---|---|---|
| **Public Routes** | `/`, `/blog`, `/post/:slug`, `/podcasts`, `/podcast/:slug`, `/authors`, `/author/:slug`, `/guests`, `/guest/:slug`, `/sponsors`, `/sponsor/:slug`, `/[slug]`, `/404` | Renders responsive layouts, metadata, breadcrumb schemas | 404 on missing entity, server-side status injection |
| **RSS Feeds** | `/blog/rss.xml`, `/podcasts/rss.xml` | RSS 2.0 XML with `dc`, `content`, `itunes`, `atom`, `podcast` namespaces | Exact Sanity `_id` verbatim GUIDs (`isPermaLink="false"`), CDATA split injection defense |
| **JSON Feeds** | `/blog/rss.json`, `/podcasts/rss.json` | JSON Feed v1.0 specification with authors and content | Parity with XML feed IDs and metadata |
| **Sitemap** | `/sitemap.xml` | Dynamic runtime generation of all indexed URLs (`0.9` namespace) | Priority (1, 0.5, 0.1) and changefreq (daily, monthly) contracts |
| **Robots** | `/robots.txt` | Environment-aware: full crawl on prod, `Disallow: /` on dev/worker | Exact byte match against baseline `robots.txt` |
| **Dynamic OG** | `/api/og/default.png`, `/blog.png`, `/podcast.png`, `/person.png` | Satori plain VDOM rendering, cache header `max-age=86400, s-maxage=604800` | Dynamic font scaling: <=40: 56px, 41-60: 48px, >60: 42px |
| **Draft Mode** | `/api/draft-mode/enable`, `/disable` | Cookie `__sanity_preview`, perspective parameter parsing | Fails closed on missing read token, sets `no-store, private` and `noindex, nofollow` |

---

## 5. Implementation Parity & Escalation Log

The test suite surfaced the following implementation gaps that must be completed by the implementing agent:

1. **Missing Search Page (`/search`)**:
   - **Contract**: `sitemap.xml.ts` advertises `/search`, and `Header.astro` contains a search anchor to `/search`.
   - **Current State**: `apps/site/src/pages/search.astro` does not exist. The request falls back to `[slug].astro`, which looks for a Sanity page document with slug `"search"` and returns a 404 response.
   - **Action Required**: Create `apps/site/src/pages/search.astro` with the Algolia search island.

2. **Missing Draft Mode Endpoints (`/api/draft-mode/enable.ts` & `/disable.ts`)**:
   - **Contract**: `DraftModeToggle.astro` submits POST to `/api/draft-mode/disable`, and Sanity Studio Presentation navigates to `/api/draft-mode/enable`.
   - **Current State**: `apps/site/src/pages/api/draft-mode/` does not exist, causing 404 errors when toggling preview mode.
   - **Action Required**: Create `enable.ts` and `disable.ts` in `apps/site/src/pages/api/draft-mode/` to set and clear the `__sanity_preview` cookie.

3. **Legacy RSS Feed 301 Redirects**:
   - **Contract**: Historical subscribers expecting `/rss.xml` and `/podcast/rss.xml` must receive permanent 301 redirects to `/blog/rss.xml` and `/podcasts/rss.xml`.
   - **Action Required**: Add explicit 301 redirect rules in `apps/site/astro.config.mjs` or `public/_redirects`.
