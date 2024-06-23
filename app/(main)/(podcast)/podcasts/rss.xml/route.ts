export const dynamic = "force-dynamic"; // defaults to auto

import { buildFeed } from "@/lib/rss";
import { ContentType } from "@/lib/types";

export async function GET() {
  const feed = await buildFeed({
    type: ContentType.podcast,
  });
  return new Response(feed.rss2(), {
    headers: {
      "content-type": "text/xml",
      "cache-control": "max-age=0, s-maxage=3600",
    },
  });
}
