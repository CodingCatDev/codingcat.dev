import type { CloudinaryAsset } from "@/sanity/types";
import { YouTube } from "@/components/youtube";
import CoverImage from "@/components/cover-image";
import CoverVideo from "@/components/cover-video";

export interface CoverMediaProps {
	cloudinaryImage: CloudinaryAsset | null | undefined;
	cloudinaryVideo: CloudinaryAsset | null | undefined;
	youtube: string | null | undefined;
	className?: string;
}

export default function CoverMedia(props: CoverMediaProps) {
	const { cloudinaryImage, cloudinaryVideo, youtube, className } = props;

	if (cloudinaryVideo?.public_id) {
		return (
			<CoverVideo cloudinaryVideo={cloudinaryVideo} className={className} />
		);
	}
	if (youtube) {
		return (
			<YouTube
				youtube={youtube}
				image={cloudinaryImage}
				className={className}
			/>
		);
	}
	return (
		<CoverImage image={cloudinaryImage} priority={true} className={className} />
	);
}
