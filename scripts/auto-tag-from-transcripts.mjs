import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

// Load .env if present
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
	for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIdx = trimmed.indexOf("=");
		if (eqIdx === -1) continue;
		const key = trimmed.slice(0, eqIdx).trim();
		const val = trimmed
			.slice(eqIdx + 1)
			.trim()
			.replace(/^["']|["']$/g, "");
		if (!process.env[key]) {
			process.env[key] = val;
		}
	}
}

const projectId =
	process.env.SANITY_STUDIO_PROJECT_ID ||
	process.env.PUBLIC_SANITY_PROJECT_ID ||
	"hfh83o0w";
const dataset =
	process.env.SANITY_STUDIO_DATASET ||
	process.env.PUBLIC_SANITY_DATASET ||
	"production";
const token =
	process.env.SANITY_API_WRITE_TOKEN ||
	process.env.SANITY_AUTH_TOKEN ||
	process.env.SANITY_TOKEN;
const isDryRun = process.argv.includes("--dry-run") || !token;

const client = createClient({
	projectId,
	dataset,
	...(token ? { token } : {}),
	apiVersion: "2025-09-30",
	useCdn: false,
});

/**
 * Canonical alias normalization table so legacy tag values (`next.js`, `accessibility`,
 * `Web Dev`, `TailwindCSS`, `Daisy UI`, `micro:bit`, `Three.js`) resolve to canonical slugs.
 */
export const TAG_VALUE_ALIASES = {
	"next.js": { value: "nextjs", label: "Next.js" },
	next: { value: "nextjs", label: "Next.js" },
	nextjs: { value: "nextjs", label: "Next.js" },
	accessibility: { value: "a11y", label: "Accessibility" },
	a11y: { value: "a11y", label: "Accessibility" },
	"web dev": { value: "webdev", label: "WebDev" },
	"web-dev": { value: "webdev", label: "WebDev" },
	webdev: { value: "webdev", label: "WebDev" },
	tailwindcss: { value: "tailwindcss", label: "Tailwind CSS" },
	tailwind: { value: "tailwindcss", label: "Tailwind CSS" },
	"daisy ui": { value: "daisyui", label: "DaisyUI" },
	daisyui: { value: "daisyui", label: "DaisyUI" },
	"micro:bit": { value: "microbit", label: "micro:bit" },
	microbit: { value: "microbit", label: "micro:bit" },
	"three.js": { value: "threejs", label: "Three.js" },
	threejs: { value: "threejs", label: "Three.js" },
	svelte: { value: "svelte", label: "Svelte" },
	sveltekit: { value: "sveltekit", label: "SvelteKit" },
	firebase: { value: "firebase", label: "Firebase" },
	html: { value: "html", label: "HTML" },
	css: { value: "css", label: "CSS" },
	"aws-amplify": { value: "amplify", label: "AWS Amplify" },
	amplify: { value: "amplify", label: "AWS Amplify" },
	"cloudflare-d1": { value: "d1", label: "Cloudflare D1" },
	d1: { value: "d1", label: "Cloudflare D1" },
	"mental health": { value: "mental-health", label: "Mental Health" },
	"web technologies": { value: "web-technologies", label: "Web Standards" },
};

/**
 * Complete 111-tag taxonomy of Vendors, Cloud Providers, Frameworks, Languages,
 * Databases, Auth Tools, AI Protocols, and DevOps/Architecture Topics.
 */
