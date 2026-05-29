import { buildFeed } from "@/lib/rss";
import { ContentType } from "@/lib/types";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function GET() {
	const { perspective } = await getDynamicFetchOptions();
	const feed = await buildFeed({
		type: ContentType.post,
		perspective,
	});
	return new Response(feed.rss2(), {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
}
