import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Standard XML Sitemap Index (RFC / sitemaps.org 0.9)
 * Directs search and agent crawlers to the main content sitemap.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;
	const now = new Date().toISOString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${origin}/sitemap.xml</loc>
		<lastmod>${now}</lastmod>
	</sitemap>
</sitemapindex>
`;

	return new Response(body, {
		headers: {
			"content-type": "application/xml; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
};
