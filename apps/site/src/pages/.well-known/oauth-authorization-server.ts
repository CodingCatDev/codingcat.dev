import type { APIRoute } from "astro";

export const prerender = false;

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414)
 * with Auth.md agent_auth extension for autonomous AI agent discovery
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const metadata = {
		issuer: origin,
		authorization_endpoint: `${origin}/oauth/authorize`,
		token_endpoint: `${origin}/oauth/token`,
		registration_endpoint: `${origin}/oauth/register`,
		jwks_uri: `${origin}/.well-known/jwks.json`,
		response_types_supported: ["code", "token"],
		grant_types_supported: [
			"authorization_code",
			"client_credentials",
			"urn:ietf:params:oauth:grant-type:token-exchange",
		],
		token_endpoint_auth_methods_supported: [
			"client_secret_basic",
			"client_secret_post",
			"none",
		],
		scopes_supported: ["read:content", "search", "mcp:tools", "agent"],
		code_challenge_methods_supported: ["S256"],
		agent_auth: {
			skill: `${origin}/auth.md`,
			register_uri: `${origin}/agent/auth`,
			identity_types_supported: ["identity_assertion", "anonymous"],
			identity_assertion: {
				assertion_types_supported: [
					"urn:ietf:params:oauth:token-type:id-jag",
					"verified_email",
				],
				credential_types_supported: ["bearer"],
				claim_uri: `${origin}/agent/claim`,
			},
			anonymous: {
				credential_types_supported: ["bearer"],
				claim_uri: `${origin}/agent/claim`,
			},
		},
	};

	return new Response(JSON.stringify(metadata, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
