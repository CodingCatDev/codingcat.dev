import "server-only";

import type { QueryParams } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/**
 * Server-only Sanity fetch with ISR caching and tag-based revalidation.
 *
 * In draft mode: bypasses cache, uses token for draft content.
 * In production: uses CDN with Next.js cache tags for on-demand revalidation.
 */
export async function sanityFetch<T>({
	query,
	params = {},
	tags = [],
	revalidate,
	stega,
}: {
	query: string;
	params?: QueryParams;
	tags?: string[];
	revalidate?: number | false;
	stega?: boolean;
}): Promise<{ data: T }> {
	const isDraft = (await draftMode()).isEnabled;

	if (isDraft) {
		// Draft mode: bypass cache, use token, get draft content
		const data = await client
			.withConfig({
				useCdn: false,
				token: token || undefined,
				perspective: "drafts",
				stega: stega !== undefined ? { enabled: stega } : undefined,
			})
			.fetch<T>(query, params, {
				cache: "no-store",
			});
		return { data };
	}

	// Production: use CDN with ISR caching
	const data = await client
		.withConfig({
			useCdn: true,
			stega: stega !== undefined ? { enabled: stega } : undefined,
		})
		.fetch<T>(query, params, {
			next: {
				revalidate: revalidate ?? 60,
				tags,
			},
		});
	return { data };
}
