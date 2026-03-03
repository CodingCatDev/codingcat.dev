/**
 * ElevenLabs Text-to-Speech Service
 *
 * Converts script text into MP3 audio using the ElevenLabs TTS API v1.
 * Part of the CodingCat.dev automated video pipeline:
 *   script text → ElevenLabs TTS → MP3 audio → upload to GCS → Remotion render
 */

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

/**
 * Reads the ElevenLabs configuration from environment variables.
 *
 * @returns The resolved {@link ElevenLabsConfig}.
 * @throws {Error} If required environment variables are missing.
 */
function getConfig(): ElevenLabsConfig {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey) {
    throw new Error(
      "Missing ELEVENLABS_API_KEY environment variable. " +
        "Set it in your .env.local or deployment environment."
    );
  }

  if (!voiceId) {
    throw new Error(
      "Missing ELEVENLABS_VOICE_ID environment variable. " +
        "Set it in your .env.local or deployment environment."
    );
  }

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

  const { apiKey, voiceId } = getConfig();

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
