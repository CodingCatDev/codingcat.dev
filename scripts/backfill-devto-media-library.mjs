import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { portableTextToMarkdown } from "@portabletext/markdown";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const devtoApiKey = process.env.DEVTO_API_KEY || process.env.PRIVATE_DEVTO;
const DEFAULT_MEDIA_LIBRARY_ID =
  process.env.SANITY_MEDIA_LIBRARY_ID ||
  process.env.PUBLIC_SANITY_MEDIA_LIBRARY_ID ||
  "mlttp0BZbCpV";

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN or SANITY_AUTH_TOKEN.");
  process.exit(1);
}

if (!devtoApiKey) {
  console.error("Missing DEVTO_API_KEY or PRIVATE_DEVTO.");
  process.exit(1);
}

const prodClient = createClient({
  projectId,
  dataset: "production",
  token,
  apiVersion: "2025-09-30",
  useCdn: false,
});

const devClient = createClient({
  projectId,
  dataset: "dev",
  token,
  apiVersion: "2025-09-30",
  useCdn: false,
});

const datasetImgBuilder = createImageUrlBuilder({
  projectId,
  dataset: "production",
});
const mediaLibraryBuilders = new Map();
const getMediaLibraryBuilder = (libraryId) => {
  let b = mediaLibraryBuilders.get(libraryId);
  if (!b) {
    b = createImageUrlBuilder({ mediaLibraryId: libraryId });
    mediaLibraryBuilders.set(libraryId, b);
  }
  return b;
};

const extractMediaLibraryId = (source) => {
  if (!source || typeof source !== "object") return undefined;
  const mediaRef = source?.media?._ref;
  if (typeof mediaRef === "string" && mediaRef.startsWith("media-library:")) {
    const [, libraryId] = mediaRef.split(":");
    if (libraryId) return libraryId;
  }
  return undefined;
};

const urlForImage = (source) => {
  if (!source || !source.asset) return undefined;
  const mediaLibraryId =
    extractMediaLibraryId(source) || DEFAULT_MEDIA_LIBRARY_ID;
  const builder = mediaLibraryId
    ? getMediaLibraryBuilder(mediaLibraryId)
    : datasetImgBuilder;
  return builder.image(source).auto("format").fit("max");
};

const extractYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
};

const formatYouTubeBlock = (url) => {
  const ytId = extractYouTubeId(url);
  if (!ytId && !url) return "";
  return `{% youtube ${ytId || (url || "").replace("live", "embed")} %}`;
};

const serializeContent = (content, canonicalUrl, fallbackExcerpt = "") => {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return "";
  }
  try {
    return portableTextToMarkdown(content, {
      types: {
        code: ({ value }) =>
          "```" + (value?.language || "") + "\n" + (value?.code || "") + "\n```",
        image: ({ value }) => {
          const url = urlForImage(value)?.url();
          const alt = (value?.alt || "").replace(/[\[\]\r\n]/g, " ").trim();
          return url ? `![${alt}](${url})` : "";
        },
        table: ({ value }) => {
          const rows = Array.isArray(value?.rows) ? value.rows : [];
          if (rows.length === 0) return "";
          const formatRow = (cells) =>
            `| ${(Array.isArray(cells) ? cells : [])
              .map((c) =>
                String(c ?? "")
                  .replace(/\r?\n/g, " ")
                  .replace(/\|/g, "\\|")
                  .trim()
              )
              .join(" | ")} |`;
          const headerCells = Array.isArray(rows[0]?.cells)
            ? rows[0].cells
            : [];
          if (headerCells.length === 0) return "";
          const headerLine = formatRow(headerCells);
          const sepLine = `| ${headerCells.map(() => "---").join(" | ")} |`;
          const bodyLines = rows
            .slice(1)
            .map((r) => formatRow(r?.cells || []));
          const titlePrefix = value?.title ? `### ${value.title}\n\n` : "";
          return `${titlePrefix}${[headerLine, sepLine, ...bodyLines].join("\n")}`;
        },
        htmlBlock: ({ value }) => {
          const rawHtml = String(value?.html || "");
          if (!rawHtml) return "";
          if (/<style|<svg|<script/i.test(rawHtml)) {
            return `*[Interactive diagram available in the full article on CodingCat.dev](${canonicalUrl})*`;
          }
          return rawHtml;
        },
        youtube: ({ value }) =>
          formatYouTubeBlock(value?.youtube || value?.url || ""),
        youtubeShorts: ({ value }) =>
          Array.isArray(value?.shorts)
            ? value.shorts.map((s) => formatYouTubeBlock(s)).join("\n\n")
            : "",
        codepen: ({ value }) => `{% codepen ${value?.url || ""} %}`,
        codesandbox: ({ value }) => {
          const id = value?.url
            ?.split("https://codesandbox.io/p/sandbox/")
            ?.at(-1);
          return `{% codesandbox ${id || value?.url || ""} %}`;
        },
        twitter: ({ value }) => {
          const id =
            value?.id ||
            value?.url?.match(/status(?:es)?\/(\d+)/i)?.[1] ||
            "";
          return id ? `{% twitter ${id} %}` : "";
        },
        quote: ({ value }) =>
          `> ${serializeContent(value?.content, canonicalUrl, fallbackExcerpt)}`,
      },
    });
  } catch (err) {
    console.warn("Error serializing content:", err);
    return fallbackExcerpt;
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const normalizeTitle = (str) =>
  (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

async function fetchWithRetry(url, options = {}, maxRetries = 6) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const retryAfterHeader = Number(res.headers.get("retry-after") || "0");
      const waitMs =
        retryAfterHeader > 0
          ? retryAfterHeader * 1000 + 1500
          : Math.min(35000, 12000 * attempt);
      console.warn(
        `[429 Rate Limit] Waiting ${Math.round(waitMs / 1000)}s before retry ${attempt}/${maxRetries} for ${url}...`
      );
      await sleep(waitMs);
      continue;
    }
    return res;
  }
  return fetch(url, options);
}

