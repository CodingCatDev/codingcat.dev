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
    path.resolve(process.cwd(), "apps/site/.dev.vars"),
  ];
  for (const file of candidateFiles) {
    try {
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, "utf8");
        const m =
          raw.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) ||
          raw.match(/^SANITY_AUTH_TOKEN=(.+)$/m) ||
          raw.match(/^SANITY_API_READ_TOKEN=(.+)$/m);
        if (m && m[1]) return m[1].trim().replace(/^["']|["']$/g, "");
      }
    } catch (_) {}
  }
  return "";
}

const token = resolveSanityToken();
const isDryRun = process.argv.includes("--dry-run") || !token;
const ALEX_AUTHOR_REF = "RIgC5r4TJ0hCGOzxHszD1w";

const IMAGE_DIR = path.resolve(
  process.cwd(),
  "apps/site/public/images/posts/web-ai-gde"
);

export function cleanDashes(text, { trim = true } = {}) {
  if (!text) return "";
  const cleaned = String(text)
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\s{2,}/g, " ");
  return trim ? cleaned.trim() : cleaned;
}

function makeKey(prefix, seed) {
  const hash = crypto.createHash("md5").update(String(seed)).digest("hex").slice(0, 10);
  return `wai_${prefix}_${hash}`;
}

export function shouldInsertSpaceBetweenSpans(pText, cText) {
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

export function normalizeBlockSpacing(block) {
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

async function uploadJpegToSanity(filename, targetDataset) {
  const filePath = path.join(IMAGE_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  if (isDryRun) {
    return `image-dryrun-${filename.replace(/[^a-z0-9]/gi, "")}-1408x768-jpg`;
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

function appendStandardConclusion(blocks, postKey) {
  blocks.push(
    createRichBlock(
      [
        { text: "Try the Live Browser AI & WebMCP Playground", strong: true },
      ],
      { style: "h2", keySeed: `${postKey}_cta_h2` }
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: "You can test every pattern from this article live right now in our interactive " },
        { text: "Web AI & WebMCP Playground", href: "/demos/web-ai", strong: true },
        { text: " on CodingCat.dev, or inspect our production discovery manifests on the " },
        { text: "Developers & Agent APIs", href: "/developers", strong: true },
        { text: " page. If you are organizing a developer conference or engineering summit, check out my Web AI talk abstracts on " },
        { text: "alexpatterson.dev", href: "https://alexpatterson.dev", strong: true },
        { text: " and explore more hands-on " },
        { text: "Courses", href: "/courses", strong: true },
        { text: ", " },
        { text: "Podcasts", href: "/podcasts", strong: true },
        { text: ", and " },
        { text: "Blog Posts", href: "/blog", strong: true },
        { text: " right here on CodingCat.dev." },
      ],
      { style: "normal", keySeed: `${postKey}_cta_body` }
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POST 1: Feb 18, 2026 - Chrome Built-in AI & Gemini Nano Prompt API
// ─────────────────────────────────────────────────────────────────────────────
function buildPost1(assets) {
  const k = "p1";
  const blocks = [];

  blocks.push(
    createRichBlock(
      [
        {
          text: "For the past two years, adding a simple text summarizer, tone rewriter, or draft assistant to a web application meant standing up a server-side proxy, managing API keys, paying per million tokens, and eating a 450ms network roundtrip on every single user interaction. With ",
        },
        {
          text: "Chrome Built-in AI",
          href: "https://developer.chrome.com/docs/ai/built-in",
          strong: true,
        },
        {
          text: " shipping ",
        },
        { text: "Gemini Nano", strong: true },
        {
          text: " directly inside the browser binary, web developers can now run foundation model inference on the user's local GPU or NPU with zero token cost, zero server egress, and full offline capability.",
        },
      ],
      { style: "normal", keySeed: `${k}_hook_1` }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "In this guide, we will break down how Chrome's Built-in AI architecture works under the hood, walk through the ",
        },
        { text: "LanguageModel", code: true },
        { text: " (Prompt API), " },
        { text: "Summarizer", code: true },
        { text: ", " },
        { text: "Rewriter", code: true },
        { text: ", and " },
        { text: "Translator", code: true },
        {
          text: " Web APIs in TypeScript, and show how we wire up progressive model download telemetry and session cloning in Astro and React.",
        },
      ],
      { style: "normal", keySeed: `${k}_hook_2` }
    )
  );

  blocks.push(
    createTextBlock(
      "The Mental Model: Why Move Inference into the Browser Sandbox?",
      "h2",
      `${k}_h2_mental`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "When you bundle your own WebAssembly or WebGPU weights per origin, every website forces the user to download a separate 1.5GB model file. Chrome Built-in AI solves the cold-cache problem at the browser level: Chrome downloads and updates a single shared ",
        },
        { text: "Gemini Nano", strong: true },
        {
          text: " checkpoint managed by the browser'sOptimization Guide service, and exposes task-specific and general-purpose JavaScript interfaces to any origin that requests them.",
        },
      ],
      { style: "normal", keySeed: `${k}_mental_p1` }
    )
  );

  blocks.push(
    createImageBlock(
      assets.p1Diagram,
      "Dark-mode Architecture Diagram comparing cloud-only LLM roundtrips against Chrome Built-in AI local Gemini Nano execution",
      "Architecture Diagram: Cloud-Only LLM Proxy (left, Coral anti-pattern) vs. Chrome Built-in AI with Local Gemini Nano and 0ms network RTT (right, Mint recommended pattern).",
      `${k}_img_diag`
    )
  );

  blocks.push(
    createTextBlock(
      "Chrome Built-in AI API Surface Comparison",
      "h2",
      `${k}_h2_tbl`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Rather than forcing every developer to write brittle system prompts for common text transformations, Chrome splits Built-in AI into high-level task APIs and the flexible ",
        },
        { text: "LanguageModel", code: true },
        { text: " Prompt API:" },
      ],
      { style: "normal", keySeed: `${k}_tbl_intro` }
    )
  );

  blocks.push(
    createTableBlock(
      [
        [
          "Browser API",
          "Global Interface",
          "Primary Configuration Options",
          "Ideal Production Workload",
        ],
        [
          "Prompt API",
          "window.LanguageModel",
          "systemPrompt, initialPrompts, temperature, topK, responseConstraint (JSON Schema)",
          "Custom structured extraction, interactive chat, and classification with JSON Schema output constraints.",
        ],
        [
          "Summarizer API",
          "window.Summarizer",
          "type ('key-points' | 'tldr' | 'teaser' | 'headline'), format ('markdown' | 'plain-text'), length",
          "Summarizing long documentation pages, podcast transcripts, or comment threads client-side.",
        ],
        [
          "Writer & Rewriter APIs",
          "window.Writer / window.Rewriter",
          "tone ('more-formal' | 'more-casual' | 'as-is'), length ('shorter' | 'longer'), sharedContext",
          "Inline rich-text editor helpers in Sanity Studio, support ticket polishing, and PR descriptions.",
        ],
        [
          "Translator & LanguageDetector",
          "window.Translator / window.LanguageDetector",
          "sourceLanguage, targetLanguage (BCP-47 tags)",
          "Instant privacy-preserving localization of user-generated content without cloud translation fees.",
        ],
      ],
      `${k}_tbl_apis`
    )
  );

  blocks.push(
    createTextBlock(
      "Step 1: Probing Availability and Handling Model Downloads",
      "h2",
      `${k}_h2_step1`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Never assume the local model weights are already cached on disk. Before calling ",
        },
        { text: "LanguageModel.create()", code: true },
        {
          text: ", always inspect ",
        },
        { text: "LanguageModel.availability()", code: true },
        {
          text: " (which returns ",
        },
        { text: "'available'", code: true },
        { text: ", " },
        { text: "'downloadable'", code: true },
        { text: ", " },
        { text: "'downloading'", code: true },
        { text: ", or " },
        { text: "'unavailable'", code: true },
        {
          text: ") and attach a ",
        },
        { text: "monitor", code: true },
        {
          text: " callback to surface download progress in your UI:",
        },
      ],
      { style: "normal", keySeed: `${k}_step1_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/ai/chrome-language-model.ts
export type BuiltInAvailability = "available" | "downloadable" | "downloading" | "unavailable";

export interface PromptSessionOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
  onDownloadProgress?: (loadedRatio: number) => void;
  signal?: AbortSignal;
}

interface ChromeLanguageModelFactory {
  availability(options?: Record<string, unknown>): Promise<BuiltInAvailability>;
  params(): Promise<{ defaultTemperature: number; maxTemperature: number; defaultTopK: number; maxTopK: number }>;
  create(options?: Record<string, unknown>): Promise<ChromeLanguageModelSession>;
}

export interface ChromeLanguageModelSession {
  prompt(input: string, options?: { responseConstraint?: object; signal?: AbortSignal }): Promise<string>;
  promptStreaming(input: string, options?: { responseConstraint?: object; signal?: AbortSignal }): ReadableStream<string>;
  measureInputUsage(input: string): Promise<number>;
  readonly inputUsage: number;
  readonly inputQuota: number;
  clone(options?: { signal?: AbortSignal }): Promise<ChromeLanguageModelSession>;
  destroy(): void;
}

function getLanguageModelFactory(): ChromeLanguageModelFactory | null {
  const g = globalThis as unknown as {
    LanguageModel?: ChromeLanguageModelFactory;
    ai?: { languageModel?: ChromeLanguageModelFactory };
  };
  return g.LanguageModel ?? g.ai?.languageModel ?? null;
}

export async function createBrowserPromptSession(
  options: PromptSessionOptions = {}
): Promise<ChromeLanguageModelSession | null> {
  const factory = getLanguageModelFactory();
  if (!factory) return null;

  const status = await factory.availability();
  if (status === "unavailable") {
    return null;
  }

  const defaults = await factory.params();
  return await factory.create({
    systemPrompt:
      options.systemPrompt ??
      "You are a concise, code-first web architecture assistant on CodingCat.dev.",
    temperature: options.temperature ?? defaults.defaultTemperature,
    topK: options.topK ?? defaults.defaultTopK,
    signal: options.signal,
    monitor(m: EventTarget) {
      m.addEventListener("downloadprogress", (event: Event) => {
        const e = event as unknown as { loaded?: number; total?: number };
        if (typeof e.loaded === "number" && options.onDownloadProgress) {
          const ratio = e.total ? e.loaded / e.total : e.loaded;
          options.onDownloadProgress(Math.min(1, Math.max(0, ratio)));
        }
      });
    },
  });
}`,
      "typescript",
      `${k}_code_factory`
    )
  );

  blocks.push(
    createTextBlock(
      "Step 2: Structured JSON Output with responseConstraint and Session Cloning",
      "h2",
      `${k}_h2_step2`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Two of the most impactful capabilities in Chrome's Prompt API are ",
        },
        { text: "responseConstraint", code: true },
        {
          text: " (which forces Gemini Nano's token sampler to adhere strictly to a JSON Schema without hallucinating invalid syntax) and ",
        },
        { text: "session.clone()", code: true },
        {
          text: " (which forks the KV-cache of an initialized system prompt so you can process multiple items without re-evaluating the system context). Here is how we combine both to classify and tag technical tutorials client-side:",
        },
      ],
      { style: "normal", keySeed: `${k}_step2_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/ai/classify-article-client.ts
import { createBrowserPromptSession } from "./chrome-language-model";

const TAG_EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    primaryPillar: {
      type: "string",
      enum: ["Courses", "Podcasts", "Blog"],
    },
    difficulty: {
      type: "string",
      enum: ["beginner", "intermediate", "advanced"],
    },
    technicalTags: {
      type: "array",
      items: { type: "string" },
      maxItems: 5,
    },
    oneSentenceSummary: {
      type: "string",
    },
  },
  required: ["primaryPillar", "difficulty", "technicalTags", "oneSentenceSummary"],
  additionalProperties: false,
};

export async function analyzeDraftInBrowser(markdownDraft: string) {
  const baseSession = await createBrowserPromptSession({
    systemPrompt:
      "Analyze developer tutorials for CodingCat.dev and extract structured metadata.",
  });

  if (!baseSession) {
    throw new Error("Chrome Built-in AI (Gemini Nano) is not available on this device.");
  }

  try {
    // Check token budget before prompting so we never blow the context window
    const tokenCost = await baseSession.measureInputUsage(markdownDraft);
    const remainingTokens = baseSession.inputQuota - baseSession.inputUsage;
    const boundedInput =
      tokenCost > remainingTokens ? markdownDraft.slice(0, 6000) : markdownDraft;

    // Clone the warm session so repeated runs reuse the system prompt KV cache
    const workerSession = await baseSession.clone();
    try {
      const rawJson = await workerSession.prompt(
        \`Extract metadata for this draft:\\n\\n\${boundedInput}\`,
        { responseConstraint: TAG_EXTRACTION_SCHEMA }
      );
      return JSON.parse(rawJson);
    } finally {
      workerSession.destroy();
    }
  } finally {
    baseSession.destroy();
  }
}`,
      "typescript",
      `${k}_code_schema`
    )
  );

  blocks.push(
    createTextBlock(
      "Step 3: Streaming Key-Point Summaries with the Summarizer API",
      "h2",
      `${k}_h2_step3`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "When you specifically need TL;DR bullet points or executive summaries on a Blog Post or Podcast Episode transcript, use ",
        },
        { text: "window.Summarizer", code: true },
        {
          text: " instead of the raw Prompt API. Chrome tunes the underlying LoRA / task prompt specifically for factual density:",
        },
      ],
      { style: "normal", keySeed: `${k}_step3_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/ai/summarize-transcript.ts
export async function streamTranscriptKeyPoints(
  transcriptText: string,
  onChunk: (partialMarkdown: string) => void
): Promise<string> {
  const SummarizerApi = (globalThis as Record<string, any>).Summarizer;
  if (!SummarizerApi) {
    throw new Error("Summarizer API is not supported in this browser.");
  }

  const availability = await SummarizerApi.availability();
  if (availability === "unavailable") {
    throw new Error("Summarizer model is unavailable on this hardware.");
  }

  const summarizer = await SummarizerApi.create({
    type: "key-points",
    format: "markdown",
    length: "medium",
    sharedContext:
      "This is a technical software engineering tutorial from CodingCat.dev.",
  });

  try {
    const stream: ReadableStream<string> = summarizer.summarizeStreaming(transcriptText, {
      context: "Focus on architectural trade-offs, browser APIs, and production benchmarks.",
    });

    const reader = stream.getReader();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // Handle both cumulative and delta streaming implementations across Chrome releases
      accumulated = value.startsWith(accumulated) ? value : accumulated + value;
      onChunk(accumulated);
    }
    return accumulated;
  } finally {
    if (typeof summarizer.destroy === "function") {
      summarizer.destroy();
    }
  }
}`,
      "typescript",
      `${k}_code_summarizer`
    )
  );

  blocks.push(
    createTextBlock(
      "AJ Pro-Tip: User Activation and Context Quotas",
      "h2",
      `${k}_h2_gotchas`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "AJ Pro-Tip: Always Gate Model Creation Behind Transient User Activation. ",
          strong: true,
        },
        {
          text: "When ",
        },
        { text: "availability()", code: true },
        {
          text: " returns ",
        },
        { text: "'downloadable'", code: true },
        {
          text: ", Chrome requires a transient user gesture (such as a ",
        },
        { text: "click", code: true },
        {
          text: " event) before ",
        },
        { text: "LanguageModel.create()", code: true },
        {
          text: " or ",
        },
        { text: "Summarizer.create()", code: true },
        {
          text: " will initiate the background weight download. Call ",
        },
        { text: "availability()", code: true },
        {
          text: " on page load to render your button state, and call ",
        },
        { text: "create()", code: true },
        {
          text: " inside the button's click handler while monitoring ",
        },
        { text: "session.inputUsage / session.inputQuota", code: true },
        {
          text: " so long conversations never overflow Gemini Nano's local context window.",
        },
      ],
      { style: "blockquote", keySeed: `${k}_gotcha_quote` }
    )
  );

  appendStandardConclusion(blocks, k);

  return {
    _id: "post-chrome-built-in-ai-gemini-nano-prompt-api-2026",
    _type: "post",
    title: cleanDashes(
      "Chrome Built-in AI and Gemini Nano: A Production Guide to the Prompt, Summarizer, and Rewriter APIs"
    ),
    slug: {
      _type: "slug",
      current: "chrome-built-in-ai-gemini-nano-prompt-api-guide",
    },
    date: "2026-02-18T14:30:00.000Z",
    excerpt: cleanDashes(
      "Learn how to run zero-cost, zero-latency client-side inference in the browser using Chrome Built-in AI and Gemini Nano. Includes production TypeScript implementations for window.LanguageModel, JSON Schema responseConstraint, session cloning, and the Summarizer API."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets.p1Hero },
      alt: "Alex Patterson and AJ the Cat pointing at Chrome Built-in AI and Gemini Nano running inside the browser with 0ms network latency",
    },
    author: [{ _type: "reference", _key: "author_alex", _ref: ALEX_AUTHOR_REF }],
    tags: [
      { _key: "t1", label: "Web AI", value: "web-ai" },
      { _key: "t2", label: "Chrome Built-in AI", value: "chrome-built-in-ai" },
      { _key: "t3", label: "Gemini Nano", value: "gemini-nano" },
      { _key: "t4", label: "TypeScript", value: "typescript" },
      { _key: "t5", label: "Web Technologies", value: "web-technologies" },
    ],
    content: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST 2: Apr 14, 2026 - WebMCP Browser-Native Model Context Protocol
