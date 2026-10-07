import type { ClientReturn, QueryParams } from "@sanity/client";
import { previewClient, publishedClient } from "./client";
import type { SanityConfig } from "./config";
import type { PreviewContext } from "./preview";

/**
 * The `const QueryString extends string` generic preserves the query's literal
 * type through the wrapper, which is what lets `ClientReturn<Q>` pick the right
 * result type out of the `declare module "@sanity/client"` query map emitted by
 * `sanity typegen`. That is what removes the `as` casts the Next app needed.
 */
export async function loadQuery<const QueryString extends string>(
	config: SanityConfig,
	preview: PreviewContext,
	query: QueryString,
	params: QueryParams = {},
): Promise<ClientReturn<QueryString>> {
	const client = preview.enabled
		? previewClient(config, preview.token, preview.perspective)
		: publishedClient(config);
	return client.fetch<ClientReturn<QueryString>>(query, params);
}

/**
 * Published-only, stega-free reads for RSS, sitemap, OG images and JSON-LD.
 *
 * Deliberately a separate function rather than a flag on loadQuery, so these
 * paths can never be handed a preview context by accident.
 */
export async function fetchPublished<const QueryString extends string>(
	config: SanityConfig,
	query: QueryString,
	params: QueryParams = {},
): Promise<ClientReturn<QueryString>> {
	return publishedClient(config).fetch<ClientReturn<QueryString>>(
		query,
		params,
	);
}
