import { env } from "cloudflare:workers";
import { createClient } from "@sanity/client";
import type { APIRoute } from "astro";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "../../lib/sanity/queries/search";

export const prerender = false;

const MCP_SERVER_INFO = {
	name: "codingcatdev-sanity-context-mcp",
	version: "1.0.0",
};

const MCP_SUPPORTED_VERSIONS = [
	"2026-07-28",
	"2025-11-25",
	"2025-06-18",
	"2025-03-26",
	"2024-11-05",
];

const MCP_HEADERS = {
	"content-type": "application/json; charset=utf-8",
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST, DELETE, OPTIONS, HEAD",
	"access-control-allow-headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
	"access-control-expose-headers":
		"Mcp-Session-Id, Mcp-Protocol-Version, WWW-Authenticate",
	"mcp-protocol-version": "2024-11-05",
};

const MCP_TOOLS = [
	{
		name: "search_content",
		title: "Search CodingCat.dev Content",
		description:
			"Search CodingCat.dev podcasts, tutorials, blog articles, authors, guests, and video transcripts using hybrid semantic search and keyword ranking. ALWAYS use this tool first when asked to find, recommend, list, or search for content on a topic (e.g. 'Sanity', 'Vercel', 'Next.js', 'Astro', 'TypeScript', 'AI', 'Tailwind', etc.).",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description:
						"Search keywords, topic, or question (e.g. 'Sanity', 'Vercel', 'Next.js 15', 'Lee Robinson', 'Guillermo Rauch', 'AI agents').",
				},
				type: {
					type: "string",
					description:
						"Optional content type filter: 'all', 'podcast', 'post', 'author', 'guest'. Defaults to 'all'.",
					enum: ["all", "podcast", "post", "author", "guest"],
				},
				limit: {
					type: "integer",
					description: "Number of results to return (default: 10, max: 24).",
				},
			},
			required: ["query"],
		},
	},
	{
		name: "get_content_by_slug",
		title: "Get Content by Slug",
		description:
			"Retrieve complete details, show notes, transcript summary, links, and guest/author metadata for a specific podcast episode or article by its slug.",
		inputSchema: {
			type: "object",
			properties: {
				slug: {
					type: "string",
					description:
						"The slug of the content item (e.g. '0-6-nextjs-with-guillermo-rauch', 'how-to-secure-vercel-cron-job-routes-in-next-js-14-app-router').",
				},
			},
			required: ["slug"],
		},
	},
	{
		name: "get_recent_content",
		title: "Get Recent Content",
		description:
			"Retrieve the most recently published podcast episodes or blog articles from CodingCat.dev, ordered by publication date.",
		inputSchema: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description:
						"Content type filter: 'all', 'podcast', or 'post'. Defaults to 'all'.",
					enum: ["all", "podcast", "post"],
				},
				limit: {
					type: "integer",
					description: "Number of items to return (default: 10, max: 20).",
				},
			},
		},
	},
	{
		name: "query_content",
		title: "Query Content Lake",
		description:
			"Execute a read-only query against the CodingCat.dev Sanity dataset. Supports GROQ queries such as count(*[_type == 'podcast']), *[_type == 'podcast'][0...5]{title, 'slug': slug.current}, or filtering by tags.",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description:
						"GROQ query to execute (e.g. count(*[_type == 'podcast']) or *[_type == 'guest'][0...10]{name, 'slug': slug.current}).",
				},
			},
			required: ["query"],
		},
	},
	{
		name: "groq_query",
		title: "GROQ Query (Legacy / Advanced)",
		description:
			"Execute read-only GROQ queries against the CodingCat.dev Sanity dataset (alias for query_content).",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "GROQ query to execute against the dataset.",
				},
			},
			required: ["query"],
		},
	},
	{
		name: "initial_context",
		title: "Initial Context",
		description:
			"Get initial overview, document counts, and usage instructions for the CodingCat.dev dataset.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "schema_explorer",
		title: "Schema Explorer",
		description:
			"Inspect schema types and fields in the CodingCat.dev dataset (e.g. 'podcast', 'post', 'author', 'guest', 'sponsor').",
		inputSchema: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description:
						"Schema type name ('podcast', 'post', 'author', 'guest', 'sponsor').",
				},
			},
			required: ["type"],
		},
	},
	{
		name: "array_field_reader",
		title: "Array Field Reader",
		description:
			"Read array fields (such as Portable Text or content blocks) on Sanity documents.",
		inputSchema: {
			type: "object",
			properties: {
				mode: {
					type: "string",
					enum: ["range", "filter", "continue", "outline"],
					description: "Reading mode for array fields.",
				},
				documentId: {
					type: "string",
					description: "Sanity document ID.",
				},
				field: {
					type: "string",
					description: "Name of the array field to read.",
				},
			},
			required: ["mode", "documentId", "field"],
		},
	},
	{
		name: "knowledge_base_read",
		title: "Read Knowledge Base Entries",
		description:
			"Read full entries from the CodingCat.dev Sanity Context Knowledge Base (e.g. 'AJ Knowlege Jokes' — programming & tech dad jokes, Git jokes, SQL jokes, Jeff Dean facts, coding culture). Call initial_context first if you need the knowledgeBaseId and entry paths.",
		inputSchema: {
			type: "object",
			properties: {
				knowledgeBaseId: {
					type: "string",
					description: "The ID of the Knowledge Base to read from.",
				},
				paths: {
					type: "array",
					items: { type: "string" },
					description:
						"List of entry paths to read from the Knowledge Base (up to 20 paths).",
				},
			},
			required: ["knowledgeBaseId", "paths"],
		},
	},
];

