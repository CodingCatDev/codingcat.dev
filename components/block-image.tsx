import { CloudinaryAsset } from "@/sanity.types";
import CloudinaryImage from "@/components/cloudinary-image";
import { stegaClean } from "@sanity/client/stega";

import { getCldImageUrl } from "next-cloudinary";

interface CoverImageProps {
  image: CloudinaryAsset;
}

export default async function BlockImage(props: CoverImageProps) {
  const { image: originalImage } = props;

  const source = stegaClean(originalImage);
  let image;
  if (source?.public_id) {
    const imageUrl = getCldImageUrl({
      src: source.public_id,
      width: 100,
    });
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${response.type};base64,${base64}`;

    image = (
      <CloudinaryImage
        className="w-full h-auto"
        width={1920}
        height={1080}
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
    image = <div className="bg-slate-50" style={{ paddingTop: "50%" }} />;
  }

  return (
    <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
      {image}
    </div>
  );
}
