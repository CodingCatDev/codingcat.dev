import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

interface BlockImageProps {
    image: any;
}

export default function BlockImage(props: BlockImageProps) {
    const { image } = props;

    const imageUrl = image?.asset?._ref
        ? urlForImage(image)?.width(1920).height(1080).url()
        : null;

    if (!imageUrl) {
        return (
            <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                <div className="bg-slate-50" style={{ paddingTop: "50%" }} />
            </div>
        );
    }

    return (
        <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
            <Image
                className="w-full h-auto"
                width={1920}
                height={1080}
                sizes="100vw"
                alt={image?.alt || ""}
                src={imageUrl}
                unoptimized
            />
        </div>
    );
}
