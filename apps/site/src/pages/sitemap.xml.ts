import type { APIRoute } from "astro";
import { sitemapQuery } from "@/lib/sanity/queries";
import { escapeXml } from "@/lib/xml";

/**
 * Hand-built rather than via @astrojs/sitemap: that integration enumerates
 * build-time routes, and every content URL here is resolved at runtime from
 * Sanity — there is no static route generation to read.
 *
 * URL shape matches the Next `app/sitemap.ts` exactly; apps/site/baseline
 * holds the pre-migration snapshot to diff against.
 */
export const GET: APIRoute = async ({ locals }) => {
	const content = await locals.sanity.fetchPublished(sitemapQuery);
	const origin = locals.siteUrl.origin;
	const now = new Date().toISOString();

	const urls = [
		{ loc: origin, lastmod: now, changefreq: "monthly", priority: "1" },
		{
			loc: `${origin}/search`,
			lastmod: now,
			changefreq: "daily",
			priority: "0.1",
		},
		...content.map((entry) => ({
			loc: `${origin}${entry._type === "page" ? `/${entry.slug}` : `/${entry._type}/${entry.slug}`}`,
			lastmod: entry._updatedAt
				? new Date(entry._updatedAt).toISOString()
				: now,
			changefreq: "monthly",
			priority: "0.5",
		})),
	];

	const body = urls
		.map(
			(url) => `<url>
<loc>${escapeXml(url.loc)}</loc>
<lastmod>${url.lastmod}</lastmod>
<changefreq>${url.changefreq}</changefreq>
<priority>${url.priority}</priority>
</url>`,
		)
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`,
		{
			headers: {
				"content-type": "application/xml; charset=utf-8",
				"cache-control": "max-age=0, s-maxage=3600",
			},
		},
	);
};
