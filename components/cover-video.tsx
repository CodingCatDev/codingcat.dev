import type { CloudinaryAsset } from "@/sanity/types";
import CloudinaryVideo from "@/components/cloudinary-video";

interface CoverVideoProps {
	cloudinaryVideo: CloudinaryAsset | null | undefined;
	className?: string;
}

export default function CoverVideo(props: CoverVideoProps) {
	const { cloudinaryVideo, className } = props;

	const video = cloudinaryVideo?.public_id ? (
		<CloudinaryVideo
			id={cloudinaryVideo?.public_id}
			className={className ?? "w-full h-auto"}
			width={1920}
			height={1080}
			src={cloudinaryVideo?.public_id}
			config={{
				url: {
					secureDistribution: "media.codingcat.dev",
					privateCdn: true,
				},
			}}
			analytics={false}
		/>
	) : (
		<div className="bg-slate-50" style={{ paddingTop: "50%" }} />
	);

	return (
		<div className="transition-shadow duration-200 shadow-md group-hover:shadow-lg sm:mx-0">
			{video}
		</div>
	);
}
