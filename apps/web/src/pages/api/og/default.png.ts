/**
 * Default OG image — debug: dump HTML to inspect what Satori receives.
 * Also test rendering with the minimal approach for comparison.
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { generateDefaultOgHtml, loadFonts } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const mode = url.searchParams.get("mode") || "render";
  const title = url.searchParams.get("title") || "CodingCat.dev";
  const subtitle = url.searchParams.get("subtitle") || undefined;

  const html = generateDefaultOgHtml({ title, subtitle });

  // Mode: dump — return raw HTML for inspection
  if (mode === "dump") {
    return new Response(html, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Mode: render — try to generate the image
  try {
    const response = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) {
      return new Response(
        JSON.stringify({ error: "Empty buffer", htmlLength: html.length }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message, stack: e.stack }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
