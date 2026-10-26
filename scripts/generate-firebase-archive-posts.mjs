import crypto from "node:crypto";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const isDryRun = process.argv.includes("--dry-run") || !token;
const yearFilterArg = process.env.FIREBASE_ARCHIVE_YEARS || "2025,2026";
const targetYears = new Set(yearFilterArg.split(",").map((y) => y.trim()));
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const maxLimit = limitArg ? Number(limitArg.split("=")[1]) : 200;

const EXCLUDE_SLUG_REGEX =
  /(fcm-on-android|ai-logic-unity-androidxr|fpnv-|firebase-pnv-|crashlytics-android|crashlytics-mcp|crashlytics-export|dart-functions-exp|apple-foundation-models|build-ios-app|firebase-analytics-outage|brazil-roundup|ios-sdk|android-sdk|cocoapods|swiftpm|gradle|wear-os|tvos|watchos|flutter-only)/i;

function cleanDashes(text) {
  if (!text) return "";
  return String(text)
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function decodeHtmlEntities(str) {
  if (!str) return "";
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(html) {
  return decodeHtmlEntities(String(html || "").replace(/<[^>]+>/g, "")).trim();
}

function makeKey(prefix, seed) {
  const hash = crypto.createHash("md5").update(String(seed)).digest("hex").slice(0, 10);
  return `fb_${prefix}_${hash}`;
}

function createTextBlock(text, style = "normal", keySeed = text) {
  return {
    _type: "block",
    _key: makeKey(style, keySeed),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: makeKey("span", keySeed),
        marks: [],
        text: cleanDashes(text),
      },
    ],
  };
}

