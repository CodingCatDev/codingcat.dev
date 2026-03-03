import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CTASceneProps } from "../types";
import { ANIMATION, BRAND, COLORS, FONT_SIZES } from "../constants";

export const CTAScene: React.FC<CTASceneProps> = ({
  cta,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Fade in ---
  const fadeIn = interpolate(
    frame,
    [0, ANIMATION.fadeIn],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- CTA text spring ---
  const ctaSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 90 },
  });

  const ctaScale = interpolate(ctaSpring, [0, 1], [0.8, 1]);
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  // --- Subscribe button animation ---
  const buttonSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 100 },
  });

  // --- Social links stagger ---
  const socialLinks = [
    { label: "YouTube", value: BRAND.youtube },
    { label: "Twitter", value: BRAND.twitter },
    { label: "Discord", value: BRAND.discord },
    { label: "Web", value: BRAND.website },
  ];

  // --- Pulsing subscribe button ---
  const pulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.05, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.backgroundDark}, ${COLORS.primary}, ${COLORS.gradientEnd})`,
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? 40 : 80,
          flexDirection: "column",
          gap: isVertical ? 30 : 40,
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontSize: isVertical ? 24 : 28,
            color: COLORS.secondary,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {BRAND.name}
        </div>

        {/* CTA Text */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            maxWidth: isVertical ? "95%" : "75%",
          }}
        >
          <div
            style={{
              fontSize: fonts.cta,
              color: COLORS.textWhite,
              fontFamily: "sans-serif",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.4,
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.4)",
            }}
          >
            {cta}
          </div>
        </div>

        {/* Subscribe Button */}
        <div
          style={{
            transform: `scale(${buttonSpring * pulse})`,
            opacity: buttonSpring,
          }}
        >
          <div
            style={{
              backgroundColor: "#FF0000",
              color: COLORS.textWhite,
              fontSize: isVertical ? 28 : 32,
              fontFamily: "sans-serif",
              fontWeight: 700,
              padding: isVertical ? "16px 40px" : "18px 50px",
              borderRadius: 12,
              textTransform: "uppercase",
              letterSpacing: 2,
              boxShadow: "0 8px 30px rgba(255, 0, 0, 0.3)",
            }}
          >
            Subscribe
          </div>
        </div>

        {/* Social Links */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap: isVertical ? 16 : 40,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {socialLinks.map((link, i) => {
            const linkSpring = spring({
              frame: frame - 45 - i * 8,
              fps,
              config: { damping: 12, mass: 0.4, stiffness: 100 },
            });

            return (
              <div
                key={link.label}
                style={{
                  opacity: linkSpring,
                  transform: `translateY(${interpolate(linkSpring, [0, 1], [20, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontSize: isVertical ? 14 : 16,
                    color: COLORS.textMuted,
                    fontFamily: "sans-serif",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {link.label}
                </div>
                <div
                  style={{
                    fontSize: isVertical ? 18 : 20,
                    color: COLORS.textWhite,
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  {link.value}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
