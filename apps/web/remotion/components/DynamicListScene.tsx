import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { DynamicListSceneProps } from "../types";
import { ANIMATION, COLORS, LIST_COLORS, FONT_SIZES } from "../constants";
import { getActiveSegmentAtFrame } from "../../lib/utils/audio-timestamps";

export const DynamicListScene: React.FC<DynamicListSceneProps> = ({
  sceneIndex,
  durationInFrames,
  isVertical = false,
  wordTimestamps,
  items,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // Guard against empty items
  if (!items || items.length === 0) {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark})`,
        }}
      />
    );
  }

  // --- Scene-level fade in/out ---
  const sceneOpacity = interpolate(
    frame,
    [0, 15, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );


  // --- Entrance timing ---
  const entranceWindow = durationInFrames * 0.6;
  const staggerDelay = Math.max(1, Math.floor(entranceWindow / items.length));

  // --- Active segment (focus/dimming) ---
  const activeSegment =
    wordTimestamps && wordTimestamps.length > 0
      ? getActiveSegmentAtFrame(wordTimestamps, items.length, frame, fps)
      : Math.min(
          Math.floor((frame / durationInFrames) * items.length),
          items.length - 1,
        );

  // Alternating gradient direction
  const gradientAngle = (sceneIndex % 4) * 90;

  // Bullet character
  const bulletChar = icon || "✓";

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Dark gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.backgroundMedium})`,
        }}
      />

      {/* Layer 2: List container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? "80px 20px" : "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isVertical ? 12 : 16,
            maxWidth: isVertical ? "90%" : "80%",
            width: "100%",
          }}
        >
          {items.map((item, index) => {
            const itemEntryFrame = index * staggerDelay;

            // Item entrance spring
            const itemSpring =
              frame >= itemEntryFrame
                ? spring({
                    frame: frame - itemEntryFrame,
                    fps,
                    config: { damping: 12, mass: 0.6, stiffness: 100 },
                  })
                : 0;

            // Icon spring (triggers slightly after item entrance)
            const iconSpring =
              frame >= itemEntryFrame + 3
                ? spring({
                    frame: frame - itemEntryFrame - 3,
                    fps,
                    config: { damping: 10, mass: 0.4, stiffness: 120 },
                  })
                : 0;

            // Has this item entered yet?
            const hasEntered = frame >= itemEntryFrame;

            // Is this the active item?
            const isActive = hasEntered && index === activeSegment;

            // Opacity: invisible before entrance, then active/inactive
            const itemOpacity = !hasEntered
              ? 0
              : isActive
                ? itemSpring
                : itemSpring * LIST_COLORS.inactiveOpacity;

            // Transform values from spring
            const translateY = interpolate(itemSpring, [0, 1], [30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const scale = interpolate(itemSpring, [0, 1], [0.8, 1.0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Border color
            const borderColor = isActive
              ? LIST_COLORS.activeBorder
              : "transparent";

            // Background
            const cardBg = isActive
              ? LIST_COLORS.activeBg
              : "rgba(15, 15, 35, 0.6)";

            return (
              <div
                key={index}
                style={{
                  opacity: itemOpacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  background: cardBg,
                  backdropFilter: "blur(8px)",
                  borderRadius: 12,
                  padding: isVertical ? "16px 20px" : "20px 24px",
                  borderLeft: `4px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  boxShadow: isActive
                    ? `0 0 20px rgba(167, 139, 250, 0.2)`
                    : "none",
                }}
              >
                {/* Icon / bullet */}
                <div
                  style={{
                    fontSize: isVertical ? 40 : 35,
                    transform: `scale(${iconSpring})`,
                    flexShrink: 0,
                    color: icon ? undefined : LIST_COLORS.bulletColor,
                    lineHeight: 1,
                  }}
                >
                  {bulletChar}
                </div>

                {/* Item text */}
                <div
                  style={{
                    fontSize: Math.round(fonts.listItem * 1.25),
                    color: COLORS.textWhite,
                    fontFamily: "sans-serif",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
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
