/**
 * Shared OG image generation utilities.
 *
 * Uses React element objects (plain VDOM) instead of HTML strings.
 * workers-og's HTMLRewriter-based parseHtml corrupts HTML→VDOM on
 * Cloudflare Workers (text chunking, phantom child nodes). Passing
 * React element objects directly to ImageResponse bypasses parseHtml
 * entirely and works reliably.
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

// ── React element helper (plain VDOM objects) ────────────────────────
// workers-og's ImageResponse accepts React.ReactNode. These plain objects
// match the { type, props: { style, children } } shape that Satori expects.

function h(
  type: string,
  props: Record<string, any>,
  ...children: any[]
): any {
  const flatChildren = children.flat().filter((c) => c != null);
  return {
    type,
    props: {
      ...props,
      children: flatChildren.length === 1 ? flatChildren[0] : flatChildren.length === 0 ? undefined : flatChildren,
    },
  };
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

// ── Shared element builders ──────────────────────────────────────────

function logoElement() {
  return h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "12px" } },
    h("div", { style: { fontSize: "40px" } }, "🐱"),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: "24px",
          fontWeight: 700,
          color: BRAND.text,
        },
      },
      h("span", { style: {} }, "CodingCat"),
      h("span", { style: { color: BRAND.primary } }, ".dev"),
    ),
  );
}

function badgeElement(type: string, typeColor: string, episodeNumber?: string) {
  const children: any[] = [
    h(
      "div",
      {
        style: {
          display: "flex",
          padding: "6px 16px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 600,
          textTransform: "uppercase" as any,
          letterSpacing: "0.05em",
          color: typeColor,
          background: typeColor + "26",
          border: `1px solid ${typeColor}40`,
        },
      },
      type,
    ),
  ];

  if (episodeNumber) {
    children.push(
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "14px",
            fontWeight: 600,
            color: typeColor,
            marginTop: "4px",
          },
        },
        `Episode ${episodeNumber}`,
      ),
    );
  }

  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      },
    },
    ...children,
  );
}

function authorElement(author: string) {
  return h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "12px" } },
    h(
      "div",
      {
        style: {
          display: "flex",
          width: "44px",
          height: "44px",
          background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
          borderRadius: "50%",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "16px",
          color: "white",
        },
      },
      authorInitials(author),
    ),
    h(
      "div",
      {
        style: {
          fontSize: "18px",
          fontWeight: 500,
          color: BRAND.textSecondary,
        },
      },
      author,
    ),
  );
}

function urlElement() {
  return h(
    "div",
    { style: { fontSize: "16px", color: BRAND.textTertiary } },
    "codingcat.dev",
  );
}

// ── Public element generators ────────────────────────────────────────

export interface OgElementOptions {
  title: string;
  author?: string;
  type?: string;
  episodeNumber?: string;
}

/**
 * Builds the full-featured OG element (blog, podcast, course).
 * Returns a React element object for ImageResponse.
 */
export function buildOgElement({
  title,
  author = "CodingCat.dev",
  type = "Blog",
  episodeNumber,
}: OgElementOptions): any {
  const typeColor = TYPE_COLORS[type] || BRAND.typeBlog;
  const fontSize = titleFontSize(title);

  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: BRAND.bgGradient,
        padding: "60px",
        fontFamily: "'Inter', sans-serif",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        },
      },
      // Top row: logo + badge
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        logoElement(),
        badgeElement(type, typeColor, episodeNumber),
      ),
      // Middle: title
      h(
        "div",
        {
          style: {
            display: "flex",
            flex: 1,
            alignItems: "center",
            padding: "20px 0",
          },
        },
        h(
          "div",
          {
            style: {
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              color: BRAND.text,
              maxWidth: "100%",
              overflow: "hidden",
            },
          },
          title,
        ),
      ),
      // Bottom row: author + URL
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        authorElement(author),
        urlElement(),
      ),
    ),
  );
}

/**
 * Builds a simpler OG element for default/generic pages.
 * Returns a React element object for ImageResponse.
 */
export function buildDefaultOgElement({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): any {
  const fontSize = titleFontSize(title);

  const titleChildren: any[] = [
    h(
      "div",
      {
        style: {
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          lineHeight: 1.15,
          color: BRAND.text,
          maxWidth: "100%",
          overflow: "hidden",
        },
      },
      title,
    ),
  ];

  if (subtitle) {
    titleChildren.push(
      h(
        "div",
        {
          style: {
            fontSize: "24px",
            fontWeight: 400,
            color: BRAND.textSecondary,
            marginTop: "16px",
            lineHeight: 1.4,
          },
        },
        subtitle,
      ),
    );
  }

  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: BRAND.bgGradient,
        padding: "60px",
        fontFamily: "'Inter', sans-serif",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        },
      },
      // Top: logo
      logoElement(),
      // Middle: title + optional subtitle
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            padding: "20px 0",
          },
        },
        ...titleChildren,
      ),
      // Bottom: URL (right-aligned)
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          },
        },
        urlElement(),
      ),
    ),
  );
}
