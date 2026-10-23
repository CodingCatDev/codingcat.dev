import type { APIRoute } from "astro";
import { buildRss2, FEED_LIMIT, type FeedItemSource } from "@/lib/feeds";
import { rssAllQuery } from "@/lib/sanity/queries";

export const GET: APIRoute = async ({ locals }) => {
	// Unified RSS 2.0 feed containing both blog posts and podcasts sorted by date.
	// Ideal for syndication platforms (e.g., daily.dev Squads) that expect standard
	// article RSS 2.0 items with cover image enclosures and HTML content.
	const items = await locals.sanity.fetchPublished(rssAllQuery, {
		skip: "none",
		offset: 0,
		limit: FEED_LIMIT,
	});

	const body = buildRss2({
		origin: locals.siteUrl.origin,
		sanity: locals.sanity,
		type: "post",
		items: items as FeedItemSource[],
		now: new Date(),
	});

	return new Response(body, {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
};
