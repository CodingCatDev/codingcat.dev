/**
 * Canonical Vendor & Topic Registry for CodingCat.dev Topic Hubs (`/topics` & `/topic/[slug]`).
 *
 * Uses official light/dark vendor logos from `/public/logos/` (never legacy icons).
 */

export interface TopicDefinition {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	badge: string;
	/** Light-mode logo path (for Chalkboard Paper `#FDFBF7`) */
	logoLight?: string;
	/** Dark-mode logo path (for Obsidian Chalkboard `#0B1326`) */
	logoDark?: string;
	/** Compact symbol/icon path for filter pills */
	symbolLight?: string;
	symbolDark?: string;
	/** Optional partner/vendor URL (automatically routed through partner-links) */
	partnerUrl?: string;
	partnerCtaLabel?: string;
	/** Keywords used to match Courses, Podcasts, and Blog Posts in Sanity */
	keywords: string[];
	/** Hand-drawn architecture diagram nodes for the topic hub */
	diagram: {
		title: string;
		caption: string;
		nodes: Array<{
			id: string;
			badge: string;
			label: string;
			sublabel: string;
			color: "purple" | "blue" | "green" | "yellow" | "orange";
			status?: "good" | "bad";
		}>;
		edges: Array<{ from: string; to: string; label?: string }>;
	};
}

