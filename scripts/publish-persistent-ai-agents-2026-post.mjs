import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

function resolveSanityToken() {
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
  const candidateFiles = [
    path.resolve(os.homedir(), "codingcat-social-agent/.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "apps/site/.dev.vars"),
  ];
  for (const file of candidateFiles) {
    try {
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, "utf8");
        const m =
          raw.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) ||
          raw.match(/^SANITY_AUTH_TOKEN=(.+)$/m) ||
          raw.match(/^SANITY_TOKEN=(.+)$/m);
        if (m && m[1]) return m[1].trim().replace(/^["']|["']$/g, "");
      }
    } catch (_) {}
  }
  return "";
}

const token = resolveSanityToken();
const isDryRun = process.argv.includes("--dry-run") || !token;

const BASE_DOC_ID = "post-persistent-ai-agents-landscape-2026";
const DRAFT_DOC_ID = `drafts.${BASE_DOC_ID}`;
const SLUG = "meta-muse-vs-grok-bot-2026-persistent-ai-agent-landscape";
const ALEX_AUTHOR_REF = "RIgC5r4TJ0hCGOzxHszD1w";

const IMAGE_DIR = path.resolve(
  process.cwd(),
  "apps/site/public/images/posts/persistent-ai-agents-2026"
);

function cleanDashes(text, { trim = true } = {}) {
  if (!text) return "";
  const cleaned = String(text)
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\s{2,}/g, " ");
  return trim ? cleaned.trim() : cleaned;
}

function makeKey(prefix, seed) {
  const hash = crypto.createHash("md5").update(String(seed)).digest("hex").slice(0, 10);
  return `agt_${prefix}_${hash}`;
}

