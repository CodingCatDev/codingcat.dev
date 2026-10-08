import type { APIRoute } from "astro";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "@/lib/sanity/queries";
import { resolveHref } from "@/lib/sanity/resolve-href";

export const prerender = false;

interface JsonRpcRequest {
	jsonrpc?: string;
	id?: string | number | null;
	method: string;
	params?: any;
}

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;
	return new Response(
		JSON.stringify(
			{
				status: "ok",
				server: "CodingCat.dev Search MCP Server",
				version: "1.0.0",
				protocolVersion: "2025-06-18",
				transport: "streamable-http",
				serverCard: `${origin}/.well-known/mcp/server-card.json`,
				tools: ["search_content"],
			},
			null,
			2,
		),
		{
			headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "public, max-age=3600",
			},
		},
	);
};

export const POST: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;

	let body: JsonRpcRequest;
	try {
		body = (await request.json()) as JsonRpcRequest;
	} catch {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id: null,
				error: { code: -32700, message: "Parse error" },
			}),
			{ status: 400, headers: { "content-type": "application/json" } },
		);
	}

	const id = body.id ?? null;
	const method = body.method;

	// 1. Initialize
	if (method === "initialize") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {
					protocolVersion: "2025-06-18",
					capabilities: {
						tools: {},
					},
					serverInfo: {
						name: "codingcatdev-search-mcp",
						version: "1.0.0",
					},
				},
			}),
			{ headers: { "content-type": "application/json" } },
		);
	}

	// 2. Notifications (initialized acknowledgement)
	if (method === "notifications/initialized") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {},
			}),
			{ headers: { "content-type": "application/json" } },
		);
	}

	// 3. Ping
	if (method === "ping") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {},
			}),
			{ headers: { "content-type": "application/json" } },
		);
	}

	// 4. Tools list
	if (method === "tools/list") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {
					tools: [
						{
							name: "search_content",
							description:
								"Search across CodingCat.dev web development tutorials, blog posts, podcasts, and transcripts.",
							inputSchema: {
								type: "object",
								properties: {
									query: {
										type: "string",
										description:
											"Programming topic, question, or keyword to search",
									},
									type: {
										type: "string",
										enum: ["all", "post", "podcast"],
										description:
											"Optional filter for content type (default: all)",
									},
								},
								required: ["query"],
							},
						},
					],
				},
			}),
			{ headers: { "content-type": "application/json" } },
		);
	}

	// 5. Tools call
	if (method === "tools/call") {
		const toolName = body.params?.name;
		const args = body.params?.arguments || {};

		if (toolName === "search_content") {
			const query = (args.query || "").trim();
			const filterType = args.type === "all" ? null : args.type || null;

			if (!query) {
				return new Response(
					JSON.stringify({
						jsonrpc: "2.0",
						id,
						result: {
							content: [
								{
									type: "text",
									text: "Please provide a valid non-empty query parameter.",
								},
							],
							isError: true,
						},
					}),
					{ headers: { "content-type": "application/json" } },
				);
			}

			const params = {
				searchTerm: query,
				type: filterType,
			};

			let rawHits: any[] = [];
			try {
				const result = await locals.sanity.fetchPublished(
					semanticSearchQuery,
					params,
				);
				if (Array.isArray(result)) {
					rawHits = result;
				}
			} catch {
				try {
					const fallbackResult = await locals.sanity.fetchPublished(
						textSearchFallbackQuery,
						params,
					);
					if (Array.isArray(fallbackResult)) {
						rawHits = fallbackResult;
					}
				} catch (err) {
					console.warn("MCP Search error:", err);
				}
			}

			const hits = rawHits.slice(0, 10).map((hit) => {
				const href = resolveHref(hit._type, hit.slug);
				return {
					title: hit.title,
					type: hit._type,
					url: `${origin}${href}`,
					markdownUrl: `${origin}${href}.md`,
					excerpt: hit.excerpt || "",
					date: hit.date,
				};
			});

			return new Response(
				JSON.stringify({
					jsonrpc: "2.0",
					id,
					result: {
						content: [
							{
								type: "text",
								text: JSON.stringify(
									{
										query,
										total: hits.length,
										results: hits,
									},
									null,
									2,
								),
							},
						],
					},
				}),
				{ headers: { "content-type": "application/json" } },
			);
		}

		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				error: { code: -32601, message: `Tool not found: ${toolName}` },
			}),
			{ status: 404, headers: { "content-type": "application/json" } },
		);
	}

	return new Response(
		JSON.stringify({
			jsonrpc: "2.0",
			id,
			error: { code: -32601, message: `Method not found: ${method}` },
		}),
		{ status: 404, headers: { "content-type": "application/json" } },
	);
};
