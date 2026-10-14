import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";

export const prerender = false;

/**
 * Web Bot Auth / HTTP Message Signatures Directory (RFC 9421 / draft-meunier-web-bot-auth-architecture)
 * Publishes a JWKS with public Ed25519 keys for verifying signed bot/agent requests.
 */
const FALLBACK_JWKS = {
	keys: [
		{
			alg: "EdDSA",
			crv: "Ed25519",
			kty: "OKP",
			use: "sig",
			x: "2KZd5-3bT1SibLVO26SW5o6IxfbpnhJAiHDpRl2eX_o",
			kid: "IFc7GiWLhvkCMoy5wasQWXr3coWets0F",
		},
	],
};

export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);

	try {
		const req = new Request(`${origin}/jwks`, request);
		const res = await auth.handler(req);
		if (res.ok) {
			const data = (await res.json()) as { keys?: unknown[] };
			if (Array.isArray(data?.keys) && data.keys.length > 0) {
				return new Response(JSON.stringify(data, null, 2), {
					headers: {
						"content-type":
							"application/http-message-signatures-directory+json; charset=utf-8",
						"access-control-allow-origin": "*",
						"cache-control": "public, max-age=3600, s-maxage=86400",
					},
				});
			}
		}
	} catch {
		// Fall through to deterministic public verification key
	}

	return new Response(JSON.stringify(FALLBACK_JWKS, null, 2), {
		headers: {
			"content-type":
				"application/http-message-signatures-directory+json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
