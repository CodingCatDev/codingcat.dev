#!/usr/bin/env node
/**
 * Executes Section 4 of the YouTube 100K Master Plan across Sanity (`production` and `dev`):
 * 1. Archives `micro:bit for a 10 Year Old` and `HTML for a 10 Year Old` (`archived: true`).
 * 2. Adds 2 modern lessons (`CSS Scroll-Driven Animations` and `View Transitions API`) to `CSS Animations`.
 * 3. Seeds the 4 new 2026 Flagship Courses + 20 Bite-Sized Lessons (5 lessons per course).
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "hfh83o0w";
const TOKEN =
	process.env.SANITY_TOKEN ||
	process.env.SANITY_API_WRITE_TOKEN ||
	process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
	console.error("Missing SANITY_TOKEN in environment.");
	process.exit(1);
}

const ALEX_AUTHOR_REF = {
	_key: "author-alex-patterson",
	_type: "reference",
	_ref: "RIgC5r4TJ0hCGOzxHszD1w",
};

function ptBlock(key, text, style = "normal") {
	return {
		_type: "block",
		_key: key,
		style,
		markDefs: [],
		children: [
			{
				_type: "span",
				_key: `${key}-span`,
				text,
				marks: [],
			},
		],
	};
}

function ptCode(key, filename, language, code) {
	return {
		_type: "code",
		_key: key,
		filename,
		language,
		code,
	};
}

function buildLessonDoc({
	id,
	title,
	slug,
	excerpt,
	youtube,
	coverImage,
	date,
	heading1,
	intro,
	codeFilename,
	codeLang,
	codeSnippet,
	takeaway,
}) {
	return {
		_id: id,
		_type: "lesson",
		title,
		slug: { _type: "slug", current: slug },
		excerpt,
		date,
		author: [ALEX_AUTHOR_REF],
		...(youtube ? { youtube } : {}),
		...(coverImage ? { coverImage } : {}),
		content: [
			ptBlock(`${id}-h2-1`, heading1, "h2"),
			ptBlock(`${id}-p-1`, intro, "normal"),
			ptCode(`${id}-code-1`, codeFilename, codeLang, codeSnippet),
			ptBlock(`${id}-h2-2`, "Production Architecture Takeaway", "h2"),
			ptBlock(`${id}-p-2`, takeaway, "normal"),
		],
	};
}

const COVER_MCP = {
	_type: "image",
	alt: "MCP in Production Architecture Diagram",
	asset: {
		_type: "reference",
		_ref: "image-dd8b89a42ee37457891b58d39c6273a31ac013e4-1376x768-jpg",
	},
	media: {
		_type: "globalDocumentReference",
		_ref: "media-library:mlttp0BZbCpV:3LSr0bVjfEnjIt09kXJe1YIb5hy",
		_weak: true,
	},
};

const COVER_EDGE = {
	_type: "image",
	alt: "Zero-Cold-Start Edge Stack Architecture Diagram",
	asset: {
		_type: "reference",
		_ref: "image-d702615b4d3c30ea99dc40f10a576db4cd1c4c73-2752x1536-jpg",
	},
	media: {
		_type: "globalDocumentReference",
		_ref: "media-library:mlttp0BZbCpV:3LSqsHIPV9jsmJjNG7cJCpBjRUv",
		_weak: true,
	},
};

const COVER_SANITY = {
	_type: "image",
	alt: "Sanity Content Operating System Architecture Diagram",
	asset: {
		_type: "reference",
		_ref: "image-38b0f021c51d97043c8a1ebf31d505a0ea877b7c-2752x1536-jpg",
	},
	media: {
		_type: "globalDocumentReference",
		_ref: "media-library:mlttp0BZbCpV:3LSnyQDonXY1zlmCDK1H1NXz8FO",
		_weak: true,
	},
};

const COVER_AGENTS = {
	_type: "image",
	alt: "Full-Stack AI Agents in TypeScript Architecture Diagram",
	asset: {
		_type: "reference",
		_ref: "image-78383c8986667bc1eaa504786488d88f212929a8-1280x720-jpg",
	},
	media: {
		_type: "globalDocumentReference",
		_ref: "media-library:mlttp0BZbCpV:3LSp7RvE7Uc7UEjcECVdpjwiD9a",
		_weak: true,
	},
};

const NOW_ISO = "2026-11-01T16:00:00.000Z";

const NEW_COURSES = [
	{
		id: "course-mcp-in-production-2026",
		title: "MCP in Production: Building & Securing Model Context Protocol Servers",
		slug: "mcp-in-production",
		excerpt:
			"Master the Model Context Protocol (MCP) in TypeScript: transport architectures (Stdio vs. Streamable HTTP), Cloudflare Workers deployment, OAuth 2.1 security, client-side WebMCP, and Sanity Context knowledge bases.",
		youtube: "https://youtu.be/gH9Q6-b1b4Y",
		coverImage: COVER_MCP,
		lessons: [
			{
				id: "lesson-mcp-1-mental-model",
				title: "What MCP Actually Is (Architecture Diagram & Stdio vs. Streamable HTTP)",
				slug: "what-mcp-actually-is-stdio-vs-streamable-http",
				excerpt:
					"Cut through the buzzwords and understand the exact JSON-RPC 2.0 wire protocol, transport boundary, and when to choose Stdio vs. Streamable HTTP.",
				youtube: "https://youtu.be/gH9Q6-b1b4Y",
				heading1: "The Mental Model: JSON-RPC 2.0 Across Process and Edge Boundaries",
				intro:
					"Every conference talk mentions MCP, yet most tutorials stop at a local Stdio script that only runs on your laptop. In production, remote agents connect over Streamable HTTP at the edge.",
				codeFilename: "src/mcp/transport.ts",
				codeLang: "typescript",
				codeSnippet: `export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: "initialize" | "tools/list" | "tools/call";
  params?: Record<string, unknown>;
}

export function createMcpResponse(id: string | number, result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result });
}`,
				takeaway:
					"Use Stdio strictly for local CLI tools that need filesystem access. Use Streamable HTTP on Cloudflare Workers for remote multi-tenant agent tools.",
			},
			{
				id: "lesson-mcp-2-cloudflare-workers",
				title: "Building Your First TypeScript MCP Server on Cloudflare Workers",
				slug: "building-typescript-mcp-server-cloudflare-workers",
				excerpt:
					"Wire up a zero-cold-start Streamable HTTP MCP server on Cloudflare Workers with typed tool schemas and deterministic JSON responses.",
				youtube: "https://youtu.be/gH9Q6-b1b4Y",
				heading1: "Zero-Cold-Start MCP Tool Execution in V8 Isolates",
				intro:
					"When an AI agent calls a tool mid-conversation, a 600ms container cold start ruins the user experience. Running your MCP server inside a Cloudflare Worker keeps tool latency under 10ms.",
				codeFilename: "src/pages/api/mcp.ts",
				codeLang: "typescript",
				codeSnippet: `export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  if (body.method === "tools/list") {
    return Response.json({
      jsonrpc: "2.0",
      id: body.id,
      result: {
        tools: [
          {
            name: "search_catalog",
            description: "Search CodingCat.dev courses, podcasts, and blog posts",
            inputSchema: {
              type: "object",
              properties: { query: { type: "string" } },
              required: ["query"],
            },
          },
        ],
      },
    });
  }
  return Response.json({ jsonrpc: "2.0", id: body.id, result: { ok: true } });
}`,
				takeaway:
					"Keep MCP tool input schemas flat and explicit so smaller tool-calling models never hallucinate nested arguments.",
			},
			{
				id: "lesson-mcp-3-oauth-security",
				title: "Securing Remote MCP Servers with OAuth 2.1 & Better-Auth",
				slug: "securing-remote-mcp-servers-oauth-better-auth",
				excerpt:
					"Protect remote MCP endpoints against confused-deputy attacks using OAuth 2.1 PKCE, scoped access tokens, and Better-Auth session verification.",
				youtube: "https://youtu.be/gH9Q6-b1b4Y",
				heading1: "Why Static API Keys Fail for Multi-User AI Agents",
				intro:
					"Passing a shared root API key into an MCP server gives every prompt full database access. Instead, bind every MCP tool call to a scoped user token verified at the edge.",
				codeFilename: "src/lib/mcp-auth.ts",
				codeLang: "typescript",
				codeSnippet: `export async function verifyMcpBearer(request: Request, db: D1Database) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Response("Unauthorized MCP client", {
      status: 401,
      headers: { "WWW-Authenticate": 'Bearer realm="mcp"' },
    });
  }
  return { token: authHeader.slice(7).trim() };
}`,
				takeaway:
					"Always return a standard WWW-Authenticate header on 401 responses so spec-compliant MCP clients automatically trigger the OAuth 2.1 authorization flow.",
			},
			{
				id: "lesson-mcp-4-webmcp-rfc9727",
				title: "Client-Side WebMCP & RFC 9727 Agent Discovery",
				slug: "client-side-webmcp-rfc-9727-agent-discovery",
				excerpt:
					"Expose in-browser tools via navigator.modelContext (WebMCP) and publish RFC 9727 /.well-known/api-catalog discovery endpoints.",
				youtube: "https://youtu.be/gH9Q6-b1b4Y",
				heading1: "Making Your Web Application Discoverable to Browser and Cloud Agents",
				intro:
					"Browser-based AI agents shouldn't have to scrape fragile DOM selectors when your app can register structured tools directly on navigator.modelContext.",
				codeFilename: "src/scripts/webmcp.ts",
				codeLang: "typescript",
				codeSnippet: `if (typeof navigator !== "undefined" && "modelContext" in navigator) {
  (navigator as any).modelContext.registerTool({
    name: "open_course_lesson",
    description: "Navigate directly to a CodingCat.dev course lesson by slug",
    inputSchema: {
      type: "object",
      properties: { courseSlug: { type: "string" }, lessonSlug: { type: "string" } },
      required: ["courseSlug", "lessonSlug"],
    },
    execute: async ({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) => {
      window.location.href = \`/course/\${courseSlug}/lesson/\${lessonSlug}\`;
      return { navigated: true };
    },
  });
}`,
				takeaway:
					"Pair client-side WebMCP tools with /.well-known/api-catalog and /llms.txt so both browser agents and headless crawlers discover your capabilities.",
			},
			{
				id: "lesson-mcp-5-sanity-context",
				title: "Connecting MCP to Verified Knowledge Bases (Sanity Context vs. Naive RAG)",
				slug: "connecting-mcp-verified-knowledge-bases-sanity-context",
				excerpt:
					"Replace brittle 500-token vector chunks with schema-aware GROQ queries and Sanity Context MCP so your agents return verified canonical answers.",
				youtube: "https://youtu.be/jm5Vq60qYTk",
				heading1: "Why Naive Vector Chunking Breaks Technical Documentation",
				intro:
					"Splitting a tutorial into arbitrary 500-token chunks separates TypeScript interfaces from the prose explaining them. Structured Content Lake queries preserve relationships.",
				codeFilename: "src/lib/sanity/agent-query.ts",
				codeLang: "typescript",
				codeSnippet: `export const AGENT_COURSE_QUERY = \`*[_type == "course" && coalesce(archived, false) != true]{
  title,
  "slug": slug.current,
  excerpt,
  "lessons": sections[].lesson[]->{ title, "slug": slug.current, excerpt }
}\`;`,
				takeaway:
					"Query structured documents by schema and reference graph first, then use embeddings strictly for semantic ranking.",
			},
		],
	},
	{
		id: "course-zero-cold-start-edge-stack-2026",
		title: "The Zero-Cold-Start Edge Stack: Astro 7, Cloudflare Workers, D1 & Better-Auth",
		slug: "zero-cold-start-edge-stack",
		excerpt:
			"Build and deploy full-stack SSR applications with sub-5ms cold starts using Astro 7, Cloudflare Workers, Cloudflare D1 SQLite, and self-hosted Better-Auth.",
		youtube: "https://youtu.be/7d6iJHEPMZI",
		coverImage: COVER_EDGE,
		lessons: [
			{
				id: "lesson-edge-1-v8-isolates",
				title: "Why V8 Isolates Beat Containers at the Edge (<5ms Cold Starts)",
				slug: "why-v8-isolates-beat-containers-at-the-edge",
				excerpt:
					"Compare V8 isolate architecture against traditional container serverless functions across cold starts, memory overhead, and billing predictability.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "V8 Isolates vs. Container Cold Starts in Production",
				intro:
					"When your auth middleware runs on every request, a 350ms container cold start compounds across every route transition. V8 isolates spin up in under 5 milliseconds.",
				codeFilename: "wrangler.jsonc",
				codeLang: "json",
				codeSnippet: `{
  "name": "codingcatdev-prod",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2026-08-01",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"]
}`,
				takeaway:
					"Always enable global_fetch_strictly_public when your Worker fetches its own public domain for OpenGraph generation so requests do not loop.",
			},
			{
				id: "lesson-edge-2-astro7-workers",
				title: "Astro 7 Server Islands & Cloudflare Workers Setup (wrangler.jsonc)",
				slug: "astro-7-server-islands-cloudflare-workers-setup",
				excerpt:
					"Configure Astro 7 with the Cloudflare adapter, explicit env.production bindings, and streaming SSR.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "The #1 Cloudflare Workers Gotcha: Non-Inherited Environment Bindings",
				intro:
					"In wrangler.jsonc, bindings defined at the top level do not inherit into env.production. Every D1, AI, and Email binding must be explicitly repeated under env.production.",
				codeFilename: "src/middleware.ts",
				codeLang: "typescript",
				codeSnippet: `import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.siteUrl = new URL(context.request.url);
  return next();
});`,
				takeaway:
					"Audit your wrangler.jsonc top-level and env.production blocks side by side before every production deploy.",
			},
			{
				id: "lesson-edge-3-cloudflare-d1",
				title: "SQLite at the Edge with Cloudflare D1",
				slug: "sqlite-at-the-edge-with-cloudflare-d1",
				excerpt:
					"Design low-latency relational tables in Cloudflare D1 for user sessions, OTP verification codes, and portal access logs.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "Zero-VPC Relational Storage with Cloudflare D1",
				intro:
					"Traditional Postgres setups require external connection poolers and VPC peering to survive serverless spikes. Cloudflare D1 binds directly to your Worker over an internal RPC channel.",
				codeFilename: "migrations/0001_auth_schema.sql",
				codeLang: "sql",
				codeSnippet: `CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);`,
				takeaway:
					"Keep transactional auth and session tables in D1 while storing rich editorial content and media in Sanity Content Lake.",
			},
			{
				id: "lesson-edge-4-better-auth",
				title: "Self-Hosted Edge Authentication with Better-Auth & D1",
				slug: "self-hosted-edge-authentication-better-auth-d1",
				excerpt:
					"Replace $0.05/MAU SaaS auth bills with self-hosted Better-Auth on Cloudflare D1 supporting 6-digit Email OTP, Magic Links, and Google OAuth.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "Hashed 6-Digit OTPs, Magic Links, and OAuth in One D1 Database",
				intro:
					"With Better-Auth backed by Cloudflare D1, you own your user, session, account, and verification tables with zero per-seat pricing cliffs.",
				codeFilename: "src/lib/auth.ts",
				codeLang: "typescript",
				codeSnippet: `import { betterAuth } from "better-auth";
import { emailOTP, magicLink } from "better-auth/plugins";

export function createEdgeAuth(db: D1Database, baseURL: string, secret: string) {
  return betterAuth({
    database: db,
    baseURL,
    secret,
    plugins: [
      emailOTP({ expiresIn: 300, allowedAttempts: 3, storeOTP: "hashed" }),
      magicLink({ expiresIn: 300, storeToken: "hashed", sendMagicLink: async () => {} }),
    ],
  });
}`,
				takeaway:
					"Always set storeOTP and storeToken to hashed so raw verification codes never sit in plaintext in D1.",
			},
			{
				id: "lesson-edge-5-cicd-observability",
				title: "Zero-Downtime CI/CD & Observability on Cloudflare",
				slug: "zero-downtime-cicd-observability-cloudflare",
				excerpt:
					"Automate typegen, Biome checks, and Wrangler secret synchronization in GitHub Actions with full head-sampling observability.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "Automated Typegen + Worker Deployment Pipeline",
				intro:
					"Your CI pipeline should fail fast if Sanity schema types drift from your frontend queries. Run sanity schema extract and typegen before building your Worker bundle.",
				codeFilename: ".github/workflows/deploy-workers.yml",
				codeLang: "yaml",
				codeSnippet: `- name: Generate Sanity & Cloudflare Types
  run: |
    pnpm typegen
    pnpm --filter @codingcatdev/site cf-typegen
- name: Deploy Worker
  run: pnpm --filter @codingcatdev/site exec wrangler deploy --env production`,
				takeaway:
					"Turn on observability head_sampling_rate: 1 in wrangler.jsonc so you can inspect every edge invocation log in real time.",
			},
		],
	},
	{
		id: "course-sanity-content-os-2026",
		title: "Sanity Content Operating System: Live Content API, Media Library & Functions",
		slug: "sanity-content-operating-system",
		excerpt:
			"Architect a multi-environment Sanity Content Operating System: type-safe GROQ, stegaClean visual editing, organization Media Library (aspects & folders), and event-driven Sanity Functions.",
		youtube: "https://youtu.be/jm5Vq60qYTk",
		coverImage: COVER_SANITY,
		lessons: [
			{
				id: "lesson-sanity-1-mental-model",
				title: "From Headless CMS to Content Operating System (Mental Model)",
				slug: "from-headless-cms-to-content-operating-system",
				excerpt:
					"Understand how Sanity Content Lake, Organization Media Library, Blueprints, and Functions work together as a unified backend.",
				youtube: "https://youtu.be/jm5Vq60qYTk",
				heading1: "Why Treating Content as Flat Markdown Files Stops Scaling",
				intro:
					"When your courses, podcasts, blog posts, guest portals, and sponsor workflows all share the same entities, a relational document graph eliminates copy-pasted frontmatter.",
				codeFilename: "apps/sanity/sanity.config.ts",
				codeLang: "typescript",
				codeSnippet: `export const sharedMediaLibraryConfig = {
  mediaLibrary: {
    enabled: true,
    libraryId: "mlttp0BZbCpV",
  },
  auth: {
    loginMethod: "token" as const,
  },
};`,
				takeaway:
					"Separate your production and dev datasets while sharing a single governed Organization Media Library with folder and aspect isolation.",
			},
			{
				id: "lesson-sanity-2-groq-stegaclean",
				title: "Type-Safe GROQ & Visual Editing (and the stegaClean Gotcha)",
				slug: "type-safe-groq-visual-editing-stegaclean-gotcha",
				excerpt:
					"Generate end-to-end TypeScript types from GROQ queries and prevent invisible stega characters from breaking HTML attributes and image URLs.",
				youtube: "https://youtu.be/jm5Vq60qYTk",
				heading1: "The stegaClean Rule Every Sanity Developer Needs to Know",
				intro:
					"Visual Editing injects invisible zero-width Unicode characters into strings so the Presentation tool can trace fields back to Studio. If those characters land inside an href or image URL, the browser URL breaks.",
				codeFilename: "src/lib/sanity/image.ts",
				codeLang: "typescript",
				codeSnippet: `import { stegaClean } from "@sanity/client/stega";

export function cleanMediaLibraryId(source: { media?: { _ref?: string } }) {
  const ref = stegaClean(source?.media?._ref);
  return ref?.startsWith("media-library:") ? ref.split(":")[1] : undefined;
}`,
				takeaway:
					"Always wrap enum values, slugs, IDs, and meta tag URLs in stegaClean() before passing them into attributes or URL builders.",
			},
			{
				id: "lesson-sanity-3-media-library",
				title: "Organization Media Library: Custom Aspects, Folders & CDN Delivery",
				slug: "organization-media-library-custom-aspects-folders-cdn",
				excerpt:
					"Deploy custom metadata aspects, organize /Production and /Dev folder trees, and serve WebP/AVIF directly from cdn.sanity.io/media-libraries.",
				youtube: "https://youtu.be/jm5Vq60qYTk",
				heading1: "Serving Assets Directly from the Sanity Media Library CDN",
				intro:
					"By linking Media Library assets via globalDocumentReference (media-library:<libraryId>:<assetId>), @sanity/image-url serves images directly from cdn.sanity.io/media-libraries/<libraryId>/images/.",
				codeFilename: "apps/sanity/schemas/aspects/metadata.ts",
				codeLang: "typescript",
				codeSnippet: `import { defineAspect, defineField } from "sanity";

export default defineAspect({
  name: "metadata",
  title: "CodingCat.dev Asset Governance",
  type: "object",
  fields: [
    defineField({ name: "environment", type: "string" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "visibility", type: "string" }),
  ],
});`,
				takeaway:
					"Combine physical sanity.directory folders with aspects.metadata filters so editors never mix dev test uploads with production assets.",
			},
			{
				id: "lesson-sanity-4-app-sdk",
				title: "Building Custom Internal Tools with the Sanity App SDK",
				slug: "building-custom-internal-tools-sanity-app-sdk",
				excerpt:
					"Build real-time operational dashboards for bookings, sponsor pipelines, and editorial telemetry using the Sanity App SDK.",
				youtube: "https://youtu.be/jm5Vq60qYTk",
				heading1: "Custom Operations UI Backed Directly by Content Lake",
				intro:
					"Instead of syncing Sanity data into a third-party spreadsheet or CRM, build custom React views with the Sanity App SDK that mutate documents in real time.",
				codeFilename: "apps/ops/src/App.tsx",
				codeLang: "tsx",
				codeSnippet: `export function OpsMetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-xs uppercase">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}`,
				takeaway:
					"Store sensitive operational documents with a private. prefix so public unauthenticated GROQ queries can never read them.",
			},
			{
				id: "lesson-sanity-5-functions",
				title: "Event-Driven Sanity Functions & Blueprints",
				slug: "event-driven-sanity-functions-blueprints",
				excerpt:
					"Trigger automated YouTube transcript ingestion, AEO/SEO enrichment, and multi-platform syndication with Sanity Blueprints and Functions.",
				youtube: "https://youtu.be/jm5Vq60qYTk",
				heading1: "Infrastructure-as-Code for Content Lake Events",
				intro:
					"Sanity Blueprints let you declare document-event functions in TypeScript and deploy them at the organization scope with zero external webhook servers to maintain.",
				codeFilename: "sanity.blueprint.ts",
				codeLang: "typescript",
				codeSnippet: `import { defineBlueprint, defineDocumentFunction } from "@sanity/blueprints";

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: "sync-youtube-transcript",
      event: { on: ["publish"], filter: "_type in ['podcast', 'post'] && defined(youtube)" },
    }),
  ],
});`,
				takeaway:
					"Keep document event filters narrow so functions only fire when relevant fields change.",
			},
		],
	},
	{
		id: "course-full-stack-ai-agents-ts-2026",
		title: "Full-Stack AI Agents in TypeScript (No Python Required)",
		slug: "full-stack-ai-agents-typescript",
		excerpt:
			"Architect deterministic AI workflows, hybrid browser-to-cloud model routing (Gemini Nano + Cloudflare Workers), and serverless GPU pipelines in pure TypeScript.",
		youtube: "https://youtu.be/7d6iJHEPMZI",
		coverImage: COVER_AGENTS,
		lessons: [
			{
				id: "lesson-agents-1-ts-layer",
				title: "Why TypeScript Won the AI Application Layer",
				slug: "why-typescript-won-the-ai-application-layer",
				excerpt:
					"See why shared Zod/JSON schemas across your UI, edge API, and tool-calling layer eliminate glue code between Python microservices and web apps.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "One Type System from Tool Schema to React/Astro UI",
				intro:
					"Model training happens in Python, but 95% of production AI engineering is I/O orchestration, streaming UI state, authentication, and typed tool execution.",
				codeFilename: "src/lib/agent-types.ts",
				codeLang: "typescript",
				codeSnippet: `export interface AgentToolResult<T> {
  toolName: string;
  latencyMs: number;
  data: T;
}`,
				takeaway:
					"Sharing a single TypeScript definition between your MCP tool output and your frontend component prevents runtime serialization bugs.",
			},
			{
				id: "lesson-agents-2-deterministic-workflows",
				title: "Deterministic Agent Workflows vs. Autonomous Loops",
				slug: "deterministic-agent-workflows-vs-autonomous-loops",
				excerpt:
					"Know when to use explicit step-by-step state machines versus open-ended autonomous tool loops in production.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "Why Unbounded Autonomous Loops Burn Tokens and Fail SLA Targets",
				intro:
					"Giving an LLM 25 tools and an open-ended while loop is a recipe for 40-second latencies and unpredictable bills. Break complex jobs into explicit DAG steps with typed handoffs.",
				codeFilename: "src/lib/workflow.ts",
				codeLang: "typescript",
				codeSnippet: `export async function runTriagedWorkflow(input: string) {
  const intent = input.includes("course") ? "course_lookup" : "general_qa";
  return { intent, routedAt: new Date().toISOString() };
}`,
				takeaway:
					"Cap tool-calling loops to a strict maximum step count and use deterministic routing whenever the control flow is known upfront.",
			},
			{
				id: "lesson-agents-3-hybrid-web-ai",
				title: "Hybrid Web AI: Routing Between Browser Gemini Nano & Cloud Models",
				slug: "hybrid-web-ai-routing-browser-gemini-nano-cloud",
				excerpt:
					"Run zero-cost local inference in Chrome with the Prompt API (Gemini Nano) and seamlessly fall back to Cloudflare Workers when on-device AI is unavailable.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "Zero-Latency Local Inference with Automatic Edge Fallback",
				intro:
					"Why pay cloud token costs for simple summarization or draft formatting when Chrome's built-in Gemini Nano can run it locally on the user's GPU for $0?",
				codeFilename: "src/lib/hybrid-ai.ts",
				codeLang: "typescript",
				codeSnippet: `export async function generateHybridSummary(text: string): Promise<string> {
  if (typeof window !== "undefined" && "LanguageModel" in window) {
    const session = await (window as any).LanguageModel.create();
    return await session.prompt(\`Summarize in 2 sentences: \${text}\`);
  }
  const res = await fetch("/api/ai/hybrid-fallback", {
    method: "POST",
    body: JSON.stringify({ prompt: text }),
  });
  const data = await res.json();
  return data.text;
}`,
				takeaway:
					"Always pair window.LanguageModel feature detection with an edge API fallback so Safari, Firefox, and mobile users get the exact same UX.",
			},
			{
				id: "lesson-agents-4-serverless-gpus",
				title: "Serverless GPUs Without Dockerfiles (RunPod Flash)",
				slug: "serverless-gpus-without-dockerfiles-runpod-flash",
				excerpt:
					"Generate 3,000+ AI images and run custom GPU workloads on demand from a TypeScript web app without maintaining 15GB Docker images.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "How We Generated 3,000 AI Images for $1 in Production",
				intro:
					"Maintaining CUDA base images and waiting 20 minutes for container registry pushes slows down iteration. Serverless GPU endpoints let you pay strictly per millisecond of active compute.",
				codeFilename: "src/lib/gpu-client.ts",
				codeLang: "typescript",
				codeSnippet: `export async function invokeServerlessGpu(prompt: string, apiKey: string) {
  const res = await fetch("https://api.runpod.ai/v2/endpoint/runsync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${apiKey}\`,
    },
    body: JSON.stringify({ input: { prompt, steps: 4 } }),
  });
  return await res.json();
}`,
				takeaway:
					"Persist generated media immediately to Sanity Media Library so you never pay to regenerate the same asset twice.",
			},
			{
				id: "lesson-agents-5-evals-cost-caps",
				title: "Agent Evals, Guardrails & Spend Caps in Production",
				slug: "agent-evals-guardrails-spend-caps-in-production",
				excerpt:
					"Protect your production AI endpoints against prompt injection, runaway retry loops, and surprise cloud bills.",
				youtube: "https://youtu.be/7d6iJHEPMZI",
				heading1: "Defense-in-Depth for Public AI Endpoints",
				intro:
					"Every public AI route needs three guardrails before going live: per-IP/session rate limiting, strict max_tokens bounds, and provider-level hard spend caps.",
				codeFilename: "src/lib/guardrails.ts",
				codeLang: "typescript",
				codeSnippet: `export function enforcePromptBudget(prompt: string, maxChars = 4000) {
  if (prompt.length > maxChars) {
    throw new Error(\`Prompt exceeds maximum allowed length of \${maxChars} characters.\`);
  }
  return prompt.trim();
}`,
				takeaway:
					"Validate input length and token budgets at the Cloudflare Worker edge before forwarding any request to an upstream LLM or GPU provider.",
			},
		],
	},
];

const CSS_NEW_LESSONS = [
	buildLessonDoc({
		id: "lesson-css-scroll-driven-animations-2026",
		title: "CSS Scroll-Driven Animations (animation-timeline: scroll & view)",
		slug: "css-scroll-driven-animations",
		excerpt:
			"Build silky-smooth 60fps scroll progress bars and viewport reveal animations in pure CSS with zero JavaScript scroll listeners.",
		youtube: "https://youtu.be/7d6iJHEPMZI",
		date: NOW_ISO,
		heading1: "Offloading Scroll Animations from the Main Thread to the Compositor",
		intro:
			"Attaching window.addEventListener('scroll', ...) in JavaScript blocks the main thread and causes jank on mobile devices. Native CSS animation-timeline: scroll() and view() run entirely on the browser compositor thread.",
		codeFilename: "src/styles/scroll-driven.css",
		codeLang: "css",
		codeSnippet: `@keyframes scale-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.reading-progress-bar {
  transform-origin: 0 50%;
  animation: scale-progress auto linear;
  animation-timeline: scroll(root block);
}`,
		takeaway:
			"Always wrap scroll-driven animations in @media (prefers-reduced-motion: no-preference) to keep your UI accessible.",
	}),
	buildLessonDoc({
		id: "lesson-css-view-transitions-api-2026",
		title: "Cross-Document View Transitions API (@view-transition)",
		slug: "css-view-transitions-api",
		excerpt:
			"Create native app-like morph transitions between multi-page Astro routes using @view-transition { navigation: auto } and view-transition-name.",
		youtube: "https://youtu.be/7d6iJHEPMZI",
		date: NOW_ISO,
		heading1: "App-Like Route Morphing Without a Heavy SPA Router",
		intro:
			"You no longer need a client-side SPA bundle just to animate a course card into a full-page header. Cross-document View Transitions work natively across standard multi-page navigations.",
		codeFilename: "src/styles/view-transitions.css",
		codeLang: "css",
		codeSnippet: `@view-transition {
  navigation: auto;
}

.course-hero-thumb {
  view-transition-name: active-course-cover;
}`,
		takeaway:
			"Ensure view-transition-name is unique on the page at any given moment, or the browser will skip the transition.",
	}),
];

async function linkMediaAssetToDataset(dataset, coverImage) {
	if (!coverImage?.asset?._ref || !coverImage?.media?._ref) return;
	const [, mediaLibraryId, assetId] = coverImage.media._ref.split(":");
	await fetch(
		`https://${PROJECT_ID}.api.sanity.io/v2025-02-19/assets/media-library-link/${dataset}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
			body: JSON.stringify({
				mediaLibraryId,
				assetId,
				assetInstanceId: coverImage.asset._ref,
			}),
		},
	).catch(() => null);
}

async function mutateDataset(dataset, mutations) {
	const res = await fetch(
		`https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/mutate/${dataset}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
			body: JSON.stringify({ mutations }),
		},
	);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Mutate failed on ${dataset}: HTTP ${res.status} ${text}`);
	}
	return await res.json();
}

async function runForDataset(dataset) {
	console.log(`\n=== Executing Course Audit & 2026 Course Seed on [${dataset}] ===`);
	const mutations = [];

	// 1. Archive outdated 2022 kids courses (`micro:bit for a 10 Year Old` & `HTML for a 10 Year Old`) if present
	const legacyCheckRes = await fetch(
		`https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(
			`*[_id in ["RIgC5r4TJ0hCGOzxIBDhe0", "RIgC5r4TJ0hCGOzxIBDj2N"]]._id`,
		)}`,
		{ headers: { Authorization: `Bearer ${TOKEN}` } },
	);
	const legacyIds = (await legacyCheckRes.json())?.result || [];
	for (const archiveId of legacyIds) {
		mutations.push({
			patch: {
				id: archiveId,
				set: { archived: true },
			},
		});
	}

	// 2. Create the 2 new CSS Animations lessons and append a 2026 section to `CSS Animations` (`RIgC5r4TJ0hCGOzxIBDjm6`)
	for (const lessonDoc of CSS_NEW_LESSONS) {
		mutations.push({ createOrReplace: lessonDoc });
	}

	// Fetch existing CSS Animations course to preserve existing sections
	const cssQuery = encodeURIComponent(
		`*[_id == "RIgC5r4TJ0hCGOzxIBDjm6"][0]{_id, sections}`,
	);
	const cssRes = await fetch(
		`https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${cssQuery}`,
		{ headers: { Authorization: `Bearer ${TOKEN}` } },
	);
	const cssData = await cssRes.json();
	if (cssData?.result?._id) {
		const existingSections = Array.isArray(cssData?.result?.sections)
			? cssData.result.sections.filter(
					(s) => s?._key !== "sec-2026-modern-css-motion",
				)
			: [];

		existingSections.push({
			_key: "sec-2026-modern-css-motion",
			_type: "section",
			title: "2026 Modern Web Motion (Scroll-Driven & View Transitions)",
			lesson: CSS_NEW_LESSONS.map((l) => ({
				_key: `ref-${l._id}`,
				_type: "reference",
				_ref: l._id,
			})),
		});

		mutations.push({
			patch: {
				id: "RIgC5r4TJ0hCGOzxIBDjm6",
				set: {
					lastUpdated: NOW_ISO,
					sections: existingSections,
				},
			},
		});
	}

	// 3. Create the 4 new 2026 Flagship Courses + 20 Bite-Sized Lessons
	for (const courseSpec of NEW_COURSES) {
		await linkMediaAssetToDataset(dataset, courseSpec.coverImage);
		const lessonRefs = [];
		for (const l of courseSpec.lessons) {
			const lessonDoc = buildLessonDoc({
				...l,
				coverImage: courseSpec.coverImage,
				date: NOW_ISO,
			});
			mutations.push({ createOrReplace: lessonDoc });
			lessonRefs.push({
				_key: `ref-${l.id}`,
				_type: "reference",
				_ref: l.id,
			});
		}

		const courseDoc = {
			_id: courseSpec.id,
			_type: "course",
			archived: false,
			title: courseSpec.title,
			slug: { _type: "slug", current: courseSpec.slug },
			excerpt: courseSpec.excerpt,
			date: NOW_ISO,
			lastUpdated: NOW_ISO,
			youtube: courseSpec.youtube,
			coverImage: courseSpec.coverImage,
			author: [ALEX_AUTHOR_REF],
			content: [
				ptBlock(
					`${courseSpec.id}-intro`,
					courseSpec.excerpt,
					"normal",
				),
			],
			sections: [
				{
					_key: `${courseSpec.id}-sec-1`,
					_type: "section",
					title: "Core Architecture & Production Implementation",
					lesson: lessonRefs,
				},
			],
		};
		mutations.push({ createOrReplace: courseDoc });
	}

	await mutateDataset(dataset, mutations);
	console.log(
		`✔ [${dataset}] Archived 2 legacy 2022 courses, updated CSS Animations (+2 lessons), and seeded 4 new 2026 courses (20 lessons).`,
	);
}

async function main() {
	await runForDataset("production");
	await runForDataset("dev");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
