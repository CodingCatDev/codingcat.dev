"use client";

import {
  CldVideoPlayer as CldVideoPlayerDefault,
  CldVideoPlayerProps,
} from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const CldVideoPlayer = (props: CldVideoPlayerProps) => {
  return <CldVideoPlayerDefault {...props} analytics={false} />;
};

export default CldVideoPlayer;
