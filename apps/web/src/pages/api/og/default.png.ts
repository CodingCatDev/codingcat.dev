/**
 * Default OG image for generic pages.
 *
 * Uses workers-og with React element objects (bypasses HTMLRewriter).
 *
 * Usage: /api/og/default.png?title=Page+Title&subtitle=Optional+Subtitle
 *
 * Query params:
 * - title (optional): Page title (default: "CodingCat.dev")
 * - subtitle (optional): Subtitle text
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { buildDefaultOgElement, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get("title") || "CodingCat.dev";
    const subtitle = url.searchParams.get("subtitle") || undefined;

    const element = buildDefaultOgElement({ title, subtitle });

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
