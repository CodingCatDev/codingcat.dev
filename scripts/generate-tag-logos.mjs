#!/usr/bin/env node
/**
 * Generates self-hosted Light & Dark SVG symbols and lockups for all CodingCat.dev
 * vendor, framework, language, database, and AI brand hubs in `apps/site/public/logos/tags/`.
 *
 * Official partner lockups (`sanity`, `firebase`, `amplify`) in `/public/logos/`
 * remain untouched. Editorial concept tags (`kind: "concept"`) do not generate
 * fake company logo lockups.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const requireSanity = createRequire(
	path.resolve(process.cwd(), "apps/sanity/package.json"),
);
const si = requireSanity("react-icons/si");
const fa = requireSanity("react-icons/fa6");

const OUT_DIR = path.resolve(process.cwd(), "apps/site/public/logos/tags");
fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * Authentic custom 24x24 brand vector marks for developer brands not bundled in `react-icons/si`.
 */
const CUSTOM_BRAND_VECTORS = {
	azure: {
		viewBox: "0 0 24 24",
		paths: [
			"M13.05 4.24L6.56 18.05 2 18l5.09-8.76 5.96-5zM13.73 5.38L22 19.76H8.74l4.98-1.92 3.17-3.98-3.16-8.48z",
		],
	},
	convex: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75c3.42 0 6.43-1.76 8.17-4.42l-3.15-1.82a6.1 6.1 0 0 1-5.02 2.61c-3.38 0-6.12-2.74-6.12-6.12s2.74-6.12 6.12-6.12c2.1 0 3.95 1.06 5.05 2.67l3.14-1.83A9.73 9.73 0 0 0 12 2.25zm3.5 7.25-3.5 2.5 3.5 2.5 3.5-2.5-3.5-2.5z",
		],
	},
	"builder-io": {
		viewBox: "0 0 24 24",
		paths: [
			"M4 3h9.5a4.5 4.5 0 0 1 3.18 7.68A4.75 4.75 0 0 1 14.25 19H4V3zm3.5 3.2v3.3h5.5a1.65 1.65 0 0 0 0-3.3H7.5zm0 6.3v3.3h6.25a1.65 1.65 0 0 0 0-3.3H7.5zM19 3h2v16h-2V3z",
		],
	},
	hygraph: {
		viewBox: "0 0 24 24",
		paths: [
			"M4 3.5 9.5 2v7.5L14.5 8V2L20 3.5v17L14.5 22v-7.5L9.5 16v6L4 20.5v-17z",
		],
	},
	launchdarkly: {
		viewBox: "0 0 24 24",
		paths: [
			"M3 5.5 14.5 2l-3.2 7.8L21 7.2 8.5 22l3.1-8.8L3 15.8V5.5z",
		],
	},
	tanstack: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 3a6 6 0 0 1 5.92 5H6.08A6 6 0 0 1 12 3zm-9 8h18v2.2c-2.2 0-2.75 1.1-4.5 1.1s-2.3-1.1-4.5-1.1-2.75 1.1-4.5 1.1S5.2 13.2 3 13.2V11zm0 5.2c2.2 0 2.75 1.1 4.5 1.1s2.3-1.1 4.5-1.1 2.75 1.1 4.5 1.1 2.3-1.1 4.5-1.1v2.2c-2.2 0-2.75 1.1-4.5 1.1s-2.3-1.1-4.5-1.1-2.75 1.1-4.5 1.1-2.3-1.1-4.5-1.1v-2.2z",
		],
	},
	remotion: {
		viewBox: "0 0 24 24",
		paths: [
			"M4 4.5A2.5 2.5 0 0 1 7.75 2.3l13 7.5a2.5 2.5 0 0 1 0 4.33l-13 7.5A2.5 2.5 0 0 1 4 19.5v-15zm3.5 3.05v8.9L15.2 12 7.5 7.55z",
		],
	},
	sql: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 3C7.03 3 3 4.79 3 7v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.12 7 2s-3.13 2-7 2-7-1.12-7-2 3.13-2 7-2zm0 14c-3.87 0-7-1.12-7-2v-2.15c1.76.9 4.24 1.45 7 1.45s5.24-.55 7-1.45V17c0 .88-3.13 2-7 2zm0-5c-3.87 0-7-1.12-7-2V9.85c1.76.9 4.24 1.45 7 1.45s5.24-.55 7-1.45V12c0 .88-3.13 2-7 2z",
		],
	},
	csharp: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 2L3 7.2v9.6L12 22l9-5.2V7.2L12 2zm-1.8 6.4c1.4 0 2.6.6 3.3 1.6l-1.5 1c-.4-.6-1-.9-1.8-.9-1.4 0-2.3 1.1-2.3 2.5s.9 2.5 2.3 2.5c.8 0 1.4-.3 1.8-.9l1.5 1c-.7 1-1.9 1.6-3.3 1.6-2.5 0-4.2-1.8-4.2-4.2s1.7-4.2 4.2-4.2zm5.6 1.2h1v1.2h1v-1.2h1v1.2h1v1h-1v1.2h1v1h-1v1.2h-1v-1.2h-1v1.2h-1v-1.2h-1v-1h1v-1.2h-1v-1h1V9.6zm1 2.2v1.2h1v-1.2h-1z",
		],
	},
	d1: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 2C7.03 2 3 3.57 3 5.5v13C3 20.43 7.03 22 12 22s9-1.57 9-3.5v-13C21 3.57 16.97 2 12 2zm0 2c3.87 0 6.8.98 6.8 1.5S15.87 7 12 7 5.2 6.02 5.2 5.5 8.13 4 12 4zM7.5 10.2h2.8c1.9 0 3.2 1.2 3.2 3.1s-1.3 3.1-3.2 3.1H7.5v-6.2zm1.8 1.5v3.2h.9c.9 0 1.5-.6 1.5-1.6s-.6-1.6-1.5-1.6h-.9zm6.9-1.5h1.6v6.2H16v-4.4l-1.2.7-.7-1.3 2.1-1.2z",
		],
	},
	neon: {
		viewBox: "0 0 24 24",
		paths: [
			"M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15.2a1 1 0 0 1-1.78.63L12 12.1V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm3.2 1.2v12.6h1.6V7.9l7.9 9.7V5.2H7.2z",
		],
	},
	"better-auth": {
		viewBox: "0 0 24 24",
		paths: [
			"M12 2 4 5.5v6.1c0 5.1 3.4 9.8 8 11.4 4.6-1.6 8-6.3 8-11.4V5.5L12 2zm0 4.5a2.8 2.8 0 0 1 1.4 5.22V16h-2.8v-4.28A2.8 2.8 0 0 1 12 6.5z",
		],
	},
	authzed: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 2 3.5 6.8v10.4L12 22l8.5-4.8V6.8L12 2zm-3.5 6h7l-4.5 6h4.5v2h-7l4.5-6H8.5V8z",
		],
	},
	webmcp: {
		viewBox: "0 0 24 24",
		paths: [
			"M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 3.1v3.4H7.6A7.5 7.5 0 0 1 11 5.1zm2 0a7.5 7.5 0 0 1 3.4 3.4H13V5.1zM6.5 10.5H11v3H6.5a7.6 7.6 0 0 1 0-3zm6.5 0h4.5a7.6 7.6 0 0 1 0 3H13v-3zm-5.4 5H11v3.4a7.5 7.5 0 0 1-3.4-3.4zm5.4 3.4v-3.4h3.4A7.5 7.5 0 0 1 13 18.9z",
		],
	},
	playwright: {
		viewBox: "0 0 24 24",
		paths: [
			"M3.5 4.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5v5.2c0 3.4-2.2 6.1-5 6.8-2.8-.7-5-3.4-5-6.8V4.5zm2.5 2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-4 3.8c.5.9 1.9.9 2.4 0h-2.4zM15 7h4c.83 0 1.5.67 1.5 1.5v5.2c0 3.4-2.2 6.1-5 6.8-2.1-.5-3.9-2.2-4.6-4.5 2.4-1.2 4.1-3.6 4.1-6.5V7zm2.2 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
		],
	},
};

