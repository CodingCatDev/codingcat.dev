import { z } from "zod";

// --- Zod Schemas (used for Remotion input props validation) ---

export const sceneDataSchema = z.object({
  narration: z.string(),
  bRollKeywords: z.array(z.string()).optional(),
  visualDescription: z.string().optional(),
  sceneNumber: z.number().optional(),
  durationEstimate: z.number().optional(),
  bRollUrl: z.string().url().optional(),
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
