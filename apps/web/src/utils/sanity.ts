/**
 * Draft-aware Sanity query helper with Visual Editing support.
 *
 * When Visual Editing is enabled (PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true):
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
import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

/**
 * Fetch from Sanity with Visual Editing support.
 * Use this instead of sanityClient.fetch() directly.
 */
export async function loadQuery<T>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}): Promise<{ data: T }> {
  if (visualEditingEnabled && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.",
    );
  }

  const perspective = visualEditingEnabled ? "drafts" : "published";

  const { result, resultSourceMap } = await sanityClient.fetch<T>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
      stega: visualEditingEnabled,
      ...(visualEditingEnabled ? { token } : {}),
      useCdn: !visualEditingEnabled,
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
