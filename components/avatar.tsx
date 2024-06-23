"use client";

import { CldImage } from "next-cloudinary";
import { stegaClean } from "@sanity/client/stega";
import type { Author } from "@/sanity.types";
import Link from "next/link";

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
  const source = stegaClean(coverImage);

  if (!href && source?.public_id) {
    return (
      <div className={`${imgSize ? imgSize : "w-12 h-12 mr-4"}`}>
        <CldImage
          className="w-full h-auto"
          width={width || 48}
          height={height || 48}
          alt={source?.context?.custom?.alt || ""}
          src={source.public_id}
          config={{
            url: {
              secureDistribution: "media.codingcat.dev",
              privateCdn: true,
            },
          }}
        />
      </div>
    );
  }
  if (href && source?.public_id) {
    return (
      <Link className="flex items-center text-xl" href={href}>
        {source?.public_id && (
          <div className={`${imgSize ? imgSize : "w-12 h-12 mr-4"}`}>
            <CldImage
              className="w-full h-auto"
              width={width || 48}
              height={height || 48}
              alt={source?.context?.custom?.alt || ""}
              src={source.public_id}
              config={{
                url: {
                  secureDistribution: "media.codingcat.dev",
                  privateCdn: true,
                },
              }}
            />
          </div>
        )}
        {name && (
          <div className="text-xl font-bold text-pretty hover:underline">
            {name}
          </div>
        )}
      </Link>
    );
  }
  return <></>;
}
