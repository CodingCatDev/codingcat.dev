/**
 * Shared OG image generation utilities.
 *
 * Extracts brand tokens, type colors, font loading, and HTML generation
 * into a single module so all OG endpoints stay DRY.
 *
 * IMPORTANT: Satori (via workers-og's HTMLRewriter parser) is extremely
 * strict about HTML structure:
 * - Every element with multiple children MUST have display:flex
 * - No HTML comments
 * - No whitespace between elements (parsed as text nodes)
 * - No mixed text + element content (wrap text in <span>)
 * All HTML must be fully minified — no newlines, no indentation.
 */

// @ts-ignore — loaded by rawFonts vite plugin as Uint8Array
import InterBoldData from "../assets/fonts/Inter-Bold.ttf";
// @ts-ignore — loaded by rawFonts vite plugin as Uint8Array
import InterRegularData from "../assets/fonts/Inter-Regular.ttf";

// ── Brand tokens from design system ──────────────────────────────────
export const BRAND = {
  bg: "#000000",
  bgGradient:
    "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
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
} as const;

export const TYPE_COLORS: Record<string, string> = {
  Blog: BRAND.typeBlog,
  Podcast: BRAND.typePodcast,
  Course: BRAND.typeCourse,
  Video: BRAND.typeVideo,
};

// ── Cache header value shared across all OG endpoints ────────────────
export const OG_CACHE_HEADER = "public, max-age=86400, s-maxage=604800";

// ── Font loading helper ──────────────────────────────────────────────
export function loadFonts() {
  const InterBold = (InterBoldData as any).buffer || InterBoldData;
  const InterRegular = (InterRegularData as any).buffer || InterRegularData;

  return [
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
  ];
}

// ── Adaptive title font size ─────────────────────────────────────────
export function titleFontSize(title: string): number {
  if (title.length > 60) return 42;
  if (title.length > 40) return 48;
  return 56;
}

// ── Author initials helper ───────────────────────────────────────────
function authorInitials(author: string): string {
  return author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── HTML generators ──────────────────────────────────────────────────
// All HTML is built as single-line strings with NO whitespace between tags.
// This prevents HTMLRewriter from creating phantom text nodes.

export interface OgHtmlOptions {
  title: string;
  author?: string;
  type?: string;
  subtitle?: string;
  episodeNumber?: string;
}

// Shared building blocks
const logo = `<div style="display:flex;align-items:center;gap:12px"><div style="font-size:40px">🐱</div><div style="display:flex;font-size:24px;font-weight:700;color:${BRAND.text}"><span>CodingCat</span><span style="color:${BRAND.primary}">.dev</span></div></div>`;

function badge(type: string, typeColor: string, episodeNumber?: string): string {
  const ep = episodeNumber ? `<div style="display:flex;font-size:14px;font-weight:600;color:${typeColor};margin-top:4px">Episode ${episodeNumber}</div>` : "";
  return `<div style="display:flex;flex-direction:column;align-items:flex-end"><div style="display:flex;padding:6px 16px;border-radius:6px;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${typeColor};background:${typeColor}26;border:1px solid ${typeColor}40">${type}</div>${ep}</div>`;
}

function authorBlock(author: string): string {
  return `<div style="display:flex;align-items:center;gap:12px"><div style="display:flex;width:44px;height:44px;background:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryLight});border-radius:50%;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:white">${authorInitials(author)}</div><div style="font-size:18px;font-weight:500;color:${BRAND.textSecondary}">${author}</div></div>`;
}

function urlBlock(): string {
  return `<div style="font-size:16px;color:${BRAND.textTertiary}">codingcat.dev</div>`;
}

/**
 * Generates the full-featured OG HTML (blog, podcast, course).
 */
export function generateOgHtml({
  title,
  author = "CodingCat.dev",
  type = "Blog",
  episodeNumber,
}: OgHtmlOptions): string {
  const typeColor = TYPE_COLORS[type] || BRAND.typeBlog;
  const fontSize = titleFontSize(title);

  return `<div style="display:flex;width:1200px;height:630px;background:${BRAND.bgGradient};padding:60px;box-sizing:border-box;font-family:'Inter',sans-serif"><div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:space-between"><div style="display:flex;align-items:center;justify-content:space-between">${logo}${badge(type, typeColor, episodeNumber)}</div><div style="display:flex;flex:1;align-items:center;padding:20px 0"><div style="font-size:${fontSize}px;font-weight:700;line-height:1.15;color:${BRAND.text};max-width:100%;overflow:hidden">${title}</div></div><div style="display:flex;align-items:center;justify-content:space-between">${authorBlock(author)}${urlBlock()}</div></div></div>`;
}

/**
 * Generates a simpler OG HTML for default/generic pages.
 */
export function generateDefaultOgHtml({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): string {
  const fontSize = titleFontSize(title);
  const subtitleHtml = subtitle
    ? `<div style="font-size:24px;font-weight:400;color:${BRAND.textSecondary};margin-top:16px;line-height:1.4">${subtitle}</div>`
    : "";

  return `<div style="display:flex;width:1200px;height:630px;background:${BRAND.bgGradient};padding:60px;box-sizing:border-box;font-family:'Inter',sans-serif"><div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:space-between">${logo}<div style="display:flex;flex-direction:column;flex:1;justify-content:center;padding:20px 0"><div style="font-size:${fontSize}px;font-weight:700;line-height:1.15;color:${BRAND.text};max-width:100%;overflow:hidden">${title}</div>${subtitleHtml}</div><div style="display:flex;align-items:center;justify-content:flex-end">${urlBlock()}</div></div></div>`;
}