function shouldInsertSpaceBetweenSpans(pText, cText) {
  if (!pText || !cText) return false;
  if (/\s$/.test(pText) || /^\s/.test(cText)) return false;

  const lastChar = pText.slice(-1);
  const firstChar = cText.slice(0, 1);

  if (/^[.,;:!?)\]}’']/.test(firstChar)) return false;
  if (/^["”](\s|[.,;:!?)]|$)/.test(cText)) return false;
  if (/[(\[{]$/.test(lastChar) && pText.length === 1) return false;
  if (/(^|\s)[(\[{"“‘]$/.test(pText)) return false;
  if (pText === "-" || cText === "-") return false;

  return true;
}

function normalizeBlockSpacing(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children) || block.children.length < 2) {
    return block;
  }
  const linkMarkKeys = new Set((block.markDefs || []).map((m) => m._key));
  const children = block.children.map((c) => ({
    ...c,
    marks: Array.isArray(c.marks) ? [...c.marks] : [],
  }));

  const out = [];
  for (let i = 0; i < children.length; i++) {
    const curr = children[i];
    if (out.length > 0) {
      const prev = out[out.length - 1];
      if (shouldInsertSpaceBetweenSpans(prev.text, curr.text)) {
        const prevHasLinkOrCode = prev.marks.some((m) => m === "code" || linkMarkKeys.has(m));
        const currHasLinkOrCode = curr.marks.some((m) => m === "code" || linkMarkKeys.has(m));
        if (!prevHasLinkOrCode) {
          prev.text = `${prev.text} `;
        } else if (!currHasLinkOrCode) {
          curr.text = ` ${curr.text}`;
        } else {
          out.push({
            _type: "span",
            _key: `${prev._key || "sp"}_sep_${i}`,
            marks: [],
            text: " ",
          });
        }
      }
    }
    out.push(curr);
  }
  return { ...block, children: out };
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

function createRichBlock(
  segments,
  { style = "normal", listItem = undefined, level = undefined, keySeed = "" } = {}
) {
  const markDefs = [];
  const children = [];
  segments.forEach((seg, i) => {
    const hasMark = Boolean(seg.href || seg.code || seg.strong || seg.em);
    const rawText = cleanDashes(seg.text || "", { trim: hasMark });
    if (!rawText) return;
    const marks = [];
    if (seg.strong) marks.push("strong");
    if (seg.em) marks.push("em");
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
      _key: makeKey(`sp${i}`, `${keySeed}_${i}_${rawText.slice(0, 18)}`),
      marks,
      text: rawText,
    });
  });

  const block = {
    _type: "block",
    _key: makeKey("blk", keySeed || JSON.stringify(segments).slice(0, 40)),
    style,
    markDefs,
    children,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return normalizeBlockSpacing(block);
}

function createTableBlock(rows, keySeed) {
  return {
    _type: "table",
    _key: makeKey("tbl", keySeed),
    rows: rows.map((cells, rIdx) => ({
      _type: "row",
      _key: makeKey(`row${rIdx}`, `${keySeed}_r${rIdx}`),
      cells: cells.map((cell) => cleanDashes(String(cell))),
    })),
  };
}

function createCodeBlock(code, language = "typescript", keySeed = code.slice(0, 32)) {
  return {
    _type: "code",
    _key: makeKey("code", keySeed),
    language,
    code: String(code).trim(),
  };
}

function createImageBlock(assetRef, alt, caption, keySeed) {
  return {
    _type: "image",
    _key: makeKey("img", keySeed),
    asset: {
      _type: "reference",
      _ref: assetRef,
    },
    alt: cleanDashes(alt),
    caption: cleanDashes(caption),
  };
}

function parseInlineMarkdown(text) {
  const segments = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ text: text.slice(lastIdx, match.index) });
    }
    const tokenStr = match[0];
    if (tokenStr.startsWith("**") && tokenStr.endsWith("**")) {
      const inner = tokenStr.slice(2, -2);
      const linkMatch = inner.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        segments.push({ text: linkMatch[1], href: linkMatch[2], strong: true });
      } else {
        segments.push({ text: inner, strong: true });
      }
    } else if (tokenStr.startsWith("`") && tokenStr.endsWith("`")) {
      segments.push({ text: tokenStr.slice(1, -1), code: true });
    } else if (tokenStr.startsWith("[") && tokenStr.includes("](")) {
      const linkMatch = tokenStr.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        segments.push({ text: linkMatch[1], href: linkMatch[2] });
      } else {
        segments.push({ text: tokenStr });
      }
    } else if (tokenStr.startsWith("*") && tokenStr.endsWith("*")) {
      segments.push({ text: tokenStr.slice(1, -1), em: true });
    } else {
      segments.push({ text: tokenStr });
    }
    lastIdx = pattern.lastIndex;
  }
  if (lastIdx < text.length) {
    segments.push({ text: text.slice(lastIdx) });
  }
  return segments.length > 0 ? segments : [{ text }];
}

async function uploadJpegToSanity(filename, targetDataset) {
  const filePath = path.join(IMAGE_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  if (isDryRun) {
    return `image-dryrun-${filename.replace(/[^a-z0-9]/gi, "")}-1376x768-jpg`;
  }
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${targetDataset}?filename=${encodeURIComponent(
      filename
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
      body: buffer,
    }
  );
  if (!res.ok) {
    throw new Error(`Failed uploading ${filename}: ${res.status} ${await res.text()}`);
  }
  const { document } = await res.json();
  console.log(`Uploaded ${filename} to ${targetDataset}: ${document._id}`);
  return document._id;
}

function convertMarkdownBodyToPortableText(markdown, assetRefs) {
  const bodyWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\s*/, "").trim();
  const lines = bodyWithoutFrontmatter.split(/\r?\n/);
  const blocks = [];

  let i = 0;
  let blockIdx = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed === "---") {
      i++;
      continue;
    }

    // Skip duplicate H1 title
    if (trimmed.startsWith("# ")) {
      i++;
      continue;
    }

    // Code block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim() || "typescript";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(createCodeBlock(codeLines.join("\n"), lang, `code_${blockIdx++}`));
      continue;
    }

    // Image link
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1] || "Architecture Diagram";
      const src = imgMatch[2];
      // Skip cover image if embedded right at the top since Sanity renders coverImage in header
      if (src.includes("01-youtube-thumbnail-cloud-agents.jpg")) {
        i++;
        continue;
      }
      let ref = assetRefs.hero;
      let caption = alt;
      if (src.includes("02-diagram-vm-security-boundaries")) {
        ref = assetRefs.diagramVm;
        caption = "Architecture Diagram: Shared Account Session State vs. Guardrailed & Local Isolation";
      } else if (src.includes("03-diagram-memory-topologies")) {
        ref = assetRefs.diagramMemory;
        caption = "Architecture Diagram: Siloed Chat Threads vs. Curated Team Context & Skill Files";
      } else if (src.includes("04-diagram-cloud-vs-self-hosted")) {
        ref = assetRefs.diagramSelfHosted;
        caption = "Architecture Diagram: Metered Cloud Token Burn vs. Self-Hosted Local Harness Control";
      }
      blocks.push(createImageBlock(ref, alt, caption, `img_${blockIdx++}`));
      i++;
      continue;
    }

    // Markdown table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const rowLine = lines[i].trim();
        // Check if separator row
        const cells = rowLine
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        const isSeparator = cells.every((c) => /^:?-{2,}:?$/.test(c));
        if (!isSeparator) {
          const cleanCells = cells.map((c) =>
            c
              .replace(/\*\*([^*]+)\*\*/g, "$1")
              .replace(/`([^`]+)`/g, "$1")
              .replace(/\*([^*]+)\*/g, "$1")
          );
          tableRows.push(cleanCells);
        }
        i++;
      }
      if (tableRows.length > 0) {
        blocks.push(createTableBlock(tableRows, `tbl_${blockIdx++}`));
      }
      continue;
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      blocks.push(createTextBlock(trimmed.slice(3).trim().replace(/`/g, ""), "h2", `h2_${blockIdx++}`));
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push(createTextBlock(trimmed.slice(4).trim().replace(/`/g, ""), "h3", `h3_${blockIdx++}`));
      i++;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      blocks.push(createTextBlock(trimmed.slice(5).trim().replace(/`/g, ""), "h4", `h4_${blockIdx++}`));
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const quoteText = quoteLines.join(" ");
      blocks.push(
        createRichBlock(parseInlineMarkdown(quoteText), {
          style: "blockquote",
          keySeed: `quote_${blockIdx++}`,
        })
      );
      continue;
    }

    // Unordered or ordered list
    const ulMatch = rawLine.match(/^(\s*)-\s+(.+)$/);
    const olMatch = rawLine.match(/^(\s*)\d+\.\s+(.+)$/);
    if (ulMatch || olMatch) {
      const indent = (ulMatch ? ulMatch[1] : olMatch[1]).length;
      const level = indent >= 2 ? 2 : 1;
      const listItem = ulMatch ? "bullet" : "number";
      const contentStr = ulMatch ? ulMatch[2] : olMatch[2];
      blocks.push(
        createRichBlock(parseInlineMarkdown(contentStr), {
          style: "normal",
          listItem,
          level,
          keySeed: `li_${blockIdx++}`,
        })
      );
      i++;
      continue;
    }

    // Standard paragraph
    const paraLines = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("- ") &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith("![") &&
      lines[i].trim() !== "---"
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push(
      createRichBlock(parseInlineMarkdown(paraLines.join(" ")), {
        style: "normal",
        keySeed: `p_${blockIdx++}`,
      })
    );
  }

  return blocks;
}

