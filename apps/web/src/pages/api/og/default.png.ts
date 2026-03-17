/**
 * Default OG image — isolate emoji vs spans in logo row.
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
import { loadFonts } from "../../../lib/og-utils";

export const prerender = false;

const base = (inner: string) =>
  `<div style="display:flex;width:1200px;height:630px;background:#000;padding:60px"><div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:space-between">${inner}<div style="display:flex;color:#fff;font-size:48px">Title</div><div style="display:flex;color:#888;font-size:16px">Footer</div></div></div>`;

export const GET: APIRoute = async ({ url }) => {
  const variant = url.searchParams.get("v") || "1";

  const variants: Record<string, string> = {
    // 1: Just text, no emoji, no spans
    "1": base('<div style="display:flex;align-items:center;gap:12px"><div style="color:#fff;font-size:24px">CodingCat.dev</div></div>'),
    // 2: Emoji only (is HTMLRewriter chunking the emoji?)
    "2": base('<div style="display:flex;align-items:center;gap:12px"><div style="font-size:40px">🐱</div><div style="color:#fff;font-size:24px">CodingCat.dev</div></div>'),
    // 3: Spans only, no emoji
    "3": base('<div style="display:flex;align-items:center;gap:12px"><div style="display:flex;font-size:24px;color:#fff"><span>CodingCat</span><span style="color:#7c3aed">.dev</span></div></div>'),
    // 4: Emoji + spans (full logo)
    "4": base('<div style="display:flex;align-items:center;gap:12px"><div style="font-size:40px">🐱</div><div style="display:flex;font-size:24px;font-weight:700;color:#fff"><span>CodingCat</span><span style="color:#7c3aed">.dev</span></div></div>'),
    // 5: ASCII cat instead of emoji
    "5": base('<div style="display:flex;align-items:center;gap:12px"><div style="font-size:40px">CC</div><div style="display:flex;font-size:24px;font-weight:700;color:#fff"><span>CodingCat</span><span style="color:#7c3aed">.dev</span></div></div>'),
  };

  const html = variants[variant] || variants["1"];

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
      return new Response(JSON.stringify({ error: "Empty buffer", variant }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(buffer, {
      headers: { "Content-Type": "image/png", "Content-Length": buffer.byteLength.toString() },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, variant }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};
