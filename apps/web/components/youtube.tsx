import Image from "next/image";
import { youtubeParser } from "@/lib/utils";

import CoverImage from "@/components/cover-image";
import { YouTubeEmbed } from "./youtube-embed";

export function YouTube(props: {
	youtube: string;
	image?: any;
	className?: string;
}) {
	const { youtube, image, className } = props;
	if (!youtube) {
		return <></>;
	}
	const id = youtubeParser(youtube);

	return (
		<YouTubeEmbed youtube={youtube}>
			{image?.asset?._ref ? (
				<CoverImage image={image} priority={true} className={className} />
			) : (
				<picture>
					<source
						type="image/webp"
						srcSet={[
							`https://i.ytimg.com/vi_webp/${id}/mqdefault.webp 320w`,
							`https://i.ytimg.com/vi_webp/${id}/hqdefault.webp 480w`,
							`https://i.ytimg.com/vi_webp/${id}/sddefault.webp 640w`,
						].join(", ")}
					/>
					<Image
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
						src={`https://i.ytimg.com/vi/${id}/sddefault.jpg`}
						alt=""
						width={640}
						height={480}
					/>
				</picture>
			)}
		</YouTubeEmbed>
	);
}