const SANITY_CONTEXT_MCP_URL =
	"https://api.sanity.io/v1/context/organizations/ovF2qiKSO/mcp/agent-aj-mcp";

function getCandidateMcpTokens(): string[] {
	const cfEnv = env as unknown as Record<string, unknown> | undefined;
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

async function callSanityContextMcpTool(
	toolName: string,
	toolArgs: Record<string, unknown>,
): Promise<{
	content: Array<{ type: string; text: string }>;
	isError?: boolean;
} | null> {
	const tokens = getCandidateMcpTokens();
	for (const token of tokens) {
		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
				Accept: "application/json, text/event-stream",
				Authorization: `Bearer ${token}`,
			};
			const initRes = await globalThis.fetch(SANITY_CONTEXT_MCP_URL, {
				method: "POST",
				headers,
				body: JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					method: "initialize",
					params: {
						protocolVersion: "2025-03-26",
						capabilities: {},
						clientInfo: MCP_SERVER_INFO,
					},
				}),
			});
			if (!initRes.ok) {
				continue;
			}
			const sessionId = initRes.headers.get("mcp-session-id");
			const callRes = await globalThis.fetch(SANITY_CONTEXT_MCP_URL, {
				method: "POST",
				headers: {
					...headers,
					...(sessionId ? { "mcp-session-id": sessionId } : {}),
				},
				body: JSON.stringify({
					jsonrpc: "2.0",
					id: 2,
					method: "tools/call",
					params: {
						name: toolName,
						arguments: toolArgs,
					},
				}),
			});
			if (!callRes.ok) {
				continue;
			}
			const rawText = await callRes.text();
			let parsed: any;
			if (rawText.includes("data: ")) {
				const dataLine = rawText
					.split("\n")
					.find((l) => l.startsWith("data: "));
				if (dataLine) {
					parsed = JSON.parse(dataLine.slice(6));
				}
			} else {
				parsed = JSON.parse(rawText);
			}
			if (parsed?.result?.content && Array.isArray(parsed.result.content)) {
				return {
					content: parsed.result.content,
					isError: Boolean(parsed.result.isError),
				};
			}
		} catch {}
	}
	return null;
}

function getSanityClient() {
	const cfEnv = env as unknown as Record<string, unknown> | undefined;
	const token =
		(cfEnv?.SANITY_API_READ_TOKEN as string | undefined) ||
		(cfEnv?.SANITY_AUTH_TOKEN as string | undefined) ||
		process.env.SANITY_API_READ_TOKEN ||
		process.env.SANITY_AUTH_TOKEN;

	return createClient({
		projectId: (cfEnv?.PUBLIC_SANITY_PROJECT_ID as string) || "hfh83o0w",
		dataset: (cfEnv?.PUBLIC_SANITY_DATASET as string) || "production",
		apiVersion: (cfEnv?.PUBLIC_SANITY_API_VERSION as string) || "2025-09-30",
		useCdn: !token,
		perspective: "published",
		stega: false,
		...(token ? { token } : {}),
	});
}

