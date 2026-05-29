"use client";

import Image from "next/image";
import type { Author } from "@/sanity/types";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

interface Props {
    name?: string;
    href?: string;
    coverImage: Exclude<Author["coverImage"], undefined> | undefined;
    imgSize?: string;
    width?: number;
    height?: number;
}

export default function Avatar({
    name,
    href,
    coverImage,
    imgSize,
    width,
    height,
}: Props) {
    const imageUrl = coverImage?.asset?._ref
        ? urlForImage(coverImage)?.width(width || 48).height(height || 48).url()
        : null;

    if (!imageUrl) return <></>;

    const imageElement = (
        <div className={`${imgSize ? imgSize : "w-12 h-12 mr-4"}`}>
            <Image
                className="w-full h-auto aspect-square rounded-md object-cover"
                width={width || 48}
                height={height || 48}
                alt={name || ""}
                src={imageUrl}
                unoptimized
            />
        </div>
    );

    if (!href) return imageElement;

    return (
        <Link className="flex items-center text-xl" href={href}>
            {imageElement}
            {name && (
                <div className="text-xl font-bold text-pretty hover:underline">
                    {name}
                </div>
            )}
        </Link>
    );
}
