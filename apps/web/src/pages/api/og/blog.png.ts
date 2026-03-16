/**
 * Dynamic OG image generation for blog posts.
 *
 * Uses workers-og (Satori + resvg-wasm) to generate 1200x630 PNG images
 * on Cloudflare Workers. Brand tokens from the design system.
 *
 * Usage: /api/og/blog.png?title=My+Post&author=Alex+Patterson
 *
 * Query params:
 * - title (required): Post title
 * - author (optional): Author name
 * - type (optional): Content type badge text (default: "Blog")
 */
import type { APIRoute } from "astro";
import { ImageResponse } from "workers-og";
// @ts-ignore — loaded by rawFonts vite plugin as Uint8Array
import InterBoldData from "../../../assets/fonts/Inter-Bold.ttf";
// @ts-ignore — loaded by rawFonts vite plugin as Uint8Array
import InterRegularData from "../../../assets/fonts/Inter-Regular.ttf";

export const prerender = false;

// Brand tokens from design system
const BRAND = {
  bg: "#000000",
  bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
  primary: "#7c3aed",
  primaryLight: "#8b5cf6",
  text: "#ffffff",
  textSecondary: "#a3a3a3",
  textTertiary: "#737373",
  surface: "#1a1a1a",
  border: "#262626",
  typeBlog: "#3b82f6",
  typePodcast: "#f59e0b",
  typeCourse: "#10b981",
  typeVideo: "#ef4444",
};

const TYPE_COLORS: Record<string, string> = {
  Blog: BRAND.typeBlog,
  Podcast: BRAND.typePodcast,
  Course: BRAND.typeCourse,
  Video: BRAND.typeVideo,
};

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get("title") || "CodingCat.dev";
  const author = url.searchParams.get("author") || "CodingCat.dev";
  const type = url.searchParams.get("type") || "Blog";
  const typeColor = TYPE_COLORS[type] || BRAND.typeBlog;

  // Resolve font data — rawFonts plugin returns Uint8Array
  const InterBold = (InterBoldData as any).buffer || InterBoldData;
  const InterRegular = (InterRegularData as any).buffer || InterRegularData;

  const html = `
    <div style="
      display: flex;
      width: 1200px;
      height: 630px;
      background: ${BRAND.bgGradient};
      padding: 60px;
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    ">
      <div style="
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: space-between;
      ">
        <!-- Top: Logo + Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 40px;">🐱</div>
            <div style="
              font-size: 24px;
              font-weight: 700;
              color: ${BRAND.text};
            ">CodingCat<span style="color: ${BRAND.primary};">.dev</span></div>
          </div>
          <div style="
            display: flex;
            padding: 6px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${typeColor};
            background: ${typeColor}26;
            border: 1px solid ${typeColor}40;
          ">${type}</div>
        </div>

        <!-- Middle: Title -->
        <div style="
          display: flex;
          flex: 1;
          align-items: center;
          padding: 20px 0;
        ">
          <div style="
            font-size: ${title.length > 60 ? 42 : title.length > 40 ? 48 : 56}px;
            font-weight: 700;
            line-height: 1.15;
            color: ${BRAND.text};
            max-width: 100%;
            overflow: hidden;
          ">${title}</div>
        </div>

        <!-- Bottom: Author + URL -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="
              display: flex;
              width: 44px;
              height: 44px;
              background: linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight});
              border-radius: 50%;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 16px;
              color: white;
            ">${author.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}</div>
            <div style="
              font-size: 18px;
              font-weight: 500;
              color: ${BRAND.textSecondary};
            ">${author}</div>
          </div>
          <div style="
            font-size: 16px;
            color: ${BRAND.textTertiary};
          ">codingcat.dev</div>
        </div>
      </div>
    </div>
  `;

  const response = new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: InterBold,
        style: "normal" as const,
        weight: 700,
      },
      {
        name: "Inter",
        data: InterRegular,
        style: "normal" as const,
        weight: 400,
      },
      {
        name: "Inter",
        data: InterRegular,
        style: "normal" as const,
        weight: 500,
      },
    ],
  });

  // Add cache headers — OG images rarely change
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800");

  return response;
};