// ─────────────────────────────────────────────────────────────────────────────
function buildPost2(assets) {
  const k = "p2";
  const blocks = [];

  blocks.push(
    createRichBlock(
      [
        {
          text: "If you have watched a browser AI agent try to book a flight, filter an e-commerce catalog, or search documentation using visual screen-scraping, you already know how painful it is. The agent takes a high-resolution screenshot or dumps 15,000 tokens of raw accessibility tree nodes, guesses a CSS selector, clicks the wrong button when a modal animates in, and burns through your token budget in four seconds. ",
        },
        {
          text: "WebMCP (Web Model Context Protocol)",
          href: "https://developer.chrome.com/blog/webmcp-epp",
          strong: true,
        },
        {
          text: " fixes this at the web platform layer.",
        },
      ],
      { style: "normal", keySeed: `${k}_hook_1` }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Co-developed within the W3C Web Machine Learning Community Group by engineers from Google and Microsoft, ",
        },
        { text: "WebMCP", strong: true },
        {
          text: " brings Model Context Protocol primitives directly into the browser tab. Instead of forcing agents to reverse-engineer your DOM, your web application explicitly registers structured, JSON-Schema-typed tools via ",
        },
        { text: "document.modelContext", code: true },
        { text: " (or " },
        { text: "navigator.modelContext", code: true },
        {
          text: ") and declarative HTML ",
        },
        { text: "<form toolname=\"...\">", code: true },
        {
          text: " attributes. Even better: we already run WebMCP in production across ",
        },
        { text: "CodingCat.dev", href: "/demos/web-ai", strong: true },
        { text: " and " },
        { text: "alexpatterson.dev", href: "https://alexpatterson.dev", strong: true },
        { text: "." },
      ],
      { style: "normal", keySeed: `${k}_hook_2` }
    )
  );

  blocks.push(
    createTextBlock(
      "The Mental Model: Screen-Scraping vs. WebMCP Native Tool Contracts",
      "h2",
      `${k}_h2_mental`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "When you build a traditional backend MCP server over stdio or HTTP SSE, you immediately hit the authentication wall: the remote MCP server does not have the user's active browser cookies, CSRF tokens, or in-memory React/Astro state. WebMCP executes inside the active browser tab, meaning registered tools automatically inherit the user's same-origin session while exposing a clean, deterministic JSON Schema contract to the browser assistant.",
        },
      ],
      { style: "normal", keySeed: `${k}_mental_p1` }
    )
  );

  blocks.push(
    createImageBlock(
      assets.p2Diagram,
      "Dark-mode Architecture Diagram comparing brittle 15,000-token DOM screen-scraping against 150-token WebMCP native browser tools",
      "Architecture Diagram: Legacy DOM Screen-Scraping (left, Coral anti-pattern) vs. WebMCP Imperative and Declarative Browser Tools (right, Mint recommended pattern).",
      `${k}_img_diag`
    )
  );

  blocks.push(
    createTextBlock(
      "Comparing DOM Actuation, Backend MCP, and Browser WebMCP",
      "h2",
      `${k}_h2_tbl`
    )
  );

  blocks.push(
    createTableBlock(
      [
        [
          "Dimension",
          "DOM / Screenshot Scraping",
          "Remote Backend MCP Server",
          "Browser-Native WebMCP (Recommended)",
        ],
        [
          "Token Overhead per Turn",
          "10,000 to 25,000 tokens (DOM + Vision)",
          "150 to 400 tokens (JSON Schema)",
          "100 to 250 tokens (In-Tab JSON Schema)",
        ],
        [
          "Authentication & Session State",
          "Shares tab cookies but clicks blindly",
          "Requires separate OAuth 2.1 / API token flow",
          "Inherits same-origin cookies and live UI state automatically",
        ],
        [
          "Resilience to UI Redesigns",
          "Breaks whenever CSS classes or layouts shift",
          "Decoupled from UI",
          "100% decoupled from visual CSS changes",
        ],
        [
          "Implementation Surface",
          "Zero publisher control",
          "Dedicated Node / Cloudflare Worker endpoint",
          "document.modelContext.registerTool() or <form toolname>",
        ],
      ],
      `${k}_tbl_compare`
    )
  );

  blocks.push(
    createTextBlock(
      "Pathway 1: The Imperative WebMCP API (registerTool & AbortController)",
      "h2",
      `${k}_h2_imp`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Early Chrome Canary prototypes exposed WebMCP under ",
        },
        { text: "navigator.modelContext", code: true },
        {
          text: ", while newer 2026 specification updates bind the context directly to the document lifecycle via ",
        },
        { text: "document.modelContext", code: true },
        {
          text: ". In production, always feature-detect both and pass an ",
        },
        { text: "AbortController", code: true },
        {
          text: " signal so Single-Page Application (SPA) or Astro View Transition navigations cleanly unregister tools when a component unmounts. Here is the exact pattern we ship in CodingCat.dev's ",
        },
        { text: "BaseLayout.astro", code: true },
        { text: ":" },
      ],
      { style: "normal", keySeed: `${k}_imp_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/webmcp/register-codingcat-tools.ts
export interface WebMcpToolDefinition<TArgs = Record<string, unknown>> {
  name: string;
  description: string;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    untrustedContentHint?: boolean;
  };
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (args: TArgs) => Promise<unknown>;
}

interface ModelContextContainer {
  registerTool?: <T>(tool: WebMcpToolDefinition<T>, options?: { signal?: AbortSignal }) => void;
  unregisterTool?: (name: string) => void;
}

export function getBrowserModelContext(): ModelContextContainer | null {
  if (typeof document !== "undefined" && "modelContext" in document) {
    return (document as unknown as { modelContext: ModelContextContainer }).modelContext;
  }
  if (typeof navigator !== "undefined" && "modelContext" in navigator) {
    return (navigator as unknown as { modelContext: ModelContextContainer }).modelContext;
  }
  return null;
}

export function mountCodingCatWebMcpTools(): () => void {
  const mc = getBrowserModelContext();
  const controller = new AbortController();

  if (!mc || typeof mc.registerTool !== "function") {
    return () => controller.abort();
  }

  mc.registerTool<{ query: string; pillar?: "course" | "podcast" | "post" }>(
    {
      name: "search_content",
      description:
        "Search CodingCat.dev Courses, Podcasts, and Blog Posts by technical topic or framework.",
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        untrustedContentHint: true,
      },
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search keyword (e.g. WebMCP, Gemini Nano, Astro, Sanity, Cloudflare D1)",
          },
          pillar: {
            type: "string",
            enum: ["course", "podcast", "post"],
            description: "Optional CodingCat.dev content pillar filter",
          },
        },
        required: ["query"],
      },
      execute: async ({ query, pillar }) => {
        const params = new URLSearchParams({ q: query });
        if (pillar) params.set("type", pillar);
        const response = await fetch(\`/api/search?\${params.toString()}\`, {
          headers: { Accept: "application/json" },
          credentials: "same-origin",
        });
        if (!response.ok) {
          throw new Error(\`Search API returned HTTP \${response.status}\`);
        }
        return await response.json();
      },
    },
    { signal: controller.signal }
  );

  return () => controller.abort();
}`,
      "typescript",
      `${k}_code_imp`
    )
  );

  blocks.push(
    createTextBlock(
      "Pathway 2: The Declarative WebMCP API (HTML Form Annotations)",
      "h2",
      `${k}_h2_decl`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Not every page needs custom JavaScript to expose agent tools. If your application already uses semantic HTML ",
        },
        { text: "<form>", code: true },
        {
          text: " elements for filtering, search, or booking, you can add WebMCP declarative attributes (",
        },
        { text: "toolname", code: true },
        { text: ", " },
        { text: "tooldescription", code: true },
        { text: ", " },
        { text: "toolparamdescription", code: true },
        { text: ", and " },
        { text: "toolautosubmit", code: true },
        {
          text: "). The browser automatically parses your form inputs (",
        },
        { text: "type", code: true },
        { text: ", " },
        { text: "pattern", code: true },
        { text: ", " },
        { text: "required", code: true },
        { text: ", and " },
        { text: "<select>", code: true },
        {
          text: " options) into a structured JSON Schema for the agent:",
        },
      ],
      { style: "normal", keySeed: `${k}_decl_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `<!-- Declarative WebMCP Tool Form (as shipped on alexpatterson.dev & codingcat.dev/demos/web-ai) -->
<form
  action="/speaker-kit.json"
  method="get"
  toolname="get_speaker_kit_json"
  tooldescription="Fetch Alex Patterson's programmatic speaker kit JSON including bios, talk abstracts, Sanity CDN headshots, and speaking ledger"
  toolautosubmit="true"
>
  <label for="speaker-kit-section">Speaker Kit Section</label>
  <select
    id="speaker-kit-section"
    name="section"
    required
    toolparamdescription="Speaker kit section to retrieve (all, bios, talks, headshots, ledger)"
  >
    <option value="all">Full Speaker Kit (JSON)</option>
    <option value="bios">Bios (6 Variants)</option>
    <option value="talks">Talk Abstracts</option>
    <option value="headshots">Press Headshots</option>
    <option value="ledger">Speaking Track Record</option>
  </select>
  <button type="submit">Download JSON</button>
</form>`,
      "html",
      `${k}_code_decl`
    )
  );

  blocks.push(
    createTextBlock(
      "AJ Pro-Tip: Security Annotations and Prompt Injection Guardrails",
      "h2",
      `${k}_h2_security`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "AJ Pro-Tip: Always Set readOnlyHint and untrustedContentHint Accurately. ",
          strong: true,
        },
        {
          text: "Because WebMCP tools execute with the user's active session cookies, a malicious third-party comment on a page could attempt indirect prompt injection to trick a browser agent into invoking a state-mutating tool. Always set ",
        },
        { text: "readOnlyHint: true", code: true },
        {
          text: " on safe query tools so the browser agent knows it can run them without confirmation, and omit ",
        },
        { text: "readOnlyHint", code: true },
        {
          text: " (or set ",
        },
        { text: "destructiveHint: true", code: true },
        {
          text: ") on checkout, deletion, or credential-modifying actions so Chrome prompts the user for explicit human-in-the-loop approval.",
        },
      ],
      { style: "blockquote", keySeed: `${k}_sec_quote` }
    )
  );

  appendStandardConclusion(blocks, k);

  return {
    _id: "post-webmcp-browser-native-model-context-protocol-2026",
    _type: "post",
    title: cleanDashes(
      "WebMCP Explained: Exposing Browser-Native AI Tools with document.modelContext and Declarative HTML"
    ),
    slug: {
      _type: "slug",
      current: "webmcp-browser-native-model-context-protocol-guide",
    },
    date: "2026-04-14T15:00:00.000Z",
    excerpt: cleanDashes(
      "Stop forcing browser AI agents to scrape brittle DOM trees. Learn how the W3C WebMCP specification (document.modelContext.registerTool and declarative <form toolname> attributes) turns your web app into a type-safe, zero-latency agent toolkit."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets.p2Hero },
      alt: "Alex Patterson and AJ the Cat showcasing WebMCP browser tools with document.modelContext and registerTool",
    },
    author: [{ _type: "reference", _key: "author_alex", _ref: ALEX_AUTHOR_REF }],
    tags: [
      { _key: "t1", label: "WebMCP", value: "webmcp" },
      { _key: "t2", label: "MCP", value: "mcp" },
      { _key: "t3", label: "Web AI", value: "web-ai" },
      { _key: "t4", label: "Chrome", value: "chrome" },
      { _key: "t5", label: "Web Technologies", value: "web-technologies" },
    ],
    content: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST 3: Jun 09, 2026 - Zero-Backend Client-Side WebGPU RAG + Transformers.js + OPFS
// ─────────────────────────────────────────────────────────────────────────────
function buildPost3(assets) {
  const k = "p3";
  const blocks = [];

  blocks.push(
    createRichBlock(
      [
        {
          text: "Most teams building semantic search or Retrieval-Augmented Generation (RAG) for documentation portals reach straight for a cloud vector database and an external embedding API. That works fine until you need instant sub-10ms keystroke search, offline availability, or strict zero-egress privacy for user documents. With ",
        },
        {
          text: "WebGPU compute shaders",
          href: "https://developer.chrome.com/docs/web-platform/webgpu",
          strong: true,
        },
        { text: ", " },
        { text: "Transformers.js v3", strong: true },
        { text: ", " },
        { text: "Google MediaPipe", strong: true },
        { text: ", and the " },
        { text: "Origin Private File System (OPFS)", code: true },
        {
          text: ", you can run the entire embedding, vector indexing, and synthesis pipeline directly inside the user's browser tab.",
        },
      ],
      { style: "normal", keySeed: `${k}_hook_1` }
    )
  );

  blocks.push(
    createTextBlock(
      "The Mental Model: Local WebGPU Shaders + OPFS Binary Vector Cache",
      "h2",
      `${k}_h2_mental`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Why did client-side embeddings feel sluggish three years ago? Because running matrix multiplication on a single JavaScript main thread blocks UI rendering, and WebGL was designed for rasterizing triangles rather than general-purpose tensor math. ",
        },
        { text: "WebGPU", strong: true },
        {
          text: " gives browser Web Workers direct access to GPU compute pipelines (",
        },
        { text: "GPUBuffer", code: true },
        { text: " and WGSL compute shaders), while " },
        { text: "OPFS", code: true },
        {
          text: " provides high-throughput binary file storage so quantized ONNX models and pre-computed ",
        },
        { text: "Float32Array", code: true },
        {
          text: " vector indexes load from disk in milliseconds on repeat visits.",
        },
      ],
      { style: "normal", keySeed: `${k}_mental_p1` }
    )
  );

  blocks.push(
    createImageBlock(
      assets.p3Diagram,
      "Dark-mode Architecture Diagram comparing server-bound cloud vector pipelines against zero-backend client-side WebGPU RAG with Transformers.js and OPFS",
      "Architecture Diagram: Cloud-Bound Vector Pipeline (left, Coral anti-pattern) vs. Zero-Backend Client-Side WebGPU RAG with OPFS and On-Device Gemini Nano (right, Mint recommended pattern).",
      `${k}_img_diag`
    )
  );

  blocks.push(
    createTextBlock(
      "Browser Compute Runtimes Comparison: WebAssembly vs. WebGL vs. WebGPU vs. WebNN",
      "h2",
      `${k}_h2_tbl`
    )
  );

  blocks.push(
    createTableBlock(
      [
        [
          "Browser Compute Backend",
          "Hardware Target",
          "384-d Embedding Latency (Batch=1)",
          "Quantization Support & Best Use Case",
        ],
        [
          "WASM SIMD (Threads)",
          "Multi-core CPU",
          "18ms to 45ms",
          "q8 / int8 universal fallback for devices without discrete or integrated WebGPU.",
        ],
        [
          "WebGL 2.0",
          "Legacy GPU Fragment Shaders",
          "12ms to 30ms",
          "fp16 / fp32 texture hacks; lacks native storage buffers and compute workgroups.",
        ],
        [
          "WebGPU (navigator.gpu)",
          "Modern GPU Compute Units",
          "1.8ms to 5.5ms",
          "q4f16 / fp16 / int8 via WGSL compute shaders; ideal for Transformers.js v3 and MediaPipe.",
        ],
        [
          "WebNN (navigator.ml)",
          "Dedicated NPU / OS ML Accelerator",
          "1.2ms to 4.0ms",
          "Direct OS-level graph compilation (DirectML, CoreML, NNAPI) for ultra-low battery drain.",
        ],
      ],
      `${k}_tbl_backends`
    )
  );

  blocks.push(
    createTextBlock(
      "Step 1: Generating 384-Dimensional Embeddings on WebGPU in a Web Worker",
      "h2",
      `${k}_h2_step1`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "To keep Main Thread Interaction to Next Paint (INP) under 16ms, always initialize your embedding pipeline inside a dedicated Web Worker and probe ",
        },
        { text: "navigator.gpu.requestAdapter()", code: true },
        {
          text: " to select ",
        },
        { text: "device: 'webgpu'", code: true },
        {
          text: " with graceful fallback to ",
        },
        { text: "'wasm'", code: true },
        { text: ":" },
      ],
      { style: "normal", keySeed: `${k}_step1_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/workers/embedding-worker.ts
import { pipeline, env, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Cache quantized ONNX weights in the browser Cache API / OPFS
env.allowLocalModels = false;
env.useBrowserCache = true;

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

async function detectOptimalDevice(): Promise<"webgpu" | "wasm"> {
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    try {
      const adapter = await (navigator as unknown as { gpu: GPU }).gpu.requestAdapter();
      if (adapter) return "webgpu";
    } catch (_) {
      // Fallback to WASM SIMD
    }
  }
  return "wasm";
}

export async function getEmbeddingExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    const device = await detectOptimalDevice();
    extractorPromise = pipeline(
      "feature-extraction",
      "Snowflake/snowflake-arctic-embed-xs",
      {
        device,
        dtype: device === "webgpu" ? "fp16" : "q8",
      }
    );
  }
  return extractorPromise;
}

