import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SceneProps } from "../types";
import { ANIMATION, COLORS, FONT_SIZES } from "../constants";

/** When narration exceeds this many words, animate in chunks of 3 instead of per-word */
const WORD_CHUNK_THRESHOLD = 60;
const CHUNK_SIZE = 3;

export const Scene: React.FC<SceneProps> = ({
  narration,
  bRollUrl,
  visualDescription,
  sceneNumber,
  sceneIndex,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Scene-level fade in/out ---
  const sceneOpacity = interpolate(
    frame,
    [0, 15, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Text container animation: fade in + slide up ---
  const textOpacity = interpolate(
    frame,
    [0, ANIMATION.fadeIn, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const textTranslateY = interpolate(
    frame,
    [0, ANIMATION.fadeIn],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Ken Burns zoom for B-roll (slow zoom from 1.0 to 1.08 over scene) ---
  const kenBurnsScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Scene progress bar ---
  const progressWidth = interpolate(
    frame,
    [0, durationInFrames],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Scene number indicator fade-in ---
  const sceneNumberOpacity = interpolate(
    frame,
    [0, ANIMATION.fadeIn * 0.5, ANIMATION.fadeIn],
    [0, 0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Accent line animation (slides in from left before text) ---
  const accentLineWidth = spring({
    frame,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
  });

  const accentLineOpacity = interpolate(
    frame,
    [0, 8, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Glow pulse for text container border ---
  const glowIntensity = interpolate(
    frame,
    [0, ANIMATION.fadeIn, ANIMATION.fadeIn + 20, ANIMATION.fadeIn + 40],
    [0, 0, 12, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Word-by-word reveal (with chunking for long narrations) ---
  const words = narration.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const useChunking = totalWords > WORD_CHUNK_THRESHOLD;

  // Build display units: either individual words or chunks of CHUNK_SIZE
  const displayUnits: string[] = useChunking
    ? Array.from({ length: Math.ceil(totalWords / CHUNK_SIZE) }, (_, i) =>
        words.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE).join(" ")
      )
    : words;
  const totalUnits = displayUnits.length;

  // Spread reveals across the available time (leave some buffer at end)
  const revealWindow = Math.max(durationInFrames * 0.65, ANIMATION.fadeIn + totalUnits * 2);
  const framesPerUnit = Math.max(2, (revealWindow - ANIMATION.fadeIn * 0.5) / totalUnits);

  // Alternating gradient directions for visual variety
  const gradientAngle = (sceneIndex % 4) * 90;

  // Format scene number as 01, 02, etc.
  const displayNumber = sceneNumber !== undefined
    ? String(sceneNumber).padStart(2, "0")
    : String(sceneIndex + 1).padStart(2, "0");

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Background — B-roll with Ken Burns or gradient fallback */}
      {bRollUrl ? (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <OffthreadVideo
              src={bRollUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${kenBurnsScale})`,
              }}
              muted
            />
          </AbsoluteFill>
          {/* Gradient overlay — darker at bottom for text readability */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.15) 0%,
                rgba(0, 0, 0, 0.3) 40%,
                rgba(0, 0, 0, 0.7) 75%,
                rgba(0, 0, 0, 0.85) 100%
              )`,
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

      {/* Layer 3: Scene number indicator (top-right) */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? 60 : 40,
          right: isVertical ? 40 : 50,
          opacity: sceneNumberOpacity,
          fontSize: isVertical ? 64 : 56,
          fontFamily: "sans-serif",
          fontWeight: 800,
          color: COLORS.secondary,
          letterSpacing: 2,
          lineHeight: 1,
        }}
      >
        {displayNumber}
      </div>

      {/* Layer 4: Accent line + Narration text overlay */}
      <AbsoluteFill
        style={{
          justifyContent: isVertical ? "center" : "flex-end",
          alignItems: "center",
          padding: isVertical ? "60px 40px" : "80px 120px",
        }}
      >
        {/* Accent line — slides in before text */}
        <div
          style={{
            width: `${accentLineWidth * (isVertical ? 60 : 80)}px`,
            height: 4,
            backgroundColor: COLORS.primary,
            borderRadius: 2,
            marginBottom: 16,
            opacity: accentLineOpacity,
            alignSelf: isVertical ? "center" : "flex-start",
            marginLeft: isVertical ? 0 : 20,
            boxShadow: `0 0 10px ${COLORS.primary}`,
          }}
        />

        {/* Improved text container — modern card with glow */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            background: `linear-gradient(135deg, rgba(15, 15, 35, 0.85) 0%, rgba(26, 26, 46, 0.9) 50%, rgba(15, 15, 35, 0.85) 100%)`,
            borderRadius: 20,
            padding: isVertical ? "32px 28px" : "36px 52px",
            maxWidth: isVertical ? "95%" : "80%",
            backdropFilter: "blur(12px)",
            border: `1.5px solid rgba(109, 40, 217, 0.4)`,
            boxShadow: `
              0 0 ${glowIntensity}px ${COLORS.primary},
              0 0 ${glowIntensity * 2}px rgba(109, 40, 217, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Word-by-word text reveal */}
          <div
            style={{
              fontSize: fonts.narration,
              color: COLORS.textWhite,
              fontFamily: "sans-serif",
              fontWeight: 500,
              lineHeight: 1.55,
              textAlign: isVertical ? "center" : "left",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: isVertical ? "center" : "flex-start",
              gap: "0 0.35em",
            }}
          >
            {displayUnits.map((unit, i) => {
              const unitStartFrame = ANIMATION.fadeIn * 0.3 + i * framesPerUnit;
              const unitOpacity = interpolate(
                frame,
                [
                  unitStartFrame,
                  unitStartFrame + 6,
                  durationInFrames - ANIMATION.fadeOut,
                  durationInFrames,
                ],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const unitScale = interpolate(
                frame,
                [unitStartFrame, unitStartFrame + 6],
                [0.88, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <span
                  key={`${i}-${unit}`}
                  style={{
                    opacity: unitOpacity,
                    transform: `scale(${unitScale})`,
                    display: "inline-block",
                    willChange: "opacity, transform",
                  }}
                >
                  {unit}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* Layer 5: Scene progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 4,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            width: `${progressWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            borderRadius: "0 2px 2px 0",
            boxShadow: `0 0 8px ${COLORS.primary}`,
          }}
        />
      </div>

      {/* Layer 6: CodingCat.dev watermark */}
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