function createRichBlock(segments, { style = "normal", listItem = undefined, level = undefined, keySeed = "" } = {}) {
  const markDefs = [];
  const children = [];
  segments.forEach((seg, i) => {
    const rawText = cleanDashes(seg.text || "");
    if (!rawText) return;
    const marks = [];
    if (seg.strong) marks.push("strong");
    if (seg.code) marks.push("code");
    if (seg.href) {
      const markKey = makeKey(`lnk${i}`, `${keySeed}_${seg.href}_${i}`);
      markDefs.push({
        _key: markKey,
        _type: "link",
        href: seg.href,
        blank: !seg.href.startsWith("/") && !seg.href.startsWith("https://codingcat.dev"),
      });
      marks.push(markKey);
    }
    children.push({
      _type: "span",
      _key: makeKey(`spn${i}`, `${keySeed}_${rawText}_${i}`),
      marks,
      text: rawText,
    });
  });

  const block = {
    _type: "block",
    _key: makeKey(listItem ? "li" : style, keySeed || JSON.stringify(segments)),
    style,
    markDefs,
    children,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return block;
}

/**
 * Parses an HTML paragraph or list item containing <a>, <strong>, <code> into Portable Text segments.
 */
function parseInlineHtmlToSegments(html, baseUrl = "https://firebase.blog") {
  const segments = [];
  const tokenRegex = /(<a\s+[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>|<(?:strong|b)>[\s\S]*?<\/(?:strong|b)>|<code>[\s\S]*?<\/code>)/gi;
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const plain = stripTags(html.slice(lastIndex, match.index));
      if (plain) segments.push({ text: `${plain} ` });
    }
    const fullToken = match[1];
    const hrefAttr = match[2];
    const innerText = stripTags(fullToken);
    if (innerText) {
      if (hrefAttr) {
        let resolvedHref = hrefAttr;
        try {
          resolvedHref = new URL(hrefAttr, baseUrl).toString();
        } catch {}
        segments.push({ text: ` ${innerText} `, href: resolvedHref, strong: true });
      } else if (/^<(?:strong|b)>/i.test(fullToken)) {
        segments.push({ text: ` ${innerText} `, strong: true });
      } else if (/^<code>/i.test(fullToken)) {
        segments.push({ text: ` ${innerText} `, code: true });
      }
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < html.length) {
    const tail = stripTags(html.slice(lastIndex));
    if (tail) segments.push({ text: ` ${tail}` });
  }

  if (segments.length === 0) {
    const fallback = stripTags(html);
    if (fallback) segments.push({ text: fallback });
  }
  return segments;
}

/**
 * Fetches and parses a firebase.blog article page.
 */
async function fetchAndParseFirebaseBlogPost(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "CodingCatDev-FirebaseArchive/1.0" },
  });
  if (!res.ok) return null;
  const html = await res.text();

  const rawTitle = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  if (!rawTitle || rawTitle.includes("404")) return null;

  // Extract publish date and add +1 day
  const dateText =
    stripTags(html.match(/<div[^>]*class="[^"]*post-date[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || "") ||
    html.match(/published on ([A-Z][a-z]+\s+\d{1,2},\s+20\d{2})/i)?.[1];

  let originalDate = new Date("2025-01-15T14:00:00.000Z");
  if (dateText) {
    const parsed = new Date(`${dateText} 14:00:00 UTC`);
    if (!Number.isNaN(parsed.getTime())) {
      originalDate = parsed;
    }
  } else {
    const m = url.match(/\/posts\/(\d{4})\/(\d{2})\//);
    if (m) {
      originalDate = new Date(`${m[1]}-${m[2]}-15T14:00:00.000Z`);
    }
  }
  const plusOneDayDate = new Date(originalDate.getTime() + 24 * 60 * 60 * 1000);

  // Extract author names
  const authors = [...html.matchAll(/<div class="_name_[^"]+">([\s\S]*?)<\/div>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean);

  // Extract <article class="content">...</article>
  const articleMatch = html.match(/<article[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
  const articleHtml = articleMatch ? articleMatch[1] : html;

  // Check if the body is strictly iOS/Android-only without web relevance
  const plainArticle = stripTags(articleHtml);
  const hasWebOrCloudSignal =
    /\b(web|javascript|typescript|node\.?js|next\.?js|react|angular|svelte|vue|astro|firestore|data connect|sql|postgresql|genkit|studio|app hosting|cloud functions|mcp|gemini|vertex|security rules|app check|remote config|hosting|emulator|cli|ssr|browser|http)\b/i.test(
      `${rawTitle} ${plainArticle}`
    );
  if (!hasWebOrCloudSignal) return null;

  // Parse ordered structural elements (h2, h3, p, ul, pre) from articleHtml
  const elements = [];
  const blockRegex =
    /<(h2|h3|p|ul|pre)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = blockRegex.exec(articleHtml)) !== null) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] || "";
    const inner = match[3] || "";

    if (tag === "h2" || tag === "h3") {
      const text = cleanDashes(stripTags(inner));
      if (text && text.length > 2 && !/^(the firebase blog|share|related)$/i.test(text)) {
        elements.push({ type: "heading", style: tag, text });
      }
    } else if (tag === "p") {
      const text = cleanDashes(stripTags(inner));
      if (text && text.length >= 35) {
        const segments = parseInlineHtmlToSegments(inner, url);
        elements.push({ type: "paragraph", text, segments });
      }
    } else if (tag === "ul") {
      const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((m) => ({
          text: cleanDashes(stripTags(m[1])),
          segments: parseInlineHtmlToSegments(m[1], url),
        }))
        .filter((it) => it.text.length >= 10);
      if (items.length > 0) {
        elements.push({ type: "list", items: items.slice(0, 8) });
      }
    } else if (tag === "pre") {
      const langMatch = attrs.match(/data-language="([^"]+)"/i);
      const rawLang = (langMatch?.[1] || "typescript").toLowerCase();
      const langMap = {
        ts: "typescript",
        tsx: "tsx",
        js: "javascript",
        jsx: "jsx",
        sh: "bash",
        shell: "bash",
        bash: "bash",
        zsh: "bash",
        sql: "sql",
        graphql: "graphql",
        gql: "graphql",
        json: "json",
        yaml: "yaml",
        html: "html",
        css: "css",
        python: "python",
        go: "go",
      };
      const language = langMap[rawLang] || "typescript";
      const codeLines = [...inner.matchAll(/<span class="line">([\s\S]*?)<\/span>/gi)].map((m) =>
        decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ""))
      );
      const codeText = (codeLines.length > 0 ? codeLines.join("\n") : stripTags(inner)).trim();
      if (codeText.length >= 15) {
        elements.push({ type: "code", language, code: codeText.slice(0, 3500) });
      }
    }
  }

  return {
    sourceUrl: url,
    originalTitle: cleanDashes(rawTitle),
    originalDateIso: originalDate.toISOString(),
    publishDateIso: plusOneDayDate.toISOString(),
    originalDateLabel: originalDate.toISOString().slice(0, 10),
    publishDateLabel: plusOneDayDate.toISOString().slice(0, 10),
    authors: authors.length > 0 ? authors : ["Firebase Engineering Team"],
    elements,
  };
}