export async function embedTextToFloat32(text: string): Promise<Float32Array> {
  const extractor = await getEmbeddingExtractor();
  const output = await extractor(text, {
    pooling: "cls",
    normalize: true,
  });
  return new Float32Array(output.data as Float32Array);
}`,
      "typescript",
      `${k}_code_worker`
    )
  );

  blocks.push(
    createTextBlock(
      "Step 2: Persisting Binary Vector Indexes in Origin Private File System (OPFS)",
      "h2",
      `${k}_h2_step2`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Storing thousands of JSON-serialized float arrays in ",
        },
        { text: "localStorage", code: true },
        {
          text: " or naive IndexedDB object stores creates massive serialization overhead. Instead, pack your normalized ",
        },
        { text: "Float32Array", code: true },
        {
          text: " embeddings contiguously into a binary file inside ",
        },
        { text: "navigator.storage.getDirectory()", code: true },
        {
          text: " (OPFS) and run a single-pass dot-product scan:",
        },
      ],
      { style: "normal", keySeed: `${k}_step2_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/vector/opfs-vector-index.ts
export interface VectorMetadata {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export class OpfsFlatVectorIndex {
  private readonly dim: number;
  private vectors: Float32Array = new Float32Array(0);
  private docs: VectorMetadata[] = [];

