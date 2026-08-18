import { stegaClean } from "@sanity/client/stega";
import {
	createImageUrlBuilder,
	type SanityImageSource,
} from "@sanity/image-url";
import type { SanityConfig } from "./config";

type Builder = ReturnType<typeof createImageUrlBuilder>;

const builders = new Map<string, Builder>();

function builderFor({ projectId, dataset }: SanityConfig): Builder {
	const key = `${projectId}:${dataset}`;
	let b = builders.get(key);
	if (!b) {
		b = createImageUrlBuilder({ projectId, dataset });
		builders.set(key, b);
	}
	return b;
}

/**
 * Consolidated from the Next app, which had two divergent copies: a bare one in
 * sanity/lib/image.ts and one in sanity/lib/utils.ts that added
 * `.auto("format").fit("max")`. The latter behaviour wins — auto=format is what
 * serves WebP/AVIF.
 */
export function urlForImage(
	config: SanityConfig,
	source: SanityImageSource | undefined,
) {
	if (!source || !(source as { asset?: unknown })?.asset) {
		return undefined;
	}
	return builderFor(config).image(source).auto("format").fit("max");
}

export function resolveOpenGraphImage(
	config: SanityConfig,
	image: (SanityImageSource & { alt?: string }) | undefined,
	width = 1920,
	height = 1080,
) {
	const url = urlForImage(config, image)?.width(width).height(height).url();
	if (!url) {
		return undefined;
	}
	return {
		// stegaClean: this lands in a <meta content> attribute, where stega's
		// zero-width characters would corrupt the URL.
		url: stegaClean(url),
		alt: stegaClean(image?.alt) || "CodingCat.dev Image",
		width,
		height,
	};
}
