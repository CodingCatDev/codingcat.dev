import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { InfographicSceneProps } from "../types";
import {
  ANIMATION,
  COLORS,
  FONT_SIZES,
  INFOGRAPHIC_COLORS,
} from "../constants";

// Default focus regions: center, top-left, bottom-right, top-right
const DEFAULT_FOCUS_REGIONS: Array<{ x: number; y: number; zoom: number }> = [
  { x: 0.5, y: 0.5, zoom: 1.0 },
  { x: 0.3, y: 0.35, zoom: 1.25 },
  { x: 0.7, y: 0.65, zoom: 1.2 },
  { x: 0.6, y: 0.3, zoom: 1.15 },
];

/**
 * InfographicScene — displays a Gemini-generated infographic PNG with
 * Ken Burns zoom/pan animation. The scene divides its duration into
 * focus regions and smoothly transitions between them.
 */
export const InfographicScene: React.FC<InfographicSceneProps> = ({
  narration,
  infographicUrl,
  focusRegions,
  sceneIndex,
  durationInFrames,
  isVertical = false,
  wordTimestamps,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  const regions = focusRegions && focusRegions.length > 0
    ? focusRegions
    : DEFAULT_FOCUS_REGIONS;

  const regionCount = regions.length;
  const framesPerRegion = durationInFrames / regionCount;

  // --- Determine current region and interpolation progress ---
  const currentRegionIndex = Math.min(
    Math.floor(frame / framesPerRegion),
    regionCount - 1,
  );
  const nextRegionIndex = Math.min(currentRegionIndex + 1, regionCount - 1);
  const regionLocalFrame = frame - currentRegionIndex * framesPerRegion;

  // Smooth progress within current region (0 → 1)
  const regionProgress = interpolate(
    regionLocalFrame,
    [0, framesPerRegion],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Eased progress for smooth motion
  const easedProgress = Easing.inOut(Easing.quad)(regionProgress);

  // --- Compute pan position (interpolate between current and next region) ---
  const currentRegion = regions[currentRegionIndex];
  const nextRegion = regions[nextRegionIndex];

  // Pan X: convert normalized (0-1) to pixel offset
  // At zoom 1.0, offset is 0. At higher zoom, we pan to center the focus region.
  const panX =
    currentRegion.x + (nextRegion.x - currentRegion.x) * easedProgress;
  const panY =
    currentRegion.y + (nextRegion.y - currentRegion.y) * easedProgress;

  // --- Compute zoom level ---
  const currentZoom = currentRegion.zoom;
  const nextZoom = nextRegion.zoom;
  const zoom = currentZoom + (nextZoom - currentZoom) * easedProgress;

  // Add a subtle per-region zoom-in effect (1.0 → 1.1 within each region)
  const intraRegionZoom = interpolate(
    regionLocalFrame,
    [0, framesPerRegion],
    [1.0, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const totalZoom = zoom * intraRegionZoom;

  // Convert normalized pan to translate offsets
  // When panX=0.5, panY=0.5 → centered (no translate)
  // The translate moves the image so the focus point is centered
  const translateX = -(panX - 0.5) * width * (totalZoom - 1) * 0.8;
  const translateY = -(panY - 0.5) * height * (totalZoom - 1) * 0.8;

  // --- Scene entrance animation ---
  const sceneOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Text animation: fade in → stay → fade out ---
  const textOpacity = interpolate(
    frame,
    [
      0,
      ANIMATION.fadeIn,
      durationInFrames - ANIMATION.fadeOut,
      durationInFrames,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Subtle slide-up for text
  const textTranslateY = interpolate(
    frame,
    [0, ANIMATION.fadeIn],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Spring entrance for the caption bar
  const captionSpring = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
  });

  // --- Vignette pulse: subtle glow that follows focus region transitions ---
  const vignetteOpacity = interpolate(
    regionLocalFrame,
    [0, framesPerRegion * 0.3, framesPerRegion * 0.7, framesPerRegion],
    [0.6, 0.3, 0.3, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Alternating gradient for fallback
  const gradientAngle = (sceneIndex % 4) * 90;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Infographic image with Ken Burns effect */}
      {infographicUrl ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={infographicUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${totalZoom}) translate(${translateX / totalZoom}px, ${translateY / totalZoom}px)`,
              transformOrigin: "center center",
            }}
          />
        </AbsoluteFill>
      ) : (
        /* Fallback: gradient background */
        <AbsoluteFill
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.backgroundMedium})`,
          }}
        />
      )}

      {/* Layer 2: Vignette overlay for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${INFOGRAPHIC_COLORS.vignette} 100%)`,
          opacity: vignetteOpacity,
        }}
      />

      {/* Layer 3: Focus glow overlay — subtle purple tint */}
      <AbsoluteFill
        style={{
          backgroundColor: INFOGRAPHIC_COLORS.focusGlow,
          opacity: interpolate(
            frame,
            [0, durationInFrames * 0.1, durationInFrames * 0.9, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      />

      {/* Layer 4: Narration caption bar */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: isVertical ? "60px 24px" : "40px 80px",
        }}
      >
        <div
          style={{
            opacity: textOpacity * captionSpring,
            transform: `translateY(${textTranslateY * (1 - captionSpring)}px)`,
            backgroundColor: INFOGRAPHIC_COLORS.captionBg,
            borderRadius: 12,
            padding: isVertical ? "24px 20px" : "24px 40px",
            maxWidth: isVertical ? "95%" : "85%",
            borderLeft: `4px solid ${COLORS.primary}`,
            marginBottom: isVertical ? 80 : 40,
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

      {/* Layer 5: CodingCat.dev watermark */}
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