async function logMcpDebug(
	request: Request,
	status: number,
	detail: string,
): Promise<void> {
	try {
		const cfEnv = env as unknown as { DB?: D1Database } | undefined;
		const db = cfEnv?.DB;
		if (!db) {
			return;
		}
		const url = new URL(request.url);
		const headersObj: Record<string, string> = {};
		request.headers.forEach((v, k) => {
			if (k.toLowerCase() === "authorization") {
				const parts = v.split(" ");
				headersObj[k] = `${parts[0]} [${parts[1]?.length || 0} chars]`;
			} else if (k.toLowerCase() !== "cookie") {
				headersObj[k] = v;
			}
		});
		await db
			.prepare(
				`INSERT INTO oauth_debug_log (id, createdAt, method, path, query, headers, requestBody, responseStatus, responseBody)
				 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
			)
			.bind(
				`mcp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
				Date.now(),
				request.method,
				url.pathname,
				url.search,
				JSON.stringify(headersObj),
				detail.slice(0, 4000),
				status,
				"",
			)
			.run();
	} catch {
		// Ignore logging errors
	}
}

function checkMcpAuth(request: Request, origin: string): Response | null {
	const url = new URL(request.url);
	const requireAuth = url.searchParams.get("requireAuth") === "1";
	const authHeader = request.headers.get("authorization") || "";

	if (
		(requireAuth && !authHeader.toLowerCase().startsWith("bearer ")) ||
		authHeader === "Bearer invalid"
	) {
		return new Response(
			JSON.stringify({
				error: "unauthorized",
				error_description: "Bearer token required",
			}),
			{
				status: 401,
				headers: {
					...MCP_HEADERS,
					"www-authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp", scope="openid profile email offline_access read:content search mcp:tools agent"`,
				},
			},
		);
	}
	return null;
}

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: MCP_HEADERS,
	});
};

export const HEAD: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const authErr = checkMcpAuth(request, origin);
	if (authErr) {
		await logMcpDebug(request, 401, "HEAD unauthorized");
		return authErr;
	}
	await logMcpDebug(request, 200, "HEAD ok");
	return new Response(null, {
		status: 200,
		headers: MCP_HEADERS,
	});
};

export const DELETE: APIRoute = async ({ request }) => {
	await logMcpDebug(request, 204, "DELETE session");
	return new Response(null, {
		status: 204,
		headers: MCP_HEADERS,
	});
};

export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const authErr = checkMcpAuth(request, origin);
	if (authErr) {
		await logMcpDebug(request, 401, "GET unauthorized");
		return authErr;
	}

	const accept = request.headers.get("accept") || "";
	const hasMcpProtocolHeader = Boolean(
		request.headers.get("mcp-protocol-version") ||
			request.headers.get("mcp-session-id"),
	);

	// Per MCP Streamable HTTP specification:
	// When a Streamable HTTP client sends GET /mcp with Accept: text/event-stream to open a standalone
	// notification stream, a stateless server that does not push unsolicited notifications MUST return 405
	// Method Not Allowed so the client cleanly disables background SSE polling instead of reconnecting in a loop.
	if (accept.includes("text/event-stream") && hasMcpProtocolHeader) {
		await logMcpDebug(request, 405, "GET streamable-http SSE probe -> 405");
		return new Response(null, {
			status: 405,
			headers: {
				...MCP_HEADERS,
				allow: "POST, DELETE, OPTIONS, HEAD",
			},
		});
	}

	// Support legacy 2024-11-05 HTTP+SSE clients that explicitly connect with Accept: text/event-stream only
	if (
		accept.includes("text/event-stream") &&
		!accept.includes("application/json")
	) {
		await logMcpDebug(request, 200, "GET legacy SSE endpoint event");
		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			start(controller) {
				controller.enqueue(
					encoder.encode(`event: endpoint\ndata: ${origin}/mcp\n\n`),
				);
				controller.close();
			},
		});

		return new Response(stream, {
			headers: {
				"content-type": "text/event-stream; charset=utf-8",
				"cache-control": "no-cache, no-transform",
				connection: "keep-alive",
				"access-control-allow-origin": "*",
				"access-control-allow-methods": "GET, POST, DELETE, OPTIONS, HEAD",
				"access-control-allow-headers":
					"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
			},
		});
	}

	await logMcpDebug(request, 200, "GET status JSON");
	return new Response(
		JSON.stringify(
			{
				status: "ok",
				server: MCP_SERVER_INFO.name,
				version: MCP_SERVER_INFO.version,
				protocolVersion: "2024-11-05",
				supportedVersions: MCP_SUPPORTED_VERSIONS,
				transport: "streamable-http",
				endpoint: `${origin}/mcp`,
				serverCard: `${origin}/.well-known/mcp/server-card.json`,
				capabilities: {
					tools: { listChanged: false },
					resources: { subscribe: false, listChanged: false },
					prompts: { listChanged: false },
				},
				tools: MCP_TOOLS.map((t) => t.name),
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
	const authErr = checkMcpAuth(request, origin);
	if (authErr) {
		await logMcpDebug(request, 401, "POST unauthorized");
		return authErr;
	}

	let body: any;
	let rawText = "";
	try {
		rawText = await request.text();
		body = JSON.parse(rawText);
	} catch {
		await logMcpDebug(request, 400, `POST invalid JSON: ${rawText}`);
		return new Response(
			JSON.stringify({
				jsonrpc: "2.0",
				id: null,
				error: { code: -32700, message: "Parse error: Invalid JSON body" },
			}),
			{ status: 400, headers: MCP_HEADERS },
		);
	}

	const client = getSanityClient();

	if (Array.isArray(body)) {
		const responses = (
			await Promise.all(body.map((req) => handleSingleRequest(client, req)))
		).filter((r) => r !== null);

		await logMcpDebug(request, responses.length === 0 ? 202 : 200, rawText);
		if (responses.length === 0) {
			return new Response(null, { status: 202, headers: MCP_HEADERS });
		}
		return new Response(JSON.stringify(responses), {
			status: 200,
			headers: MCP_HEADERS,
		});
	}

	// JSON-RPC notifications have no "id" member; per Streamable HTTP spec, return 202 Accepted with empty body
	if (body && typeof body === "object" && body.id === undefined) {
		await logMcpDebug(request, 202, rawText);
		return new Response(null, {
			status: 202,
			headers: MCP_HEADERS,
		});
	}

	const response = await handleSingleRequest(client, body);
	await logMcpDebug(request, 200, rawText);
	return new Response(JSON.stringify(response), {
		status: 200,
		headers: MCP_HEADERS,
	});
};

async function handleSingleRequest(
	client: ReturnType<typeof getSanityClient>,
	req: any,
): Promise<any> {
	if (!req || typeof req !== "object") {
		return {
			jsonrpc: "2.0",
			id: null,
			error: { code: -32600, message: "Invalid Request" },
		};
	}

	if (req.id === undefined) {
		return null;
	}

	const id = req.id;
	const method = req.method;
	const reqMeta = req.params?._meta as Record<string, unknown> | undefined;
	const isModern2026 =
		reqMeta?.["io.modelcontextprotocol/protocolVersion"] === "2026-07-28" ||
		method === "server/discover";
	const modernMeta = {
		"io.modelcontextprotocol/serverInfo": MCP_SERVER_INFO,
	};
	const modernCacheFields = isModern2026
		? {
				_meta: modernMeta,
				resultType: "complete",
				ttlMs: 3600000,
				cacheScope: "public",
			}
		: {};

	try {
		switch (method) {
			case "server/discover":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						_meta: modernMeta,
						resultType: "complete",
						ttlMs: 3600000,
						cacheScope: "public",
						supportedVersions: MCP_SUPPORTED_VERSIONS,
						capabilities: {
							tools: { listChanged: false },
							resources: { subscribe: false, listChanged: false },
							prompts: { listChanged: false },
						},
						instructions:
							"CodingCat.dev MCP Server provides tools to search and retrieve CodingCat.dev web development podcasts, tutorials, articles, authors, and transcripts.",
					},
				};

			case "initialize": {
				const requestedVersion = req.params?.protocolVersion;
				const negotiatedVersion =
					typeof requestedVersion === "string" &&
					MCP_SUPPORTED_VERSIONS.includes(requestedVersion)
						? requestedVersion
						: "2024-11-05";
				return {
					jsonrpc: "2.0",
					id,
					result: {
						protocolVersion: negotiatedVersion,
						capabilities: {
							tools: { listChanged: false },
							resources: { subscribe: false, listChanged: false },
							prompts: { listChanged: false },
						},
						serverInfo: MCP_SERVER_INFO,
						instructions:
							"CodingCat.dev MCP Server provides tools to search and retrieve CodingCat.dev web development podcasts, tutorials, articles, authors, and transcripts.",
					},
				};
			}

			case "notifications/initialized":
				return {
					jsonrpc: "2.0",
					id,
					result: {},
				};

			case "ping":
				return {
					jsonrpc: "2.0",
					id,
					result: isModern2026
						? { _meta: modernMeta, resultType: "complete" }
						: {},
				};

			case "tools/list":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						...modernCacheFields,
						tools: MCP_TOOLS,
					},
				};

			case "tools/call": {
				const toolName = req.params?.name;
				const toolArgs = req.params?.arguments || {};
				const callResult = await executeTool(client, toolName, toolArgs);
				return {
					jsonrpc: "2.0",
					id,
					result: isModern2026
						? { _meta: modernMeta, resultType: "complete", ...callResult }
						: callResult,
				};
			}

			case "resources/list":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						...modernCacheFields,
						resources: [],
					},
				};

			case "resources/templates/list":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						...modernCacheFields,
						resourceTemplates: [],
					},
				};

			case "prompts/list":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						...modernCacheFields,
						prompts: [],
					},
				};

			case "logging/setLevel":
				return {
					jsonrpc: "2.0",
					id,
					result: isModern2026
						? { _meta: modernMeta, resultType: "complete" }
						: {},
				};

			case "completion/complete":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						...(isModern2026
							? { _meta: modernMeta, resultType: "complete" }
							: {}),
						completion: {
							values: [],
							total: 0,
							hasMore: false,
						},
					},
				};

			default:
				return {
					jsonrpc: "2.0",
					id,
					error: {
						code: -32601,
						message: `Method '${method}' not found`,
					},
				};
		}
	} catch (err) {
		console.error(`[MCP Error] method=${method}:`, err);
		return {
			jsonrpc: "2.0",
			id,
			error: {
				code: -32603,
				message: err instanceof Error ? err.message : "Internal MCP error",
			},
		};
	}
}

async function executeTool(
	client: ReturnType<typeof getSanityClient>,
	name: string,
	args: Record<string, any>,
): Promise<{
	content: Array<{ type: string; text: string }>;
	isError?: boolean;
}> {
	switch (name) {
		case "search_content":
		case "search":
		case "searchContent":
			return handleSearchContent(client, args);

		case "get_content_by_slug":
		case "get_content":
		case "getContentBySlug":
			return handleGetContentBySlug(client, args);

		case "get_recent_content":
		case "recent_content":
		case "getRecentContent":
			return handleGetRecentContent(client, args);

		case "query_content":
		case "groq_query":
		case "queryContent":
		case "groqQuery":
			return handleQueryContent(client, args);

		case "initial_context":
		case "initialContext":
			return handleInitialContext(client);

		case "schema_explorer":
		case "schemaExplorer":
			return handleSchemaExplorer(client, args);

		case "array_field_reader":
		case "arrayFieldReader":
			return handleArrayFieldReader(client, args);

		case "knowledge_base_read":
		case "knowledgeBaseRead":
			return handleKnowledgeBaseRead(args);

		default:
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify({
							error: `Unknown tool '${name}'. Use 'tools/list' to see available tools.`,
						}),
					},
				],
				isError: true,
			};
	}
}

async function handleSearchContent(
	client: ReturnType<typeof getSanityClient>,
	args: Record<string, any>,
) {
	const query = String(args.query || args.searchTerm || args.term || "").trim();
	if (!query) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ error: "Missing required 'query' argument." }),
				},
			],
			isError: true,
		};
	}

	const rawType = args.type ? String(args.type).toLowerCase() : null;
	const filterType = rawType && rawType !== "all" ? rawType : null;
	const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 24);

	let results: any[] = [];
	try {
		const res = await client.fetch(semanticSearchQuery, {
			searchTerm: query,
			type: filterType,
		});
		if (Array.isArray(res) && res.length > 0) {
			results = res;
		}
	} catch (err) {
		console.warn("[search_content semantic search error, falling back]", err);
	}

	if (!results.length) {
		try {
			const fallback = await client.fetch(textSearchFallbackQuery, {
				searchTerm: query,
				type: filterType,
			});
			if (Array.isArray(fallback) && fallback.length > 0) {
				results = fallback;
			}
		} catch (err) {
			console.warn("[search_content text search error]", err);
		}
	}

	if (!results.length) {
		try {
			const directQuery = `*[_type in ["post", "podcast", "author", "guest"] && defined(slug.current) && (${filterType ? `_type == "${filterType}"` : "true"}) && (
				title match $term ||
				name match $term ||
				excerpt match $term ||
				transcript->summary match $term
			)][0...24]{
				_id,
				_type,
				"title": coalesce(title, name, "Untitled"),
				"slug": slug.current,
				"excerpt": coalesce(excerpt, transcript->summary),
				date
			}`;
			const direct = await client.fetch(directQuery, { term: `*${query}*` });
			if (Array.isArray(direct) && direct.length > 0) {
				results = direct;
			}
		} catch (err) {
			console.warn("[search_content direct match error]", err);
		}
	}

	const formatted = results.slice(0, limit).map((item: any) => {
		const section =
			item._type === "podcast"
				? "podcast"
				: item._type === "post"
					? "post"
					: item._type;
		return {
			title: item.title,
			type: item._type,
			slug: item.slug,
			url: `https://codingcat.dev/${section}/${item.slug}`,
			date: item.date || null,
			excerpt: item.excerpt || item.transcriptSummary || "",
		};
	});

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(
					{
						query,
						type: filterType || "all",
						count: formatted.length,
						results: formatted,
					},
					null,
					2,
				),
			},
		],
		isError: false,
	};
}

