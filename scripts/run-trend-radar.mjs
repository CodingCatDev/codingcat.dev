import crypto from "node:crypto";
import {
  OFFICIAL_DOCS_MAP,
  cleanFalsePositiveTags,
  rankDocTags,
  findBestRelatedDocs,
} from "./enrich-all-posts-aeo-seo-links.mjs";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const isDryRun = process.argv.includes("--dry-run") || !token;

const PURGE_DAYS = 30;
const MAX_SIGNALS_PER_RUN = 20;

const TOPIC_RULES = [
  { tag: { label: "MCP", value: "mcp" }, regex: /\b(mcp|model context protocol)\b/i, weight: 20 },
  { tag: { label: "AI", value: "ai" }, regex: /\b(ai|llm|llms|agent|agents|agentic|claude|gemini|openai|gpt|anthropic|deepseek|ollama|vllm|rag|inference)\b/i, weight: 15 },
  { tag: { label: "Next.js", value: "nextjs" }, regex: /\b(next\.?js|vercel|turbopack|app router)\b/i, weight: 18 },
  { tag: { label: "React", value: "react" }, regex: /\b(react|react 19|server components|rsc|jsx|tanstack)\b/i, weight: 15 },
  { tag: { label: "Svelte", value: "svelte" }, regex: /\b(svelte|sveltekit|svelte 5|runes)\b/i, weight: 18 },
  { tag: { label: "Angular", value: "angular" }, regex: /\b(angular|ng|signals)\b/i, weight: 15 },
  { tag: { label: "Astro", value: "astro" }, regex: /\b(astro)\b/i, weight: 15 },
  { tag: { label: "Vue", value: "vue" }, regex: /\b(vue|vuejs|nuxt|nitro|vite)\b/i, weight: 14 },
  { tag: { label: "TypeScript", value: "typescript" }, regex: /\b(typescript|ts|tsc|type-safe|zod)\b/i, weight: 15 },
  { tag: { label: "JavaScript", value: "javascript" }, regex: /\b(javascript|ecmascript|node\.?js|bun|deno|v8|npm|pnpm)\b/i, weight: 12 },
  { tag: { label: "Rust", value: "rust" }, regex: /\b(rust|cargo|wasm|webassembly|tauri)\b/i, weight: 14 },
  { tag: { label: "Python", value: "python" }, regex: /\b(python|pydantic|fastapi|pytorch|uv)\b/i, weight: 10 },
  { tag: { label: "PHP", value: "php" }, regex: /\b(php|laravel|wordpress|zend)\b/i, weight: 14 },
  { tag: { label: "Security", value: "security" }, regex: /\b(cve-\d{4}-\d+|vulnerability|rce|zero-day|0-day|auth|oauth|passkey|spicedb|security|exploit)\b/i, weight: 18 },
  { tag: { label: "Firebase", value: "firebase" }, regex: /\b(firebase|firestore|data connect|genkit|app hosting|firebase studio|crashlytics|fcm|cloud functions for firebase)\b/i, weight: 28 },
  { tag: { label: "AWS", value: "aws" }, regex: /\b(aws|amazon web services|lambda|s3|dynamodb|bedrock|amplify|cloudformation|cdk|ecs|eks|eventbridge|step functions)\b/i, weight: 28 },
  { tag: { label: "Cloudflare", value: "cloudflare" }, regex: /\b(cloudflare|workers|workerd|d1|r2|durable objects|hyperdrive|pages|wrangler|workers ai)\b/i, weight: 28 },
  { tag: { label: "Supabase", value: "supabase" }, regex: /\b(supabase|pgvector|postgres|postgresql)\b/i, weight: 16 },
  { tag: { label: "Sanity", value: "sanity" }, regex: /\b(sanity|groq|headless cms|portable text)\b/i, weight: 18 },
  { tag: { label: "CSS", value: "css" }, regex: /\b(css|tailwind|tailwindcss|view transitions|anchor positioning)\b/i, weight: 14 },
  { tag: { label: "Docker", value: "docker" }, regex: /\b(docker|kubernetes|k8s|container|linux)\b/i, weight: 10 },
  { tag: { label: "GitHub", value: "github" }, regex: /\b(github|git|open source|oss)\b/i, weight: 10 },
];

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "what", "how", "why", "when", "where",
  "your", "you", "are", "was", "were", "have", "has", "had", "into", "using", "build", "building",
  "new", "show", "ask", "tell", "via", "over", "more", "than", "now", "out", "can", "will",
]);

