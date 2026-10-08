import type { APIRoute } from "astro";

export const prerender = false;

/**
 * OpenID Connect Discovery 1.0 endpoint
 * http://openid.net/specs/openid-connect-discovery-1_0.html
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const config = {
		issuer: origin,
		authorization_endpoint: `${origin}/oauth/authorize`,
		token_endpoint: `${origin}/oauth/token`,
		userinfo_endpoint: `${origin}/oauth/userinfo`,
		jwks_uri: `${origin}/.well-known/jwks.json`,
		response_types_supported: ["code", "token", "id_token"],
		subject_types_supported: ["public"],
		id_token_signing_alg_values_supported: ["RS256"],
		scopes_supported: [
			"openid",
			"profile",
			"email",
			"read:content",
			"search",
			"mcp:tools",
			"agent",
		],
		token_endpoint_auth_methods_supported: [
			"client_secret_basic",
			"client_secret_post",
			"none",
			"private_key_jwt",
		],
		claims_supported: ["sub", "iss", "aud", "exp", "iat", "email"],
		grant_types_supported: [
			"authorization_code",
			"client_credentials",
			"urn:ietf:params:oauth:grant-type:token-exchange",
		],
	};

	return new Response(JSON.stringify(config, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