async function handleGetContentBySlug(
	client: ReturnType<typeof getSanityClient>,
	args: Record<string, any>,
) {
	const slug = String(args.slug || "").trim();
	if (!slug) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ error: "Missing required 'slug' argument." }),
				},
			],
			isError: true,
		};
	}

	const query = `*[_type in ["podcast", "post", "author", "guest"] && slug.current == $slug][0]{
		_id,
		_type,
		"title": coalesce(title, name, "Untitled"),
		"slug": slug.current,
		date,
		excerpt,
		"transcriptSummary": transcript->summary,
		"transcriptText": transcript->fullText,
		"guests": guests[]->{ name, "slug": slug.current, bio },
		"authors": authors[]->{ name, "slug": slug.current, bio },
		spotify,
		apple,
		youtube
	}`;

	const doc = await client.fetch(query, { slug });
	if (!doc) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						error: `No content found matching slug '${slug}'. Use search_content to discover valid slugs.`,
					}),
				},
			],
			isError: true,
		};
	}

	const section =
		doc._type === "podcast"
			? "podcast"
			: doc._type === "post"
				? "post"
				: doc._type;
	const url = `https://codingcat.dev/${section}/${doc.slug}`;

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ ...doc, url }, null, 2),
			},
		],
		isError: false,
	};
}

