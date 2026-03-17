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

// Create client explicitly so we don't rely on the "sanity:client" virtual module,
// which can fail to resolve in some Vite/Astro contexts (e.g. config loading).
const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || "hfh83o0w",
  dataset: import.meta.env.SANITY_DATASET || "production",
  apiVersion: "2026-03-17",
  useCdn: false,
  stega: {
    studioUrl,
  },
});

const builder = imageUrlBuilder(sanityClient);

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
}

/**
 * Check if Visual Editing / draft mode is active.
 * True when site-wide toggle is on OR per-request draft cookie is set.
 */
function isDraftMode(draftMode?: boolean): boolean {
  return siteWideVisualEditing || draftMode === true;
}

/**
 * Fetch from Sanity with Visual Editing support.
 *
 * For pages: pass `draftMode: Astro.cookies.has('__sanity_preview')`
 * to enable per-request draft mode from the preview cookie.
 */
export async function loadQuery<T>({
  query,
  params,
  draftMode,
}: LoadQueryOptions): Promise<{ data: T }> {
  const drafts = isDraftMode(draftMode);

  if (drafts && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.",
    );
  }

  const perspective = drafts ? "drafts" : "published";

  const { result, resultSourceMap } = await sanityClient.fetch<T>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: drafts ? "withKeyArraySelector" : false,
      stega: drafts,
      ...(drafts ? { token } : {}),
      useCdn: !drafts,
    },
  );

  return { data: result };
}

/**
 * Simple fetch for non-visual-editing contexts (RSS, sitemap, etc.)
 * where stega encoding would corrupt output.
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {});
}