function cleanDashes(text) {
  if (!text) return "";
  return String(text)
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function tokenize(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function jaccardSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function isSameTopic(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return false;
  if (jaccardSimilarity(tokensA, tokensB) >= 0.30) return true;
  const setB = new Set(tokensB);
  let sharedSpecific = 0;
  for (const t of new Set(tokensA)) {
    if (setB.has(t) && t.length >= 4) sharedSpecific++;
  }
  return sharedSpecific >= 3;
}

function matchTagsAndScore(title, description = "", baseVelocityScore = 40) {
  const combined = `${title} ${description}`;
  const matchedTags = [];
  let bonus = 0;

  for (const rule of TOPIC_RULES) {
    if (rule.regex.test(combined)) {
      matchedTags.push({
        _type: "tag",
        _key: `tag_${rule.tag.value}`,
        label: rule.tag.label,
        value: rule.tag.value,
      });
      bonus += rule.weight;
    }
  }

  // Must match at least one Web Dev or AI topic rule to be relevant to CodingCat.dev
  if (matchedTags.length === 0) {
    return { matchedTags: [], score: 0 };
  }

  // Multi-topic intersection bonus (e.g. AI + Next.js or MCP + Security)
  if (matchedTags.length >= 2) bonus += 10;

  const finalScore = Math.min(99, Math.round(baseVelocityScore + Math.min(45, bonus)));
  return { matchedTags, score: finalScore };
}

function parseSimpleRssItems(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const titleRaw =
      (block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ??
        block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ??
        "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+-\s+[^-]+$/, "") // strip trailing "- Publisher Name" on Google News
        .trim();
    const linkRaw = (
      block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ??
      block.match(/<ht:news_item_url>([\s\S]*?)<\/ht:news_item_url>/i)?.[1] ??
      ""
    ).trim();
    const trafficRaw = (block.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/i)?.[1] ?? "").trim();
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "").trim();

    if (titleRaw && linkRaw) {
      items.push({ title: cleanDashes(titleRaw), url: linkRaw, traffic: trafficRaw, pubDate });
    }
  }
  return items;
}

// 1. Fetch Google Trends & Google News Tech/Dev Rising Queries
async function fetchGoogleTrendsSignals() {
  const signals = [];
  const feeds = [
    {
      url: "https://firebase.blog/rss.xml",
      label: "Official Firebase Blog Feed",
      baseScore: 68,
    },
    {
      url: "https://news.google.com/rss/search?q=(%22Firebase%22+OR+%22Firestore%22+OR+%22Firebase+Genkit%22+OR+%22Firebase+Data+Connect%22+OR+%22AWS+Lambda%22+OR+%22AWS+Bedrock%22+OR+%22AWS+Amplify%22+OR+%22Cloudflare+Workers%22+OR+%22Cloudflare+D1%22)+when:3d&hl=en-US&gl=US&ceid=US:en",
      label: "Firebase, AWS & Cloudflare Priority Trend Radar (72h)",
      baseScore: 65,
    },
    {
      url: "https://trends.google.com/trending/rss?geo=US",
      label: "Google Trends US Realtime",
      baseScore: 58,
    },
    {
      url: "https://news.google.com/rss/search?q=(%22Model+Context+Protocol%22+OR+%22Claude+Code%22+OR+%22Gemini+API%22+OR+%22Next.js%22+OR+%22SvelteKit%22+OR+%22React+19%22+OR+%22Cloudflare+Workers%22+OR+%22TypeScript%22+OR+%22Supabase%22+OR+%22Firebase%22+OR+%22Sanity.io%22)+when:2d&hl=en-US&gl=US&ceid=US:en",
      label: "Google Trends / News Web Dev & AI Rising (48h)",
      baseScore: 54,
    },
  ];

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "CodingCatDev-TrendRadar/1.0" },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseSimpleRssItems(xml);
      for (const item of items.slice(0, 25)) {
        const { matchedTags, score } = matchTagsAndScore(item.title, "", feed.baseScore);
        if (score >= 60) {
          signals.push({
            title: item.title,
            source: "google-trends",
            sourceUrl: item.url,
            score,
            tags: matchedTags,
            rawMetrics: item.traffic ? `Google Trends Traffic: ${item.traffic}` : feed.label,
          });
        }
      }
    } catch (err) {
      console.warn(`Warning fetching Google Trends feed (${feed.label}):`, err.message);
    }
  }
  return signals;
}

