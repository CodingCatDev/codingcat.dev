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
  primary: "#6D28D9",
  /** CodingCat.dev secondary / accent */
  secondary: "#A78BFA",
  /** Dark background */
  backgroundDark: "#0F0F23",
  /** Slightly lighter dark */
  backgroundMedium: "#1A1A2E",
  /** Text white */
  textWhite: "#FFFFFF",
  /** Text muted */
  textMuted: "#C4B5FD",
  /** Accent highlight */
  accent: "#F59E0B",
  /** CTA green */
  ctaGreen: "#10B981",
  /** Sponsor card background */
  sponsorBg: "rgba(109, 40, 217, 0.85)",
  /** Overlay for text readability */
  overlay: "rgba(0, 0, 0, 0.55)",
  /** Gradient start */
  gradientStart: "#6D28D9",
  /** Gradient end */
  gradientEnd: "#1A1A2E",
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
