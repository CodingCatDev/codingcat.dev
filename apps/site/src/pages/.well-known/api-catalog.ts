import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Implements RFC 9727 (API Catalog) returning application/linkset+json
 * conforming to RFC 9264 Linkset specification.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const catalog = {
		linkset: [
			{
				anchor: `${origin}/api/search`,
				"service-desc": [
					{
						href: `${origin}/.well-known/openapi.json`,
						type: "application/vnd.oai.openapi+json",
					},
				],
				"service-doc": [
					{
						href: `${origin}/llms.txt`,
						type: "text/markdown",
					},
				],
				status: [
					{
						href: `${origin}/api/search?q=test`,
						type: "application/json",
					},
				],
			},
			{
				anchor: `${origin}/api/mcp`,
				"service-desc": [
					{
						href: `${origin}/.well-known/mcp/server-card.json`,
						type: "application/mcp-server-card+json",
					},
					{
						href: `${origin}/.well-known/openapi.json`,
						type: "application/vnd.oai.openapi+json",
					},
				],
				"service-doc": [
					{
						href: `${origin}/llms.txt`,
						type: "text/markdown",
					},
				],
			},
			{
				anchor: `${origin}/api/sponsorship`,
				"service-desc": [
					{
						href: `${origin}/.well-known/openapi.json`,
						type: "application/vnd.oai.openapi+json",
					},
				],
				"service-doc": [
					{
						href: `${origin}/sponsorships`,
						type: "text/html",
					},
				],
			},
			{
				anchor: `${origin}/blog/rss.xml`,
				"service-doc": [
					{
						href: `${origin}/blog`,
						type: "text/html",
					},
				],
			},
			{
				anchor: `${origin}/podcasts/rss.xml`,
				"service-doc": [
					{
						href: `${origin}/podcasts`,
						type: "text/html",
					},
				],
			},
		],
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			"content-type": "application/linkset+json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card", <${origin}/llms.txt>; rel="llms-txt", <${origin}/.well-known/ai-catalog.json>; rel="ai-catalog"`,
		},
	});
};
