import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const config = {
		name: "codingcatdev-search-mcp",
		version: "1.0.0",
		description:
			"Search CodingCat.dev web development guides, coding tutorials, and podcasts.",
		endpoint: `${origin}/api/mcp`,
		serverCard: `${origin}/.well-known/mcp/server-card.json`,
	};

	return new Response(JSON.stringify(config, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
		},
	});
};
