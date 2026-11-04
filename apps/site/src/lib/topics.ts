/**
 * Canonical Vendor, Framework, Language & Topic Registry for CodingCat.dev
 * (`/topics`, `/topic/[slug]`, `/courses`, `/blog`, `/podcasts`, and Tag Pills).
 *
 * Uses official light/dark vendor logos from `/public/logos/` (`sanity`, `firebase`, `amplify`)
 * and self-hosted light/dark SVG symbols & lockups in `/public/logos/tags/`.
 */

export type TopicCategory =
	| "vendors"
	| "frameworks"
	| "languages"
	| "data"
	| "ai"
	| "devops";

export interface TopicCategoryMeta {
	id: TopicCategory;
	label: string;
	shortLabel: string;
	badge: string;
}

export const TOPIC_CATEGORIES: TopicCategoryMeta[] = [
	{
		id: "vendors",
		label: "Cloud & Vendor Hubs",
		shortLabel: "Vendors & Cloud",
		badge: "☁️ Cloud & Vendors",
	},
	{
		id: "frameworks",
		label: "Frontend & Full-Stack Frameworks",
		shortLabel: "Frameworks & UI",
		badge: "🚀 Frameworks & UI",
	},
	{
		id: "languages",
		label: "Programming Languages & Standards",
		shortLabel: "Languages",
		badge: "⌨️ Languages & Web",
	},
	{
		id: "data",
		label: "Databases, Storage & Auth",
		shortLabel: "Data & Auth",
		badge: "🗄️ Data & Auth",
	},
	{
		id: "ai",
		label: "AI, Agents & Protocols",
		shortLabel: "AI & MCP",
		badge: "🤖 AI & Agents",
	},
	{
		id: "devops",
		label: "DevOps, Testing, Security & Career",
		shortLabel: "DevOps & Security",
		badge: "🛡️ DevOps & Career",
	},
];

export interface TopicDiagram {
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
}

export interface TopicDefinition {
	slug: string;
	title: string;
	category: TopicCategory;
	featured?: boolean;
	aliases?: string[];
	tagline: string;
	description: string;
	badge: string;
	/** Light-mode logo path (for Chalkboard Paper `#FAF9FC`) */
	logoLight: string;
	/** Dark-mode logo path (for Obsidian Chalkboard `#0B1326`) */
	logoDark: string;
	/** Compact symbol/icon path for filter pills */
	symbolLight: string;
	symbolDark: string;
	/** Optional partner/vendor URL (automatically routed through partner-links) */
	partnerUrl?: string;
	partnerCtaLabel?: string;
	/** Keywords used to match Courses, Lessons, Podcasts, and Blog Posts in Sanity */
	keywords: string[];
	/** Hand-drawn architecture diagram nodes for the topic hub */
	diagram: TopicDiagram;
}

function defaultLogos(slug: string) {
	return {
		logoLight: `/logos/tags/${slug}-lockup-light.svg`,
		logoDark: `/logos/tags/${slug}-lockup-dark.svg`,
		symbolLight: `/logos/tags/${slug}-symbol-light.svg`,
		symbolDark: `/logos/tags/${slug}-symbol-dark.svg`,
	};
}

function defaultDiagram(
	title: string,
	step1Label: string,
	step1Sub: string,
	step2Label: string,
	step2Sub: string,
	step3Label: string,
	step3Sub: string,
): TopicDiagram {
	return {
		title: `${title} Production Architecture Diagram`,
		caption: `How ${title} fits into a modern, type-safe full-stack production architecture on CodingCat.dev.`,
		nodes: [
			{
				id: "n1",
				badge: "Input & Schema",
				label: step1Label,
				sublabel: step1Sub,
				color: "purple",
			},
			{
				id: "n2",
				badge: title,
				label: step2Label,
				sublabel: `✓ ${step2Sub}`,
				color: "blue",
				status: "good",
			},
			{
				id: "n3",
				badge: "Production",
				label: step3Label,
				sublabel: `✓ ${step3Sub}`,
				color: "green",
				status: "good",
			},
		],
		edges: [
			{ from: "n1", to: "n2", label: "configure" },
			{ from: "n2", to: "n3", label: "✓ ship" },
		],
	};
}

interface RawTopicSeed {
	slug: string;
	title: string;
	category: TopicCategory;
	featured?: boolean;
	aliases?: string[];
	tagline: string;
	description?: string;
	badge?: string;
	logoLight?: string;
	logoDark?: string;
	symbolLight?: string;
	symbolDark?: string;
	partnerUrl?: string;
	partnerCtaLabel?: string;
	keywords: string[];
	diagram?: TopicDiagram;
	diagramSteps?: [string, string, string, string, string, string];
}

