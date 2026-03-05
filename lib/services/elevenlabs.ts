/**
 * ElevenLabs Text-to-Speech Service
 *
 * Converts script text into MP3 audio using the ElevenLabs TTS API v1.
 * Part of the CodingCat.dev automated video pipeline:
 *   script text → ElevenLabs TTS → MP3 audio → upload to GCS → Remotion render
 */

import {
  aggregateToWordTimestamps,
  type CharacterAlignment,
  type WordTimestamp,
  type SceneAudioResult,
} from "@/lib/utils/audio-timestamps";
import { getConfigValue } from "@/lib/config";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

/** Configuration for the ElevenLabs TTS service. */
export type ElevenLabsConfig = {
  /** ElevenLabs API key for authentication. */
  apiKey: string;
  /** ElevenLabs voice ID to use for speech synthesis. */
  voiceId: string;
};

/** Voice settings passed to the ElevenLabs API. */
interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
}

/** Request body for the ElevenLabs TTS endpoint. */
interface TTSRequestBody {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

/** Shape of the script object used in the video pipeline. */
export interface VideoScript {
  hook: string;
  scenes: Array<{
    sceneNumber?: number;
    narration: string;
    visualDescription?: string;
    bRollKeywords?: string[];
    durationEstimate?: number;
  }>;
  cta: string;
}

/** Response from ElevenLabs /with-timestamps endpoint */
interface TTSWithTimestampsResponse {
  audio_base64: string;
  alignment: CharacterAlignment;
}

/**
 * Reads the ElevenLabs configuration from Sanity config + environment variables.
 * API key (secret) stays as process.env. Voice ID comes from Sanity config with env fallback.
 *
 * @returns The resolved {@link ElevenLabsConfig}.
 * @throws {Error} If the API key is missing.
 */
async function getElevenLabsConfig(): Promise<ElevenLabsConfig> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing ELEVENLABS_API_KEY environment variable. " +
        "Set it in your .env.local or deployment environment."
    );
  }

  const voiceId = await getConfigValue(
    "pipeline_config", "elevenLabsVoiceId",
    process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB"
  );

  return { apiKey, voiceId };
}

/**
 * Generate speech audio from plain text using the ElevenLabs TTS API.
 *
 * Calls the ElevenLabs v1 text-to-speech endpoint with the
 * `eleven_multilingual_v2` model and returns the resulting MP3 audio
 * as a Node.js `Buffer`.
 *
 * @param text - The text to convert to speech.
 * @returns A `Buffer` containing the MP3 audio data.
 * @throws {Error} If the text is empty, env vars are missing, or the API request fails.
 *
 * @example
 * ```ts
 * import { generateSpeech } from "@/lib/services/elevenlabs";
 *
 * const mp3Buffer = await generateSpeech("Hello from CodingCat.dev!");
 * ```
 */
export async function generateSpeech(text: string): Promise<Buffer> {
  if (!text || text.trim().length === 0) {
    throw new Error("Cannot generate speech from empty text.");
  }

  const { apiKey, voiceId } = await getElevenLabsConfig();

  const url = `${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}`;

  const body: TTSRequestBody = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
    },
  };

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `ElevenLabs API request failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!response.ok) {
    let errorDetail: string;

    try {
      const errorBody = await response.json();
      errorDetail =
        errorBody?.detail?.message ||
        errorBody?.detail ||
        JSON.stringify(errorBody);
    } catch {
      errorDetail = response.statusText || "Unknown error";
    }

    throw new Error(
      `ElevenLabs TTS API error (${response.status}): ${errorDetail}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error("ElevenLabs API returned an empty audio response.");
  }

  return Buffer.from(arrayBuffer);
}

/**
 * Generate speech audio from a structured video script.
 *
 * Concatenates the script's hook, scene narrations, and call-to-action
 * into a single text block (separated by pauses) and converts it to
 * MP3 audio via {@link generateSpeech}.
 *
 * @param script - The video script containing a hook, scenes with narrations, and a CTA.
 * @returns A `Buffer` containing the MP3 audio data.
 * @throws {Error} If the script produces empty text or the TTS call fails.
 *
 * @example
 * ```ts
 * import { generateSpeechFromScript } from "@/lib/services/elevenlabs";
 *
 * const mp3Buffer = await generateSpeechFromScript({
 *   hook: "Did you know you can automate video creation?",
 *   scenes: [
 *     { narration: "First, we generate a script using AI." },
 *     { narration: "Then, we convert it to speech with ElevenLabs." },
 *   ],
 *   cta: "Subscribe to CodingCat.dev for more!",
 * });
 * ```
 */