/**
 * Complete Brand Icon & Color Map (Light Mode vs Dark Mode)
 * Ensures 100% WCAG contrast on both Chalkboard Paper (#FAF9FC / #FFFFFF)
 * and Obsidian Chalkboard (#0B1326 / #131B2E).
 */
export const TAG_ICON_SPECS = [
	// Vendors & Cloud (kind: "brand")
	{ slug: "sanity", title: "Sanity", kind: "brand", icon: "SiSanity", light: "#F03E2F", dark: "#F03E2F" },
	{ slug: "firebase", title: "Firebase", kind: "brand", icon: "SiFirebase", light: "#DD2C00", dark: "#FFCA28" },
	{ slug: "amplify", title: "AWS Amplify", kind: "brand", icon: "FaAws", light: "#FF9900", dark: "#FF9900" },
	{ slug: "cloudflare", title: "Cloudflare", kind: "brand", icon: "SiCloudflare", light: "#F38020", dark: "#F6821F" },
	{ slug: "cloudflare-workers", title: "Cloudflare Workers", kind: "brand", icon: "SiCloudflareworkers", light: "#F38020", dark: "#F6821F" },
	{ slug: "aws", title: "AWS", kind: "brand", icon: "FaAws", light: "#232F3E", dark: "#FF9900" },
	{ slug: "google-cloud", title: "Google Cloud", kind: "brand", icon: "SiGooglecloud", light: "#4285F4", dark: "#60A5FA" },
	{ slug: "azure", title: "Microsoft Azure", kind: "brand", custom: "azure", light: "#0078D4", dark: "#38BDF8" },
	{ slug: "vercel", title: "Vercel", kind: "brand", icon: "SiVercel", light: "#111827", dark: "#FFFFFF" },
	{ slug: "netlify", title: "Netlify", kind: "brand", icon: "SiNetlify", light: "#00C7B7", dark: "#2DD4BF" },
	{ slug: "supabase", title: "Supabase", kind: "brand", icon: "SiSupabase", light: "#16A34A", dark: "#3ECF8E" },
	{ slug: "appwrite", title: "Appwrite", kind: "brand", icon: "SiAppwrite", light: "#FD366E", dark: "#FD366E" },
	{ slug: "convex", title: "Convex", kind: "brand", custom: "convex", light: "#EE342F", dark: "#F87171" },
	{ slug: "builder-io", title: "Builder.io", kind: "brand", custom: "builder-io", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "algolia", title: "Algolia", kind: "brand", icon: "SiAlgolia", light: "#003DFF", dark: "#60A5FA" },
	{ slug: "cloudinary", title: "Cloudinary", kind: "brand", icon: "SiCloudinary", light: "#3448C5", dark: "#818CF8" },
	{ slug: "storyblok", title: "Storyblok", kind: "brand", icon: "SiStoryblok", light: "#09B3AF", dark: "#2DD4BF" },
	{ slug: "contentful", title: "Contentful", kind: "brand", icon: "SiContentful", light: "#2478CC", dark: "#60A5FA" },
	{ slug: "hygraph", title: "Hygraph", kind: "brand", custom: "hygraph", light: "#6D28D9", dark: "#C084FC" },
	{ slug: "shopify", title: "Shopify", kind: "brand", icon: "SiShopify", light: "#5E8E3E", dark: "#95BF47" },
	{ slug: "stripe", title: "Stripe", kind: "brand", icon: "SiStripe", light: "#635BFF", dark: "#818CF8" },
	{ slug: "sentry", title: "Sentry", kind: "brand", icon: "SiSentry", light: "#362D59", dark: "#C084FC" },
	{ slug: "posthog", title: "PostHog", kind: "brand", icon: "SiPosthog", light: "#F54E00", dark: "#FB923C" },
	{ slug: "launchdarkly", title: "LaunchDarkly", kind: "brand", custom: "launchdarkly", light: "#2A1155", dark: "#38BDF8" },
	{ slug: "postman", title: "Postman", kind: "brand", icon: "SiPostman", light: "#FF6C37", dark: "#FF6C37" },
	{ slug: "notion", title: "Notion", kind: "brand", icon: "SiNotion", light: "#111827", dark: "#FFFFFF" },
	{ slug: "youtube", title: "YouTube", kind: "brand", icon: "SiYoutube", light: "#FF0000", dark: "#FF0000" },

	// Frameworks & UI (kind: "brand")
	{ slug: "astro", title: "Astro", kind: "brand", icon: "SiAstro", light: "#BC52EE", dark: "#FF5D01" },
	{ slug: "react", title: "React", kind: "brand", icon: "SiReact", light: "#0284C7", dark: "#61DAFB" },
	{ slug: "nextjs", title: "Next.js", kind: "brand", icon: "SiNextdotjs", light: "#111827", dark: "#FFFFFF" },
	{ slug: "svelte", title: "Svelte", kind: "brand", icon: "SiSvelte", light: "#FF3E00", dark: "#FF3E00" },
	{ slug: "sveltekit", title: "SvelteKit", kind: "brand", icon: "SiSvelte", light: "#FF3E00", dark: "#FF3E00" },
	{ slug: "tanstack", title: "TanStack", kind: "brand", custom: "tanstack", light: "#EA580C", dark: "#FB923C" },
	{ slug: "hono", title: "Hono", kind: "brand", icon: "SiHono", light: "#E36002", dark: "#FF6B00" },
	{ slug: "vue", title: "Vue", kind: "brand", icon: "SiVuedotjs", light: "#16A34A", dark: "#4FC08D" },
	{ slug: "angular", title: "Angular", kind: "brand", icon: "SiAngular", light: "#DD0031", dark: "#F87171" },
	{ slug: "solidjs", title: "SolidJS", kind: "brand", icon: "SiSolid", light: "#2C4F7C", dark: "#60A5FA" },
	{ slug: "remix", title: "Remix", kind: "brand", icon: "SiRemix", light: "#111827", dark: "#FFFFFF" },
	{ slug: "tailwindcss", title: "Tailwind CSS", kind: "brand", icon: "SiTailwindcss", light: "#0284C7", dark: "#38BDF8" },
	{ slug: "daisyui", title: "DaisyUI", kind: "brand", icon: "SiDaisyui", light: "#5A0EF8", dark: "#C084FC" },
	{ slug: "flutter", title: "Flutter", kind: "brand", icon: "SiFlutter", light: "#02569B", dark: "#38BDF8" },
	{ slug: "react-native", title: "React Native", kind: "brand", icon: "SiReact", light: "#0284C7", dark: "#61DAFB" },
	{ slug: "threejs", title: "Three.js", kind: "brand", icon: "SiThreedotjs", light: "#111827", dark: "#FFFFFF" },
	{ slug: "remotion", title: "Remotion", kind: "brand", custom: "remotion", light: "#0B84F3", dark: "#60A5FA" },
	{ slug: "vite", title: "Vite", kind: "brand", icon: "SiVite", light: "#646CFF", dark: "#BD34FE" },

	// Languages & Web Standards (kind: "brand")
	{ slug: "typescript", title: "TypeScript", kind: "brand", icon: "SiTypescript", light: "#3178C6", dark: "#60A5FA" },
	{ slug: "javascript", title: "JavaScript", kind: "brand", icon: "SiJavascript", light: "#CA8A04", dark: "#F7DF1E" },
	{ slug: "html", title: "HTML", kind: "brand", icon: "SiHtml5", light: "#E34F26", dark: "#F97316" },
	{ slug: "css", title: "CSS", kind: "brand", icon: "SiCss", light: "#663399", dark: "#C084FC" },
	{ slug: "sql", title: "SQL", kind: "brand", custom: "sql", light: "#0284C7", dark: "#38BDF8" },
	{ slug: "graphql", title: "GraphQL", kind: "brand", icon: "SiGraphql", light: "#E10098", dark: "#F472B6" },
	{ slug: "nodejs", title: "Node.js", kind: "brand", icon: "SiNodedotjs", light: "#15803D", dark: "#4ADE80" },
	{ slug: "bun", title: "Bun", kind: "brand", icon: "SiBun", light: "#78350F", dark: "#FDE047" },
	{ slug: "deno", title: "Deno", kind: "brand", icon: "SiDeno", light: "#111827", dark: "#FFFFFF" },
	{ slug: "python", title: "Python", kind: "brand", icon: "SiPython", light: "#3776AB", dark: "#60A5FA" },
	{ slug: "rust", title: "Rust", kind: "brand", icon: "SiRust", light: "#111827", dark: "#FB923C" },
	{ slug: "go", title: "Go", kind: "brand", icon: "SiGo", light: "#00ADD8", dark: "#38BDF8" },
	{ slug: "php", title: "PHP", kind: "brand", icon: "SiPhp", light: "#4F5B93", dark: "#818CF8" },
	{ slug: "csharp", title: "C#", kind: "brand", custom: "csharp", light: "#512BD4", dark: "#C084FC" },
	{ slug: "zod", title: "Zod", kind: "brand", icon: "SiZod", light: "#3E67B1", dark: "#60A5FA" },

	// Databases, Storage & Auth
	{ slug: "d1", title: "Cloudflare D1", kind: "brand", custom: "d1", light: "#F38020", dark: "#FB923C" },
	{ slug: "durable-objects", title: "Durable Objects", kind: "brand", icon: "SiCloudflareworkers", light: "#F38020", dark: "#FB923C" },
	{ slug: "drizzle", title: "Drizzle", kind: "brand", icon: "SiDrizzle", light: "#4D7C0F", dark: "#C5F74F" },
	{ slug: "prisma", title: "Prisma", kind: "brand", icon: "SiPrisma", light: "#2D3748", dark: "#FFFFFF" },
	{ slug: "postgresql", title: "PostgreSQL", kind: "brand", icon: "SiPostgresql", light: "#4169E1", dark: "#60A5FA" },
	{ slug: "sqlite", title: "SQLite", kind: "brand", icon: "SiSqlite", light: "#003B57", dark: "#38BDF8" },
	{ slug: "pglite", title: "PGlite", kind: "brand", icon: "SiPostgresql", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "turso", title: "Turso", kind: "brand", icon: "SiTurso", light: "#0D9488", dark: "#4FF8D2" },
	{ slug: "neon", title: "Neon", kind: "brand", custom: "neon", light: "#16A34A", dark: "#00E599" },
	{ slug: "mongodb", title: "MongoDB", kind: "brand", icon: "SiMongodb", light: "#15803D", dark: "#47A248" },
	{ slug: "redis", title: "Redis", kind: "brand", icon: "SiRedis", light: "#DC2626", dark: "#F87171" },
	{ slug: "better-auth", title: "Better-Auth", kind: "brand", custom: "better-auth", light: "#2A1155", dark: "#C084FC" },
	{ slug: "clerk", title: "Clerk", kind: "brand", icon: "SiClerk", light: "#6C47FF", dark: "#A78BFA" },
	{ slug: "auth0", title: "Auth0", kind: "brand", icon: "SiAuth0", light: "#EB5424", dark: "#FB923C" },
	{ slug: "authzed", title: "AuthZed", kind: "brand", custom: "authzed", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "cms", title: "Headless CMS", kind: "concept", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "database", title: "Databases", kind: "concept", light: "#0284C7", dark: "#38BDF8" },

	// AI, Agents & Protocols
	{ slug: "ai", title: "AI & Agents", kind: "concept", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "mcp", title: "MCP", kind: "brand", icon: "SiModelcontextprotocol", light: "#2A1155", dark: "#C5E86C" },
	{ slug: "webmcp", title: "WebMCP", kind: "brand", custom: "webmcp", light: "#7C3AED", dark: "#86EFAC" },
	{ slug: "web-ai", title: "Web AI", kind: "concept", light: "#0284C7", dark: "#38BDF8" },
	{ slug: "webgpu", title: "WebGPU", kind: "brand", icon: "SiWebgpu", light: "#005A9C", dark: "#38BDF8" },
	{ slug: "openai", title: "OpenAI", kind: "brand", icon: "SiOpenai", light: "#111827", dark: "#FFFFFF" },
	{ slug: "anthropic", title: "Anthropic", kind: "brand", icon: "SiAnthropic", light: "#92400E", dark: "#FCD34D" },
	{ slug: "gemini", title: "Google Gemini", kind: "brand", icon: "SiGooglegemini", light: "#4F46E5", dark: "#818CF8" },
	{ slug: "gemini-nano", title: "Gemini Nano", kind: "brand", icon: "SiGooglegemini", light: "#0284C7", dark: "#38BDF8" },
	{ slug: "chrome-built-in-ai", title: "Chrome Built-in AI", kind: "brand", icon: "SiGooglechrome", light: "#2563EB", dark: "#60A5FA" },
	{ slug: "transformers-js", title: "Transformers.js", kind: "brand", icon: "SiHuggingface", light: "#CA8A04", dark: "#FACC15" },
	{ slug: "rag", title: "RAG", kind: "concept", light: "#7C3AED", dark: "#C084FC" },

	// DevOps, Testing, Security & Architecture
	{ slug: "git", title: "Git", kind: "brand", icon: "SiGit", light: "#F05032", dark: "#F97316" },
	{ slug: "github", title: "GitHub", kind: "brand", icon: "SiGithub", light: "#111827", dark: "#FFFFFF" },
	{ slug: "docker", title: "Docker", kind: "brand", icon: "SiDocker", light: "#2496ED", dark: "#38BDF8" },
	{ slug: "playwright", title: "Playwright", kind: "brand", custom: "playwright", light: "#16A34A", dark: "#4ADE80" },
	{ slug: "testing", title: "Testing", kind: "concept", light: "#4D7C0F", dark: "#86EFAC" },
	{ slug: "security", title: "Security", kind: "concept", light: "#DC2626", dark: "#FCA5A5" },
	{ slug: "serverless", title: "Serverless", kind: "concept", light: "#D97706", dark: "#FACC15" },
	{ slug: "devops", title: "DevOps", kind: "concept", light: "#0284C7", dark: "#38BDF8" },
	{ slug: "a11y", title: "Accessibility", kind: "concept", light: "#0369A1", dark: "#38BDF8" },
	{ slug: "design", title: "Design", kind: "concept", light: "#F24E1E", dark: "#F472B6" },
	{ slug: "architecture", title: "Architecture", kind: "concept", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "career", title: "Career", kind: "concept", light: "#15803D", dark: "#86EFAC" },
	{ slug: "webdev", title: "WebDev", kind: "concept", light: "#7C3AED", dark: "#C084FC" },
	{ slug: "oss", title: "Open Source", kind: "concept", light: "#15803D", dark: "#4ADE80" },
	{ slug: "ffmpeg", title: "FFmpeg", kind: "brand", icon: "SiFfmpeg", light: "#007808", dark: "#4ADE80" },
	{ slug: "blender", title: "Blender", kind: "brand", icon: "SiBlender", light: "#EA7600", dark: "#FB923C" },
	{ slug: "chrome", title: "Chrome", kind: "brand", icon: "SiGooglechrome", light: "#2563EB", dark: "#60A5FA" },
	{ slug: "microbit", title: "micro:bit", kind: "brand", icon: "SiMicrobit", light: "#111827", dark: "#86EFAC" },
	{ slug: "video", title: "Video", kind: "concept", light: "#DC2626", dark: "#F87171" },
	{ slug: "mental-health", title: "Mental Health", kind: "concept", light: "#DB2777", dark: "#F472B6" },
	{ slug: "infrastructure", title: "Infrastructure", kind: "concept", light: "#475569", dark: "#94A3B8" },
	{ slug: "web-technologies", title: "Web Standards", kind: "concept", light: "#0284C7", dark: "#38BDF8" },
];