function inferTagsForPost(title, elements) {
  const fullText = `${title} ${elements.map((e) => e.text || "").join(" ")}`;
  const tags = [
    { _type: "tag", _key: "tag_firebase", label: "Firebase", value: "firebase" },
    { _type: "tag", _key: "tag_google_cloud", label: "Google Cloud", value: "google-cloud" },
    { _type: "tag", _key: "tag_webdev", label: "Web Dev", value: "webdev" },
  ];

  const rules = [
    { label: "AI", value: "ai", regex: /\b(ai|gemini|genkit|vertex|agent|llm|prompt|inference)\b/i },
    { label: "MCP", value: "mcp", regex: /\b(mcp|model context protocol|antigravity)\b/i },
    { label: "SQL", value: "sql", regex: /\b(data connect|sql|postgresql|postgres|graphql)\b/i },
    { label: "Next.js", value: "nextjs", regex: /\b(next\.?js|app hosting|ssr|app router)\b/i },
    { label: "React", value: "react", regex: /\b(react|jsx|tsx)\b/i },
    { label: "Angular", value: "angular", regex: /\b(angular)\b/i },
    { label: "Svelte", value: "svelte", regex: /\b(svelte|sveltekit)\b/i },
    { label: "TypeScript", value: "typescript", regex: /\b(typescript|sdk|client|functions)\b/i },
    { label: "Security", value: "security", regex: /\b(security|app check|auth|rules|abuse|protect)\b/i },
    { label: "Serverless", value: "serverless", regex: /\b(cloud functions|serverless|app hosting|triggers)\b/i },
  ];

  for (const r of rules) {
    if (r.regex.test(fullText)) {
      tags.push({ _type: "tag", _key: `tag_${r.value}`, label: r.label, value: r.value });
    }
  }
  return tags;
}

function pickBestFirebaseYouTubeVideo(parsedPost, firebaseVideoCatalog) {
  const text = `${parsedPost.originalTitle} ${parsedPost.elements.map((e) => e.text || "").join(" ")}`.toLowerCase();

  // Priority topical matches from CodingCat.dev's 29 Firebase videos
  const findBySlugOrTitle = (pattern) =>
    firebaseVideoCatalog.find((v) => pattern.test(`${v.slug} ${v.title}`));

  if (/\b(data connect|sql|postgresql|graphql|schema|relational)\b/.test(text)) {
    return findBySlugOrTitle(/data-connect/) || firebaseVideoCatalog[0];
  }
  if (/\b(security|app check|abuse|protect|rules|auth)\b/.test(text)) {
    return findBySlugOrTitle(/security-rules|app-check/) || firebaseVideoCatalog[0];
  }
  if (/\b(next\.?js|ssr|app hosting|react|turborepo)\b/.test(text)) {
    return findBySlugOrTitle(/next-js-and-firebase|rxfire-in-reactjs/) || firebaseVideoCatalog[0];
  }
  if (/\b(svelte|sveltekit)\b/.test(text)) {
    return findBySlugOrTitle(/rxfire-in-svelte/) || firebaseVideoCatalog[0];
  }
  if (/\b(hosting|deploy|ci\/cd|cloud build)\b/.test(text)) {
    return findBySlugOrTitle(/multisite-hosting|repositories-ci-cd/) || firebaseVideoCatalog[0];
  }
  if (/\b(firestore|pipeline|document|collection|mongodb)\b/.test(text)) {
    return findBySlugOrTitle(/backup-sanity-with-cloud-firestore|data-connect/) || firebaseVideoCatalog[0];
  }
  return (
    findBySlugOrTitle(/data-connect|next-js-and-firebase|firebase-security-rules/) ||
    firebaseVideoCatalog[0]
  );
}

