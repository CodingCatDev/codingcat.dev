/**
 * Gemini Infographic Generation Service
 *
 * Generates brand-consistent infographics using Google's Imagen 4 Fast model
 * via the @google/genai SDK. Designed for the CodingCat.dev automated video
 * pipeline — produces visual assets from research data for use in videos and
 * blog posts.
 *
 * Pricing: Imagen 4 Fast — $0.02/image
 * Supports seed-based reproducibility for brand consistency.
 *
 * @module lib/services/gemini-infographics
 */

import { GoogleGenAI } from "@google/genai";
import { getConfigValue } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single generated infographic result. */
export interface InfographicResult {
  /** Base64-encoded PNG image bytes. */
  imageBase64: string;
  /** MIME type — always "image/png" for Imagen. */
  mimeType: string;
  /** The prompt used to generate this image. */
  prompt: string;
  /** Seed used (if provided), for reproducibility. */
  seed?: number;
}

/** Options for a single infographic generation request. */
export interface InfographicRequest {
  /** Text prompt describing the infographic to generate. */
  prompt: string;
  /** Aspect ratio. Defaults to "16:9" for video pipeline use. */
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  /** Optional seed for reproducibility (not compatible with watermarks). */
  seed?: number;
  /** Negative prompt — what to avoid in the image. */
  negativePrompt?: string;
}

/** Options for batch infographic generation. */
export interface InfographicBatchOptions {
  /** Override the Imagen model (defaults to pipeline_config.infographicModel or "imagen-4-fast"). */
  model?: string;
  /** Number of images per prompt (1–4). Defaults to 1. */
  numberOfImages?: number;
}

/** Result of a batch generation run. */
export interface InfographicBatchResult {
  /** Successfully generated infographics. */
  results: InfographicResult[];
  /** Prompts that failed, with error messages. */
  errors: Array<{ prompt: string; error: string }>;
}

// ---------------------------------------------------------------------------
// Internal: lazy client
// ---------------------------------------------------------------------------

let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY ?? "";
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// ---------------------------------------------------------------------------
// Core: single image generation
// ---------------------------------------------------------------------------

/**
 * Generate a single infographic image using Imagen 4 Fast.
 *
 * @param request - Prompt and generation options.
 * @param model - Imagen model ID (e.g. "imagen-4-fast").
 * @returns InfographicResult with base64 image bytes.
 * @throws If the API call fails or no image is returned.
 */
export async function generateInfographic(
  request: InfographicRequest,
  model: string = "imagen-4-fast",
): Promise<InfographicResult> {
  const ai = getAI();

  const response = await ai.models.generateImages({
    model,
    prompt: request.prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: request.aspectRatio ?? "16:9",
      ...(request.seed !== undefined && { seed: request.seed }),
      ...(request.negativePrompt && { negativePrompt: request.negativePrompt }),
    },
  });

  const generated = response.generatedImages?.[0];
  if (!generated?.image?.imageBytes) {
    const reason = generated?.raiFilteredReason ?? "unknown";
    throw new Error(
      `Imagen returned no image for prompt "${request.prompt.slice(0, 80)}…" — RAI reason: ${reason}`,
    );
  }

  const imageBytes = generated.image.imageBytes;
  // imageBytes may be a Uint8Array or base64 string depending on SDK version
  const imageBase64 =
    typeof imageBytes === "string"
      ? imageBytes
      : Buffer.from(imageBytes).toString("base64");

  return {
    imageBase64,
    mimeType: "image/png",
    prompt: request.prompt,
    ...(request.seed !== undefined && { seed: request.seed }),
  };
}

// ---------------------------------------------------------------------------
// Batch: generate multiple infographics
// ---------------------------------------------------------------------------

/**
 * Generate a batch of infographics from an array of prompts.
 *
 * Processes requests sequentially to avoid rate-limit issues.
 * Failed individual images are collected in `errors` rather than throwing.
 *
 * @param requests - Array of infographic requests (prompts + options).
 * @param options - Batch-level options (model override, numberOfImages).
 * @returns InfographicBatchResult with successes and failures.
 *
 * @example
 * ```ts
 * const { results, errors } = await generateInfographicBatch([
 *   { prompt: "A clean infographic showing React hooks lifecycle, dark theme, CodingCat.dev branding" },
 *   { prompt: "Comparison chart: REST vs GraphQL vs tRPC, developer-friendly, purple accent" },
 * ]);
 * console.log(`Generated ${results.length} images, ${errors.length} failed`);
 * ```
 */
