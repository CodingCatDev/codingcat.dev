/**
 * Trend Discovery Service
 *
 * Discovers trending web-dev and AI topics from five sources:
 *   1. Hacker News (Firebase API)
 *   2. Dev.to (public API)
 *   3. Blog RSS / Atom feeds
 *   4. YouTube Data API v3
 *   5. GitHub Trending (HTML scrape)
 *
 * Replaces the basic `fetchTrendingTopics()` in `app/api/cron/ingest/route.ts`
 * with richer, multi-source trend signals and deduplication.
 *
 * @module trend-discovery
 */

const LOG_PREFIX = "[trend-discovery]";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface TrendSignal {
  source: "hackernews" | "devto" | "blog" | "youtube" | "github";
  title: string;
  url: string;
  score: number;
  publishedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface TrendResult {
  topic: string;
  slug: string;
  score: number;
  signals: TrendSignal[];
  whyTrending: string;
  suggestedAngle: string;
}

export interface TrendDiscoveryConfig {
  /** How many days back to consider (default: 7) */
  lookbackDays?: number;
  /** Maximum topics to return (default: 10) */
  maxTopics?: number;
  /** YouTube Data API key – falls back to YOUTUBE_API_KEY or GOOGLE_API_KEY env */
  youtubeApiKey?: string;
}

// ---------------------------------------------------------------------------
// Constants & taxonomy
// ---------------------------------------------------------------------------

/** Keyword taxonomy – 60+ terms covering web-dev and AI */
const KEYWORD_TAXONOMY: string[] = [
  "react",
  "nextjs",
  "next.js",
  "svelte",
  "sveltekit",
  "vue",
  "nuxt",
  "angular",
  "remix",
  "astro",
  "node",
  "nodejs",
  "deno",
  "bun",
  "typescript",
  "javascript",
  "wasm",
  "webassembly",
  "vercel",
  "cloudflare",
  "firebase",
  "supabase",
  "serverless",
  "ai",
  "copilot",
  "cursor",
  "gemini",
  "claude",
  "openai",
  "llm",
  "gpt",
  "mcp",
  "css",
  "html",
  "webgpu",
  "vite",
  "turbopack",
  "tailwind",
  "tailwindcss",
  "prisma",
  "drizzle",
  "graphql",
  "trpc",
  "server components",
  "ssr",
  "ssg",
  "edge computing",
  "fullstack",
  "full-stack",
  "frontend",
  "front-end",
  "backend",
  "back-end",
  "webdev",
  "web dev",
  "sdk",
  "api",
  "rest",
  "middleware",
  "monorepo",
  "turborepo",
  "pnpm",
  "npm",
  "yarn",
  "docker",
  "kubernetes",
  "ci/cd",
  "testing",
  "playwright",
  "vitest",
  "jest",
  "storybook",
  "figma",
  "design system",
  "accessibility",
  "a11y",
  "pwa",
  "service worker",
  "web worker",
  "streaming",
  "rsc",
  "react server",
  "shadcn",
  "radix",
  "zod",
  "tRPC",
];

/** Domains whose HN stories are always relevant */
const HN_DOMAIN_ALLOWLIST: string[] = [
  "github.com",
  "vercel.com",
  "nextjs.org",
  "cloudflare.com",
  "svelte.dev",
  "firebase.google.com",
  "developer.chrome.com",
  "web.dev",
  "deno.com",
  "bun.sh",
  "astro.build",
  "remix.run",
  "angular.dev",
  "vuejs.org",
  "react.dev",
  "nodejs.org",
  "typescriptlang.org",
  "developer.mozilla.org",
];

/** HN stories matching these patterns are excluded */
const HN_EXCLUSION_PATTERNS: RegExp[] = [
  /\bhiring\b/i,
  /\bjobs?\b/i,
  /\bpolitics\b/i,
  /\belection\b/i,
  /\bcrypto\b/i,
  /\bblockchain\b/i,
  /\bbitcoin\b/i,
  /\bhardware\b/i,
  /\bsemiconductor\b/i,
  /who is hiring/i,
];

/** Blog RSS / Atom feeds */
const BLOG_FEEDS: { name: string; url: string }[] = [
  { name: "Cloudflare", url: "https://blog.cloudflare.com/rss/" },
  { name: "Next.js", url: "https://nextjs.org/feed.xml" },
  { name: "Vercel", url: "https://vercel.com/atom" },
  { name: "Chrome", url: "https://developer.chrome.com/blog/feed.xml" },
  { name: "Web.dev", url: "https://web.dev/feed.xml" },
  { name: "Firebase", url: "https://firebase.blog/rss.xml" },
];

/** Dev.to tags to query */
const DEVTO_TAGS: string[] = [
  "webdev",
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "ai",
  "node",
];

/** GitHub Trending languages */
const GITHUB_TRENDING_LANGS: string[] = [
  "typescript",
  "javascript",
  "python",
];

/** Stop words for deduplication (100+) */
const STOP_WORDS = new Set<string>([
  "a", "about", "above", "after", "again", "against", "all", "am", "an",
  "and", "any", "are", "aren't", "as", "at", "be", "because", "been",
  "before", "being", "below", "between", "both", "but", "by", "can",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does",
  "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
  "from", "further", "get", "got", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "her", "here", "hers", "herself",
  "him", "himself", "his", "how", "i", "if", "in", "into", "is", "isn't",
  "it", "its", "itself", "just", "let", "like", "ll", "me", "might",
  "more", "most", "mustn't", "my", "myself", "need", "no", "nor", "not",
  "now", "of", "off", "on", "once", "only", "or", "other", "our", "ours",
  "ourselves", "out", "over", "own", "re", "s", "same", "shan't", "she",
  "should", "shouldn't", "so", "some", "such", "t", "than", "that", "the",
  "their", "theirs", "them", "themselves", "then", "there", "these", "they",
  "this", "those", "through", "to", "too", "under", "until", "up", "us",
  "ve", "very", "was", "wasn't", "we", "were", "weren't", "what", "when",
  "where", "which", "while", "who", "whom", "why", "will", "with", "won't",
  "would", "wouldn't", "you", "your", "yours", "yourself", "yourselves",
  "new", "use", "using", "used", "way", "make", "made", "also", "one",
  "two", "first", "last", "many", "much", "well", "back", "even", "still",
  "may", "say", "said", "take", "come", "go", "know", "see", "look",
  "think", "give", "find", "tell", "work", "call", "try", "ask", "put",
  "keep", "help", "show", "begin", "seem", "turn", "leave", "play", "run",
  "move", "live", "believe", "bring", "happen", "write", "provide", "sit",
  "stand", "lose", "pay", "meet", "include", "continue", "set", "learn",
  "change", "lead", "understand", "watch", "follow", "stop", "create",
  "speak", "read", "allow", "add", "spend", "grow", "open", "walk", "win",
  "offer", "remember", "love", "consider", "appear", "buy", "wait", "serve",
  "die", "send", "expect", "build", "stay", "fall", "cut", "reach", "kill",
  "remain", "suggest", "raise", "pass", "sell", "require", "report",
  "decide", "pull", "develop", "really", "already", "best", "better",
  "big", "great", "good", "right", "long", "little", "old", "different",
  "large", "small", "another", "important", "next", "early", "young",
  "possible", "able", "every", "sure", "enough", "far", "away", "today",
  "during", "might", "part", "year", "place", "around", "however", "home",
  "never", "world", "day", "got", "going", "want", "thing", "things",
  "something", "nothing", "everything", "anything", "someone", "everyone",
  "anyone", "people", "time", "years", "number", "point", "hand", "end",
  "head", "fact", "without", "within", "along", "since", "often", "always",
  "usually", "sometimes", "yet", "though", "although", "whether", "either",
  "neither", "rather", "quite", "almost", "perhaps", "probably", "simply",
  "actually", "certainly", "especially", "recently", "finally", "suddenly",
  "quickly", "slowly", "exactly", "directly", "likely", "simply",
  "generally", "specifically", "currently", "previously", "apparently",
  "eventually", "obviously", "basically", "essentially", "particularly",
  "increasingly", "relatively", "significantly", "approximately",
  "immediately", "constantly", "frequently", "occasionally", "ultimately",
  "effectively", "necessarily", "absolutely", "completely", "entirely",
  "perfectly", "seriously", "definitely", "clearly", "merely", "hardly",
  "roughly", "virtually", "literally", "truly", "deeply", "highly",
  "largely", "mostly", "partly", "slightly", "somewhat", "widely",
  "fully", "totally", "entirely", "extremely", "incredibly", "remarkably",
  "surprisingly", "unfortunately", "fortunately", "hopefully", "honestly",
  "frankly", "personally", "technically", "officially", "publicly",
  "privately", "internally", "externally", "initially", "originally",
  "traditionally", "typically", "normally", "naturally", "automatically",
  "manually", "physically", "mentally", "emotionally", "financially",
  "politically", "socially", "culturally", "legally", "officially",
  "formally", "informally", "independently", "collectively", "individually",
  "simultaneously", "respectively", "accordingly", "consequently",
  "subsequently", "alternatively", "additionally", "furthermore",
  "moreover", "meanwhile", "nevertheless", "nonetheless", "otherwise",
  "regardless", "instead", "therefore", "thus", "hence", "thereby",
  "whereby", "wherein", "whereas", "wherever", "whenever", "whatever",
  "whichever", "whoever", "however", "here", "there", "everywhere",
  "somewhere", "nowhere", "anywhere",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fetch with a 10-second timeout via AbortController.
 */
async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      // Next.js extends fetch() with aggressive caching — disable it
      cache: 'no-store' as RequestCache,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Compute relevance score (0–1) based on keyword taxonomy matches.
 *
 * - 0 matches → 0.1
 * - 1 match  → 0.35
 * - 2 matches → 0.5
 * - 3+ matches → 0.65
 */
function computeRelevance(text: string): number {
  const lower = text.toLowerCase();
  let matches = 0;
  for (const kw of KEYWORD_TAXONOMY) {
    if (lower.includes(kw)) {
      matches++;
    }
  }
  if (matches === 0) return 0.1;
  if (matches === 1) return 0.35;
  if (matches === 2) return 0.5;
  return 0.65;
}

/**
 * Turn a title into a URL-safe slug.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Extract significant words from a title (skip stop words, short words).
 */
function significantWords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Check whether a URL belongs to one of the HN allowlisted domains.
 */
function isAllowlistedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return HN_DOMAIN_ALLOWLIST.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`),
    );
  } catch {
    return false;
  }
}

/**
 * Check whether text matches any HN exclusion pattern.
 */
function isExcluded(text: string): boolean {
  return HN_EXCLUSION_PATTERNS.some((p) => p.test(text));
}

// ---------------------------------------------------------------------------
// RSS / Atom parsing (regex-based, no external deps)
// ---------------------------------------------------------------------------

interface FeedItem {
  title: string;
  url: string;
  publishedAt?: string;
}

/**
 * Parse RSS `<item>` and Atom `<entry>` elements from XML text.
 */
function parseFeedItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];

  // RSS <item> blocks
  const rssItemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = rssItemRegex.exec(xml)) !== null) {
    const block = match[1];
    const titleCdata = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const titlePlain = block.match(/<title>(.*?)<\/title>/);
    const title = (titleCdata?.[1] ?? titlePlain?.[1] ?? "").trim();

    const linkMatch = block.match(/<link>(.*?)<\/link>/);
    const url = (linkMatch?.[1] ?? "").trim();

    const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);
    const publishedAt = pubDateMatch?.[1]?.trim();

    if (title && url) {
      items.push({ title, url, publishedAt });
    }
  }

  // Atom <entry> blocks
  const atomEntryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  while ((match = atomEntryRegex.exec(xml)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<title[^>]*>(.*?)<\/title>/);
    const title = (titleMatch?.[1] ?? "").trim();

    // Atom links: <link href="..." /> or <link href="...">...</link>
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/);
    const url = (linkMatch?.[1] ?? "").trim();

    const updatedMatch = block.match(/<updated>(.*?)<\/updated>/);
    const publishedMatch = block.match(/<published>(.*?)<\/published>/);
    const publishedAt = (
      publishedMatch?.[1] ??
      updatedMatch?.[1] ??
      ""
    ).trim();

    if (title && url) {
      items.push({ title, url, publishedAt: publishedAt || undefined });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Source 1: Hacker News
// ---------------------------------------------------------------------------

/** YouTube Data API v3 search response shape. */
interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    channelTitle: string;
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
}

/** YouTube Data API v3 video statistics response shape. */
interface YouTubeVideoStats {
  items?: Array<{
    id: string;
    statistics: { viewCount?: string };
  }>;
}

interface HNItem {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  time?: number;
  type?: string;
}

/**
 * Fetch trending stories from Hacker News (Firebase API).
 * Fetches top 100 story IDs, then batches item details 10 at a time.
 */
async function fetchHackerNews(lookbackDays: number): Promise<TrendSignal[]> {
  const signals: TrendSignal[] = [];
  try {
    const res = await fetchWithTimeout(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
    );
    if (!res.ok) {
      console.warn(`${LOG_PREFIX} HN topstories failed: ${res.status}`);
      return signals;
    }
    const ids: number[] = await res.json();
    const top100 = ids.slice(0, 100);

    const cutoff = Date.now() / 1000 - lookbackDays * 86400;

    // Batch fetch 10 at a time
    for (let i = 0; i < top100.length; i += 10) {
      const batch = top100.slice(i, i + 10);
      const results = await Promise.allSettled(
        batch.map(async (id) => {
          const r = await fetchWithTimeout(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          );
          if (!r.ok) return null;
          return (await r.json()) as HNItem;
        }),
      );

      for (const result of results) {
        if (result.status !== "fulfilled" || !result.value) continue;
        const item = result.value;
        if (!item.title || !item.url) continue;
        if (item.time && item.time < cutoff) continue;
        if (isExcluded(item.title)) continue;

        const relevance = computeRelevance(`${item.title} ${item.url}`);
        const domainMatch = isAllowlistedDomain(item.url);

        if (relevance <= 0.1 && !domainMatch) continue;

        signals.push({
          source: "hackernews",
          title: item.title,
          url: item.url,
          score: (item.score ?? 0) * relevance,
          publishedAt: item.time
            ? new Date(item.time * 1000).toISOString()
            : undefined,
          metadata: {
            hnScore: item.score,
            relevance,
            domainMatch,
          },
        });
      }
    }

    console.log(`${LOG_PREFIX} HN: ${signals.length} relevant stories`);
  } catch (err) {
    console.warn(`${LOG_PREFIX} HN fetch error:`, err);
  }
  return signals;
}

// ---------------------------------------------------------------------------
// Source 2: Dev.to
// ---------------------------------------------------------------------------

interface DevtoArticle {
  title: string;
  url: string;
  published_at: string;
  positive_reactions_count: number;
  comments_count: number;
  tag_list: string[];
}

/**
 * Fetch trending articles from Dev.to across multiple tags.
 */
async function fetchDevto(lookbackDays: number): Promise<TrendSignal[]> {
  const signals: TrendSignal[] = [];
  try {
    const results = await Promise.allSettled(
      DEVTO_TAGS.map(async (tag) => {
        const res = await fetchWithTimeout(
          `https://dev.to/api/articles?tag=${tag}&top=${lookbackDays}`,
        );
        if (!res.ok) {
          console.warn(`${LOG_PREFIX} Dev.to tag ${tag} failed: ${res.status}`);
          return [];
        }
        return (await res.json()) as DevtoArticle[];
      }),
    );

    const seen = new Set<string>();
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const article of result.value) {
        if (seen.has(article.url)) continue;
        seen.add(article.url);

        const relevance = computeRelevance(
          `${article.title} ${article.tag_list?.join(" ") ?? ""}`,
        );
        signals.push({
          source: "devto",
          title: article.title,
          url: article.url,
          score:
            (article.positive_reactions_count + article.comments_count * 2) *
            relevance,
          publishedAt: article.published_at,
          metadata: {
            reactions: article.positive_reactions_count,
            comments: article.comments_count,
            tags: article.tag_list,
            relevance,
          },
        });
      }
    }

    console.log(`${LOG_PREFIX} Dev.to: ${signals.length} articles`);
  } catch (err) {
    console.warn(`${LOG_PREFIX} Dev.to fetch error:`, err);
  }
  return signals;
}

