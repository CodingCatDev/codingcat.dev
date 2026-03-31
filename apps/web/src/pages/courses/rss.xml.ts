import type { APIRoute } from "astro";
import { sanityFetch } from "@/utils/sanity";
import { rssCoursesQuery } from "@/lib/queries";
import { escapeXml } from "@/utils/xml";

export const prerender = false;

export const GET: APIRoute = async () => {
  const site = "https://codingcat.dev";
  const courses = await sanityFetch<any[]>(rssCoursesQuery);

  const items = courses
    .map(
      (course) => `    <item>
      <title>${escapeXml(course.title)}</title>
      <link>${site}/course/${course.slug}</link>
      <guid>${site}/course/${course.slug}</guid>
      <pubDate>${new Date(course.date).toUTCString()}</pubDate>
      ${course.excerpt ? `<description>${escapeXml(course.excerpt)}</description>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodingCat.dev Courses</title>
    <link>${site}/courses</link>
    <description>Structured courses and learning paths from CodingCat.dev</description>
    <language>en-us</language>
    <atom:link href="${site}/courses/rss.xml" rel="self" type="application/rss+xml"/>
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
