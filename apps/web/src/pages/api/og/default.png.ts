/**
 * Default OG image generation for generic pages.
 * 
 * Debug version: bypasses ImageResponse's ReadableStream to surface errors.
 * Uses workers-og's ImageResponse but reads the body to catch stream errors.
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

    // Debug: log font data types to understand what rawFonts plugin produces
    const fontDebug = fonts.map((f: any) => ({
      name: f.name,
      weight: f.weight,
      dataType: typeof f.data,
      isArrayBuffer: f.data instanceof ArrayBuffer,
      isUint8Array: f.data instanceof Uint8Array,
      dataLength: f.data?.byteLength || f.data?.length || 0,
      constructor: f.data?.constructor?.name,
    }));

    // Create ImageResponse — this returns immediately with a ReadableStream body
    const ogResponse = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts,
    });

    // Read the body to force the stream to execute (and catch errors)
    const body = await ogResponse.arrayBuffer();

    if (body.byteLength === 0) {
      // Stream produced no data — WASM or font error was swallowed
      return new Response(
        JSON.stringify({
          error: "ImageResponse produced empty body",
          fontDebug,
          htmlLength: html.length,
          hint: "WASM init or font loading likely failed silently inside ReadableStream",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Success — return the PNG with proper headers
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
