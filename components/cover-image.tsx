"use client";
import { CloudinaryAsset } from "@/sanity.types";
import CloudinaryImage from "@/components/cloudinary-image";
import { stegaClean } from "@sanity/client/stega";
import { getCldImageUrl } from "next-cloudinary";
import { useEffect, useState } from "react";

interface CoverImageProps {
  image: CloudinaryAsset | null | undefined;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
}

export default function CoverImage(props: CoverImageProps) {
  const {
    image: originalImage,
    priority,
    className,
    width,
    height,
    quality,
  } = props;
  const source = stegaClean(originalImage);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!source?.public_id) return;
    getImageUrl(source?.public_id);
  }, [source?.public_id]);

  const getImageUrl = async (src: string) => {
    const imageUrl = getCldImageUrl({
      src,
      width: 100,
    });
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    setDataUrl(`data:${response.type};base64,${base64}`);
  };

  let image;
  if (source?.public_id && dataUrl) {
    image = (
      <CloudinaryImage
        className={className || "w-full h-auto aspect-video"}
        width={width || 1920}
        height={height || 1080}
        priority={priority}
        quality={quality || "auto"}
        sizes="100vw"
        alt={source?.context?.custom?.alt || ""}
        src={source?.public_id}
        placeholder="blur"
        blurDataURL={dataUrl}
        config={{
          url: {
            secureDistribution: "media.codingcat.dev",
            privateCdn: true,
          },
        }}
      />
    );
  } else {
    image = <div className="bg-background" style={{ paddingTop: "50%" }} />;
  }

  return (
    <div className="transition-shadow duration-200 shadow-md group-hover:shadow-lg sm:mx-0">
      {image}
    </div>
  );
}
