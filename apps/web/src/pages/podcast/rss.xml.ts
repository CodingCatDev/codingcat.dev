import type { APIRoute } from "astro";
import { sanityFetch } from "@/utils/sanity";
import { rssPodcastsQuery } from "@/lib/queries";

export const prerender = false;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const site = "https://codingcat.dev";
  const podcasts = await sanityFetch<any[]>(rssPodcastsQuery);

  const items = podcasts.map((podcast) => `    <item>
      <title>${escapeXml(podcast.title)}</title>
      <link>${site}/podcast/${podcast.slug}</link>
      <guid>${site}/podcast/${podcast.slug}</guid>
      <pubDate>${new Date(podcast.date).toUTCString()}</pubDate>
      ${podcast.excerpt ? `<description>${escapeXml(podcast.excerpt)}</description>` : ""}
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodingCat.dev Podcast</title>
    <link>${site}/podcasts</link>
    <description>Purrfect Web Development Podcast</description>
    <language>en-us</language>
    <atom:link href="${site}/podcast/rss.xml" rel="self" type="application/rss+xml"/>
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