// 2. Fetch Hacker News Front Page & Top Dev/AI Stories
async function fetchHackerNewsSignals() {
  const signals = [];
  try {
    const res = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=40");
    if (!res.ok) return signals;
    const data = await res.json();
    for (const hit of data.hits || []) {
      const points = Number(hit.points) || 0;
      const comments = Number(hit.num_comments) || 0;
      if (points < 25) continue;
      const title = cleanDashes(hit.title || "");
      const url = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
      const velocityBase = Math.min(62, 42 + Math.floor(Math.log10(Math.max(10, points)) * 8));
      const { matchedTags, score } = matchTagsAndScore(title, url, velocityBase);
      if (score >= 60) {
        signals.push({
          title,
          source: "hackernews",
          sourceUrl: url,
          score,
          tags: matchedTags,
          rawMetrics: `Hacker News: ${points} points, ${comments} comments`,
        });
      }
    }
  } catch (err) {
    console.warn("Warning fetching Hacker News signals:", err.message);
  }
  return signals;
}

// 3. Fetch GitHub Trending Breakout Repos (Created in last 7 days)
async function fetchGitHubTrendingSignals() {
  const signals = [];
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const q = encodeURIComponent(`created:>${sevenDaysAgo} stars:>40`);
    const res = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=30`, {
      headers: {
        "User-Agent": "CodingCatDev-TrendRadar/1.0",
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return signals;
    const data = await res.json();
    for (const repo of data.items || []) {
      const stars = Number(repo.stargazers_count) || 0;
      const desc = cleanDashes(repo.description || "");
      const title = cleanDashes(`${repo.full_name}: ${desc || "Breakout Open Source Repository"}`).slice(0, 140);
      const velocityBase = Math.min(60, 40 + Math.floor(Math.log10(Math.max(10, stars)) * 7));
      const { matchedTags, score } = matchTagsAndScore(
        `${repo.name} ${desc} ${(repo.topics || []).join(" ")}`,
        repo.language || "",
        velocityBase
      );
      if (score >= 62) {
        signals.push({
          title,
          source: "github-trending",
          sourceUrl: repo.html_url,
          score,
          tags: matchedTags,
          rawMetrics: `GitHub Trending: ${stars.toLocaleString()} stars in <7 days (${repo.language || "OSS"})`,
        });
      }
    }
  } catch (err) {
    console.warn("Warning fetching GitHub Trending signals:", err.message);
  }
  return signals;
}

// 4. Fetch Reddit Developer Subreddits (r/webdev, r/nextjs, r/reactjs, r/LocalLLaMA, r/sveltejs)
async function fetchRedditSignals() {
  const signals = [];
  const subreddits = ["Firebase", "aws", "Cloudflare", "webdev", "nextjs", "reactjs", "LocalLLaMA", "sveltejs"];
  for (const sub of subreddits) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=12`, {
        headers: { "User-Agent": "linux:codingcat-trend-radar:v1.0.0 (by /u/ajonp)" },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const child of data?.data?.children || []) {
        const post = child?.data;
        if (!post || post.stickied || (post.ups || 0) < 35) continue;
        const title = cleanDashes(post.title || "");
        const url = post.url?.startsWith("http")
          ? post.url
          : `https://www.reddit.com${post.permalink}`;
        const velocityBase = Math.min(58, 40 + Math.floor(Math.log10(Math.max(10, post.ups)) * 7));
        const { matchedTags, score } = matchTagsAndScore(
          `${title} r/${sub}`,
          post.selftext?.slice(0, 300) || "",
          velocityBase
        );
        if (score >= 60) {
          signals.push({
            title,
            source: "reddit",
            sourceUrl: `https://www.reddit.com${post.permalink}`,
            score,
            tags: matchedTags,
            rawMetrics: `r/${sub}: ${post.ups} upvotes, ${post.num_comments || 0} comments`,
          });
        }
      }
    } catch (err) {
      console.warn(`Warning fetching r/${sub}:`, err.message);
    }
  }
  return signals;
}