// ---------------------------------------------------------------------------
// Source 3: Blog RSS / Atom feeds
// ---------------------------------------------------------------------------

/**
 * Fetch and parse blog RSS/Atom feeds.
 */
async function fetchBlogFeeds(lookbackDays: number): Promise<TrendSignal[]> {
  const signals: TrendSignal[] = [];
  const cutoff = Date.now() - lookbackDays * 86400 * 1000;

  try {
    const results = await Promise.allSettled(
      BLOG_FEEDS.map(async (feed) => {
        const res = await fetchWithTimeout(feed.url);
        if (!res.ok) {
          console.warn(
            `${LOG_PREFIX} Blog feed ${feed.name} failed: ${res.status}`,
          );
          return [];
        }
        const xml = await res.text();
        const items = parseFeedItems(xml);
        if (items.length === 0) {
          console.warn(`${LOG_PREFIX} Blog feed ${feed.name}: parsed 0 items from ${xml.length} bytes`);
        }
        return items.map((item) => ({ ...item, feedName: feed.name }));
      }),
    );

    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const item of result.value) {
        // Filter by lookback window if date is available
        if (item.publishedAt) {
          const pubDate = new Date(item.publishedAt).getTime();
          if (!isNaN(pubDate) && pubDate < cutoff) continue;
        }

        const relevance = computeRelevance(item.title);
        signals.push({
          source: "blog",
          title: item.title,
          url: item.url,
          score: relevance * 100 * 1.5, // Blog posts get 1.5x multiplier
          publishedAt: item.publishedAt,
          metadata: {
            feedName: item.feedName,
            relevance,
          },
        });
      }
    }

    console.log(`${LOG_PREFIX} Blogs: ${signals.length} posts`);
  } catch (err) {
    console.warn(`${LOG_PREFIX} Blog feeds error:`, err);
  }
  return signals;
}

