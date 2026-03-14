import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ComparisonGridSceneProps } from "../types";
import { ANIMATION, COLORS, COMPARISON_COLORS, FONT_SIZES } from "../constants";
import { getActiveSegmentAtFrame } from "../../lib/utils/audio-timestamps";

export const ComparisonGridScene: React.FC<ComparisonGridSceneProps> = ({
  sceneIndex,
  durationInFrames,
  isVertical = false,
  wordTimestamps,
  leftLabel,
  rightLabel,
  rows,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // Guard against empty data
  if (!rows || rows.length === 0) {
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


  // --- Active segment (focus/dimming) ---
  const activeSegment =
    wordTimestamps && wordTimestamps.length > 0
      ? getActiveSegmentAtFrame(wordTimestamps, rows.length, frame, fps)
      : Math.min(
          Math.floor((frame / durationInFrames) * rows.length),
          rows.length - 1,
        );

  // Alternating gradient direction
  const gradientAngle = (sceneIndex % 4) * 90;

  // --- SVG Grid Line Drawing ---
  // Grid dimensions
  const gridWidth = isVertical ? 900 : 1400;
  const headerHeight = 70;
  const rowHeight = isVertical ? 120 : 70;
  const gridHeight = headerHeight + rows.length * rowHeight;

  const drawEnd = Math.round(durationInFrames * 0.2);

  // Vertical divider line (center) — only in landscape
  const verticalLineLength = gridHeight;
  const verticalDrawProgress = interpolate(
    frame,
    [0, drawEnd],
    [verticalLineLength, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Horizontal line lengths
  const horizontalLineLength = gridWidth;
  const horizontalDrawProgress = interpolate(
    frame,
    [0, drawEnd],
    [horizontalLineLength, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Header entrance spring ---
  const headerSpring = spring({
    frame,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
  });

  const headerTranslateY = interpolate(headerSpring, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Dark gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.backgroundMedium})`,
        }}
      />

      {/* Layer 2: Comparison grid */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? "80px 20px" : "60px 80px",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: isVertical ? "95%" : "80%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* SVG Grid Lines Overlay */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
            viewBox={`0 0 ${gridWidth} ${gridHeight}`}
            preserveAspectRatio="none"
          >
            {/* Vertical divider (center) — landscape only */}
            {!isVertical && (
              <line
                x1={gridWidth / 2}
                y1={0}
                x2={gridWidth / 2}
                y2={gridHeight}
                stroke={COMPARISON_COLORS.gridLine}
                strokeWidth={2}
                strokeDasharray={verticalLineLength}
                strokeDashoffset={verticalDrawProgress}
              />
            )}

            {/* Horizontal separators between header and rows, and between rows */}
            {Array.from({ length: rows.length + 1 }).map((_, i) => {
              const y = headerHeight + i * rowHeight;
              return (
                <line
                  key={`h-line-${i}`}
                  x1={0}
                  y1={y}
                  x2={gridWidth}
                  y2={y}
                  stroke={COMPARISON_COLORS.gridLine}
                  strokeWidth={2}
                  strokeDasharray={horizontalLineLength}
                  strokeDashoffset={horizontalDrawProgress}
                />
              );
            })}
          </svg>

          {/* Header Row */}
          <div
            style={{
              display: "flex",
              flexDirection: isVertical ? "column" : "row",
              opacity: headerSpring,
              transform: `translateY(${headerTranslateY}px)`,
              background: COMPARISON_COLORS.headerBg,
              backdropFilter: "blur(8px)",
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Left label */}
            <div
              style={{
                flex: 1,
                padding: isVertical ? "16px 20px" : "20px 24px",
                fontSize: Math.round(fonts.comparisonHeader * 1.25),
                fontFamily: "sans-serif",
                fontWeight: 700,
                color: COMPARISON_COLORS.leftAccent,
                textAlign: "center",
                borderBottom: isVertical
                  ? `2px solid ${COMPARISON_COLORS.gridLine}`
                  : "none",
              }}
            >
              {leftLabel}
            </div>

            {/* Right label */}
            <div
              style={{
                flex: 1,
                padding: isVertical ? "16px 20px" : "20px 24px",
                fontSize: Math.round(fonts.comparisonHeader * 1.25),
                fontFamily: "sans-serif",
                fontWeight: 700,
                color: COMPARISON_COLORS.rightAccent,
                textAlign: "center",
              }}
            >
              {rightLabel}
            </div>
          </div>

          {/* Data Rows */}
          {rows.map((row, index) => {
            const staggerDelay = Math.round(durationInFrames * 0.05) + index * 4;

            // Row entrance spring
            const rowSpring =
              frame >= staggerDelay
                ? spring({
                    frame: frame - staggerDelay,
                    fps,
                    config: {
                      damping: ANIMATION.springDamping,
                      mass: ANIMATION.springMass,
                      stiffness: ANIMATION.springStiffness,
                    },
                  })
                : 0;

            const hasEntered = frame >= staggerDelay;
            const isActive = hasEntered && index === activeSegment;

            // Opacity: invisible before entrance, then active/inactive
            const rowOpacity = !hasEntered
              ? 0
              : isActive
                ? rowSpring
                : rowSpring * 0.5;

            // Transform values from spring
            const translateY = interpolate(rowSpring, [0, 1], [30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const scale = isActive
              ? interpolate(rowSpring, [0, 1], [0.95, 1.02], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(rowSpring, [0, 1], [0.95, 1.0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

            const rowBg = isActive
              ? COMPARISON_COLORS.activeRow
              : "rgba(15, 15, 35, 0.6)";

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: isVertical ? "column" : "row",
                  opacity: rowOpacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  background: rowBg,
                  backdropFilter: "blur(8px)",
                  position: "relative",
                  zIndex: 2,
                  borderRadius:
                    index === rows.length - 1 ? "0 0 12px 12px" : 0,
                  boxShadow: isActive
                    ? "0 0 20px rgba(167, 139, 250, 0.2)"
                    : "none",
                }}
              >
                {/* Left cell */}
                <div
                  style={{
                    flex: 1,
                    padding: isVertical ? "14px 20px" : "18px 24px",
                    fontSize: Math.round(fonts.comparisonCell * 1.25),
                    fontFamily: "sans-serif",
                    fontWeight: 500,
                    color: COLORS.textWhite,
                    textAlign: "center",
                    lineHeight: 1.4,
                    borderBottom: isVertical
                      ? `1px solid ${COMPARISON_COLORS.gridLine}`
                      : "none",
                    borderLeft: `3px solid ${COMPARISON_COLORS.leftAccent}`,
                  }}
                >
                  {row.left}
                </div>

                {/* Right cell */}
                <div
                  style={{
                    flex: 1,
                    padding: isVertical ? "14px 20px" : "18px 24px",
                    fontSize: Math.round(fonts.comparisonCell * 1.25),
                    fontFamily: "sans-serif",
                    fontWeight: 500,
                    color: COLORS.textWhite,
                    textAlign: "center",
                    lineHeight: 1.4,
                    borderRight: `3px solid ${COMPARISON_COLORS.rightAccent}`,
                  }}
                >
                  {row.right}
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
