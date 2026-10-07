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

	return {
		config,
		preview,
		loadQuery: (query, params) => loadQuery(config, preview, query, params),
		fetchPublished: (query, params) => fetchPublished(config, query, params),
		urlForImage: (source) => urlForImage(config, source),
		resolveOpenGraphImage: (image, width, height) =>
			resolveOpenGraphImage(config, image, width, height),
	};
}

export { PREVIEW_COOKIE, PERSPECTIVE_PARAM };
