import { getPodcastFeedXml } from "@/lib/rss";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function GET() {
	const { perspective } = await getDynamicFetchOptions();
	const xml = await getPodcastFeedXml({ perspective });
	return new Response(xml, {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
}
