import { youtubeParser } from "@/lib/utils";
import type { CloudinaryAsset } from "@/sanity/types";
import CoverImage from "@/components/cover-image";
import { YouTubeEmbed } from "./youtube-embed";

export function YouTube(props: {
	youtube: string;
	image?: CloudinaryAsset | null | undefined;
	className?: string;
}) {
	const { youtube, image, className } = props;
	const id = youtubeParser(youtube);

	return (
		<YouTubeEmbed youtube={youtube}>
			{image?.public_id ? (
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
					<img
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
						src={`https://i.ytimg.com/vi/${id}/sddefault.jpg`}
						srcSet={[
							`https://i.ytimg.com/vi/${id}/mqdefault.jpg 320w`,
							`https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w`,
							`https://i.ytimg.com/vi/${id}/sddefault.jpg 640w`,
						].join(", ")}
						alt=""
					/>
				</picture>
			)}
		</YouTubeEmbed>
	);
}