export async function generateSpeechFromScript(
  script: VideoScript
): Promise<Buffer> {
  const sections: string[] = [];

  if (script.hook?.trim()) {
    sections.push(script.hook.trim());
  }

  if (script.scenes && Array.isArray(script.scenes)) {
    for (const scene of script.scenes) {
      if (scene.narration?.trim()) {
        sections.push(scene.narration.trim());
      }
    }
  }

  if (script.cta?.trim()) {
    sections.push(script.cta.trim());
  }

  if (sections.length === 0) {
    throw new Error(
      "Cannot generate speech from an empty script. " +
        "Provide at least a hook, one scene narration, or a CTA."
    );
  }

  // Join sections with ". " to create natural pauses between parts.
  // Ensure each section ends cleanly before adding the pause separator.
  const combinedText = sections
    .map((s) => (s.endsWith(".") ? s : `${s}.`))
    .join(" ");

  return generateSpeech(combinedText);
}

/**
 * Generate speech with word-level timestamps using the ElevenLabs
 * `/text-to-speech/{voiceId}/with-timestamps` endpoint.
 *
 * Returns both the audio buffer and word-level timing data that can be
 * used to sync Remotion visuals to the narration.
 *
 * @param text - The text to convert to speech.
 * @returns Audio buffer + word-level timestamps.
 */
export async function generateSpeechWithTimestamps(
  text: string
): Promise<SceneAudioResult> {
  if (!text || text.trim().length === 0) {
    throw new Error("Cannot generate speech from empty text.");
  }

  const { apiKey, voiceId } = await getElevenLabsConfig();

  const url = `${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}/with-timestamps`;

  const body: TTSRequestBody = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
    },
  };

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `ElevenLabs timestamps API request failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!response.ok) {
    let errorDetail: string;
    try {
      const errorBody = await response.json();
      errorDetail =
        errorBody?.detail?.message ||
        errorBody?.detail ||
        JSON.stringify(errorBody);
    } catch {
      errorDetail = response.statusText || "Unknown error";
    }
    throw new Error(
      `ElevenLabs timestamps API error (${response.status}): ${errorDetail}`
    );
  }

  const data = (await response.json()) as TTSWithTimestampsResponse;

  if (!data.audio_base64) {
    throw new Error("ElevenLabs timestamps API returned no audio data.");
  }

  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  const wordTimestamps = aggregateToWordTimestamps(data.alignment);

  // Calculate duration from the last word's end time, or estimate from buffer
  const durationMs =
    wordTimestamps.length > 0
      ? wordTimestamps[wordTimestamps.length - 1].endMs
      : Math.round((audioBuffer.length / 32000) * 1000); // rough estimate for MP3

  return {
    audioBase64: data.audio_base64,
    audioBuffer,
    wordTimestamps,
    durationMs,
  };
}

/**
 * Generate per-scene audio with timestamps from a structured video script.
 *
 * Instead of concatenating everything into one blob, this generates
 * separate audio for each section (hook, scenes, CTA) with word-level
 * timestamps. This enables:
 * - Precise scene boundary timing
 * - Per-scene word timestamps for visual sync
 * - Fault isolation (retry one scene instead of all)
 *
 * @param script - The video script
 * @returns Array of SceneAudioResult, one per section (hook + scenes + CTA)
 */
export async function generatePerSceneAudio(
  script: VideoScript
): Promise<{
  hook: SceneAudioResult;
  scenes: SceneAudioResult[];
  cta: SceneAudioResult;
  totalDurationMs: number;
}> {
  const sections: { label: string; text: string }[] = [];

  if (script.hook?.trim()) {
    sections.push({ label: "hook", text: script.hook.trim() });
  } else {
    throw new Error("Script must have a hook.");
  }

  if (!script.scenes?.length) {
    throw new Error("Script must have at least one scene.");
  }

  for (const scene of script.scenes) {
    if (scene.narration?.trim()) {
      sections.push({
        label: `scene-${scene.sceneNumber ?? sections.length}`,
        text: scene.narration.trim(),
      });
    }
  }

  if (script.cta?.trim()) {
    sections.push({ label: "cta", text: script.cta.trim() });
  } else {
    throw new Error("Script must have a CTA.");
  }

  console.log(
    `[elevenlabs] Generating per-scene audio for ${sections.length} sections...`
  );

  // Generate audio for all sections concurrently (with a concurrency limit)
  const CONCURRENCY = 3;
  const results: SceneAudioResult[] = [];

  for (let i = 0; i < sections.length; i += CONCURRENCY) {
    const batch = sections.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (section) => {
        console.log(
          `[elevenlabs] Generating audio for ${section.label} (${section.text.length} chars)...`
        );
        return generateSpeechWithTimestamps(section.text);
      })
    );
    results.push(...batchResults);
  }

  const totalDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0);

  console.log(
    `[elevenlabs] Per-scene audio complete: ${results.length} sections, ${Math.round(totalDurationMs / 1000)}s total`
  );

  // Split results back into hook, scenes, CTA
  const hookResult = results[0];
  const sceneResults = results.slice(1, results.length - 1);
  const ctaResult = results[results.length - 1];

  return {
    hook: hookResult,
    scenes: sceneResults,
    cta: ctaResult,
    totalDurationMs,
  };
}

// Re-export timestamp types for consumers
export type { WordTimestamp, SceneAudioResult, CharacterAlignment } from "@/lib/utils/audio-timestamps";
