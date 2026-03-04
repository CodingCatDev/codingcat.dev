import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CodeMorphSceneProps } from "../types";
import { ANIMATION, COLORS, CODE_COLORS, FONT_SIZES } from "../constants";
import { getActiveSegmentAtFrame } from "../../lib/utils/audio-timestamps";

/**
 * CodeMorphScene — Animated code display with syntax highlighting,
 * typing animation, and glassmorphism window frame.
 *
 * NOTE: Code rendering uses a manual monospace approach. When `react-shiki`
 * or `shiki` is installed, replace the plain-text rendering in `renderCodeLine()`
 * with Shiki-based syntax highlighting for proper token coloring.
 */

const CODE_FONT_FAMILY =
  '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace';

/** Map language names to file extensions for the title bar */
function getFilenameForLanguage(language: string): string {
  const extensionMap: Record<string, string> = {
    typescript: "example.ts",
    javascript: "example.js",
    tsx: "example.tsx",
    jsx: "example.jsx",
    python: "example.py",
    rust: "example.rs",
    go: "example.go",
    html: "index.html",
    css: "styles.css",
    json: "data.json",
    yaml: "config.yaml",
    yml: "config.yml",
    bash: "script.sh",
    shell: "script.sh",
    sh: "script.sh",
    sql: "query.sql",
    graphql: "schema.graphql",
    markdown: "README.md",
    md: "README.md",
    swift: "example.swift",
    kotlin: "example.kt",
    java: "Example.java",
    csharp: "Example.cs",
    cs: "Example.cs",
    cpp: "example.cpp",
    c: "example.c",
    ruby: "example.rb",
    php: "example.php",
    dart: "example.dart",
    svelte: "Component.svelte",
    vue: "Component.vue",
  };
  return extensionMap[language.toLowerCase()] ?? `example.${language}`;
}