function buildFallbackCodeSample(parsedPost, tags) {
  const tagVals = new Set(tags.map((t) => t.value));
  if (tagVals.has("sql")) {
    return {
      language: "graphql",
      code: `# Firebase Data Connect Schema & Type-Safe Web Query
type Project @table {
  id: UUID! @default(expr: "uuidV4()")
  title: String!
  ownerUid: String! @default(expr: "auth.uid")
  createdAt: Timestamp! @default(expr: "request.time")
}

query ListUserProjects @auth(level: USER) {
  projects(where: { ownerUid: { eq_expr: "auth.uid" } }, orderBy: [{ createdAt: DESC }]) {
    id
    title
    createdAt
  }
}`,
    };
  }
  if (tagVals.has("ai") || tagVals.has("mcp")) {
    return {
      language: "typescript",
      code: `import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

// Protect AI endpoints in web apps with Firebase App Check
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}

const ai = getAI(app, { backend: new GoogleAIBackend() });
export const geminiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });`,
    };
  }
  return {
    language: "typescript",
    code: `import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);`,
  };
}

/**
 * Generates a 1200x630 dark-mode SVG cover card and converts/uploads it to Sanity Assets.
 */
function buildCoverSvg(title, dateLabel, tags) {
  const esc = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Wrap title into up to 3 lines of ~30 chars
  const words = cleanDashes(title).split(/\s+/);
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 30 && lines.length < 2) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current.slice(0, 34));

  const tagBadges = tags
    .slice(0, 4)
    .map((t, i) => {
      const x = 80 + i * 210;
      return `<g transform="translate(${x}, 495)">
        <rect width="190" height="44" rx="22" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="95" y="28" text-anchor="middle" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700">${esc(
          t.label
        )}</text>
      </g>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b0f19"/>
        <stop offset="55%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="50%" stop-color="#ef4444"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="0" y="0" width="1200" height="10" fill="url(#accent)"/>
    <circle cx="1080" cy="120" r="220" fill="#f59e0b" opacity="0.08"/>
    <circle cx="160" cy="540" r="260" fill="#ec4899" opacity="0.07"/>
    <rect x="60" y="50" width="1080" height="530" rx="24" fill="#0f172a" fill-opacity="0.75" stroke="#334155" stroke-width="2"/>
    
    <!-- Top Header Pill -->
    <rect x="80" y="82" width="380" height="44" rx="10" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="102" y="111" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800">FIREBASE WEB &amp; AI DEEP DIVE</text>
    
    <text x="1100" y="111" text-anchor="end" fill="#94a3b8" font-family="monospace" font-size="20" font-weight="600">CodingCat.dev • ${esc(
      dateLabel
    )}</text>

    <!-- Main Title Lines -->
    ${lines
      .map(
        (line, idx) =>
          `<text x="80" y="${215 + idx * 72}" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="800">${esc(
            line
          )}</text>`
      )
      .join("\n")}

    <!-- Subtitle -->
    <text x="80" y="445" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500">Full-Stack Web Implementation Guide, Code Examples &amp; Production Architecture</text>

    <!-- Tag Pills -->
    ${tagBadges}
  </svg>`;
}

async function uploadCoverToSanity(svgString, filename, targetDataset) {
  let bodyBuffer = Buffer.from(svgString, "utf8");
  let contentType = "image/svg+xml";
  let finalFilename = filename;

  try {
    const sharpMod = await import("sharp");
    const sharpFn = sharpMod.default || sharpMod;
    bodyBuffer = await sharpFn(Buffer.from(svgString, "utf8"))
      .resize(1200, 630)
      .png({ compressionLevel: 8 })
      .toBuffer();
    contentType = "image/png";
    finalFilename = filename.replace(/\.svg$/i, ".png");
  } catch {
    // Fallback to SVG if sharp is not in local path
  }

  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${targetDataset}?filename=${encodeURIComponent(
      finalFilename
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
      body: bodyBuffer,
    }
  );
  if (!res.ok) {
    throw new Error(`Failed uploading cover asset: ${res.status} ${await res.text()}`);
  }
  const { document } = await res.json();
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: document._id,
    },
  };
}