// ---------------------------------------------------------------------------
// Source 4: YouTube
// ---------------------------------------------------------------------------

/**
 * Fetch trending web-dev / AI videos from YouTube Data API v3.
 * Skips gracefully if no API key is available.
 */
async function fetchYouTube(
  lookbackDays: number,
  apiKey?: string,
): Promise<TrendSignal[]> {
  const key =
    apiKey ??
    process.env.YOUTUBE_API_KEY ??
    process.env.GOOGLE_API_KEY ??
    "";
  if (!key) {
    console.log(`${LOG_PREFIX} YouTube: skipped (no API key)`);
    return [];
  }

  const signals: TrendSignal[] = [];
  try {
    const publishedAfter = new Date(
      Date.now() - lookbackDays * 86400 * 1000,
    ).toISOString();

    const currentYear = new Date().getFullYear();
    const queries = [`web development ${currentYear}`, "nextjs react tutorial", "AI coding tools"];
    const results = await Promise.allSettled(
      queries.map(async (q) => {
        const params = new URLSearchParams({
          part: "snippet",
          q,
          type: "video",
          order: "viewCount",
          publishedAfter,
          maxResults: "10",
          key,
        });
        const res = await fetchWithTimeout(
          `https://www.googleapis.com/youtube/v3/search?${params}`,
        );
        if (!res.ok) {
          console.warn(`${LOG_PREFIX} YouTube search failed: ${res.status}`);
          return [];
        }
        const data: YouTubeSearchResponse = await res.json();
        return (data.items ?? []);
      }),
    );

    const seen = new Set<string>();
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const item of result.value) {
        const videoId = item.id?.videoId;
        if (!videoId || seen.has(videoId)) continue;
        seen.add(videoId);

        const title = item.snippet?.title ?? "";
        const relevance = computeRelevance(title);
        signals.push({
          source: "youtube",
          title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          score: relevance * 50,
          publishedAt: item.snippet?.publishedAt,
          metadata: {
            channelTitle: item.snippet?.channelTitle,
            videoId,
            relevance,
          },
        });
      }
    }

    console.log(`${LOG_PREFIX} YouTube: ${signals.length} videos`);
  } catch (err) {
    console.warn(`${LOG_PREFIX} YouTube fetch error:`, err);
  }
  return signals;
}

