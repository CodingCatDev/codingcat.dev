/**
 * Audio Timestamp Utilities
 *
 * Converts ElevenLabs character-level alignment data to word-level timestamps
 * for use in Remotion scene components.
 */

/** Character-level alignment from ElevenLabs API */
export interface CharacterAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

/** Word-level timestamp */
export interface WordTimestamp {
  text: string;
  startMs: number;
  endMs: number;
}

/** Per-scene audio result */
export interface SceneAudioResult {
  /** Base64-encoded audio data */
  audioBase64: string;
  /** Audio as Buffer */
  audioBuffer: Buffer;
  /** Word-level timestamps */
  wordTimestamps: WordTimestamp[];
  /** Total duration in milliseconds */
  durationMs: number;
}

/**
 * Aggregate character-level alignment to word-level timestamps.
 *
 * ElevenLabs returns per-character timing. We group characters into words
 * (splitting on whitespace) and take the min start / max end for each word.
 */
export function aggregateToWordTimestamps(
  alignment: CharacterAlignment
): WordTimestamp[] {
  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;

  if (!characters?.length) return [];

  const words: WordTimestamp[] = [];
  let currentWord = "";
  let wordStartMs = 0;
  let wordEndMs = 0;
  let inWord = false;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startMs = Math.round(character_start_times_seconds[i] * 1000);
    const endMs = Math.round(character_end_times_seconds[i] * 1000);

    if (char === " " || char === "\n" || char === "\t") {
      // Whitespace — flush current word if any
      if (inWord && currentWord.trim()) {
        words.push({
          text: currentWord.trim(),
          startMs: wordStartMs,
          endMs: wordEndMs,
        });
        currentWord = "";
        inWord = false;
      }
    } else {
      // Non-whitespace character
      if (!inWord) {
        // Start of a new word
        wordStartMs = startMs;
        inWord = true;
      }
      currentWord += char;
      wordEndMs = endMs;
    }
  }

  // Flush last word
  if (inWord && currentWord.trim()) {
    words.push({
      text: currentWord.trim(),
      startMs: wordStartMs,
      endMs: wordEndMs,
    });
  }

  return words;
}

/**
 * Convert milliseconds to Remotion frame number.
 */
export function msToFrame(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps);
}

/**
 * Convert Remotion frame number to milliseconds.
 */
export function frameToMs(frame: number, fps: number): number {
  return Math.round((frame / fps) * 1000);
}

/**
 * Find the active word at a given frame.
 * Returns the index of the word being spoken, or -1 if between words.
 */
export function getActiveWordAtFrame(
  wordTimestamps: WordTimestamp[],
  frame: number,
  fps: number
): number {
  const ms = frameToMs(frame, fps);
  for (let i = 0; i < wordTimestamps.length; i++) {
    if (ms >= wordTimestamps[i].startMs && ms <= wordTimestamps[i].endMs) {
      return i;
    }
  }
  return -1;
}

/**
 * Find which "segment" (e.g., list item, code line) is active at a given frame.
 * Segments are defined by keyword markers in the word timestamps.
 *
 * @param wordTimestamps - All word timestamps for the scene
 * @param segmentCount - Number of segments (e.g., number of list items)
 * @param frame - Current Remotion frame
 * @param fps - Frames per second
 * @returns Index of the active segment (0-based), or 0 if can't determine
 */
export function getActiveSegmentAtFrame(
  wordTimestamps: WordTimestamp[],
  segmentCount: number,
  frame: number,
  fps: number
): number {
  if (!wordTimestamps.length || segmentCount <= 1) return 0;

  const ms = frameToMs(frame, fps);
  const totalDuration = wordTimestamps[wordTimestamps.length - 1].endMs;

  if (totalDuration <= 0) return 0;

  // Simple proportional mapping: divide narration time evenly across segments
  const segmentDuration = totalDuration / segmentCount;
  const activeSegment = Math.floor(ms / segmentDuration);

  return Math.min(activeSegment, segmentCount - 1);
}
