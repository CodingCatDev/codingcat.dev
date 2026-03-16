import type { APIRoute } from "astro";
import { sanityFetch } from "@/utils/sanity";
import { rssPostsQuery } from "@/lib/queries";

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
  const posts = await sanityFetch<any[]>(rssPostsQuery);

  const items = posts.map((post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site}/post/${post.slug}</link>
      <guid>${site}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodingCat.dev Blog</title>
    <link>${site}/blog</link>
    <description>Purrfect Web Development Tutorials</description>
    <language>en-us</language>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
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
