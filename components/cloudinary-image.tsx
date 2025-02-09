"use client";

import {
	CldImage as CldImageDefault,
	type CldImageProps,
} from "next-cloudinary";

const CldImage = (props: CldImageProps) => {
	const dev = process.env.NODE_ENV !== "production";
	return (
		<CldImageDefault
			{...props}
			width={props.width || 1920}
			height={props.height || 1080}
			config={{
				url: {
					secureDistribution: "media.codingcat.dev",
					privateCdn: true,
				},
			}}
		/>
	);
};

export default CldImage;
