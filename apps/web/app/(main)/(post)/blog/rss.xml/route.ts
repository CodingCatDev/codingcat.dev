import { getFeedRss2 } from "@/lib/rss";
import { ContentType } from "@/lib/types";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function GET() {
	const { perspective } = await getDynamicFetchOptions();
	const rss = await getFeedRss2({ type: ContentType.post, perspective });
	return new Response(rss, {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
}
