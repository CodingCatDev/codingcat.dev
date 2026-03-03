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

// --- Geometric background shapes ---

interface GeoShape {
  type: "triangle" | "hexagon" | "diamond";
  x: number; // % from left
  y: number; // % from top
  size: number;
  rotationSpeed: number; // degrees per frame
  driftX: number; // px per frame
  driftY: number; // px per frame
  opacity: number;
  color: string;
}

const GEO_SHAPES: GeoShape[] = [
  { type: "hexagon", x: 10, y: 15, size: 80, rotationSpeed: 0.4, driftX: 0.15, driftY: -0.1, opacity: 0.08, color: COLORS.secondary },
  { type: "triangle", x: 85, y: 20, size: 60, rotationSpeed: -0.6, driftX: -0.1, driftY: 0.12, opacity: 0.06, color: COLORS.accent },
  { type: "diamond", x: 75, y: 75, size: 50, rotationSpeed: 0.5, driftX: -0.08, driftY: -0.15, opacity: 0.07, color: COLORS.primary },
  { type: "hexagon", x: 20, y: 80, size: 70, rotationSpeed: -0.3, driftX: 0.12, driftY: -0.08, opacity: 0.06, color: COLORS.ctaGreen },
  { type: "triangle", x: 50, y: 10, size: 45, rotationSpeed: 0.7, driftX: 0.05, driftY: 0.1, opacity: 0.05, color: COLORS.secondary },
  { type: "diamond", x: 40, y: 60, size: 55, rotationSpeed: -0.45, driftX: -0.06, driftY: -0.12, opacity: 0.06, color: COLORS.accent },
];

const hexagonPath = (s: number) => {
  const r = s / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
  });
  return `M${points.join("L")}Z`;
};

const trianglePath = (s: number) =>
  `M${s / 2},0 L${s},${s} L0,${s} Z`;

const diamondPath = (s: number) =>
  `M${s / 2},0 L${s},${s / 2} L${s / 2},${s} L0,${s / 2} Z`;

