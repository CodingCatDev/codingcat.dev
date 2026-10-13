import type { APIRoute } from "astro";

export const prerender = false;

/**
 * OAuth 2.0 Protected Resource Metadata for path-scoped resources (RFC 9728 §3.1)
 * e.g. /.well-known/oauth-protected-resource/mcp -> resource: https://codingcat.dev/mcp
 */
export const GET: APIRoute = async ({ params, locals }) => {
	const origin = locals.siteUrl.origin;
	const slug = params.slug ? `/${params.slug.replace(/^\/+/, "")}` : "";

	const protectedResource = {
		resource: `${origin}${slug}`,
		authorization_servers: [origin],
		scopes_supported: [
			"openid",
			"profile",
			"email",
			"offline_access",
			"read:content",
			"search",
			"mcp:tools",
			"agent",
		],
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
