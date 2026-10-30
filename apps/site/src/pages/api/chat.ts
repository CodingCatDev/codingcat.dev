import { env } from "cloudflare:workers";
import { createMCPClient } from "@ai-sdk/mcp";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { isStepCount, jsonSchema, streamText, tool } from "ai";
import type { APIRoute } from "astro";
import { createWorkersAI } from "workers-ai-provider";
import { isForbiddenPrivateQuery } from "@/lib/portal-security";
import { createResilientClient } from "@/lib/sanity/client";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "@/lib/sanity/queries";

export const prerender = false;

export const CLAIRIC_MODEL_ID = "@cf/cloudflare/clairic";

export type ExtractedChatIntent =
	| "recent_content"
	| "top_videos"
	| "topic_search"
	| "author_lookup"
	| "joke_or_kb";

export interface ClairicExtractedParameters {
	intent: ExtractedChatIntent;
	contentType: "all" | "podcast" | "post" | "author" | "guest";
	searchQuery: string | null;
	limit: number;
	confidence: number;
	pNull: number;
	source: "clairic" | "fastpath";
	latencyMs: number;
	clairicError?: string;
}

const SANITY_CONTEXT_MCP_URL =
	"https://api.sanity.io/v1/context/organizations/ovF2qiKSO/mcp/agent-aj-mcp";

function unwrapClairicField(
	answers: Record<string, any> | undefined,
	key: string,
): { value: any; confidence: number; pNull: number } {
	const entry = answers?.[key];
	if (
		entry &&
		typeof entry === "object" &&
		("value" in entry || "confidence" in entry || "p_null" in entry)
	) {
		return {
			value: entry.value,
			confidence: typeof entry.confidence === "number" ? entry.confidence : 1,
			pNull: typeof entry.p_null === "number" ? entry.p_null : 0,
		};
	}
	return {
		value: entry,
		confidence: entry != null ? 0.9 : 0,
		pNull: entry != null ? 0 : 1,
	};
}

function normalizeContentType(
	raw: unknown,
	promptLower: string,
): "all" | "podcast" | "post" | "author" | "guest" {
	const val = typeof raw === "string" ? raw.toLowerCase().trim() : "";
	if (val.includes("podcast") || val.includes("episode")) {
		return "podcast";
	}
	if (val.includes("post") || val.includes("blog") || val.includes("article")) {
		return "post";
	}
	if (val.includes("author") || val.includes("host")) {
		return "author";
	}
	if (val.includes("guest")) {
		return "guest";
	}

	if (/\b(?:podcast|podcasts|episode|episodes)\b/.test(promptLower)) {
		return "podcast";
	}
	if (
		/\b(?:blog|post|posts|article|articles|tutorial|tutorials)\b/.test(
			promptLower,
		)
	) {
		return "post";
	}
	if (/\b(?:author|authors|host|hosts)\b/.test(promptLower)) {
		return "author";
	}
	if (/\b(?:guest|guests)\b/.test(promptLower)) {
		return "guest";
	}
	return "all";
}

function normalizeIntent(
	rawIntent: unknown,
	promptLower: string,
	searchQuery: string | null,
): ExtractedChatIntent | null {
	if (/\b(?:joke|jokes|dad joke|funny|humor|jeff dean)\b/.test(promptLower)) {
		return "joke_or_kb";
	}
	if (
		/\b(?:top video|top videos|popular video|popular videos|most viewed|youtube video|youtube videos)\b/.test(
			promptLower,
		)
	) {
		return "top_videos";
	}
	if (
		(/^(?:the\s+)?(?:latest|newest|most\s+recent|recent|what'?s\s+new)[?!.]*$/i.test(
			promptLower,
		) ||
			(/\b(?:latest|newest|most recent|recent)\b/.test(promptLower) &&
				/\b(?:podcast|podcasts|episode|episodes|blog|post|posts|article|articles|content|show|shows)\b/.test(
					promptLower,
				))) &&
		!searchQuery
	) {
		return "recent_content";
	}

	const val =
		typeof rawIntent === "string" ? rawIntent.toLowerCase().trim() : "";
	if (val.includes("joke") || val.includes("kb") || val.includes("knowledge")) {
		return "joke_or_kb";
	}
	if (val.includes("top_video") || val.includes("video")) {
		return "top_videos";
	}
	if (val.includes("recent") || val.includes("latest")) {
		return "recent_content";
	}
	if (val.includes("author")) {
		return "author_lookup";
	}
	if (val.includes("topic") || val.includes("search")) {
		return "topic_search";
	}

	return null;
}

