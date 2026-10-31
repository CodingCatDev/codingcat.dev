import { stegaClean } from "@sanity/client/stega";
import {
	createImageUrlBuilder,
	type SanityImageSource,
} from "@sanity/image-url";
import type { SanityConfig } from "./config";

type Builder = ReturnType<typeof createImageUrlBuilder>;

const builders = new Map<string, Builder>();

function builderFor(
	{ projectId, dataset }: SanityConfig,
	mediaLibraryId?: string,
): Builder {
	const key = mediaLibraryId
		? `ml:${mediaLibraryId}`
		: `${projectId}:${dataset}`;
	let b = builders.get(key);
	if (!b) {
		b = createImageUrlBuilder(
			mediaLibraryId
				? ({ mediaLibraryId } as unknown as {
						projectId: string;
						dataset: string;
					})
				: { projectId, dataset },
		);
		builders.set(key, b);
	}
	return b;
}

function extractMediaLibraryId(
	source: SanityImageSource | undefined,
): string | undefined {
	if (!source || typeof source !== "object") {
		return undefined;
	}
	const mediaRef = stegaClean(
		(source as { media?: { _ref?: string } })?.media?._ref,
	);
	if (typeof mediaRef === "string" && mediaRef.startsWith("media-library:")) {
		const [, libraryId] = mediaRef.split(":");
		if (libraryId) {
			return libraryId;
		}
	}
	return undefined;
}

/**
 * Consolidated from the Next app, which had two divergent copies: a bare one in
 * sanity/lib/image.ts and one in sanity/lib/utils.ts that added
 * `.auto("format").fit("max")`. Auto=format serves WebP/AVIF.
 *
 * When an image includes a `media` globalDocumentReference (`media-library:mlttp0BZbCpV:<assetId>`),
 * URLs are served directly from the Sanity Media Library CDN (`https://cdn.sanity.io/media-libraries/mlttp0BZbCpV/images/...`).
 */
export function urlForImage(
	config: SanityConfig,
	source: SanityImageSource | undefined,
) {
	if (!source || !(source as { asset?: unknown })?.asset) {
		return undefined;
	}
	const mediaLibraryId = extractMediaLibraryId(source);
	return builderFor(config, mediaLibraryId)
		.image(source)
		.auto("format")
		.fit("max");
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
