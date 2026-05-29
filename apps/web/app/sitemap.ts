import type { MetadataRoute } from "next";
import { sitemapQuery } from "@/sanity/lib/queries";
import {
	sanityFetchMetadata,
	getDynamicFetchOptions,
} from "@/sanity/lib/live";
import type { SitemapQueryResult } from "@/sanity/types";
import { ContentType } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { perspective } = await getDynamicFetchOptions();
	const content = (
		await sanityFetchMetadata({
			query: sitemapQuery,
			perspective,
		})
	).data as SitemapQueryResult;

	const now = new Date();
	const sitemap: MetadataRoute.Sitemap = [
		{
			url: `${SITE_URL}`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/search`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 0.1,
		},
	];

	for (const c of content) {
		sitemap.push({
			url: `${SITE_URL}${c._type === ContentType.page ? `/${c.slug}` : `/${c._type}/${c.slug}`}`,
			lastModified: c._updatedAt ? new Date(c._updatedAt) : now,
			changeFrequency: "monthly",
			priority: 0.5,
		});
	}

	return sitemap;
}