function extractFallbackTopicQuery(prompt: string): string | null {
	const cleaned = prompt
		.replace(
			/^(?:what|which|do you have|can you find|find|search|show me|list|recommend|tell me about|are there|any)\s+/i,
			"",
		)
		.replace(
			/\b(?:podcasts?|episodes?|blog\s+posts?|posts?|articles?|tutorials?|videos?|on\s+codingcat(?:\.dev)?|codingcat(?:\.dev)?|about|on|for|with|featuring|by)\b/gi,
			" ",
		)
		.replace(/[?!.,;:"']/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return cleaned.length >= 2 ? cleaned : null;
}

export async function extractIntentWithClairic(
	prompt: string,
	aiBinding?: unknown,
): Promise<ClairicExtractedParameters | null> {
	const startMs = Date.now();
	const trimmed = prompt.trim();
	if (!trimmed) {
		return null;
	}
	const promptLower = trimmed.toLowerCase();
	let clairicErrorMsg: string | undefined;

	if (aiBinding && typeof (aiBinding as any).run === "function") {
		try {
			const response = await (aiBinding as any).run(CLAIRIC_MODEL_ID, {
				model: "clairic",
				state: trimmed,
				fields: {
					intent: {
						type: "text",
						instructions:
							"Classify user intent as exactly one of: 'recent_content' (asking for latest, newest, or recent podcasts, episodes, blog posts, or articles), 'top_videos' (asking for top videos or popular YouTube episodes), 'joke_or_kb' (asking for a joke, programming dad joke, Git joke, SQL joke, Jeff Dean fact, or knowledge base entry), 'author_lookup' (searching for an author profile), or 'topic_search' (searching for podcasts, posts, tutorials, or guests about a specific topic, technology, or person).",
					},
					content_type: {
						type: "text",
						instructions:
							"Content type filter if specified by the user: 'podcast', 'post', 'author', 'guest', or 'all'.",
					},
					search_query: {
						type: "text",
						instructions:
							"The specific topic, technology, framework, guest name, or keywords to search for (e.g. 'Sanity', 'SvelteKit', 'Guillermo Rauch', 'Next.js'). Leave null if asking only for latest/recent content, top videos, or a random joke.",
					},
					limit: {
						type: "number",
						decimals: 0,
						instructions:
							"Number of items requested by the user (default 5, max 10).",
					},
				},
			});

			const answers =
				response?.answers ||
				response?.result?.answers ||
				(response && typeof response === "object" ? response : undefined);
			const intentField = unwrapClairicField(answers, "intent");
			const typeField = unwrapClairicField(answers, "content_type");
			const queryField = unwrapClairicField(answers, "search_query");
			const limitField = unwrapClairicField(answers, "limit");

			const rawSearchQuery =
				queryField.pNull < 0.6 &&
				typeof queryField.value === "string" &&
				queryField.value.trim().length > 0 &&
				queryField.value.trim().toLowerCase() !== "null"
					? queryField.value.trim()
					: null;

			const resolvedIntent = normalizeIntent(
				intentField.value,
				promptLower,
				rawSearchQuery,
			);

			if (
				resolvedIntent &&
				intentField.confidence >= 0.5 &&
				intentField.pNull < 0.6
			) {
				const contentType = normalizeContentType(typeField.value, promptLower);
				const searchQuery =
					resolvedIntent === "topic_search" ||
					resolvedIntent === "author_lookup"
						? rawSearchQuery || extractFallbackTopicQuery(trimmed)
						: rawSearchQuery;
				const parsedLimit = Number(limitField.value);
				const limit =
					Number.isFinite(parsedLimit) && parsedLimit >= 1
						? Math.min(Math.round(parsedLimit), 10)
						: 5;

				return {
					intent: resolvedIntent,
					contentType,
					searchQuery,
					limit,
					confidence: intentField.confidence,
					pNull: intentField.pNull,
					source: "clairic",
					latencyMs: Date.now() - startMs,
				};
			}
		} catch (clairicErr) {
			clairicErrorMsg =
				clairicErr instanceof Error ? clairicErr.message : String(clairicErr);
			console.warn(
				"[Chat API Clairic extraction warning, using deterministic fast-path]",
				clairicErrorMsg,
			);
		}
	}

	// Deterministic fast-path for unambiguous prompts when Workers AI binding is absent or preview model is unreachable
	const deterministicIntent = normalizeIntent(null, promptLower, null);
	if (deterministicIntent) {
		return {
			intent: deterministicIntent,
			contentType: normalizeContentType(null, promptLower),
			searchQuery:
				deterministicIntent === "topic_search" ||
				deterministicIntent === "author_lookup"
					? extractFallbackTopicQuery(trimmed)
					: null,
			limit: 5,
			confidence: 0.95,
			pNull: 0,
			source: "fastpath",
			latencyMs: Date.now() - startMs,
			...(clairicErrorMsg ? { clairicError: clairicErrorMsg } : {}),
		};
	}

	const fallbackTopic = extractFallbackTopicQuery(trimmed);
	if (fallbackTopic) {
		const contentType = normalizeContentType(null, promptLower);
		return {
			intent: contentType === "author" ? "author_lookup" : "topic_search",
			contentType,
			searchQuery: fallbackTopic,
			limit: 5,
			confidence: 0.85,
			pNull: 0,
			source: "fastpath",
			latencyMs: Date.now() - startMs,
			...(clairicErrorMsg ? { clairicError: clairicErrorMsg } : {}),
		};
	}

	return null;
}

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: {
			"access-control-allow-origin": "*",
			"access-control-allow-methods": "GET, POST, OPTIONS",
			"access-control-allow-headers": "Content-Type, Authorization",
		},
	});
};

function getCandidateMcpTokens(
	cfEnv: Record<string, unknown> | undefined,
): string[] {
	return Array.from(
		new Set(
			[
				cfEnv?.SANITY_CONTEXT_TOKEN as string | undefined,
				process.env.SANITY_CONTEXT_TOKEN,
				cfEnv?.SANITY_AUTH_TOKEN as string | undefined,
				process.env.SANITY_AUTH_TOKEN,
				cfEnv?.SANITY_API_READ_TOKEN as string | undefined,
				process.env.SANITY_API_READ_TOKEN,
				cfEnv?.SANITY_API_WRITE_TOKEN as string | undefined,
				process.env.SANITY_API_WRITE_TOKEN,
			]
				.map((t) => (typeof t === "string" ? t.trim() : ""))
				.filter(Boolean),
		),
	);
}

