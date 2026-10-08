import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Serves agents.json according to AI agent discovery conventions.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const agentsData = {
		agents: [
			{
				name: "CodingCat Search & Content Agent",
				description:
					"Autonomous agent for searching and retrieving CodingCat.dev web development tutorials, articles, podcasts, and sponsor info.",
				url: `${origin}/api/mcp`,
				protocol: "mcp",
				documentation: `${origin}/.well-known/mcp/server-card.json`,
			},
			{
				name: "CodingCat A2A Agent",
				description:
					"Agent-to-agent interface for CodingCat.dev discovery and interactions.",
				url: `${origin}/agent/claim`,
				protocol: "a2a",
				documentation: `${origin}/auth.md`,
			},
		],
	};

	return new Response(JSON.stringify(agentsData, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			"access-control-allow-origin": "*",
		},
	});
};