// ---------------------------------------------------------------------------
// Source 5: GitHub Trending
// ---------------------------------------------------------------------------

interface GitHubTrendingRepo {
  name: string;
  description: string;
  url: string;
  starsToday: number;
  language: string;
}

/**
 * Parse GitHub Trending HTML page for repo information.
 */
function parseGitHubTrendingHTML(html: string, language: string): GitHubTrendingRepo[] {
  const repos: GitHubTrendingRepo[] = [];

  // Match article/row blocks – GitHub uses <article class="Box-row"> elements
  const articleRegex = /<article[^>]*class="[^"]*Box-row[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let articleMatch: RegExpExecArray | null;

  while ((articleMatch = articleRegex.exec(html)) !== null) {
    const block = articleMatch[1];

    // Repo path from <h2> with lh-condensed class
    const h2Match = block.match(
      /<h2[^>]*class="[^"]*lh-condensed[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>/,
    );
    const repoPath = h2Match?.[1]?.trim();
    if (!repoPath) continue;

    const name = repoPath.replace(/^\//, "");
    const url = `https://github.com${repoPath}`;

    // Description from <p class="col-9...">
    const descMatch = block.match(
      /<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/,
    );
    const description = (descMatch?.[1] ?? "")
      .replace(/<[^>]+>/g, "")
      .trim();

    // Stars from "N stars today" or "N stars this week" text
    const starsMatch = block.match(
      /(\d[\d,]*)\s+stars?\s+(?:today|this\s+week|this\s+month)/i,
    );
    const starsToday = starsMatch
      ? parseInt(starsMatch[1].replace(/,/g, ""), 10)
      : 0;

    repos.push({
      name,
      description,
      url,
      starsToday,
      language,
    });
  }

  return repos;
}

/**
 * Fetch trending repos from GitHub for multiple languages.
 */
async function fetchGitHubTrending(): Promise<TrendSignal[]> {
  const signals: TrendSignal[] = [];
  try {
    const results = await Promise.allSettled(
      GITHUB_TRENDING_LANGS.map(async (lang) => {
        const res = await fetchWithTimeout(
          `https://github.com/trending/${lang}?since=weekly`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; TrendDiscovery/1.0)",
              Accept: "text/html",
            },
          },
        );
        if (!res.ok) {
          console.warn(
            `${LOG_PREFIX} GitHub trending ${lang} failed: ${res.status}`,
          );
          return [];
        }
        const html = await res.text();
        return parseGitHubTrendingHTML(html, lang);
      }),
    );

    const seen = new Set<string>();
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const repo of result.value) {
        if (seen.has(repo.url)) continue;
        seen.add(repo.url);

        const text = `${repo.name} ${repo.description}`;
        const relevance = computeRelevance(text);

        // Filter by web dev / AI relevance
        if (relevance <= 0.1) continue;

        signals.push({
          source: "github",
          title: `${repo.name}: ${repo.description || "Trending repository"}`,
          url: repo.url,
          score: repo.starsToday * relevance * 1.5,
          metadata: {
            starsToday: repo.starsToday,
            language: repo.language,
            repoName: repo.name,
            relevance,
          },
        });
      }
    }

    console.log(`${LOG_PREFIX} GitHub: ${signals.length} trending repos`);
  } catch (err) {
    console.warn(`${LOG_PREFIX} GitHub trending error:`, err);
  }
  return signals;
}