  constructor(dimensions = 384) {
    this.dim = dimensions;
  }

  async saveToOpfs(filename = "codingcat-vectors-384d.bin"): Promise<void> {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(this.vectors.buffer);
    await writable.close();

    const metaHandle = await root.getFileHandle(\`\${filename}.meta.json\`, { create: true });
    const metaWritable = await metaHandle.createWritable();
    await metaWritable.write(JSON.stringify(this.docs));
    await metaWritable.close();
  }

  async loadFromOpfs(filename = "codingcat-vectors-384d.bin"): Promise<boolean> {
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      this.vectors = new Float32Array(arrayBuffer);

      const metaHandle = await root.getFileHandle(\`\${filename}.meta.json\`);
      const metaFile = await metaHandle.getFile();
      this.docs = JSON.parse(await metaFile.text()) as VectorMetadata[];
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Since embeddings are L2-normalized at extraction time,
   * Cosine Similarity equals the raw dot product.
   */
  searchTopK(queryVec: Float32Array, k = 5): Array<VectorMetadata & { score: number }> {
    const count = this.docs.length;
    const dim = this.dim;
    const scores: Array<{ idx: number; score: number }> = [];

    for (let i = 0; i < count; i++) {
      const offset = i * dim;
      let dot = 0;
      for (let d = 0; d < dim; d++) {
        dot += queryVec[d] * this.vectors[offset + d];
      }
      scores.push({ idx: i, score: dot });
    }

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, k).map(({ idx, score }) => ({
      ...this.docs[idx],
      score,
    }));
  }
}`,
      "typescript",
      `${k}_code_opfs`
    )
  );

