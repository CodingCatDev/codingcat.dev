import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const serverCard = {
		$schema: "https://modelcontextprotocol.io/schema/server-card.json",
		name: "CodingCat.dev MCP Server",
		serverInfo: {
			name: "codingcatdev-search-mcp",
			version: "1.0.0",
		},
		description:
			"Search and access CodingCat.dev web development guides, coding tutorials, podcast episodes, and transcripts directly from AI models.",
		transport: {
			type: "streamable-http",
			endpoint: `${origin}/mcp`,
		},
		mcpServers: {
			main: {
				url: `${origin}/mcp`,
				name: "CodingCat.dev MCP Server",
				description:
					"Search and access CodingCat.dev web development guides, coding tutorials, podcast episodes, and transcripts",
				transport: "streamable-http",
			},
		},
		capabilities: {
			tools: { listChanged: false },
			resources: {},
			prompts: {},
		},
		auth: {
			type: "none",
		},
		tools: [
			{
				name: "search_content",
				title: "Search Content",
				description:
					"Search technical articles, tutorials, and podcast episodes on CodingCat.dev by keyword, topic, or question.",
				inputSchema: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description:
								"The programming topic, keyword, or question to search for",
						},
					},
					required: ["query"],
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
