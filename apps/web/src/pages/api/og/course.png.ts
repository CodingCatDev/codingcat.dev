/**
 * Dynamic OG image generation for courses.
 *
 * Uses workers-og (Satori + resvg-wasm) to generate 1200x630 PNG images
 * on Cloudflare Workers. Same layout as blog but with course emerald color.
 *
 * Usage: /api/og/course.png?title=My+Course&author=Alex+Patterson
 *
 * Query params:
 * - title (required): Course title
 * - author (optional): Instructor name
 * - type (optional): Content type badge text (default: "Course")
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { generateOgHtml, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get("title") || "CodingCat.dev";
  const author = url.searchParams.get("author") || "CodingCat.dev";
  const type = url.searchParams.get("type") || "Course";

  const html = generateOgHtml({ title, author, type });

  const response = new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: loadFonts(),
  });

  response.headers.set("Cache-Control", OG_CACHE_HEADER);

  return response;
};
