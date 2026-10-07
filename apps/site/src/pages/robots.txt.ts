import type { APIRoute } from "astro";

/**
 * Runtime rather than prerendered: the Host and Sitemap lines carry the
 * environment's own origin, which is only known per request (SITE_URL is a
 * wrangler var, and one build serves both Workers).
 *
 * Non-production environments are disallowed wholesale so the dev Worker and
 * any preview alias cannot be indexed alongside the real site.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;
	const isProduction = origin === "https://codingcat.dev";

	const body = isProduction
		? `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

Host: ${origin}
Sitemap: ${origin}/sitemap.xml
`
		: `User-Agent: *
Disallow: /
`;

	return new Response(body, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
};
