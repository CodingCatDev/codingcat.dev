import crypto from "node:crypto";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const isDryRun = process.argv.includes("--dry-run") || !token;

export const OFFICIAL_DOCS_MAP = {
  nextjs: { label: "Next.js Official Documentation", url: "https://nextjs.org/docs", desc: "App Router, Server Actions, and rendering architecture guides" },
  "next.js": { label: "Next.js Official Documentation", url: "https://nextjs.org/docs", desc: "App Router, Server Actions, and rendering architecture guides" },
  react: { label: "React Official Reference", url: "https://react.dev/reference/react", desc: "Hooks, Server Components, and UI state patterns" },
  "react-native": { label: "React Native Documentation", url: "https://reactnative.dev/docs/getting-started", desc: "Cross-platform native mobile engineering with React" },
  svelte: { label: "Svelte & SvelteKit Documentation", url: "https://svelte.dev/docs", desc: "Runes, compiler internals, and full-stack SvelteKit routing" },
  sveltekit: { label: "SvelteKit Official Documentation", url: "https://svelte.dev/docs/kit", desc: "Full-stack Svelte application routing, load functions, and adapters" },
  angular: { label: "Angular Developer Guide", url: "https://angular.dev/overview", desc: "Signals, standalone components, and enterprise Angular workflows" },
  vue: { label: "Vue.js Official Guide", url: "https://vuejs.org/guide/introduction.html", desc: "Composition API, reactivity system, and component patterns" },
  nuxt: { label: "Nuxt Documentation", url: "https://nuxt.com/docs", desc: "Full-stack Vue framework, Nitro server engine, and modules" },
  astro: { label: "Astro Documentation", url: "https://docs.astro.build", desc: "Islands architecture, Content Collections, and zero-JS defaults" },
  remix: { label: "Remix Documentation", url: "https://remix.run/docs", desc: "Web standards, nested routing, and progressive enhancement" },
  solidjs: { label: "SolidJS Documentation", url: "https://docs.solidjs.com", desc: "Fine-grained reactivity and SolidStart full-stack patterns" },
  qwik: { label: "Qwik Documentation", url: "https://qwik.dev/docs/", desc: "Resumability and instant-loading web application architecture" },
  flutter: { label: "Flutter Official Documentation", url: "https://docs.flutter.dev/", desc: "Multi-platform UI toolkit and Dart application architecture" },
  typescript: { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", desc: "Static type systems, generics, and compiler configuration" },
  javascript: { label: "MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", desc: "ECMAScript specifications, Web APIs, and runtime fundamentals" },
  webdev: { label: "MDN Web Docs for Developers", url: "https://developer.mozilla.org/en-US/docs/Web", desc: "Core web platform standards, browser APIs, and performance guides" },
  rust: { label: "The Rust Programming Language Book", url: "https://doc.rust-lang.org/book/", desc: "Ownership, memory safety, Cargo, and systems programming" },
  go: { label: "Go Official Documentation", url: "https://go.dev/doc/", desc: "Goroutines, concurrency patterns, and standard library reference" },
  python: { label: "Python 3 Official Documentation", url: "https://docs.python.org/3/", desc: "Language reference, async workflows, and AI/data ecosystem" },
  php: { label: "PHP Official Manual", url: "https://www.php.net/manual/en/", desc: "Zend Engine runtime, security hardening, and language reference" },
  csharp: { label: ".NET & C# Documentation", url: "https://learn.microsoft.com/en-us/dotnet/csharp/", desc: "Modern C# language features and .NET cloud architecture" },
  css: { label: "MDN CSS Reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", desc: "Modern layout, Grid, Flexbox, animations, and cascade layers" },
  html: { label: "MDN HTML Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", desc: "Semantic markup, accessibility attributes, and document structure" },
  tailwindcss: { label: "Tailwind CSS Documentation", url: "https://tailwindcss.com/docs", desc: "Utility-first styling, design tokens, and responsive workflows" },
  "daisy ui": { label: "daisyUI Tailwind Component Docs", url: "https://daisyui.com/docs/install/", desc: "Semantic component classes and theme system for Tailwind CSS" },
  design: { label: "web.dev UI & Design Patterns", url: "https://web.dev/learn/design", desc: "Responsive web design, typography, color systems, and UX patterns" },
  aws: { label: "AWS Documentation & Builder Center", url: "https://docs.aws.amazon.com/", desc: "Cloud architecture, serverless compute, IAM, and managed services" },
  "google-cloud": { label: "Google Cloud Architecture & Docs", url: "https://cloud.google.com/docs", desc: "Cloud Run, Kubernetes Engine, BigQuery, and Vertex AI guides" },
  azure: { label: "Microsoft Azure Developer Documentation", url: "https://learn.microsoft.com/en-us/azure/", desc: "Cloud services, serverless functions, and enterprise DevOps" },
  serverless: { label: "Serverless Land & Cloud Patterns", url: "https://serverlessland.com/", desc: "Event-driven architecture, functions-as-a-service, and cloud workflows" },
  firebase: { label: "Firebase Documentation", url: "https://firebase.google.com/docs", desc: "Firestore, Data Connect, Authentication, App Check, and Cloud Functions" },
  supabase: { label: "Supabase Documentation", url: "https://supabase.com/docs", desc: "Postgres database, Row Level Security, Edge Functions, and Vector search" },
  cloudflare: { label: "Cloudflare Developers Docs", url: "https://developers.cloudflare.com/", desc: "Workers, Pages, D1, R2, and edge compute architecture" },
  vercel: { label: "Vercel Documentation", url: "https://vercel.com/docs", desc: "Edge network deployments, serverless functions, and frontend cloud" },
  netlify: { label: "Netlify Documentation", url: "https://docs.netlify.com/", desc: "Jamstack deployments, edge functions, and build automation" },
  sanity: { label: "Sanity.io Content Operating System Docs", url: "https://www.sanity.io/docs", desc: "GROQ queries, Portable Text, Content Lake, and Agent Context" },
  "builder-io": { label: "Builder.io Developer Documentation", url: "https://www.builder.io/c/docs/developers", desc: "Visual headless CMS, SDKs, and design-to-code workflows" },
  storyblok: { label: "Storyblok Headless CMS Documentation", url: "https://www.storyblok.com/docs", desc: "Component-based headless CMS and visual editor APIs" },
  contentful: { label: "Contentful Developer Documentation", url: "https://www.contentful.com/developers/docs/", desc: "Composable content platform, GraphQL, and REST Content APIs" },
  hygraph: { label: "Hygraph Federated Content Docs", url: "https://hygraph.com/docs", desc: "GraphQL-native headless CMS and content federation" },
  cms: { label: "Sanity.io Structured Content Guides", url: "https://www.sanity.io/docs", desc: "Headless CMS architecture, structured content modeling, and APIs" },
  appwrite: { label: "Appwrite Documentation", url: "https://appwrite.io/docs", desc: "Open-source backend server for auth, databases, and storage" },
  prisma: { label: "Prisma ORM Documentation", url: "https://www.prisma.io/docs", desc: "Type-safe database client, schema migrations, and query optimization" },
  graphql: { label: "GraphQL Official Specification & Learn", url: "https://graphql.org/learn/", desc: "Schema design, resolvers, queries, mutations, and federation" },
  sql: { label: "PostgreSQL & SQL Official Documentation", url: "https://www.postgresql.org/docs/", desc: "Relational data modeling, indexing, joins, and ACID transactions" },
  database: { label: "PostgreSQL Official Documentation", url: "https://www.postgresql.org/docs/", desc: "Relational indexing, ACID transactions, JSONB, and query planning" },
  mongodb: { label: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/", desc: "Document data modeling, aggregation pipelines, and Atlas search" },
  redis: { label: "Redis Documentation", url: "https://redis.io/docs/latest/", desc: "In-memory caching, pub/sub messaging, and rate limiting" },
  docker: { label: "Docker Documentation", url: "https://docs.docker.com/", desc: "Containerization, multi-stage Dockerfiles, and Compose workflows" },
  kubernetes: { label: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/", desc: "Container orchestration, pods, services, and cluster operations" },
  git: { label: "Git Reference Manual", url: "https://git-scm.com/doc", desc: "Distributed version control, branching strategies, and internals" },
  github: { label: "GitHub Documentation", url: "https://docs.github.com/", desc: "Pull requests, GitHub Actions CI/CD, and repository security" },
  oss: { label: "Open Source Guides by GitHub", url: "https://opensource.guide/", desc: "Maintaining, contributing to, and scaling open-source software projects" },
  nodejs: { label: "Node.js API Reference", url: "https://nodejs.org/docs/latest/api/", desc: "Event loop, streams, native fetch, and server-side JavaScript" },
  deno: { label: "Deno Manual", url: "https://docs.deno.com/", desc: "Secure TypeScript runtime, Web-standard APIs, and JSR packages" },
  bun: { label: "Bun Runtime Documentation", url: "https://bun.sh/docs", desc: "Fast JavaScript all-in-one runtime, bundler, and test runner" },
  mcp: { label: "Model Context Protocol (MCP) Specification", url: "https://modelcontextprotocol.io/introduction", desc: "Standardized context, tools, and prompts for AI agents and LLMs" },
  ai: { label: "Google AI for Developers Documentation", url: "https://ai.google.dev/gemini-api/docs", desc: "Multimodal models, structured outputs, tool calling, and agentic workflows" },
  llm: { label: "Hugging Face Transformer & LLM Docs", url: "https://huggingface.co/docs", desc: "Open-weights models, embeddings, fine-tuning, and inference" },
  openai: { label: "OpenAI Platform Documentation", url: "https://platform.openai.com/docs", desc: "Responses API, reasoning models, embeddings, and function calling" },
  security: { label: "OWASP Top 10 & Application Security Guides", url: "https://owasp.org/www-project-top-ten/", desc: "Vulnerability mitigation, authentication hardening, and CVE defense" },
  testing: { label: "Playwright End-to-End Testing Docs", url: "https://playwright.dev/docs/intro", desc: "Cross-browser automation, component testing, and CI verification" },
  accessibility: { label: "W3C WAI Accessibility Fundamentals", url: "https://www.w3.org/WAI/fundamentals/", desc: "WCAG compliance, ARIA patterns, and inclusive web engineering" },
  a11y: { label: "W3C WAI Accessibility Fundamentals", url: "https://www.w3.org/WAI/fundamentals/", desc: "WCAG compliance, ARIA patterns, and inclusive web engineering" },
  devops: { label: "GitHub Actions CI/CD Documentation", url: "https://docs.github.com/en/actions", desc: "Automated deployment pipelines, secrets management, and runners" },
  stripe: { label: "Stripe Developer Documentation", url: "https://docs.stripe.com/", desc: "Payment intents, webhooks, subscriptions, and billing architecture" },
  auth0: { label: "Auth0 Documentation", url: "https://auth0.com/docs", desc: "OAuth 2.0, OIDC, passkeys, and enterprise identity management" },
  clerk: { label: "Clerk Authentication Documentation", url: "https://clerk.com/docs", desc: "Drop-in user management, passkeys, and multi-tenant organizations" },
  authzed: { label: "AuthZed & SpiceDB Documentation", url: "https://authzed.com/docs", desc: "Fine-grained relationship-based access control (ReBAC) inspired by Google Zanzibar" },
  algolia: { label: "Algolia Search Documentation", url: "https://www.algolia.com/doc/", desc: "Instant search indexing, typo tolerance, and hybrid AI retrieval" },
  cloudinary: { label: "Cloudinary Programmable Media Docs", url: "https://cloudinary.com/documentation", desc: "Automated image/video optimization, responsive delivery, and transformations" },
  sentry: { label: "Sentry Application Monitoring Docs", url: "https://docs.sentry.io/", desc: "Real-time error tracking, distributed tracing, and session replay" },
  shopify: { label: "Shopify Developer Documentation", url: "https://shopify.dev/docs", desc: "Storefront API, Hydrogen, Liquid, and commerce extensibility" },
  career: { label: "roadmap.sh Developer Career Paths", url: "https://roadmap.sh/", desc: "Structured engineering skill trees, system design, and career progression" },
};

export const EXPLICIT_LINK_REWRITES = {
  "https://codingcat.dev/post/kit.svelte.dev": "https://svelte.dev/docs/kit",
  "https://codingcat.dev/tutorial/sveltesirens.dev": "https://www.sveltesociety.dev/",
  "https://codingcat.dev/podcasts/0-10-amplify-with-nader-dabit/": "https://codingcat.dev/podcast/0-10-amplify-with-nader-dabit",
  "https://codingcat.dev/podcasts/0-10-amplify-with-nader-dabit": "https://codingcat.dev/podcast/0-10-amplify-with-nader-dabit",
  "https://codingcat.dev/podcasts/infrastructure-as-code-with-pulumi/": "https://codingcat.dev/podcast/1-1-infrastructure-as-code-with-pulumi",
  "https://codingcat.dev/podcasts/infrastructure-as-code-with-pulumi": "https://codingcat.dev/podcast/1-1-infrastructure-as-code-with-pulumi",
  "https://codingcat.dev/tutorial/angular-cli-deploying": "https://codingcat.dev/post/angular-cli-deploying",
  "https://ajonp.com/lessons/angular-cli-deploying": "https://codingcat.dev/post/angular-cli-deploying",
  "https://ajonp.com/lessons/git-your-build-system-right": "https://codingcat.dev/post/git-your-build-system-right",
  "https://ajonp.com/lessons/google-cloud-repositories-ci-cd": "https://codingcat.dev/post/google-cloud-repositories-ci-cd",
  "https://ajonp.com/lessons/ajonp-hugo-ionic-template": "https://codingcat.dev/post/ajonp-hugo-ionic-template",
  "https://ajonp.com/lessons/hugo-ionic-template": "https://codingcat.dev/post/hugo-ionic-template",
  "https://ajonp.com/lessons/7-firebase-multisite-hosting/#cloud-build": "https://codingcat.dev/post/firebase-multisite-hosting",
  "https://ajonp.com/": "https://codingcat.dev",
  "https://purrfect.dev/": "https://codingcat.dev/podcasts",
  "http://purrfect.dev": "https://codingcat.dev/podcasts",
  "http://Purrfect.dev": "https://codingcat.dev/podcasts",
  "http://codingcat.dev/codelab/data-connect": "https://firebase.google.com/docs/data-connect",
  "https://codingcat.dev/course/angularmaterial": "https://codingcat.dev/post/angular-cli-deploying",
  "https://codingcat.dev/course/intro-to-svelte": "https://codingcat.dev/post/lets-learn-svelte",
  "https://codingcat.dev/courses/angularmaterial/lessons/firebase-project-hosting/": "https://codingcat.dev/post/firebase-multisite-hosting",
};

const QUESTION_PREFIX = /^(how|what|why|when|where|who|which|can|should|is|are|do|does|did|will|would)\b/i;

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "what", "how", "why", "when", "where",
  "your", "you", "are", "was", "were", "have", "has", "had", "into", "using", "build", "building",
  "app", "apps", "web", "dev", "code", "coding", "codingcat", "purrfect", "podcast", "episode",
]);

function tokenizeTitle(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export function cleanFalsePositiveTags(doc) {
  const rawTags = Array.isArray(doc.tags) ? doc.tags : [];
  const titleAndExcerpt = `${doc.title || ""} ${doc.excerpt || ""}`;
  const cleaned = rawTags.filter((t) => {
    if (t?.value === "rust" && !/\b(rust|cargo|wasm|tauri)\b/i.test(titleAndExcerpt)) {
      return false;
    }
    return true;
  });
  if (cleaned.length === 0) {
    if (/\b(interview|imposter|career|job|hiring|teaching|learn)\b/i.test(titleAndExcerpt)) {
      cleaned.push(
        { _type: "tag", _key: "tag_career", label: "Career", value: "career" },
        { _type: "tag", _key: "tag_webdev", label: "Web Dev", value: "webdev" }
      );
    } else {
      cleaned.push({ _type: "tag", _key: "tag_webdev", label: "Web Dev", value: "webdev" });
    }
  }
  return cleaned;
}

export function rankDocTags(doc, tags) {
  const titleText = String(doc.title || "").toLowerCase();
  const excerptText = String(doc.excerpt || "").toLowerCase();
  return [...tags].sort((a, b) => {
    const aVal = String(a?.value || "").toLowerCase();
    const aLbl = String(a?.label || "").toLowerCase();
    const bVal = String(b?.value || "").toLowerCase();
    const bLbl = String(b?.label || "").toLowerCase();

    const aInTitle = titleText.includes(aVal) || titleText.includes(aLbl) ? 10 : 0;
    const bInTitle = titleText.includes(bVal) || titleText.includes(bLbl) ? 10 : 0;
    if (aInTitle !== bInTitle) return bInTitle - aInTitle;

    const aInExcerpt = excerptText.includes(aVal) || excerptText.includes(aLbl) ? 5 : 0;
    const bInExcerpt = excerptText.includes(bVal) || excerptText.includes(bLbl) ? 5 : 0;
    return bInExcerpt - aInExcerpt;
  });
}

export function findBestRelatedDocs(doc, allDocs, max = 3) {
  const cleanedTags = rankDocTags(doc, cleanFalsePositiveTags(doc));
  const primaryTagSet = new Set(cleanedTags.slice(0, 3).map((t) => t?.value).filter(Boolean));
  const allTagSet = new Set(cleanedTags.map((t) => t?.value).filter(Boolean));
  const myTokens = new Set(tokenizeTitle(`${doc.title} ${doc.excerpt}`));

  const scores = [];
  for (const candidate of allDocs) {
    if (candidate._id === doc._id || !candidate.slug || /\s/.test(candidate.slug)) continue;
    let score = 0;
    const candTags = cleanFalsePositiveTags(candidate);
    for (const t of candTags) {
      if (primaryTagSet.has(t?.value)) score += 6;
      else if (allTagSet.has(t?.value)) score += 2;
    }
    const candTokens = tokenizeTitle(candidate.title);
    for (const tok of candTokens) {
      if (myTokens.has(tok)) score += 4;
    }
    if (candidate._type === doc._type) score += 0.5;
    if (score > 0) scores.push([candidate, score]);
  }

  const sorted = scores
    .sort((a, b) => b[1] - a[1] || new Date(b[0].date) - new Date(a[0].date))
    .slice(0, max)
    .map(([d]) => d);

  if (sorted.length < max) {
    for (let i = allDocs.length - 1; i >= 0 && sorted.length < max; i--) {
      const d = allDocs[i];
      if (d._id !== doc._id && d.slug && !sorted.includes(d)) {
        sorted.push(d);
      }
    }
  }
  return sorted;
}

export function repairHref(rawHref, currentDoc, validRoutesMap, fallbackRelatedDocs) {
  if (!rawHref) return rawHref;
  const trimmed = String(rawHref).trim();
  if (EXPLICIT_LINK_REWRITES[trimmed]) return EXPLICIT_LINK_REWRITES[trimmed];

  if (trimmed.includes("codingcat.dev") || trimmed.startsWith("/")) {
    try {
      const parsed = trimmed.startsWith("/")
        ? new URL(trimmed, "https://codingcat.dev")
        : new URL(trimmed);
      if (parsed.hostname.endsWith("codingcat.dev")) {
        const cleanPath = parsed.pathname.replace(/\/+$/, "");
        if (
          !cleanPath ||
          cleanPath === "" ||
          ["/podcasts", "/blog", "/courses", "/sponsors", "/guests", "/authors", "/search"].includes(cleanPath) ||
          cleanPath.startsWith("/guest/") ||
          cleanPath.startsWith("/author/") ||
          cleanPath.startsWith("/sponsor/")
        ) {
          return `https://codingcat.dev${cleanPath}`;
        }
        if (validRoutesMap.has(cleanPath)) {
          return `https://codingcat.dev${cleanPath}`;
        }
        // Check if slug exists under /post/<slug> or /podcast/<slug>
        const lastSeg = cleanPath.split("/").filter(Boolean).pop();
        if (lastSeg && validRoutesMap.has(`/post/${lastSeg}`)) {
          return `https://codingcat.dev/post/${lastSeg}`;
        }
        if (lastSeg && validRoutesMap.has(`/podcast/${lastSeg}`)) {
          return `https://codingcat.dev/podcast/${lastSeg}`;
        }
        // Hallucinated internal link: rewrite to top related real article
        if (fallbackRelatedDocs && fallbackRelatedDocs.length > 0) {
          const rel = fallbackRelatedDocs[0];
          return `https://codingcat.dev/${rel._type}/${rel.slug}`;
        }
        return "https://codingcat.dev/blog";
      }
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

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
  return `aeo2026_${prefix}_${hash}`;
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
  if (lastChar === "—" || firstChar === "—" || cText.startsWith("---") || pText.endsWith("---")) return false;
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
  const cleaned = cleanDashes(text);
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
        text: cleaned,
      },
    ],
  };
}

function createRichBlock(segments, { style = "normal", listItem = undefined, level = undefined, keySeed = "" } = {}) {
  const markDefs = [];
  const children = [];

  segments.forEach((seg, i) => {
    const hasMark = Boolean(seg.href || seg.code || seg.strong);
    const rawText = cleanDashes(seg.text || "", { trim: hasMark });
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
  return normalizeBlockSpacing(block);
}

export function blockToPlainText(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) return "";
  return block.children.map((c) => c?.text || "").join("").trim();
}

export function extractExistingLinks(content) {
  const hrefs = [];
  if (!Array.isArray(content)) return hrefs;
  for (const block of content) {
    if (Array.isArray(block?.markDefs)) {
      for (const md of block.markDefs) {
        if (md?.href) hrefs.push(md.href);
        else if (md?._type === "internalLink" && md?.reference?._ref) {
          hrefs.push(`internalRef:${md.reference._ref}`);
        }
      }
    }
  }
  return hrefs;
}

export function extractFaqs(content) {
  if (!Array.isArray(content)) return [];
  const faqs = [];
  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (block?._type !== "block") continue;
    if (block.style !== "h2" && block.style !== "h3" && block.style !== "h4") continue;
    const heading = blockToPlainText(block);
    if (!heading) continue;
    if (!heading.endsWith("?") && !QUESTION_PREFIX.test(heading)) continue;
    const answerParts = [];
    for (let j = i + 1; j < content.length; j++) {
      const next = content[j];
      if (next?._type !== "block") continue;
      if (next.style && next.style !== "normal") break;
      const text = blockToPlainText(next);
      if (text) answerParts.push(text);
      if (answerParts.join(" ").length > 350) break;
    }
    const answer = answerParts.join(" ").trim();
    if (answer.length >= 40) {
      faqs.push({ question: heading, answer });
    }
  }
  return faqs;
}

export function extractLabeledUrlsFromDescription(description, currentSlug = "", validRoutesMap = null) {
  if (!description) return [];
  const lines = description.split(/\r?\n/);
  const results = [];
  const seen = new Set();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const matches = line.match(/https?:\/\/[^\s)>\]"']+/g);
    if (!matches) continue;

    for (const rawUrl of matches) {
      let url = rawUrl.replace(/[.,;!?]+$/, "");
      if (EXPLICIT_LINK_REWRITES[url]) {
        url = EXPLICIT_LINK_REWRITES[url];
      }
      try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        if (
          url.includes("youtube.com/codingcatdev") ||
          url.includes("youtube.com/c/CodingCatDev") ||
          url.includes("youtube.com/@CodingCatDev") ||
          url.includes("twitter.com/CodingCatDev") ||
          url.includes("x.com/CodingCatDev") ||
          url.includes("discord.gg/") ||
          url.includes("anchor.fm/purrfect-dev") ||
          url.includes("spotify.com") ||
          url.includes("podcasts.apple.com") ||
          url.includes("google.com/podcasts") ||
          url === "https://codingcat.dev" ||
          url === "https://codingcat.dev/" ||
          url === "https://purrfect.dev" ||
          url === "https://purrfect.dev/"
        ) {
          continue;
        }

        // Skip self-links or legacy ajonp.com / purrfect.dev / codingcat.dev links that point to the current doc or 404
        if (
          host.endsWith("codingcat.dev") ||
          host.endsWith("purrfect.dev") ||
          host.endsWith("ajonp.com")
        ) {
          const lastSeg = parsed.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
          if (!lastSeg || (currentSlug && lastSeg.toLowerCase() === currentSlug.toLowerCase())) {
            continue;
          }
          if (validRoutesMap) {
            if (validRoutesMap.has(`/post/${lastSeg}`)) {
              url = `https://codingcat.dev/post/${lastSeg}`;
            } else if (validRoutesMap.has(`/podcast/${lastSeg}`)) {
              url = `https://codingcat.dev/podcast/${lastSeg}`;
            } else if (!host.startsWith("link.ajonp.com")) {
              // Legacy dead self-link
              continue;
            }
          } else if (host.endsWith("purrfect.dev") || host.endsWith("ajonp.com")) {
            continue;
          }
        }

        const norm = url.replace(/\/+$/, "").toLowerCase();
        if (seen.has(norm)) continue;
        seen.add(norm);

        let prefix = line
          .replace(rawUrl, "")
          .replace(/^[-*•\d.)\s]+/, "")
          .replace(/[:\-–—\s]+$/, "")
          .trim();

        if (!prefix || prefix.length < 3 || prefix.length > 90 || prefix.startsWith("http")) {
          const finalParsed = new URL(url);
          const pathClean =
            finalParsed.pathname && finalParsed.pathname !== "/"
              ? finalParsed.pathname.replace(/\/+$/, "")
              : "";
          prefix = `${finalParsed.hostname.replace(/^www\./, "")}${pathClean.slice(0, 45)}`;
        }
        results.push({ label: cleanDashes(prefix), url });
      } catch {
        // ignore invalid URL
      }
    }
  }
  return results;
}