const GeometricShape: React.FC<{ shape: GeoShape; frame: number }> = ({
  shape,
  frame,
}) => {
  const rotation = frame * shape.rotationSpeed;
  const offsetX = frame * shape.driftX;
  const offsetY = frame * shape.driftY;

  let pathD: string;
  switch (shape.type) {
    case "hexagon":
      pathD = hexagonPath(shape.size);
      break;
    case "triangle":
      pathD = trianglePath(shape.size);
      break;
    case "diamond":
      pathD = diamondPath(shape.size);
      break;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${shape.x}%`,
        top: `${shape.y}%`,
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
        opacity: shape.opacity,
      }}
    >
      <svg width={shape.size} height={shape.size} viewBox={`0 0 ${shape.size} ${shape.size}`}>
        <path d={pathD} fill="none" stroke={shape.color} strokeWidth={2} />
      </svg>
    </div>
  );
};

// --- Confetti particle ---

interface ConfettiParticle {
  angle: number; // radians
  speed: number;
  size: number;
  color: string;
  shape: "square" | "circle";
  rotationSpeed: number;
}

const CONFETTI_PARTICLES: ConfettiParticle[] = Array.from({ length: 20 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 20 + (i % 3) * 0.2,
  speed: 3 + (i % 5) * 1.5,
  size: 6 + (i % 4) * 3,
  color: [COLORS.accent, COLORS.secondary, COLORS.ctaGreen, "#FF0000", COLORS.primary][i % 5],
  shape: i % 2 === 0 ? "square" : "circle",
  rotationSpeed: (i % 2 === 0 ? 1 : -1) * (2 + (i % 3)),
}));

// --- Social link platform colors ---

const SOCIAL_COLORS: Record<string, string> = {
  YouTube: "#FF0000",
  Twitter: "#1DA1F2",
  Discord: "#7C3AED",
  Web: "#10B981",
};

// --- Main Component ---

export const CTAScene: React.FC<CTASceneProps> = ({
  cta,
  durationInFrames,
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = isVertical ? FONT_SIZES.portrait : FONT_SIZES.landscape;

  // --- Fade in / out ---
  const fadeIn = interpolate(
    frame,
    [0, ANIMATION.fadeIn],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    frame,
    [durationInFrames - ANIMATION.fadeOut, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = fadeIn * fadeOut;

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

  // Glow pulse (continuous)
  const glowPulse = interpolate(
    frame % 40,
    [0, 20, 40],
    [0.3, 0.8, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Button scale bounce
  const buttonBounce = spring({
    frame: frame - 40,
    fps,
    config: { damping: 8, mass: 0.3, stiffness: 150 },
  });

  const buttonPulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.06, 1],
    { extrapolateRight: "clamp" }
  );

  const buttonScale = buttonSpring * buttonPulse * interpolate(buttonBounce, [0, 0.5, 1], [0.9, 1.12, 1]);

  // --- Arrow animation (bouncing toward button) ---
  const arrowSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 80 },
  });

  const arrowBounce = interpolate(
    frame % 24,
    [0, 12, 24],
    [0, -12, 0],
    { extrapolateRight: "clamp" }
  );

  // --- "Don't miss out!" urgency text ---
  const urgencySpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 80 },
  });

  // --- Confetti burst ---
  const confettiProgress = interpolate(
    frame,
    [5, 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const confettiOpacity = interpolate(
    frame,
    [5, 15, 35, 45],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Social links ---
  const socialLinks = [
    { label: "YouTube", value: BRAND.youtube },
    { label: "Twitter", value: BRAND.twitter },
    { label: "Discord", value: BRAND.discord },
    { label: "Web", value: BRAND.website },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${COLORS.primary}44 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, ${COLORS.ctaGreen}22 0%, transparent 50%),
                        linear-gradient(135deg, ${COLORS.backgroundDark}, ${COLORS.primary}33, ${COLORS.gradientEnd})`,
        }}
      />

      {/* Animated geometric shapes */}
      {GEO_SHAPES.map((shape, i) => (
        <GeometricShape key={i} shape={shape} frame={frame} />
      ))}

      {/* Confetti burst */}
      {CONFETTI_PARTICLES.map((particle, i) => {
        const distance = particle.speed * confettiProgress * 120;
        const px = Math.cos(particle.angle) * distance;
        const py = Math.sin(particle.angle) * distance - confettiProgress * 40;
        const rotation = frame * particle.rotationSpeed;

        return (
          <div
            key={`confetti-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "45%",
              transform: `translate(${px}px, ${py}px) rotate(${rotation}deg)`,
              opacity: confettiOpacity * 0.7,
            }}
          >
            {particle.shape === "square" ? (
              <div
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: 2,
                }}
              />
            ) : (
              <div
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: "50%",
                }}
              />
            )}
          </div>
        );
      })}

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: isVertical ? 40 : 80,
          flexDirection: "column",
          gap: isVertical ? 24 : 32,
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
            opacity: interpolate(ctaSpring, [0, 1], [0, 0.8]),
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
              textShadow: `0 2px 20px rgba(0, 0, 0, 0.4), 0 0 40px ${COLORS.primary}66`,
            }}
          >
            {cta}
          </div>
        </div>

        {/* "Don't miss out!" urgency text */}
        <div
          style={{
            opacity: urgencySpring,
            transform: `translateY(${interpolate(urgencySpring, [0, 1], [10, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: isVertical ? 22 : 26,
              color: COLORS.accent,
              fontFamily: "sans-serif",
              fontWeight: 600,
              textAlign: "center",
              letterSpacing: 1,
              textShadow: `0 0 20px ${COLORS.accent}44`,
            }}
          >
            Don&apos;t miss out!
          </div>
        </div>

        {/* Subscribe Button with Arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isVertical ? 12 : 16,
          }}
        >
          {/* Animated arrow pointing to button */}
          <div
            style={{
              opacity: arrowSpring,
              transform: `translateX(${arrowBounce}px)`,
              fontSize: isVertical ? 36 : 44,
              color: COLORS.accent,
              textShadow: `0 0 12px ${COLORS.accent}88`,
            }}
          >
            ▶
          </div>

          {/* Subscribe Button */}
          <div
            style={{
              transform: `scale(${buttonScale})`,
              opacity: buttonSpring,
              filter: `drop-shadow(0 0 ${20 + glowPulse * 25}px rgba(255, 0, 0, ${0.3 + glowPulse * 0.4}))`,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FF0000, #CC0000, #FF2222)",
                color: COLORS.textWhite,
                fontSize: isVertical ? 28 : 32,
                fontFamily: "sans-serif",
                fontWeight: 700,
                padding: isVertical ? "16px 40px" : "18px 50px",
                borderRadius: 14,
                textTransform: "uppercase",
                letterSpacing: 2,
                boxShadow: `0 8px 30px rgba(255, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 ${30 + glowPulse * 20}px rgba(255, 0, 0, ${0.2 + glowPulse * 0.3})`,
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              ▶ Subscribe
            </div>
          </div>

          {/* Arrow on the other side */}
          <div
            style={{
              opacity: arrowSpring,
              transform: `translateX(${-arrowBounce}px) scaleX(-1)`,
              fontSize: isVertical ? 36 : 44,
              color: COLORS.accent,
              textShadow: `0 0 12px ${COLORS.accent}88`,
            }}
          >
            ▶
          </div>
        </div>

        {/* Social Links as Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap: isVertical ? 12 : 20,
            alignItems: "center",
            marginTop: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {socialLinks.map((link, i) => {
            const linkSpring = spring({
              frame: frame - 50 - i * 8,
              fps,
              config: { damping: 12, mass: 0.4, stiffness: 100 },
            });

            const borderColor = SOCIAL_COLORS[link.label] || COLORS.secondary;

            return (
              <div
                key={link.label}
                style={{
                  opacity: linkSpring,
                  transform: `translateY(${interpolate(linkSpring, [0, 1], [20, 0])}px) scale(${interpolate(linkSpring, [0, 1], [0.9, 1])})`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: isVertical ? "10px 20px" : "12px 24px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    borderRadius: 10,
                    borderLeft: `4px solid ${borderColor}`,
                    backdropFilter: "blur(4px)",
                    minWidth: isVertical ? 220 : 180,
                  }}
                >
                  <div
                    style={{
                      fontSize: isVertical ? 12 : 13,
                      color: borderColor,
                      fontFamily: "sans-serif",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    {link.label}
                  </div>
                  <div
                    style={{
                      fontSize: isVertical ? 16 : 18,
                      color: COLORS.textWhite,
                      fontFamily: "monospace",
                      fontWeight: 600,
                    }}
                  >
                    {link.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
