import {
	type ClientConfig,
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

/**
 * Tracks `<projectId>:<dataset>` pairs that returned HTTP 404 ("Dataset not found")
 * during the lifetime of the isolate so subsequent queries route directly to
 * `production` without an extra round-trip.
 */
const missingDatasets = new Set<string>();

function isDatasetNotFoundError(err: unknown): boolean {
	if (!err || typeof err !== "object") {
		return false;
	}
	const status = (err as { statusCode?: number }).statusCode;
	const message = (err as { message?: string }).message || "";
	return (
		status === 404 &&
		(message.includes("Dataset") || message.includes("not found"))
	);
}

function wrapWithDatasetFallback(
	primary: SanityClient,
	getFallback: () => SanityClient,
	projectId: string,
	dataset: string,
): SanityClient {
	if (dataset === "production") {
		return primary;
	}
	const datasetKey = `${projectId}:${dataset}`;
	const originalFetch = primary.fetch.bind(primary);
	primary.fetch = (async (
		query: string,
		params?: Record<string, unknown>,
		options?: unknown,
	) => {
		if (missingDatasets.has(datasetKey)) {
			return (getFallback().fetch as typeof originalFetch)(
				query,
				params as never,
				options as never,
			);
		}
		try {
			return await originalFetch(query, params as never, options as never);
		} catch (err) {
			if (isDatasetNotFoundError(err)) {
				missingDatasets.add(datasetKey);
				console.warn(
					`[Sanity] Dataset "${dataset}" not found for project "${projectId}", falling back to "production".`,
				);
				return (getFallback().fetch as typeof originalFetch)(
					query,
					params as never,
					options as never,
				);
			}
			throw err;
		}
	}) as typeof primary.fetch;
	return primary;
}

function memo(key: string, make: () => SanityClient): SanityClient {
	let client = cache.get(key);
	if (!client) {
		client = make();
		cache.set(key, client);
	}
	return client;
}

/**
 * Creates a Sanity client that automatically falls back to `dataset: "production"`
 * if the configured dataset does not exist (HTTP 404).
 */
export function createResilientClient(config: ClientConfig): SanityClient {
	const projectId = config.projectId || "hfh83o0w";
	const dataset = config.dataset || "production";
	if (
		dataset !== "production" &&
		missingDatasets.has(`${projectId}:${dataset}`)
	) {
		return createClient({ ...config, dataset: "production" });
	}
	const primary = createClient(config);
	return wrapWithDatasetFallback(
		primary,
		() => createClient({ ...config, dataset: "production" }),
		projectId,
		dataset,
	);
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
	if (
		dataset !== "production" &&
		missingDatasets.has(`${projectId}:${dataset}`)
	) {
		return publishedClient({ ...config, dataset: "production" });
	}
	return memo(`pub:${projectId}:${dataset}:${apiVersion}`, () => {
		const client = createClient({
			projectId,
			dataset,
			apiVersion,
			useCdn: true,
			perspective: "published",
			stega: false,
		});
		return wrapWithDatasetFallback(
			client,
			() => publishedClient({ ...config, dataset: "production" }),
			projectId,
			dataset,
		);
	});
}

/** Authenticated draft/preview reads, with stega and source maps enabled. */
export function previewClient(
	config: SanityConfig,
	token: string,
	perspective: ClientPerspective,
): SanityClient {
	const { projectId, dataset, apiVersion, studioUrl } = config;
	if (
		dataset !== "production" &&
		missingDatasets.has(`${projectId}:${dataset}`)
	) {
		return previewClient(
			{ ...config, dataset: "production" },
			token,
			perspective,
		);
	}
	const key = `prev:${projectId}:${dataset}:${apiVersion}:${String(perspective)}`;
	return memo(key, () => {
		const client = createClient({
			projectId,
			dataset,
			apiVersion,
			useCdn: false,
			perspective,
			token,
			resultSourceMap: "withKeyArraySelector",
			stega: { enabled: true, studioUrl },
		});
		return wrapWithDatasetFallback(
			client,
			() =>
				previewClient({ ...config, dataset: "production" }, token, perspective),
			projectId,
			dataset,
		);
	});
}
