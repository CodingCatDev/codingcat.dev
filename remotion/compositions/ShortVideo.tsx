import React from "react";
import type { VideoInputProps } from "../types";
import { VideoComposition } from "./VideoComposition";

export const ShortVideo: React.FC<VideoInputProps> = (props) => {
  return <VideoComposition {...props} isVertical />;
};
