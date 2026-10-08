import type { APIRoute } from "astro";

export const prerender = false;

/**
 * JWKS (JSON Web Key Set) public keys endpoint
 */
export const GET: APIRoute = async () => {
	return new Response(JSON.stringify({ keys: [] }, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