export const TOPICS: TopicDefinition[] = [
	{
		slug: "sanity",
		title: "Sanity",
		tagline: "Content Operating System, GROQ & Content Releases",
		description:
			"Explore courses, podcast episodes, and blog posts on Sanity Studio, GROQ queries, Content Releases, Portable Text, Live Content API, and AI agent context.",
		badge: "⚡ Official Partner & Vendor Hub",
		logoLight: "/logos/sanity/Sanity-Full_logo--black_on_transparent.svg",
		logoDark: "/logos/sanity/Sanity-Full_logo--white_on_transparent.svg",
		symbolLight: "/logos/sanity/Sanity-Symbol--black_on_transparent.svg",
		symbolDark: "/logos/sanity/Sanity-Symbol--white_on_transparent.svg",
		partnerUrl: "https://www.sanity.io/manage?coupon=CodingCatDev",
		partnerCtaLabel: "Start with Sanity (?coupon=CodingCatDev)",
		keywords: [
			"sanity",
			"groq",
			"portable text",
			"content lake",
			"content releases",
		],
		diagram: {
			title: "Sanity Content Operating System Diagram",
			caption:
				"Structured schemas in Sanity Studio queried via GROQ & Content Releases to edge runtimes.",
			nodes: [
				{
					id: "studio",
					badge: "Schema",
					label: "Sanity Studio",
					sublabel: "TypeScript & Releases",
					color: "purple",
				},
				{
					id: "lake",
					badge: "Content Lake",
					label: "GROQ & Perspectives",
					sublabel: "✓ Live CDN & Versions",
					color: "blue",
					status: "good",
				},
				{
					id: "edge",
					badge: "Delivery",
					label: "Astro + AI Agents",
					sublabel: "✓ Sub-50ms edge SSR",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "studio", to: "lake", label: "sync" },
				{ from: "lake", to: "edge", label: "✓ query" },
			],
		},
	},
	{
		slug: "firebase",
		title: "Firebase",
		tagline: "Firestore, Genkit AI, App Hosting & Data Connect",
		description:
			"Hands-on tutorials, courses, and podcast episodes covering Firebase Authentication, Cloud Firestore, Firebase Genkit, App Hosting, and PostgreSQL Data Connect.",
		badge: "🔥 Cloud & Full-Stack Hub",
		logoLight: "/logos/firebase/firebase-lockup-light.svg",
		logoDark: "/logos/firebase/firebase-lockup-dark.svg",
		symbolLight: "/logos/firebase/firebase-symbol.png",
		symbolDark: "/logos/firebase/firebase-symbol.png",
		keywords: [
			"firebase",
			"firestore",
			"genkit",
			"google cloud",
			"angularfire",
			"rxfire",
		],
		diagram: {
			title: "Firebase Full-Stack Architecture Diagram",
			caption:
				"Client authentication, real-time Firestore/Data Connect, and Genkit AI flows.",
			nodes: [
				{
					id: "auth",
					badge: "Identity",
					label: "Firebase Auth",
					sublabel: "OAuth & Passkeys",
					color: "yellow",
				},
				{
					id: "data",
					badge: "Database",
					label: "Firestore & Data Connect",
					sublabel: "✓ Real-time & SQL",
					color: "blue",
					status: "good",
				},
				{
					id: "genkit",
					badge: "AI & Edge",
					label: "Genkit + App Hosting",
					sublabel: "✓ Typed AI flows",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "auth", to: "data", label: "security rules" },
				{ from: "data", to: "genkit", label: "✓ stream" },
			],
		},
	},
	{
		slug: "amplify",
		title: "AWS Amplify",
		tagline: "Full-Stack TypeScript, AppSync, Cognito & S3 on AWS",
		description:
			"Build and deploy scalable cloud backends with AWS Amplify Gen 2, Amazon Cognito authentication, AppSync GraphQL, DynamoDB, and S3 storage.",
		badge: "☁️ AWS Cloud Hub",
		logoLight: "/logos/amplify/amplify.svg",
		logoDark: "/logos/amplify/amplify.svg",
		symbolLight: "/logos/amplify/amplify.svg",
		symbolDark: "/logos/amplify/amplify.svg",
		keywords: ["amplify", "aws", "cognito", "appsync", "dynamodb", "s3"],
		diagram: {
			title: "AWS Amplify Full-Stack Diagram",
			caption:
				"Code-first TypeScript backend provisioning Cognito, AppSync, and DynamoDB.",
			nodes: [
				{
					id: "code",
					badge: "Gen 2",
					label: "amplify/backend.ts",
					sublabel: "TypeScript definitions",
					color: "orange",
				},
				{
					id: "cognito",
					badge: "Auth & API",
					label: "Cognito + AppSync",
					sublabel: "✓ Real-time GraphQL",
					color: "purple",
					status: "good",
				},
				{
					id: "dynamo",
					badge: "Storage",
					label: "DynamoDB & S3",
					sublabel: "✓ Per-developer sandbox",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "code", to: "cognito", label: "deploy" },
				{ from: "cognito", to: "dynamo", label: "✓ persist" },
			],
		},
	},
	{
		slug: "astro",
		title: "Astro",
		tagline: "Islands Architecture, Server Islands & Content Collections",
		description:
			"Zero-JS-by-default web architecture with Astro, Server Islands, Cloudflare Workers SSR, and Sanity Content Lake integration.",
		badge: "🚀 Web Framework Hub",
		keywords: ["astro", "islands", "view transitions", "starlight"],
		diagram: {
			title: "Astro Islands & Edge SSR Diagram",
			caption:
				"Static HTML shell with selective client hydration and dynamic Server Islands.",
			nodes: [
				{
					id: "shell",
					badge: "Zero JS",
					label: "Static HTML Shell",
					sublabel: "Instant First Paint",
					color: "purple",
				},
				{
					id: "island",
					badge: "Server Island",
					label: "server:defer",
					sublabel: "✓ Personalized edge data",
					color: "blue",
					status: "good",
				},
				{
					id: "client",
					badge: "Interactive",
					label: "client:visible",
					sublabel: "✓ Hydrate only when needed",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "shell", to: "island", label: "stream" },
				{ from: "island", to: "client", label: "✓ fast LCP" },
			],
		},
	},
	{
		slug: "cloudflare",
		title: "Cloudflare",
		tagline: "Workers, KV, D1, R2, AI Gateway & Edge Security",
		description:
			"Deploy globally distributed applications, MCP servers, and edge APIs on Cloudflare Workers, KV, D1, and R2.",
		badge: "🌐 Edge Runtime Hub",
		keywords: ["cloudflare", "workers", "wrangler", "edge", "kv", "d1"],
		diagram: {
			title: "Cloudflare Edge Worker Diagram",
			caption:
				"Global anycast routing to V8 isolates with KV cache and Sanity origin fetch.",
			nodes: [
				{
					id: "req",
					badge: "Anycast",
					label: "Edge Request",
					sublabel: "300+ global PoPs",
					color: "yellow",
				},
				{
					id: "worker",
					badge: "Isolate",
					label: "Cloudflare Worker",
					sublabel: "✓ 0ms cold start",
					color: "purple",
					status: "good",
				},
				{
					id: "kv",
					badge: "State",
					label: "KV / D1 / R2",
					sublabel: "✓ Edge persistence",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "req", to: "worker", label: "route" },
				{ from: "worker", to: "kv", label: "✓ read/write" },
			],
		},
	},
	{
		slug: "svelte",
		title: "Svelte & SvelteKit",
		tagline: "Runes, Fine-Grained Reactivity & Full-Stack SvelteKit",
		description:
			"Learn Svelte 5 Runes, SvelteKit server load functions, form actions, and full-stack deployment through courses, podcasts, and blog posts.",
		badge: "⚡ Reactive UI Hub",
		keywords: ["svelte", "sveltekit", "runes", "rich harris"],
		diagram: {
			title: "SvelteKit Full-Stack Data Flow Diagram",
			caption:
				"Server load functions, progressive form actions, and fine-grained Rune reactivity.",
			nodes: [
				{
					id: "load",
					badge: "Server",
					label: "+page.server.ts",
					sublabel: "Typed load & actions",
					color: "purple",
				},
				{
					id: "runes",
					badge: "Reactivity",
					label: "$state & $derived",
					sublabel: "✓ Compiler-driven updates",
					color: "blue",
					status: "good",
				},
				{
					id: "dom",
					badge: "UI",
					label: "Surgical DOM Patch",
					sublabel: "✓ Zero VDOM overhead",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "load", to: "runes", label: "hydrate" },
				{ from: "runes", to: "dom", label: "✓ update" },
			],
		},
	},
	{
		slug: "ai",
		title: "AI & MCP Agents",
		tagline: "Model Context Protocol, WebMCP, Agent Skills & AEO",
		description:
			"Architect production AI coding agents, Model Context Protocol (MCP) servers, WebMCP tools, and Answer Engine Optimization (AEO).",
		badge: "🤖 AI & Agentic Web Hub",
		keywords: [
			"ai",
			"mcp",
			"agent",
			"llm",
			"gemini",
			"openai",
			"claude",
			"anthropic",
			"rag",
		],
		diagram: {
			title: "Model Context Protocol (MCP) Architecture Diagram",
			caption:
				"Autonomous agents discovering tools via /.well-known/mcp and executing typed JSON-RPC calls.",
			nodes: [
				{
					id: "agent",
					badge: "Client",
					label: "AI Coding Agent",
					sublabel: "Claude / Gemini / Cursor",
					color: "purple",
				},
				{
					id: "mcp",
					badge: "Protocol",
					label: "Streamable HTTP MCP",
					sublabel: "✓ tools/list & tools/call",
					color: "blue",
					status: "good",
				},
				{
					id: "context",
					badge: "Context",
					label: "Sanity + Design Tokens",
					sublabel: "✓ Verified ground truth",
					color: "green",
					status: "good",
				},
			],
			edges: [
				{ from: "agent", to: "mcp", label: "JSON-RPC" },
				{ from: "mcp", to: "context", label: "✓ ground" },
			],
		},
	},
];

export const TOPICS_BY_SLUG: Record<string, TopicDefinition> =
	Object.fromEntries(TOPICS.map((t) => [t.slug, t]));

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
	const normalized = slug.trim().toLowerCase();
	return TOPICS_BY_SLUG[normalized];
}

export function itemMatchesTopic(
	title: string | null | undefined,
	excerpt: string | null | undefined,
	topic: TopicDefinition,
): boolean {
	const hay = `${title ?? ""} ${excerpt ?? ""}`.toLowerCase();
	return topic.keywords.some((kw) => hay.includes(kw.toLowerCase()));
}

export function matchTopicsForText(
	textOrTitle?: string | null,
	excerpt?: string | null,
): TopicDefinition[] {
	const hay = `${textOrTitle ?? ""} ${excerpt ?? ""}`.toLowerCase();
	return TOPICS.filter((topic) =>
		topic.keywords.some((kw) => hay.includes(kw.toLowerCase())),
	);
}
