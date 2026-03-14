import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./api";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: any) {
    if (!source?.asset?._ref) return undefined;
    return imageBuilder.image(source);
}
