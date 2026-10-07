import {
	type ClientPerspective,
	createClient,
	type SanityClient,
} from "@sanity/client";
import type { SanityConfig } from "./config";

/**
 * Clients are memoized per (config, mode) for the life of the isolate. Workers
 * reuses isolates across requests, so this avoids rebuilding a client per hit
 * while still letting config come from the request.
 */
const cache = new Map<string, SanityClient>();

function memo(key: string, make: () => SanityClient): SanityClient {
	let client = cache.get(key);
	if (!client) {
		client = make();
		cache.set(key, client);
	}
	return client;
}

/**
 * Anonymous, published-only reads.
 *
 * `useCdn: true` is the single highest-leverage setting here. There is no
 * Next-style cache layer under SSR on Workers, so every request would otherwise
 * hit the uncached live API. apicdn is purged by Sanity on publish, so content
 * is still fresh within seconds.
 *
 * stega is OFF here and enabled only in previewClient. Encoded zero-width
 * characters are harmless in text nodes but corrupt hrefs, <meta> content,
 * JSON-LD and XML feeds — defaulting it off fails safe.
 */
export function publishedClient(config: SanityConfig): SanityClient {
	const { projectId, dataset, apiVersion } = config;
	return memo(`pub:${projectId}:${dataset}:${apiVersion}`, () =>
		createClient({
			projectId,
			dataset,
			apiVersion,
			useCdn: true,
			perspective: "published",
			stega: false,
		}),
	);
}

/** Authenticated draft/preview reads, with stega and source maps enabled. */
export function previewClient(
	config: SanityConfig,
	token: string,
	perspective: ClientPerspective,
): SanityClient {
	const { projectId, dataset, apiVersion, studioUrl } = config;
	const key = `prev:${projectId}:${dataset}:${apiVersion}:${String(perspective)}`;
	return memo(key, () =>
		createClient({
			projectId,
			dataset,
			apiVersion,
			useCdn: false,
			perspective,
			token,
			resultSourceMap: "withKeyArraySelector",
			stega: { enabled: true, studioUrl },
		}),
	);
}
