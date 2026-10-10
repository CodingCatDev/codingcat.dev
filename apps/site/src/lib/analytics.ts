/**
 * Cloudflare Workers Analytics Engine — Zero-Overhead Edge & Click Telemetry
 *
 * Schema Mapping (`codingcat_events_prod` / `codingcat_events_dev`):
 * - `index1`: `actorCategory` ("ai_bot" | "search_bot" | "social_bot" | "agent_client" | "human" | "client_event")
 * - `blob1`:  `eventType` ("page_view" | "markdown_read" | "bot_crawl" | "mcp_call" | "search_api" | "chat_api" | "outbound_click" | "podcast_listen" | "sponsor_click" | "ui_interaction" | "lms_event")
 * - `blob2`:  `pathname` (e.g. "/post/dockerless-serverless-gpus...")
 * - `blob3`:  `actorName` (e.g. "GPTBot", "ClaudeBot", "PerplexityBot", "browser", etc.)
 * - `blob4`:  `targetOrDetail` (e.g. clicked URL, MCP tool name, search query, or Referer host)
 * - `blob5`:  `refererHost` (e.g. "www.google.com", "dev.to", "news.ycombinator.com", "direct")
 * - `blob6`:  `country` (e.g. "US", "GB", "DE")
 * - `double1`: `statusCode` (e.g. 200, 404)
 * - `double2`: `durationMs` (edge response latency in ms or client event value)
 *
 * Example Cloudflare Analytics Engine SQL Queries:
 * 1. Top AI Bots & Agents Crawling CodingCat.dev:
 *    SELECT blob3 AS bot, blob1 AS event_type, count() AS hits
 *    FROM codingcat_events_prod
 *    WHERE index1 IN ('ai_bot', 'agent_client')
 *    GROUP BY bot, event_type ORDER BY hits DESC
 *
 * 2. Most Clicked Outbound / Sponsor / Podcast Links:
 *    SELECT blob1 AS event_type, blob2 AS page, blob4 AS target_url, count() AS clicks
 *    FROM codingcat_events_prod
 *    WHERE index1 = 'client_event'
 *    GROUP BY event_type, page, target_url ORDER BY clicks DESC
 */

export type ActorCategory =
	| "ai_bot"
	| "search_bot"
	| "social_bot"
	| "agent_client"
	| "human"
	| "client_event";

export interface AnalyticsEngineDataset {
	writeDataPoint(event: {
		indexes?: [string];
		blobs?: string[];
		doubles?: number[];
	}): void;
}

const AI_BOT_PATTERNS: Array<[RegExp, string]> = [
	[/GPTBot/i, "GPTBot"],
	[/OAI-SearchBot/i, "OAI-SearchBot"],
	[/ChatGPT-User/i, "ChatGPT-User"],
	[/ClaudeBot/i, "ClaudeBot"],
	[/Claude-Web/i, "Claude-Web"],
	[/anthropic-ai/i, "Anthropic-AI"],
	[/PerplexityBot/i, "PerplexityBot"],
	[/Perplexity-User/i, "Perplexity-User"],
	[/Google-Extended/i, "Google-Extended"],
	[/Applebot-Extended/i, "Applebot-Extended"],
	[/Meta-ExternalAgent|FacebookBot/i, "Meta-AI"],
	[/Bytespider/i, "Bytespider"],
	[/CCBot/i, "CCBot"],
	[/cohere-ai/i, "Cohere-AI"],
	[/YouBot/i, "YouBot"],
	[/Amazonbot/i, "Amazonbot"],
	[/DuckAssistBot/i, "DuckAssistBot"],
];

const SEARCH_BOT_PATTERNS: Array<[RegExp, string]> = [
	[/Googlebot/i, "Googlebot"],
	[/bingbot/i, "Bingbot"],
	[/DuckDuckBot/i, "DuckDuckBot"],
	[/YandexBot/i, "YandexBot"],
	[/Baiduspider/i, "Baiduspider"],
];

const SOCIAL_BOT_PATTERNS: Array<[RegExp, string]> = [
	[/Twitterbot/i, "Twitterbot"],
	[/LinkedInBot/i, "LinkedInBot"],
	[/Slackbot/i, "Slackbot"],
	[/Discordbot/i, "Discordbot"],
	[/facebookexternalhit/i, "FacebookPreview"],
	[/WhatsApp/i, "WhatsApp"],
	[/TelegramBot/i, "TelegramBot"],
];