function extractYouTubeVideoId(urlOrId) {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function formatSeconds(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const rem = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

function synthesizeTranscriptParagraphs(doc) {
  const paragraphs = [];
  const t = doc.transcript;

  if (t?.summary && t.summary.trim().length > 60) {
    paragraphs.push(cleanDashes(t.summary.trim()));
  }

  if (t?.description) {
    const descLines = t.description
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(
        (l) =>
          l.length > 55 &&
          !/^\d{1,2}:\d{2}/.test(l) &&
          !l.startsWith("http") &&
          !l.toLowerCase().includes("subscribe") &&
          !l.toLowerCase().includes("podcast:") &&
          !l.toLowerCase().includes("anchor.fm")
      );
    if (descLines.length > 0) {
      const combined = cleanDashes(descLines.slice(0, 3).join(" "));
      if (combined.length > 70 && !paragraphs.some((p) => p.includes(combined.slice(0, 40)))) {
        paragraphs.push(combined);
      }
    }
  }

  if (t?.fullText && t.fullText.length > 400) {
    const cleanFull = t.fullText
      .replace(/\[.*?\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const sentences = cleanFull.match(/[^.!?]+[.!?]+/g) || [];
    const goodSentences = sentences
      .map((s) => s.trim())
      .filter((s) => s.length >= 60 && s.length <= 260 && !/^(hey|welcome|hi |what's up|so yeah|um |uh )/i.test(s));

    if (goodSentences.length >= 6) {
      const midStart = Math.floor(goodSentences.length * 0.2);
      const chunk1 = cleanDashes(goodSentences.slice(midStart, midStart + 4).join(" "));
      const chunk2 = cleanDashes(
        goodSentences.slice(Math.floor(goodSentences.length * 0.55), Math.floor(goodSentences.length * 0.55) + 4).join(" ")
      );
      if (chunk1.length > 100) paragraphs.push(chunk1);
      if (chunk2.length > 100 && chunk2 !== chunk1) paragraphs.push(chunk2);
    } else if (cleanFull.length > 250) {
      const words = cleanFull.split(" ").filter((w) => !/^(um|uh|like|you|know)$/i.test(w));
      if (words.length > 80) {
        const slice1 = cleanDashes(words.slice(30, 105).join(" ")) + ".";
        const slice2 = words.length > 190 ? cleanDashes(words.slice(110, 185).join(" ")) + "." : "";
        paragraphs.push(
          `In the recorded walkthrough, the session covers: ${slice1.charAt(0).toUpperCase() + slice1.slice(1)}`
        );
        if (slice2) {
          paragraphs.push(
            `Continuing deeper into the implementation details: ${slice2.charAt(0).toUpperCase() + slice2.slice(1)}`
          );
        }
      }
    }
  }

  return paragraphs;
}

export function buildEnrichedContent(doc, relatedDocs, rankedTags, validRoutesMap = null) {
  // 1. Strip any previous aeo2026_ blocks and repair broken links in existing baseBlocks
  const rawBaseBlocks = (Array.isArray(doc.content) ? doc.content : []).filter(
    (b) => !String(b?._key || "").startsWith("aeo2026_")
  );

  const baseBlocks = rawBaseBlocks.map((block) => {
    const normalized = normalizeBlockSpacing(block);
    if (!Array.isArray(normalized?.markDefs) || normalized.markDefs.length === 0) return normalized;
    return {
      ...normalized,
      markDefs: normalized.markDefs.map((md) => {
        if (md?.href && validRoutesMap) {
          return {
            ...md,
            href: repairHref(md.href, doc, validRoutesMap, relatedDocs),
          };
        }
        return md;
      }),
    };
  });

  // Firebase Archive posts already include their dedicated Web Architecture, Resources, and FAQ sections
  if (String(doc?._id || "").startsWith("post-fb-")) {
    return baseBlocks;
  }

  const plainText = baseBlocks.map(blockToPlainText).filter(Boolean).join(" ");
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const isThin = wordCount < 200;

  const existingLinks = extractExistingLinks(baseBlocks);
  const existingLinksNorm = new Set(
    existingLinks.map((u) => u.replace(/\/+$/, "").toLowerCase())
  );

  const tagLabels = rankedTags.map((t) => t?.label).filter(Boolean);
  const tagValues = rankedTags.map((t) => t?.value).filter(Boolean);
  const primaryTagLabel = tagLabels[0] || "Modern Web Development";
  const secondaryTagLabel = tagLabels[1] || tagLabels[0] || "Full-Stack Engineering";
  const guestNames = (doc.guest || []).map((g) => g?.title).filter(Boolean);
  const authorNames = (doc.author || []).map((a) => a?.title).filter(Boolean);
  const speakerLine =
    guestNames.length > 0
      ? `featuring ${guestNames.join(" and ")} alongside ${authorNames.join(" and ") || "Alex Patterson"}`
      : `by ${authorNames.join(" and ") || "Alex Patterson"}`;

  const videoId = extractYouTubeVideoId(doc.youtube || doc.transcript?.youtubeId);
  const youtubeWatchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : doc.youtube || null;

  const officialDocs = [];
  for (const tv of tagValues) {
    const info = OFFICIAL_DOCS_MAP[tv];
    if (info && !officialDocs.some((d) => d.url === info.url)) {
      officialDocs.push(info);
    }
  }
  if (officialDocs.length === 0) {
    officialDocs.push(OFFICIAL_DOCS_MAP.webdev, OFFICIAL_DOCS_MAP.javascript);
  }

  const prependBlocks = [];
  const appendBlocks = [];

  // A. Speakable First Paragraph (`article p:first-of-type`)
  const firstNormalBlock = baseBlocks.find((b) => b?._type === "block" && (!b.style || b.style === "normal"));
  const firstNormalText = firstNormalBlock ? blockToPlainText(firstNormalBlock) : "";

  if (firstNormalText.length < 90) {
    const excerptClean = cleanDashes(doc.excerpt || doc.title);
    const summaryClean = cleanDashes(doc.transcript?.summary || "");
    const tldrSegments = [
      { text: `${doc.title} `, strong: true },
      {
        text: `is a ${doc._type === "podcast" ? "CodingCat.dev podcast episode" : "technical guide on CodingCat.dev"} ${speakerLine} focused on ${tagLabels.slice(0, 3).join(", ") || "software engineering"}. ${excerptClean.endsWith(".") ? excerptClean : excerptClean + "."}${summaryClean && !summaryClean.includes(excerptClean.slice(0, 25)) ? " " + summaryClean : ""}`,
      },
    ];
    if (youtubeWatchUrl) {
      tldrSegments.push({ text: " Watch the full video breakdown on " });
      tldrSegments.push({ text: "YouTube", href: youtubeWatchUrl, strong: true });
      tldrSegments.push({ text: " or explore the architectural notes, chapters, and official documentation links below." });
    }
    prependBlocks.push(
      createRichBlock(tldrSegments, {
        style: "normal",
        keySeed: `speakable_${doc._id}`,
      })
    );
  }

  // B. Expand Thin Posts & Podcasts (< 200 words)
  if (isThin) {
    appendBlocks.push(
      createTextBlock(
        `Technical Overview: ${doc.title}`,
        "h2",
        `tech_overview_h2_${doc._id}`
      )
    );

    const transcriptParas = synthesizeTranscriptParagraphs(doc);
    for (let i = 0; i < transcriptParas.length; i++) {
      appendBlocks.push(
        createTextBlock(
          transcriptParas[i],
          "normal",
          `tech_overview_p_${doc._id}_${i}`
        )
      );
    }

    const primaryDoc = officialDocs[0];
    appendBlocks.push(
      createRichBlock(
        [
          {
            text: `When applying the concepts from `,
          },
          { text: doc.title, strong: true },
          {
            text: ` in a production codebase, teams working with ${tagLabels.slice(0, 4).join(", ") || primaryTagLabel} should align their implementation with the `,
          },
          {
            text: primaryDoc.label,
            href: primaryDoc.url,
            strong: true,
          },
          {
            text: ` (${primaryDoc.desc}). Structuring your workflow around repeatable patterns, automated verification, and clear separation of concerns helps prevent regressions as your application scales.`,
          },
        ],
        {
          style: "normal",
          keySeed: `tech_synthesis_${doc._id}`,
        }
      )
    );

    appendBlocks.push(
      createTextBlock(
        `Key Engineering Takeaways`,
        "h3",
        `takeaways_h3_${doc._id}`
      )
    );

    const takeaways = [
      [
        { text: `Core Topic Focus: `, strong: true },
        {
          text: `Practical strategies for ${tagLabels.slice(0, 4).join(", ") || primaryTagLabel} covered in "${doc.title}" (${cleanDashes(doc.excerpt || doc.title)}).`,
        },
      ],
      [
        { text: `Production Implementation: `, strong: true },
        {
          text: `Combine the architectural patterns demonstrated in this ${doc._type} with the official `,
        },
        { text: primaryDoc.label, href: primaryDoc.url },
        { text: ` for type safety, performance, and long-term maintainability.` },
      ],
    ];
    if (youtubeWatchUrl) {
      takeaways.push([
        { text: `Hands-On Video Walkthrough: `, strong: true },
        { text: `Follow along with the live coding demos and discussion on ` },
        { text: `YouTube (${doc.title})`, href: youtubeWatchUrl },
        { text: ` and subscribe to ` },
        {
          text: `CodingCat.dev on YouTube`,
          href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
        },
        { text: ` for weekly deep dives.` },
      ]);
    }
    takeaways.forEach((segList, idx) => {
      appendBlocks.push(
        createRichBlock(segList, {
          style: "normal",
          listItem: "bullet",
          level: 1,
          keySeed: `takeaway_li_${doc._id}_${idx}`,
        })
      );
    });
  }

  // C. Timestamped YouTube Video Chapters
  const chapters = Array.isArray(doc.transcript?.chapters) ? doc.transcript.chapters : [];
  const hasTimestampLinks = existingLinks.some((u) => /[?&]t=\d+/.test(u));
  if (chapters.length > 0 && videoId && !hasTimestampLinks) {
    appendBlocks.push(
      createTextBlock(
        `Video Chapters & Timestamps`,
        "h2",
        `chapters_h2_${doc._id}`
      )
    );
    appendBlocks.push(
      createRichBlock(
        [
          { text: `Jump directly to any segment of ` },
          { text: doc.title, href: `https://www.youtube.com/watch?v=${videoId}`, strong: true },
          { text: ` on YouTube using the timestamped chapters below:` },
        ],
        { style: "normal", keySeed: `chapters_intro_${doc._id}` }
      )
    );

    chapters.slice(0, 20).forEach((ch, idx) => {
      const startSec = Math.max(0, Math.floor(Number(ch?.startTime) || 0));
      const tsLabel = formatSeconds(startSec);
      const chUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startSec}s`;
      const chTitle = cleanDashes(ch?.title || `Segment ${idx + 1}`);
      appendBlocks.push(
        createRichBlock(
          [
            { text: `${tsLabel}`, href: chUrl, strong: true },
            { text: `: ${chTitle}` },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `chapter_${doc._id}_${idx}_${startSec}`,
          }
        )
      );
    });
  }

  // D. Missing External Links (Transcript Description URLs, Picks, Guests, Sponsors, Official Docs)
  const descLabeledUrls = extractLabeledUrlsFromDescription(
    doc.transcript?.description || "",
    doc.slug,
    validRoutesMap
  ).filter((item) => !existingLinksNorm.has(item.url.replace(/\/+$/, "").toLowerCase()));

  const pickItems = (doc.pick || [])
    .filter((p) => p?.site && p.site.startsWith("http"))
    .map((p) => ({
      ...p,
      repairedSite: validRoutesMap
        ? repairHref(p.site, doc, validRoutesMap, relatedDocs)
        : p.site,
    }))
    .filter((p) => !existingLinksNorm.has(p.repairedSite.replace(/\/+$/, "").toLowerCase()))
    .map((p) => ({
      label: cleanDashes(`${p.name || "Featured Pick"}${p.user?.title ? ` (picked by ${p.user.title})` : ""}`),
      url: p.repairedSite,
    }));

  const guestItems = [];
  for (const g of doc.guest || []) {
    if (g?.slug) {
      const guestUrl = `https://codingcat.dev/guest/${g.slug}`;
      if (!existingLinksNorm.has(guestUrl.toLowerCase())) {
        guestItems.push({
          label: `${g.title} Guest Profile & Episodes on CodingCat.dev`,
          url: guestUrl,
        });
      }
    }
    if (g?.socials?.github) {
      const gh = g.socials.github.startsWith("http")
        ? g.socials.github
        : `https://github.com/${g.socials.github.replace(/^@/, "")}`;
      if (!existingLinksNorm.has(gh.replace(/\/+$/, "").toLowerCase())) {
        guestItems.push({ label: `${g.title} on GitHub`, url: gh });
      }
    }
    if (Array.isArray(g?.websites)) {
      for (const w of g.websites) {
        const siteUrl = typeof w === "string" ? w : w?.site;
        if (siteUrl && siteUrl.startsWith("http") && !existingLinksNorm.has(siteUrl.replace(/\/+$/, "").toLowerCase())) {
          guestItems.push({ label: `${g.title} Official Website`, url: siteUrl });
        }
      }
    }
  }

  const sponsorItems = [];
  for (const s of doc.sponsor || []) {
    if (s?.url && !existingLinksNorm.has(s.url.replace(/\/+$/, "").toLowerCase())) {
      sponsorItems.push({
        label: `Episode Sponsor: ${s.title}`,
        url: s.url,
      });
    }
  }

  const docLinksToAdd = officialDocs
    .slice(0, 3)
    .filter((d) => !existingLinksNorm.has(d.url.replace(/\/+$/, "").toLowerCase()));

  const hasResourcesToAdd =
    descLabeledUrls.length > 0 ||
    pickItems.length > 0 ||
    guestItems.length > 0 ||
    sponsorItems.length > 0 ||
    docLinksToAdd.length > 0 ||
    youtubeWatchUrl;

  if (hasResourcesToAdd) {
    appendBlocks.push(
      createTextBlock(
        `Resources, Links & Official Documentation`,
        "h2",
        `resources_h2_${doc._id}`
      )
    );

    if (youtubeWatchUrl && !existingLinksNorm.has(youtubeWatchUrl.toLowerCase())) {
      appendBlocks.push(
        createRichBlock(
          [
            { text: `Watch on YouTube: `, strong: true },
            { text: `${doc.title} Full Video`, href: youtubeWatchUrl },
            { text: ` (plus ` },
            {
              text: `Subscribe to CodingCat.dev`,
              href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
            },
            { text: `)` },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `res_yt_${doc._id}`,
          }
        )
      );
    }

    for (let i = 0; i < descLabeledUrls.length; i++) {
      const item = descLabeledUrls[i];
      appendBlocks.push(
        createRichBlock(
          [
            { text: `${item.label}: `, strong: true },
            { text: item.url, href: item.url },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `res_desc_${doc._id}_${i}`,
          }
        )
      );
    }

    for (let i = 0; i < pickItems.length; i++) {
      const item = pickItems[i];
      appendBlocks.push(
        createRichBlock(
          [
            { text: `Show Pick: `, strong: true },
            { text: item.label, href: item.url },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `res_pick_${doc._id}_${i}`,
          }
        )
      );
    }

    for (let i = 0; i < guestItems.length; i++) {
      const item = guestItems[i];
      appendBlocks.push(
        createRichBlock(
          [
            { text: item.label, href: item.url, strong: true },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `res_guest_${doc._id}_${i}`,
          }
        )
      );
    }

    for (let i = 0; i < sponsorItems.length; i++) {
      const item = sponsorItems[i];
      appendBlocks.push(
        createRichBlock(
          [
            { text: item.label, href: item.url, strong: true },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `res_sponsor_${doc._id}_${i}`,
          }
        )
      );
    }

    for (let i = 0; i < docLinksToAdd.length; i++) {
      const d = docLinksToAdd[i];
      appendBlocks.push(
        createRichBlock(
          [
            { text: `${d.label}: `, href: d.url, strong: true },
            { text: d.desc },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `res_doc_${doc._id}_${i}`,
          }
        )
      );
    }
  }

  // E. Internal Topic-Cluster Cross-Links
  if (relatedDocs && relatedDocs.length > 0) {
    appendBlocks.push(
      createTextBlock(
        `Related CodingCat.dev Tutorials & Podcast Episodes`,
        "h2",
        `related_h2_${doc._id}`
      )
    );

    relatedDocs.forEach((rel, idx) => {
      const relUrl = `https://codingcat.dev/${rel._type}/${rel.slug}`;
      const relExcerpt = cleanDashes(rel.excerpt || "");
      appendBlocks.push(
        createRichBlock(
          [
            { text: rel.title, href: relUrl, strong: true },
            {
              text: relExcerpt
                ? `: ${relExcerpt.slice(0, 160)}${relExcerpt.length > 160 ? "..." : ""}`
                : ` (${rel._type === "podcast" ? "Podcast Episode" : "Technical Guide"})`,
            },
          ],
          {
            style: "normal",
            listItem: "bullet",
            level: 1,
            keySeed: `related_li_${doc._id}_${idx}`,
          }
        )
      );
    });
  }

  // F. AEO Question-and-Answer (`FAQPage` JSON-LD Schema) Section
  const existingFaqs = extractFaqs(baseBlocks);
  if (existingFaqs.length < 3) {
    appendBlocks.push(
      createTextBlock(
        `Frequently Asked Questions (FAQ)`,
        "h2",
        `faq_h2_${doc._id}`
      )
    );

    const primaryDoc = officialDocs[0];
    const cleanExcerpt = cleanDashes(doc.excerpt || doc.title);
    const cleanSummary = cleanDashes(
      doc.transcript?.summary ||
        `${doc.title} explores practical patterns for ${tagLabels.slice(0, 3).join(", ") || primaryTagLabel} in modern software engineering.`
    );

    appendBlocks.push(
      createTextBlock(
        `What are the main takeaways from ${doc.title}?`,
        "h3",
        `faq_q1_${doc._id}`
      )
    );
    appendBlocks.push(
      createRichBlock(
        [
          {
            text: `${cleanExcerpt.endsWith(".") ? cleanExcerpt : cleanExcerpt + "."} ${
              cleanSummary !== cleanExcerpt ? cleanSummary : ""
            } Throughout this ${doc._type}, ${
              guestNames.length > 0 ? guestNames.join(" and ") : authorNames.join(" and ") || "Alex Patterson"
            } breaks down real-world implementation details for ${tagLabels.slice(0, 3).join(", ") || primaryTagLabel} so developers can apply these patterns directly in production.`,
          },
        ],
        { style: "normal", keySeed: `faq_a1_${doc._id}` }
      )
    );

    appendBlocks.push(
      createTextBlock(
        `How do you implement ${primaryTagLabel} best practices in production?`,
        "h3",
        `faq_q2_${doc._id}`
      )
    );
    appendBlocks.push(
      createRichBlock(
        [
          {
            text: `When adopting ${primaryTagLabel}${
              secondaryTagLabel !== primaryTagLabel ? ` and ${secondaryTagLabel}` : ""
            } in a production stack, start by validating your configuration against the `,
          },
          { text: primaryDoc.label, href: primaryDoc.url, strong: true },
          {
            text: ` (${primaryDoc.desc}). Focus on incremental adoption, automated testing, and observability so your team can measure performance and developer velocity improvements at each stage.`,
          },
        ],
        { style: "normal", keySeed: `faq_a2_${doc._id}` }
      )
    );

    appendBlocks.push(
      createTextBlock(
        `Where can I watch the full ${doc.title} walkthrough and find related code resources?`,
        "h3",
        `faq_q3_${doc._id}`
      )
    );
    const q3Segments = [];
    if (youtubeWatchUrl) {
      q3Segments.push({ text: `You can watch the complete video session for ` });
      q3Segments.push({ text: doc.title, href: youtubeWatchUrl, strong: true });
      q3Segments.push({ text: ` on the ` });
      q3Segments.push({
        text: `CodingCat.dev YouTube channel`,
        href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
        strong: true,
      });
      q3Segments.push({ text: `. ` });
    } else {
      q3Segments.push({ text: `You can explore the complete write-up and code examples right here on CodingCat.dev, and subscribe to the ` });
      q3Segments.push({
        text: `CodingCat.dev YouTube channel`,
        href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
        strong: true,
      });
      q3Segments.push({ text: ` for weekly video tutorials. ` });
    }
    if (relatedDocs && relatedDocs[0]) {
      q3Segments.push({ text: `For a deeper dive into ${primaryTagLabel}, check out our related guide: ` });
      q3Segments.push({
        text: relatedDocs[0].title,
        href: `https://codingcat.dev/${relatedDocs[0]._type}/${relatedDocs[0].slug}`,
        strong: true,
      });
      q3Segments.push({ text: `.` });
    }
    appendBlocks.push(
      createRichBlock(q3Segments, { style: "normal", keySeed: `faq_a3_${doc._id}` })
    );
  }

  return [...prependBlocks, ...baseBlocks, ...appendBlocks];
}

async function main() {
  console.log(`Starting AEO/SEO & Link Enrichment (${isDryRun ? "DRY RUN" : "LIVE WRITE"}) on dataset: ${dataset}`);

  const query = `*[_type in ["post", "podcast"] && !(_id in path("drafts.**"))] | order(coalesce(date, _createdAt) asc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "date": coalesce(date, _createdAt),
    excerpt,
    youtube,
    tags,
    content,
    pick[]{
      name,
      site,
      user->{ title, "slug": slug.current }
    },
    guest[]->{
      _id,
      title,
      "slug": slug.current,
      socials,
      websites
    },
    author[]->{
      _id,
      title,
      "slug": slug.current,
      socials
    },
    sponsor[]->{
      _id,
      title,
      "slug": slug.current,
      url,
      couponCode
    },
    transcript->{
      _id,
      youtubeId,
      title,
      description,
      summary,
      fullText,
      chapters,
      topicCategories,
      tags
    }
  }`;

  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  }
  const { result: docs } = await res.json();
  console.log(`Fetched ${docs.length} published documents from Sanity (${dataset}).`);

  const validRoutesMap = new Set();
  for (const d of docs) {
    if (d.slug) validRoutesMap.add(`/${d._type}/${d.slug}`);
  }

  let afterThinCount = 0;
  let afterZeroInternalCount = 0;
  let afterZeroExtCount = 0;
  let afterZeroFaqCount = 0;
  let brokenInternalAfterCount = 0;
  let totalBlocksAdded = 0;
  let patchedCount = 0;

  let mutations = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const cleanedTags = cleanFalsePositiveTags(doc);
    const rankedTags = rankDocTags(doc, cleanedTags);
    const related = findBestRelatedDocs(doc, docs, 3);
    const enrichedContent = buildEnrichedContent(doc, related, rankedTags, validRoutesMap);

    const beforeLen = Array.isArray(doc.content) ? doc.content.length : 0;
    const afterLen = enrichedContent.length;
    totalBlocksAdded += Math.max(0, afterLen - beforeLen);

    const plainText = enrichedContent.map(blockToPlainText).filter(Boolean).join(" ");
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    const links = extractExistingLinks(enrichedContent);
    const intLinks = links.filter((u) => {
      if (u.startsWith("internalRef:") || u.startsWith("/")) return true;
      try {
        return new URL(u).hostname.endsWith("codingcat.dev");
      } catch {
        return false;
      }
    });
    const extLinks = links.filter((u) => !intLinks.includes(u));
    const faqs = extractFaqs(enrichedContent);

    // Verify 0 broken internal links remain
    for (const u of intLinks) {
      if (u.startsWith("internalRef:")) continue;
      try {
        const parsed = u.startsWith("/") ? new URL(u, "https://codingcat.dev") : new URL(u);
        const p = parsed.pathname.replace(/\/+$/, "");
        if (
          p &&
          !validRoutesMap.has(p) &&
          !["/podcasts", "/blog", "/courses", "/sponsors", "/guests", "/authors", "/search"].includes(p) &&
          !p.startsWith("/guest/") &&
          !p.startsWith("/author/") &&
          !p.startsWith("/sponsor/")
        ) {
          brokenInternalAfterCount++;
        }
      } catch {}
    }

    if (wordCount < 200) afterThinCount++;
    if (intLinks.length === 0) afterZeroInternalCount++;
    if (extLinks.length === 0) afterZeroExtCount++;
    if (faqs.length === 0) afterZeroFaqCount++;

    if (!isDryRun && token) {
      const patchSet = { content: enrichedContent };
      if (cleanedTags.length !== (doc.tags || []).length) {
        patchSet.tags = cleanedTags;
      }
      mutations.push({
        patch: {
          id: doc._id,
          set: patchSet,
        },
      });
      patchedCount++;

      if (mutations.length >= 15 || i === docs.length - 1) {
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
        console.log(`✓ Committed batch up to document ${i + 1}/${docs.length} (${doc.title})`);
        mutations = [];
      }
    }
  }

  console.log("Enrichment Verification Metrics:", {
    totalDocs: docs.length,
    totalBlocksAdded,
    patchedCount,
    afterThinCount,
    afterZeroInternalCount,
    afterZeroExtCount,
    afterZeroFaqCount,
    brokenInternalAfterCount,
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
