import { env } from "cloudflare:workers";
import { createMCPClient } from "@ai-sdk/mcp";
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

	if (!sanityToken) {
		return new Response(
			JSON.stringify({
				error: "SANITY_API_READ_TOKEN is not configured on the server.",
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
		// 1. Connect MCP client to Sanity Context MCP endpoint
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

		// Directly configure Sanity client for fallback per prompt instructions (Step 3)
		const sanityClient = createClient({
			projectId: (cfEnv?.PUBLIC_SANITY_PROJECT_ID as string) || "hfh83o0w",
			dataset: (cfEnv?.PUBLIC_SANITY_DATASET as string) || "production",
			apiVersion: (cfEnv?.PUBLIC_SANITY_API_VERSION as string) || "2025-09-30",
			useCdn: false,
			token: sanityToken,
		});

		const tools = {
			...mcpTools,
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
						console.warn("[search_content semantic error, falling back]", semanticErr);
					}

					if (!results.length) {
						try {
							const fallback = await sanityClient.fetch(textSearchFallbackQuery, {
								searchTerm: query,
								type: filterType,
							});
							if (Array.isArray(fallback)) {
								results = fallback;
							}
						} catch (fallbackErr) {
							console.error("[search_content text error]", fallbackErr);
						}
					}

					return results.slice(0, 10).map((item: any) => ({
						title: item.title,
						type: item._type,
						slug: item.slug,
						url: `/${item._type === "podcast" ? "podcast" : item._type === "post" ? "post" : item._type}/${item.slug}`,
						excerpt: item.excerpt || item.transcriptSummary || "",
					}));
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
						rawType === "podcast"
							? ["podcast"]
							: rawType === "post"
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
						return (recent || []).map((item: any) => ({
							title: item.title,
							type: item._type,
							slug: item.slug,
							url: `/${item._type === "podcast" ? "podcast" : "post"}/${item.slug}`,
							date: item.date,
							excerpt: item.excerpt || "",
							youtube: item.youtube || null,
						}));
					} catch (err) {
						console.error("[get_recent_content error]", err);
						return [];
					}
				},
			}),
			groq_query: {
				...mcpTools.groq_query,
				execute: async ({ query }: { query: string }) => {
					try {
						const mcpResult = await (mcpTools.groq_query as any).execute(
							{ query },
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
						if (Array.isArray(results) && results.length > 0) {
							return results;
						}
					} catch {}

					// Fallback: direct Sanity fetch with query healing
					try {
						let cleanQuery = query.startsWith("*") ? query : `*[${query}]`;
						// Heal common LLM query syntax issues:
						// Heal [a, b] match "..." -> (a match "..." || b match "...")
						cleanQuery = cleanQuery.replace(
							/\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s+match\s+([^)]+\))/g,
							"($1 match $3 || $2 match $3)",
						);
						// Heal text::query("...") -> "*...*"
						cleanQuery = cleanQuery.replace(
							/text::query\((["'])(.*?)\1\)/g,
							"$1*$2*$1",
						);
						// Remove filter [_score > 0]
						cleanQuery = cleanQuery.replace(/\[_score\s*>\s*0\]/g, "");

						const directResult = await sanityClient.fetch(cleanQuery);
						if (Array.isArray(directResult) && directResult.length > 0) {
							return directResult;
						}

						// If still empty and query was a search for a keyword, extract keyword and run semantic search
						const matchTerm = query.match(/match\s+["']\*?([a-zA-Z0-9_-]+)\*?["']/);
						if (matchTerm?.[1]) {
							const keyword = matchTerm[1];
							const typeMatch = query.match(/_type\s*==\s*["']([a-zA-Z0-9_-]+)["']/);
							const filterType = typeMatch?.[1] || null;
							const semanticResults = await sanityClient.fetch(semanticSearchQuery, {
								searchTerm: keyword,
								type: filterType,
							});
							if (Array.isArray(semanticResults) && semanticResults.length > 0) {
								return semanticResults.slice(0, 10).map((item: any) => ({
									title: item.title,
									type: item._type,
									slug: item.slug,
									excerpt: item.excerpt || "",
								}));
							}
						}

						return directResult || [];
					} catch (directErr) {
						return {
							error:
								directErr instanceof Error
									? directErr.message
									: String(directErr),
						};
					}
				},
			},
		};

		// 2. Setup Cloudflare Workers AI model
		const aiBinding = cfEnv?.AI;
		if (!aiBinding) {
			await mcpClient.close();
			return new Response(
				JSON.stringify({
					error:
						"Cloudflare Workers AI binding is not available in the current environment.",
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
		const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");

		// 3. Stream model response with multi-step tool calling
		const result = streamText({
			model,
			system:
				"You are Agent AJ, CodingCat.dev's intelligent AI assistant. Answer user queries about CodingCat.dev podcasts, tutorials, articles, authors, and transcripts.\n\n" +
				"SEARCH & TOOL INSTRUCTIONS:\n" +
				"- ALWAYS use the `get_recent_content` tool first when asked for 'latest podcast', 'recent episodes', 'latest blog post', or 'new articles'.\n" +
				"- ALWAYS use the `search_content` tool when asked to find, recommend, or query podcasts, posts, or articles on any topic, technology, or question (e.g. 'Sanity', 'Firebase', 'Next.js', 'AI', 'web dev'). It performs hybrid semantic and keyword search across all episodes, posts, and transcripts.\n" +
				"- When asked for 'top videos' or popular video podcasts, search for high-profile episodes with video recordings (e.g. episodes featuring Guillermo Rauch, Rich Harris, Lee Robinson, or recent GenAI/MCP video podcasts) and provide their YouTube links alongside CodingCat.dev episode links.\n" +
				"- Use `groq_query` for precise lookups when searching for specific author profiles (e.g. *[_type == 'author' && title match '*Alex*']).\n" +
				"- CRITICAL: ALWAYS execute tools by invoking them via function calls. NEVER output raw JSON or code blocks in your text describing tool calls instead of executing them.\n" +
				"- Once you receive results from your tool calls, synthesize them into an engaging, helpful response. List the relevant episode or article titles, brief descriptions, and markdown links using relative paths (e.g. [Title](/podcast/slug) or [Title](/post/slug)). If YouTube links are available, include them. Never use localhost or absolute domain URLs.",
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
					} else {
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
