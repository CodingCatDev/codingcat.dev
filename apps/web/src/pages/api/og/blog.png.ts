/**
 * Dynamic OG image generation for blog posts.
 *
 * Uses workers-og (Satori + resvg-wasm) to generate 1200x630 PNG images
 * on Cloudflare Workers. Brand tokens from the design system.
 *
 * Usage: /api/og/blog.png?title=My+Post&author=Alex+Patterson
 *
 * Query params:
 * - title (required): Post title
 * - author (optional): Author name
 * - type (optional): Content type badge text (default: "Blog")
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { generateOgHtml, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get("title") || "CodingCat.dev";
    const author = url.searchParams.get("author") || "CodingCat.dev";
    const type = url.searchParams.get("type") || "Blog";

    const html = generateOgHtml({ title, author, type });

    const response = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    response.headers.set("Cache-Control", OG_CACHE_HEADER);

    return response;
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