export async function generateInfographicBatch(
  requests: InfographicRequest[],
  options: InfographicBatchOptions = {},
): Promise<InfographicBatchResult> {
  const model =
    options.model ??
    (await getConfigValue("pipeline_config", "infographicModel", "imagen-4-fast"));

  const results: InfographicResult[] = [];
  const errors: Array<{ prompt: string; error: string }> = [];

  for (const request of requests) {
    try {
      const result = await generateInfographic(request, model);
      results.push(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ prompt: request.prompt, error: message });
    }
  }

  return { results, errors };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a brand-consistent infographic prompt for CodingCat.dev.
 *
 * Wraps a topic description with standard brand guidelines so all generated
 * infographics share a consistent visual identity.
 *
 * @param topic - The subject matter (e.g. "React Server Components").
 * @param style - Visual style hint (default: "dark tech").
 * @returns A fully-formed Imagen prompt string.
 */
export function buildInfographicPrompt(
  topic: string,
  style: string = "dark tech",
): string {
  return (
    `Create a professional, visually striking infographic about: ${topic}. ` +
    `Style: ${style}, purple and teal accent colors, clean sans-serif typography, ` +
    `CodingCat.dev brand aesthetic. ` +
    `Layout: structured sections with icons, data visualizations, and clear hierarchy. ` +
    `No watermarks. High information density. Developer audience.`
  );
}

// ---------------------------------------------------------------------------
// Default instructions (blueprint style from spec)
// ---------------------------------------------------------------------------

/** Default infographic instructions if Sanity contentConfig is not set up */
const DEFAULT_INSTRUCTIONS: string[] = [
  'Create a technical architecture sketch using white "hand-drawn" ink lines on a deep navy blue background (#003366). Use rough-sketched server and database icons with visible "marker" strokes, handwritten labels in a casual font, and a subtle grid pattern. Style: blueprint meets whiteboard doodle.',
  'Create a comparison chart on a vibrant blue background (#004080) with hand-inked white headers and uneven, sketchy borders. Use white cross-hatching and doodle-style checkmarks to highlight feature differences. Include hand-drawn arrows and annotations. Style: technical chalkboard.',
  'Create a step-by-step workflow "blueprint" on a dark blue canvas (#003366). Use hand-drawn white arrows connecting rough-sketched boxes, simple "stick-figure" style worker avatars, and handwritten-style labels with a slight chalk texture. Add a subtle grid background. Style: engineering whiteboard.',
  'Create a hand-sketched timeline using a jagged white line on a royal blue background. Represent milestones with simple, iconic white doodles that look like they were quickly sketched during a brainstorming session. Use handwritten dates and labels. Style: notebook sketch on blue paper.',
  'Create a pros and cons summary with a "lo-fi" aesthetic. Use hand-drawn white thumbs-up/down icons and rough-sketched containers on a deep blue background (#003366). Add hand-drawn underlines and circled keywords. Style: high-contrast ink-on-blueprint with cyan accent highlights.',
];

// ---------------------------------------------------------------------------
// High-level API: generate all infographics for a topic
// ---------------------------------------------------------------------------

/**
 * Generate a deterministic seed from a topic + instruction index.
 * Ensures the same topic always produces the same seed per instruction,
 * enabling brand-consistent regeneration.
 */
function generateSeed(topic: string, index: number): number {
  let hash = 0;
  const str = `${topic}-infographic-${index}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 2147483647;
}

/**
 * Generate all infographics for a research topic using instructions
 * from Sanity contentConfig.
 *
 * This is the main entry point for the check-research cron route.
 * Reads infographic instructions from contentConfig.infographicInstructions,
 * appends topic context to each, and generates images with deterministic
 * seeds for brand consistency.
 *
 * @param topic - The research topic (e.g. "React Server Components")
 * @param briefing - Optional research briefing text for additional context
 * @returns InfographicBatchResult with generated images and any errors
 */
export async function generateInfographicsForTopic(
  topic: string,
  briefing?: string,
): Promise<InfographicBatchResult> {
  const instructions = await getConfigValue(
    "content_config", "infographicInstructions", DEFAULT_INSTRUCTIONS
  );

  const model = await getConfigValue(
    "pipeline_config", "infographicModel", "imagen-4-fast"
  );

  const contextSuffix = briefing
    ? `\n\nTopic: ${topic}\nContext: ${briefing.slice(0, 500)}`
    : `\n\nTopic: ${topic}`;

  const requests: InfographicRequest[] = instructions.map(
    (instruction, index) => ({
      prompt: `${instruction}${contextSuffix}`,
      seed: generateSeed(topic, index),
      aspectRatio: "16:9" as const,
    })
  );

  console.log(
    `[infographics] Generating ${requests.length} infographics for "${topic}" with ${model}`
  );

  const result = await generateInfographicBatch(requests, { model });

  console.log(
    `[infographics] Complete: ${result.results.length} generated, ${result.errors.length} failed`
  );

  return result;
}
