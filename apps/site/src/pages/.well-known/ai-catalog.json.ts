import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Implements Agentic Resource Discovery (ARD) capability manifest
 * per https://agenticresourcediscovery.org/ and ai-catalog data model.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;
	const hostDomain = locals.siteUrl.hostname;

	const manifest = {
		specVersion: "1.0",
		host: {
			displayName: "CodingCat.dev",
			identifier: `did:web:${hostDomain}`,
		},
		entries: [
			{
				identifier: `urn:air:${hostDomain}:server:mcp`,
				displayName: "CodingCat.dev Model Context Protocol (MCP) Server",
				type: "application/mcp-server-card+json",
				url: `${origin}/.well-known/mcp/server-card.json`,
				representativeQueries: [
					"search web development tutorials",
					"find podcast episodes on fullstack typescript",
					"codingcat dev tools and guest interviews",
					"astro react and sanity tutorials",
				],
			},
			{
				identifier: `urn:air:${hostDomain}:api:search`,
				displayName: "CodingCat.dev Semantic & Keyword Search API",
				type: "application/vnd.oai.openapi+json",
				url: `${origin}/.well-known/openapi.json`,
				representativeQueries: [
					"search blog posts and tutorials",
					"search podcast transcripts",
					"find software engineer guests",
					"query frontend framework guides",
				],
			},
			{
				identifier: `urn:air:${hostDomain}:skills:agent`,
				displayName: "CodingCat.dev Agent Skills Catalog",
				type: "application/json",
				url: `${origin}/.well-known/agent-skills/index.json`,
				representativeQueries: [
					"codingcat site agent skills",
					"automated content retrieval for codingcat",
					"agent discovery endpoints",
				],
			},
		],
	};

	return new Response(JSON.stringify(manifest, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
