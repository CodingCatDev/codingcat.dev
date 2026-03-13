import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HookSceneProps } from "../types";
import { ANIMATION, BRAND, COLORS, FONT_SIZES } from "../constants";

export const HookScene: React.FC<HookSceneProps> = ({
  hook,
  durationInFrames,
  isVertical = false,
  infographicUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  const hasInfographic = !!infographicUrl;

  // --- Ken Burns zoom for infographic background ---
  const infographicScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, isVertical ? 1.12 : 1.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Background pulse animation (only used when no infographic) ---
  const bgPulse = interpolate(
    frame,
    [0, durationInFrames],
    [0, 360],
    { extrapolateRight: "clamp" }
  );

  // --- Logo / brand fade in ---
  const brandOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const brandScale = spring({
    frame,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
  });

  // --- Hook text animation: spring pop-in after brand ---
  const hookSpring = spring({
    frame: frame - 20, // delay 20 frames after start
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 80 },
  });

  const hookOpacity = interpolate(
    hookSpring,
    [0, 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const hookScale = interpolate(
    hookSpring,
    [0, 1],
    [0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Fade out at end ---
  const fadeOut = interpolate(
    frame,
    [durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Background: infographic or animated gradient */}
      {hasInfographic ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={infographicUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${infographicScale})`,
              transformOrigin: "center center",
            }}
          />
          {/* Dark overlay for text readability */}
          <AbsoluteFill
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <>
          {/* Animated gradient background */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(${bgPulse}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.primary})`,
            }}
          />

          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: isVertical ? "15%" : "10%",
              right: isVertical ? "-10%" : "-5%",
              width: isVertical ? 300 : 500,
              height: isVertical ? 300 : 500,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.secondary}33, transparent)`,
              transform: `scale(${interpolate(frame, [0, 60], [0.5, 1.2], { extrapolateRight: "clamp" })})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: isVertical ? "20%" : "15%",
              left: isVertical ? "-15%" : "-8%",
              width: isVertical ? 250 : 400,
              height: isVertical ? 250 : 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.accent}22, transparent)`,
              transform: `scale(${interpolate(frame, [10, 70], [0.3, 1], { extrapolateRight: "clamp" })})`,
            }}
          />
        </>
      )}

      {/* Content container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? 40 : 80,
          gap: isVertical ? 40 : 50,
          flexDirection: "column",
        }}
      >
        {/* Brand name */}
        <div
          style={{
            opacity: brandOpacity,
            transform: `scale(${brandScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: isVertical ? 28 : 32,
              color: COLORS.secondary,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {BRAND.name}
          </div>
          <div
            style={{
              width: 60,
              height: 3,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
            }}
          />
        </div>

        {/* Hook text */}
        <div
          style={{
            opacity: hookOpacity,
            transform: `scale(${hookScale})`,
            maxWidth: isVertical ? "95%" : "80%",
          }}
        >
          <div
            style={{
              fontSize: fonts.hook,
              color: COLORS.textWhite,
              fontFamily: "sans-serif",
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.3,
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            {hook}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