  blocks.push(
    createTextBlock(
      "AJ Pro-Tip: Ship Pre-Computed Binary Embeddings from Your Astro Build",
      "h2",
      `${k}_h2_gotcha`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "AJ Pro-Tip: Pre-Compute Corpus Embeddings at Build Time, Embed Only the Query in the Browser. ",
          strong: true,
        },
        {
          text: "Do not force every visitor's GPU to embed your entire 500-article blog archive on first page load. Generate your ",
        },
        { text: "codingcat-vectors-384d.bin", code: true },
        {
          text: " binary artifact once during your Astro static/SSR build (less than 750KB for 500 articles at ",
        },
        { text: "Float32", code: true },
        {
          text: " or 375KB at ",
        },
        { text: "Float16", code: true },
        {
          text: "), cache it in OPFS, and only run the WebGPU embedding pipeline on the user's 10-word search query.",
        },
      ],
      { style: "blockquote", keySeed: `${k}_gotcha_quote` }
    )
  );

  appendStandardConclusion(blocks, k);

  return {
    _id: "post-client-side-webgpu-rag-transformers-js-opfs-2026",
    _type: "post",
    title: cleanDashes(
      "Zero-Backend Client-Side RAG in the Browser with WebGPU, Transformers.js, MediaPipe, and OPFS"
    ),
    slug: {
      _type: "slug",
      current: "client-side-webgpu-rag-transformers-js-mediapipe-opfs",
    },
    date: "2026-06-09T14:00:00.000Z",
    excerpt: cleanDashes(
      "Build a sub-10ms, offline-capable semantic search and RAG engine entirely inside the browser using WebGPU compute shaders, Transformers.js v3, Origin Private File System (OPFS) binary vector caching, and Chrome Built-in AI."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets.p3Hero },
      alt: "Alex Patterson and AJ the Cat demonstrating zero-backend client-side WebGPU RAG with OPFS vector storage",
    },
    author: [{ _type: "reference", _key: "author_alex", _ref: ALEX_AUTHOR_REF }],
    tags: [
      { _key: "t1", label: "WebGPU", value: "webgpu" },
      { _key: "t2", label: "Transformers.js", value: "transformers-js" },
      { _key: "t3", label: "Web AI", value: "web-ai" },
      { _key: "t4", label: "RAG", value: "rag" },
      { _key: "t5", label: "Web Technologies", value: "web-technologies" },
    ],
    content: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST 4: Aug 11, 2026 - Hybrid Browser-to-Edge AI Routing
