import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SceneProps } from "../types";
import { ANIMATION, COLORS, FONT_SIZES } from "../constants";

export const Scene: React.FC<SceneProps> = ({
  narration,
  bRollUrl,
  visualDescription,
  sceneIndex,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Text animation: fade in → stay → fade out ---
  const textOpacity = interpolate(
    frame,
    [0, ANIMATION.fadeIn, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle slide-up for text
  const textTranslateY = interpolate(
    frame,
    [0, ANIMATION.fadeIn],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scene transition: fade in at start
  const sceneOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
              objectFit: isVertical ? "cover" : "cover",
            }}
            muted
          />
          {/* Dark overlay for text readability */}
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

      {/* Layer 2: Visual note (small debug/direction text, top-left) */}
      {visualDescription && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontSize: 14,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "monospace",
            maxWidth: 300,
          }}
        >
          [{visualDescription}]
        </div>
      )}

      {/* Layer 3: Narration text overlay */}
      <AbsoluteFill
        style={{
          justifyContent: isVertical ? "center" : "flex-end",
          alignItems: "center",
          padding: isVertical ? "60px 40px" : "80px 120px",
        }}
      >
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 16,
            padding: isVertical ? "28px 24px" : "32px 48px",
            maxWidth: isVertical ? "95%" : "80%",
            backdropFilter: "blur(8px)",
            borderLeft: `4px solid ${COLORS.primary}`,
          }}
        >
          <div
            style={{
              fontSize: fonts.narration,
              color: COLORS.textWhite,
              fontFamily: "sans-serif",
              fontWeight: 500,
              lineHeight: 1.5,
              textAlign: isVertical ? "center" : "left",
            }}
          >
            {narration}
          </div>
        </div>
      </AbsoluteFill>

      {/* Layer 4: CodingCat.dev watermark */}
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