async function main() {
  const publishLive = process.argv.includes("--publish");
  const targetDocId = publishLive ? BASE_DOC_ID : DRAFT_DOC_ID;

  console.log(
    `Uploading 4 Visual Assets & Creating ${publishLive ? "Published Post" : "Sanity Draft"} (${targetDocId}) in dataset '${dataset}'...`
  );

  const assetRefs = {
    hero: await uploadJpegToSanity("01-youtube-thumbnail-cloud-agents.jpg", dataset),
    diagramVm: await uploadJpegToSanity("02-diagram-vm-security-boundaries.jpg", dataset),
    diagramMemory: await uploadJpegToSanity("03-diagram-memory-topologies.jpg", dataset),
    diagramSelfHosted: await uploadJpegToSanity("04-diagram-cloud-vs-self-hosted.jpg", dataset),
  };

  const mdPath = path.resolve(
    os.homedir(),
    ".gemini/antigravity-cli/scratch/persistent-ai-agents-2026/blog-post.md"
  );
  const rawMd = fs.readFileSync(mdPath, "utf8");
  const blocks = convertMarkdownBodyToPortableText(rawMd, assetRefs);

  const postDoc = {
    _id: targetDocId,
    _type: "post",
    title: cleanDashes(
      "Meta Muse vs. Grok Bot vs. The 2026 Cloud Agent Fleet: Choosing Your Background AI Architecture"
    ),
    slug: {
      _type: "slug",
      current: SLUG,
    },
    date: "2026-11-03T17:00:00.000Z",
    excerpt: cleanDashes(
      "Why we moved from synchronous chat tabs to persistent cloud VMs that keep working when your laptop lid closes. A Senior Solutions Architect's breakdown of Meta Muse, Gemini Spark, Grok Bot, Claude Cowork, ChatGPT Work, Kiro Crew, Sanity Project Horizon, and self-hosted harnesses like OpenClaw, ZeroClaw, Rakazo, and Hermes Agent."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: assetRefs.hero,
      },
      alt: "Alex Patterson next to a dark-mode architecture diagram comparing single-bot chat against multi-agent cloud VMs",
    },
    author: [
      {
        _type: "reference",
        _key: "author_alex",
        _ref: ALEX_AUTHOR_REF,
      },
    ],
    tags: [
      { _key: "tag_ai", label: "AI", value: "ai" },
      { _key: "tag_mcp", label: "MCP", value: "mcp" },
      { _key: "tag_security", label: "Security", value: "security" },
      { _key: "tag_cloudflare", label: "Cloudflare", value: "cloudflare" },
      { _key: "tag_sanity", label: "Sanity", value: "sanity" },
      { _key: "tag_oss", label: "Open Source", value: "oss" },
    ],
    relatedVideo: {
      reference: {
        _type: "reference",
        _ref: "0531c732-d750-4dc4-b81f-7b6cfa7ebfae",
      },
      title: "Sanity Knowledge Bases & MCP Context Architecture",
      description:
        "See how structured knowledge bases and Model Context Protocol (MCP) servers power long-lived AI agents in production.",
    },
    relatedContent: [
      {
        _key: "rel_sanity_kb",
        _type: "reference",
        _ref: "0531c732-d750-4dc4-b81f-7b6cfa7ebfae",
      },
      {
        _key: "rel_mcp_oauth",
        _type: "reference",
        _ref: "ab22f27a-2d5d-4dfa-ad61-b5dd9ef85334",
      },
    ],
    content: blocks,
  };

  if (isDryRun) {
    console.log(
      `[DRY RUN] Built ${postDoc._id} (/post/${postDoc.slug.current}) with ${postDoc.content.length} Portable Text blocks.`
    );
    return;
  }

  const mutRes = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: postDoc }],
      }),
    }
  );

  if (!mutRes.ok) {
    throw new Error(`Sanity mutate failed: ${mutRes.status} ${await mutRes.text()}`);
  }

  console.log(`✓ Saved ${postDoc._id} (${postDoc.content.length} Portable Text blocks) to Sanity (${dataset})`);
  console.log(`✓ Sanity Studio Edit URL: https://codingcat-prod.sanity.studio/intent/edit/id=${BASE_DOC_ID};type=post/`);
  console.log(`✓ CodingCat.dev Post URL: https://codingcat.dev/post/${SLUG}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