// ─────────────────────────────────────────────────────────────────────────────
function buildPost4(assets) {
  const k = "p4";
  const blocks = [];

  blocks.push(
    createRichBlock(
      [
        {
          text: "The biggest mistake web engineering teams make when adopting client-side AI is treating it as an all-or-nothing binary choice: either 100% of inference runs in the browser or 100% runs in the cloud. In real-world production, visitor hardware spans everything from an M4 Max MacBook Pro with Chrome's on-device ",
        },
        { text: "Gemini Nano", strong: true },
        {
          text: " cached in VRAM to a budget mobile browser on a cellular connection. The solution is ",
        },
        { text: "Hybrid Browser-to-Edge AI Routing", strong: true },
        { text: "." },
      ],
      { style: "normal", keySeed: `${k}_hook_1` }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "By pairing Chrome's local ",
        },
        { text: "window.LanguageModel", code: true },
        {
          text: " API with ",
        },
        {
          text: "Firebase AI Logic",
          href: "https://firebase.google.com/docs/ai-logic",
          strong: true,
        },
        {
          text: " (or a Cloudflare Worker edge gateway calling ",
        },
        { text: "Gemini Flash", strong: true },
        {
          text: "), you can build a unified TypeScript router that offloads 70%+ of routine summarization, classification, and UI drafting tasks to the user's device at $0 cost while seamlessly routing complex reasoning or unsupported browsers to the edge.",
        },
      ],
      { style: "normal", keySeed: `${k}_hook_2` }
    )
  );

  blocks.push(
    createTextBlock(
      "The Mental Model: Adaptive Capability & Complexity Routing",
      "h2",
      `${k}_h2_mental`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Our hybrid router evaluates three deterministic gates before dispatching a prompt: (1) ",
        },
        { text: "Hardware Availability", strong: true },
        {
          text: " (is Chrome's ",
        },
        { text: "LanguageModel.availability() === 'available'", code: true },
        { text: " immediately ready without blocking on a multi-hundred-megabyte download?), (2) " },
        { text: "Context Budget", strong: true },
        {
          text: " (does the prompt fit comfortably inside Gemini Nano's local token quota?), and (3) " },
        { text: "Task Complexity", strong: true },
        {
          text: " (does the request require multi-hop tool calling or massive 100K-token context?).",
        },
      ],
      { style: "normal", keySeed: `${k}_mental_p1` }
    )
  );

  blocks.push(
    createImageBlock(
      assets.p4Diagram,
      "Dark-mode Architecture Diagram comparing naive single-tier cloud routing against a Hybrid Browser-to-Edge AI Router using Chrome Gemini Nano and Firebase AI Logic",
      "Architecture Diagram: Naive Cloud-Only Routing (left, Coral anti-pattern) vs. Hybrid Browser-to-Edge AI Router combining Local Gemini Nano and Firebase AI Logic / Cloudflare Workers (right, Mint recommended pattern).",
      `${k}_img_diag`
    )
  );

  blocks.push(
    createTextBlock(
      "Comparing Local-Only, Cloud-Only, and Hybrid Browser-to-Edge Architectures",
      "h2",
      `${k}_h2_tbl`
    )
  );

  blocks.push(
    createTableBlock(
      [
        [
          "Architectural Metric",
          "Local-Only (Browser AI)",
          "Cloud-Only (Server LLM API)",
          "Hybrid Browser-to-Edge Router (Recommended)",
        ],
        [
          "Browser Coverage",
          "Desktop Chrome / Edge with GPU/NPU",
          "100% of browsers (requires network)",
          "100% of browsers (local fast-lane + cloud fallback)",
        ],
        [
          "P50 Time-to-First-Token (TTFT)",
          "15ms to 45ms (0ms network RTT)",
          "280ms to 650ms",
          "25ms on capable desktops / 280ms on mobile fallback",
        ],
        [
          "Unit Economics (50K MAU)",
          "$0.00 / month",
          "$450 to $1,800 / month",
          "70% to 80% cost reduction via local offload",
        ],
        [
          "Offline Resilience",
          "Full offline execution",
          "Fails when offline",
          "Graceful offline mode for local tasks + cloud sync when online",
        ],
      ],
      `${k}_tbl_hybrid`
    )
  );

  blocks.push(
    createTextBlock(
      "Production Implementation: The Unified Hybrid Web AI Router",
      "h2",
      `${k}_h2_code1`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Here is the complete TypeScript router pattern that pairs Chrome's native ",
        },
        { text: "window.LanguageModel", code: true },
        {
          text: " with Firebase AI Logic's hybrid on-device/cloud model abstraction and an Astro Cloudflare Worker fallback:",
        },
      ],
      { style: "normal", keySeed: `${k}_code1_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/ai/hybrid-web-ai-router.ts
export type InferenceRoute = "local-gemini-nano" | "edge-gemini-flash";

export interface HybridPromptRequest {
  prompt: string;
  systemPrompt?: string;
  complexity?: "fast-local-preferred" | "reasoning-cloud-required";
  maxLocalTokens?: number;
  signal?: AbortSignal;
}

export interface HybridPromptResponse {
  text: string;
  route: InferenceRoute;
  latencyMs: number;
  estimatedCloudCostSavedUsd: number;
}

export async function runHybridWebAiPrompt(
  req: HybridPromptRequest
): Promise<HybridPromptResponse> {
  const start = performance.now();
  const maxLocalTokens = req.maxLocalTokens ?? 2048;

  // 1. Attempt Fast Lane: Local Chrome Built-in AI (Gemini Nano)
  if (req.complexity !== "reasoning-cloud-required") {
    const lm = (globalThis as Record<string, any>).LanguageModel;
    if (lm && typeof lm.availability === "function") {
      try {
        const status = await lm.availability();
        // Only route locally if weights are already warm/available on disk
        if (status === "available") {
          const session = await lm.create({
            systemPrompt:
              req.systemPrompt ??
              "You are a technical assistant on CodingCat.dev. Be concise and accurate.",
            signal: req.signal,
          });
          try {
            const usage = await session.measureInputUsage(req.prompt);
            if (usage <= maxLocalTokens && usage < session.inputQuota - session.inputUsage) {
              const text = await session.prompt(req.prompt, { signal: req.signal });
              return {
                text,
                route: "local-gemini-nano",
                latencyMs: Number((performance.now() - start).toFixed(1)),
                estimatedCloudCostSavedUsd: 0.00042,
              };
            }
          } finally {
            session.destroy();
          }
        }
      } catch (localErr) {
        console.warn("[HybridWebAI] Local Gemini Nano failed, falling back to edge:", localErr);
      }
    }
  }

  // 2. Fallback Lane: Cloudflare Worker / Firebase AI Logic Edge Endpoint (Gemini Flash)
  const edgeRes = await fetch("/api/ai/hybrid-fallback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: req.prompt,
      systemPrompt: req.systemPrompt,
    }),
    signal: req.signal,
  });

  if (!edgeRes.ok) {
    throw new Error(\`Hybrid Edge AI fallback failed with HTTP \${edgeRes.status}\`);
  }

  const data = (await edgeRes.json()) as { text: string };
  return {
    text: data.text,
    route: "edge-gemini-flash",
    latencyMs: Number((performance.now() - start).toFixed(1)),
    estimatedCloudCostSavedUsd: 0,
  };
}`,
      "typescript",
      `${k}_code_router`
    )
  );

  blocks.push(
    createTextBlock(
      "Warming the Local Model in the Background Without Blocking UX",
      "h2",
      `${k}_h2_warm`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Notice how our router above only takes the local fast lane when ",
        },
        { text: "status === 'available'", code: true },
        {
          text: ". What if the user's browser returns ",
        },
        { text: "'downloadable'", code: true },
        {
          text: "? Instead of making the user wait 30 seconds on their first prompt, fulfill their immediate request via the ",
        },
        { text: "edge-gemini-flash", code: true },
        {
          text: " route while triggering ",
        },
        { text: "LanguageModel.create()", code: true },
        {
          text: " asynchronously in the background. Once the download completes, every subsequent prompt in their session automatically upgrades to the 0ms local lane.",
        },
      ],
      { style: "normal", keySeed: `${k}_warm_p1` }
    )
  );

  appendStandardConclusion(blocks, k);

  return {
    _id: "post-hybrid-web-ai-routing-gemini-nano-firebase-workers-2026",
    _type: "post",
    title: cleanDashes(
      "Hybrid Web AI Architecture: Routing Between Browser Gemini Nano, Firebase AI Logic, and Edge Workers"
    ),
    slug: {
      _type: "slug",
      current: "hybrid-web-ai-routing-gemini-nano-firebase-ai-logic-workers",
    },
    date: "2026-08-11T16:00:00.000Z",
    excerpt: cleanDashes(
      "Architect a production Hybrid Web AI router in TypeScript that runs 0ms, $0 client-side inference on Chrome's built-in Gemini Nano when available and seamlessly falls back to Gemini Flash via Firebase AI Logic and Cloudflare Workers."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets.p4Hero },
      alt: "Alex Patterson and AJ the Cat illustrating Hybrid Web AI routing between local Chrome Gemini Nano and Edge Cloud AI",
    },
    author: [{ _type: "reference", _key: "author_alex", _ref: ALEX_AUTHOR_REF }],
    tags: [
      { _key: "t1", label: "Web AI", value: "web-ai" },
      { _key: "t2", label: "Firebase", value: "firebase" },
      { _key: "t3", label: "Gemini Nano", value: "gemini-nano" },
      { _key: "t4", label: "Cloudflare Workers", value: "cloudflare-workers" },
      { _key: "t5", label: "Architecture", value: "architecture" },
    ],
    content: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST 5: Sep 22, 2026 - Architecting the Agent-Ready Web Stack