export const TAG_TAXONOMY = [
	// --- Cloud & Vendor Hubs ---
	{
		label: "Sanity",
		value: "sanity",
		category: "vendors",
		strongPatterns: [
			/\bsanity\.io\b/i,
			/\bsanity studio\b/i,
			/\bsanity cms\b/i,
			/\bsanity content\b/i,
			/\bportable text\b/i,
			/\bgroq\b/i,
			/\bcontent releases\b/i,
			/\bcontent lake\b/i,
		],
	},
	{
		label: "Firebase",
		value: "firebase",
		category: "vendors",
		strongPatterns: [
			/\bfirebase\b/i,
			/\bfirestore\b/i,
			/\bgenkit\b/i,
			/\bproject idx\b/i,
			/\bangularfire\b/i,
			/\brxfire\b/i,
		],
	},
	{
		label: "AWS Amplify",
		value: "amplify",
		category: "vendors",
		strongPatterns: [
			/\baws amplify\b/i,
			/\bamplify gen 2\b/i,
			/\bappsync\b/i,
			/\bamazon cognito\b/i,
		],
	},
	{
		label: "Cloudflare",
		value: "cloudflare",
		category: "vendors",
		strongPatterns: [
			/\bcloudflare\b/i,
			/\bwrangler\b/i,
			/\bcloudflare pages\b/i,
			/\bcloudflare r2\b/i,
			/\bcloudflare queues\b/i,
		],
	},
	{
		label: "Cloudflare Workers",
		value: "cloudflare-workers",
		category: "vendors",
		strongPatterns: [
			/\bcloudflare workers\b/i,
			/\bwrangler\.jsonc?\b/i,
			/\bv8 isolates?\b/i,
			/\bworkerd\b/i,
		],
	},
	{
		label: "AWS",
		value: "aws",
		category: "vendors",
		strongPatterns: [
			/\baws\b/i,
			/\bamazon web services\b/i,
			/\bamazon bedrock\b/i,
			/\baws amplify\b/i,
			/\baws lambda\b/i,
			/\baws cdk\b/i,
			/\baws sam\b/i,
			/\bappsync\b/i,
			/\bdynamodb\b/i,
			/\bcloudformation\b/i,
			/\blocalstack\b/i,
			/\bsagemaker\b/i,
			/\bamazon s3\b/i,
			/\bamazon cognito\b/i,
			/\baws community builder/i,
		],
	},
	{
		label: "Google Cloud",
		value: "google-cloud",
		category: "vendors",
		strongPatterns: [
			/\bgoogle cloud\b/i,
			/\bgcp\b/i,
			/\bvertex ai\b/i,
			/\bcloud run\b/i,
			/\bbigquery\b/i,
		],
	},
	{
		label: "Microsoft Azure",
		value: "azure",
		category: "vendors",
		strongPatterns: [
			/\bmicrosoft azure\b/i,
			/\bazure\b/i,
			/\bcosmos db\b/i,
		],
	},
	{
		label: "Vercel",
		value: "vercel",
		category: "vendors",
		strongPatterns: [/\bvercel\b/i, /\bturborepo\b/i, /\bv0\.dev\b/i],
	},
	{
		label: "Netlify",
		value: "netlify",
		category: "vendors",
		strongPatterns: [/\bnetlify\b/i],
	},
	{
		label: "Supabase",
		value: "supabase",
		category: "vendors",
		strongPatterns: [/\bsupabase\b/i],
	},
	{
		label: "Appwrite",
		value: "appwrite",
		category: "vendors",
		strongPatterns: [/\bappwrite\b/i],
	},
	{
		label: "Convex",
		value: "convex",
		category: "vendors",
		strongPatterns: [/\bconvex\.dev\b/i, /\bconvex\b/i],
	},
	{
		label: "Builder.io",
		value: "builder-io",
		category: "vendors",
		strongPatterns: [
			/\bbuilder\.io\b/i,
			/\bqwik\b/i,
			/\bmitosis\b/i,
			/\bpartytown\b/i,
		],
	},
	{
		label: "Algolia",
		value: "algolia",
		category: "vendors",
		strongPatterns: [/\balgolia\b/i],
	},
	{
		label: "Cloudinary",
		value: "cloudinary",
		category: "vendors",
		strongPatterns: [/\bcloudinary\b/i],
	},
	{
		label: "Storyblok",
		value: "storyblok",
		category: "vendors",
		strongPatterns: [/\bstoryblok\b/i],
	},
	{
		label: "Contentful",
		value: "contentful",
		category: "vendors",
		strongPatterns: [/\bcontentful\b/i],
	},
	{
		label: "Hygraph",
		value: "hygraph",
		category: "vendors",
		strongPatterns: [/\bhygraph\b/i, /\bgraphcms\b/i],
	},
	{
		label: "Shopify",
		value: "shopify",
		category: "vendors",
		strongPatterns: [/\bshopify\b/i, /\bshopify hydrogen\b/i],
	},
	{
		label: "Stripe",
		value: "stripe",
		category: "vendors",
		strongPatterns: [/\bstripe\b/i],
	},
	{
		label: "Sentry",
		value: "sentry",
		category: "vendors",
		strongPatterns: [/\bsentry\.io\b/i, /\bsentry\b/i],
	},
	{
		label: "PostHog",
		value: "posthog",
		category: "vendors",
		strongPatterns: [/\bposthog\b/i],
	},
	{
		label: "LaunchDarkly",
		value: "launchdarkly",
		category: "vendors",
		strongPatterns: [/\blaunchdarkly\b/i],
	},
	{
		label: "Postman",
		value: "postman",
		category: "vendors",
		strongPatterns: [/\bpostman\b/i],
	},
	{
		label: "Notion",
		value: "notion",
		category: "vendors",
		strongPatterns: [/\bnotion\b/i],
	},
	{
		label: "YouTube",
		value: "youtube",
		category: "vendors",
		strongPatterns: [/\byoutube data api\b/i, /\byoutube studio\b/i],
	},

	// --- Frameworks & UI ---
	{
		label: "Astro",
		value: "astro",
		category: "frameworks",
		strongPatterns: [
			/\bastro\.build\b/i,
			/\bastrojs\b/i,
			/\bastro 7\b/i,
			/\bastro islands\b/i,
			/\bserver islands\b/i,
			/\bastro\b/i,
		],
	},
	{
		label: "React",
		value: "react",
		category: "frameworks",
		strongPatterns: [
			/\breact\b/i,
			/\breactjs\b/i,
			/\breact\.js\b/i,
			/\breact 19\b/i,
			/\breact server components\b/i,
		],
	},
	{
		label: "Next.js",
		value: "nextjs",
		category: "frameworks",
		strongPatterns: [/\bnext\.js\b/i, /\bnextjs\b/i, /\bapp router\b/i],
	},
	{
		label: "Svelte",
		value: "svelte",
		category: "frameworks",
		strongPatterns: [/\bsvelte\b/i, /\bsvelte 5\b/i, /\bsvelte runes\b/i],
	},
	{
		label: "SvelteKit",
		value: "sveltekit",
		category: "frameworks",
		strongPatterns: [/\bsveltekit\b/i, /\+page\.server\.ts\b/i],
	},
	{
		label: "TanStack",
		value: "tanstack",
		category: "frameworks",
		strongPatterns: [
			/\btanstack\b/i,
			/\btanstack start\b/i,
			/\btanstack router\b/i,
			/\btanstack query\b/i,
			/\breact query\b/i,
		],
	},
	{
		label: "Hono",
		value: "hono",
		category: "frameworks",
		strongPatterns: [/\bhono\b/i, /\bhono rpc\b/i, /\bzvalidator\b/i],
	},
	{
		label: "Vue",
		value: "vue",
		category: "frameworks",
		strongPatterns: [/\bvue\.js\b/i, /\bvuejs\b/i, /\bnuxt\b/i, /\bnuxtjs\b/i],
	},
	{
		label: "Angular",
		value: "angular",
		category: "frameworks",
		strongPatterns: [
			/\bangular\b/i,
			/\banalogjs\b/i,
			/\bngrx\b/i,
			/\bangular material\b/i,
		],
	},
	{
		label: "SolidJS",
		value: "solidjs",
		category: "frameworks",
		strongPatterns: [/\bsolidjs\b/i, /\bsolid\.js\b/i, /\bsolidstart\b/i],
	},
	{
		label: "Remix",
		value: "remix",
		category: "frameworks",
		strongPatterns: [/\bremix\.run\b/i, /\bremix\b/i, /\breact router v7\b/i],
	},
	{
		label: "Tailwind CSS",
		value: "tailwindcss",
		category: "frameworks",
		strongPatterns: [/\btailwind\b/i, /\btailwindcss\b/i],
	},
	{
		label: "DaisyUI",
		value: "daisyui",
		category: "frameworks",
		strongPatterns: [/\bdaisyui\b/i, /\bdaisy ui\b/i],
	},
	{
		label: "Flutter",
		value: "flutter",
		category: "frameworks",
		strongPatterns: [/\bflutter\b/i, /\bdart\b/i],
	},
	{
		label: "React Native",
		value: "react-native",
		category: "frameworks",
		strongPatterns: [/\breact native\b/i, /\bexpo\b/i],
	},
	{
		label: "Three.js",
		value: "threejs",
		category: "frameworks",
		strongPatterns: [/\bthree\.js\b/i, /\bthreejs\b/i, /\breact three fiber\b/i],
	},
	{
		label: "Remotion",
		value: "remotion",
		category: "frameworks",
		strongPatterns: [/\bremotion\b/i],
	},
	{
		label: "Vite",
		value: "vite",
		category: "frameworks",
		strongPatterns: [/\bvite\b/i, /\bvitejs\b/i, /\brolldown\b/i],
	},

	// --- Programming Languages & Web Standards ---
	{
		label: "TypeScript",
		value: "typescript",
		category: "languages",
		strongPatterns: [/\btypescript\b/i, /\btsconfig\b/i],
	},
	{
		label: "JavaScript",
		value: "javascript",
		category: "languages",
		strongPatterns: [
			/\bjavascript\b/i,
			/\becmascript\b/i,
			/\bvanilla js\b/i,
			/\bevent loop\b/i,
			/\bclosures\b/i,
		],
	},
	{
		label: "HTML",
		value: "html",
		category: "languages",
		strongPatterns: [
			/\bhtml5?\b/i,
			/\bsemantic html\b/i,
			/\bweb components\b/i,
			/\bhtmx\b/i,
		],
	},
	{
		label: "CSS",
		value: "css",
		category: "languages",
		strongPatterns: [
			/\bcss3?\b/i,
			/\bflexbox\b/i,
			/\bcss grid\b/i,
			/\bsubgrid\b/i,
			/\bview transitions\b/i,
			/\bsass\b/i,
			/\bscss\b/i,
		],
	},
	{
		label: "SQL",
		value: "sql",
		category: "languages",
		strongPatterns: [
			/\bsql\b/i,
			/\bb-tree\b/i,
			/\bquery plan\b/i,
			/\brelational database/i,
		],
	},
	{
		label: "GraphQL",
		value: "graphql",
		category: "languages",
		strongPatterns: [/\bgraphql\b/i, /\bapollo\b/i],
	},
	{
		label: "Node.js",
		value: "nodejs",
		category: "languages",
		strongPatterns: [/\bnode\.js\b/i, /\bnodejs\b/i, /\bexpress\b/i],
	},
	{
		label: "Bun",
		value: "bun",
		category: "languages",
		strongPatterns: [/\bbun\.sh\b/i, /\bbun runtime\b/i],
	},
	{
		label: "Deno",
		value: "deno",
		category: "languages",
		strongPatterns: [/\bdeno\b/i],
	},
	{
		label: "Python",
		value: "python",
		category: "languages",
		strongPatterns: [
			/\bpython\b/i,
			/\bfastapi\b/i,
			/\bdjango\b/i,
			/\bpytorch\b/i,
		],
	},
	{
		label: "Rust",
		value: "rust",
		category: "languages",
		strongPatterns: [
			/\brust\b/i,
			/\brustlang\b/i,
			/\btauri\b/i,
			/\bwebassembly\b/i,
			/\bwasm\b/i,
		],
	},
	{
		label: "Go",
		value: "go",
		category: "languages",
		strongPatterns: [/\bgolang\b/i],
	},
	{
		label: "PHP",
		value: "php",
		category: "languages",
		strongPatterns: [
			/\bphp\b/i,
			/\blaravel\b/i,
			/\bwordpress\b/i,
			/\bsymfony\b/i,
			/\bzend engine\b/i,
		],
	},
	{
		label: "C#",
		value: "csharp",
		category: "languages",
		strongPatterns: [/\bc#\b/i, /\bdotnet\b/i, /\.net\b/i, /\bblazor\b/i],
	},
	{
		label: "Zod",
		value: "zod",
		category: "languages",
		strongPatterns: [/\bzod\b/i, /\bzvalidator\b/i, /\bsafeparse\b/i],
	},

	// --- Databases, Storage & Auth ---
	{
		label: "Cloudflare D1",
		value: "d1",
		category: "data",
		strongPatterns: [
			/\bcloudflare d1\b/i,
			/\bd1 database\b/i,
			/\bd1 sqlite\b/i,
			/\benv\.db\b/i,
		],
	},
	{
		label: "Durable Objects",
		value: "durable-objects",
		category: "data",
		strongPatterns: [
			/\bdurable objects?\b/i,
			/\bctx\.storage\.sql\b/i,
			/\bwebsocket hibernation\b/i,
		],
	},
	{
		label: "Drizzle",
		value: "drizzle",
		category: "data",
		strongPatterns: [/\bdrizzle orm\b/i, /\bdrizzle-kit\b/i, /\bdrizzle\b/i],
	},
	{
		label: "Prisma",
		value: "prisma",
		category: "data",
		strongPatterns: [/\bprisma\b/i],
	},
	{
		label: "PostgreSQL",
		value: "postgresql",
		category: "data",
		strongPatterns: [/\bpostgresql\b/i, /\bpostgres\b/i, /\bpgvector\b/i],
	},
	{
		label: "SQLite",
		value: "sqlite",
		category: "data",
		strongPatterns: [/\bsqlite\b/i, /\bwal mode\b/i],
	},
	{
		label: "PGlite",
		value: "pglite",
		category: "data",
		strongPatterns: [/\bpglite\b/i, /\belectric sql\b/i, /\blocal-first\b/i],
	},
	{
		label: "Turso",
		value: "turso",
		category: "data",
		strongPatterns: [/\bturso\b/i, /\blibsql\b/i],
	},
	{
		label: "Neon",
		value: "neon",
		category: "data",
		strongPatterns: [/\bneon\.tech\b/i, /\bneon postgres\b/i],
	},
	{
		label: "MongoDB",
		value: "mongodb",
		category: "data",
		strongPatterns: [/\bmongodb\b/i, /\bmongo atlas\b/i],
	},
	{
		label: "Redis",
		value: "redis",
		category: "data",
		strongPatterns: [/\bredis\b/i, /\bupstash\b/i],
	},
	{
		label: "Better-Auth",
		value: "better-auth",
		category: "data",
		strongPatterns: [/\bbetter-auth\b/i, /\bbetter auth\b/i],
	},
	{
		label: "Clerk",
		value: "clerk",
		category: "data",
		strongPatterns: [/\bclerk\.com\b/i, /\bclerk\.dev\b/i, /\bclerk auth\b/i],
	},
	{
		label: "Auth0",
		value: "auth0",
		category: "data",
		strongPatterns: [/\bauth0\b/i],
	},
	{
		label: "AuthZed",
		value: "authzed",
		category: "data",
		strongPatterns: [/\bauthzed\b/i, /\bspicedb\b/i],
	},
	{
		label: "Headless CMS",
		value: "cms",
		category: "data",
		strongPatterns: [/\bheadless cms\b/i, /\bcontent operating system\b/i],
	},
	{
		label: "Databases",
		value: "database",
		category: "data",
		strongPatterns: [/\brelational databases?\b/i, /\bdatabase indexing\b/i],
	},

	// --- AI, Agents & Protocols ---
	{
		label: "AI",
		value: "ai",
		category: "ai",
		strongPatterns: [
			/\b(?:artificial intelligence|genai|generative ai|llm|llms|openai|chatgpt|anthropic|claude|gemini|langchain|vector database|rag|machine learning|ai agent|ai agents)\b/i,
		],
	},
	{
		label: "MCP",
		value: "mcp",
		category: "ai",
		strongPatterns: [
			/\bmodel context protocol\b/i,
			/\bmcp server\b/i,
			/\bmcp\b/i,
		],
	},
	{
		label: "WebMCP",
		value: "webmcp",
		category: "ai",
		strongPatterns: [/\bwebmcp\b/i, /\bnavigator\.modelcontext\b/i],
	},
	{
		label: "Web AI",
		value: "web-ai",
		category: "ai",
		strongPatterns: [/\bweb ai\b/i, /\bclient-side ai\b/i, /\bon-device ai\b/i],
	},
	{
		label: "WebGPU",
		value: "webgpu",
		category: "ai",
		strongPatterns: [/\bwebgpu\b/i, /\bwgsl\b/i],
	},
	{
		label: "OpenAI",
		value: "openai",
		category: "ai",
		strongPatterns: [/\bopenai\b/i, /\bchatgpt\b/i, /\bgpt-4/i],
	},
	{
		label: "Anthropic",
		value: "anthropic",
		category: "ai",
		strongPatterns: [/\banthropic\b/i, /\bclaude\b/i],
	},
	{
		label: "Google Gemini",
		value: "gemini",
		category: "ai",
		strongPatterns: [/\bgoogle gemini\b/i, /\bgemini pro\b/i, /\bantigravity\b/i],
	},
	{
		label: "Gemini Nano",
		value: "gemini-nano",
		category: "ai",
		strongPatterns: [/\bgemini nano\b/i],
	},
	{
		label: "Chrome Built-in AI",
		value: "chrome-built-in-ai",
		category: "ai",
		strongPatterns: [/\bchrome built-in ai\b/i, /\bprompt api\b/i],
	},
	{
		label: "Transformers.js",
		value: "transformers-js",
		category: "ai",
		strongPatterns: [/\btransformers\.js\b/i, /\bhugging face\b/i],
	},
	{
		label: "RAG",
		value: "rag",
		category: "ai",
		strongPatterns: [
			/\bretrieval augmented generation\b/i,
			/\bvector search\b/i,
			/\bhybrid search\b/i,
		],
	},

	// --- DevOps, Testing, Security & Architecture ---
	{
		label: "Git",
		value: "git",
		category: "devops",
		strongPatterns: [
			/\bgit internals\b/i,
			/\bgit rebase\b/i,
			/\bgit worktree\b/i,
			/\bgit bisect\b/i,
			/\bgit commit\b/i,
		],
	},
	{
		label: "GitHub",
		value: "github",
		category: "devops",
		strongPatterns: [
			/\bgithub\b/i,
			/\bgithub actions\b/i,
			/\bgithub copilot\b/i,
			/\bcodespaces\b/i,
		],
	},
	{
		label: "Docker",
		value: "docker",
		category: "devops",
		strongPatterns: [
			/\bdocker\b/i,
			/\bdockerfile\b/i,
			/\bkubernetes\b/i,
			/\bk8s\b/i,
		],
	},
	{
		label: "Playwright",
		value: "playwright",
		category: "devops",
		strongPatterns: [/\bplaywright\b/i, /\be2e testing\b/i],
	},
	{
		label: "Testing",
		value: "testing",
		category: "devops",
		strongPatterns: [
			/\bvitest\b/i,
			/\btest-driven development\b/i,
			/\btdd\b/i,
			/\bunit testing\b/i,
		],
	},
	{
		label: "Security",
		value: "security",
		category: "devops",
		strongPatterns: [
			/\bcybersecurity\b/i,
			/\bcve-\d{4}-\d+/i,
			/\bvulnerability\b/i,
			/\bauthentication\b/i,
			/\bauthorization\b/i,
			/\boauth\b/i,
			/\bpasskeys?\b/i,
			/\brbac\b/i,
			/\bzero trust\b/i,
		],
	},
	{
		label: "Serverless",
		value: "serverless",
		category: "devops",
		strongPatterns: [
			/\bserverless\b/i,
			/\bjamstack\b/i,
			/\bedge functions?\b/i,
			/\bzero-cold-start\b/i,
			/\bzero cold start\b/i,
		],
	},
	{
		label: "DevOps",
		value: "devops",
		category: "devops",
		strongPatterns: [
			/\bdevops\b/i,
			/\bci\/cd\b/i,
			/\bterraform\b/i,
			/\bobservability\b/i,
			/\bmonitoring\b/i,
		],
	},
	{
		label: "Accessibility",
		value: "a11y",
		category: "devops",
		strongPatterns: [
			/\baccessibility\b/i,
			/\ba11y\b/i,
			/\bwcag\b/i,
			/\bscreen readers?\b/i,
		],
	},
	{
		label: "Design",
		value: "design",
		category: "devops",
		strongPatterns: [
			/\bfigma\b/i,
			/\bdesign system/i,
			/\bui\/ux\b/i,
			/\bdesign tokens\b/i,
		],
	},
	{
		label: "Architecture",
		value: "architecture",
		category: "devops",
		strongPatterns: [
			/\bsystem design\b/i,
			/\bdistributed systems\b/i,
			/\barchitecture diagram\b/i,
		],
	},
	{
		label: "Career",
		value: "career",
		category: "devops",
		strongPatterns: [
			/\bdevrel\b/i,
			/\bdeveloper relations\b/i,
			/\bdeveloper advocacy\b/i,
			/\btech career\b/i,
			/\bgetting hired\b/i,
		],
	},
	{
		label: "WebDev",
		value: "webdev",
		category: "devops",
		strongPatterns: [/\bweb development\b/i, /\bcore web vitals\b/i],
	},
];

const TAXONOMY_BY_VALUE = new Map(
	TAG_TAXONOMY.map((entry) => [entry.value, entry]),
);

function normalizeTag(rawTag) {
	const rawVal = (rawTag?.value || rawTag?.label || "").trim().toLowerCase();
	const rawLabel = (rawTag?.label || rawTag?.value || "").trim();
	if (!rawVal && !rawLabel) return null;

	const alias = TAG_VALUE_ALIASES[rawVal] || TAG_VALUE_ALIASES[rawLabel.toLowerCase()];
	if (alias) {
		return {
			_key: `tag_${alias.value.replace(/[^a-z0-9]/g, "_")}`,
			_type: "tag",
			label: alias.label,
			value: alias.value,
		};
	}

	const canon = TAXONOMY_BY_VALUE.get(rawVal);
	if (canon) {
		return {
			_key: `tag_${canon.value.replace(/[^a-z0-9]/g, "_")}`,
			_type: "tag",
			label: canon.label,
			value: canon.value,
		};
	}

	return {
		_key: rawTag._key || `tag_${rawVal.replace(/[^a-z0-9]/g, "_")}`,
		_type: "tag",
		label: rawLabel,
		value: rawVal,
	};
}

function extractPortableTextPlain(blocks) {
	if (!Array.isArray(blocks)) return "";
	const parts = [];
	for (const b of blocks) {
		if (b?._type === "block" && Array.isArray(b.children)) {
			parts.push(b.children.map((c) => c.text || "").join(""));
		} else if (b?._type === "code" && b.code) {
			parts.push(`${b.filename || ""} ${b.language || ""} ${b.code || ""}`);
		}
	}
	return parts.join("\n");
}

function extractYouTubeVideoId(url) {
	if (!url || typeof url !== "string") return null;
	const m =
		url.match(/(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([A-Za-z0-9_-]{11})/) ||
		url.match(/^([A-Za-z0-9_-]{11})$/);
	return m ? m[1] : null;
}

function countPatternMatches(text, patterns) {
	if (!text) return 0;
	let total = 0;
	for (const p of patterns) {
		const globalRegex = new RegExp(
			p.source,
			p.flags.includes("g") ? p.flags : p.flags + "g",
		);
		const matches = text.match(globalRegex);
		if (matches) total += matches.length;
	}
	return total;
}

function stripSponsorBoilerplate(text) {
	if (!text) return "";
	return text
		.replace(/Sponsors?:[\s\S]*?(?=Recorded:|\n00:00|$)/gi, "")
		.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s*[-–]?\s*Sponsors?:.*$/gim, "")
		.replace(
			/brought to you by (?:cloudinary|algolia|storyblok|builder\.io|auth0|fauna|supabase)[\s\S]{0,300}/gi,
			"",
		)
		.replace(/Have you already discovered Storyblok\?[\s\S]{0,300}/gi, "");
}

export function inferTagsForDocument(doc, transcript, parentContext = "") {
	const existingTags = Array.isArray(doc.tags) ? doc.tags : [];
	const byValue = new Map();

	for (const t of existingTags) {
		const norm = normalizeTag(t);
		if (norm && !byValue.has(norm.value)) {
			byValue.set(norm.value, {
				...norm,
				score: 100,
			});
		}
	}

	const titleAndSlug = [
		doc.title || "",
		typeof doc.slug === "object" ? doc.slug?.current || "" : doc.slug || "",
		transcript?.title || "",
		parentContext || "",
	].join("\n");

	const ytTagsText = Array.isArray(transcript?.tags)
		? transcript.tags.join("\n")
		: "";

	const excerptAndDesc = stripSponsorBoilerplate(
		[doc.excerpt || "", transcript?.description || ""].join("\n"),
	);

	const bodyText = stripSponsorBoilerplate(extractPortableTextPlain(doc.content));
	const spokenText = stripSponsorBoilerplate(transcript?.fullText || "");

	const scoredCandidates = [];

	for (const entry of TAG_TAXONOMY) {
		if (byValue.has(entry.value)) continue;

		const titleHits = countPatternMatches(titleAndSlug, entry.strongPatterns);
		const ytTagHits = countPatternMatches(ytTagsText, entry.strongPatterns);
		const descHits = countPatternMatches(excerptAndDesc, entry.strongPatterns);
		const bodyHits = countPatternMatches(bodyText, entry.strongPatterns);
		const spokenHits = countPatternMatches(spokenText, entry.strongPatterns);

		const score =
			(titleHits > 0 ? 10 : 0) +
			(ytTagHits > 0 ? 6 : 0) +
			(descHits > 0 ? 5 : 0) +
			Math.min(8, bodyHits * 2) +
			Math.floor(spokenHits / 3);

		if (score >= 4) {
			scoredCandidates.push({
				_key: `tag_${entry.value.replace(/[^a-z0-9]/g, "_")}`,
				_type: "tag",
				label: entry.label,
				value: entry.value,
				score,
			});
		}
	}

	scoredCandidates.sort((a, b) => b.score - a.score);

	for (const cand of scoredCandidates) {
		if (byValue.size >= 8) break;
		byValue.set(cand.value, cand);
	}

	// Ensure WebDev fallback tag if nothing else matched
	if (byValue.size === 0) {
		byValue.set("webdev", {
			_key: "tag_webdev",
			_type: "tag",
			label: "WebDev",
			value: "webdev",
			score: 1,
		});
	}

	return Array.from(byValue.values()).map(({ _key, _type, label, value }) => ({
		_key,
		_type,
		label,
		value,
	}));
}

export async function autoTagAllContent({ dryRun = isDryRun } = {}) {
	console.log(
		`\n=== Running Transcript & Content Auto-Tagger across Courses, Lessons, Podcasts & Blog Posts (dataset: ${dataset}, dryRun: ${dryRun}) ===`,
	);

	const docs = await client.fetch(
		`*[_type in ["course", "lesson", "post", "podcast"] && !(_id in path("drafts.**"))]{
			_id,
			_type,
			title,
			"slug": slug.current,
			excerpt,
			youtube,
			tags,
			transcript,
			sponsor,
			content,
			sections[]{
				title,
				"lessonIds": lesson[]._ref
			},
			devto,
			hashnode,
			awsbuilder
		}`,
	);

	// Map each lesson ID to its parent course context so lessons inherit course stack context
	const parentCourseByLessonId = new Map();
	for (const doc of docs) {
		if (doc._type === "course" && Array.isArray(doc.sections)) {
			const sectionTitles = doc.sections.map((s) => s?.title || "").join(" ");
			const courseTags = (doc.tags || []).map((t) => t.label || t.value).join(" ");
			const ctx = `${doc.title || ""} ${doc.slug || ""} ${doc.excerpt || ""} ${sectionTitles} ${courseTags}`;
			for (const sec of doc.sections) {
				for (const lid of sec?.lessonIds || []) {
					if (lid) parentCourseByLessonId.set(lid, ctx);
				}
			}
		}
	}

	const transcripts = await client.fetch(
		`*[_type == "transcript" && !(_id in path("drafts.**"))]{
			_id,
			videoId,
			title,
			description,
			tags,
			topicCategories,
			summary,
			fullText,
			contentRef
		}`,
	);

	console.log(
		`Loaded ${docs.length} content documents (courses, lessons, posts, podcasts) and ${transcripts.length} transcripts.`,
	);

	const transcriptById = new Map();
	const transcriptByContentId = new Map();
	const transcriptByVideoId = new Map();

	for (const tr of transcripts) {
		transcriptById.set(tr._id, tr);
		if (tr.contentRef?._ref) {
			transcriptByContentId.set(tr.contentRef._ref, tr);
		}
		if (tr.videoId) {
			transcriptByVideoId.set(tr.videoId, tr);
		}
	}

	let updatedCount = 0;
	let linkedTranscriptCount = 0;
	const tagStats = new Map();
	const awsMatchedDocs = [];

	for (const doc of docs) {
		const ytId = extractYouTubeVideoId(doc.youtube);
		const linkedTranscript =
			(doc.transcript?._ref && transcriptById.get(doc.transcript._ref)) ||
			transcriptByContentId.get(doc._id) ||
			(ytId && transcriptByVideoId.get(ytId)) ||
			null;

		const parentCtx =
			doc._type === "lesson" ? parentCourseByLessonId.get(doc._id) || "" : "";
		const inferredTags = inferTagsForDocument(doc, linkedTranscript, parentCtx);

		for (const t of inferredTags) {
			tagStats.set(t.label, (tagStats.get(t.label) || 0) + 1);
		}

		if (
			(doc._type === "post" || doc._type === "podcast") &&
			inferredTags.some((t) => t.value === "aws")
		) {
			awsMatchedDocs.push({
				_id: doc._id,
				_type: doc._type,
				title: doc.title,
				slug: doc.slug,
				hasSponsor: Array.isArray(doc.sponsor) && doc.sponsor.length > 0,
				hasTranscript: Boolean(linkedTranscript),
				tags: inferredTags.map((t) => t.label),
			});
		}

		const prevSerialized = JSON.stringify(
			(doc.tags || []).map((t) => ({ label: t.label, value: t.value })),
		);
		const nextSerialized = JSON.stringify(
			inferredTags.map((t) => ({ label: t.label, value: t.value })),
		);
		const needsTranscriptLink =
			linkedTranscript && doc.transcript?._ref !== linkedTranscript._id;

		if (prevSerialized !== nextSerialized || needsTranscriptLink) {
			updatedCount++;
			if (needsTranscriptLink) linkedTranscriptCount++;

			if (!dryRun) {
				const patchObj = { tags: inferredTags };
				if (needsTranscriptLink) {
					patchObj.transcript = {
						_type: "reference",
						_ref: linkedTranscript._id,
					};
				}
				await client
					.patch(doc._id)
					.set(patchObj)
					.commit()
					.catch((err) =>
						console.error(`Failed patching ${doc._id}:`, err.message),
					);
			}
		}
	}

	console.log(`\n=== Auto-Tagging Summary ===`);
	console.log(`Total content docs scanned: ${docs.length}`);
	console.log(`Docs updated with normalized & enriched tags: ${updatedCount}`);
	console.log(`Docs newly linked to transcripts: ${linkedTranscriptCount}`);

	console.log(`\n=== Top Inferred Tags Across Catalog ===`);
	const sortedTags = Array.from(tagStats.entries()).sort((a, b) => b[1] - a[1]);
	for (const [label, count] of sortedTags.slice(0, 50)) {
		console.log(`- ${label}: ${count}`);
	}

	return { updatedCount, awsMatchedDocs };
}

if (import.meta.url === `file://${process.argv[1]}`) {
	autoTagAllContent().catch((err) => {
		console.error("Auto-tag error:", err);
		process.exit(1);
	});
}
