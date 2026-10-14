import { env } from "cloudflare:workers";
import { createMCPClient } from "@ai-sdk/mcp";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createClient } from "@sanity/client";
import { isStepCount, jsonSchema, streamText, tool } from "ai";
import type { APIRoute } from "astro";
import { createWorkersAI } from "workers-ai-provider";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "@/lib/sanity/queries";

export const prerender = false;

const SANITY_CONTEXT_MCP_URL =
	"https://api.sanity.io/v1/context/organizations/ovF2qiKSO/mcp/agent-aj-mcp";

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

export const GET: APIRoute = async () => {
	return new Response(
		JSON.stringify({
			status: "ready",
			name: "Agent AJ",
			model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
			mcp: SANITY_CONTEXT_MCP_URL,
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
		process.env.SANITY_API_READ_TOKEN;

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

	let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | undefined;

	try {
		let mcpGroqTool: any;
		if (sanityToken) {
			try {
				// 1. Optionally connect MCP client to Sanity Context MCP endpoint
				mcpClient = await createMCPClient({
					transport: {
						type: "http",
						url: SANITY_CONTEXT_MCP_URL,
						headers: {
							Authorization: `Bearer ${sanityToken}`,
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

				const mcpTools = await mcpClient.tools();
				mcpGroqTool = mcpTools.groq_query;
			} catch (mcpErr) {
				console.warn(
					"[Chat API MCP connection warning, using direct Sanity client]",
					mcpErr,
				);
			}
		}

		// Configure Sanity client (fall back to public 'production' dataset when no read token is present)
		const configuredDataset =
			(cfEnv?.PUBLIC_SANITY_DATASET as string) || "production";
		const sanityClient = createClient({
			projectId: (cfEnv?.PUBLIC_SANITY_PROJECT_ID as string) || "hfh83o0w",
			dataset: sanityToken ? configuredDataset : "production",
			apiVersion: (cfEnv?.PUBLIC_SANITY_API_VERSION as string) || "2025-09-30",
			useCdn: !sanityToken,
			...(sanityToken ? { token: sanityToken } : {}),
		});

		const collectedToolItems: Array<{
			title: string;
			type?: string;
			slug?: string;
			url?: string;
			date?: string;
			excerpt?: string;
			youtube?: string | null;
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
					return {
						title: item.title || item.name || "Untitled",
						type: itemType,
						slug: slugStr,
						url,
						date: item.date || item.publishedAt,
						excerpt: item.excerpt || item.transcriptSummary || "",
						youtube: item.youtube || undefined,
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

		const tools = {
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
								youtube
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
					let cleanQuery = query.trim();
					if (!cleanQuery.startsWith("*") && !cleanQuery.startsWith("count(")) {
						cleanQuery = `*[${cleanQuery}]`;
					}
					// Heal common LLM schema/syntax mismatches:
					// 1. Heal _type == "episode" / "podcastEpisode" -> "podcast", "article" / "blog" -> "post"
					cleanQuery = cleanQuery
						.replace(
							/(_type\s*==\s*["'])(?:episode|episodes|podcastEpisode|podcast_episode)(["'])/gi,
							"$1podcast$2",
						)
						.replace(
							/(_type\s*==\s*["'])(?:article|articles|blog|blogPost|posts)(["'])/gi,
							"$1post$2",
						);
					// 2. Heal publishedAt -> date (CodingCat.dev schema uses `date`)
					cleanQuery = cleanQuery.replace(/\bpublishedAt\b/g, "date");
					// 3. Heal [a, b] match "..." -> (a match "..." || b match "...")
					cleanQuery = cleanQuery.replace(
						/\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s+match\s+([^)]+\))/g,
						"($1 match $3 || $2 match $3)",
					);
					// 4. Heal text::query("...") -> "*...*"
					cleanQuery = cleanQuery.replace(
						/text::query\((["'])(.*?)\1\)/g,
						"$1*$2*$1",
					);
					// 5. Remove filter [_score > 0]
					cleanQuery = cleanQuery.replace(/\[_score\s*>\s*0\]/g, "");

					if (mcpGroqTool?.execute) {
						try {
							const mcpResult = await mcpGroqTool.execute(
								{ query: cleanQuery },
								{} as any,
							);
							const parsed =
								typeof mcpResult === "string"
									? JSON.parse(mcpResult)
									: mcpResult;
							const results =
								parsed?.result ||
								(Array.isArray(parsed?.content) && parsed.content[0]?.text
									? JSON.parse(parsed.content[0].text)?.result
									: null);
							const arr = Array.isArray(results)
								? results
								: results && typeof results === "object"
									? [results]
									: [];
							if (arr.length > 0) {
								return normalizeAndCollectItems(arr);
							}
						} catch {}
					}

					// Direct Sanity fetch with healed query
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

						// If query ordered by date desc (e.g. asking for latest podcast/post) and returned empty, fallback to recent content query
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
									youtube
								}`,
								{ types: targetTypes },
							);
							if (Array.isArray(recentFallback) && recentFallback.length > 0) {
								return normalizeAndCollectItems(recentFallback);
							}
						}

						// If still empty and query was a search for a keyword, extract keyword and run semantic search
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

		// 2. Setup AI Model (prefer OpenRouter when configured, fallback to Workers AI)
		const openRouterApiKey =
			(cfEnv?.OPENROUTER_API_KEY as string | undefined) ||
			process.env.OPENROUTER_API_KEY;

		let model: any;
		if (openRouterApiKey) {
			const openrouter = createOpenRouter({
				apiKey: openRouterApiKey,
			});
			// Use meta-llama/llama-3.3-70b-instruct or deepseek/deepseek-chat via OpenRouter
			model = openrouter("meta-llama/llama-3.3-70b-instruct");
		} else {
			const aiBinding = cfEnv?.AI;
			if (!aiBinding) {
				if (mcpClient) {
					await mcpClient.close();
				}
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

		// 3. Stream model response with multi-step tool calling
		const result = streamText({
			model,
			system:
				"You are Agent AJ, CodingCat.dev's intelligent AI assistant. Answer user queries about CodingCat.dev podcasts, tutorials, articles, authors, and transcripts.\n\n" +
				"SEARCH & TOOL INSTRUCTIONS:\n" +
				"- ALWAYS use the `get_recent_content` tool first when asked for 'latest podcast', 'recent episodes', 'latest blog post', or 'new articles'.\n" +
				"- ALWAYS use the `search_content` tool when asked to find, recommend, or query podcasts, posts, or articles on any topic, technology, or question (e.g. 'Sanity', 'Firebase', 'Next.js', 'AI', 'web dev'). It performs hybrid semantic and keyword search across all episodes, posts, and transcripts.\n" +
				"- When asked for 'top videos' or popular video podcasts, search for high-profile episodes with video recordings (e.g. episodes featuring Guillermo Rauch, Rich Harris, Lee Robinson, or recent GenAI/MCP video podcasts) and provide their YouTube links alongside CodingCat.dev episode links.\n" +
				"- Use `groq_query` only for precise lookups when searching for specific author profiles (e.g. *[_type == 'author' && title match '*Alex*']).\n" +
				"- CRITICAL: ALWAYS execute tools by invoking them via function calls. NEVER output raw JSON or code blocks in your text describing tool calls instead of executing them.\n" +
				'- Once you receive results from your tool calls, immediately synthesize them into an engaging, helpful response without calling more tools. List the relevant episode or article titles, brief descriptions, and markdown links using relative paths (e.g. [Episode Title](/podcast/slug) or [Post Title](/post/slug)). When an exact YouTube URL is present in the tool results (e.g. item.youtube), include that exact URL on its own line (e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID). NEVER invent placeholder strings like "https://www.youtube.com/watch?v=VIDEO_ID", localhost URLs, or malformed URL brackets like ["/slug"](http://localhost:3000/slug).',
			messages: coreMessages,
			tools,
			stopWhen: isStepCount(5),
			onError: ({ error }) => {
				console.error("[StreamText Internal Error]", error);
			},
		});

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
