import createImageUrlBuilder from "@sanity/image-url";

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
  if (!image || !image?.secure_url) return;
  const url = image?.secure_url;
  if (!url) return;
  return {
    url,
    alt: image?.context?.custom?.alt || "CodingCat.dev Image",
    width,
    height,
  };
}

export function resolveHref(
  documentType?: string,
  slug?: string
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/post/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
