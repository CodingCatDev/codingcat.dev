import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Serves A2A Agent Card for agent-to-agent discovery
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const agentCard = {
		name: "CodingCat.dev Agent",
		description:
			"CodingCat.dev AI agent for fullstack web development tutorials, podcasts, and semantic search.",
		url: origin,
		version: "1.0.0",
		protocol: "a2a",
		supportedInterfaces: [
			{
				url: `${origin}/api/mcp`,
				protocolBinding: "JSONRPC",
				protocolVersion: "2.0",
			},
			{
				url: `${origin}/api/search`,
				protocolBinding: "HTTP+JSON",
				protocolVersion: "1.0",
			},
		],
		endpoints: {
			mcp: `${origin}/api/mcp`,
			search: `${origin}/api/search`,
			auth: `${origin}/agent/auth`,
			claim: `${origin}/agent/claim`,
		},
		capabilities: {
			search: true,
			mcp: true,
			read_content: true,
		},
		documentation: `${origin}/AGENTS.md`,
	};

	return new Response(JSON.stringify(agentCard, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			"access-control-allow-origin": "*",
		},
	});
};
