/**
 * Dynamic OG image generation for courses.
 *
 * Uses workers-og with React element objects (bypasses HTMLRewriter).
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
import { buildOgElement, loadFonts, OG_CACHE_HEADER } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get("title") || "CodingCat.dev";
    const author = url.searchParams.get("author") || "CodingCat.dev";
    const type = url.searchParams.get("type") || "Course";

    const element = buildOgElement({ title, author, type });

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
