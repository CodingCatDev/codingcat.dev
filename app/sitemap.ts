import type { MetadataRoute } from "next";
import { sitemapQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import type { SitemapQueryResult } from "@/sanity/types";
import { ContentType } from "@/lib/types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

	const site = productionDomain
		? `https://${productionDomain}`
		: "https://codingcat.dev";

	const content = (
		await sanityFetch({
			query: sitemapQuery,
		})
	).data as SitemapQueryResult;

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
			priority: 0.5,
		});
	}

	return sitemap;
}