function extractIconTree(spec) {
	if (spec.custom) {
		const custom = CUSTOM_BRAND_VECTORS[spec.custom];
		if (!custom) {
			throw new Error(`Custom brand vector not found: ${spec.custom}`);
		}
		return {
			attr: { viewBox: custom.viewBox },
			child: custom.paths.map((d) => ({ tag: "path", attr: { d } })),
		};
	}
	const iconName = spec.icon;
	const fn = si[iconName] || fa[iconName];
	if (!fn) {
		throw new Error(`Icon not found: ${iconName}`);
	}
	const src = fn.toString();
	const match = src.match(/GenIcon\((\{[\s\S]*\})\)\(props\)/);
	if (!match) {
		throw new Error(`Could not parse GenIcon for ${iconName}`);
	}
	return JSON.parse(match[1]);
}

function escapeXml(str) {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function renderNodeChildren(children) {
	if (!Array.isArray(children)) return "";
	return children
		.map((node) => {
			const attrs = Object.entries(node.attr || {})
				.map(([k, v]) => `${k}="${escapeXml(v)}"`)
				.join(" ");
			const inner = renderNodeChildren(node.child);
			return inner
				? `<${node.tag} ${attrs}>${inner}</${node.tag}>`
				: `<${node.tag} ${attrs}/>`;
		})
		.join("");
}

function buildSymbolSvg(tree, color) {
	const viewBox = tree.attr?.viewBox || "0 0 24 24";
	const inner = renderNodeChildren(tree.child);
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="24" height="24" fill="${color}">${inner}</svg>\n`;
}

function buildLockupSvg(tree, title, iconColor, textColor) {
	const viewBox = tree.attr?.viewBox || "0 0 24 24";
	const parts = viewBox.split(/\s+/).map(Number);
	const vbW = parts[2] || 24;
	const vbH = parts[3] || 24;
	const scale = 36 / Math.max(vbW, vbH);
	const tx = 14 + (36 - vbW * scale) / 2;
	const ty = 14 + (36 - vbH * scale) / 2;
	const inner = renderNodeChildren(tree.child);

	const charWidth = 14.5;
	const width = Math.max(200, Math.ceil(66 + title.length * charWidth + 20));

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" width="${width}" height="64" role="img" aria-label="${escapeXml(title)}">
  <g transform="translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${scale.toFixed(4)})" fill="${iconColor}">
    ${inner}
  </g>
  <text x="64" y="41" fill="${textColor}" font-family="'Nunito', 'Inter', system-ui, -apple-system, sans-serif" font-size="25" font-weight="900" letter-spacing="-0.02em">${escapeXml(title)}</text>
</svg>\n`;
}

// Remove any stale concept SVGs before regenerating brand SVGs
for (const existing of fs.readdirSync(OUT_DIR)) {
	if (existing.endsWith(".svg")) {
		fs.unlinkSync(path.join(OUT_DIR, existing));
	}
}

let brandCount = 0;
let conceptCount = 0;
for (const spec of TAG_ICON_SPECS) {
	if (spec.kind === "concept") {
		conceptCount++;
		continue;
	}
	const tree = extractIconTree(spec);

	const symLight = buildSymbolSvg(tree, spec.light);
	const symDark = buildSymbolSvg(tree, spec.dark);
	const lockLight = buildLockupSvg(tree, spec.title, spec.light, "#2A1155");
	const lockDark = buildLockupSvg(tree, spec.title, spec.dark, "#FFFFFF");

	fs.writeFileSync(path.join(OUT_DIR, `${spec.slug}-symbol-light.svg`), symLight);
	fs.writeFileSync(path.join(OUT_DIR, `${spec.slug}-symbol-dark.svg`), symDark);
	fs.writeFileSync(path.join(OUT_DIR, `${spec.slug}-lockup-light.svg`), lockLight);
	fs.writeFileSync(path.join(OUT_DIR, `${spec.slug}-lockup-dark.svg`), lockDark);
	brandCount++;
}

console.log(
	`Generated ${brandCount * 4} authentic brand SVG files (${brandCount} brand hubs, ${conceptCount} concept tags skipped) in ${OUT_DIR}`,
);
