/**
 * Minimal OG image test — single div, no nesting.
 * If this fails, the problem is workers-og/fonts/WASM, not templates.
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { loadFonts } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const html = '<div style="display:flex;width:1200px;height:630px;background:#000;color:#fff;font-size:48px;align-items:center;justify-content:center">Hello World</div>';

    const response = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Empty buffer", htmlLength: html.length }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