function extractMcpText(mcpResult: unknown): string {
	if (!mcpResult) {
		return "";
	}
	if (typeof mcpResult === "string") {
		return mcpResult.trim();
	}
	if (typeof mcpResult === "object") {
		const obj = mcpResult as Record<string, unknown>;
		if (Array.isArray(obj.content)) {
			const texts = obj.content
				.map((part: any) =>
					part && typeof part === "object" && typeof part.text === "string"
						? part.text
						: "",
				)
				.filter(Boolean);
			if (texts.length > 0) {
				return texts.join("\n\n").trim();
			}
		}
		if (typeof obj.text === "string") {
			return obj.text.trim();
		}
		if (obj.result !== undefined) {
			return typeof obj.result === "string"
				? obj.result.trim()
				: JSON.stringify(obj.result, null, 2);
		}
	}
	return "";
}

async function connectSanityContextMcp(
	cfEnv: Record<string, unknown> | undefined,
): Promise<{
	client?: Awaited<ReturnType<typeof createMCPClient>>;
	tools: Record<string, any>;
	error?: string;
}> {
	const tokens = getCandidateMcpTokens(cfEnv);
	if (tokens.length === 0) {
		return {
			tools: {},
			error:
				"No Sanity API/Context token configured (SANITY_CONTEXT_TOKEN, SANITY_AUTH_TOKEN, or SANITY_API_READ_TOKEN).",
		};
	}

	let lastError = "";
	for (const token of tokens) {
		let client: Awaited<ReturnType<typeof createMCPClient>> | undefined;
		try {
			client = await createMCPClient({
				transport: {
					type: "http",
					url: SANITY_CONTEXT_MCP_URL,
					headers: {
						Authorization: `Bearer ${token}`,
					},
					redirect: "follow",
					fetch: (input, init) => {
						const sanitizedInit = init ? { ...init } : {};
						if (sanitizedInit.redirect === "error") {
							sanitizedInit.redirect = "follow";
						}
						return globalThis.fetch(input, sanitizedInit);
					},
				},
			});
			const tools = await client.tools();
			return { client, tools: tools || {} };
		} catch (err) {
			lastError = err instanceof Error ? err.message : String(err);
			if (client) {
				try {
					await client.close();
				} catch {}
			}
		}
	}

	console.warn(
		"[Chat API MCP connection warning, using direct Sanity client]",
		lastError,
	);
	return { tools: {}, error: lastError };
}

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const verify = url.searchParams.get("verify") === "1";
	const cfEnv = env as unknown as Record<string, unknown> | undefined;

	let mcpDiagnostic: Record<string, unknown> = {};
	let clairicDiagnostic: Record<string, unknown> = {};
	if (verify) {
		const [mcpRes, clairicRes] = await Promise.all([
			connectSanityContextMcp(cfEnv),
			extractIntentWithClairic(
				"Do you have any podcast episodes about Sanity?",
				cfEnv?.AI,
			),
		]);
		const { client, tools, error } = mcpRes;
		const toolNames = Object.keys(tools);
		mcpDiagnostic = {
			mcpConnected: toolNames.length > 0,
			mcpTools: toolNames,
			...(error ? { mcpError: error } : {}),
		};
		clairicDiagnostic = {
			clairicExtraction: clairicRes,
		};
		if (client) {
			try {
				await client.close();
			} catch {}
		}
	}

	return new Response(
		JSON.stringify({
			status: "ready",
			name: "Agent AJ",
			model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
			extractionModel: CLAIRIC_MODEL_ID,
			cascadeArchitecture: "extract-route-synthesize",
			mcp: SANITY_CONTEXT_MCP_URL,
			...clairicDiagnostic,
			...mcpDiagnostic,
		}),
		{
			status: 200,
			headers: {
				"content-type": "application/json; charset=utf-8",
				"access-control-allow-origin": "*",
			},
		},
	);
};