// ---------------------------------------------------------------------------
// Deduplication & merging
// ---------------------------------------------------------------------------

interface SignalGroup {
  topic: string;
  signals: TrendSignal[];
  rawScore: number;
}

/**
 * Normalize a title for comparison: lowercase, strip punctuation.
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if two signals should be merged based on shared significant words.
 * Merge if 3+ shared significant words AND 50%+ overlap.
 */
function shouldMerge(a: string, b: string): boolean {
  const wordsA = significantWords(a);
  const wordsB = significantWords(b);

  if (wordsA.length === 0 || wordsB.length === 0) return false;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  let shared = 0;
  for (const w of setA) {
    if (setB.has(w)) shared++;
  }

  if (shared < 3) return false;

  const minSize = Math.min(setA.size, setB.size);
  return shared / minSize >= 0.5;
}

/**
 * Group signals into deduplicated topic clusters.
 */
function deduplicateSignals(allSignals: TrendSignal[]): SignalGroup[] {
  const groups: SignalGroup[] = [];

  for (const signal of allSignals) {
    const normTitle = normalizeTitle(signal.title);
    let merged = false;

    for (const group of groups) {
      if (shouldMerge(normTitle, normalizeTitle(group.topic))) {
        group.signals.push(signal);
        group.rawScore += signal.score;
        merged = true;
        break;
      }
    }

    if (!merged) {
      groups.push({
        topic: signal.title,
        signals: [signal],
        rawScore: signal.score,
      });
    }
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Scoring & result generation
// ---------------------------------------------------------------------------

/**
 * Generate a human-readable "why trending" explanation.
 */
function generateWhyTrending(group: SignalGroup): string {
  const sources = [...new Set(group.signals.map((s) => s.source))];
  const sourceNames: Record<TrendSignal["source"], string> = {
    hackernews: "Hacker News",
    devto: "Dev.to",
    blog: "tech blogs",
    youtube: "YouTube",
    github: "GitHub Trending",
  };

  const parts: string[] = [];
  parts.push(
    `Appeared in ${group.signals.length} signal(s) across ${sources.map((s) => sourceNames[s]).join(", ")}`,
  );

  const hnSignals = group.signals.filter((s) => s.source === "hackernews");
  if (hnSignals.length > 0) {
    const maxScore = Math.max(
      ...hnSignals.map((s) => (s.metadata?.hnScore as number) ?? 0),
    );
    if (maxScore > 100) {
      parts.push(`HN score up to ${maxScore}`);
    }
  }

  const ghSignals = group.signals.filter((s) => s.source === "github");
  if (ghSignals.length > 0) {
    const totalStars = ghSignals.reduce(
      (sum, s) => sum + ((s.metadata?.starsToday as number) ?? 0),
      0,
    );
    if (totalStars > 0) {
      parts.push(`${totalStars} GitHub stars today`);
    }
  }

  return parts.join(". ") + ".";
}

/**
 * Generate a suggested content angle for the topic.
 */
function generateSuggestedAngle(group: SignalGroup): string {
  const topic = group.topic;
  const sources = [...new Set(group.signals.map((s) => s.source))];

  if (sources.includes("github") && sources.length > 1) {
    return `Deep-dive into ${topic} — explore the trending repo and explain why developers are excited.`;
  }
  if (sources.includes("hackernews") && sources.includes("devto")) {
    return `Community spotlight: ${topic} is generating discussion on both HN and Dev.to — compare perspectives.`;
  }
  if (sources.includes("blog")) {
    return `Official announcement breakdown: explain what ${topic} means for web developers.`;
  }
  return `Explainer video: what is ${topic} and why should web developers care?`;
}

/**
 * Apply cross-source boost and normalize scores to 0–100.
 */
function scoreAndRank(
  groups: SignalGroup[],
  maxTopics: number,
): TrendResult[] {
  // Apply cross-source boost
  for (const group of groups) {
    const uniqueSources = new Set(group.signals.map((s) => s.source)).size;
    if (uniqueSources >= 3) {
      group.rawScore *= 1.5;
    } else if (uniqueSources >= 2) {
      group.rawScore *= 1.3;
    }
  }

  // Find max score for normalization
  const maxRaw = Math.max(...groups.map((g) => g.rawScore), 1);

  // Build results, normalize to 0–100
  const results: TrendResult[] = groups.map((group) => ({
    topic: group.topic,
    slug: slugify(group.topic),
    score: Math.round((group.rawScore / maxRaw) * 100),
    signals: group.signals,
    whyTrending: generateWhyTrending(group),
    suggestedAngle: generateSuggestedAngle(group),
  }));

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxTopics);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Discover trending web-dev and AI topics from multiple sources.
 *
 * Fetches signals from Hacker News, Dev.to, blog RSS feeds, YouTube, and
 * GitHub Trending in parallel, deduplicates them, and returns scored results.
 *
 * @param config - Optional configuration overrides
 * @returns Sorted array of trending topics with scores and signals
 *
 * @example
 * ```ts
 * import { discoverTrends } from "@/lib/services/trend-discovery";
 *
 * const trends = await discoverTrends({ maxTopics: 5 });
 * for (const t of trends) {
 *   console.log(`${t.topic} (score: ${t.score}) — ${t.whyTrending}`);
 * }
 * ```
 */
export async function discoverTrends(
  config?: TrendDiscoveryConfig,
): Promise<TrendResult[]> {
  const lookbackDays = config?.lookbackDays ?? 7;
  const maxTopics = config?.maxTopics ?? 10;
  const youtubeApiKey = config?.youtubeApiKey;

  console.log(
    `${LOG_PREFIX} Starting trend discovery (lookback=${lookbackDays}d, max=${maxTopics})`,
  );

  // Fetch all sources in parallel
  const [hnResult, devtoResult, blogResult, ytResult, ghResult] =
    await Promise.allSettled([
      fetchHackerNews(lookbackDays),
      fetchDevto(lookbackDays),
      fetchBlogFeeds(lookbackDays),
      fetchYouTube(lookbackDays, youtubeApiKey),
      fetchGitHubTrending(),
    ]);

  // Collect all signals
  const allSignals: TrendSignal[] = [];
  const sourceResults = [hnResult, devtoResult, blogResult, ytResult, ghResult];
  const sourceNames = ["HN", "Dev.to", "Blogs", "YouTube", "GitHub"];

  for (let i = 0; i < sourceResults.length; i++) {
    const result = sourceResults[i];
    if (result.status === "fulfilled") {
      allSignals.push(...result.value);
    } else {
      console.warn(
        `${LOG_PREFIX} ${sourceNames[i]} source failed:`,
        result.reason,
      );
    }
  }

  console.log(`${LOG_PREFIX} Total signals collected: ${allSignals.length}`);

  if (allSignals.length === 0) {
    console.warn(`${LOG_PREFIX} No signals found from any source`);
    return [];
  }

  // Deduplicate and group
  const groups = deduplicateSignals(allSignals);
  console.log(`${LOG_PREFIX} Deduplicated into ${groups.length} topic groups`);

  // Score, rank, and return
  const results = scoreAndRank(groups, maxTopics);
  console.log(
    `${LOG_PREFIX} Returning ${results.length} trending topics (top score: ${results[0]?.score ?? 0})`,
  );

  return results;
}