export const CodeMorphScene: React.FC<CodeMorphSceneProps> = ({
  narration,
  sceneIndex,
  durationInFrames,
  isVertical = false,
  wordTimestamps,
  code,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  const { snippet, language, highlightLines } = code;
  const lines = snippet ? snippet.split("\n") : [""];
  const lineCount = lines.length;
  const filename = getFilenameForLanguage(language);

  // --- Scene-level fade in/out ---
  const sceneOpacity = interpolate(
    frame,
    [0, 15, durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Window entrance: spring scale from 0.95 → 1.0 ---
  const windowScale = spring({
    frame,
    fps,
    config: {
      damping: ANIMATION.springDamping,
      mass: ANIMATION.springMass,
      stiffness: ANIMATION.springStiffness,
    },
    from: 0.95,
    to: 1,
  });

  // --- Typing animation ---
  // Reserve first 10% of frames for window entrance, last 10% for hold
  const typingStartFrame = Math.round(durationInFrames * 0.08);
  const typingEndFrame = Math.round(durationInFrames * 0.85);

  // How many lines are "typed" at the current frame (continuous float for smooth reveal)
  const typedLineProgress = interpolate(
    frame,
    [typingStartFrame, typingEndFrame],
    [0, lineCount],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Number of fully visible lines
  const fullyTypedLines = Math.floor(typedLineProgress);
  // The line currently being typed (partial)
  const currentTypingLine = fullyTypedLines;
  // Progress within the current line (0 → 1)
  const currentLineProgress = typedLineProgress - fullyTypedLines;

  // --- Cursor blink ---
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // --- Line highlighting ---
  const hasHighlightLines =
    highlightLines !== undefined && highlightLines.length > 0;

  // Determine which highlight group is active (timestamp-driven or static)
  let activeHighlightGroup = -1;
  if (
    hasHighlightLines &&
    wordTimestamps !== undefined &&
    wordTimestamps.length > 0
  ) {
    activeHighlightGroup = getActiveSegmentAtFrame(
      wordTimestamps,
      highlightLines!.length,
      frame,
      fps,
    );
  }

  /**
   * Check if a line (1-based) should be highlighted at the current frame.
   */
  function isLineHighlighted(lineNumber: number): boolean {
    if (!hasHighlightLines) return false;

    // If we have timestamps, only highlight the line corresponding to the active segment
    if (wordTimestamps !== undefined && wordTimestamps.length > 0) {
      return (
        activeHighlightGroup >= 0 &&
        activeHighlightGroup < highlightLines!.length &&
        highlightLines![activeHighlightGroup] === lineNumber
      );
    }

    // Static: highlight all specified lines once they've been typed
    return (
      highlightLines!.includes(lineNumber) && lineNumber <= fullyTypedLines
    );
  }

  // --- Narration text animation ---
  const narrationOpacity = interpolate(
    frame,
    [ANIMATION.fadeIn, ANIMATION.fadeIn + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Gradient background angle (alternating per scene) ---
  const gradientAngle = (sceneIndex % 4) * 90;

  // --- Layout dimensions ---
  const codeFontSize = fonts.code;
  const lineHeight = codeFontSize * 1.7;
  const lineNumberWidth = 48;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 1: Dark gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${COLORS.gradientStart}, ${COLORS.backgroundDark}, ${COLORS.backgroundMedium})`,
        }}
      />

      {/* Layer 2: Glassmorphism code window */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? "60px 24px" : "60px 80px",
        }}
      >
        <div
          style={{
            transform: `scale(${windowScale})`,
            width: isVertical ? "95%" : "75%",
            maxHeight: isVertical ? "60%" : "70%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 12,
            border: `1px solid ${CODE_COLORS.windowBorder}`,
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: `0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(109, 40, 217, 0.15)`,
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
            {/* Filename */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: codeFontSize * 0.75,
                color: COLORS.textMuted,
                fontFamily: CODE_FONT_FAMILY,
                fontWeight: 500,
              }}
            >
              {filename}
            </div>
            {/* Spacer to balance the dots */}
            <div style={{ width: 52 }} />
          </div>

          {/* Code content area */}
          <div
            style={{
              flex: 1,
              backgroundColor: CODE_COLORS.windowBg,
              padding: "16px 0",
              overflow: "hidden",
            }}
          >
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isFullyTyped = index < fullyTypedLines;
              const isCurrentlyTyping = index === currentTypingLine;
              const isVisible = isFullyTyped || isCurrentlyTyping;

              if (!isVisible) {
                // Render empty line to preserve layout
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      height: lineHeight,
                      alignItems: "center",
                    }}
                  />
                );
              }

              // Calculate opacity for the line being typed
              const lineOpacity = isFullyTyped
                ? 1
                : interpolate(currentLineProgress, [0, 0.3], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });

              // Characters to show for the currently typing line
              const displayText = isFullyTyped
                ? line
                : line.slice(
                    0,
                    Math.floor(currentLineProgress * line.length),
                  );

              const highlighted = isLineHighlighted(lineNumber);

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    height: lineHeight,
                    alignItems: "center",
                    opacity: lineOpacity,
                    backgroundColor: highlighted
                      ? CODE_COLORS.lineHighlight
                      : "transparent",
                    transition: "background-color 0.2s",
                    paddingRight: 16,
                  }}
                >
                  {/* Line number */}
                  <div
                    style={{
                      width: lineNumberWidth,
                      textAlign: "right",
                      paddingRight: 16,
                      fontSize: codeFontSize * 0.85,
                      color: CODE_COLORS.lineNumber,
                      fontFamily: CODE_FONT_FAMILY,
                      userSelect: "none",
                      flexShrink: 0,
                    }}
                  >
                    {lineNumber}
                  </div>

                  {/* Code text */}
                  {/*
                   * TODO: Replace this plain-text rendering with Shiki-based
                   * syntax highlighting when react-shiki or shiki is installed.
                   * Use `codeToHtml()` or `<ShikiHighlighter>` to tokenize
                   * and color the code based on the `language` prop.
                   */}
                  <div
                    style={{
                      flex: 1,
                      fontSize: codeFontSize,
                      color: COLORS.textWhite,
                      fontFamily: CODE_FONT_FAMILY,
                      whiteSpace: "pre",
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    {displayText}
                    {/* Blinking cursor on the currently typing line */}
                    {isCurrentlyTyping && cursorVisible && (
                      <span
                        style={{
                          color: COLORS.secondary,
                          fontWeight: 700,
                        }}
                      >
                        |
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
