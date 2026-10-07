import type { APIRoute } from "astro";
import { buildRss2, FEED_LIMIT, type FeedItemSource } from "@/lib/feeds";
import { rssPostQuery } from "@/lib/sanity/queries";

export const GET: APIRoute = async ({ locals }) => {
	// fetchPublished, not loadQuery: a feed must never carry drafts or stega
	// characters, whatever the request's preview state.
	const items = await locals.sanity.fetchPublished(rssPostQuery, {
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
