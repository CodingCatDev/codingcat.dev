import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";

export const prerender = false;

/**
 * JWKS (JSON Web Key Set) public keys endpoint
 */
export const GET: APIRoute = async ({ request, locals }) => {
	const origin = locals.siteUrl.origin;
	const auth = getAuth(origin);

	try {
		const req = new Request(`${origin}/jwks`, request);
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
		// Fallback
	}

	return new Response(JSON.stringify({ keys: [] }, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
