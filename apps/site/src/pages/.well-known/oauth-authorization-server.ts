import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";

export const prerender = false;

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414)
 * powered by Better Auth with Auth.md agent_auth extension for autonomous AI agent discovery
 */
export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);

	let baseMeta: Record<string, any> = {};
	try {
		const req = new Request(
			`${origin}/.well-known/oauth-authorization-server`,
			request,
		);
		const baseRes = await auth.handler(req);
		if (baseRes.ok) {
			baseMeta = await baseRes.json();
		}
	} catch {
		// Fallback if request is invoked offline/in tests
	}

	const metadata = {
		...baseMeta,
		issuer: origin,
		authorization_endpoint: `${origin}/oauth2/authorize`,
		token_endpoint: `${origin}/oauth2/token`,
		registration_endpoint: `${origin}/oauth2/register`,
		jwks_uri: `${origin}/jwks`,
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
