import type { APIRoute } from "astro";

export const prerender = false;

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728)
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const protectedResource = {
		resource: origin,
		authorization_servers: [origin],
		scopes_supported: ["read:content", "search", "mcp:tools", "agent"],
		bearer_methods_supported: ["header"],
		resource_documentation: `${origin}/auth.md`,
	};

	return new Response(JSON.stringify(protectedResource, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
