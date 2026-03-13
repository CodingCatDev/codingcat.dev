import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_SIZES } from "../constants";

/**
 * InfographicScene — cycles through multiple infographic images with
 * crossfade transitions and aggressive Ken Burns zoom + pan.
 * NO text overlays. Audio narration carries all words.
 *
 * Accepts both:
 * - `infographicUrls: string[]` (new multi-image cycling)
 * - `infographicUrl: string` (legacy single URL, wrapped into array)
 */

interface InfographicSceneProps {
  /** Narration text — kept for data pipeline but NOT rendered on screen */
  narration: string;
  /** Array of infographic image URLs for cycling */
  infographicUrls?: string[];
  /** Legacy single infographic URL (backward compat) */
  infographicUrl?: string;
  /** Scene index for visual variety */
  sceneIndex: number;
  /** Total duration of this scene in frames */
  durationInFrames: number;
  /** Portrait mode (9:16) */
  isVertical?: boolean;
  /** Seconds each image is displayed (default 4) */
  secondsPerImage?: number;
  /** Word timestamps — kept for interface compat but NOT used visually */
  wordTimestamps?: Array<{ text: string; startMs: number; endMs: number }>;
}

export const InfographicScene: React.FC<InfographicSceneProps> = ({
  narration,
  infographicUrls,
  infographicUrl,
  sceneIndex,
  durationInFrames,
  isVertical = false,
  secondsPerImage,
  wordTimestamps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Resolve image URLs: prefer array, fall back to single, then empty ---
  const images: string[] = (() => {
    if (infographicUrls && infographicUrls.length > 0) {
      return infographicUrls;
    }
    if (infographicUrl) {
      return [infographicUrl];
    }
    return [];
  })();

  // --- Timing constants ---
  const secPerImage = secondsPerImage ?? 4;
  const framesPerImage = Math.round(secPerImage * fps);
  const crossfadeDuration = Math.round(fps * 0.5); // 15 frames at 30fps

  // --- Scene entrance fade ---
  const sceneOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Compute opacity and scale for each image layer ---
  const getImageOpacity = (index: number): number => {
    const startFrame = index * framesPerImage;
    const endFrame = startFrame + framesPerImage;

    // Single image: always fully visible
    if (images.length === 1) {
      return 1;
    }

    // Last image: fade in, then stay visible until scene ends
    if (index === images.length - 1) {
      return interpolate(
        frame,
        [
          startFrame,
          startFrame + crossfadeDuration,
        ],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
    }

    // Normal image: fade in → hold → fade out
    return interpolate(
      frame,
      [
        startFrame,
        startFrame + crossfadeDuration,
        endFrame - crossfadeDuration,
        endFrame,
      ],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };

  // Ken Burns: aggressive zoom — vertical gets 1.0→1.15, landscape 1.0→1.08
  const getImageScale = (index: number): number => {
    const startFrame = index * framesPerImage;
    const endFrame = Math.min(
      startFrame + framesPerImage + crossfadeDuration,
      durationInFrames,
    );

    const zoomEnd = isVertical ? 1.15 : 1.08;

    return interpolate(
      frame,
      [startFrame, endFrame],
      [1.0, zoomEnd],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };

  // Pan movement for variety — even scenes pan X, odd scenes pan Y
  const getImagePan = (index: number): { translateX: number; translateY: number } => {
    const startFrame = index * framesPerImage;
    const endFrame = Math.min(
      startFrame + framesPerImage + crossfadeDuration,
      durationInFrames,
    );

    const panRange = isVertical ? 6 : 3; // vertical gets double pan range
    const isEvenScene = sceneIndex % 2 === 0;

    const panProgress = interpolate(
      frame,
      [startFrame, endFrame],
      [-panRange, panRange],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    if (isEvenScene) {
      // Even scenes: pan left-to-right
      return { translateX: panProgress, translateY: 0 };
    } else {
      // Odd scenes: pan top-to-bottom
      return { translateX: 0, translateY: panProgress };
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity: sceneOpacity,
      }}
    >
      {/* Image layers — stacked with crossfade opacity */}
      {images.length > 0 ? (
        images.map((url, index) => {
          const opacity = getImageOpacity(index);
          const scale = getImageScale(index);
          const pan = getImagePan(index);

          // Skip rendering images that are fully transparent
          if (opacity <= 0) {
            return null;
          }

          return (
            <AbsoluteFill
              key={`infographic-${sceneIndex}-${index}`}
              style={{
                opacity,
                overflow: "hidden",
              }}
            >
              <Img
                src={url}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `scale(${scale}) translate(${pan.translateX}%, ${pan.translateY}%)`,
                  transformOrigin: "center center",
                }}
              />
            </AbsoluteFill>
          );
        })
      ) : (
        /* Fallback: dark background when no images available */
        <AbsoluteFill
          style={{
            background: "#000000",
          }}
        />
      )}

      {/* Subtle vignette overlay for depth */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.3) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Watermark — subtle, bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 30 : 20,
          right: isVertical ? 30 : 30,
          fontSize: fonts.watermark,
          color: "rgba(255, 255, 255, 0.25)",
          fontFamily: "monospace",
          fontWeight: 600,
          letterSpacing: 1,
          pointerEvents: "none",
        }}
      >
        codingcat.dev
      </div>
    </AbsoluteFill>
  );
};
