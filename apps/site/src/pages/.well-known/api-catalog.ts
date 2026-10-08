import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const catalog = {
		"api-catalog-version": "1.0",
		title: "CodingCat.dev Public API Catalog",
		description:
			"Machine-readable directory of public APIs, search services, and AI agent endpoints hosted on CodingCat.dev conforming to RFC 9727.",
		documentation: `${origin}/llms.txt`,
		apis: [
			{
				name: "Content Search API",
				description:
					"Fast keyword and semantic search across technical blog posts, tutorials, and podcast episodes.",
				endpoints: [
					{
						url: `${origin}/api/search`,
						method: "GET",
						parameters: [
							{
								name: "q",
								in: "query",
								required: true,
								description: "Search keyword or natural language query",
								schema: { type: "string" },
							},
						],
					},
				],
			},
			{
				name: "Model Context Protocol (MCP) Server",
				description:
					"Streamable HTTP MCP server implementing tools and resources for AI coding assistants and autonomous agents.",
				endpoints: [
					{
						url: `${origin}/api/mcp`,
						method: "POST",
						description: "JSON-RPC 2.0 / Streamable HTTP MCP endpoint",
					},
				],
				metadata: {
					serverCard: `${origin}/.well-known/mcp/server-card.json`,
					mcpJson: `${origin}/.well-known/mcp.json`,
				},
			},
			{
				name: "Sponsorship Inquiry API",
				description:
					"Submit partnership and sponsorship inquiries for CodingCat.dev media channels.",
				endpoints: [
					{
						url: `${origin}/api/sponsorship`,
						method: "POST",
					},
				],
			},
			{
				name: "Blog Content Syndication Feed",
				description: "RSS 2.0 feed containing full articles and metadata.",
				endpoints: [
					{
						url: `${origin}/blog/rss.xml`,
						method: "GET",
					},
				],
			},
			{
				name: "Podcast Media Feed",
				description:
					"RSS feed with podcast audio enclosures, chapters, and show notes.",
				endpoints: [
					{
						url: `${origin}/podcasts/rss.xml`,
						method: "GET",
					},
				],
			},
		],
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card", <${origin}/llms.txt>; rel="llms-txt"`,
		},
	});
};
