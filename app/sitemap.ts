import { MetadataRoute } from "next";
import { sitemapQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SitemapQueryResult } from "@/sanity.types";
import { ContentType } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  const site = productionDomain
    ? `https://${productionDomain}`
    : "https://codingcat.dev";

  const content = await sanityFetch<SitemapQueryResult>({
    query: sitemapQuery,
  });

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${site}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.1,
    },
  ];

  for (const c of content) {
    sitemap.push({
      url: `${site}${c._type === ContentType.page ? `/${c.slug}` : `/${c._type}/${c.slug}`}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: c._type === ContentType.course ? 0.8 : 0.5,
    });
    c?.sections?.map((s) =>
      s?.lesson?.map((l) => {
        sitemap.push({
          url: `${site}/course/${c.slug}/lesson/${l.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
        });
      })
    );
  }

  return sitemap;
}
