import { CloudinaryAsset } from "@/sanity.types";
import CloudinaryVideo from "@/components/cloudinary-video";
import { stegaClean } from "@sanity/client/stega";

interface CoverImageProps {
  cloudinaryVideo: CloudinaryAsset | null | undefined;
}

export default function CoverVideo(props: CoverImageProps) {
  const { cloudinaryVideo } = props;

  const source = stegaClean(cloudinaryVideo);

  const video = source?.public_id ? (
    <CloudinaryVideo
      id={cloudinaryVideo?.public_id}
      className="w-full h-auto"
      width={1920}
      height={1080}
      src={source?.public_id}
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
