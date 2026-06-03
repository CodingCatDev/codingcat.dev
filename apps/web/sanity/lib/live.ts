// Querying with "sanityFetch" will keep content automatically updated.
// "<SanityLive />" must be rendered once in the root layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.

import { type QueryParams } from "next-sanity";
import {
	defineLive,
	resolvePerspectiveFromCookies,
	type LivePerspective,
} from "next-sanity/live";
import { cookies, draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

if (!token) {
	throw new Error("Missing SANITY_API_READ_TOKEN");
}

export const { sanityFetch, SanityLive } = defineLive({
	client,
	serverToken: token,
	browserToken: token,
	strict: true,
});

export interface DynamicFetchOptions {
	perspective: LivePerspective;
	stega: boolean;
}

/**
 * Resolves `perspective` and `stega` from draft mode + the
 * `sanity-preview-perspective` cookie. Calls `cookies()`, a dynamic API, so it
 * must run inside a `<Suspense>` boundary (or a route with a sibling
 * `loading.tsx`) — never in the top-level body of a layout/page that should
 * stay in the static shell.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
	const { isEnabled: isDraftMode } = await draftMode();
	if (!isDraftMode) {
		return { perspective: "published", stega: false };
	}

	const jar = await cookies();
	const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
	return { perspective: perspective ?? "drafts", stega: true };
}

/** For usage within `generateStaticParams` only. */
export async function sanityFetchStaticParams<
	const QueryString extends string,
>({
	query,
	params = {},
}: {
	query: QueryString;
	params?: QueryParams;
}) {
	"use cache: remote";
	const { data } = await sanityFetch({
		query,
		params,
		perspective: "published",
		stega: false,
	});
	return { data };
}

/**
 * For usage within `generateMetadata`, `sitemap.ts`, `opengraph-image.tsx`,
 * and other metadata routes. Resolve `perspective` via `getDynamicFetchOptions`
 * so Presentation Tool preview windows reflect the right content release.
 */
export async function sanityFetchMetadata<const QueryString extends string>({
	query,
	params = {},
	perspective,
}: {
	query: QueryString;
	params?: QueryParams;
	perspective: LivePerspective;
}) {
	"use cache: remote";
	const { data } = await sanityFetch({
		query,
		params,
		perspective,
		stega: false,
	});
	return { data };
}
