/**
 * Default OG image generation for generic pages.
 *
 * Uses workers-og (Satori + resvg-wasm) to generate 1200x630 PNG images
 * on Cloudflare Workers. Simpler layout — just branding + title + optional subtitle.
 * Used for homepage, author pages, and other generic pages.
 *
 * Usage: /api/og/default.png?title=About+Us&subtitle=Learn+more+about+CodingCat.dev
 *
 * Query params:
 * - title (required): Page title
 * - subtitle (optional): Subtitle text
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { generateDefaultOgHtml, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get("title") || "CodingCat.dev";
    const subtitle = url.searchParams.get("subtitle") || undefined;

    const html = generateDefaultOgHtml({ title, subtitle });

    const response = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    response.headers.set("Cache-Control", OG_CACHE_HEADER);

    return response;
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        name: error.name,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
