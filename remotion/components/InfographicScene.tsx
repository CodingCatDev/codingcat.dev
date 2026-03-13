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
 * crossfade transitions and subtle Ken Burns zoom. NO text overlays.
 * Audio narration carries all words.
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

  // Ken Burns: subtle zoom from 1.0 → 1.05 over the image's display duration
  const getImageScale = (index: number): number => {
    const startFrame = index * framesPerImage;
    const endFrame = Math.min(
      startFrame + framesPerImage + crossfadeDuration,
      durationInFrames,
    );

    return interpolate(
      frame,
      [startFrame, endFrame],
      [1.0, 1.05],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
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
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
              />
            </AbsoluteFill>
          );
        })
      ) : (
        /* Fallback: dark gradient when no images available */
        <AbsoluteFill
          style={{
            background: `linear-gradient(${(sceneIndex % 4) * 90}deg, #6D28D9, #0F0F23, #1A1A2E)`,
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
