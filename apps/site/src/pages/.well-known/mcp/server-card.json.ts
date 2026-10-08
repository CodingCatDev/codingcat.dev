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
				name: "groq_query",
				title: "GROQ Query",
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
