import { getFeedJson } from "@/lib/rss";
import { ContentType } from "@/lib/types";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function GET() {
	const { perspective } = await getDynamicFetchOptions();
	const json = await getFeedJson({ type: ContentType.podcast, perspective });
	return new Response(json, {
		headers: {
			"content-type": "application/json",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
}