function buildSanityPostFromParsed(parsed, matchedVideoDoc, relatedFirebaseDocs, coverImageRef) {
  const urlParts = new URL(parsed.sourceUrl).pathname.split("/").filter(Boolean);
  const year = urlParts[1] || "2025";
  const month = urlParts[2] || "01";
  const rawSlug = urlParts[3] || "firebase-update";
  const slug = `firebase-${year}-${month}-${rawSlug}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 90);
  const docId = `post-fb-${year}-${month}-${rawSlug}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 90);

  const tags = inferTagsForPost(parsed.originalTitle, parsed.elements);
  const tagLabels = tags.map((t) => t.label);
  const primarySubTopic = tags.find((t) => t.value !== "firebase" && t.value !== "google-cloud" && t.value !== "webdev")?.label || "Full-Stack Web";

  const title = cleanDashes(
    parsed.originalTitle.toLowerCase().includes("firebase")
      ? `${parsed.originalTitle}: Web Architecture & Implementation Guide`
      : `${parsed.originalTitle} in Firebase: Web Architecture & Implementation Guide`
  );

  const firstParagraphs = parsed.elements.filter((e) => e.type === "paragraph").slice(0, 2);
  const leadSummary = firstParagraphs.map((p) => p.text).join(" ");
  const excerpt = cleanDashes(
    `Hands-on web engineering breakdown of "${parsed.originalTitle}" (${parsed.originalDateLabel}). Learn how to integrate ${tagLabels
      .slice(0, 4)
      .join(", ")} in production web apps with TypeScript, Security Rules, and Firebase.`
  ).slice(0, 280);

  const blocks = [];

  // 1. Speakable Opening Paragraph (`article p:first-of-type`)
  blocks.push(
    createRichBlock(
      [
        { text: `${parsed.originalTitle} `, strong: true },
        {
          text: `marks an important milestone for full-stack web and AI engineers building on Firebase and Google Cloud. Following the official announcement by ${parsed.authors.join(
            ", "
          )} on the `,
        },
        { text: "Firebase Blog", href: parsed.sourceUrl, strong: true },
        {
          text: ` (${parsed.originalDateLabel}), this hands-on CodingCat.dev implementation guide breaks down how to adopt these capabilities in modern TypeScript, Next.js, SvelteKit, React, and Angular applications. ${
            leadSummary ? leadSummary.slice(0, 320) : ""
          }`,
        },
      ],
      { style: "normal", keySeed: `speakable_${docId}` }
    )
  );

  // 2. Why This Release Matters for Web & AI Engineers
  blocks.push(
    createTextBlock(
      `Why ${parsed.originalTitle} Matters for Full-Stack Web Developers`,
      "h2",
      `h2_intro_${docId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `When evaluating every new Firebase release for our production web apps and Google Developer Expert (GDE) architecture reviews, the first question is always how it improves developer velocity, runtime security, and end-user latency in the browser and on the server. `,
        },
        {
          text: firstParagraphs[0]?.text || `This update streamlines ${tagLabels.join(", ")} workflows across client and server boundaries.`,
        },
      ],
      { style: "normal", keySeed: `p_intro_${docId}` }
    )
  );

  // 3. Transform Source Sections, Paragraphs, Lists & Code Examples
  let includedCodeBlocks = 0;
  let sectionCount = 0;

  for (let i = 0; i < parsed.elements.length; i++) {
    const el = parsed.elements[i];
    if (el.type === "heading") {
      sectionCount++;
      blocks.push(createTextBlock(el.text, el.style, `sec_h_${docId}_${i}`));
    } else if (el.type === "paragraph") {
      // Skip the very first paragraph if already used verbatim in intro
      if (i === 0) continue;
      blocks.push(
        createRichBlock(el.segments, {
          style: "normal",
          keySeed: `sec_p_${docId}_${i}`,
        })
      );
    } else if (el.type === "list") {
      el.items.forEach((item, liIdx) => {
        blocks.push(
          createRichBlock(item.segments, {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `sec_li_${docId}_${i}_${liIdx}`,
          })
        );
      });
    } else if (el.type === "code") {
      includedCodeBlocks++;
      blocks.push({
        _type: "code",
        _key: makeKey("code", `${docId}_${i}`),
        language: el.language,
        code: el.code,
      });
    }
  }

  // Ensure every post has at least one runnable TypeScript / Schema code block
  if (includedCodeBlocks === 0) {
    const sample = buildFallbackCodeSample(parsed, tags);
    blocks.push(
      createTextBlock(
        `TypeScript & Web SDK Implementation Pattern`,
        "h2",
        `h2_code_fallback_${docId}`
      )
    );
    blocks.push(
      createTextBlock(
        `Here is the baseline configuration pattern for integrating ${parsed.originalTitle} into a modern TypeScript web application:`,
        "normal",
        `p_code_fallback_${docId}`
      )
    );
    blocks.push({
      _type: "code",
      _key: makeKey("code_fb", docId),
      language: sample.language,
      code: sample.code,
    });
  }

  // 4. Production Web Architecture & 2026 Modern Context
  blocks.push(
    createTextBlock(
      `Production Web Architecture & Security Checklist`,
      "h2",
      `h2_arch_${docId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `Whether you are deploying on `,
        },
        {
          text: `Firebase App Hosting`,
          href: "https://firebase.google.com/docs/app-hosting",
          strong: true,
        },
        {
          text: `, Cloudflare Workers, or Vercel, shipping ${primarySubTopic} features to production requires defense-in-depth across three layers:`,
        },
      ],
      { style: "normal", keySeed: `p_arch_intro_${docId}` }
    )
  );

  const checklistItems = [
    [
      { text: `Enforce Firebase App Check & Attestation: `, strong: true },
      {
        text: `Protect your web endpoints, Cloud Functions, Data Connect GraphQL resolvers, and Firebase AI Logic calls against unauthorized replay or billing abuse using `,
      },
      {
        text: `Firebase App Check with reCAPTCHA Enterprise`,
        href: "https://firebase.google.com/docs/app-check",
        strong: true,
      },
      { text: `.` },
    ],
    [
      { text: `Validate Locally with the Firebase Emulator Suite: `, strong: true },
      {
        text: `Run deterministic integration tests against local Firestore, Auth, Functions, and Data Connect PostgreSQL emulators before promoting schema or rule changes to production.`,
      },
    ],
    [
      { text: `Keep Server & Client Boundaries Type-Safe: `, strong: true },
      {
        text: `Use the modular Firebase Web SDK and generated TypeScript bindings so SSR frameworks like Next.js, SvelteKit, and Angular serialize state cleanly without hydration flickers.`,
      },
    ],
  ];

  checklistItems.forEach((segs, idx) => {
    blocks.push(
      createRichBlock(segs, {
        style: "normal",
        listItem: "bullet",
        level: 1,
        keySeed: `arch_li_${docId}_${idx}`,
      })
    );
  });

  // 5. Inline CodingCat.dev YouTube Video Embed (Driving YouTube Views!)
  if (matchedVideoDoc?.youtube) {
    blocks.push(
      createTextBlock(
        `Watch Our Related Firebase Video Tutorial on YouTube`,
        "h2",
        `h2_yt_${docId}`
      )
    );
    blocks.push(
      createRichBlock(
        [
          {
            text: `Want to see how we architect and debug Firebase web applications live? Watch our related CodingCat.dev session `,
          },
          {
            text: matchedVideoDoc.title,
            href: matchedVideoDoc.youtube,
            strong: true,
          },
          { text: ` below, and make sure to ` },
          {
            text: `Subscribe to CodingCat.dev on YouTube`,
            href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
            strong: true,
          },
          { text: ` for weekly full-stack web and AI deep dives:` },
        ],
        { style: "normal", keySeed: `p_yt_intro_${docId}` }
      )
    );
    blocks.push({
      _type: "youtube",
      _key: makeKey("yt_embed", docId),
      url: matchedVideoDoc.youtube,
    });
  }

  // 6. Official References & Related CodingCat.dev Firebase Guides
  blocks.push(
    createTextBlock(
      `Resources, Official Docs & Related CodingCat.dev Guides`,
      "h2",
      `h2_res_${docId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: `Primary Release Source: `, strong: true },
        { text: `${parsed.originalTitle} on the Official Firebase Blog`, href: parsed.sourceUrl },
        { text: ` (published ${parsed.originalDateLabel} by ${parsed.authors.join(", ")})` },
      ],
      { style: "normal", listItem: "bullet", level: 1, keySeed: `res_src_${docId}` }
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: `Official Firebase Documentation: `, strong: true },
        { text: `Firebase Developer Docs & Web SDK Reference`, href: "https://firebase.google.com/docs/web/setup" },
      ],
      { style: "normal", listItem: "bullet", level: 1, keySeed: `res_docs_${docId}` }
    )
  );

  relatedFirebaseDocs.slice(0, 4).forEach((rel, idx) => {
    blocks.push(
      createRichBlock(
        [
          { text: `Related on CodingCat.dev: `, strong: true },
          {
            text: rel.title,
            href: `https://codingcat.dev/${rel._type}/${rel.slug}`,
            strong: true,
          },
        ],
        { style: "normal", listItem: "bullet", level: 1, keySeed: `res_rel_${docId}_${idx}` }
      )
    );
  });

  // 7. AEO FAQPage Section (3 Question Headings for Structured Data)
  blocks.push(
    createTextBlock(
      `Frequently Asked Questions (FAQ)`,
      "h2",
      `h2_faq_${docId}`
    )
  );

  blocks.push(
    createTextBlock(
      `What are the key capabilities introduced in ${parsed.originalTitle}?`,
      "h3",
      `h3_faq1_${docId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `${parsed.originalTitle} (announced ${parsed.originalDateLabel}) enhances the Firebase platform for ${tagLabels.join(
            ", "
          )} workloads. ${
            firstParagraphs[0]?.text || ""
          } Developers can review the official release notes on the `,
        },
        { text: "Firebase Blog", href: parsed.sourceUrl, strong: true },
        { text: " alongside the implementation patterns in this guide." },
      ],
      { style: "normal", keySeed: `p_faq1_${docId}` }
    )
  );

  blocks.push(
    createTextBlock(
      `How do web developers use ${parsed.originalTitle} with Next.js, SvelteKit, React, or Angular?`,
      "h3",
      `h3_faq2_${docId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `Web developers can integrate these features using the modular Firebase JavaScript/TypeScript SDK, Firebase Data Connect web bindings, and `,
        },
        {
          text: "Firebase App Hosting",
          href: "https://firebase.google.com/docs/app-hosting",
          strong: true,
        },
        {
          text: `. Always pair client-side SDK initialization with Firebase App Check and strict Security Rules, and test locally with the Firebase Local Emulator Suite before deploying.`,
        },
      ],
      { style: "normal", keySeed: `p_faq2_${docId}` }
    )
  );

  blocks.push(
    createTextBlock(
      `Where can I watch video tutorials on Firebase Web and AI development?`,
      "h3",
      `h3_faq3_${docId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: `You can watch our hands-on Firebase video walkthroughs on the ` },
        {
          text: "CodingCat.dev YouTube Channel",
          href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
          strong: true,
        },
        { text: `, including `, },
        {
          text: matchedVideoDoc?.title || "Firebase SQL with Data Connect",
          href: matchedVideoDoc?.youtube || "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
          strong: true,
        },
        { text: `, and browse our complete Firebase tutorial archive on CodingCat.dev.` },
      ],
      { style: "normal", keySeed: `p_faq3_${docId}` }
    )
  );

  // Note: Top-level `youtube` is intentionally omitted so Sanity Studio's "Posts -> Missing YouTube"
  // filter acts as Alex's recording queue for dedicated 2025-2026 videos!
  const doc = {
    _id: docId,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    date: parsed.publishDateIso,
    excerpt,
    author: [{ _type: "reference", _key: "author_alex", _ref: "RIgC5r4TJ0hCGOzxHszD1w" }],
    tags,
    content: blocks,
  };
  if (coverImageRef) {
    doc.coverImage = coverImageRef;
  }
  return doc;
}

async function main() {
  console.log(
    `Starting Firebase Blog Web-First Archive Generator for years [${[...targetYears].join(", ")}] (${
      isDryRun ? "DRY RUN" : "LIVE WRITE"
    }) on dataset: ${dataset}`
  );

  // 1. Fetch existing Firebase docs with YouTube videos from Sanity
  const sanityQuery = `*[_type in ["post", "podcast"] && !(_id in path("drafts.**")) && "firebase" in tags[].value] | order(coalesce(date, _createdAt) desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    youtube,
    coverImage
  }`;
  const qRes = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(sanityQuery)}`
  );
  const { result: existingFirebaseDocs } = await qRes.json();
  const firebaseVideoCatalog = (existingFirebaseDocs || []).filter((d) => Boolean(d.youtube));
  const fallbackCoverRef = (existingFirebaseDocs || []).find((d) => d.coverImage?.asset)?.coverImage;
  console.log(
    `Loaded ${existingFirebaseDocs.length} existing Firebase docs (${firebaseVideoCatalog.length} with YouTube videos).`
  );

  // 2. Fetch firebase.blog/sitemap-0.xml and filter to target years & web-first slugs
  const sitemapXml = await (await fetch("https://firebase.blog/sitemap-0.xml")).text();
  const allUrls = [...sitemapXml.matchAll(/<loc>(https:\/\/firebase\.blog\/posts\/(\d{4})\/[^<]+)<\/loc>/g)]
    .filter((m) => targetYears.has(m[2]))
    .map((m) => m[1])
    .filter((u) => !EXCLUDE_SLUG_REGEX.test(u));

  const targetUrls = allUrls.slice(0, maxLimit);
  console.log(`Found ${allUrls.length} candidate URLs in [${[...targetYears].join(", ")}]; processing ${targetUrls.length}...`);

  // 3. Parse all candidate posts in parallel batches of 8
  const parsedPosts = [];
  for (let i = 0; i < targetUrls.length; i += 8) {
    const chunk = targetUrls.slice(i, i + 8);
    const resChunk = await Promise.all(chunk.map((u) => fetchAndParseFirebaseBlogPost(u)));
    for (const p of resChunk) {
      if (p) parsedPosts.push(p);
    }
  }
  console.log(`Successfully parsed ${parsedPosts.length} Web-first / AI / Full-Stack Firebase posts.`);

  // Sort chronologically
  parsedPosts.sort((a, b) => new Date(a.publishDateIso) - new Date(b.publishDateIso));

  let createdCount = 0;
  let mutations = [];

  for (let i = 0; i < parsedPosts.length; i++) {
    const parsed = parsedPosts[i];
    const matchedVideoDoc = pickBestFirebaseYouTubeVideo(parsed, firebaseVideoCatalog);

    // Pick 2 neighboring archive posts + 2 existing CodingCat.dev Firebase video posts for rich internal cross-linking
    const neighborDocs = [];
    if (i > 0) {
      const prev = parsedPosts[i - 1];
      const pParts = new URL(prev.sourceUrl).pathname.split("/").filter(Boolean);
      neighborDocs.push({
        _type: "post",
        title: prev.originalTitle,
        slug: `firebase-${pParts[1]}-${pParts[2]}-${pParts[3]}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 90),
      });
    }
    if (i + 1 < parsedPosts.length) {
      const next = parsedPosts[i + 1];
      const nParts = new URL(next.sourceUrl).pathname.split("/").filter(Boolean);
      neighborDocs.push({
        _type: "post",
        title: next.originalTitle,
        slug: `firebase-${nParts[1]}-${nParts[2]}-${nParts[3]}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 90),
      });
    }
    const relatedDocs = [...neighborDocs, ...firebaseVideoCatalog.slice(0, 2)];

    let coverImageRef = fallbackCoverRef;
    const tags = inferTagsForPost(parsed.originalTitle, parsed.elements);
    const svg = buildCoverSvg(parsed.originalTitle, parsed.publishDateLabel, tags);

    if (!isDryRun && token) {
      try {
        const uParts = new URL(parsed.sourceUrl).pathname.split("/").filter(Boolean);
        coverImageRef = await uploadCoverToSanity(
          svg,
          `firebase-${uParts[1]}-${uParts[2]}-${uParts[3]}.svg`,
          dataset
        );
      } catch (err) {
        console.warn(`Warning uploading cover for ${parsed.originalTitle}, using fallback:`, err.message);
      }
    }

    const postDoc = buildSanityPostFromParsed(parsed, matchedVideoDoc, relatedDocs, coverImageRef);
    createdCount++;

    if (isDryRun) {
      const wordCount = postDoc.content
        .filter((b) => b._type === "block")
        .map((b) => (b.children || []).map((c) => c.text || "").join(""))
        .join(" ")
        .split(/\s+/).length;
      const codeCount = postDoc.content.filter((b) => b._type === "code").length;
      console.log(
        ` [DRY RUN ${i + 1}/${parsedPosts.length}] ${postDoc.date.slice(0, 10)} (orig ${
          parsed.originalDateLabel
        }) | ${postDoc.title} | slug: /post/${postDoc.slug.current} | words: ${wordCount} | codeBlocks: ${codeCount} | inlineYT: ${
          matchedVideoDoc?.youtube
        }`
      );
      continue;
    }

    mutations.push({ createOrReplace: postDoc });

    if (mutations.length >= 10 || i === parsedPosts.length - 1) {
      const mutRes = await fetch(
        `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mutations }),
        }
      );
      if (!mutRes.ok) {
        throw new Error(`Sanity mutate failed: ${mutRes.status} ${await mutRes.text()}`);
      }
      console.log(`✓ Committed batch up to ${i + 1}/${parsedPosts.length} (${postDoc.title})`);
      mutations = [];
    }
  }

  console.log(`\nCompleted Firebase Archive Generator (${dataset}): ${createdCount} posts processed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