const RAW_TOPICS: RawTopicSeed[] = [
	// =========================================================================
	// 1. VENDORS & CLOUD HUBS
	// =========================================================================
	{
		slug: "sanity",
		title: "Sanity",
		category: "vendors",
		featured: true,
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
		category: "vendors",
		featured: true,
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
			"angularfire",
			"rxfire",
			"data connect",
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
		category: "vendors",
		featured: true,
		aliases: ["aws-amplify"],
		tagline: "Full-Stack TypeScript, AppSync, Cognito & S3 on AWS",
		description:
			"Build and deploy scalable cloud backends with AWS Amplify Gen 2, Amazon Cognito authentication, AppSync GraphQL, DynamoDB, and S3 storage.",
		badge: "☁️ AWS Cloud Hub",
		logoLight: "/logos/amplify/amplify.svg",
		logoDark: "/logos/amplify/amplify.svg",
		symbolLight: "/logos/amplify/amplify.svg",
		symbolDark: "/logos/amplify/amplify.svg",
		keywords: ["amplify", "cognito", "appsync", "dynamodb"],
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
		slug: "cloudflare",
		title: "Cloudflare",
		category: "vendors",
		featured: true,
		tagline: "Workers, KV, D1, R2, AI Gateway & Edge Security",
		description:
			"Deploy globally distributed applications, MCP servers, and edge APIs on Cloudflare Workers, KV, D1, Durable Objects, and R2.",
		badge: "🌐 Edge Runtime Hub",
		keywords: [
			"cloudflare",
			"workers",
			"wrangler",
			"edge",
			"kv",
			"d1",
			"durable objects",
		],
		diagram: {
			title: "Cloudflare Edge Worker Diagram",
			caption:
				"Global anycast routing to V8 isolates with KV/D1 state and Sanity origin fetch.",
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
		slug: "cloudflare-workers",
		title: "Cloudflare Workers",
		category: "vendors",
		aliases: ["workers"],
		tagline: "V8 Isolates, Zero Cold Starts & WinterCG Fetch APIs",
		keywords: ["cloudflare workers", "wrangler.jsonc", "v8 isolate", "workerd"],
		diagramSteps: [
			"wrangler.jsonc",
			"Typed Env Bindings",
			"V8 Isolate Runtime",
			"< 5ms Global Execution",
			"D1 + R2 + Queues",
			"Zero-Egress Edge I/O",
		],
	},
	{
		slug: "aws",
		title: "AWS",
		category: "vendors",
		featured: true,
		aliases: ["amazon-web-services"],
		tagline: "Lambda, Bedrock, S3, DynamoDB, CDK & Cloud Architecture",
		keywords: [
			"aws",
			"amazon web services",
			"lambda",
			"bedrock",
			"dynamodb",
			"s3",
			"cdk",
			"cloudformation",
		],
		diagramSteps: [
			"AWS CDK / TypeScript",
			"Infrastructure as Code",
			"Lambda + Bedrock",
			"Serverless Compute & AI",
			"DynamoDB & S3",
			"Multi-AZ Durability",
		],
	},
	{
		slug: "google-cloud",
		title: "Google Cloud",
		category: "vendors",
		aliases: ["gcp"],
		tagline: "Cloud Run, Vertex AI, BigQuery & Global Infrastructure",
		keywords: ["google cloud", "gcp", "cloud run", "vertex ai", "bigquery"],
		diagramSteps: [
			"Container / Source",
			"Cloud Build CI",
			"Cloud Run + Vertex AI",
			"Auto-Scaling Compute",
			"BigQuery & Cloud SQL",
			"Managed Analytics",
		],
	},
	{
		slug: "azure",
		title: "Microsoft Azure",
		category: "vendors",
		aliases: ["microsoft-azure"],
		tagline: "Azure Functions, Static Web Apps, Cosmos DB & OpenAI Service",
		keywords: ["azure", "microsoft azure", "cosmos db", "static web apps"],
		diagramSteps: [
			"GitHub Actions CI",
			"Azure Bicep / CLI",
			"Azure Functions",
			"Event-Driven Compute",
			"Cosmos DB",
			"Global Distribution",
		],
	},
	{
		slug: "vercel",
		title: "Vercel",
		category: "vendors",
		tagline: "Frontend Cloud, Edge Middleware, Turborepo & v0",
		keywords: ["vercel", "turborepo", "v0.dev", "next.js deployment"],
		diagramSteps: [
			"Git Push Preview",
			"Turborepo Remote Cache",
			"Edge Middleware",
			"Global Routing",
			"Serverless Functions",
			"ISR & Streaming SSR",
		],
	},
	{
		slug: "netlify",
		title: "Netlify",
		category: "vendors",
		tagline: "Edge Functions, Deploy Previews & Composable Web Platform",
		keywords: ["netlify", "netlify edge", "netlify functions"],
		diagramSteps: [
			"Git Branch Deploy",
			"Atomic Builds",
			"Netlify Edge Functions",
			"Deno Isolate Runtime",
			"Global CDN Cache",
			"Instant Rollbacks",
		],
	},
	{
		slug: "supabase",
		title: "Supabase",
		category: "vendors",
		tagline: "Open-Source Postgres Backend, Row-Level Security & Realtime",
		keywords: ["supabase", "pgvector", "row level security"],
		diagramSteps: [
			"Supabase Auth",
			"JWT Claims",
			"Postgres + RLS",
			"Row-Level Security",
			"Realtime + pgvector",
			"Live Subscriptions",
		],
	},
	{
		slug: "appwrite",
		title: "Appwrite",
		category: "vendors",
		tagline: "Open-Source Backend Server for Web, Mobile & Flutter",
		keywords: ["appwrite"],
		diagramSteps: [
			"Client SDK",
			"Auth & Sessions",
			"Appwrite Server",
			"Permissions & Functions",
			"Databases & Storage",
			"Self-Hosted or Cloud",
		],
	},
	{
		slug: "convex",
		title: "Convex",
		category: "vendors",
		tagline: "Reactive TypeScript Backend-as-a-Service & Real-Time Queries",
		keywords: ["convex", "convex.dev"],
		diagramSteps: [
			"convex/schema.ts",
			"End-to-End TypeScript",
			"Reactive Queries",
			"Deterministic Transactions",
			"useQuery() Client",
			"Automatic Live Sync",
		],
	},
	{
		slug: "builder-io",
		title: "Builder.io",
		category: "vendors",
		aliases: ["builder.io", "qwik"],
		tagline: "Visual Headless CMS, Qwik Resumability & Partytown",
		keywords: ["builder.io", "qwik", "mitosis", "partytown"],
		diagramSteps: [
			"Registered Components",
			"Design System Tokens",
			"Builder Visual Editor",
			"Structured JSON Layout",
			"Edge SSR Delivery",
			"Zero-Hydration Overhead",
		],
	},
	{
		slug: "algolia",
		title: "Algolia",
		category: "vendors",
		tagline: "Sub-20ms Hosted Search, InstantSearch UI & AI NeuralSearch",
		keywords: ["algolia", "instantsearch", "docsearch"],
		diagramSteps: [
			"Content Webhook",
			"Index Records",
			"Algolia Search Engine",
			"Typo-Tolerant Ranking",
			"InstantSearch UI",
			"Sub-20ms Query Results",
		],
	},
	{
		slug: "cloudinary",
		title: "Cloudinary",
		category: "vendors",
		tagline: "Programmable Media, AVIF/WebP Optimization & Video Streaming",
		keywords: ["cloudinary"],
		diagramSteps: [
			"Source Image / Video",
			"Upload API",
			"URL Transformations",
			"f_auto, q_auto, c_fill",
			"Multi-CDN Delivery",
			"Optimal AVIF / WebP",
		],
	},
	{
		slug: "storyblok",
		title: "Storyblok",
		category: "vendors",
		tagline: "Component-Based Headless CMS & Real-Time Visual Editor",
		keywords: ["storyblok"],
		diagramSteps: [
			"Blok Schema",
			"Nestable Components",
			"Storyblok Visual Bridge",
			"Live Preview Editing",
			"CDN Content API",
			"Astro / SvelteKit Render",
		],
	},
	{
		slug: "contentful",
		title: "Contentful",
		category: "vendors",
		tagline: "Composable Content Platform, Content Graph & GraphQL APIs",
		keywords: ["contentful"],
		diagramSteps: [
			"Content Model",
			"Structured Types",
			"Contentful Delivery API",
			"REST & GraphQL CDN",
			"Web Webhook Sync",
			"Typed Frontend Render",
		],
	},
	{
		slug: "hygraph",
		title: "Hygraph",
		category: "vendors",
		tagline: "Federated GraphQL Content Platform & Remote Sources",
		keywords: ["hygraph", "graphcms"],
		diagramSteps: [
			"GraphQL Content Schema",
			"Remote Source Fields",
			"Hygraph Content API",
			"Federated GraphQL",
			"Edge Cache Layer",
			"Single Query Payload",
		],
	},
	{
		slug: "shopify",
		title: "Shopify",
		category: "vendors",
		tagline: "Headless Storefront API, Hydrogen & Oxygen Edge Commerce",
		keywords: ["shopify", "hydrogen", "storefront api"],
		diagramSteps: [
			"Shopify Catalog",
			"Products & Carts",
			"Storefront GraphQL API",
			"Sub-50ms Edge Cache",
			"Custom Storefront",
			"High-Conversion Checkout",
		],
	},
	{
		slug: "stripe",
		title: "Stripe",
		category: "vendors",
		tagline: "SaaS Billing, Checkout, Idempotent Webhooks & Entitlements",
		keywords: ["stripe", "stripe billing", "stripe webhooks"],
		diagramSteps: [
			"Stripe Checkout",
			"Customer + Subscription",
			"Signed Webhook Event",
			"verifyHeader() Check",
			"D1 Entitlements Sync",
			"Idempotent Access Grant",
		],
	},
	{
		slug: "sentry",
		title: "Sentry",
		category: "vendors",
		tagline: "Full-Stack Error Tracking, Distributed Tracing & Session Replay",
		keywords: ["sentry", "sentry.io"],
		diagramSteps: [
			"Browser & Worker SDK",
			"Source Maps Upload",
			"OpenTelemetry Spans",
			"Distributed Trace",
			"Sentry Triage & Alerts",
			"Pinpoint Root Cause",
		],
	},
	{
		slug: "posthog",
		title: "PostHog",
		category: "vendors",
		tagline: "Product Analytics, Feature Flags, Session Replay & A/B Tests",
		keywords: ["posthog"],
		diagramSteps: [
			"First-Party Event Proxy",
			"/ingest Reverse Proxy",
			"PostHog Pipeline",
			"Funnels & Feature Flags",
			"Product Insights",
			"Privacy-Safe Telemetry",
		],
	},
	{
		slug: "launchdarkly",
		title: "LaunchDarkly",
		category: "vendors",
		tagline: "Enterprise Feature Management, Progressive Rollouts & Kill Switches",
		keywords: ["launchdarkly", "feature flags"],
		diagramSteps: [
			"Flag Targeting Rules",
			"Streaming SDK",
			"Edge Flag Evaluation",
			"< 1ms Local Rule Check",
			"Progressive Rollout",
			"Instant Kill Switch",
		],
	},
	{
		slug: "postman",
		title: "Postman",
		category: "vendors",
		tagline: "API Design, Automated Contract Testing & Mock Servers",
		keywords: ["postman"],
		diagramSteps: [
			"OpenAPI 3.1 Spec",
			"Collection Sync",
			"Automated Contract Tests",
			"CI/CD Runner",
			"Verified API Release",
			"Zero Regression Drift",
		],
	},
	{
		slug: "notion",
		title: "Notion",
		category: "vendors",
		tagline: "Notion API, Connected Workspaces & Knowledge Base Automation",
		keywords: ["notion"],
		diagramSteps: [
			"Notion Database",
			"Structured Properties",
			"Notion REST API",
			"Webhook / Cron Sync",
			"Typed Content Blocks",
			"Rendered Web Docs",
		],
	},
	{
		slug: "youtube",
		title: "YouTube",
		category: "vendors",
		tagline: "YouTube Data API v3, Automated Captions & Video Pipelines",
		keywords: ["youtube", "youtube api"],
		diagramSteps: [
			"Studio MP4 + SRT",
			"Resumable Upload API",
			"YouTube Data API v3",
			"Playlist & Chapters",
			"Sanity Transcript Sync",
			"Searchable Video Embed",
		],
	},

	// =========================================================================
	// 2. FRAMEWORKS & UI
	// =========================================================================
	{
		slug: "astro",
		title: "Astro",
		category: "frameworks",
		featured: true,
		tagline: "Islands Architecture, Server Islands & Content Collections",
		description:
			"Zero-JS-by-default web architecture with Astro 7, Server Islands, Content Layer API, Cloudflare Workers SSR, and Sanity Content Lake integration.",
		badge: "🚀 Web Framework Hub",
		keywords: ["astro", "islands", "server islands", "starlight"],
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
		slug: "react",
		title: "React",
		category: "frameworks",
		featured: true,
		aliases: ["reactjs", "react.js"],
		tagline: "React 19, Server Components, Actions & State Architecture",
		keywords: ["react", "reactjs", "react 19", "useactionstate", "jsx", "tsx"],
		diagramSteps: [
			"Server / Props Data",
			"One-Way Data Flow",
			"React 19 Components",
			"Derived State & Hooks",
			"Minimal DOM Commit",
			"Predictable UI Tree",
		],
	},
	{
		slug: "nextjs",
		title: "Next.js",
		category: "frameworks",
		featured: true,
		aliases: ["next.js", "next"],
		tagline: "App Router, React Server Components, Server Actions & Caching",
		keywords: ["next.js", "nextjs", "app router", "server actions"],
		diagramSteps: [
			"App Router Layout",
			"React Server Components",
			"Streaming Suspense",
			"Zero Client Bundle Fetch",
			"Server Actions",
			"Revalidate & Mutate",
		],
	},
	{
		slug: "svelte",
		title: "Svelte",
		category: "frameworks",
		featured: true,
		tagline: "Svelte 5 Runes ($state, $derived, $effect) & Compiler Reactivity",
		description:
			"Learn Svelte 5 Runes, fine-grained reactivity, and full-stack SvelteKit through courses, podcast episodes, and blog posts.",
		badge: "⚡ Reactive UI Hub",
		keywords: ["svelte", "runes", "rich harris"],
		diagram: {
			title: "Svelte 5 Runes & Compiler Diagram",
			caption:
				"Universal fine-grained signals compiled into surgical DOM updates without a Virtual DOM.",
			nodes: [
				{
					id: "load",
					badge: "State",
					label: "$state & $derived",
					sublabel: "Universal .svelte.ts",
					color: "purple",
				},
				{
					id: "runes",
					badge: "Compiler",
					label: "Svelte 5 Compiler",
					sublabel: "✓ Fine-grained signals",
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
				{ from: "load", to: "runes", label: "compile" },
				{ from: "runes", to: "dom", label: "✓ update" },
			],
		},
	},
	{
		slug: "sveltekit",
		title: "SvelteKit",
		category: "frameworks",
		tagline: "Server Load Functions, Progressive Form Actions & Edge Adapters",
		keywords: ["sveltekit", "+page.server.ts", "form actions"],
		diagramSteps: [
			"+page.server.ts",
			"Typed Load & Actions",
			"Progressive Enhancement",
			"use:enhance Forms",
			"Edge Adapter Deploy",
			"Streaming SSR + CSR",
		],
	},
	{
		slug: "tanstack",
		title: "TanStack",
		category: "frameworks",
		featured: true,
		aliases: ["tanstack-start", "tanstack-query", "tanstack-router"],
		tagline: "TanStack Start, Type-Safe Router, Query & Server Functions",
		keywords: ["tanstack", "tanstack start", "tanstack router", "react query"],
		diagramSteps: [
			"URL Search Schema",
			"100% Typed Route Params",
			"createServerFn RPC",
			"Explicit Server Boundary",
			"TanStack Query Cache",
			"Instant Optimistic UI",
		],
	},
	{
		slug: "hono",
		title: "Hono",
		category: "frameworks",
		featured: true,
		tagline: "Ultrafast WinterCG Web Framework, zValidator & End-to-End RPC",
		keywords: ["hono", "hono rpc", "zvalidator"],
		diagramSteps: [
			"Hono + zValidator",
			"Zod Boundary Schema",
			"export type AppType",
			"Zero-Codegen Inference",
			"hc<AppType>() Client",
			"End-to-End Type Safety",
		],
	},
	{
		slug: "vue",
		title: "Vue",
		category: "frameworks",
		aliases: ["vuejs", "vue.js", "nuxt", "nuxtjs"],
		tagline: "Vue 3 Composition API, Reactivity & Nuxt Full-Stack Apps",
		keywords: ["vue", "vue.js", "vuejs", "nuxt", "nuxtjs", "pinia"],
		diagramSteps: [
			"script setup",
			"Composition API Refs",
			"Proxy Reactivity",
			"Fine-Grained Tracking",
			"Nuxt Nitro Server",
			"Universal Edge Render",
		],
	},
	{
		slug: "angular",
		title: "Angular",
		category: "frameworks",
		aliases: ["angularmaterial", "analogjs"],
		tagline: "Signals, Standalone Components, Angular Material & AnalogJS",
		keywords: ["angular", "angular material", "analogjs", "ngrx", "rxjs"],
		diagramSteps: [
			"Standalone Component",
			"signal() & computed()",
			"Zoneless Change Detection",
			"Fine-Grained Updates",
			"SSR & Hydration",
			"Enterprise Scale UI",
		],
	},
	{
		slug: "solidjs",
		title: "SolidJS",
		category: "frameworks",
		aliases: ["solid", "solid.js", "solidstart"],
		tagline: "Fine-Grained Signals, createSignal & Zero-VDOM Performance",
		keywords: ["solidjs", "solid.js", "solidstart", "createsignal"],
		diagramSteps: [
			"createSignal()",
			"Fine-Grained Getter",
			"Compiled JSX Templates",
			"Run Component Once",
			"Direct DOM Node Update",
			"Zero VDOM Diffing",
		],
	},
	{
		slug: "remix",
		title: "Remix",
		category: "frameworks",
		aliases: ["react-router"],
		tagline: "Web Standards Loaders, Actions, Nested Routes & React Router v7",
		keywords: ["remix", "react router"],
		diagramSteps: [
			"Nested Route Loader",
			"Parallel Data Fetch",
			"Web Fetch Action",
			"Progressive Form Mutation",
			"Automatic Revalidation",
			"Zero Stale UI State",
		],
	},
	{
		slug: "tailwindcss",
		title: "Tailwind CSS",
		category: "frameworks",
		featured: true,
		aliases: ["tailwind"],
		tagline: "Tailwind CSS v4, CSS-First @theme Tokens & Design Systems",
		keywords: ["tailwind", "tailwindcss", "utility-first css"],
		diagramSteps: [
			"@theme CSS Tokens",
			"W3C Design Variables",
			"Oxide Rust Engine",
			"Microsecond CSS Scan",
			"Zero-Runtime Bundle",
			"Dual-Theme Utility Classes",
		],
	},
	{
		slug: "daisyui",
		title: "DaisyUI",
		category: "frameworks",
		aliases: ["daisy ui"],
		tagline: "Semantic Component Classes & Theme Tokens for Tailwind CSS",
		keywords: ["daisyui", "daisy ui"],
		diagramSteps: [
			"Tailwind Base",
			"Semantic Theme Tokens",
			"DaisyUI Components",
			"btn, card, modal",
			"Accessible Markup",
			"Clean HTML Templates",
		],
	},
	{
		slug: "flutter",
		title: "Flutter",
		category: "frameworks",
		aliases: ["dart"],
		tagline: "Cross-Platform Apps with Dart, Impeller Engine & Widget Trees",
		keywords: ["flutter", "dart"],
		diagramSteps: [
			"Dart Reactive State",
			"Typed Widget Tree",
			"Impeller GPU Engine",
			"60/120fps Shaders",
			"iOS, Android & Web",
			"Single Codebase Ship",
		],
	},
	{
		slug: "react-native",
		title: "React Native",
		category: "frameworks",
		aliases: ["expo"],
		tagline: "New Architecture (Fabric & TurboModules), Expo & Universal Apps",
		keywords: ["react native", "expo"],
		diagramSteps: [
			"Expo Router TSX",
			"File-Based Navigation",
			"JSI + Fabric Renderer",
			"Synchronous Native Bridge",
			"Native iOS & Android",
			"OTA Updates & EAS",
		],
	},
	{
		slug: "threejs",
		title: "Three.js",
		category: "frameworks",
		aliases: ["three.js", "webgl"],
		tagline: "3D WebGL/WebGPU Scenes, GLTF Rigging & Shaders in the Browser",
		keywords: ["threejs", "three.js", "webgl", "react three fiber", "gltf"],
		diagramSteps: [
			"GLB / GLTF 3D Asset",
			"Draco Compression",
			"Three.js Scene Graph",
			"PBR Materials & Lights",
			"WebGL / WebGPU Canvas",
			"60fps Interactive 3D",
		],
	},
	{
		slug: "remotion",
		title: "Remotion",
		category: "frameworks",
		tagline: "Programmatic Video Rendering in React, TypeScript & FFmpeg",
		keywords: ["remotion"],
		diagramSteps: [
			"React Composition",
			"useCurrentFrame() Hook",
			"Deterministic Timeline",
			"Frame-Accurate SVG/CSS",
			"FFmpeg MP4 Encode",
			"Automated Video Pipeline",
		],
	},
	{
		slug: "vite",
		title: "Vite",
		category: "frameworks",
		tagline: "Instant ESM Dev Server, Rollup/Rolldown Bundling & Environment API",
		keywords: ["vite", "vitejs", "rolldown"],
		diagramSteps: [
			"Native Browser ESM",
			"Instant Dev Server Boot",
			"Hot Module Replacement",
			"Sub-20ms File Edits",
			"Optimized Production Build",
			"Code-Split Chunks",
		],
	},

	// =========================================================================
	// 3. PROGRAMMING LANGUAGES & WEB STANDARDS
	// =========================================================================
	{
		slug: "typescript",
		title: "TypeScript",
		category: "languages",
		featured: true,
		aliases: ["ts"],
		tagline: "Strict Type Systems, Generics, Discriminated Unions & TypeGen",
		keywords: ["typescript", "tsconfig", "type safety", "generics"],
		diagramSteps: [
			"Strict tsconfig.json",
			"Discriminated Unions",
			"Zod / GROQ TypeGen",
			"Runtime + Compile Verification",
			"End-to-End Inference",
			"Zero Runtime Type Bugs",
		],
	},
	{
		slug: "javascript",
		title: "JavaScript",
		category: "languages",
		featured: true,
		aliases: ["js", "es6"],
		tagline: "V8 Event Loop, Closures, Async/Await, Web APIs & ES Modules",
		keywords: ["javascript", "ecmascript", "vanilla js", "event loop", "dom"],
		diagramSteps: [
			"Call Stack Execution",
			"Lexical Closures",
			"Microtask Queue",
			"Promise Resolution",
			"Event Loop Tick",
			"Non-Blocking UI Render",
		],
	},
	{
		slug: "html",
		title: "HTML",
		category: "languages",
		aliases: ["html5"],
		tagline: "Semantic HTML5 Landmarks, Native Dialog/Popover, Forms & SEO",
		keywords: ["html", "html5", "semantic html", "web components", "htmx"],
		diagramSteps: [
			"Semantic Landmarks",
			"main, nav, article",
			"Native Browser Controls",
			"dialog, popover, form",
			"Accessibility Tree",
			"Zero-JS Resilience",
		],
	},
	{
		slug: "css",
		title: "CSS",
		category: "languages",
		aliases: ["css3", "flexbox", "grid"],
		tagline: "Flexbox, CSS Grid, Subgrid, View Transitions & Scroll Animations",
		keywords: [
			"css",
			"css3",
			"flexbox",
			"css grid",
			"subgrid",
			"view transitions",
			"container queries",
		],
		diagramSteps: [
			"Flexbox & CSS Grid",
			"Intrinsic Responsive Layout",
			"Container Queries",
			"Component-Scoped Rules",
			"Compositor Animations",
			"60fps transform & opacity",
		],
	},
	{
		slug: "sql",
		title: "SQL",
		category: "languages",
		featured: true,
		tagline: "Relational Modeling, B-Tree Indexing, EXPLAIN QUERY PLAN & Joins",
		keywords: ["sql", "b-tree", "query plan", "relational database"],
		diagramSteps: [
			"Normalized Schema",
			"3NF + Foreign Keys",
			"Composite B-Tree Index",
			"O(log N) Key Lookup",
			"Sub-Millisecond Query",
			"Zero Full Table Scans",
		],
	},
	{
		slug: "graphql",
		title: "GraphQL",
		category: "languages",
		tagline: "Typed Schemas, Queries, Mutations, Subscriptions & Federation",
		keywords: ["graphql", "apollo"],
		diagramSteps: [
			"Schema Definition SDL",
			"Strongly Typed Graph",
			"Resolver Pipeline",
			"DataLoader Batching",
			"Typed Client Operation",
			"Zero Over-Fetching",
		],
	},
	{
		slug: "nodejs",
		title: "Node.js",
		category: "languages",
		aliases: ["node", "node.js"],
		tagline: "Server-Side JavaScript, Streams, WinterCG Fetch & Backend APIs",
		keywords: ["node.js", "nodejs", "express", "npm", "pnpm"],
		diagramSteps: [
			"ESM Module Graph",
			"Web Standards Fetch",
			"libuv Async I/O",
			"Worker Threads & Streams",
			"Production HTTP API",
			"Graceful Shutdown",
		],
	},
	{
		slug: "bun",
		title: "Bun",
		category: "languages",
		tagline: "All-in-One JavaScript Runtime, Bundler, Test Runner & Package Manager",
		keywords: ["bun", "bun.sh"],
		diagramSteps: [
			"bun install & bun test",
			"Native TypeScript Execution",
			"JavaScriptCore Engine",
			"Fast Startup & SQLite",
			"Bun.serve() HTTP",
			"High-Throughput API",
		],
	},
	{
		slug: "deno",
		title: "Deno",
		category: "languages",
		tagline: "Secure-by-Default TypeScript Runtime, JSR & Web Standards",
		keywords: ["deno", "jsr"],
		diagramSteps: [
			"Native TypeScript",
			"Explicit Permission Flags",
			"Web Standard APIs",
			"JSR Package Registry",
			"Deno Deploy Isolates",
			"Global Edge Execution",
		],
	},
	{
		slug: "python",
		title: "Python",
		category: "languages",
		tagline: "FastAPI, PyTorch, AI Model Serving, TTS & Data Engineering",
		keywords: ["python", "fastapi", "django", "pytorch"],
		diagramSteps: [
			"Pydantic Type Hints",
			"Validated Data Models",
			"FastAPI + PyTorch",
			"Async GPU Inference",
			"Typed JSON / Audio",
			"Production AI Service",
		],
	},
	{
		slug: "rust",
		title: "Rust",
		category: "languages",
		aliases: ["wasm", "webassembly"],
		tagline: "Memory Safety, Zero-Cost Abstractions, WebAssembly & Tauri",
		keywords: ["rust", "rustlang", "tauri", "webassembly", "wasm"],
		diagramSteps: [
			"Ownership & Borrow Check",
			"Compile-Time Memory Safety",
			"Cargo Build Release",
			"LLVM Native / WASM Target",
			"Zero-GC Execution",
			"Predictable Tail Latency",
		],
	},
	{
		slug: "go",
		title: "Go",
		category: "languages",
		aliases: ["golang"],
		tagline: "Goroutines, Channels, Cloud-Native CLI Tools & High-Throughput Services",
		keywords: ["golang", "go routines"],
		diagramSteps: [
			"Goroutines & Channels",
			"CSP Concurrency",
			"Static Single Binary",
			"Fast Compile & Boot",
			"Cloud-Native Service",
			"Minimal RAM Footprint",
		],
	},
	{
		slug: "php",
		title: "PHP",
		category: "languages",
		aliases: ["laravel"],
		tagline: "Modern PHP 8+, Laravel, FrankenPHP & Web Application Security",
		keywords: ["php", "laravel", "wordpress", "symfony"],
		diagramSteps: [
			"PHP 8 Strict Types",
			"Laravel Routing & ORM",
			"OPcache / FrankenPHP",
			"Worker Mode Execution",
			"Hardened Runtime",
			"Fast Server Responses",
		],
	},
	{
		slug: "csharp",
		title: "C#",
		category: "languages",
		aliases: ["dotnet", ".net"],
		tagline: ".NET 9, Minimal APIs, Blazor & Enterprise Cloud Architecture",
		keywords: ["c#", "csharp", "dotnet", ".net", "blazor"],
		diagramSteps: [
			"C# Records & LINQ",
			"Strongly Typed Domain",
			"ASP.NET Minimal API",
			"AOT Native Compilation",
			"Cloud Container",
			"High-Throughput Backend",
		],
	},
	{
		slug: "zod",
		title: "Zod",
		category: "languages",
		tagline: "TypeScript-First Schema Validation, z.infer & Runtime Boundary Safety",
		keywords: ["zod", "zvalidator", "z.object", "z.infer"],
		diagramSteps: [
			"Untrusted JSON Input",
			"API / Form / Env Boundary",
			"schema.safeParse()",
			"Runtime Validation Gate",
			"z.infer<typeof schema>",
			"100% Verified Static Type",
		],
	},

	// =========================================================================
	// 4. DATABASES, STORAGE & AUTH
	// =========================================================================
	{
		slug: "d1",
		title: "Cloudflare D1",
		category: "data",
		featured: true,
		aliases: ["cloudflare-d1"],
		tagline: "Serverless Edge SQLite, Read Replication & Zero-Cold-Start Queries",
		keywords: ["cloudflare d1", "env.db", "d1 database"],
		diagramSteps: [
			"Drizzle SQL Migrations",
			"wrangler d1 migrations",
			"Cloudflare D1 Binding",
			"Zero-Config env.DB",
			"Global Read Replicas",
			"Sub-10ms Edge Queries",
		],
	},
	{
		slug: "durable-objects",
		title: "Durable Objects",
		category: "data",
		tagline: "Single-Threaded Edge Actors, Embedded SQLite & WebSocket Hibernation",
		keywords: ["durable objects", "ctx.storage.sql", "websocket hibernation"],
		diagramSteps: [
			"Unique Actor ID",
			"Global Single-Thread Route",
			"ctx.storage.sql",
			"Co-Located 0.1ms SQLite",
			"WebSocket Hibernation",
			"$0 Idle Stateful Agent",
		],
	},
	{
		slug: "drizzle",
		title: "Drizzle",
		category: "data",
		featured: true,
		aliases: ["drizzle-orm"],
		tagline: "TypeScript SQL ORM, Zero-Overhead Queries & Schema Migrations",
		keywords: ["drizzle", "drizzle orm", "drizzle-kit"],
		diagramSteps: [
			"src/db/schema.ts",
			"TypeScript Table Definitions",
			"drizzle-kit generate",
			"Deterministic SQL Migrations",
			"Relational Type Queries",
			"Zero-Overhead SQL Execution",
		],
	},
	{
		slug: "prisma",
		title: "Prisma",
		category: "data",
		tagline: "Declarative Data Modeling, Prisma Migrate & Type-Safe Database Client",
		keywords: ["prisma", "schema.prisma"],
		diagramSteps: [
			"schema.prisma",
			"Declarative Data Model",
			"prisma migrate",
			"Generated TS Client",
			" Prisma Accelerate",
			"Connection Pool & Cache",
		],
	},
	{
		slug: "postgresql",
		title: "PostgreSQL",
		category: "data",
		aliases: ["postgres"],
		tagline: "ACID Relational Database, JSONB, pgvector & Indexing Architecture",
		keywords: ["postgres", "postgresql", "jsonb", "pgvector"],
		diagramSteps: [
			"Relational + JSONB",
			"Strict ACID Transactions",
			"GIN & B-Tree Indexes",
			"pgvector Embeddings",
			"Connection Pooling",
			"High-Concurrency Reads",
		],
	},
	{
		slug: "sqlite",
		title: "SQLite",
		category: "data",
		tagline: "WAL Mode, Embedded Relational Storage & Edge Read Replicas",
		keywords: ["sqlite", "libsql"],
		diagramSteps: [
			"PRAGMA journal_mode=WAL",
			"Concurrent Reads + Write",
			"In-Process SQL Engine",
			"Zero Network Latency",
			"Edge / Local Persistence",
			"Single-File Portability",
		],
	},
	{
		slug: "pglite",
		title: "PGlite",
		category: "data",
		tagline: "WebAssembly Postgres in the Browser & Local-First Real-Time Sync",
		keywords: ["pglite", "electric sql", "local-first"],
		diagramSteps: [
			"WASM Postgres Engine",
			"IndexedDB / OPFS Storage",
			"0ms Browser SQL Queries",
			"Reactive Live Queries",
			"Background Sync Engine",
			"Offline-First Resilience",
		],
	},
	{
		slug: "turso",
		title: "Turso",
		category: "data",
		tagline: "Edge-Hosted libSQL, Embedded Replicas & Per-Tenant Databases",
		keywords: ["turso", "libsql"],
		diagramSteps: [
			"libSQL Primary",
			"HTTP / Hrana Protocol",
			"Embedded Read Replicas",
			"Microsecond Local Reads",
			"Database-per-Tenant",
			"Isolated Multi-Tenancy",
		],
	},
	{
		slug: "neon",
		title: "Neon",
		category: "data",
		tagline: "Serverless Postgres, Instant Database Branching & Scale-to-Zero",
		keywords: ["neon.tech", "neon postgres", "serverless postgres"],
		diagramSteps: [
			"Separated Storage/Compute",
			"Copy-on-Write Branching",
			"Preview PR DB Branch",
			"Instant Schema Testing",
			"HTTP / WebSocket Driver",
			"Edge Worker Compatible",
		],
	},
	{
		slug: "mongodb",
		title: "MongoDB",
		category: "data",
		aliases: ["mongo"],
		tagline: "Document Data Modeling, Aggregation Pipelines & Atlas Search",
		keywords: ["mongodb", "mongo atlas"],
		diagramSteps: [
			"BSON Document Model",
			"Flexible Schema Validation",
			"Aggregation Pipeline",
			"Compound & Vector Indexes",
			"MongoDB Atlas Cluster",
			"Multi-Region Scaling",
		],
	},
	{
		slug: "redis",
		title: "Redis",
		category: "data",
		aliases: ["upstash"],
		tagline: "In-Memory Caching, Rate Limiting, Streams & Serverless Upstash",
		keywords: ["redis", "upstash"],
		diagramSteps: [
			"Edge Request",
			"Sliding-Window Rate Limit",
			"Redis In-Memory Cache",
			"Sub-Millisecond Lookup",
			"Pub/Sub & Streams",
			"Real-Time Event Fanout",
		],
	},
	{
		slug: "better-auth",
		title: "Better-Auth",
		category: "data",
		featured: true,
		tagline: "TypeScript-Native Authentication, OAuth 2.1, Passkeys & D1 Sessions",
		keywords: ["better-auth", "better auth"],
		diagramSteps: [
			"OAuth / Passkey Login",
			"PKCE + CSRF Protection",
			"Better-Auth Server",
			"Self-Hosted D1 / Postgres",
			"Astro Middleware Session",
			"$0 Per-MAU Tax",
		],
	},
	{
		slug: "clerk",
		title: "Clerk",
		category: "data",
		tagline: "Drop-In Authentication UI, Multi-Tenant Organizations & Session JWTs",
		keywords: ["clerk", "clerk.com", "clerk.dev"],
		diagramSteps: [
			"<SignIn /> Component",
			"Passkeys, MFA & Social",
			"Short-Lived Session JWT",
			"Edge Middleware Verify",
			"B2B Organizations",
			"Role & Permission Claims",
		],
	},
	{
		slug: "auth0",
		title: "Auth0",
		category: "data",
		tagline: "Enterprise Identity, OIDC, SAML SSO & Custom Auth Actions",
		keywords: ["auth0"],
		diagramSteps: [
			"Universal Login OIDC",
			"SAML & Social Connections",
			"Post-Login Actions",
			"Custom Token Claims",
			"RS256 JWT Verification",
			"Protected API Access",
		],
	},
	{
		slug: "authzed",
		title: "AuthZed",
		category: "data",
		aliases: ["spicedb"],
		tagline: "Google Zanzibar Relationship-Based Access Control (ReBAC) & SpiceDB",
		keywords: ["authzed", "spicedb", "zanzibar", "rebac"],
		diagramSteps: [
			"Permission Schema",
			"Subject-Relation-Object",
			"SpiceDB Graph Engine",
			"Consistent ZedTokens",
			"CheckPermission API",
			"Sub-10ms Fine-Grained AuthZ",
		],
	},
	{
		slug: "cms",
		title: "Headless CMS",
		category: "data",
		tagline: "Structured Content Modeling, Visual Editing & Omnichannel Delivery",
		keywords: ["headless cms", "cms", "content modeling"],
		diagramSteps: [
			"Structured Content Types",
			"Single Source of Truth",
			"Webhook & Live CDN",
			"Instant Cache Invalidation",
			"Web + AI Agent Delivery",
			"Omnichannel Publishing",
		],
	},
	{
		slug: "database",
		title: "Databases",
		category: "data",
		tagline: "Relational, Document, Vector & Edge Storage Architectures",
		keywords: ["database", "databases", "acid", "indexing"],
		diagramSteps: [
			"Workload Access Pattern",
			"OLTP vs Analytics",
			"Indexing & Partitioning",
			"Read Replicas & Caching",
			"Automated Backups",
			"Zero-Data-Loss Durability",
		],
	},

	// =========================================================================
	// 5. AI, AGENTS & PROTOCOLS
	// =========================================================================
	{
		slug: "ai",
		title: "AI & Agents",
		category: "ai",
		featured: true,
		tagline: "Autonomous AI Agents, Tool Calling, Structured Outputs & Eval Loops",
		description:
			"Architect production AI coding agents, Model Context Protocol (MCP) servers, WebMCP tools, and Answer Engine Optimization (AEO).",
		badge: "🤖 AI & Agentic Web Hub",
		keywords: [
			"ai",
			"ai agent",
			"ai agents",
			"llm",
			"generative ai",
			"genai",
			"machine learning",
		],
		diagram: {
			title: "Production AI Agent Architecture Diagram",
			caption:
				"Deterministic Zod tool-calling loops with human-in-the-loop approval and context grounding.",
			nodes: [
				{
					id: "agent",
					badge: "Planner",
					label: "AI Agent Loop",
					sublabel: "Strict Zod Tool Schemas",
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
					badge: "Ground Truth",
					label: "Sanity + Edge DB",
					sublabel: "✓ Verified execution",
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
	{
		slug: "mcp",
		title: "MCP",
		category: "ai",
		featured: true,
		aliases: ["model-context-protocol"],
		tagline: "Model Context Protocol Servers, Streamable HTTP & OAuth 2.1",
		keywords: ["mcp", "model context protocol", "mcp server", "json-rpc"],
		diagramSteps: [
			"AI Host (Claude/Cursor)",
			"/.well-known/mcp Discovery",
			"Streamable HTTP Transport",
			"OAuth 2.1 + PKCE Auth",
			"Tools, Resources & Prompts",
			"Typed Production Execution",
		],
	},
	{
		slug: "webmcp",
		title: "WebMCP",
		category: "ai",
		tagline: "navigator.modelContext Browser Tool Registration for In-Page AI Agents",
		keywords: ["webmcp", "navigator.modelcontext"],
		diagramSteps: [
			"navigator.modelContext",
			"registerTool() in Browser",
			"Live DOM & Session State",
			"Zero-Auth-Dance Execution",
			"Browser AI Agent",
			"Deterministic Page Actions",
		],
	},
	{
		slug: "web-ai",
		title: "Web AI",
		category: "ai",
		tagline: "Client-Side Browser AI, WebNN, WebGPU & On-Device Inference",
		keywords: ["web ai", "web-ai", "client-side ai", "on-device ai"],
		diagramSteps: [
			"Quantized ONNX / GGUF",
			"Browser Cache API",
			"WebGPU / WebNN Shaders",
			"Hardware GPU Acceleration",
			"Local Token Stream",
			"$0 Cloud Inference Bill",
		],
	},
	{
		slug: "webgpu",
		title: "WebGPU",
		category: "ai",
		tagline: "Next-Gen Browser GPU Compute Shaders, WGSL & Local LLM Acceleration",
		keywords: ["webgpu", "wgsl", "compute shaders"],
		diagramSteps: [
			"navigator.gpu Adapter",
			"WGSL Compute Shaders",
			"VRAM Tensor Buffers",
			"Parallel Matrix Multiply",
			"60+ tok/sec in Browser",
			"Zero Server Roundtrip",
		],
	},
	{
		slug: "openai",
		title: "OpenAI",
		category: "ai",
		tagline: "Responses API, Structured Outputs, Realtime Voice & Tool Calling",
		keywords: ["openai", "chatgpt", "gpt-4", "gpt-5"],
		diagramSteps: [
			"System + Developer Prompt",
			"Strict JSON Schema",
			"OpenAI Responses API",
			"Deterministic Tool Call",
			"Streaming SSE Tokens",
			"Validated App UI",
		],
	},
	{
		slug: "anthropic",
		title: "Anthropic",
		category: "ai",
		aliases: ["claude"],
		tagline: "Claude Models, Claude Code, MCP Originator & Extended Thinking",
		keywords: ["anthropic", "claude", "claude code"],
		diagramSteps: [
			"Prompt Caching Prefix",
			"90% Input Cost Reduction",
			"Claude Extended Thinking",
			"Multi-Step Tool Use",
			"MCP Server Integration",
			"Verified Code & Actions",
		],
	},
	{
		slug: "gemini",
		title: "Google Gemini",
		category: "ai",
		aliases: ["google-gemini"],
		tagline: "Multimodal Context Windows, Google Antigravity & Agentic Workflows",
		keywords: ["gemini", "google gemini", "antigravity"],
		diagramSteps: [
			"Multimodal Input",
			"Code + Audio + Video",
			"Gemini Reasoning Model",
			"1M+ Token Context",
			"Structured Tool Output",
			"Autonomous Agent Execution",
		],
	},
	{
		slug: "gemini-nano",
		title: "Gemini Nano",
		category: "ai",
		tagline: "On-Device Chrome AI Model, Prompt API & Summarizer API",
		keywords: ["gemini nano", "gemini-nano"],
		diagramSteps: [
			"window.ai / LanguageModel",
			"Availability Check",
			"On-Device Gemini Nano",
			"Offline Local Execution",
			"Streaming DOM Output",
			"100% Private User Data",
		],
	},
	{
		slug: "chrome-built-in-ai",
		title: "Chrome Built-in AI",
		category: "ai",
		tagline: "W3C Web Machine Learning Prompt, Summarizer, Writer & Translator APIs",
		keywords: ["chrome built-in ai", "chrome-built-in-ai", "prompt api"],
		diagramSteps: [
			"Feature Detection Gate",
			"Browser Built-in AI API",
			"Local NPU / GPU Run",
			"Hybrid Cloud Fallback",
			"Progressive AI UX",
			"Zero API Key Exposure",
		],
	},
	{
		slug: "transformers-js",
		title: "Transformers.js",
		category: "ai",
		tagline: "Hugging Face ONNX Runtime Web Models in TypeScript & WebGPU",
		keywords: ["transformers.js", "transformers-js", "huggingface", "onnx"],
		diagramSteps: [
			"pipeline('feature-extraction')",
			"q4 Quantized ONNX Model",
			"Web Worker Thread",
			"WebGPU Execution Provider",
			"In-Browser Embeddings",
			"Non-Blocking Main Thread",
		],
	},
	{
		slug: "rag",
		title: "RAG",
		category: "ai",
		tagline: "Hybrid Semantic + Keyword Search, Vector Embeddings & Reranking",
		keywords: ["rag", "retrieval augmented generation", "vector database", "embeddings"],
		diagramSteps: [
			"Chunking + Embeddings",
			"Vector + BM25 Index",
			"Reciprocal Rank Fusion",
			"Top-K Grounded Chunks",
			"Cited LLM Answer",
			"Zero Hallucinated Facts",
		],
	},

	// =========================================================================
	// 6. DEVOPS, TESTING, SECURITY & CAREER
	// =========================================================================
	{
		slug: "git",
		title: "Git",
		category: "devops",
		tagline: "Content-Addressable DAG, Interactive Rebase, Worktrees & Bisect",
		keywords: ["git", "git rebase", "git worktree", "git bisect"],
		diagramSteps: [
			"Blobs, Trees & Commits",
			"Immutable SHA-1/256 DAG",
			"Interactive Rebase",
			"Clean Atomic History",
			"git bisect run",
			"Automated Bug Pinpointing",
		],
	},
	{
		slug: "github",
		title: "GitHub",
		category: "devops",
		featured: true,
		tagline: "GitHub Actions CI/CD, Pull Request Workflows, Copilot & Open Source",
		keywords: ["github", "github actions", "github copilot", "pull request"],
		diagramSteps: [
			"Pull Request Branch",
			"Required Status Checks",
			"GitHub Actions Matrix",
			"Typecheck + Lint + E2E",
			"Preview Edge URL",
			"Verified Merge to Main",
		],
	},
	{
		slug: "docker",
		title: "Docker",
		category: "devops",
		aliases: ["kubernetes", "k8s"],
		tagline: "Multi-Stage Dockerfiles, Containers, Compose & Cloud Run Deploys",
		keywords: ["docker", "dockerfile", "containers", "kubernetes", "k8s"],
		diagramSteps: [
			"Multi-Stage Dockerfile",
			"Cached Dependency Layer",
			"Distroless / Alpine Image",
			"Minimal Attack Surface",
			"Immutable Container",
			"Identical Local & Prod",
		],
	},
	{
		slug: "playwright",
		title: "Playwright",
		category: "devops",
		tagline: "Deterministic End-to-End Browser Testing, Trace Viewer & Network Mocks",
		keywords: ["playwright", "e2e testing"],
		diagramSteps: [
			"getByRole() Locators",
			"Accessible User Queries",
			"Web-First Auto-Waiting",
			"Zero Arbitrary Sleeps",
			"Playwright Trace Viewer",
			"DOM + Network Time Travel",
		],
	},
	{
		slug: "testing",
		title: "Testing",
		category: "devops",
		aliases: ["vitest", "tdd"],
		tagline: "Test-Driven Development (TDD), Vitest, Dependency Injection & CI Gates",
		keywords: ["testing", "vitest", "jest", "tdd", "unit testing"],
		diagramSteps: [
			"Red: Failing Spec",
			"Define Expected Contract",
			"Green: Pure Implementation",
			"Injected Ports & Clocks",
			"Refactor with Confidence",
			"Sub-Second Vitest Suite",
		],
	},
	{
		slug: "security",
		title: "Security",
		category: "devops",
		featured: true,
		tagline: "OAuth 2.1, Passkeys, RBAC, Supply-Chain Hardening & Zero Trust",
		keywords: [
			"security",
			"cybersecurity",
			"oauth",
			"passkeys",
			"rbac",
			"zero trust",
			"vulnerability",
			"cve",
		],
		diagramSteps: [
			"Zero-Trust Boundary",
			"PKCE + HttpOnly Cookies",
			"Strict Input Validation",
			"CSP & Signed Webhooks",
			"Least-Privilege RBAC",
			"Audited Production Access",
		],
	},
	{
		slug: "serverless",
		title: "Serverless",
		category: "devops",
		tagline: "Edge Functions, Scale-to-Zero Compute & Event-Driven Architectures",
		keywords: ["serverless", "jamstack", "edge functions"],
		diagramSteps: [
			"Incoming HTTP / Event",
			"Global Anycast Router",
			"Ephemeral Isolate Boot",
			"Pay-Per-Millisecond Compute",
			"Queue / Webhook Output",
			"$0 Idle Infrastructure",
		],
	},
	{
		slug: "devops",
		title: "DevOps",
		category: "devops",
		tagline: "CI/CD Pipelines, Infrastructure as Code, Observability & SRE",
		keywords: ["devops", "ci/cd", "terraform", "observability", "monitoring"],
		diagramSteps: [
			"Infrastructure as Code",
			"Declarative Git State",
			"Automated CI/CD Gate",
			"Canary / Preview Deploy",
			"OpenTelemetry Logs & Traces",
			"SLO Alerting & Rollback",
		],
	},
	{
		slug: "a11y",
		title: "Accessibility",
		category: "devops",
		aliases: ["accessibility", "wcag"],
		tagline: "WCAG 2.2 AA, Semantic ARIA, Keyboard Focus Rings & Screen Readers",
		keywords: ["accessibility", "a11y", "wcag", "aria", "screen reader"],
		diagramSteps: [
			"Semantic HTML Elements",
			"Native Role & Name",
			":focus-visible Rings",
			"Roving Tabindex & Escape",
			"prefers-reduced-motion",
			"WCAG 2.2 AA Verified",
		],
	},
	{
		slug: "design",
		title: "Design",
		category: "devops",
		aliases: ["design-systems", "figma"],
		tagline: "W3C Design Tokens, Dual-Theme UI Systems, Figma & Component Libraries",
		keywords: ["design", "design system", "figma", "ui/ux", "design tokens"],
		diagramSteps: [
			"W3C tokens.json",
			"Semantic Light/Dark Tokens",
			"Tailwind @theme Mapping",
			"Accessible Contrast Pairs",
			"Reusable UI Components",
			"Consistent Brand Experience",
		],
	},
	{
		slug: "architecture",
		title: "Architecture",
		category: "devops",
		tagline: "Distributed Systems, Trade-Off Matrices & Visual Architecture Diagrams",
		keywords: ["architecture", "system design", "distributed systems"],
		diagramSteps: [
			" SLA & Cost Constraints",
			"Latency & Consistency Needs",
			"Trade-Off Matrix",
			"Compare 3+ Alternatives",
			"Visual System Diagram",
			"Pragmatic Production Stack",
		],
	},
	{
		slug: "career",
		title: "Career",
		category: "devops",
		tagline: "Engineering Portfolios, System Design Interviews, DevRel & Leadership",
		keywords: ["career", "devrel", "developer relations", "getting hired", "interviews"],
		diagramSteps: [
			"Shipped Production App",
			"Live URL + E2E + Auth",
			"Architecture README",
			"Diagram + Trade-Off Table",
			"Open Source PRs",
			"Standout Senior Offer",
		],
	},
	{
		slug: "webdev",
		title: "WebDev",
		category: "devops",
		aliases: ["web-dev", "web dev"],
		tagline: "Full-Stack Web Engineering, Core Web Vitals & Modern Browser APIs",
		keywords: ["webdev", "web development", "full-stack", "core web vitals"],
		diagramSteps: [
			"Semantic HTML & CSS",
			"Instant First Contentful Paint",
			"Typed Edge SSR + API",
			"Sub-50ms TTFB",
			"Core Web Vitals Green",
			"LCP < 2.5s & INP < 200ms",
		],
	},
	{
		slug: "oss",
		title: "Open Source",
		category: "devops",
		aliases: ["open-source"],
		tagline: "Open-Source Maintainer Workflows, Licensing, Governance & PRs",
		keywords: ["open source", "oss", "maintainer"],
		diagramSteps: [
			"Reproducible Issue",
			"Minimal Failing Test",
			"Focused Atomic PR",
			"Maintainer Code Review",
			"Changesets Release",
			"Semantic Version Publish",
		],
	},
	{
		slug: "ffmpeg",
		title: "FFmpeg",
		category: "devops",
		tagline: "Hardware-Accelerated Video Encoding, Filtergraphs & Audio Mastering",
		keywords: ["ffmpeg", "nvenc", "libx264"],
		diagramSteps: [
			"Raw Video + WAV Stems",
			"Loudnorm & Filtergraph",
			"FFmpeg H.264 / AV1",
			"Frame-Accurate Muxing",
			"Streaming-Ready MP4",
			"YouTube & Web Delivery",
		],
	},
	{
		slug: "blender",
		title: "Blender",
		category: "devops",
		tagline: "3D Modeling, Armature Rigging, Bone Constraints & GLB Export",
		keywords: ["blender", "3d modeling"],
		diagramSteps: [
			"3D Mesh Topology",
			"UV Unwrap & PBR Textures",
			"Armature Bone Rig",
			"Keyframe Action Clips",
			"Compressed .glb Export",
			"Web Three.js Ready",
		],
	},
	{
		slug: "chrome",
		title: "Chrome",
		category: "devops",
		tagline: "Chrome DevTools, Manifest V3 Extensions, Lighthouse & Web Vitals",
		keywords: ["chrome", "chrome devtools", "chrome extension", "lighthouse"],
		diagramSteps: [
			"Performance Flamechart",
			"Network & LCP Inspection",
			"Memory Heap Snapshot",
			"Eliminate Layout Shifts",
			"Verified 100 Lighthouse",
			"Fast Production UX",
		],
	},
	{
		slug: "microbit",
		title: "micro:bit",
		category: "devops",
		aliases: ["micro:bit"],
		tagline: "BBC micro:bit Hardware Programming, LEDs, Sensors & STEM Coding",
		keywords: ["micro:bit", "microbit"],
		diagramSteps: [
			"MakeCode / JavaScript",
			"Simulator Preview",
			"USB WebUSB Flash",
			"ARM Cortex Microcontroller",
			"LED Matrix & Sensors",
			"Hands-On Hardware Fun",
		],
	},
	{
		slug: "video",
		title: "Video",
		category: "devops",
		tagline: "Developer Video Production, Streaming Protocols, HLS & Captions",
		keywords: ["video", "hls", "webrtc"],
		diagramSteps: [
			"1080p/4K Studio Capture",
			"Whisper Word Timestamps",
			"Adaptive HLS / MP4",
			"CDN Byte-Range Caching",
			"Instant Web Playback",
			"Synced Interactive Transcript",
		],
	},
	{
		slug: "mental-health",
		title: "Mental Health",
		category: "devops",
		aliases: ["mental health"],
		tagline: "Sustainable Engineering Pace, Preventing Burnout & Developer Wellness",
		keywords: ["mental health", "burnout", "work-life balance"],
		diagramSteps: [
			"Healthy Boundaries",
			"Async Team Communication",
			"Manage On-Call Load",
			"Automate Repetitive Toil",
			"Sustainable Pace",
			"Long-Term Creative Energy",
		],
	},
	{
		slug: "infrastructure",
		title: "Infrastructure",
		category: "devops",
		tagline: "Cloud Networking, DNS, Anycast CDNs, TLS 1.3 & High Availability",
		keywords: ["infrastructure", "dns", "cdn", "anycast", "tls"],
		diagramSteps: [
			"Global Anycast DNS",
			"TLS 1.3 + HTTP/3 QUIC",
			"Edge Cache Tiering",
			"Origin Shielding",
			"Multi-Region Failover",
			"99.99% Uptime SLA",
		],
	},
	{
		slug: "web-technologies",
		title: "Web Standards",
		category: "devops",
		aliases: ["web technologies"],
		tagline: "W3C & WHATWG Web Platform APIs, WinterCG & Progressive Web Apps",
		keywords: ["web technologies", "web standards", "w3c", "whatwg", "pwa"],
		diagramSteps: [
			"W3C / WHATWG Spec",
			"Standard Fetch & Streams",
			"Cross-Browser Support",
			"Progressive Enhancement",
			"Zero Lock-In Code",
			"Multi-Decade Longevity",
		],
	},
];

const CATEGORY_BADGE_MAP: Record<TopicCategory, string> = {
	vendors: "☁️ Cloud & Vendor Hub",
	frameworks: "🚀 Framework & UI Hub",
	languages: "⌨️ Language & Standard Hub",
	data: "🗄️ Database & Auth Hub",
	ai: "🤖 AI & Agentic Web Hub",
	devops: "🛡️ DevOps & Architecture Hub",
};

export const TOPICS: TopicDefinition[] = RAW_TOPICS.map((seed) => {
	const logos = defaultLogos(seed.slug);
	const steps = seed.diagramSteps ?? [
		`${seed.title} Setup`,
		"Type-Safe Config",
		`${seed.title} Core`,
		"Verified Execution",
		"Production Edge",
		"Observability & Scale",
	];
	return {
		slug: seed.slug,
		title: seed.title,
		category: seed.category,
		featured: Boolean(seed.featured),
		aliases: seed.aliases ?? [],
		tagline: seed.tagline,
		description:
			seed.description ??
			`Explore CodingCat.dev hands-on courses, video lessons, podcast episodes, and technical deep-dive blog posts covering ${seed.title}: ${seed.tagline}.`,
		badge: seed.badge ?? CATEGORY_BADGE_MAP[seed.category],
		logoLight: seed.logoLight ?? logos.logoLight,
		logoDark: seed.logoDark ?? logos.logoDark,
		symbolLight: seed.symbolLight ?? logos.symbolLight,
		symbolDark: seed.symbolDark ?? logos.symbolDark,
		partnerUrl: seed.partnerUrl,
		partnerCtaLabel: seed.partnerCtaLabel,
		keywords: seed.keywords,
		diagram:
			seed.diagram ??
			defaultDiagram(
				seed.title,
				steps[0],
				steps[1],
				steps[2],
				steps[3],
				steps[4],
				steps[5],
			),
	};
});

export const FEATURED_TOPICS: TopicDefinition[] = TOPICS.filter(
	(t) => t.featured,
);

/**
 * Lookup map indexing canonical `slug`, `title` (lowercased), and all `aliases`.
 */
export const TOPICS_BY_SLUG: Record<string, TopicDefinition> = {};
for (const t of TOPICS) {
	TOPICS_BY_SLUG[t.slug.toLowerCase()] = t;
	TOPICS_BY_SLUG[t.title.toLowerCase()] = t;
	for (const alias of t.aliases ?? []) {
		TOPICS_BY_SLUG[alias.toLowerCase()] = t;
	}
}

export function getTopicBySlug(
	slugOrLabel: string | null | undefined,
): TopicDefinition | undefined {
	if (!slugOrLabel) return undefined;
	const normalized = slugOrLabel.trim().toLowerCase();
	if (TOPICS_BY_SLUG[normalized]) {
		return TOPICS_BY_SLUG[normalized];
	}
	const slugified = normalized
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return TOPICS_BY_SLUG[slugified];
}

export interface SanityTagItem {
	label?: string | null;
	value?: string | null;
}

export function itemMatchesTopic(
	title: string | null | undefined,
	excerpt: string | null | undefined,
	topic: TopicDefinition,
	tags?: SanityTagItem[] | null,
): boolean {
	if (Array.isArray(tags) && tags.length > 0) {
		for (const t of tags) {
			const resolved =
				getTopicBySlug(t?.value) || getTopicBySlug(t?.label);
			if (resolved?.slug === topic.slug) {
				return true;
			}
		}
	}
	const hay = `${title ?? ""} ${excerpt ?? ""}`.toLowerCase();
	return topic.keywords.some((kw) => hay.includes(kw.toLowerCase()));
}

export function matchTopicsForText(
	textOrTitle?: string | null,
	excerpt?: string | null,
	tags?: SanityTagItem[] | null,
): TopicDefinition[] {
	const matched = new Map<string, TopicDefinition>();

	if (Array.isArray(tags)) {
		for (const t of tags) {
			const resolved =
				getTopicBySlug(t?.value) || getTopicBySlug(t?.label);
			if (resolved && !matched.has(resolved.slug)) {
				matched.set(resolved.slug, resolved);
			}
		}
	}

	const hay = `${textOrTitle ?? ""} ${excerpt ?? ""}`.toLowerCase();
	for (const topic of TOPICS) {
		if (matched.has(topic.slug)) continue;
		if (topic.keywords.some((kw) => hay.includes(kw.toLowerCase()))) {
			matched.set(topic.slug, topic);
		}
	}

	return Array.from(matched.values());
}

/**
 * Resolves all canonical TopicDefinitions for a content item (`course`, `lesson`, `post`, `podcast`),
 * prioritizing explicit Sanity `tags[]` first and supplementing with keyword matches.
 */
export function resolveItemTopics(
	item: {
		title?: string | null;
		excerpt?: string | null;
		tags?: SanityTagItem[] | null;
	},
	maxCount?: number,
): { visible: TopicDefinition[]; totalCount: number; remainingCount: number } {
	const all = matchTopicsForText(item.title, item.excerpt, item.tags);
	const totalCount = all.length;
	if (typeof maxCount === "number" && maxCount > 0) {
		const visible = all.slice(0, maxCount);
		return {
			visible,
			totalCount,
			remainingCount: Math.max(0, totalCount - visible.length),
		};
	}
	return { visible: all, totalCount, remainingCount: 0 };
}