async function handleGetRecentContent(
	client: ReturnType<typeof getSanityClient>,
	args: Record<string, any>,
) {
	const rawType = args.type ? String(args.type).toLowerCase() : "all";
	const types =
		rawType === "podcast"
			? ["podcast"]
			: rawType === "post"
				? ["post"]
				: ["podcast", "post"];
	const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 20);

	const query = `*[_type in $types && defined(slug.current)] | order(date desc, _createdAt desc)[0...$limit]{
		_id,
		_type,
		"title": coalesce(title, name, "Untitled"),
		"slug": slug.current,
		date,
		excerpt
	}`;

	const results = await client.fetch(query, { types, limit });
	const formatted = (results || []).map((item: any) => ({
		title: item.title,
		type: item._type,
		slug: item.slug,
		url: `https://codingcat.dev/${item._type === "podcast" ? "podcast" : "post"}/${item.slug}`,
		date: item.date || null,
		excerpt: item.excerpt || "",
	}));

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(
					{
						filter: rawType,
						count: formatted.length,
						results: formatted,
					},
					null,
					2,
				),
			},
		],
		isError: false,
	};
}

async function handleQueryContent(
	client: ReturnType<typeof getSanityClient>,
	args: Record<string, any>,
) {
	const rawQuery = String(args.query || "").trim();
	if (!rawQuery) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ error: "Missing required 'query' argument." }),
				},
			],
			isError: true,
		};
	}

	// Safety check: allow only read operations
	const lower = rawQuery.toLowerCase();
	if (
		lower.includes("delete") ||
		lower.includes("mutate") ||
		lower.includes("patch") ||
		lower.includes("create")
	) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						error: "Only read-only GROQ queries are permitted.",
					}),
				},
			],
			isError: true,
		};
	}

	// Clean and heal common LLM GROQ query patterns
	let cleanQuery = rawQuery;
	cleanQuery = cleanQuery
		.replace(/^```(?:groq)?\s*/i, "")
		.replace(/\s*```$/, "")
		.trim();

	// Strip broken Sanity Context wrapper if present
	const contextMatch = cleanQuery.match(
		/\(_type\s+in\s+\[.*?\]\s*\{.*?\}\)\s*&&\s*(.+)$/s,
	);
	if (contextMatch?.[1]) {
		cleanQuery = `*[${contextMatch[1]}`;
	}

	// Prepend * if starts with filter bracket [
	if (cleanQuery.startsWith("[") && !cleanQuery.startsWith("*[")) {
		cleanQuery = `*${cleanQuery}`;
	}

	// Heal [a, b] match "..." -> (a match "..." || b match "...")
	cleanQuery = cleanQuery.replace(
		/\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s+match\s+([^)]+\))/g,
		"($1 match $3 || $2 match $3)",
	);

	// Heal text::query("...") -> "*...*"
	cleanQuery = cleanQuery.replace(/text::query\((["'])(.*?)\1\)/g, "$1*$2*$1");

	// Remove [_score > 0]
	cleanQuery = cleanQuery.replace(/\[_score\s*>\s*0\]/g, "");

	try {
		const result = await client.fetch(cleanQuery);

		// If result is empty array and query had a search keyword, run fallback search
		if (Array.isArray(result) && result.length === 0) {
			const keywordMatch = rawQuery.match(
				/match\s+["']\*?([a-zA-Z0-9\s_-]+)\*?["']/,
			);
			if (keywordMatch?.[1]) {
				const term = keywordMatch[1].trim();
				const typeMatch = rawQuery.match(
					/_type\s*==\s*["']([a-zA-Z0-9_-]+)["']/,
				);
				const fallbackType = typeMatch?.[1] || null;
				const fallbackRes = await client.fetch(semanticSearchQuery, {
					searchTerm: term,
					type: fallbackType,
				});
				if (Array.isArray(fallbackRes) && fallbackRes.length > 0) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(
									fallbackRes.slice(0, 10).map((r: any) => ({
										title: r.title,
										type: r._type,
										slug: r.slug,
										url: `https://codingcat.dev/${r._type === "podcast" ? "podcast" : "post"}/${r.slug}`,
										excerpt: r.excerpt || "",
									})),
									null,
									2,
								),
							},
						],
						isError: false,
					};
				}
			}
		}

		const text =
			typeof result === "object"
				? JSON.stringify(result, null, 2)
				: String(result);

		return {
			content: [{ type: "text", text }],
			isError: false,
		};
	} catch (err) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						error: err instanceof Error ? err.message : String(err),
						query: cleanQuery,
					}),
				},
			],
			isError: true,
		};
	}
}

