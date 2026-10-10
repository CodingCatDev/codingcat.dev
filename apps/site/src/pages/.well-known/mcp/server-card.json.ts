import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const serverCard = {
		$schema: "https://modelcontextprotocol.io/schema/server-card.json",
		name: "CodingCat.dev Context MCP Server",
		serverInfo: {
			name: "codingcatdev-sanity-context-mcp",
			version: "1.0.0",
		},
		description:
			"Search and access CodingCat.dev web development guides, coding tutorials, podcast episodes, and transcripts directly from AI models via Sanity Content Lake.",
		transport: {
			type: "streamable-http",
			endpoint: `${origin}/mcp`,
		},
		mcpServers: {
			main: {
				url: `${origin}/mcp`,
				name: "CodingCat.dev Context MCP Server",
				description:
					"Search and access CodingCat.dev web development guides, coding tutorials, podcast episodes, and transcripts",
				transport: "streamable-http",
			},
		},
		capabilities: {
			tools: { listChanged: true },
			resources: {},
			prompts: {},
		},
		auth: {
			type: "none",
		},
		tools: [
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
							description:
								"Number of results to return (default: 10, max: 24).",
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
					"Execute read-only GROQ queries against the CodingCat.dev Sanity Content Lake dataset.",
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
					"Get initial context, schema overview, and usage instructions for the CodingCat.dev Sanity dataset.",
				inputSchema: {
					type: "object",
					properties: {},
				},
			},
			{
				name: "schema_explorer",
				title: "Schema Explorer",
				description:
					"Inspect a schema type's fields and structure in the CodingCat.dev Sanity dataset.",
				inputSchema: {
					type: "object",
					properties: {
						type: {
							type: "string",
							description:
								"Schema type name (e.g., 'post', 'podcast', 'course', 'author').",
						},
						path: {
							type: "string",
							description: "Optional field path to navigate within the type.",
						},
					},
					required: ["type"],
				},
			},
			{
				name: "array_field_reader",
				title: "Array Field Reader",
				description:
					"Read and navigate array fields (such as Portable Text and content blocks) on Sanity documents.",
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
							description:
								"Name of the array field to read (e.g., 'content', 'cues').",
						},
					},
					required: ["mode", "documentId", "field"],
				},
			},
		],
	};

	return new Response(JSON.stringify(serverCard, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			"access-control-allow-origin": "*",
			Vary: "Accept",
			Link: `<${origin}/mcp>; rel="mcp-endpoint", <${origin}/llms.txt>; rel="llms-txt"`,
		},
	});
};
