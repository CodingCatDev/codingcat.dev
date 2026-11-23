import type { APIRoute } from "astro";
import { sitemapQuery } from "@/lib/sanity/queries";
import { TOPICS } from "@/lib/topics";
import { escapeXml } from "@/lib/xml";

/**
 * Hand-built rather than via @astrojs/sitemap: that integration enumerates
 * build-time routes, and every content URL here is resolved at runtime from
 * Sanity. There is no static route generation to read.
 *
 * URL shape matches the Next `app/sitemap.ts` contract plus Course and Lesson
 * canonical routes; apps/site/baseline holds the pre-migration snapshot to diff against.
 */
export const GET: APIRoute = async ({ locals }) => {
	const content = await locals.sanity.fetchPublished<
		Array<{
			_type: string;
			_updatedAt?: string;
			slug: string;
			lessonSlugs?: Array<string | null> | null;
		}>
	>(sitemapQuery);
	const origin = locals.siteUrl.origin;
	const now = new Date().toISOString();

	const redirectedPageSlugs = new Set(["privacy-policy", "docs"]);

	const rawUrls = [
		{ loc: origin, lastmod: now, changefreq: "monthly", priority: "1" },
		{
			loc: `${origin}/search`,
			lastmod: now,
			changefreq: "daily",
			priority: "0.1",
		},
		{
			loc: `${origin}/courses`,
			lastmod: now,
			changefreq: "weekly",
			priority: "0.9",
		},
		{
			loc: `${origin}/podcasts`,
			lastmod: now,
			changefreq: "daily",
			priority: "0.9",
		},
		{
			loc: `${origin}/blog`,
			lastmod: now,
			changefreq: "daily",
			priority: "0.9",
		},
		{
			loc: `${origin}/topics`,
			lastmod: now,
			changefreq: "weekly",
			priority: "0.8",
		},
		...TOPICS.map((t) => ({
			loc: `${origin}/topic/${encodeURI(t.slug)}`,
			lastmod: now,
			changefreq: "weekly",
			priority: "0.8",
		})),
		{
			loc: `${origin}/about`,
			lastmod: now,
			changefreq: "monthly",
			priority: "0.6",
		},
		{
			loc: `${origin}/sponsorships`,
			lastmod: now,
			changefreq: "monthly",
			priority: "0.7",
		},
		{
			loc: `${origin}/book`,
			lastmod: now,
			changefreq: "weekly",
			priority: "0.6",
		},
		{
			loc: `${origin}/developers`,
			lastmod: now,
			changefreq: "monthly",
			priority: "0.6",
		},
		{
			loc: `${origin}/contact`,
			lastmod: now,
			changefreq: "monthly",
			priority: "0.5",
		},
		{
			loc: `${origin}/privacy`,
			lastmod: now,
			changefreq: "monthly",
			priority: "0.5",
		},
		...content.flatMap((entry) => {
			if (!entry.slug) return [];
			if (entry._type === "page" && redirectedPageSlugs.has(entry.slug)) {
				return [];
			}
			const lastmod = entry._updatedAt
				? new Date(entry._updatedAt).toISOString()
				: now;
			const encodedSlug = encodeURI(entry.slug.trim());
			const primaryUrl = {
				loc: `${origin}${entry._type === "page" ? `/${encodedSlug}` : `/${entry._type}/${encodedSlug}`}`,
				lastmod,
				changefreq: "monthly",
				priority: entry._type === "course" ? "0.7" : "0.5",
			};

			if (entry._type === "course" && Array.isArray(entry.lessonSlugs)) {
				const lessonUrls = entry.lessonSlugs
					.filter((ls): ls is string => Boolean(ls?.trim()))
					.map((ls) => ({
						loc: `${origin}/course/${encodedSlug}/lesson/${encodeURI(ls.trim())}`,
						lastmod,
						changefreq: "monthly",
						priority: "0.6",
					}));
				return [primaryUrl, ...lessonUrls];
			}

			return [primaryUrl];
		}),
	];

	const seenLocs = new Set<string>();
	const urls = rawUrls.filter((u) => {
		if (seenLocs.has(u.loc)) return false;
		seenLocs.add(u.loc);
		return true;
	});

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
