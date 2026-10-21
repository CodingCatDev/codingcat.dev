import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";

export const prerender = false;

/**
 * OpenID Connect Discovery 1.0 endpoint
 * http://openid.net/specs/openid-connect-discovery-1_0.html
 */
export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);

	try {
		const req = new Request(
			`${origin}/.well-known/openid-configuration`,
			request,
		);
		const res = await auth.handler(req);
		if (res.ok) {
			const data = await res.json();
			return new Response(JSON.stringify(data, null, 2), {
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
					"cache-control": "public, max-age=3600, s-maxage=86400",
				},
			});
		}
	} catch {
		// Fallback if request is invoked offline/in tests
	}

	const config = {
		issuer: origin,
		authorization_endpoint: `${origin}/oauth2/authorize`,
		token_endpoint: `${origin}/oauth2/token`,
		userinfo_endpoint: `${origin}/oauth2/userinfo`,
		jwks_uri: `${origin}/jwks`,
		registration_endpoint: `${origin}/oauth2/register`,
		response_types_supported: ["code", "token", "id_token"],
		subject_types_supported: ["public"],
		id_token_signing_alg_values_supported: ["RS256", "EdDSA"],
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
			"refresh_token",
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