async function handleInitialContext(
	client: ReturnType<typeof getSanityClient>,
) {
	try {
		const [counts, sanityContextInitial] = await Promise.all([
			client.fetch(`{
				"podcasts": count(*[_type == "podcast"]),
				"posts": count(*[_type == "post"]),
				"authors": count(*[_type == "author"]),
				"guests": count(*[_type == "guest"]),
				"recentPodcasts": *[_type == "podcast" && defined(slug.current)] | order(date desc)[0...3]{
					title,
					"slug": slug.current,
					date
				}
			}`),
			callSanityContextMcpTool("initial_context", {}).catch(() => null),
		]);

		const knowledgeBaseContext = sanityContextInitial?.content
			?.map((c) => c.text)
			.filter(Boolean)
			.join("\n\n");

		const summary = {
			platform: "CodingCat.dev",
			description:
				"CodingCat.dev is an educational web development learning platform and weekly podcast covering modern web development, frameworks, AI agents, cloud architectures, and headless CMS.",
			statistics: {
				totalPodcasts: counts.podcasts,
				totalPosts: counts.posts,
				totalGuests: counts.guests,
				totalAuthors: counts.authors,
			},
			recentPodcasts: (counts.recentPodcasts || []).map((p: any) => ({
				title: p.title,
				slug: p.slug,
				url: `https://codingcat.dev/podcast/${p.slug}`,
				date: p.date,
			})),
			...(knowledgeBaseContext
				? { sanityContextKnowledgeBase: knowledgeBaseContext }
				: {}),
			recommendedTools: [
				"search_content: Fast semantic & keyword search across all episodes, tutorials, and transcripts.",
				"get_content_by_slug: Retrieve full episode or post details, show notes, and transcript summaries.",
				"get_recent_content: Get the newest podcasts and articles.",
				"query_content: Run custom read-only GROQ queries.",
				"knowledge_base_read: Read full entries from the Sanity Context Knowledge Base (e.g. 'AJ Knowlege Jokes').",
			],
		};

		return {
			content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
			isError: false,
		};
	} catch (_err) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						platform: "CodingCat.dev",
						description:
							"CodingCat.dev is a web development learning platform and podcast.",
						tools: [
							"search_content",
							"get_content_by_slug",
							"get_recent_content",
							"query_content",
							"knowledge_base_read",
						],
					}),
				},
			],
			isError: false,
		};
	}
}

