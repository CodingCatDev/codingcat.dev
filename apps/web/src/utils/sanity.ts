/**
 * Draft-aware Sanity query helper with Visual Editing support.
 *
 * Draft mode is enabled when EITHER:
 * 1. PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true (site-wide, for dev environments)
 * 2. The __sanity_preview cookie is set (per-session, via /api/draft-mode/enable)
 *
 * When draft mode is active:
 * - Fetches with perspective: "drafts" (shows unpublished content)
 * - Enables stega encoding (invisible edit markers for click-to-edit overlays)
 * - Uses SANITY_API_READ_TOKEN for authenticated requests
 * - Returns resultSourceMap for the Presentation Tool
 *
 * When disabled (default):
 * - Fetches published content only
 * - No stega encoding (clean strings)
 * - No token needed (public API)
 */
import type { QueryParams } from "sanity";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Studio URL required for stega encoding (click-to-edit overlays in Presentation tool).
// Set PUBLIC_SANITY_STUDIO_URL to http://localhost:3333 when running Studio locally.
const studioUrl =
  import.meta.env.PUBLIC_SANITY_STUDIO_URL || "https://codingcat.dev.sanity.studio";

const projectId = import.meta.env.SANITY_PROJECT_ID || "hfh83o0w";
const defaultDataset = import.meta.env.SANITY_DATASET || "production";

// Create client explicitly so we don't rely on the "sanity:client" virtual module,
// which can fail to resolve in some Vite/Astro contexts (e.g. config loading).
const sanityClient = createClient({
  projectId,
  dataset: defaultDataset,
  apiVersion: "2026-03-17",
  useCdn: false,
  stega: {
    studioUrl,
  },
});

const builder = imageUrlBuilder(sanityClient);

// Per-dataset clients for preview (workspace-driven dataset from Studio)
const datasetClients = new Map<string, ReturnType<typeof createClient>>();

function getClientForDataset(dataset: string) {
  let client = datasetClients.get(dataset);
  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion: "2026-03-17",
      useCdn: false,
      stega: { studioUrl },
    });
    datasetClients.set(dataset, client);
  }
  return client;
}

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

/** Site-wide Visual Editing toggle (for dev/preview environments) */
const siteWideVisualEditing =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

interface LoadQueryOptions {
  query: string;
  params?: QueryParams;
  /** Per-request draft mode — set from Astro.cookies in page frontmatter */
  draftMode?: boolean;
  /**
   * Perspective for preview: "published" | "drafts" | release ID.
   * Pass Astro.url.searchParams.get("sanity-preview-perspective") when in visual editing
   * so switching perspective in Studio shows the correct content.
   */
  perspective?: string;
  /**
   * Dataset for preview — set from __sanity_preview_dataset cookie so the live preview
   * shows content from the Studio workspace (production vs dev) that opened it.
   */
  dataset?: string;
}

/**
 * Check if Visual Editing / draft mode is active.
 * True when site-wide toggle is on OR per-request draft cookie is set.
 */
function isDraftMode(draftMode?: boolean): boolean {
  return siteWideVisualEditing || draftMode === true;
}

/**
 * Resolve perspective for fetch: use URL param when in preview, else "published".
 */
function resolvePerspective(inPreview: boolean, perspectiveParam?: string): string {
  if (!inPreview) return "published";
  if (perspectiveParam === "published") return "published";
  if (perspectiveParam === "drafts" || !perspectiveParam) return "drafts";
  // Release ID(s) or other perspective
  return perspectiveParam;
}

/**
 * Fetch from Sanity with Visual Editing support.
 *
 * For pages: pass `draftMode: Astro.cookies.has('__sanity_preview')`
 * and `perspective: Astro.url.searchParams.get('sanity-preview-perspective') ?? undefined`
 * so perspective switches in Studio (published/drafts/releases) show the correct content.
 */
export async function loadQuery<T>({
  query,
  params,
  draftMode,
  perspective: perspectiveParam,
  dataset: datasetOverride,
}: LoadQueryOptions): Promise<{ data: T }> {
  const inPreview = isDraftMode(draftMode);
  const perspective = resolvePerspective(inPreview, perspectiveParam);

  const needsToken = inPreview && perspective !== "published";
  if (needsToken && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.",
    );
  }

  const client =
    inPreview && datasetOverride
      ? getClientForDataset(datasetOverride)
      : sanityClient;

  const fetchOptions = {
    filterResponse: false,
    perspective,
    resultSourceMap: inPreview ? "withKeyArraySelector" : false,
    stega: inPreview,
    ...(needsToken ? { token } : {}),
    useCdn: perspective === "published",
  };
  const response = await client.fetch<T>(query, params ?? {}, fetchOptions as Parameters<typeof client.fetch>[2]);
  const result = (response as { result: T }).result ?? (response as T);
  return { data: result };
}

/**
 * Simple fetch for non-visual-editing contexts (RSS, sitemap, etc.)
 * where stega encoding would corrupt output.
 * Optional dataset uses the same per-dataset client as loadQuery when in preview.
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  dataset?: string,
): Promise<T> {
  const client = dataset ? getClientForDataset(dataset) : sanityClient;
  return client.fetch<T>(query, params ?? {});
}
