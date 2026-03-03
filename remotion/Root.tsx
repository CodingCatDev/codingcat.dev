import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./compositions/MainVideo";
import { ShortVideo } from "./compositions/ShortVideo";
import { videoInputPropsSchema } from "./types";
import type { VideoInputProps } from "./types";
import {
  FPS,
  MAIN_WIDTH,
  MAIN_HEIGHT,
  SHORT_WIDTH,
  SHORT_HEIGHT,
} from "./constants";

/**
 * Calculate metadata (primarily duration) from the input props.
 * The total duration in frames is derived from the audio duration.
 */
const calculateMetadata = async ({
  props,
}: {
  props: VideoInputProps;
}) => {
  const durationInFrames = Math.ceil(props.audioDurationInSeconds * FPS);

  return {
    durationInFrames: Math.max(durationInFrames, FPS), // minimum 1 second
    props,
  };
};

/**
 * Default input props used for Remotion Studio preview.
 * These are overridden at render time by the pipeline.
 */
const defaultProps: VideoInputProps = {
  audioUrl: "https://example.com/placeholder-audio.mp3",
  audioDurationInSeconds: 60,
  hook: "Did you know you can build an entire video pipeline with code?",
  scenes: [
    {
      narration:
        "Today we're exploring how to automate video creation using Remotion, ElevenLabs, and AI.",
      bRollKeywords: ["coding", "automation"],
      visualDescription: "Show code editor with Remotion project",
    },
    {
      narration:
        "First, we generate a script using AI. Then we create text-to-speech audio with ElevenLabs.",
      bRollKeywords: ["AI", "text-to-speech"],
      visualDescription: "Show AI generating text",
    },
    {
      narration:
        "Finally, Remotion renders the video programmatically — no manual editing required.",
      bRollKeywords: ["video rendering", "automation"],
      visualDescription: "Show Remotion rendering progress",
    },
  ],
  cta: "If you found this helpful, smash that subscribe button and join the CodingCat.dev community!",
  sponsor: undefined,
  hookDurationInFrames: undefined,
  ctaDurationInFrames: undefined,
  sponsorDurationInFrames: undefined,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape — Main YouTube Video */}
      <Composition
        id="MainVideo"
        component={MainVideo}
        width={MAIN_WIDTH}
        height={MAIN_HEIGHT}
        fps={FPS}
        // Default duration; overridden by calculateMetadata at render time
        durationInFrames={FPS * 60}
        defaultProps={defaultProps}
        schema={videoInputPropsSchema}
        calculateMetadata={calculateMetadata}
      />

      {/* 9:16 Portrait — YouTube Short */}
      <Composition
        id="ShortVideo"
        component={ShortVideo}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        fps={FPS}
        durationInFrames={FPS * 60}
        defaultProps={defaultProps}
        schema={videoInputPropsSchema}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
