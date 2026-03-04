import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

interface CoverImageProps {
    image: any;
    priority?: boolean;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
}

export default function CoverImage(props: CoverImageProps) {
    const { image, priority, className, width, height, quality } = props;

    const imageUrl = image?.asset?._ref
        ? urlForImage(image)?.width(width || 1920).height(height || 1080).quality(quality || 80).url()
        : null;

    // TODO: Add LQIP blur placeholder for progressive loading. Options:
    // 1. Query Sanity for lqip metadata: image.asset->metadata.lqip
    // 2. Use a tiny base64 placeholder generated at build time

    if (!imageUrl) {
        return (
            <div className="transition-shadow duration-200 shadow-md group-hover:shadow-lg sm:mx-0">
                <div className="bg-background" style={{ paddingTop: "50%" }} />
            </div>
        );
    }

    return (
        <div className="transition-shadow duration-200 shadow-md group-hover:shadow-lg sm:mx-0">
            <Image
                className={className || "w-full h-auto aspect-video rounded-md"}
                width={width || 1920}
                height={height || 1080}
                priority={priority}
                quality={quality || 80}
                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
                alt={image?.alt || ""}
                src={imageUrl}
            />
        </div>
    );
}
