import { env } from "cloudflare:workers";
import { createClient } from "@sanity/client";
import type { APIRoute } from "astro";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "../../lib/sanity/queries/search";

export const prerender = false;

const MCP_HEADERS = {
	"content-type": "application/json; charset=utf-8",
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST, OPTIONS",
	"access-control-allow-headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
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
];

function getSanityClient() {
	const cfEnv = env as unknown as Record<string, unknown> | undefined;
	const token =
		(cfEnv?.SANITY_API_READ_TOKEN as string | undefined) ||
		process.env.SANITY_API_READ_TOKEN;

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

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: MCP_HEADERS,
	});
};

export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const accept = request.headers.get("accept") || "";

	// Support SSE stream for legacy MCP HTTP+SSE clients
	if (accept.includes("text/event-stream")) {
		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			start(controller) {
				controller.enqueue(
					encoder.encode(`event: endpoint\ndata: ${origin}/mcp\n\n`),
				);
			},
		});

		return new Response(stream, {
			headers: {
				"content-type": "text/event-stream; charset=utf-8",
				"cache-control": "no-cache, no-transform",
				connection: "keep-alive",
				"access-control-allow-origin": "*",
				"access-control-allow-methods": "GET, POST, OPTIONS",
				"access-control-allow-headers":
					"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
			},
		});
	}

	return new Response(
		JSON.stringify(
			{
				status: "ok",
				server: "codingcatdev-sanity-context-mcp",
				version: "1.0.0",
				protocolVersion: "2024-11-05",
				supportedVersions: ["2026-07-28", "2024-11-05"],
				transport: "streamable-http",
				endpoint: `${origin}/mcp`,
				serverCard: `${origin}/.well-known/mcp/server-card.json`,
				capabilities: {
					tools: { listChanged: true },
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

export const POST: APIRoute = async ({ request }) => {
	let body: any;
	try {
		body = await request.json();
	} catch {
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
		const responses = await Promise.all(
			body.map((req) => handleSingleRequest(client, req)),
		);
		return new Response(JSON.stringify(responses), {
			status: 200,
			headers: MCP_HEADERS,
		});
	}

	const response = await handleSingleRequest(client, body);
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

	const id = req.id !== undefined ? req.id : null;
	const method = req.method;

	try {
		switch (method) {
			case "initialize":
				return {
					jsonrpc: "2.0",
					id,
					result: {
						protocolVersion: req.params?.protocolVersion || "2024-11-05",
						capabilities: {
							tools: { listChanged: false },
							resources: { subscribe: false, listChanged: false },
							prompts: { listChanged: false },
						},
						serverInfo: {
							name: "codingcatdev-sanity-context-mcp",
							version: "1.0.0",
						},
						instructions:
							"CodingCat.dev MCP Server provides tools to search and retrieve CodingCat.dev web development podcasts, tutorials, articles, authors, and transcripts.",
					},
				};

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
					result: {},
				};

			case "tools/list":
				return {
					jsonrpc: "2.0",
					id,
					result: {
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
					result: callResult,
				};
			}

			case "resources/list":
				return {
					jsonrpc: "2.0",
					id,
					result: { resources: [] },
				};

			case "prompts/list":
				return {
					jsonrpc: "2.0",
					id,
					result: { prompts: [] },
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
		const counts = await client.fetch(`{
			"podcasts": count(*[_type == "podcast"]),
			"posts": count(*[_type == "post"]),
			"authors": count(*[_type == "author"]),
			"guests": count(*[_type == "guest"]),
			"recentPodcasts": *[_type == "podcast" && defined(slug.current)] | order(date desc)[0...3]{
				title,
				"slug": slug.current,
				date
			}
		}`);

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
			recommendedTools: [
				"search_content: Fast semantic & keyword search across all episodes, tutorials, and transcripts.",
				"get_content_by_slug: Retrieve full episode or post details, show notes, and transcript summaries.",
				"get_recent_content: Get the newest podcasts and articles.",
				"query_content: Run custom read-only GROQ queries.",
			],
		};

		return {
			content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
			isError: false,
		};
	} catch (err) {
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
						],
					}),
				},
			],
			isError: false,
		};
	}
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
