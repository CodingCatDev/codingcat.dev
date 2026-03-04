import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { IsometricMockupSceneProps } from "../types";
import { ANIMATION, COLORS, CODE_COLORS, FONT_SIZES } from "../constants";

/**
 * IsometricMockupScene — CSS 3D device mockup that displays content
 * in a realistic device frame (browser, phone, or terminal).
 *
 * Features:
 * - Three device types: browser (Chrome-style), phone (notch), terminal (green-on-black)
 * - CSS 3D perspective tilt with spring-animated entrance
 * - Typing animation for terminal, fade-in for browser/phone
 * - Narration overlay at bottom with blur backdrop
 * - Watermark at bottom-right
 */

const CODE_FONT_FAMILY =
  '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace';

/** Font sizes type — union of landscape and portrait */
type FontSizes =
  | (typeof FONT_SIZES)["landscape"]
  | (typeof FONT_SIZES)["portrait"];

// --- Browser Frame ---
const BrowserFrame: React.FC<{
  screenContent: string;
  contentOpacity: number;
  isVertical: boolean;
  fonts: FontSizes;
}> = ({ screenContent, contentOpacity, isVertical, fonts }) => {
  // Determine if screenContent looks like a URL
  const isUrl =
    screenContent.startsWith("http://") ||
    screenContent.startsWith("https://") ||
    screenContent.startsWith("www.");
  const urlBarText = isUrl ? screenContent : "https://example.com";
  const viewportText = isUrl ? "" : screenContent;

  return (
    <div
      style={{
        width: isVertical ? "90%" : "75%",
        maxHeight: isVertical ? "55%" : "65%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        border: `1px solid ${CODE_COLORS.windowBorder}`,
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(109, 40, 217, 0.15)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          backgroundColor: CODE_COLORS.titleBar,
          borderBottom: `1px solid ${CODE_COLORS.windowBorder}`,
          flexShrink: 0,
        }}
      >
        {/* Traffic light dots */}
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: CODE_COLORS.dotRed,
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: CODE_COLORS.dotYellow,
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: CODE_COLORS.dotGreen,
            }}
          />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: 6,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Lock icon */}
          <span
            style={{
              fontSize: fonts.code * 0.65,
              color: CODE_COLORS.dotGreen,
              marginRight: 8,
            }}
          >
            🔒
          </span>
          <span
            style={{
              fontSize: fonts.code * 0.7,
              color: COLORS.textMuted,
              fontFamily: CODE_FONT_FAMILY,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {urlBarText}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ width: 36 }} />
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          backgroundColor: CODE_COLORS.windowBg,
          padding: isVertical ? "24px 20px" : "32px 28px",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {viewportText ? (
          <div
            style={{
              opacity: contentOpacity,
              fontSize: fonts.listItem * 0.85,
              color: COLORS.textWhite,
              fontFamily: "sans-serif",
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            {viewportText}
          </div>
        ) : (
          <div
            style={{
              opacity: contentOpacity,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            {/* Placeholder content blocks for URL display */}
            <div
              style={{
                height: 20,
                width: "60%",
                backgroundColor: "rgba(167, 139, 250, 0.2)",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 14,
                width: "90%",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 14,
                width: "75%",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 14,
                width: "85%",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 4,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Phone Frame ---
const PhoneFrame: React.FC<{
  screenContent: string;
  contentOpacity: number;
  isVertical: boolean;
  fonts: FontSizes;
}> = ({ screenContent, contentOpacity, isVertical, fonts }) => {
  const phoneWidth = isVertical ? 320 : 300;
  const phoneHeight = isVertical ? 580 : 540;

  return (
    <div
      style={{
        width: phoneWidth,
        height: phoneHeight,
        backgroundColor: "rgba(20, 20, 40, 0.95)",
        borderRadius: 40,
        border: "3px solid rgba(167, 139, 250, 0.4)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow:
          "0 24px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(109, 40, 217, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        position: "relative",
      }}
    >
      {/* Notch */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 120,
            height: 28,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: 14,
          }}
        />
      </div>

      {/* Screen area */}
      <div
        style={{
          flex: 1,
          margin: "12px 12px 0 12px",
          backgroundColor: "rgba(15, 15, 35, 0.9)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            opacity: contentOpacity,
            fontSize: fonts.code,
            color: COLORS.textWhite,
            fontFamily: "sans-serif",
            fontWeight: 400,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {screenContent}
        </div>
      </div>

      {/* Home indicator bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0 12px 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 100,
            height: 5,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};

// --- Terminal Frame ---
const TerminalFrame: React.FC<{
  screenContent: string;
  typedCharCount: number;
  cursorVisible: boolean;
  isVertical: boolean;
  fonts: FontSizes;
}> = ({ screenContent, typedCharCount, cursorVisible, isVertical, fonts }) => {
  const displayText = screenContent.slice(0, typedCharCount);

  return (
    <div
      style={{
        width: isVertical ? "90%" : "75%",
        maxHeight: isVertical ? "55%" : "65%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        border: `1px solid ${CODE_COLORS.windowBorder}`,
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(109, 40, 217, 0.15)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          backgroundColor: CODE_COLORS.titleBar,
          borderBottom: `1px solid ${CODE_COLORS.windowBorder}`,
          flexShrink: 0,
        }}
      >
        {/* Traffic light dots */}
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: CODE_COLORS.dotRed,
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: CODE_COLORS.dotYellow,
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: CODE_COLORS.dotGreen,
            }}
          />
        </div>
        {/* Terminal title */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: fonts.code * 0.75,
            color: COLORS.textMuted,
            fontFamily: CODE_FONT_FAMILY,
            fontWeight: 500,
          }}
        >
          Terminal
        </div>
        {/* Spacer */}
        <div style={{ width: 52 }} />
      </div>

      {/* Terminal content area */}
      <div
        style={{
          flex: 1,
          backgroundColor: "rgba(5, 5, 15, 0.95)",
          padding: isVertical ? "20px 16px" : "24px 20px",
          minHeight: 200,
        }}
      >
        <div
          style={{
            fontFamily: CODE_FONT_FAMILY,
            fontSize: fonts.code,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {/* Prompt */}
          <span style={{ color: "#10B981", fontWeight: 700 }}>$ </span>
          {/* Typed text */}
          <span style={{ color: "#10B981" }}>{displayText}</span>
          {/* Blinking cursor */}
          {cursorVisible && (
            <span
              style={{
                color: "#10B981",
                fontWeight: 700,
              }}
            >
              ▌
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const IsometricMockupScene: React.FC<IsometricMockupSceneProps> = ({
  narration,
  sceneIndex,
  durationInFrames,
  isVertical = false,
  // wordTimestamps is accepted but not used for content sync in this component
  // (reserved for future narration highlighting)
  deviceType,
  screenContent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Scene-level fade in/out ---
  const sceneOpacity = interpolate(
    frame,
    [0, 15, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Device entrance: spring fly-in from below ---
  const entranceSpring = spring({
    frame,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
  });

  const translateY = interpolate(entranceSpring, [0, 1], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- 3D tilt settling with spring ---
  const tiltProgress = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 80 },
  });

  // Different tilt targets per device type
  let tiltXRange: [number, number];
  let tiltYRange: [number, number];

  if (deviceType === "browser") {
    tiltXRange = [-15, -5];
    tiltYRange = [20, 10];
  } else if (deviceType === "phone") {
    tiltXRange = [-10, -3];
    tiltYRange = [-16, -8];
  } else {
    // terminal
    tiltXRange = [-12, -4];
    tiltYRange = [15, 8];
  }

  const tiltX = interpolate(tiltProgress, [0, 1], tiltXRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tiltY = interpolate(tiltProgress, [0, 1], tiltYRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Content appearance ---
  const contentStartFrame = Math.round(durationInFrames * 0.15);
  const contentEndFrame = Math.round(durationInFrames * 0.85);

  // For browser/phone: fade-in opacity
  const contentOpacity = interpolate(
    frame,
    [contentStartFrame, contentStartFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // For terminal: typing animation (character count)
  const typedCharCount = Math.floor(
    interpolate(
      frame,
      [contentStartFrame, contentEndFrame],
      [0, screenContent.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  );

  // Cursor blink (toggles every 15 frames)
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // --- Narration text animation ---
  const narrationOpacity = interpolate(
    frame,
    [ANIMATION.fadeIn, ANIMATION.fadeIn + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Gradient background angle (alternating per scene) ---
  const gradientAngle = (sceneIndex % 4) * 90;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Dark gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.backgroundMedium})`,
        }}
      />

      {/* Layer 2: 3D Device mockup */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? "60px 24px" : "60px 80px",
        }}
      >
        {/* Perspective container */}
        <div
          style={{
            perspective: 1200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {/* 3D transform wrapper */}
          <div
            style={{
              transform: `translateY(${translateY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transformStyle: "preserve-3d",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {deviceType === "browser" && (
              <BrowserFrame
                screenContent={screenContent}
                contentOpacity={contentOpacity}
                isVertical={isVertical}
                fonts={fonts}
              />
            )}
            {deviceType === "phone" && (
              <PhoneFrame
                screenContent={screenContent}
                contentOpacity={contentOpacity}
                isVertical={isVertical}
                fonts={fonts}
              />
            )}
            {deviceType === "terminal" && (
              <TerminalFrame
                screenContent={screenContent}
                typedCharCount={typedCharCount}
                cursorVisible={cursorVisible}
                isVertical={isVertical}
                fonts={fonts}
              />
            )}
          </div>
        </div>
      </AbsoluteFill>

      {/* Layer 3: Narration text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 100 : 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: isVertical ? "0 32px" : "0 120px",
          opacity: narrationOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 12,
            padding: isVertical ? "16px 20px" : "16px 32px",
            maxWidth: isVertical ? "95%" : "75%",
            backdropFilter: "blur(8px)",
            borderLeft: `3px solid ${COLORS.primary}`,
          }}
        >
          <div
            style={{
              fontSize: fonts.narration * 0.7,
              color: COLORS.textWhite,
              fontFamily: "sans-serif",
              fontWeight: 400,
              lineHeight: 1.4,
              textAlign: isVertical ? "center" : "left",
            }}
          >
            {narration}
          </div>
        </div>
      </div>

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
