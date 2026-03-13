import { z } from "zod";

// --- Zod Schemas (used for Remotion input props validation) ---

// Scene type discriminator — Gemini picks this per scene
export const SCENE_TYPES = ["narration", "code", "list", "comparison", "mockup", "infographic"] as const;
export type SceneType = typeof SCENE_TYPES[number];

// Word-level timestamp from ElevenLabs
export const wordTimestampSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
});
export type WordTimestamp = z.infer<typeof wordTimestampSchema>;

// Code scene data
export const codeDataSchema = z.object({
  snippet: z.string(),
  language: z.string(),
  highlightLines: z.array(z.number()).optional(),
});

// List scene data
export const listDataSchema = z.object({
  items: z.array(z.string()).min(1),
  icon: z.string().optional(), // emoji or SVG reference
});

// Comparison scene data
export const comparisonRowSchema = z.object({
  left: z.string(),
  right: z.string(),
});
export const comparisonDataSchema = z.object({
  leftLabel: z.string(),
  rightLabel: z.string(),
  rows: z.array(comparisonRowSchema).min(1),
});

// Mockup scene data
export const mockupDataSchema = z.object({
  deviceType: z.enum(["browser", "phone", "terminal"]),
  screenContent: z.string(), // URL or description
});

export const sceneDataSchema = z.object({
  narration: z.string(),
  sceneType: z.enum(SCENE_TYPES).optional(),
  bRollKeywords: z.array(z.string()).optional(),
  visualDescription: z.string().optional(),
  sceneNumber: z.number().optional(),
  durationEstimate: z.number().optional(),
  bRollUrl: z.string().url().optional(),
  // Scene-type-specific data
  code: codeDataSchema.optional(),
  list: listDataSchema.optional(),
  comparison: comparisonDataSchema.optional(),
  mockup: mockupDataSchema.optional(),
  // Word-level timestamps from ElevenLabs
  wordTimestamps: z.array(wordTimestampSchema).optional(),
  // Per-scene audio URL (for per-scene audio generation)
  audioUrl: z.string().url().optional(),
  // Per-scene audio duration in ms
  audioDurationMs: z.number().optional(),
  // Infographic image URL (Gemini Imagen 4 / Sanity CDN) — legacy single URL
  infographicUrl: z.string().url().optional(),
  // Infographic image URLs — array for multi-image cycling
  infographicUrls: z.array(z.string().url()).optional(),
  // Image generation prompts (metadata, not rendered)
  imagePrompts: z.array(z.string()).optional(),
});

export const sponsorDataSchema = z.object({
  name: z.string(),
  logoUrl: z.string().url(),
  message: z.string(),
});

export const videoInputPropsSchema = z.object({
  /** URL to the ElevenLabs TTS MP3 audio file */
  audioUrl: z.string().url(),
  /** Total audio duration in seconds (used to calculate frame count) */
  audioDurationInSeconds: z.number().positive(),
  /** Opening hook text */
  hook: z.string(),
  /** Array of scene data */
  scenes: z.array(sceneDataSchema).min(1),
  /** Call-to-action text */
  cta: z.string(),
  /** Optional sponsor data — inserted at ~15s mark */
  sponsor: sponsorDataSchema.optional(),
  /** Duration in frames for the hook scene */
  hookDurationInFrames: z.number().int().positive().optional(),
  /** Duration in frames for the CTA scene */
  ctaDurationInFrames: z.number().int().positive().optional(),
  /** Duration in frames for the sponsor slot */
  sponsorDurationInFrames: z.number().int().positive().optional(),
});

// --- TypeScript types derived from schemas ---

export type SceneData = z.infer<typeof sceneDataSchema>;
export type SponsorData = z.infer<typeof sponsorDataSchema>;
export type VideoInputProps = z.infer<typeof videoInputPropsSchema>;

// --- Component-level prop types ---

export interface SceneProps {
  narration: string;
  bRollUrl?: string;
  visualDescription?: string;
  sceneNumber?: number;
  durationEstimate?: number;
  sceneIndex: number;
  durationInFrames: number;
  isVertical?: boolean;
}

export interface HookSceneProps {
  hook: string;
  durationInFrames: number;
  isVertical?: boolean;
  /** Optional infographic URL to use as background */
  infographicUrl?: string;
}

export interface CTASceneProps {
  cta: string;
  durationInFrames: number;
  isVertical?: boolean;
}

export interface SponsorSlotProps {
  sponsor: SponsorData;
  durationInFrames: number;
  isVertical?: boolean;
}

// --- New Scene Component Prop Types ---

// Base props shared by all scene components
export interface BaseSceneProps {
  narration: string;
  sceneIndex: number;
  durationInFrames: number;
  isVertical?: boolean;
  wordTimestamps?: WordTimestamp[];
}

// CodeMorphScene props
export interface CodeMorphSceneProps extends BaseSceneProps {
  code: {
    snippet: string;
    language: string;
    highlightLines?: number[];
  };
}

// DynamicListScene props
export interface DynamicListSceneProps extends BaseSceneProps {
  items: string[];
  icon?: string;
}

// ComparisonGridScene props
export interface ComparisonGridSceneProps extends BaseSceneProps {
  leftLabel: string;
  rightLabel: string;
  rows: { left: string; right: string }[];
}

// IsometricMockupScene props
export interface IsometricMockupSceneProps extends BaseSceneProps {
  deviceType: "browser" | "phone" | "terminal";
  screenContent: string;
}

// InfographicScene props (legacy single-image — kept for backward compat)
export interface InfographicSceneProps extends BaseSceneProps {
  infographicUrl: string;
  focusRegions?: Array<{ x: number; y: number; zoom: number }>; // 0-1 normalized coordinates
}

// InfographicCycleScene props (new multi-image cycling)
export interface InfographicCycleSceneProps extends BaseSceneProps {
  infographicUrls: string[];
  /** Seconds per image (default 4) */
  secondsPerImage?: number;
}
