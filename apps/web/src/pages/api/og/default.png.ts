/**
 * Default OG image — debug version to surface runtime errors.
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
    const fonts = loadFonts();

    // Debug: font info
    const fontDebug = fonts.map((f: any) => ({
      name: f.name,
      weight: f.weight,
      dataType: typeof f.data,
      isUint8Array: f.data instanceof Uint8Array,
      isArrayBuffer: f.data instanceof ArrayBuffer,
      length: f.data?.byteLength || f.data?.length || 0,
      constructor: f.data?.constructor?.name,
      first4Bytes: f.data ? Array.from(new Uint8Array(f.data instanceof ArrayBuffer ? f.data : f.data.buffer || f.data).slice(0, 4)) : null,
    }));

    // Await the body to catch stream errors
    const ogResponse = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts,
    });

    const body = await ogResponse.arrayBuffer();

    if (body.byteLength === 0) {
      return new Response(
        JSON.stringify({
          error: "Empty body from ImageResponse",
          fontDebug,
          htmlSnippet: html.slice(0, 500),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        name: error.name,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
