import type { APIRoute } from "astro";
import { sanityFetch } from "@/utils/sanity";
import { sitemapQuery } from "@/lib/queries";

export const prerender = false;

interface SitemapItem {
  _type: string;
  _updatedAt: string;
  slug: string;
}

function getPath(item: SitemapItem): string {
  if (item._type === "page") return `/${item.slug}`;
  return `/${item._type}/${item.slug}`;
}

export const GET: APIRoute = async () => {
  const site = "https://codingcat.dev";
  const items = await sanityFetch<SitemapItem[]>(sitemapQuery);

  const staticPages = [
    { url: site, lastmod: new Date().toISOString(), priority: "1.0" },
    { url: `${site}/blog`, lastmod: new Date().toISOString(), priority: "0.8" },
    { url: `${site}/podcasts`, lastmod: new Date().toISOString(), priority: "0.8" },
    { url: `${site}/authors`, lastmod: new Date().toISOString(), priority: "0.5" },
    { url: `${site}/guests`, lastmod: new Date().toISOString(), priority: "0.5" },
    { url: `${site}/sponsors`, lastmod: new Date().toISOString(), priority: "0.5" },
  ];

  const dynamicPages = items.map((item) => ({
    url: `${site}${getPath(item)}`,
    lastmod: item._updatedAt || new Date().toISOString(),
    priority: item._type === "post" || item._type === "podcast" ? "0.7" : "0.5",
  }));

  const allPages = [...staticPages, ...dynamicPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
