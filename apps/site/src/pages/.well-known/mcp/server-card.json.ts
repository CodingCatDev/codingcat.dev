import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const serverCard = {
		$schema:
			"https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
		version: "1.0",
		protocolVersion: "2025-06-18",
		serverInfo: {
			name: "codingcatdev-search-mcp",
			title: "CodingCat.dev Search & Content MCP Server",
			version: "1.0.0",
		},
		description:
			"Search and access CodingCat.dev web development guides, coding tutorials, podcast episodes, and transcripts directly from AI models.",
		transport: {
			type: "streamable-http",
			endpoint: `${origin}/api/mcp`,
		},
		authentication: {
			required: false,
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
			Vary: "Accept",
			Link: `<${origin}/api/mcp>; rel="mcp-endpoint", <${origin}/llms.txt>; rel="llms-txt"`,
		},
	});
};
