export const dynamic = "force-dynamic"; // defaults to auto

import { buildFeed } from "@/lib/rss";
import { ContentType } from "@/lib/types";

export async function GET() {
  const feed = await buildFeed({
    type: ContentType.course,
  });
  return new Response(feed.json1(), {
    headers: {
      "content-type": "application/json",
      "cache-control": "max-age=0, s-maxage=3600",
    },
  });
}