// ─────────────────────────────────────────────────────────────────────────────
function buildPost5(assets) {
  const k = "p5";
  const blocks = [];

  blocks.push(
    createRichBlock(
      [
        {
          text: "Over the past year, a new class of traffic has arrived on every developer documentation site, media platform, and SaaS application: autonomous coding agents, browser assistants, and MCP clients. Yet most websites still serve bloated 250KB HTML bundles to headless agents and force in-tab browser assistants to guess CSS selectors. On ",
        },
        { text: "CodingCat.dev", href: "/developers", strong: true },
        { text: " and " },
        { text: "alexpatterson.dev", href: "https://alexpatterson.dev", strong: true },
        {
          text: ", we engineered a dual-plane ",
        },
        { text: "Agent-Ready Web Architecture", strong: true },
        {
          text: " that serves both in-browser AI agents (via ",
        },
        { text: "WebMCP", strong: true },
        {
          text: ") and external CLI/cloud agents (via ",
        },
        { text: "Streamable HTTP MCP", strong: true },
        { text: ", " },
        { text: "RFC 9727 API Catalogs", strong: true },
        { text: ", and " },
        { text: "Accept: text/markdown", code: true },
        { text: " content negotiation)." },
      ],
      { style: "normal", keySeed: `${k}_hook_1` }
    )
  );

  blocks.push(
    createTextBlock(
      "The Dual-Plane Architecture: Client Plane (WebMCP) + Edge Plane (HTTP MCP & RFC 9727)",
      "h2",
      `${k}_h2_mental`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Why do you need both ",
        },
        { text: "WebMCP", strong: true },
        { text: " and " },
        { text: "Streamable HTTP MCP", strong: true },
        {
          text: "? Because AI agents interact with your web property from two completely different execution contexts:",
        },
      ],
      { style: "normal", keySeed: `${k}_mental_p1` }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "1. The Client Browser Plane (In-Tab Agents): ",
          strong: true,
        },
        {
          text: "When a user opens your site in Chrome and asks their built-in browser assistant to search tutorials, filter courses, or grab a speaker kit, the agent is already inside the DOM sandbox. Exposing ",
        },
        { text: "document.modelContext.registerTool()", code: true },
        { text: " and declarative " },
        { text: "<form toolname=\"...\">", code: true },
        {
          text: " tools lets the browser assistant execute actions in 0ms using the user's existing cookies and UI state.",
        },
      ],
      { style: "normal", listItem: "bullet", keySeed: `${k}_mental_b1` }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "2. The Edge Network Plane (Headless & IDE Agents): ",
          strong: true,
        },
        {
          text: "When a developer in Cursor, Claude Code, or Google Antigravity points their agent at ",
        },
        { text: "https://codingcat.dev", code: true },
        {
          text: ", there is no browser DOM. That agent discovers capabilities via RFC 8288 HTTP ",
        },
        { text: "Link", code: true },
        {
          text: " headers, reads ",
        },
        { text: "/llms.txt", code: true },
        {
          text: " or requests ",
        },
        { text: "Accept: text/markdown", code: true },
        {
          text: ", and calls tools over JSON-RPC at ",
        },
        { text: "POST /api/mcp", code: true },
        { text: "." },
      ],
      { style: "normal", listItem: "bullet", keySeed: `${k}_mental_b2` }
    )
  );

  blocks.push(
    createImageBlock(
      assets.p5Diagram,
      "Dark-mode Architecture Diagram showing the Dual-Plane Agent-Ready Web Architecture combining Client-Side WebMCP and Edge Streamable HTTP MCP",
      "Architecture Diagram: Opaque HTML-Only Website (left, Coral anti-pattern) vs. Dual-Plane Agent-Ready Web Stack combining Client WebMCP and Edge RFC 9727 + Streamable HTTP MCP (right, Mint recommended pattern).",
      `${k}_img_diag`
    )
  );

  blocks.push(
    createTextBlock(
      "The 5 Pillars of an Agent-Ready Web Application",
      "h2",
      `${k}_h2_tbl`
    )
  );

  blocks.push(
    createTableBlock(
      [
        [
          "Protocol / Standard",
          "Live Endpoint on CodingCat.dev",
          "Target Agent Runtime",
          "Token & Latency Impact",
        ],
        [
          "W3C WebMCP (Imperative & Declarative)",
          "document.modelContext & <form toolname>",
          "In-Browser AI Assistants (Chrome AI, Extensions)",
          "Reduces DOM scraping tokens by 90%; 0ms in-tab execution.",
        ],
        [
          "Streamable HTTP MCP",
          "POST /api/mcp & /.well-known/mcp/server-card.json",
          "IDE & Cloud Agents (Antigravity, Cursor, Claude Code)",
          "Stateless JSON-RPC 2.0 tool execution at the Cloudflare Edge.",
        ],
        [
          "Markdown Content Negotiation",
          "Accept: text/markdown or /post/[slug]/index.md",
          "LLM Crawlers & RAG Pipelines",
          "Cuts payload size from 180KB HTML to 6KB clean Markdown.",
        ],
        [
          "RFC 9727 API Catalog & Link Headers",
          "/.well-known/api-catalog & HTTP Link Header",
          "Autonomous Discovery Scanners",
          "Zero-guesswork capability discovery on any HTTP HEAD/GET.",
        ],
        [
          "Scoped LLM Directories",
          "/llms.txt, /blog/llms.txt, /podcasts/llms.txt",
          "Context-Window-Bounded Answer Engines",
          "Provides hierarchical site map optimized for LLM context windows.",
        ],
      ],
      `${k}_tbl_pillars`
    )
  );

  blocks.push(
    createTextBlock(
      "Sharing One Tool Schema Across Browser WebMCP and Edge HTTP MCP",
      "h2",
      `${k}_h2_shared`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "The cleanest architectural pattern we discovered while building CodingCat.dev's agent layer is defining a single canonical tool contract in TypeScript and binding it to both ",
        },
        { text: "document.modelContext.registerTool()", code: true },
        {
          text: " on the client and your Astro ",
        },
        { text: "/api/mcp", code: true },
        {
          text: " JSON-RPC route on the edge:",
        },
      ],
      { style: "normal", keySeed: `${k}_shared_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/mcp/shared-search-tool.ts
export const SEARCH_CONTENT_TOOL_SCHEMA = {
  name: "search_content",
  description:
    "Search CodingCat.dev Courses, Podcasts, and Blog Posts by keyword or topic",
  annotations: {
    readOnlyHint: true,
    untrustedContentHint: true,
  },
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Search keyword (e.g. WebMCP, Gemini Nano, WebGPU, Astro, Sanity)",
      },
    },
    required: ["query"],
  },
};

// 1. Client-side binding for Browser WebMCP (document.modelContext)
export function registerClientWebMcpSearch(origin = "") {
  const mc =
    (typeof document !== "undefined" && (document as any).modelContext) ||
    (typeof navigator !== "undefined" && (navigator as any).modelContext);
  if (!mc || typeof mc.registerTool !== "function") return;

  mc.registerTool({
    ...SEARCH_CONTENT_TOOL_SCHEMA,
    execute: async ({ query }: { query: string }) => {
      const res = await fetch(\`\${origin}/api/search?q=\${encodeURIComponent(query)}\`);
      return await res.json();
    },
  });
}

// 2. Edge-side binding for Streamable HTTP MCP (POST /api/mcp)
export async function handleEdgeMcpToolCall(
  toolName: string,
  args: Record<string, unknown>,
  siteOrigin: string
) {
  if (toolName === SEARCH_CONTENT_TOOL_SCHEMA.name) {
    const query = String(args.query || "");
    const res = await fetch(\`\${siteOrigin}/api/search?q=\${encodeURIComponent(query)}\`);
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      isError: false,
    };
  }
  throw new Error(\`Unknown MCP tool: \${toolName}\`);
}`,
      "typescript",
      `${k}_code_shared`
    )
  );

  blocks.push(
    createTextBlock(
      "Step 2: Astro Middleware for RFC 8288 Discovery Headers and Markdown Negotiation",
      "h2",
      `${k}_h2_mw`
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "To make sure every agent discovers your WebMCP manifest, MCP server card, and Markdown endpoints automatically, attach RFC 8288 ",
        },
        { text: "Link", code: true },
        {
          text: " headers and inspect the ",
        },
        { text: "Accept", code: true },
        {
          text: " header in your Astro middleware:",
        },
      ],
      { style: "normal", keySeed: `${k}_mw_p1` }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/middleware.ts (Excerpt from CodingCat.dev production middleware)
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const origin = context.url.origin;
  const accept = context.request.headers.get("accept") || "";

  // If an AI agent sends Accept: text/markdown, rewrite transparently to the .md route
  if (
    accept.includes("text/markdown") &&
    !context.url.pathname.endsWith(".md") &&
    !context.url.pathname.startsWith("/api/")
  ) {
    const mdPath =
      context.url.pathname === "/" ? "/index.md" : \`\${context.url.pathname}/index.md\`;
    return context.rewrite(mdPath);
  }

  const response = await next();
  response.headers.append(
    "Link",
    [
      \`<\${origin}/.well-known/api-catalog>; rel="api-catalog"\`,
      \`<\${origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card"\`,
      \`<\${origin}/llms.txt>; rel="llms-txt"\`,
      \`<\${origin}/AGENTS.md>; rel="agent-guide"\`,
    ].join(", ")
  );
  return response;
});`,
      "typescript",
      `${k}_code_mw`
    )
  );

  appendStandardConclusion(blocks, k);

  return {
    _id: "post-agent-ready-web-architecture-webmcp-mcp-llms-txt-2026",
    _type: "post",
    title: cleanDashes(
      "Architecting the Agent-Ready Web: Combining Client-Side WebMCP, Streamable HTTP MCP, and RFC 9727 Discovery"
    ),
    slug: {
      _type: "slug",
      current: "agent-ready-web-architecture-webmcp-streamable-mcp-llms-txt",
    },
    date: "2026-09-22T15:15:00.000Z",
    excerpt: cleanDashes(
      "A complete walkthrough of CodingCat.dev's dual-plane Agent-Ready Web Architecture: pairing client-side W3C WebMCP tools (document.modelContext and declarative HTML forms) with edge Streamable HTTP MCP endpoints, RFC 9727 API catalogs, and Markdown content negotiation."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets.p5Hero },
      alt: "Alex Patterson and AJ the Cat presenting the Dual-Plane Agent-Ready Web Stack with WebMCP and Streamable HTTP MCP",
    },
    author: [{ _type: "reference", _key: "author_alex", _ref: ALEX_AUTHOR_REF }],
    tags: [
      { _key: "t1", label: "WebMCP", value: "webmcp" },
      { _key: "t2", label: "MCP", value: "mcp" },
      { _key: "t3", label: "Web AI", value: "web-ai" },
      { _key: "t4", label: "Astro", value: "astro" },
      { _key: "t5", label: "Architecture", value: "architecture" },
    ],
    content: blocks,
  };
}