export const POST: APIRoute = async ({ request }) => {
	const cfEnv = env as unknown as Record<string, unknown> | undefined;
	const sanityToken =
		(cfEnv?.SANITY_API_READ_TOKEN as string | undefined) ||
		(cfEnv?.SANITY_AUTH_TOKEN as string | undefined) ||
		process.env.SANITY_API_READ_TOKEN ||
		process.env.SANITY_AUTH_TOKEN;

	let body: {
		messages?: Array<{ role: string; content: string }>;
		prompt?: string;
	};
	try {
		body = await request.json();
	} catch {
		return new Response(
			JSON.stringify({ error: "Invalid JSON request body" }),
			{
				status: 400,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}

	const messages =
		body.messages ||
		(body.prompt ? [{ role: "user" as const, content: body.prompt }] : []);

	if (!messages.length) {
		return new Response(
			JSON.stringify({ error: "Please provide a prompt or messages array" }),
			{
				status: 400,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}

	// Format messages for Vercel AI SDK
	const coreMessages = messages.map((m) => ({
		role: (m.role === "assistant" || m.role === "user" || m.role === "system"
			? m.role
			: "user") as "user" | "assistant" | "system",
		content: m.content,
	}));

	const latestUserMessage =
		[...coreMessages]
			.reverse()
			.find((m) => m.role === "user")
			?.content?.trim() || "";

	let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | undefined;

	try {
		// SECURITY CHECKPOINT: Agent AJ Chat only queries public published content.
		// Never attach SANITY_API_READ_TOKEN or SANITY_AUTH_TOKEN to sanityClient here
		// so private.** (bookings, sponsorLeads, sponsorPools) and drafts.** cannot be queried.
		const configuredDataset =
			(cfEnv?.PUBLIC_SANITY_DATASET as string) || "production";
		const sanityClient = createResilientClient({
			projectId: (cfEnv?.PUBLIC_SANITY_PROJECT_ID as string) || "hfh83o0w",
			dataset: configuredDataset,
			apiVersion: (cfEnv?.PUBLIC_SANITY_API_VERSION as string) || "2025-09-30",
			useCdn: true,
			perspective: "published",
		});

		const collectedToolItems: Array<{
			title: string;
			type?: string;
			slug?: string;
			url?: string;
			date?: string;
			excerpt?: string;
			youtube?: string | null;
			listenLinks?: Record<string, string | undefined>;
		}> = [];

		const normalizeAndCollectItems = (rawItems: any[]) => {
			const normalized = rawItems
				.filter((item) => item && typeof item === "object")
				.map((item: any) => {
					const slugStr =
						typeof item.slug === "string"
							? item.slug
							: typeof item.slug?.current === "string"
								? item.slug.current
								: undefined;
					const itemType = item.type || item._type || "podcast";
					const url =
						item.url ||
						(slugStr
							? `/${itemType === "podcast" ? "podcast" : itemType === "post" ? "post" : itemType}/${slugStr}`
							: undefined);
					const rawLinks = item.listenLinks || {};
					const spotifyLink =
						rawLinks.spotify || item.spotifyLink || item.spotify?.link;
					const youtubeLink = item.youtube || rawLinks.youtube || undefined;
					const hasAudioOrLinks = Boolean(
						spotifyLink ||
							rawLinks.apple ||
							rawLinks.pocketCasts ||
							rawLinks.castbox ||
							rawLinks.castro,
					);
					const listenLinks =
						itemType === "podcast"
							? {
									...(youtubeLink ? { youtube: youtubeLink } : {}),
									...(spotifyLink ? { spotify: spotifyLink } : {}),
									...(rawLinks.apple
										? { apple: rawLinks.apple }
										: hasAudioOrLinks
											? {
													apple:
														"https://podcasts.apple.com/us/podcast/codingcat-dev-podcast/id1491655542",
												}
											: {}),
									...(rawLinks.pocketCasts
										? { pocketCasts: rawLinks.pocketCasts }
										: {}),
									...(rawLinks.castbox ? { castbox: rawLinks.castbox } : {}),
									...(rawLinks.castro ? { castro: rawLinks.castro } : {}),
									...(rawLinks.overcast
										? { overcast: rawLinks.overcast }
										: hasAudioOrLinks
											? { overcast: "https://overcast.fm/itunes1491655542" }
											: {}),
									...(rawLinks.rss
										? { rss: rawLinks.rss }
										: hasAudioOrLinks
											? { rss: "https://anchor.fm/s/115b203c/podcast/rss" }
											: {}),
								}
							: undefined;
					return {
						title: item.title || item.name || "Untitled",
						type: itemType,
						slug: slugStr,
						url,
						date: item.date || item.publishedAt,
						excerpt: item.excerpt || item.transcriptSummary || "",
						youtube: youtubeLink,
						listenLinks:
							listenLinks && Object.keys(listenLinks).length > 0
								? listenLinks
								: undefined,
					};
				});
			for (const entry of normalized) {
				if (
					entry.title &&
					!collectedToolItems.some(
						(existing) =>
							(entry.url && existing.url === entry.url) ||
							existing.title === entry.title,
					)
				) {
					collectedToolItems.push(entry);
				}
			}
			return normalized;
		};

		// 1. Step 1 (Extract): Run Clairic extraction cascade on user prompt
		const extracted = await extractIntentWithClairic(
			latestUserMessage,
			cfEnv?.AI,
		);

		// 2. Step 2 (Route & Pre-fetch): Execute deterministic Sanity lookup when intent does not require remote KB MCP
		if (extracted && extracted.intent !== "joke_or_kb") {
			const count = Math.min(Math.max(Number(extracted.limit) || 5, 1), 10);
			try {
				if (extracted.intent === "recent_content") {
					const types =
						extracted.contentType === "podcast"
							? ["podcast"]
							: extracted.contentType === "post"
								? ["post"]
								: ["podcast", "post"];
					const recent = await sanityClient.fetch(
						`*[_type in $types && defined(slug.current)] | order(date desc, _createdAt desc)[0...$limit]{
							title,
							_type,
							"slug": slug.current,
							date,
							excerpt,
							youtube,
							listenLinks,
							"spotifyLink": spotify.link
						}`,
						{ types, limit: count },
					);
					if (Array.isArray(recent) && recent.length > 0) {
						normalizeAndCollectItems(recent);
					}
				} else if (extracted.intent === "top_videos") {
					const topVideos = await sanityClient.fetch(
						`*[_type in ["podcast", "post"] && defined(slug.current) && defined(youtube)] | order(coalesce(statistics.youtube.viewCount, 0) desc, date desc)[0...$limit]{
							title,
							_type,
							"slug": slug.current,
							date,
							excerpt,
							youtube,
							listenLinks,
							"spotifyLink": spotify.link
						}`,
						{ limit: count },
					);
					if (Array.isArray(topVideos) && topVideos.length > 0) {
						normalizeAndCollectItems(topVideos);
					}
				} else if (
					(extracted.intent === "topic_search" ||
						extracted.intent === "author_lookup") &&
					extracted.searchQuery
				) {
					const filterType =
						extracted.contentType && extracted.contentType !== "all"
							? extracted.contentType
							: null;
					let searchResults: any[] = [];
					try {
						const semRes = await sanityClient.fetch(semanticSearchQuery, {
							searchTerm: extracted.searchQuery,
							type: filterType,
						});
						if (Array.isArray(semRes) && semRes.length > 0) {
							searchResults = semRes;
						}
					} catch {}
					if (!searchResults.length) {
						try {
							const textRes = await sanityClient.fetch(
								textSearchFallbackQuery,
								{
									searchTerm: extracted.searchQuery,
									type: filterType,
								},
							);
							if (Array.isArray(textRes) && textRes.length > 0) {
								searchResults = textRes;
							}
						} catch {}
					}
					if (searchResults.length > 0) {
						normalizeAndCollectItems(searchResults.slice(0, 10));
					}
				}
			} catch (prefetchErr) {
				console.warn("[Chat API Clairic route prefetch warning]", prefetchErr);
			}
		}

		// Setup AI Model (prefer OpenRouter when configured, fallback to Workers AI)
		const openRouterApiKey =
			(cfEnv?.OPENROUTER_API_KEY as string | undefined) ||
			process.env.OPENROUTER_API_KEY;

		let model: any;
		if (openRouterApiKey) {
			const openrouter = createOpenRouter({
				apiKey: openRouterApiKey,
			});
			model = openrouter("meta-llama/llama-3.3-70b-instruct");
		} else {
			const aiBinding = cfEnv?.AI;
			if (!aiBinding) {
				return new Response(
					JSON.stringify({
						error:
							"Neither OPENROUTER_API_KEY nor Cloudflare Workers AI binding is configured.",
					}),
					{
						status: 500,
						headers: {
							"content-type": "application/json; charset=utf-8",
							"access-control-allow-origin": "*",
						},
					},
				);
			}
			const workersai = createWorkersAI({ binding: aiBinding as any });
			model = workersai("@cf/meta/llama-3.1-8b-instruct");
		}

		const collectedMcpOutputs: Array<{ toolName: string; text: string }> = [];
		const useFastPathSynthesis =
			collectedToolItems.length > 0 && extracted?.intent !== "joke_or_kb";
		const cascadeMode = useFastPathSynthesis ? "clairic-fastpath" : "tool-loop";

		let result: ReturnType<typeof streamText>;

		if (useFastPathSynthesis) {
			// Single-pass tool-free synthesis: skips remote MCP connection and tool-calling loops
			const preFetchedJson = JSON.stringify(
				collectedToolItems.slice(0, 8),
				null,
				2,
			);
			result = streamText({
				model,
				system:
					"You are Agent AJ, the CodingCat.dev mascot and intelligent AI assistant. " +
					"Cloudflare's Clairic extraction model (@cf/cloudflare/clairic) has already extracted the user's query parameters and retrieved the matching CodingCat.dev content below. " +
					"Synthesize these retrieved items into a concise, engaging, helpful response. " +
					"For podcasts and posts, list the relevant titles, brief descriptions, and markdown links using relative paths (e.g. [Episode Title](/podcast/slug) or [Post Title](/post/slug)). " +
					"When an exact YouTube URL is present in the retrieved items (item.youtube), include that exact URL on its own line (e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID). " +
					'NEVER invent placeholder strings like "https://www.youtube.com/watch?v=VIDEO_ID", localhost URLs, or malformed URL brackets.',
				messages: [
					...coreMessages,
					{
						role: "user",
						content: `Extracted Parameters (${extracted?.source}): ${JSON.stringify(
							{
								intent: extracted?.intent,
								contentType: extracted?.contentType,
								searchQuery: extracted?.searchQuery,
							},
						)}\n\nRetrieved CodingCat.dev Content:\n${preFetchedJson}\n\nPlease answer the user's request directly using this retrieved content.`,
					},
				],
				onError: ({ error }) => {
					console.error("[StreamText Clairic Fastpath Error]", error);
				},
			});
		} else {
			// Connect to Sanity Context MCP only when needed (e.g. knowledge_base_read for jokes or complex multi-tool queries)
			const { client: connectedMcpClient, tools: rawMcpTools } =
				await connectSanityContextMcp(cfEnv);
			mcpClient = connectedMcpClient;

			const mcpGroqTool = rawMcpTools.groq_query;
			let initialContextOutline = "";
			let cachedInitialContextResult: unknown;

			if (typeof rawMcpTools.initial_context?.execute === "function") {
				try {
					cachedInitialContextResult =
						await rawMcpTools.initial_context.execute({}, {} as any);
					initialContextOutline = extractMcpText(cachedInitialContextResult);
				} catch (initCtxErr) {
					console.warn(
						"[Chat API initial_context prefetch warning]",
						initCtxErr,
					);
				}
			}

			const ALLOWED_REMOTE_MCP_TOOLS = new Set([
				"knowledge_base_read",
				"initial_context",
			]);
			const wrappedMcpTools: Record<string, any> = {};
			for (const [toolName, mcpTool] of Object.entries(rawMcpTools)) {
				if (
					!ALLOWED_REMOTE_MCP_TOOLS.has(toolName) ||
					!mcpTool ||
					typeof mcpTool !== "object"
				) {
					continue;
				}
				const origExecute = (mcpTool as any).execute;
				if (typeof origExecute === "function") {
					wrappedMcpTools[toolName] = {
						...mcpTool,
						execute: async (args: any, options: any) => {
							const res =
								toolName === "initial_context" &&
								cachedInitialContextResult !== undefined
									? cachedInitialContextResult
									: await origExecute(args, options);
							const text = extractMcpText(res);
							if (text && !(res as any)?.isError) {
								collectedMcpOutputs.push({ toolName, text });
							}
							return res;
						},
					};
				} else {
					wrappedMcpTools[toolName] = mcpTool;
				}
			}

			const tools: Record<string, any> = {
				...wrappedMcpTools,
				search_content: tool({
					description:
						"Search CodingCat.dev articles, podcast episodes, authors, and transcripts using hybrid semantic search and keyword ranking. ALWAYS use this tool first when asked to find, recommend, or query podcasts, articles, or topics (e.g. 'Sanity', 'Firebase', 'Next.js', 'AI', 'web dev').",
					inputSchema: jsonSchema<{
						query: string;
						type?: "all" | "podcast" | "post" | "author" | "guest";
					}>({
						type: "object",
						properties: {
							query: {
								type: "string",
								description:
									"Search terms, topic, or question (e.g. 'Sanity', 'SvelteKit', 'AI SaaS').",
							},
							type: {
								type: "string",
								description:
									"Optional content type filter: 'all', 'podcast', 'post', 'author', 'guest'. Defaults to 'all'.",
								enum: ["all", "podcast", "post", "author", "guest"],
							},
						},
						required: ["query"],
					}),
					execute: async ({ query, type }) => {
						const filterType = type && type !== "all" ? type : null;
						let results: any[] = [];
						try {
							const res = await sanityClient.fetch(semanticSearchQuery, {
								searchTerm: query,
								type: filterType,
							});
							if (Array.isArray(res) && res.length > 0) {
								results = res;
							}
						} catch (semanticErr) {
							console.warn(
								"[search_content semantic error, falling back]",
								semanticErr,
							);
						}

						if (!results.length) {
							try {
								const fallback = await sanityClient.fetch(
									textSearchFallbackQuery,
									{
										searchTerm: query,
										type: filterType,
									},
								);
								if (Array.isArray(fallback)) {
									results = fallback;
								}
							} catch (fallbackErr) {
								console.error("[search_content text error]", fallbackErr);
							}
						}

						return normalizeAndCollectItems(results.slice(0, 10));
					},
				}),
				get_recent_content: tool({
					description:
						"Retrieve the most recently published podcast episodes or blog articles on CodingCat.dev. ALWAYS use this tool first when asked for 'latest podcast', 'recent episodes', 'latest blog post', or 'new articles'.",
					inputSchema: jsonSchema<{
						type?: "all" | "podcast" | "post";
						limit?: number;
					}>({
						type: "object",
						properties: {
							type: {
								type: "string",
								description:
									"Filter by content type: 'all', 'podcast', or 'post'. Defaults to 'all'.",
								enum: ["all", "podcast", "post"],
							},
							limit: {
								type: "integer",
								description: "Number of items to return (default: 5, max: 10).",
							},
						},
					}),
					execute: async ({ type, limit }) => {
						const rawType = type ? String(type).toLowerCase() : "all";
						const types =
							rawType.includes("podcast") || rawType.includes("episode")
								? ["podcast"]
								: rawType.includes("post") ||
										rawType.includes("article") ||
										rawType.includes("blog")
									? ["post"]
									: ["podcast", "post"];
						const count = Math.min(Math.max(Number(limit) || 5, 1), 10);
						try {
							const recent = await sanityClient.fetch(
								`*[_type in $types && defined(slug.current)] | order(date desc, _createdAt desc)[0...$limit]{
									title,
									_type,
									"slug": slug.current,
									date,
									excerpt,
									youtube,
									listenLinks,
									"spotifyLink": spotify.link
								}`,
								{ types, limit: count },
							);
							return normalizeAndCollectItems(recent || []);
						} catch (err) {
							console.error("[get_recent_content error]", err);
							return [];
						}
					},
				}),
				groq_query: tool({
					description:
						"Execute a read-only GROQ query against the CodingCat.dev Sanity dataset. Document types are 'podcast', 'post', 'author', 'guest', and 'sponsor'. Content documents use 'date' (NOT 'publishedAt'), 'title', '\"slug\": slug.current', 'excerpt', and 'youtube'.",
					inputSchema: jsonSchema<{ query: string }>({
						type: "object",
						properties: {
							query: {
								type: "string",
								description:
									"Valid GROQ query (e.g. *[_type == 'podcast' && defined(slug.current)] | order(date desc)[0...5]{title, _type, 'slug': slug.current, date, excerpt, youtube}).",
							},
						},
						required: ["query"],
					}),
					execute: async ({ query }: { query: string }) => {
						if (isForbiddenPrivateQuery(query)) {
							return {
								error:
									"Access denied: Agent AJ only queries public content types (podcast, post, course, lesson, author, guest, sponsor).",
							};
						}
						let cleanQuery = query.trim();
						if (
							!cleanQuery.startsWith("*") &&
							!cleanQuery.startsWith("count(")
						) {
							cleanQuery = `*[${cleanQuery}]`;
						}
						cleanQuery = cleanQuery
							.replace(
								/(_type\s*==\s*["'])(?:episode|episodes|podcastEpisode|podcast_episode)(["'])/gi,
								"$1podcast$2",
							)
							.replace(
								/(_type\s*==\s*["'])(?:article|articles|blog|blogPost|posts)(["'])/gi,
								"$1post$2",
							);
						cleanQuery = cleanQuery.replace(/\bpublishedAt\b/g, "date");
						cleanQuery = cleanQuery.replace(
							/\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s+match\s+([^)]+\))/g,
							"($1 match $3 || $2 match $3)",
						);
						cleanQuery = cleanQuery.replace(
							/text::query\((["'])(.*?)\1\)/g,
							"$1*$2*$1",
						);
						cleanQuery = cleanQuery.replace(/\[_score\s*>\s*0\]/g, "");

						try {
							const directResult = await sanityClient.fetch(cleanQuery);
							const normalizedDirect = Array.isArray(directResult)
								? directResult
								: directResult !== null && typeof directResult === "object"
									? [directResult]
									: [];

							if (normalizedDirect.length > 0) {
								return normalizeAndCollectItems(normalizedDirect);
							}

							if (/order\s*\(\s*date\s+desc/i.test(cleanQuery)) {
								const typeMatch = cleanQuery.match(
									/_type\s*==\s*["']([a-zA-Z0-9_-]+)["']/,
								);
								const targetTypes =
									typeMatch?.[1] === "post"
										? ["post"]
										: typeMatch?.[1] === "podcast"
											? ["podcast"]
											: ["podcast", "post"];
								const recentFallback = await sanityClient.fetch(
									`*[_type in $types && defined(slug.current)] | order(date desc, _createdAt desc)[0...5]{
										title,
										_type,
										"slug": slug.current,
										date,
										excerpt,
										youtube,
										listenLinks,
										"spotifyLink": spotify.link
									}`,
									{ types: targetTypes },
								);
								if (
									Array.isArray(recentFallback) &&
									recentFallback.length > 0
								) {
									return normalizeAndCollectItems(recentFallback);
								}
							}

							const matchTerm = cleanQuery.match(
								/match\s+["']\*?([a-zA-Z0-9_-]+)\*?["']/,
							);
							if (matchTerm?.[1]) {
								const keyword = matchTerm[1];
								const typeMatch = cleanQuery.match(
									/_type\s*==\s*["']([a-zA-Z0-9_-]+)["']/,
								);
								const filterType = typeMatch?.[1] || null;
								const semanticResults = await sanityClient.fetch(
									semanticSearchQuery,
									{
										searchTerm: keyword,
										type: filterType,
									},
								);
								if (
									Array.isArray(semanticResults) &&
									semanticResults.length > 0
								) {
									return normalizeAndCollectItems(semanticResults.slice(0, 10));
								}
							}

							return [];
						} catch (directErr) {
							console.error("[groq_query direct error]", directErr);
							return {
								error:
									directErr instanceof Error
										? directErr.message
										: String(directErr),
							};
						}
					},
				}),
			};

			const systemPrompt =
				"You are Agent AJ, the CodingCat.dev mascot and intelligent AI assistant. Answer user queries about CodingCat.dev podcasts, tutorials, articles, authors, transcripts, and our Sanity Context Knowledge Base (including AJ Knowledge Jokes).\n\n" +
				"SEARCH & TOOL INSTRUCTIONS:\n" +
				"- KNOWLEDGE BASE & JOKES (`knowledge_base_read` / `initial_context`): When asked for a joke, programming dad joke, Git joke, SQL/database joke, Jeff Dean fact, legendary software engineering story, or coding culture humor, ALWAYS use the `knowledge_base_read` tool (and `initial_context` first if you need to see the knowledge base ID and entry paths) to read the actual entries from the Sanity Context Knowledge Base (`AJ Knowlege Jokes`) and share the real jokes/entries retrieved from it!\n" +
				"- RECENT CONTENT (`get_recent_content`): ALWAYS use the `get_recent_content` tool first when asked for 'latest podcast', 'recent episodes', 'latest blog post', or 'new articles'.\n" +
				"- TOPIC SEARCH (`search_content`): ALWAYS use the `search_content` tool when asked to find, recommend, or query podcasts, posts, or articles on any topic, technology, or question (e.g. 'Sanity', 'Firebase', 'Next.js', 'AI', 'web dev'). It performs hybrid semantic and keyword search across all episodes, posts, and transcripts.\n" +
				"- TOP VIDEOS: When asked for 'top videos' or popular video podcasts, search for high-profile episodes with video recordings (e.g. episodes featuring Guillermo Rauch, Rich Harris, Lee Robinson, or recent GenAI/MCP video podcasts) and provide their YouTube links alongside CodingCat.dev episode links.\n" +
				"- PRECISE GROQ (`groq_query`): Use `groq_query` only for precise lookups when searching for specific author profiles (e.g. *[_type == 'author' && title match '*Alex*']).\n" +
				"- CRITICAL: ALWAYS execute tools by invoking them via function calls. NEVER output raw JSON or code blocks in your text describing tool calls instead of executing them.\n" +
				'- Once you have retrieved the final content (either from `knowledge_base_read` for knowledge base entries or from `search_content`/`get_recent_content` for episodes and posts), synthesize it into an engaging, helpful response. For podcasts and posts, list the relevant titles, brief descriptions, and markdown links using relative paths (e.g. [Episode Title](/podcast/slug) or [Post Title](/post/slug)). When an exact YouTube URL is present in the tool results (e.g. item.youtube), include that exact URL on its own line (e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID). NEVER invent placeholder strings like "https://www.youtube.com/watch?v=VIDEO_ID", localhost URLs, or malformed URL brackets like ["/slug"](http://localhost:3000/slug).' +
				(initialContextOutline
					? `\n\nSANITY CONTEXT MCP INITIAL CONTEXT OUTLINE:\n${initialContextOutline}`
					: "");

			result = streamText({
				model,
				system: systemPrompt,
				messages: coreMessages,
				tools,
				stopWhen: isStepCount(8),
				onError: ({ error }) => {
					console.error("[StreamText Internal Error]", error);
				},
			});
		}

		// Pipe text stream through TransformStream with explicit error surface
		const transformStream = new TransformStream();
		const writer = transformStream.writable.getWriter();
		const encoder = new TextEncoder();

		(async () => {
			try {
				let hasOutput = false;
				for await (const part of result.stream) {
					if (part.type === "text-delta") {
						hasOutput = true;
						await writer.write(encoder.encode(part.text));
					} else if (part.type === "error") {
						console.error("[Stream Part Error]", (part as any).error);
						const errMsg =
							(part as any).error instanceof Error
								? (part as any).error.message
								: JSON.stringify((part as any).error);
						if (errMsg.includes("4006") || errMsg.includes("neurons")) {
							await writer.write(
								encoder.encode(
									"Cloudflare Workers AI daily free neuron allocation (10,000 neurons) has been reached. To continue chatting, upgrade to Cloudflare Workers Paid ($5/mo) or provide an AI API key.",
								),
							);
						} else {
							await writer.write(encoder.encode(`\n\n[Error: ${errMsg}]`));
						}
					}
				}
				if (!hasOutput) {
					// Check all steps to see if text was produced across steps
					const steps = await result.steps;
					const allText = steps
						.map((s) => s.text)
						.filter(Boolean)
						.join("\n\n");
					if (allText) {
						await writer.write(encoder.encode(allText));
					} else if (collectedMcpOutputs.length > 0) {
						console.warn(
							"[Chat API Synthesizing Fallback from MCP Tool Results]",
							{
								stepCount: steps.length,
								mcpToolsCalled: collectedMcpOutputs.map((o) => o.toolName),
							},
						);
						// Prefer non-initial_context outputs (e.g. knowledge_base_read) when available
						const primaryMcpOutputs = collectedMcpOutputs.filter(
							(o) => o.toolName !== "initial_context",
						);
						const mcpContextText = (
							primaryMcpOutputs.length > 0
								? primaryMcpOutputs
								: collectedMcpOutputs
						)
							.map((o) => o.text)
							.join("\n\n");

						let synthesized = false;
						try {
							const synthResult = streamText({
								model,
								system:
									"You are Agent AJ, the CodingCat.dev mascot. Answer the user's request directly and enthusiastically using the retrieved Sanity Context Knowledge Base content below.",
								messages: [
									...coreMessages,
									{
										role: "user",
										content: `Retrieved Knowledge Base Content:\n\n${mcpContextText}\n\nPlease answer the user's request based on this content.`,
									},
								],
							});
							for await (const part of synthResult.stream) {
								if (part.type === "text-delta" && part.text) {
									synthesized = true;
									await writer.write(encoder.encode(part.text));
								}
							}
						} catch (synthErr) {
							console.warn("[Chat API MCP synthesis error]", synthErr);
						}
						if (!synthesized) {
							await writer.write(encoder.encode(mcpContextText));
						}
					} else if (collectedToolItems.length > 0) {
						console.warn("[Chat API Synthesizing Fallback from Tool Results]", {
							stepCount: steps.length,
							itemCount: collectedToolItems.length,
						});
						const formatted = collectedToolItems
							.slice(0, 5)
							.map((item) => {
								const link = item.url
									? `[${item.title}](${item.url})`
									: `**${item.title}**`;
								const desc = item.excerpt ? `\n${item.excerpt.trim()}` : "";
								const yt = item.youtube ? `\n${item.youtube}` : "";
								return `- ${link}${desc}${yt}`;
							})
							.join("\n\n");
						await writer.write(
							encoder.encode(
								`Here is what I found on CodingCat.dev:\n\n${formatted}`,
							),
						);
					} else {
						console.warn("[Chat API Empty Text Stream]", {
							stepCount: steps.length,
							finishReasons: steps.map((s) => s.finishReason),
						});
						await writer.write(
							encoder.encode(
								"I searched the CodingCat.dev Sanity content lake for your query, but could not find relevant content.",
							),
						);
					}
				}

				const podcastProviders = collectedToolItems
					.filter(
						(item) => item.type === "podcast" && item.url && item.listenLinks,
					)
					.slice(0, 5)
					.map((item) => ({
						title: item.title,
						url: item.url,
						listenLinks: item.listenLinks,
					}));
				if (podcastProviders.length > 0) {
					await writer.write(
						encoder.encode(
							`\n<!--AJ_PODCAST_PROVIDERS:${JSON.stringify(podcastProviders)}-->`,
						),
					);
				}
			} catch (streamErr) {
				console.error("[StreamText Stream Loop Error]", streamErr);
				const errMsg =
					streamErr instanceof Error ? streamErr.message : String(streamErr);
				await writer.write(
					encoder.encode(`\n\n[Error generating response: ${errMsg}]`),
				);
			} finally {
				await writer.close();
				if (mcpClient) {
					try {
						await mcpClient.close();
					} catch {}
				}
			}
		})();

		return new Response(transformStream.readable, {
			headers: {
				"content-type": "text/plain; charset=utf-8",
				"access-control-allow-origin": "*",
				"cache-control": "no-cache",
				"x-aj-extraction-model": CLAIRIC_MODEL_ID,
				"x-aj-cascade-mode": cascadeMode,
				"x-aj-intent": extracted?.intent || "unknown",
				"x-aj-extraction-source": extracted?.source || "none",
				"x-aj-extraction-latency-ms": String(extracted?.latencyMs ?? 0),
			},
		});
	} catch (err) {
		try {
			if (mcpClient) {
				await mcpClient.close();
			}
		} catch {}

		console.error("[Chat API Error]", err);
		return new Response(
			JSON.stringify({
				error:
					err instanceof Error
						? err.message
						: "Failed to generate chat response",
				stack: err instanceof Error ? err.stack : String(err),
			}),
			{
				status: 500,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}
};
