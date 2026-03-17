/**
 * Default OG image — systematic isolation test.
 * Tests increasingly complex HTML to find the breaking point.
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { generateDefaultOgHtml, loadFonts } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const level = url.searchParams.get("level") || "full";

  // Level 1: Single div (known working)
  const html1 = '<div style="display:flex;width:1200px;height:630px;background:#000;color:#fff;font-size:48px;align-items:center;justify-content:center">Hello World</div>';

  // Level 2: Two nested divs
  const html2 = '<div style="display:flex;width:1200px;height:630px;background:#000"><div style="display:flex;color:#fff;font-size:48px;align-items:center;justify-content:center;width:100%;height:100%">Hello World</div></div>';

  // Level 3: Column layout with 3 children
  const html3 = '<div style="display:flex;width:1200px;height:630px;background:#000;padding:60px"><div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:space-between"><div style="display:flex;color:#fff;font-size:24px">Top</div><div style="display:flex;color:#fff;font-size:48px">Middle</div><div style="display:flex;color:#fff;font-size:16px">Bottom</div></div></div>';

  // Level 4: Logo with emoji + spans
  const html4 = '<div style="display:flex;width:1200px;height:630px;background:#000;padding:60px"><div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:space-between"><div style="display:flex;align-items:center;gap:12px"><div style="font-size:40px">🐱</div><div style="display:flex;font-size:24px;font-weight:700;color:#fff"><span>CodingCat</span><span style="color:#7c3aed">.dev</span></div></div><div style="display:flex;color:#fff;font-size:48px">Title</div><div style="display:flex;color:#888;font-size:16px">codingcat.dev</div></div></div>';

  // Level 5: Full template
  const html5 = generateDefaultOgHtml({ title: "Test Title" });

  const htmlMap: Record<string, string> = { "1": html1, "2": html2, "3": html3, "4": html4, "5": html5, full: html5 };
  const html = htmlMap[level] || html5;

  if (url.searchParams.get("mode") === "dump") {
    return new Response(html, { headers: { "Content-Type": "text/plain" } });
  }

  try {
    const response = new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Empty buffer", level }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(buffer, {
      headers: { "Content-Type": "image/png", "Content-Length": buffer.byteLength.toString() },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, level }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};
