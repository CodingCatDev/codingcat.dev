import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import type { SceneProps } from "../types";
import { COLORS, FONT_SIZES } from "../constants";

/**
 * Scene — fallback scene component for Pexels b-roll backgrounds.
 * NO text overlays — audio narration carries all words.
 * Used only when no infographic data is available.
 */
export const Scene: React.FC<SceneProps> = ({
  narration,
  bRollUrl,
  visualDescription,
  sceneIndex,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // Scene transition: fade in at start
  const sceneOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Alternating gradient directions for visual variety
  const gradientAngle = (sceneIndex % 4) * 90;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Background — B-roll or gradient fallback */}
      {bRollUrl ? (
        <AbsoluteFill>
          <OffthreadVideo
            src={bRollUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />
          {/* Dark overlay for visual depth */}
          <AbsoluteFill
            style={{
              backgroundColor: COLORS.overlay,
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.backgroundMedium})`,
          }}
        />
      )}

      {/* Layer 2: CodingCat.dev watermark */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 30 : 20,
          right: isVertical ? 30 : 30,
          fontSize: fonts.watermark,
          color: "rgba(255, 255, 255, 0.35)",
          fontFamily: "monospace",
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        codingcat.dev
      </div>
    </AbsoluteFill>
  );
};
