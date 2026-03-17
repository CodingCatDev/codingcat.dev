/**
 * Default OG image — bypass HTMLRewriter by using React elements directly.
 * workers-og's og() accepts React.ReactNode, skipping parseHtml entirely.
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { loadFonts } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    // Pass a React element directly — bypasses HTMLRewriter parseHtml
    const element = {
      type: "div",
      props: {
        style: {
          display: "flex",
          width: 1200,
          height: 630,
          background: "#000",
          color: "#fff",
          fontSize: 48,
          alignItems: "center",
          justifyContent: "center",
        },
        children: "Hello World",
      },
    };

    const response = new ImageResponse(element as any, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Empty buffer" }), {
        status: 500, headers: { "Content-Type": "application/json" },
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
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};
