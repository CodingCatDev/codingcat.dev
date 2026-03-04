import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
	projectId: projectId || "",
	dataset: dataset || "",
});

export const urlForImage = (source: any) => {
	// Ensure that source image contains a valid reference
	if (!source?.asset?._ref) {
		return undefined;
	}

	return imageBuilder?.image(source).auto("format").fit("max");
};

export function resolveOpenGraphImage(image: any, width = 1920, height = 1080) {
	if (!image?.asset?._ref) return;
	const url = urlForImage(image)?.width(width).height(height).url();
	if (!url) return;
	return {
		url,
		alt: image?.alt || "CodingCat.dev Image",
		width,
		height,
	};
}

export { resolveHref } from "@/sanity/lib/resolveHref";