async function handleKnowledgeBaseRead(args: Record<string, any>) {
	const result = await callSanityContextMcpTool("knowledge_base_read", args);
	if (result) {
		return result;
	}
	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({
					error:
						"Unable to reach Sanity Context Knowledge Base MCP endpoint or missing Organization Context Viewer token (SANITY_CONTEXT_TOKEN / SANITY_AUTH_TOKEN).",
					endpoint: SANITY_CONTEXT_MCP_URL,
				}),
			},
		],
		isError: true,
	};
}

async function handleSchemaExplorer(
	_client: ReturnType<typeof getSanityClient>,
	args: Record<string, any>,
) {
	const type = String(args.type || "")
		.toLowerCase()
		.trim();
	const schemas: Record<string, any> = {
		podcast: {
			name: "podcast",
			title: "Podcast Episode",
			description:
				"Weekly video & audio podcast episode with industry leaders, founders, and engineers.",
			fields: [
				{ name: "title", type: "string", description: "Episode title" },
				{
					name: "slug",
					type: "slug",
					description:
						"URL slug identifier (e.g. '0-6-nextjs-with-guillermo-rauch')",
				},
				{ name: "date", type: "datetime", description: "Release date" },
				{ name: "episode", type: "number", description: "Episode number" },
				{ name: "season", type: "number", description: "Season number" },
				{
					name: "excerpt",
					type: "text",
					description: "Show notes and summary",
				},
				{
					name: "guests",
					type: "array",
					description: "References to guest documents",
				},
				{
					name: "authors",
					type: "array",
					description: "References to host / author documents",
				},
				{ name: "youtube", type: "url", description: "YouTube video link" },
				{ name: "spotify", type: "url", description: "Spotify audio link" },
				{ name: "apple", type: "url", description: "Apple Podcasts link" },
				{
					name: "transcript",
					type: "reference",
					description:
						"Reference to transcript document with fullText and summary",
				},
			],
		},
		post: {
			name: "post",
			title: "Blog Post / Tutorial",
			description: "Technical web development guides and tutorials.",
			fields: [
				{ name: "title", type: "string", description: "Article title" },
				{ name: "slug", type: "slug", description: "URL slug identifier" },
				{ name: "date", type: "datetime", description: "Publication date" },
				{ name: "excerpt", type: "text", description: "Summary excerpt" },
				{
					name: "authors",
					type: "array",
					description: "References to author documents",
				},
				{
					name: "content",
					type: "array",
					description: "Portable Text article body",
				},
			],
		},
		guest: {
			name: "guest",
			title: "Podcast Guest",
			description: "Invited podcast guest profile.",
			fields: [
				{ name: "name", type: "string", description: "Full name" },
				{ name: "slug", type: "slug", description: "URL slug identifier" },
				{ name: "bio", type: "text", description: "Guest biography" },
				{
					name: "twitter",
					type: "url",
					description: "Twitter / X profile URL",
				},
				{ name: "github", type: "url", description: "GitHub profile URL" },
				{
					name: "website",
					type: "url",
					description: "Personal or company website",
				},
			],
		},
		author: {
			name: "author",
			title: "Author / Host",
			description: "CodingCat.dev author or podcast host.",
			fields: [
				{ name: "name", type: "string", description: "Author name" },
				{ name: "slug", type: "slug", description: "URL slug identifier" },
				{ name: "bio", type: "text", description: "Short biography" },
			],
		},
	};

	if (type && schemas[type]) {
		return {
			content: [{ type: "text", text: JSON.stringify(schemas[type], null, 2) }],
			isError: false,
		};
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(
					{
						availableTypes: ["podcast", "post", "guest", "author", "sponsor"],
						schemas,
					},
					null,
					2,
				),
			},
		],
		isError: false,
	};
}

async function handleArrayFieldReader(
	client: ReturnType<typeof getSanityClient>,
	args: Record<string, any>,
) {
	const documentId = String(args.documentId || "").trim();
	const field = String(args.field || "").trim();
	if (!documentId || !field) {
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						error: "Both 'documentId' and 'field' arguments are required.",
					}),
				},
			],
			isError: true,
		};
	}

	const query = `*[_id == $id || _id == "drafts." + $id][0][$field]`;
	const data = await client.fetch(query, { id: documentId, field });
	return {
		content: [{ type: "text", text: JSON.stringify(data || [], null, 2) }],
		isError: false,
	};
}