async function fetchAllDevtoArticles() {
  const byId = new Map();

  // 1. Fetch public codingcatdev organization/user articles (returns up to 1000 in 1 call)
  for (let page = 1; page <= 5; page++) {
    const res = await fetchWithRetry(
      `https://dev.to/api/articles?username=codingcatdev&per_page=1000&page=${page}`,
      {
        headers: {
          "api-key": devtoApiKey,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) break;
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) break;
    for (const a of arr) {
      if (a?.id) byId.set(a.id, a);
    }
    if (arr.length < 100) break;
    await sleep(1500);
  }

  // 2. Also fetch authenticated user's published articles in case any are under personal handle
  for (let page = 1; page <= 5; page++) {
    const res = await fetchWithRetry(
      `https://dev.to/api/articles/me/published?per_page=1000&page=${page}`,
      {
        headers: {
          "api-key": devtoApiKey,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) break;
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) break;
    for (const a of arr) {
      if (a?.id && !byId.has(a.id)) byId.set(a.id, a);
    }
    if (arr.length < 100) break;
    await sleep(1500);
  }

  return Array.from(byId.values());
}

async function run() {
  console.log("=== Backfilling Dev.to Articles with Sanity Media Library CDN URLs ===");
  console.log(`Media Library ID: ${DEFAULT_MEDIA_LIBRARY_ID}`);

  const devtoArticles = await fetchAllDevtoArticles();
  console.log(`Fetched ${devtoArticles.length} published Dev.to articles.`);

  const sanityDocs = await prodClient.fetch(
    `*[_type in ["post", "podcast"] && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      season,
      youtube,
      devto,
      tags,
      coverImage,
      content,
      "contentImageCount": count(content[_type == "image"]),
      "contentTableCount": count(content[_type == "table"]),
      "contentHtmlCount": count(content[_type == "htmlBlock"])
    }`
  );
  console.log(`Loaded ${sanityDocs.length} Sanity documents from production.`);

  const byDevtoUrl = new Map();
  const bySlug = new Map();
  const byTitle = new Map();

  for (const d of sanityDocs) {
    if (d.devto) {
      byDevtoUrl.set(d.devto.replace(/\/$/, ""), d);
    }
    if (d.slug) {
      bySlug.set(`${d._type}/${d.slug}`, d);
    }
    if (d.title) {
      byTitle.set(normalizeTitle(d.title), d);
    }
  }

  // Build prioritized work queue:
  // Priority 1: articles that have inline images, tables, or htmlBlocks, or recent 2025-2026 posts
  // Priority 2: remaining articles whose cover_image still uses cdn.sanity.io/images/
  const queue = [];
  for (const article of devtoArticles) {
    const cleanUrl = (article.url || "").replace(/\/$/, "");
    let doc = byDevtoUrl.get(cleanUrl);
    if (!doc && article.canonical_url) {
      const m = article.canonical_url.match(
        /(?:codingcat|purrfect)\.dev\/(post|podcast|tutorial)\/([^/?#]+)/i
      );
      if (m) {
        const type = m[1].toLowerCase() === "tutorial" ? "post" : m[1].toLowerCase();
        doc = bySlug.get(`${type}/${m[2]}`);
      }
    }
    if (!doc && article.title) {
      doc = byTitle.get(normalizeTitle(article.title));
    }
    if (!doc) continue;

    const decodedCover = decodeURIComponent(article.cover_image || "");
    const alreadyMediaLibraryCover = decodedCover.includes(
      `cdn.sanity.io/media-libraries/${DEFAULT_MEDIA_LIBRARY_ID}/`
    );
    const hasRichBody =
      (doc.contentImageCount || 0) > 0 ||
      (doc.contentTableCount || 0) > 0 ||
      (doc.contentHtmlCount || 0) > 0;

    // Skip if cover is already on Media Library CDN and there are no inline images/tables/htmlBlocks
    if (alreadyMediaLibraryCover && !hasRichBody) {
      continue;
    }

    const priority = hasRichBody ? 1 : 2;
    queue.push({ article, doc, priority });
  }

  queue.sort((a, b) => a.priority - b.priority || b.article.id - a.article.id);
  console.log(
    `Total Dev.to articles queued for Media Library CDN update: ${queue.length} (Priority 1 rich body: ${
      queue.filter((q) => q.priority === 1).length
    }, Priority 2 cover-only: ${queue.filter((q) => q.priority === 2).length})`
  );

  let updatedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const { article, doc, priority } = queue[i];
    const slug = doc.slug || doc._id;
    const canonicalUrl = `https://codingcat.dev/${doc._type}/${slug}`;
    const mainImageUrl = urlForImage(doc.coverImage)?.width(1280).url() || "";
    const contentMarkdown = serializeContent(
      doc.content,
      canonicalUrl,
      doc.excerpt || ""
    );

    const topYouTubeId = extractYouTubeId(doc.youtube);
    const topYouTubeWatchUrl = topYouTubeId
      ? `https://www.youtube.com/watch?v=${topYouTubeId}`
      : doc.youtube || "";
    const youtubeEmbed = doc.youtube
      ? `{% youtube ${topYouTubeId || doc.youtube.replace("live", "embed")} %}\n\n**[▶ Watch on YouTube & Subscribe to CodingCat.dev](${topYouTubeWatchUrl}${
          topYouTubeWatchUrl.includes("?") ? "&" : "?"
        }sub_confirmation=1)**\n\n`
      : "";

    const docTags = Array.isArray(doc.tags) ? doc.tags : [];
    const normalizedDocTags = docTags
      .map((t) =>
        (t?.value || t?.label || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      )
      .filter((v) => v.length >= 2 && v.length <= 20);
    const devtoTags = Array.from(
      new Set([
        ...(normalizedDocTags.length > 0
          ? normalizedDocTags.slice(0, 3)
          : ["webdev", "javascript", "programming"]),
        ...(doc._type === "podcast" ? ["podcast"] : []),
      ])
    ).slice(0, 4);

    const payload = {
      article: {
        title: doc.title || article.title || "Untitled",
        published: true,
        tags: devtoTags,
        main_image: mainImageUrl,
        canonical_url: canonicalUrl,
        description: doc.excerpt || article.description || "",
        body_markdown: `Original: ${canonicalUrl}\n\n${youtubeEmbed}${contentMarkdown}`,
      },
    };

    if (doc._type === "podcast") {
      payload.article.series = `codingcatdev_podcast_${doc.season || 4}`;
    }

    const targetUrl = `https://dev.to/api/articles/${article.id}`;
    try {
      const res = await fetchWithRetry(targetUrl, {
        method: "PUT",
        headers: {
          "api-key": devtoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resText = await res.text();
      if (res.ok) {
        const resJson = JSON.parse(resText);
        updatedCount++;
        console.log(
          `[${i + 1}/${queue.length}] (P${priority}) ✓ Updated Dev.to #${article.id}: ${resJson.url || article.url}`
        );

        const syndicationDoc = {
          _id: `syndication.${doc._id}.devto`,
          _type: "syndication",
          target: { _type: "reference", _ref: doc._id },
          platform: "devto",
          status: "published",
          canonicalUrl,
          externalUrl: resJson.url || article.url,
          externalId: String(article.id),
          syndicatedAt: new Date().toISOString(),
        };

        await prodClient.createOrReplace(syndicationDoc).catch(() => {});
        await devClient.createOrReplace(syndicationDoc).catch(() => {});

        if (!doc.devto || doc.devto !== (resJson.url || article.url)) {
          const finalUrl = resJson.url || article.url;
          await prodClient
            .patch(doc._id)
            .set({ devto: finalUrl })
            .commit()
            .catch(() => {});
          await devClient
            .patch(doc._id)
            .set({ devto: finalUrl })
            .commit()
            .catch(() => {});
        }
      } else {
        failedCount++;
        console.warn(
          `[${i + 1}/${queue.length}] ✗ Failed Dev.to #${article.id} (${res.status}): ${resText.slice(0, 240)}`
        );
      }
    } catch (err) {
      failedCount++;
      console.error(`[${i + 1}/${queue.length}] ✗ Error updating Dev.to #${article.id}:`, err);
    }

    // Throttle to ~1 request per 1.25s to respect Dev.to PUT rate limits
    await sleep(1250);
  }

  console.log(
    `\n=== Completed Dev.to Media Library Backfill: ${updatedCount} updated, ${failedCount} failed ===`
  );
}

run().catch((err) => {
  console.error("Fatal error in backfill-devto-media-library:", err);
  process.exit(1);
});
