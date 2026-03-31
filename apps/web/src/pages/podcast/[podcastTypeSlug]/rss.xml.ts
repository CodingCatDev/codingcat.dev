import type { APIRoute } from "astro";
import { sanityFetch } from "@/utils/sanity";
import {
  podcastTypeBySlugQuery,
  rssPodcastsByTypeQuery,
} from "@/lib/queries";
import { escapeXml } from "@/utils/xml";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const podcastTypeSlug = params.podcastTypeSlug;
  if (!podcastTypeSlug) {
    return new Response("Not found", { status: 404 });
  }

  const site = "https://codingcat.dev";

  const podcastType = await sanityFetch<{
    _id: string;
    title: string;
    slug: string;
  } | null>(podcastTypeBySlugQuery, { podcastTypeSlug });

  if (!podcastType) {
    return new Response("Podcast type not found", { status: 404 });
  }

  const podcasts = await sanityFetch<any[]>(rssPodcastsByTypeQuery, {
    podcastTypeSlug,
  });

  const channelTitle = `CodingCat.dev — ${podcastType.title}`;
  const selfUrl = `${site}/podcast/${podcastTypeSlug}/rss.xml`;

  const items = podcasts
    .map(
      (podcast) => `    <item>
      <title>${escapeXml(podcast.title)}</title>
      <link>${site}/podcast/${podcast.slug}</link>
      <guid>${site}/podcast/${podcast.slug}</guid>
      <pubDate>${new Date(podcast.date).toUTCString()}</pubDate>
      ${podcast.excerpt ? `<description>${escapeXml(podcast.excerpt)}</description>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${site}/podcasts</link>
    <description>${escapeXml(`Episodes for ${podcastType.title}`)}</description>
    <language>en-us</language>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