// 5. Fetch daily.dev Popular Tech Posts (when DAILY_DEV_TOKEN or public feed available)
async function fetchDailyDevSignals() {
  const signals = [];
  const dailyToken = process.env.DAILY_DEV_TOKEN;
  const dailyCookie = process.env.DAILY_DEV_SESSION_COOKIE;
  if (!dailyToken && !dailyCookie) return signals;

  try {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "CodingCatDev-TrendRadar/1.0",
    };
    if (dailyToken) headers.Authorization = `Bearer ${dailyToken}`;
    if (dailyCookie) headers.Cookie = `da_sid=${dailyCookie}`;

    const query = `query PopularFeed {
      page: feed(first: 15, ranking: POPULARITY) {
        edges {
          node {
            id
            title
            permalink
            numUpvotes
            numComments
            tags
          }
        }
      }
    }`;
    const res = await fetch("https://api.daily.dev/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return signals;
    const json = await res.json();
    for (const edge of json?.data?.page?.edges || []) {
      const node = edge?.node;
      if (!node?.title || !node?.permalink) continue;
      const upvotes = Number(node.numUpvotes) || 0;
      const velocityBase = Math.min(62, 45 + Math.floor(Math.log10(Math.max(10, upvotes)) * 7));
      const { matchedTags, score } = matchTagsAndScore(
        `${node.title} ${(node.tags || []).join(" ")}`,
        "",
        velocityBase
      );
      if (score >= 62) {
        signals.push({
          title: cleanDashes(node.title),
          source: "dailydev",
          sourceUrl: node.permalink,
          score,
          tags: matchedTags,
          rawMetrics: `daily.dev Popular: ${upvotes} upvotes, ${node.numComments || 0} comments`,
        });
      }
    }
  } catch (err) {
    console.warn("Warning fetching daily.dev signals:", err.message);
  }
  return signals;
}

function buildSocialDrafts(signal, matchedDocs) {
  const primaryMatch = matchedDocs[0];
  const matchUrl = primaryMatch
    ? `https://codingcat.dev/${primaryMatch._type}/${primaryMatch.slug}`
    : "https://codingcat.dev/blog";
  const ytUrl = primaryMatch?.youtube || "https://www.youtube.com/@CodingCatDev?sub_confirmation=1";
  const tagNames = signal.tags.slice(0, 3).map((t) => t.label).join(", ");
  const hashtags = signal.tags
    .slice(0, 3)
    .map((t) => `#${t.value.replace(/[^a-zA-Z0-9]/g, "")}`)
    .join(" ");

  const x = cleanDashes(
    `${signal.title} is picking up serious momentum across ${tagNames} right now (${signal.rawMetrics}).\n\nIf you are building with ${
      signal.tags[0]?.label || "AI & Web Dev"
    } in production, we broke down the core architecture on CodingCat.dev:\n🎥 Watch: ${ytUrl}\n📖 Guide: ${matchUrl}\n\n${hashtags}`
  );

  const linkedin = cleanDashes(
    `Trending in ${tagNames}: ${signal.title}\n\nWhy this matters for engineering teams:\nWe are seeing rapid developer adoption and discussion around this workflow (${signal.rawMetrics}). When evaluating new ${
      signal.tags[0]?.label || "web & AI"
    } patterns, the biggest differentiator is how cleanly they integrate into your existing production architecture.\n\nWe covered the underlying architecture and practical patterns on CodingCat.dev:\n- Full Video Breakdown on YouTube: ${ytUrl}\n- Technical Deep Dive & Show Notes: ${matchUrl}\n- Primary Trend Source: ${signal.sourceUrl}\n\nHow is your team approaching ${
      signal.tags[0]?.label || "this"
    } in 2026? ${hashtags}`
  );

  const bluesky = cleanDashes(
    `Trending in ${tagNames}: ${signal.title}\n\nWe covered the production architecture behind ${
      signal.tags[0]?.label || "this stack"
    } on CodingCat.dev:\nWatch on YouTube: ${ytUrl}\nFull write-up: ${matchUrl}`
  );

  const reddit = cleanDashes(
    `We noticed **${signal.title}** trending across developer channels today (${signal.rawMetrics}).\n\n- **Primary Source**: ${signal.sourceUrl}\n- **Related CodingCat.dev Video Breakdown**: [${
      primaryMatch?.title || "CodingCat.dev YouTube"
    }](${ytUrl})\n- **Full CodingCat.dev Architecture Guide**: [${
      primaryMatch?.title || "CodingCat.dev"
    }](${matchUrl})\n\nWhat is your take on how this impacts ${tagNames} workflows in production?`
  );

  return { x, linkedin, bluesky, reddit };
}

