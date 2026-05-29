import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SponsorSlotProps } from "../types";
import { ANIMATION, COLORS, FONT_SIZES } from "../constants";

export const SponsorSlot: React.FC<SponsorSlotProps> = ({
  sponsor,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Animations ---

  // Card slides up from bottom
  const slideUp = spring({
    frame,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
  });

  const translateY = interpolate(slideUp, [0, 1], [300, 0]);

  // Fade out near the end
  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo scale pop
  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: isVertical ? 40 : 60,
        opacity,
      }}
    >
      {/* Semi-transparent backdrop */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Sponsor Card */}
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          backgroundColor: COLORS.sponsorBg,
          borderRadius: 20,
          padding: isVertical ? "32px 28px" : "40px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          backdropFilter: "blur(20px)",
          border: `2px solid ${COLORS.secondary}`,
          maxWidth: isVertical ? "90%" : "60%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* "Sponsored by" label */}
        <div
          style={{
            fontSize: fonts.sponsorLabel,
            color: COLORS.textMuted,
            textTransform: "uppercase",
            letterSpacing: 3,
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          Sponsored by
        </div>

        {/* Sponsor Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={sponsor.logoUrl}
            style={{
              maxHeight: isVertical ? 60 : 80,
              maxWidth: isVertical ? 200 : 300,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Sponsor Name */}
        <div
          style={{
            fontSize: fonts.sponsorTitle,
            color: COLORS.textWhite,
            fontFamily: "sans-serif",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {sponsor.name}
        </div>

        {/* Sponsor Message */}
        <div
          style={{
            fontSize: fonts.sponsorMessage,
            color: COLORS.textMuted,
            fontFamily: "sans-serif",
            fontWeight: 400,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 500,
          }}
        >
          {sponsor.message}
        </div>
      </div>
    </AbsoluteFill>
  );
};
