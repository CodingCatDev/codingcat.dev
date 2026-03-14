// --- Video Pipeline Constants ---

/** Frames per second for all compositions */
export const FPS = 30;

/** Main video dimensions (16:9 landscape) */
export const MAIN_WIDTH = 1920;
export const MAIN_HEIGHT = 1080;

/** Short video dimensions (9:16 portrait) */
export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;

// --- Default Durations (in frames at 30fps) ---

/** Default hook scene duration: 4 seconds */
export const DEFAULT_HOOK_DURATION = FPS * 4;

/** Default CTA scene duration: 5 seconds */
export const DEFAULT_CTA_DURATION = FPS * 5;

/** Default sponsor slot duration: 5 seconds */
export const DEFAULT_SPONSOR_DURATION = FPS * 5;

/** Sponsor slot insertion point: ~15 seconds into the video */
export const SPONSOR_INSERT_SECONDS = 15;

/** Transition overlap duration in frames (for opacity fades) */
export const TRANSITION_DURATION = Math.round(FPS * 0.5); // 0.5s

// --- Brand Colors ---

export const COLORS = {
  /** CodingCat.dev primary purple */
  primary: "#7c3aed",
  /** CodingCat.dev secondary / accent */
  secondary: "#A78BFA",
  /** Dark background */
  backgroundDark: "#000000",
  /** Slightly lighter dark */
  backgroundMedium: "#000000",
  /** Text white */
  textWhite: "#FFFFFF",
  /** Text muted */
  textMuted: "#C4B5FD",
  /** Accent highlight */
  accent: "#F59E0B",
  /** CTA green */
  ctaGreen: "#10B981",
  /** Sponsor card background */
  sponsorBg: "rgba(124, 58, 237, 0.85)",
  /** Overlay for text readability */
  overlay: "rgba(0, 0, 0, 0.55)",
  /** Gradient start */
  gradientStart: "#7c3aed",
  /** Gradient end */
  gradientEnd: "#000000",
} as const;

// --- Font Sizes ---

export const FONT_SIZES = {
  /** Main video (landscape) */
  landscape: {
    hook: 72,
    narration: 42,
    cta: 56,
    watermark: 18,
    sponsorTitle: 28,
    sponsorMessage: 22,
    sponsorLabel: 16,
    code: 24,
    listItem: 36,
    comparisonCell: 28,
    comparisonHeader: 32,
  },
  /** Short video (portrait) — larger for mobile readability */
  portrait: {
    hook: 64,
    narration: 48,
    cta: 52,
    watermark: 20,
    sponsorTitle: 32,
    sponsorMessage: 26,
    sponsorLabel: 18,
    code: 20,
    listItem: 40,
    comparisonCell: 32,
    comparisonHeader: 36,
  },
} as const;

// --- Animation Durations (in frames) ---

export const ANIMATION = {
  /** Text fade-in duration */
  fadeIn: Math.round(FPS * 0.6),
  /** Text fade-out duration */
  fadeOut: Math.round(FPS * 0.4),
  /** Spring damping for text pop-in */
  springDamping: 12,
  /** Spring mass */
  springMass: 0.5,
  /** Spring stiffness */
  springStiffness: 100,
} as const;

// --- Brand ---

export const BRAND = {
  name: "CodingCat.dev",
  tagline: "Purrfect Web Tutorials",
  website: "codingcat.dev",
  youtube: "@CodingCatDev",
  twitter: "@CodingCatDev",
  discord: "discord.gg/codingcatdev",
} as const;

// --- Code Scene Colors ---
export const CODE_COLORS = {
  /** Glassmorphism window background */
  windowBg: "rgba(15, 15, 35, 0.85)",
  /** Window border */
  windowBorder: "rgba(167, 139, 250, 0.3)",
  /** Window title bar */
  titleBar: "rgba(30, 30, 60, 0.9)",
  /** Traffic light dots */
  dotRed: "#FF5F57",
  dotYellow: "#FEBC2E",
  dotGreen: "#28C840",
  /** Line highlight */
  lineHighlight: "rgba(124, 58, 237, 0.25)",
  /** Line number color */
  lineNumber: "rgba(255, 255, 255, 0.3)",
} as const;

// --- List Scene Constants ---
export const LIST_COLORS = {
  /** Active item background */
  activeBg: "rgba(124, 58, 237, 0.3)",
  /** Active item border */
  activeBorder: "#A78BFA",
  /** Inactive item opacity */
  inactiveOpacity: 0.35,
  /** Bullet/check color */
  bulletColor: "#10B981",
} as const;

// --- Comparison Scene Constants ---
export const COMPARISON_COLORS = {
  /** Grid line color */
  gridLine: "rgba(167, 139, 250, 0.4)",
  /** Header background */
  headerBg: "rgba(124, 58, 237, 0.5)",
  /** Active row highlight */
  activeRow: "rgba(124, 58, 237, 0.2)",
  /** Left column accent */
  leftAccent: "#A78BFA",
  /** Right column accent */
  rightAccent: "#F59E0B",
} as const;

// --- Infographic Scene Constants ---
export const INFOGRAPHIC_COLORS = {
  /** Crossfade overlay background */
  crossfadeBg: "rgba(0, 0, 0, 1)",
  /** Subtle vignette for depth */
  vignette: "rgba(0, 0, 0, 0.3)",
} as const;