function makeKey(prefix, seed) {
  const hash = crypto.createHash("md5").update(String(seed)).digest("hex").slice(0, 10);
  return `tr_${prefix}_${hash}`;
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

function buildDraftPostDocument(signal, matchedDocs, fallbackCoverImage) {
  const slug = `trend-${slugify(signal.title).slice(0, 65)}`;
  const draftId = `drafts.trend-post-${ crypto.createHash("md5").update(slug).digest("hex").slice(0, 12) }`;
  const tagLabels = signal.tags.map((t) => t.label);
  const primaryTag = signal.tags[0]?.label || "Modern Web & AI";
  const primaryDocInfo = OFFICIAL_DOCS_MAP[signal.tags[0]?.value] || OFFICIAL_DOCS_MAP.webdev;
  const primaryMatch = matchedDocs[0];
  const youtubeUrl = primaryMatch?.youtube || "https://www.youtube.com/@CodingCatDev?sub_confirmation=1";

  const blocks = [];

  // 1. Speakable Opening Paragraph (`article p:first-of-type`)
  blocks.push(
    createRichBlock(
      [
        { text: `${signal.title} `, strong: true },
        {
          text: `is rapidly gaining traction across the ${tagLabels.join(", ")} ecosystem (${signal.rawMetrics}). In this technical breakdown on CodingCat.dev, we examine why this development matters for production web and AI engineers, how it connects to official `,
        },
        { text: primaryDocInfo.label, href: primaryDocInfo.url, strong: true },
        { text: ` standards, and where you can watch our hands-on video tutorials on ` },
        { text: "YouTube", href: youtubeUrl, strong: true },
        { text: "." },
      ],
      { style: "normal", keySeed: `speakable_${draftId}` }
    )
  );

  // 2. Why It Is Trending Section
  blocks.push(
    createTextBlock(
      `Why ${signal.title} Matters for ${primaryTag} Developers`,
      "h2",
      `h2_why_${draftId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `Developer momentum around `,
        },
        { text: signal.title, href: signal.sourceUrl, strong: true },
        {
          text: ` highlights a broader shift in how teams architect ${tagLabels.join(" and ")} systems in 2026. As engineering organizations push for faster iteration cycles, stronger runtime reliability, and seamless AI integration, patterns that reduce boilerplate while preserving type safety and security quickly rise to the top of developer feeds.`,
        },
      ],
      { style: "normal", keySeed: `p_why_${draftId}` }
    )
  );

  // 3. Embedded CodingCat.dev YouTube Video
  if (primaryMatch?.youtube) {
    blocks.push(
      createTextBlock(
        `Watch the Related CodingCat.dev Architecture Breakdown`,
        "h2",
        `h2_vid_${draftId}`
      )
    );
    blocks.push({
      _type: "youtube",
      _key: makeKey("yt", draftId),
      url: primaryMatch.youtube,
    });
    blocks.push(
      createRichBlock(
        [
          { text: `Want more hands-on deep dives into ${tagLabels.join(", ")}? ` },
          {
            text: `Subscribe to CodingCat.dev on YouTube`,
            href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
            strong: true,
          },
          { text: ` and explore our full guide on ` },
          {
            text: primaryMatch.title,
            href: `https://codingcat.dev/${primaryMatch._type}/${primaryMatch.slug}`,
            strong: true,
          },
          { text: `.` },
        ],
        { style: "normal", keySeed: `p_vid_cta_${draftId}` }
      )
    );
  }

  // 4. Official Documentation & Primary Sources
  blocks.push(
    createTextBlock(
      `Primary Sources & Official Documentation`,
      "h2",
      `h2_docs_${draftId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: `Primary Trend Source: `, strong: true },
        { text: signal.title, href: signal.sourceUrl },
        { text: ` (${signal.rawMetrics})` },
      ],
      { style: "normal", listItem: "bullet", level: 1, keySeed: `li_src_${draftId}` }
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: `${primaryDocInfo.label}: `, href: primaryDocInfo.url, strong: true },
        { text: primaryDocInfo.desc },
      ],
      { style: "normal", listItem: "bullet", level: 1, keySeed: `li_doc_${draftId}` }
    )
  );

  // 5. Internal Related Links
  if (matchedDocs.length > 0) {
    blocks.push(
      createTextBlock(
        `Related CodingCat.dev Tutorials & Podcast Episodes`,
        "h2",
        `h2_rel_${draftId}`
      )
    );
    matchedDocs.forEach((rel, idx) => {
      blocks.push(
        createRichBlock(
          [
            {
              text: rel.title,
              href: `https://codingcat.dev/${rel._type}/${rel.slug}`,
              strong: true,
            },
            {
              text: rel.excerpt ? ` : ${cleanDashes(rel.excerpt).slice(0, 150)}` : "",
            },
          ],
          { style: "normal", listItem: "bullet", level: 1, keySeed: `li_rel_${draftId}_${idx}` }
        )
      );
    });
  }

  // 6. AEO FAQPage Section
  blocks.push(
    createTextBlock(
      `Frequently Asked Questions (FAQ)`,
      "h2",
      `h2_faq_${draftId}`
    )
  );
  blocks.push(
    createTextBlock(
      `What is driving developer interest in ${signal.title}?`,
      "h3",
      `h3_q1_${draftId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `${signal.title} is trending across developer communities (${signal.rawMetrics}) because it addresses practical ${tagLabels.join(", ")} engineering challenges. Developers can review the primary discussion at `,
        },
        { text: signal.sourceUrl, href: signal.sourceUrl, strong: true },
        { text: ` alongside our production tutorials on CodingCat.dev.` },
      ],
      { style: "normal", keySeed: `p_a1_${draftId}` }
    )
  );

  blocks.push(
    createTextBlock(
      `How does this fit into a production ${primaryTag} architecture?`,
      "h3",
      `h3_q2_${draftId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: `When evaluating new ${primaryTag} tools or patterns, benchmark them against the official `,
        },
        { text: primaryDocInfo.label, href: primaryDocInfo.url, strong: true },
        {
          text: ` (${primaryDocInfo.desc}) and test them in an isolated branch before rolling out to production workloads.`,
        },
      ],
      { style: "normal", keySeed: `p_a2_${draftId}` }
    )
  );

  blocks.push(
    createTextBlock(
      `Where can I watch video tutorials on ${primaryTag} and related workflows?`,
      "h3",
      `h3_q3_${draftId}`
    )
  );
  blocks.push(
    createRichBlock(
      [
        { text: `Watch our full video breakdown on ` },
        { text: `YouTube`, href: youtubeUrl, strong: true },
        { text: ` and subscribe to the ` },
        {
          text: `CodingCat.dev YouTube channel`,
          href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
          strong: true,
        },
        { text: ` for weekly full-stack web development and AI engineering deep dives.` },
      ],
      { style: "normal", keySeed: `p_a3_${draftId}` }
    )
  );

  const doc = {
    _id: draftId,
    _type: "post",
    title: signal.title,
    slug: { _type: "slug", current: slug },
    date: new Date().toISOString(),
    excerpt: cleanDashes(
      `Why ${signal.title} is trending across ${tagLabels.join(", ")} (${signal.rawMetrics}) and how to apply these patterns in production.`
    ),
    youtube: primaryMatch?.youtube || undefined,
    author: [{ _type: "reference", _key: "author_alex", _ref: "RIgC5r4TJ0hCGOzxHszD1w" }],
    tags: signal.tags,
    content: blocks,
  };
  if (fallbackCoverImage) {
    doc.coverImage = fallbackCoverImage;
  }
  return doc;
}

