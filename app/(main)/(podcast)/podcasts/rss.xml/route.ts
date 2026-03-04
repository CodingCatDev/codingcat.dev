export const dynamic = "force-dynamic"; // defaults to auto

import { buildPodcastFeed } from "@/lib/rss";

export async function GET() {
	const xml = await buildPodcastFeed({});
	return new Response(xml, {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
}
