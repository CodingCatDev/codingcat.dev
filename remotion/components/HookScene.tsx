import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HookSceneProps } from "../types";
import { ANIMATION, BRAND, COLORS, FONT_SIZES } from "../constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Split hook text into 2-3 roughly equal lines for staggered reveal */
function splitIntoLines(text: string, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  if (words.length <= 3) return [text];

  const lineCount = Math.min(maxLines, Math.max(2, Math.ceil(words.length / 5)));
  const wordsPerLine = Math.ceil(words.length / lineCount);
  const lines: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }
  return lines;
}

/** Deterministic pseudo-random from seed */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Animated dot grid background */
const DotGrid: React.FC<{
  frame: number;
  durationInFrames: number;
  isVertical: boolean;
}> = ({ frame, durationInFrames, isVertical }) => {
  const cols = isVertical ? 6 : 8;
  const rows = isVertical ? 8 : 6;
  const dotSpacingX = isVertical ? 180 : 240;
  const dotSpacingY = isVertical ? 240 : 180;

  // Slow drift of the entire grid
  const driftX = interpolate(frame, [0, durationInFrames], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(frame, [0, durationInFrames], [0, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = r * cols + c;
      const phase = seededRandom(seed) * 120;
      // Subtle pulse per dot
      const pulse = interpolate(
        Math.sin(((frame + phase) / 40) * Math.PI * 2),
        [-1, 1],
        [0.15, 0.4]
      );
      dots.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: c * dotSpacingX + driftX,
            top: r * dotSpacingY + driftY,
            width: 3,
            height: 3,
            borderRadius: "50%",
            backgroundColor: COLORS.secondary,
            opacity: pulse,
          }}
        />
      );
    }
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: 0.5 }}>{dots}</AbsoluteFill>
  );
};

/** Floating particles that drift upward */
const Particles: React.FC<{
  frame: number;
  durationInFrames: number;
  isVertical: boolean;
  width: number;
  height: number;
}> = ({ frame, durationInFrames, isVertical, width, height }) => {
  const count = 18;
  const particles: React.ReactNode[] = [];
  const baseWidth = width;
  const baseHeight = height;

  for (let i = 0; i < count; i++) {
    const startX = seededRandom(i * 7 + 1) * baseWidth;
    const startY = baseHeight * 0.6 + seededRandom(i * 7 + 2) * baseHeight * 0.5;
    const speed = 0.8 + seededRandom(i * 7 + 3) * 1.5;
    const size = 3 + seededRandom(i * 7 + 4) * 5;
    const wobbleAmp = 15 + seededRandom(i * 7 + 5) * 30;
    const wobbleFreq = 0.03 + seededRandom(i * 7 + 6) * 0.04;
    const delay = seededRandom(i * 7 + 7) * 40;

    const effectiveFrame = Math.max(0, frame - delay);
    const y = startY - effectiveFrame * speed;
    const x = startX + Math.sin(effectiveFrame * wobbleFreq) * wobbleAmp;

    const opacity = interpolate(
      effectiveFrame,
      [0, 15, durationInFrames * 0.7, durationInFrames],
      [0, 0.7, 0.7, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const isAccent = i % 4 === 0;
    particles.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: isAccent ? COLORS.accent : COLORS.secondary,
          opacity,
          boxShadow: isAccent
            ? `0 0 ${size * 2}px ${COLORS.accent}88`
            : `0 0 ${size}px ${COLORS.secondary}66`,
        }}
      />
    );
  }

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

