/**
 * Gemini Infographic Generation Service
 *
 * Generates brand-consistent infographics using Imagen 4 Fast via the
 * @google/genai SDK. Each research topic produces multiple infographics
 * based on configurable prompt instructions from Sanity.
 *
 * Pipeline integration:
 *   research report → infographic prompts (from contentConfig) →
 *   Imagen 4 Fast → PNG bytes → Sanity CDN upload → URLs for Remotion b-roll
 *
 * Cost: ~$0.02/image with Imagen 4 Fast, ~$0.10 for 5 infographics per topic.
 *
 * @module lib/services/gemini-infographics
 */

import { GoogleGenAI } from "@google/genai";
import { getConfigValue } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Result of generating a single infographic. */
export interface InfographicResult {
  /** PNG image data as a Buffer */
  imageBuffer: Buffer;
  /** MIME type (always image/png for Imagen) */
  mimeType: string;
  /** The prompt instruction used to generate this image */
  instruction: string;
  /** The full prompt sent to the model (instruction + topic context) */
  fullPrompt: string;
  /** Seed used for generation (for reproducibility) */
  seed: number;
}

/** Result of generating all infographics for a topic. */
export interface InfographicBatchResult {
  /** Successfully generated infographics */
  images: InfographicResult[];
  /** Instructions that failed (with error messages) */
  errors: Array<{ instruction: string; error: string }>;
  /** Total generation time in ms */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default infographic instructions if Sanity config is not set up */
const DEFAULT_INSTRUCTIONS: string[] = [
  'Create a technical architecture sketch using white "hand-drawn" ink lines on a deep navy blue background (#003366). Use rough-sketched server and database icons with visible "marker" strokes, handwritten labels in a casual font, and a subtle grid pattern. Style: blueprint meets whiteboard doodle.',
  'Create a comparison chart on a vibrant blue background (#004080) with hand-inked white headers and uneven, sketchy borders. Use white cross-hatching and doodle-style checkmarks to highlight feature differences. Include hand-drawn arrows and annotations. Style: technical chalkboard.',
  'Create a step-by-step workflow "blueprint" on a dark blue canvas (#003366). Use hand-drawn white arrows connecting rough-sketched boxes, simple "stick-figure" style worker avatars, and handwritten-style labels with a slight chalk texture. Add a subtle grid background. Style: engineering whiteboard.',
  'Create a hand-sketched timeline using a jagged white line on a royal blue background. Represent milestones with simple, iconic white doodles that look like they were quickly sketched during a brainstorming session. Use handwritten dates and labels. Style: notebook sketch on blue paper.',
  'Create a pros and cons summary with a "lo-fi" aesthetic. Use hand-drawn white thumbs-up/down icons and rough-sketched containers on a deep blue background (#003366). Add hand-drawn underlines and circled keywords. Style: high-contrast ink-on-blueprint with cyan accent highlights.',
];

/** Default model for infographic generation */
const DEFAULT_MODEL = "imagen-4-fast";

/** Default aspect ratio for infographics (landscape, matches video) */
const DEFAULT_ASPECT_RATIO = "16:9";

/** Concurrency limit for parallel image generation */
const CONCURRENCY = 2;

// ---------------------------------------------------------------------------
// Lazy-init SDK client
// ---------------------------------------------------------------------------

let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error(
        "[infographics] Missing GEMINI_API_KEY environment variable."
      );
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(message: string, data?: Record<string, unknown>): void {
  const ts = new Date().toISOString();
  if (data) {
    console.log(`[infographics] [${ts}] ${message}`, data);
  } else {
    console.log(`[infographics] [${ts}] ${message}`);
  }
}

/**
 * Build the full prompt for an infographic by combining the instruction
 * template with the topic context.
 */
function buildPrompt(instruction: string, topic: string, briefing?: string): string {
  const contextSection = briefing
    ? `\n\nTopic: ${topic}\nContext: ${briefing.slice(0, 500)}`
    : `\n\nTopic: ${topic}`;

  return `${instruction}${contextSection}`;
}

/**
 * Generate a deterministic seed from a topic + instruction index.
 * This ensures the same topic always produces the same seed per instruction,
 * enabling brand-consistent regeneration.
 */
function generateSeed(topic: string, index: number): number {
  let hash = 0;
  const str = `${topic}-infographic-${index}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 2147483647; // Keep within safe int range
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a single infographic image using Imagen.
 *
 * @param instruction - The style/content instruction for the image
 * @param topic - The research topic for context
 * @param options - Optional overrides for model, seed, aspect ratio
 * @returns InfographicResult with image buffer and metadata
 */
export async function generateInfographic(
  instruction: string,
  topic: string,
  options?: {
    model?: string;
    seed?: number;
    aspectRatio?: string;
    briefing?: string;
  }
): Promise<InfographicResult> {
  const model = options?.model ?? await getConfigValue(
    "pipeline_config", "infographicModel", DEFAULT_MODEL
  );
  const seed = options?.seed ?? generateSeed(topic, 0);
  const aspectRatio = options?.aspectRatio ?? DEFAULT_ASPECT_RATIO;
  const fullPrompt = buildPrompt(instruction, topic, options?.briefing);

  const ai = getAI();

  log(`Generating infographic with ${model}`, {
    promptLength: fullPrompt.length,
    seed,
    aspectRatio,
  });

  const response = await ai.models.generateImages({
    model,
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      aspectRatio,
      seed,
    },
  });

  const generatedImages = response.generatedImages;
  if (!generatedImages || generatedImages.length === 0) {
    throw new Error(
      `[infographics] No images returned from ${model}. The prompt may have been filtered.`
    );
  }

  const image = generatedImages[0].image;
  if (!image?.imageBytes) {
    throw new Error(
      "[infographics] Generated image has no image bytes. Check model output format."
    );
  }

  const imageBuffer = Buffer.from(image.imageBytes, "base64");

  return {
    imageBuffer,
    mimeType: image.mimeType || "image/png",
    instruction,
    fullPrompt,
    seed,
  };
}

/**
 * Generate a batch of infographics for a research topic.
 *
 * Reads infographic instructions from Sanity contentConfig and generates
 * one image per instruction using the configured Imagen model. Each
 * instruction is processed with its own try/catch for fault isolation.
 *
 * @param topic - The research topic
 * @param briefing - Optional research briefing text for context
 * @returns InfographicBatchResult with images and any errors
 */
export async function generateInfographicBatch(
  topic: string,
  briefing?: string
): Promise<InfographicBatchResult> {
  const startTime = Date.now();

  // Read instructions from Sanity config with fallback
  const instructions = await getConfigValue(
    "content_config", "infographicInstructions", DEFAULT_INSTRUCTIONS
  );

  const model = await getConfigValue(
    "pipeline_config", "infographicModel", DEFAULT_MODEL
  );

  log(`Starting batch generation: ${instructions.length} infographics for "${topic}"`, {
    model,
    instructionCount: instructions.length,
  });

  const images: InfographicResult[] = [];
  const errors: Array<{ instruction: string; error: string }> = [];

  // Process in batches with concurrency limit
  for (let i = 0; i < instructions.length; i += CONCURRENCY) {
    const batch = instructions.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(
      batch.map((instruction, batchIndex) => {
        const globalIndex = i + batchIndex;
        const seed = generateSeed(topic, globalIndex);

        log(`Generating infographic ${globalIndex + 1}/${instructions.length}`);

        return generateInfographic(instruction, topic, {
          model,
          seed,
          briefing,
        });
      })
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const instruction = batch[j];

      if (result.status === "fulfilled") {
        images.push(result.value);
      } else {
        const errorMsg = result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
        log(`Failed to generate infographic ${i + j + 1}: ${errorMsg}`);
        errors.push({ instruction, error: errorMsg });
      }
    }
  }

  const durationMs = Date.now() - startTime;

  log(`Batch complete: ${images.length} generated, ${errors.length} failed`, {
    durationMs,
    topic,
  });

  return { images, errors, durationMs };
}