export function classifyActor(
	userAgent: string,
	wantsMarkdown: boolean,
	pathname: string,
): { category: ActorCategory; actorName: string } {
	for (const [regex, name] of AI_BOT_PATTERNS) {
		if (regex.test(userAgent)) {
			return { category: "ai_bot", actorName: name };
		}
	}
	for (const [regex, name] of SEARCH_BOT_PATTERNS) {
		if (regex.test(userAgent)) {
			return { category: "search_bot", actorName: name };
		}
	}
	for (const [regex, name] of SOCIAL_BOT_PATTERNS) {
		if (regex.test(userAgent)) {
			return { category: "social_bot", actorName: name };
		}
	}
	if (
		wantsMarkdown ||
		pathname.startsWith("/api/mcp") ||
		pathname.startsWith("/.well-known/") ||
		pathname === "/llms.txt" ||
		/curl|python|node|undici|axios|got|claude-code|mcp/i.test(userAgent)
	) {
		const shortUa = userAgent.split(" ")[0]?.slice(0, 48) || "agent";
		return { category: "agent_client", actorName: shortUa };
	}
	return { category: "human", actorName: "browser" };
}

function extractHost(urlStr: string | null): string {
	if (!urlStr) return "direct";
	try {
		return new URL(urlStr).hostname || "direct";
	} catch {
		return "direct";
	}
}

export function trackEdgeRequest(options: {
	env: Record<string, unknown>;
	request: Request;
	pathname: string;
	statusCode: number;
	durationMs: number;
	wantsMarkdown: boolean;
	detail?: string;
}): void {
	const dataset = options.env.ANALYTICS as AnalyticsEngineDataset | undefined;
	if (!dataset || typeof dataset.writeDataPoint !== "function") return;

	const { request, pathname, statusCode, durationMs, wantsMarkdown } = options;

	// Skip static asset noise (_astro/*, favicons, images)
	if (
		pathname.startsWith("/_astro/") ||
		pathname.startsWith("/favicon") ||
		pathname.endsWith(".png") ||
		pathname.endsWith(".ico") ||
		pathname.endsWith(".svg") ||
		pathname.endsWith(".woff2")
	) {
		return;
	}

	const userAgent = request.headers.get("user-agent") || "";
	const { category, actorName } = classifyActor(
		userAgent,
		wantsMarkdown,
		pathname,
	);

	let eventType = "page_view";
	if (wantsMarkdown) {
		eventType = "markdown_read";
	} else if (pathname.startsWith("/api/mcp")) {
		eventType = "mcp_call";
	} else if (pathname.startsWith("/api/search")) {
		eventType = "search_api";
	} else if (pathname.startsWith("/api/chat")) {
		eventType = "chat_api";
	} else if (category === "ai_bot" || category === "search_bot" || category === "social_bot") {
		eventType = "bot_crawl";
	}

	const refererHost = extractHost(request.headers.get("referer"));
	const cf = (request as Request & { cf?: { country?: string } }).cf;
	const country =
		cf?.country || request.headers.get("cf-ipcountry") || "XX";
	const targetOrDetail =
		options.detail ||
		new URL(request.url).searchParams.get("q") ||
		refererHost;

	try {
		dataset.writeDataPoint({
			indexes: [category],
			blobs: [
				eventType,
				pathname.slice(0, 256),
				actorName.slice(0, 64),
				targetOrDetail.slice(0, 256),
				refererHost.slice(0, 128),
				country.slice(0, 8),
			],
			doubles: [statusCode, Math.round(durationMs)],
		});
	} catch {
		// Never fail a user request due to telemetry
	}
}

export function trackClientBeaconEvent(options: {
	env: Record<string, unknown>;
	request: Request;
	eventType: string;
	pathname: string;
	target?: string;
	label?: string;
	value?: number;
}): void {
	const dataset = options.env.ANALYTICS as AnalyticsEngineDataset | undefined;
	if (!dataset || typeof dataset.writeDataPoint !== "function") return;

	const refererHost = extractHost(options.request.headers.get("referer"));
	const cf = (options.request as Request & { cf?: { country?: string } }).cf;
	const country =
		cf?.country || options.request.headers.get("cf-ipcountry") || "XX";

	try {
		dataset.writeDataPoint({
			indexes: ["client_event"],
			blobs: [
				options.eventType.slice(0, 64),
				options.pathname.slice(0, 256),
				(options.label || "interaction").slice(0, 128),
				(options.target || "").slice(0, 256),
				refererHost.slice(0, 128),
				country.slice(0, 8),
			],
			doubles: [200, Math.round(options.value ?? 1)],
		});
	} catch {
		// Never fail beacon response
	}
}
