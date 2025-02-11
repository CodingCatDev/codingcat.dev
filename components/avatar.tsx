"use client";

import { CldImage } from "next-cloudinary";
import type { Author } from "@/sanity/types";
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
	if (!href && coverImage?.public_id) {
		return (
			<div className={`${imgSize ? imgSize : "w-12 h-12 mr-4"}`}>
				<CldImage
					className="w-full h-auto aspect-square rounded-md object-cover"
					width={width || 48}
					height={height || 48}
					alt={coverImage?.context?.custom?.alt || ""}
					src={coverImage.public_id}
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
	if (href && coverImage?.public_id) {
		return (
			<Link className="flex items-center text-xl" href={href}>
				{coverImage?.public_id && (
					<div className={`${imgSize ? imgSize : "w-12 h-12 mr-4"}`}>
						<CldImage
							className="w-full h-auto aspect-square rounded-md object-cover"
							width={width || 48}
							height={height || 48}
							alt={coverImage?.context?.custom?.alt || ""}
							src={coverImage.public_id}
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
