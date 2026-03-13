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

/** Result for dual-orientation generation */
export interface DualOrientationResult {
  horizontal: InfographicResult[];
  vertical: InfographicResult[];
  errors: Array<{ prompt: string; error: string }>;
}

/** Options for batch infographic generation. */
export interface InfographicBatchOptions {
  /** Override the Imagen model (defaults to pipeline_config.infographicModel or "imagen-4.0-fast-generate-001"). */
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
 * @param model - Imagen model ID (e.g. "imagen-4.0-fast-generate-001").
 * @returns InfographicResult with base64 image bytes.
 * @throws If the API call fails or no image is returned.
 */
export async function generateInfographic(
  request: InfographicRequest,
  model: string = "imagen-4.0-fast-generate-001",
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
    (await getConfigValue("pipeline_config", "infographicModel", "imagen-4.0-fast-generate-001"));

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
  'Infographic 2D architecture style, black background. A high-level technical architecture overview showing system components and data flow. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations.',
  'Infographic 2D architecture style, black background. A comparison chart showing key features and alternatives side by side. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations.',
  'Infographic 2D architecture style, black background. A step-by-step workflow diagram showing the process from start to finish. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations.',
  'Infographic 2D architecture style, black background. A timeline of key developments, milestones, and version releases. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations.',
  'Infographic 2D architecture style, black background. A pros and cons visual summary with clear icons and labels. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations.',
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
    "pipeline_config", "infographicModel", "imagen-4.0-fast-generate-001"
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

// ---------------------------------------------------------------------------
// Dual-orientation generation from per-scene prompts
// ---------------------------------------------------------------------------

/**
 * Generate infographics from per-scene image prompts in both orientations.
 * This is the new main entry point for the check-research cron.
 *
 * @param prompts - Array of image prompt strings from the enriched script
 * @param topic - Topic name for seed generation
 * @returns DualOrientationResult with horizontal (16:9) and vertical (9:16) images
 */
export async function generateFromScenePrompts(
  prompts: string[],
  topic: string,
): Promise<DualOrientationResult> {
  const model = await getConfigValue(
    "pipeline_config", "infographicModel", "imagen-4.0-fast-generate-001"
  );

  const horizontal: InfographicResult[] = [];
  const vertical: InfographicResult[] = [];
  const errors: Array<{ prompt: string; error: string }> = [];

  console.log(`[infographics] Generating ${prompts.length} prompts \u00d7 2 orientations (${prompts.length * 2} total) for "${topic}"`);

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const seed = generateSeed(topic, i);

    // Generate horizontal (16:9)
    try {
      const hResult = await generateInfographic(
        { prompt, aspectRatio: "16:9", seed },
        model,
      );
      horizontal.push(hResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ prompt: `[16:9] ${prompt}`, error: message });
    }

    // Generate vertical (9:16)
    try {
      const vResult = await generateInfographic(
        { prompt, aspectRatio: "9:16", seed },
        model,
      );
      vertical.push(vResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ prompt: `[9:16] ${prompt}`, error: message });
    }

    // Rate limit: pause every 5 images to avoid Imagen API throttling
    if (i > 0 && i % 5 === 0) {
      console.log(`[infographics] Progress: ${i}/${prompts.length} prompts processed, pausing for rate limit...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(
    `[infographics] Complete: ${horizontal.length} horizontal, ${vertical.length} vertical, ${errors.length} errors`
  );

  return { horizontal, vertical, errors };
}