/** Glowing sweep lines that cross the screen before text appears */
const GlowSweeps: React.FC<{
  frame: number;
  isVertical: boolean;
  width: number;
  height: number;
}> = ({ frame, isVertical, width, height }) => {
  const screenW = width;
  const screenH = height;

  // Line 1: horizontal sweep at ~frame 5-25
  const sweep1Progress = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep1X = interpolate(sweep1Progress, [0, 1], [-400, screenW + 400]);
  const sweep1Opacity = interpolate(
    sweep1Progress,
    [0, 0.2, 0.8, 1],
    [0, 0.9, 0.9, 0]
  );

  // Line 2: diagonal sweep at ~frame 10-30
  const sweep2Progress = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep2X = interpolate(sweep2Progress, [0, 1], [-400, screenW + 400]);
  const sweep2Opacity = interpolate(
    sweep2Progress,
    [0, 0.2, 0.8, 1],
    [0, 0.7, 0.7, 0]
  );

  // Line 3: vertical accent at ~frame 8-22
  const sweep3Progress = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep3Y = interpolate(sweep3Progress, [0, 1], [-200, screenH + 200]);
  const sweep3Opacity = interpolate(
    sweep3Progress,
    [0, 0.3, 0.7, 1],
    [0, 0.6, 0.6, 0]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Horizontal glow line */}
      <div
        style={{
          position: "absolute",
          left: sweep1X - 150,
          top: isVertical ? "35%" : "45%",
          width: 300,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, ${COLORS.accent}, ${COLORS.secondary}, transparent)`,
          opacity: sweep1Opacity,
          boxShadow: `0 0 20px ${COLORS.secondary}AA, 0 0 60px ${COLORS.primary}66`,
        }}
      />
      {/* Diagonal glow line */}
      <div
        style={{
          position: "absolute",
          left: sweep2X - 200,
          top: isVertical ? "55%" : "30%",
          width: 400,
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}CC, transparent)`,
          opacity: sweep2Opacity,
          transform: "rotate(-15deg)",
          boxShadow: `0 0 15px ${COLORS.accent}88`,
        }}
      />
      {/* Vertical accent line */}
      <div
        style={{
          position: "absolute",
          left: isVertical ? "50%" : "60%",
          top: sweep3Y - 100,
          width: 1.5,
          height: 200,
          background: `linear-gradient(180deg, transparent, ${COLORS.secondary}BB, transparent)`,
          opacity: sweep3Opacity,
          boxShadow: `0 0 12px ${COLORS.secondary}66`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export const HookScene: React.FC<HookSceneProps> = ({
  hook,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // ── Dynamic gradient background ──────────────────────────────────────────
  // Rotate hue and shift gradient angle over the scene
  const gradientAngle = interpolate(frame, [0, durationInFrames], [135, 315], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // We'll use CSS hue-rotate for dynamic color shifting
  const hueShift = interpolate(frame, [0, durationInFrames], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Brand typing effect ──────────────────────────────────────────────────
  const brandText = BRAND.name;
  const TYPING_START = 5;
  const CHARS_PER_FRAME = 0.6; // ~18 chars / 30 frames = done in ~1s
  const charsVisible = Math.min(
    brandText.length,
    Math.max(0, Math.floor((frame - TYPING_START) * CHARS_PER_FRAME))
  );
  const displayedBrand = brandText.slice(0, charsVisible);
  const typingDone = charsVisible >= brandText.length;

  // Cursor blink: toggles every 8 frames
  const cursorVisible = !typingDone || Math.floor(frame / 8) % 2 === 0;
  const cursorOpacity = typingDone
    ? cursorVisible
      ? 0.8
      : 0
    : 1;

  // Brand container fade in
  const brandContainerOpacity = interpolate(frame, [TYPING_START, TYPING_START + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brand accent line under brand
  const brandLineWidth = spring({
    frame: frame - TYPING_START - 15,
    fps,
    config: { damping: 15, mass: 0.4, stiffness: 120 },
  });

  // ── Hook text staggered reveal ───────────────────────────────────────────
  const hookLines = splitIntoLines(hook, 3);
  const HOOK_START = 35; // frames — after brand typing finishes
  const LINE_STAGGER = 9; // frames between each line

  // Slide directions for each line: alternate left/right/left
  const slideDirections = [1, -1, 1]; // 1 = from right, -1 = from left

  const lineAnimations = hookLines.map((_, i) => {
    const lineDelay = HOOK_START + i * LINE_STAGGER;
    const lineSpring = spring({
      frame: frame - lineDelay,
      fps,
      config: { damping: 14, mass: 0.5, stiffness: 90 },
    });
    const opacity = interpolate(lineSpring, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateX = interpolate(lineSpring, [0, 1], [80 * slideDirections[i % 3], 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(lineSpring, [0, 1], [20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { opacity, translateX, translateY };
  });

  // ── Animated underline under last hook line ──────────────────────────────
  const underlineDelay = HOOK_START + hookLines.length * LINE_STAGGER + 8;
  const underlineProgress = spring({
    frame: frame - underlineDelay,
    fps,
    config: { damping: 18, mass: 0.4, stiffness: 100 },
  });
  const underlineWidth = interpolate(underlineProgress, [0, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underlineOpacity = interpolate(underlineProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Fade out at end ──────────────────────────────────────────────────────
  const fadeOut = interpolate(
    frame,
    [durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Decorative circles (enhanced) ────────────────────────────────────────
  const circle1Scale = interpolate(frame, [0, 60], [0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const circle1Pulse = Math.sin(frame * 0.05) * 0.1;

  const circle2Scale = interpolate(frame, [10, 70], [0.2, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const circle2Pulse = Math.sin(frame * 0.04 + 1) * 0.08;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* ── Dynamic gradient background ── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark} 40%, ${COLORS.backgroundMedium} 70%, ${COLORS.primary}44)`,
          filter: `hue-rotate(${hueShift}deg)`,
        }}
      />

      {/* ── Secondary gradient overlay for depth ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${isVertical ? "50% 40%" : "30% 50%"}, ${COLORS.primary}33 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 40], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* ── Dot grid background ── */}
      <DotGrid
        frame={frame}
        durationInFrames={durationInFrames}
        isVertical={isVertical}
      />

      {/* ── Floating particles ── */}
      <Particles
        frame={frame}
        durationInFrames={durationInFrames}
        isVertical={isVertical}
        width={width}
        height={height}
      />

      {/* ── Glow sweep lines ── */}
      <GlowSweeps frame={frame} isVertical={isVertical} width={width} height={height} />

      {/* ── Decorative circles ── */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? "12%" : "8%",
          right: isVertical ? "-12%" : "-5%",
          width: isVertical ? 350 : 550,
          height: isVertical ? 350 : 550,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.secondary}28, ${COLORS.primary}10, transparent)`,
          transform: `scale(${circle1Scale + circle1Pulse})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? "18%" : "12%",
          left: isVertical ? "-15%" : "-8%",
          width: isVertical ? 280 : 450,
          height: isVertical ? 280 : 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}1A, ${COLORS.accent}08, transparent)`,
          transform: `scale(${circle2Scale + circle2Pulse})`,
        }}
      />

      {/* ── Content container ── */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? 40 : 80,
          gap: isVertical ? 30 : 40,
          flexDirection: "column",
        }}
      >
        {/* ── Brand name with typing effect ── */}
        <div
          style={{
            opacity: brandContainerOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: isVertical ? 28 : 34,
              color: COLORS.secondary,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            <span>{displayedBrand}</span>
            {/* Blinking cursor */}
            <span
              style={{
                display: "inline-block",
                width: isVertical ? 2 : 3,
                height: isVertical ? 24 : 28,
                backgroundColor: COLORS.accent,
                marginLeft: 2,
                opacity: cursorOpacity,
                boxShadow: `0 0 8px ${COLORS.accent}AA`,
              }}
            />
          </div>
          {/* Animated accent line under brand */}
          <div
            style={{
              width: interpolate(brandLineWidth, [0, 1], [0, isVertical ? 180 : 220]),
              height: 3,
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.secondary})`,
              borderRadius: 2,
              boxShadow: `0 0 10px ${COLORS.accent}66`,
            }}
          />
        </div>

        {/* ── Hook text with staggered line reveal ── */}
        <div
          style={{
            maxWidth: isVertical ? "95%" : "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isVertical ? 8 : 12,
            position: "relative",
          }}
        >
          {hookLines.map((line, i) => {
            const anim = lineAnimations[i];
            return (
              <div
                key={i}
                style={{
                  opacity: anim.opacity,
                  transform: `translate(${anim.translateX}px, ${anim.translateY}px)`,
                  fontSize: fonts.hook,
                  color: COLORS.textWhite,
                  fontFamily: "sans-serif",
                  fontWeight: 800,
                  textAlign: "center",
                  lineHeight: 1.25,
                  textShadow: `0 4px 30px rgba(0, 0, 0, 0.6), 0 0 60px ${COLORS.primary}44`,
                }}
              >
                {line}
              </div>
            );
          })}

          {/* ── Animated underline ── */}
          <div
            style={{
              width: `${underlineWidth}%`,
              maxWidth: isVertical ? 500 : 700,
              height: isVertical ? 4 : 5,
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.secondary}, ${COLORS.accent})`,
              borderRadius: 3,
              opacity: underlineOpacity,
              marginTop: isVertical ? 8 : 12,
              boxShadow: `0 0 15px ${COLORS.accent}88, 0 0 30px ${COLORS.accent}44`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
