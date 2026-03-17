/**
 * Dynamic OG image generation for podcast episodes.
 *
 * Uses workers-og with React element objects (bypasses HTMLRewriter).
 *
 * Usage: /api/og/podcast.png?title=My+Episode&author=Alex+Patterson&episodeNumber=42
 *
 * Query params:
 * - title (required): Episode title
 * - author (optional): Host name
 * - type (optional): Content type badge text (default: "Podcast")
 * - episodeNumber (optional): Episode number — shown below badge
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { buildOgElement, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get("title") || "CodingCat.dev";
    const author = url.searchParams.get("author") || "CodingCat.dev";
    const type = url.searchParams.get("type") || "Podcast";
    const episodeNumber = url.searchParams.get("episodeNumber") || undefined;

    const element = buildOgElement({ title, author, type, episodeNumber });

    const response = new ImageResponse(element, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": OG_CACHE_HEADER,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
