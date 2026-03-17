/**
 * Default OG image generation for generic pages.
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

    // Use og() directly via ImageResponse + arrayBuffer() to catch stream errors
    const ogResponse = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    const body = await ogResponse.arrayBuffer();

    if (body.byteLength === 0) {
      return new Response(
        JSON.stringify({ error: "Empty body", htmlLength: html.length }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": body.byteLength.toString(),
        "Cache-Control": OG_CACHE_HEADER,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
