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

const MCP_HEADERS = {
	"content-type": "application/json; charset=utf-8",
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST, OPTIONS",
	"access-control-allow-headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
	"mcp-protocol-version": "2024-11-05",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: MCP_HEADERS,
	});
};

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;
	return new Response(
		JSON.stringify(
			{
				status: "ok",
				server: "codingcatdev-search-mcp",
				version: "1.0.0",
				protocolVersion: "2024-11-05",
				supportedVersions: ["2026-07-28", "2024-11-05"],
				transport: "streamable-http",
				serverCard: `${origin}/.well-known/mcp/server-card.json`,
				capabilities: {
					tools: { listChanged: false },
					resources: { subscribe: false, listChanged: false },
					prompts: { listChanged: false },
				},
				tools: ["search_content"],
			},
			null,
			2,
		),
		{
			headers: {
				...MCP_HEADERS,
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
			{ status: 400, headers: MCP_HEADERS },
		);
	}

	const id = body.id ?? null;
	const method = body.method;

	// 1. Stateless discovery (MCP 2026-07-28+)
	if (method === "server/discover") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {
					supportedVersions: ["2026-07-28", "2024-11-05"],
					capabilities: {
						tools: { listChanged: false },
						resources: { subscribe: false, listChanged: false },
						prompts: { listChanged: false },
					},
					serverInfo: {
						name: "codingcatdev-search-mcp",
						version: "1.0.0",
					},
					_meta: {
						"io.modelcontextprotocol/serverInfo": {
							name: "codingcatdev-search-mcp",
							version: "1.0.0",
						},
					},
					instructions:
						"Search technical tutorials, web development guides, and podcasts on CodingCat.dev.",
				},
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// 2. Initialize (Legacy / standard MCP handshake)
	if (method === "initialize") {
		const clientVersion = body.params?.protocolVersion;
		const protocolVersion =
			clientVersion === "2026-07-28" ? "2026-07-28" : "2024-11-05";

		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {
					protocolVersion,
					capabilities: {
						tools: { listChanged: false },
						resources: { subscribe: false, listChanged: false },
						prompts: { listChanged: false },
					},
					serverInfo: {
						name: "codingcatdev-search-mcp",
						version: "1.0.0",
					},
				},
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// 3. Notifications (initialized acknowledgement)
	if (method === "notifications/initialized") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {},
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// 4. Ping
	if (method === "ping") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {},
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// 5. Tools list
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
			{ headers: MCP_HEADERS },
		);
	}

	// 6. Resources list
	if (method === "resources/list") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {
					resources: [],
				},
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// 7. Prompts list
	if (method === "prompts/list") {
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				result: {
					prompts: [],
				},
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// 8. Tools call
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
					{ headers: MCP_HEADERS },
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
				{ headers: MCP_HEADERS },
			);
		}

		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id,
				error: { code: -32601, message: `Tool not found: ${toolName}` },
			}),
			{ headers: MCP_HEADERS },
		);
	}

	// Default fallback: standard JSON-RPC 2.0 Method Not Found
	return new Response(
		JSON.stringify({
			jsonrpc: "2.0",
			id,
			error: { code: -32601, message: `Method not found: ${method}` },
		}),
		{ headers: MCP_HEADERS },
	);
};
