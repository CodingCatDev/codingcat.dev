import React from "react";
import type { VideoInputProps } from "../types";
import { VideoComposition } from "./VideoComposition";

export const MainVideo: React.FC<VideoInputProps> = (props) => {
  return <VideoComposition {...props} isVertical={false} />;
};
