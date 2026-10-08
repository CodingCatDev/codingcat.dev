import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const skillsIndex = {
		$schema: "https://agentskills.io/schema/v1/index.json",
		version: "1.0",
		provider: {
			name: "CodingCat.dev",
			url: origin,
		},
		skills: [
			{
				id: "search-content",
				name: "Search Content",
				description:
					"Search full articles, podcast transcripts, and coding tutorials on CodingCat.dev across fullstack web development topics.",
				endpoint: `${origin}/api/search`,
				method: "GET",
				parameters: [
					{
						name: "q",
						type: "string",
						required: true,
						description: "The programming term or question to search",
					},
				],
			},
			{
				id: "mcp-tools",
				name: "Model Context Protocol Tools",
				description:
					"Streamable HTTP MCP tool execution for autonomous AI agent pair programming and search.",
				endpoint: `${origin}/api/mcp`,
				method: "POST",
				documentation: `${origin}/.well-known/mcp/server-card.json`,
			},
		],
	};

	return new Response(JSON.stringify(skillsIndex, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/llms.txt>; rel="llms-txt", <${origin}/.well-known/api-catalog>; rel="api-catalog"`,
		},
	});
};
