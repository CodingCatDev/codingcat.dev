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
