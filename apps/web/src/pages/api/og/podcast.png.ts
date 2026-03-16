/**
 * Dynamic OG image generation for podcast episodes.
 *
 * Uses workers-og (Satori + resvg-wasm) to generate 1200x630 PNG images
 * on Cloudflare Workers. Same layout as blog but with podcast amber color.
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
import { generateOgHtml, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get("title") || "CodingCat.dev";
  const author = url.searchParams.get("author") || "CodingCat.dev";
  const type = url.searchParams.get("type") || "Podcast";
  const episodeNumber = url.searchParams.get("episodeNumber") || undefined;

  const html = generateOgHtml({ title, author, type, episodeNumber });

  const response = new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: loadFonts(),
  });

  response.headers.set("Cache-Control", OG_CACHE_HEADER);

  return response;
};
