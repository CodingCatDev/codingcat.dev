import type { ClientReturn, QueryParams } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import { resolveSanityConfig, type SanityConfig } from "./config";
import { resolveOpenGraphImage, urlForImage } from "./image";
import { fetchPublished, loadQuery } from "./load-query";
import {
	PERSPECTIVE_PARAM,
	PREVIEW_COOKIE,
	type PreviewContext,
	resolvePreview,
} from "./preview";

/**
 * Per-request Sanity access, built once in middleware and exposed on
 * `Astro.locals.sanity` so pages don't have to thread config/preview around.
 */
export interface SanityRequestContext {
	config: SanityConfig;
	preview: PreviewContext;
	/** Draft-aware read. Uses stega + drafts when preview is active. */
	loadQuery<const Q extends string>(
		query: Q,
		params?: QueryParams,
	): Promise<ClientReturn<Q>>;
	/** Published-only, stega-free read. Use for RSS, sitemap, OG, JSON-LD. */
	fetchPublished<const Q extends string>(
		query: Q,
		params?: QueryParams,
	): Promise<ClientReturn<Q>>;
	urlForImage(
		source: SanityImageSource | undefined,
	): ReturnType<typeof urlForImage>;
	resolveOpenGraphImage(
		image: (SanityImageSource & { alt?: string }) | undefined,
		width?: number,
		height?: number,
	): ReturnType<typeof resolveOpenGraphImage>;
}

export function createSanityContext({
	env,
	url,
	hasPreviewCookie,
}: {
	env: Record<string, string | undefined> | undefined;
	url: URL;
	hasPreviewCookie: boolean;
}): SanityRequestContext {
	const config = resolveSanityConfig(env);
	const preview = resolvePreview({
		env,
		hasPreviewCookie,
		perspectiveParam: url.searchParams.get(PERSPECTIVE_PARAM),
	});

	const loadCache = new Map<string, Promise<unknown>>();
	const publishedCache = new Map<string, Promise<unknown>>();

	return {
		config,
		preview,
		loadQuery: (query, params) => {
			const key = `${query}::${params ? JSON.stringify(params) : ""}`;
			const hit = loadCache.get(key);
			if (hit) {
				return hit as Promise<ClientReturn<typeof query>>;
			}
			const p = loadQuery(config, preview, query, params);
			loadCache.set(key, p);
			return p;
		},
		fetchPublished: (query, params) => {
			const key = `${query}::${params ? JSON.stringify(params) : ""}`;
			const hit = publishedCache.get(key);
			if (hit) {
				return hit as Promise<ClientReturn<typeof query>>;
			}
			const p = fetchPublished(config, query, params);
			publishedCache.set(key, p);
			return p;
		},
		urlForImage: (source) => urlForImage(config, source),
		resolveOpenGraphImage: (image, width, height) =>
			resolveOpenGraphImage(config, image, width, height),
	};
}

export { PREVIEW_COOKIE, PERSPECTIVE_PARAM };