async function createGoogleTaskNotification(title, notes) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_WORKSPACE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!tokenRes.ok) return;
    const { access_token } = await tokenRes.json();

    let targetListId = "@default";
    const listsRes = await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists?maxResults=100", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (listsRes.ok) {
      const listsData = await listsRes.json();
      const found = (listsData.items || []).find(
        (l) => (l.title || "").trim().toLowerCase() === "codingcat.dev posts"
      );
      if (found?.id) targetListId = found.id;
    }

    const taskRes = await fetch(
      `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(targetListId)}/tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          notes,
          due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      }
    );
    if (taskRes.ok) {
      console.log(`✓ Created Google Task: "${title}"`);
    }
  } catch (err) {
    console.warn("Could not create Google Task notification:", err.message);
  }
}

async function runForDataset(targetDataset) {
  console.log(`\n=== Running Web Dev & AI Trend Radar on dataset: ${targetDataset} (${isDryRun ? "DRY RUN" : "LIVE"}) ===`);

  const cutoffIso = new Date(Date.now() - PURGE_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const recentDraftCutoff = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  // 1. Query existing catalog + existing trendSignal docs + purgeable old trendSignal IDs
  const query = `{
    "catalog": *[_type in ["post", "podcast"] && !(_id in path("drafts.**"))] | order(coalesce(date, _createdAt) desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      "date": coalesce(date, _createdAt),
      excerpt,
      youtube,
      tags,
      coverImage
    },
    "existingTrends": *[_type == "trendSignal"] {
      _id,
      title,
      sourceUrl,
      status,
      discoveredAt,
      expiresAt
    },
    "purgeIds": *[_type == "trendSignal" && status in ["discovered", "ignored"] && (expiresAt < now() || discoveredAt < "${cutoffIso}")]._id
  }`;

  const qUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${targetDataset}?query=${encodeURIComponent(query)}`;
  const qRes = await fetch(qUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!qRes.ok) {
    throw new Error(`Sanity query failed on ${targetDataset}: ${qRes.status} ${await qRes.text()}`);
  }
  const { result } = await qRes.json();
  const catalog = result.catalog || [];
  const existingTrends = result.existingTrends || [];
  const purgeIds = result.purgeIds || [];

  console.log(`Loaded ${catalog.length} catalog docs, ${existingTrends.length} existing trendSignal docs, ${purgeIds.length} expired trendSignals to purge.`);

  // 2. Gather live signals across all 5 sources
  const [googleSignals, hnSignals, ghSignals, redditSignals, dailySignals] = await Promise.all([
    fetchGoogleTrendsSignals(),
    fetchHackerNewsSignals(),
    fetchGitHubTrendingSignals(),
    fetchRedditSignals(),
    fetchDailyDevSignals(),
  ]);

  const rawCandidates = [
    ...googleSignals,
    ...hnSignals,
    ...ghSignals,
    ...redditSignals,
    ...dailySignals,
  ];
  console.log(
    `Fetched ${rawCandidates.length} raw developer/AI signals (Google Trends: ${googleSignals.length}, HN: ${hnSignals.length}, GitHub: ${ghSignals.length}, Reddit: ${redditSignals.length}, daily.dev: ${dailySignals.length}).`
  );

  // 3. Deduplicate against existing Sanity catalog (posts/podcasts), existing trendSignals, and within batch
  const existingUrls = new Set(
    existingTrends
      .map((t) => (t.sourceUrl || "").replace(/\/+$/, "").toLowerCase())
      .filter(Boolean)
  );
  const existingTokenSets = [
    ...catalog.map((d) => tokenize(d.title)),
    ...existingTrends.map((t) => tokenize(t.title)),
  ];

  const dedupedSignals = [];
  const batchTokenSets = [];

  // Sort by highest score first before deduplication
  rawCandidates.sort((a, b) => b.score - a.score);

  for (const cand of rawCandidates) {
    const normUrl = (cand.sourceUrl || "").replace(/\/+$/, "").toLowerCase();
    if (normUrl && existingUrls.has(normUrl)) continue;

    const candTokens = tokenize(cand.title);
    if (candTokens.length < 2) continue;

    // Check similarity against existing catalog & trends
    const isDuplicateInSanity = existingTokenSets.some((tokens) =>
      isSameTopic(candTokens, tokens)
    );
    if (isDuplicateInSanity) continue;

    // If similar to another item in the current batch, boost that item's score (cross-platform velocity!)
    const batchMatchIdx = batchTokenSets.findIndex((tokens) =>
      isSameTopic(candTokens, tokens)
    );
    if (batchMatchIdx !== -1) {
      dedupedSignals[batchMatchIdx].score = Math.min(99, dedupedSignals[batchMatchIdx].score + 6);
      dedupedSignals[batchMatchIdx].rawMetrics += ` + ${cand.rawMetrics}`;
      continue;
    }

    existingUrls.add(normUrl);
    batchTokenSets.push(candTokens);
    dedupedSignals.push(cand);
  }

  dedupedSignals.sort((a, b) => b.score - a.score);
  const topNewSignals = dedupedSignals.slice(0, MAX_SIGNALS_PER_RUN);
  console.log(`Selected ${topNewSignals.length} net-new, deduplicated Web Dev & AI trends.`);

  const mutations = [];

  // A. Purge expired (>30 days old) discovered/ignored trendSignal documents
  for (const id of purgeIds) {
    mutations.push({ delete: { id } });
  }

  // Check if a draft was already created recently
  const hasRecentDraft = existingTrends.some(
    (t) => t.status === "drafted" && t.discoveredAt && t.discoveredAt > recentDraftCutoff
  );

  const fallbackCoverImage = catalog.find((d) => d.coverImage?.asset)?.coverImage;
  let createdDraftInfo = null;

  for (let i = 0; i < topNewSignals.length; i++) {
    const sig = topNewSignals[i];
    const slug = slugify(sig.title);
    const docId = `trend.${crypto.createHash("md5").update(sig.sourceUrl || slug).digest("hex").slice(0, 16)}`;

    // Match top 3 CodingCat.dev posts/podcasts with YouTube videos
    const pseudoDoc = { _id: docId, _type: "post", title: sig.title, excerpt: sig.rawMetrics, tags: sig.tags };
    const youtubeCatalog = catalog.filter((c) => Boolean(c.youtube));
    const matchedDocs = findBestRelatedDocs(pseudoDoc, youtubeCatalog.length >= 3 ? youtubeCatalog : catalog, 3);

    const socialDrafts = buildSocialDrafts(sig, matchedDocs);
    const nowIso = new Date().toISOString();
    const expiresIso = new Date(Date.now() + PURGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

    let status = "discovered";
    let draftPostId = undefined;

    // Auto-create a full Sanity Draft Post for the #1 breakout trend (score >= 70)
    if (i === 0 && sig.score >= 70 && !hasRecentDraft) {
      const draftDoc = buildDraftPostDocument(sig, matchedDocs, fallbackCoverImage);
      status = "drafted";
      draftPostId = draftDoc._id;
      mutations.push({ createOrReplace: draftDoc });
      createdDraftInfo = { signal: sig, draftDoc, socialDrafts, matchedDocs };
    }

    const trendDoc = {
      _id: docId,
      _type: "trendSignal",
      title: sig.title,
      slug: { _type: "slug", current: slug },
      source: sig.source,
      sourceUrl: sig.sourceUrl,
      score: sig.score,
      status,
      tags: sig.tags,
      summary: cleanDashes(
        `Detected via ${sig.source} (${sig.rawMetrics}). Matched to ${matchedDocs
          .map((m) => `"${m.title}"`)
          .join(", ")} for CodingCat.dev YouTube backlinks.`
      ),
      rawMetrics: sig.rawMetrics,
      matchedContent: matchedDocs.map((m, idx) => ({
        _type: "reference",
        _key: `ref_${idx}_${m._id.slice(0, 8)}`,
        _ref: m._id,
      })),
      draftPostId,
      socialDrafts,
      discoveredAt: nowIso,
      expiresAt: expiresIso,
    };

    mutations.push({ createOrReplace: trendDoc });
  }

  if (isDryRun) {
    console.log("Dry-run top 5 discovered trends:");
    for (const s of topNewSignals.slice(0, 5)) {
      console.log(` - [${s.score}] (${s.source}) ${s.title} -> tags: ${s.tags.map((t) => t.label).join(", ")}`);
    }
    if (createdDraftInfo) {
      console.log(`Would create Sanity Draft Post: "${createdDraftInfo.draftDoc.title}" (${createdDraftInfo.draftDoc._id})`);
    }
    return;
  }

  if (mutations.length > 0) {
    const mutRes = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${targetDataset}`,
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
      throw new Error(`Sanity mutate failed on ${targetDataset}: ${mutRes.status} ${await mutRes.text()}`);
    }
    console.log(
      `✓ Committed ${mutations.length} mutations to Sanity (${targetDataset}) (purged: ${purgeIds.length}, upserted trends: ${topNewSignals.length}${
        createdDraftInfo ? `, created draft: ${createdDraftInfo.draftDoc._id}` : ""
      }).`
    );
  }

  if (targetDataset === "production" && createdDraftInfo) {
    const { signal, draftDoc, socialDrafts } = createdDraftInfo;
    const baseDraftId = String(draftDoc._id).replace(/^drafts\./, "");
    const studioDraftUrl = `https://codingcat-prod.sanity.studio/intent/edit/id=${baseDraftId};type=post/`;
    await createGoogleTaskNotification(
      `🔥 [Trend Radar] Review Draft: ${signal.title}`,
      [
        `Studio Draft: ${studioDraftUrl}`,
        `Score: ${signal.score}/100 (${signal.rawMetrics})`,
        `Source: ${signal.sourceUrl}`,
        ``,
        `Ready-to-post X Draft:`,
        socialDrafts.x,
      ].join("\n")
    );
  }
}

async function main() {
  await runForDataset(dataset);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