async function main() {
  console.log(`Publishing 5 Backdated Web AI & WebMCP Flagship Posts to Sanity (${dataset})...`);

  const assets = {
    p1Hero: await uploadJpegToSanity("post-1-chrome-built-in-ai-hero.jpg", dataset),
    p1Diagram: await uploadJpegToSanity("post-1-chrome-built-in-ai-diagram.jpg", dataset),
    p2Hero: await uploadJpegToSanity("post-2-webmcp-protocol-hero.jpg", dataset),
    p2Diagram: await uploadJpegToSanity("post-2-webmcp-protocol-diagram.jpg", dataset),
    p3Hero: await uploadJpegToSanity("post-3-client-side-webgpu-rag-hero.jpg", dataset),
    p3Diagram: await uploadJpegToSanity("post-3-client-side-webgpu-rag-diagram.jpg", dataset),
    p4Hero: await uploadJpegToSanity("post-4-hybrid-web-ai-routing-hero.jpg", dataset),
    p4Diagram: await uploadJpegToSanity("post-4-hybrid-web-ai-routing-diagram.jpg", dataset),
    p5Hero: await uploadJpegToSanity("post-5-agent-ready-web-stack-hero.jpg", dataset),
    p5Diagram: await uploadJpegToSanity("post-5-agent-ready-web-stack-diagram.jpg", dataset),
  };

  const posts = [
    buildPost1(assets),
    buildPost2(assets),
    buildPost3(assets),
    buildPost4(assets),
    buildPost5(assets),
  ];

  // Also upsert the Web AI Talk Abstract & Speaking Event for alexpatterson.dev
  const webAiTalkDoc = {
    _id: "talk-client-side-web-ai-webmcp",
    _type: "talkAbstract",
    title:
      "The Agentic Browser: Building Zero-Latency Web Apps with Chrome Built-in AI, WebGPU, and WebMCP",
    slug: {
      _type: "slug",
      current: "the-agentic-browser-chrome-built-in-ai-webgpu-webmcp",
    },
    format: "keynote",
    status: "active",
    order: 1,
    tags: [
      "WebMCP",
      "Chrome Built-in AI",
      "Gemini Nano",
      "WebGPU",
      "Web Technologies",
    ],
    abstract:
      "For the past three years, web developers treated AI as a remote HTTP call to a cloud GPU cluster, paying a 500ms latency tax on every keystroke and forcing browser agents to scrape fragile DOM trees. That era is ending. With Chrome's Built-in AI APIs (Prompt, Summarizer, Rewriter, and Translator powered by on-device Gemini Nano), WebGPU compute shaders for client-side embeddings, and the W3C WebMCP specification (document.modelContext and declarative HTML tool forms), the browser is now a first-class AI runtime and agent host. In this session, we walk through live production code from CodingCat.dev showing how to build zero-backend client-side RAG, hybrid browser-to-edge AI routers with Firebase AI Logic and Cloudflare Workers, and deterministic WebMCP tools that reduce agent token overhead by 90%.",
    takeaways: [
      "Wiring up Chrome Built-in AI (window.LanguageModel, Summarizer, and Rewriter) with progressive download states and hybrid cloud fallbacks.",
      "Exposing deterministic in-tab tools to browser AI agents using WebMCP imperative (document.modelContext.registerTool) and declarative (<form toolname>) APIs.",
      "Running quantized embedding models on WebGPU with Origin Private File System (OPFS) vector caching for sub-10ms client-side semantic search.",
    ],
  };

  const webAiEventDoc = {
    _id: "event-chrome-web-ai-webmcp-2026",
    _type: "speakingEvent",
    eventName: "Web AI & Agentic Browser Architecture Deep Dive",
    talkTitle:
      "The Agentic Browser: Building Zero-Latency Web Apps with Chrome Built-in AI, WebGPU, and WebMCP",
    date: "2026-08-20",
    eventFormat: "Virtual",
    city: "Remote",
    country: "USA",
    role: "Speaker",
    eventUrl: "https://codingcat.dev/demos/web-ai",
    slidesUrl:
      "https://codingcat.dev/post/webmcp-browser-native-model-context-protocol-guide",
    featured: true,
  };

  if (isDryRun) {
    for (const p of posts) {
      console.log(
        `[DRY RUN] Built ${p._id} | ${p.date} | /post/${p.slug.current} (${p.content.length} blocks)`
      );
    }
    return;
  }

  const mutations = [
    ...posts.map((doc) => ({ createOrReplace: doc })),
    { createOrReplace: webAiTalkDoc },
    { createOrReplace: webAiEventDoc },
    { delete: { id: "talk-wtf-is-firebase-now" } },
  ];

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

  for (const p of posts) {
    console.log(
      `Published [${p.date.slice(0, 10)}] https://codingcat.dev/post/${p.slug.current}`
    );
  }
  console.log("Published Web AI Talk Abstract & Speaking Event to Sanity.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
