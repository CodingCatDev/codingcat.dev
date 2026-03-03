/**
 * Remotion Lambda rendering service.
 *
 * Handles deploying and triggering Remotion Lambda renders for video production.
 * Produces both 16:9 (main) and 9:16 (short) video formats.
 *
 * Requires env vars:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - REMOTION_AWS_REGION
 * - REMOTION_SERVE_URL (generated during Lambda deployment)
 *
 * @module lib/services/remotion
 */

export interface RemotionConfig {
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  region: string;
  serveUrl: string;
}

export interface RenderInput {
  /** URL to the TTS audio file */
  audioUrl: string;
  /** Video script data */
  script: {
    hook: string;
    scenes: Array<{
      narration: string;
      keywords?: string[];
      visualDescription?: string;
      bRollKeywords?: string[];
      sceneNumber?: number;
      durationEstimate?: number;
    }>;
    cta: string;
  };
  /** B-roll video URLs mapped by scene index */
  bRollUrls: Record<number, string>;
  /** Optional sponsor data */
  sponsor?: {
    name: string;
    logoUrl?: string;
    message?: string;
  };
  /** Audio duration in seconds */
  audioDurationSeconds: number;
}

export interface RenderResult {
  /** URL to the rendered video file */
  videoUrl: string;
  /** Render duration in seconds */
  renderDurationSeconds: number;
  /** Output file size in bytes */
  fileSizeBytes: number;
}

/**
 * Get Remotion Lambda configuration from environment variables.
 * Throws if any required env var is missing.
 */
export function getRemotionConfig(): RemotionConfig {
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.REMOTION_AWS_REGION;
  const serveUrl = process.env.REMOTION_SERVE_URL;

  if (!awsAccessKeyId || !awsSecretAccessKey || !region || !serveUrl) {
    throw new Error(
      "[REMOTION] Missing required environment variables. Need: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REMOTION_AWS_REGION, REMOTION_SERVE_URL"
    );
  }

  return { awsAccessKeyId, awsSecretAccessKey, region, serveUrl };
}

/**
 * Render the main 16:9 landscape video using Remotion Lambda.
 *
 * @param input - Render input data (audio, script, B-roll, sponsor)
 * @returns Render result with video URL
 */
export async function renderMainVideo(
  input: RenderInput
): Promise<RenderResult> {
  const config = getRemotionConfig();

  // TODO: Implement Remotion Lambda render via @remotion/lambda
  // Steps:
  // 1. renderMediaOnLambda({ composition: 'MainVideo', inputProps: input, ... })
  // 2. Wait for render completion
  // 3. Return the output URL
  throw new Error(
    `[REMOTION] Lambda render not yet implemented — awaiting AWS credentials. ` +
    `Would render MainVideo (16:9) with ${input.script.scenes.length} scenes, ` +
    `audio duration: ${input.audioDurationSeconds}s`
  );
}

/**
 * Render the 9:16 portrait Short video using Remotion Lambda.
 *
 * @param input - Render input data (audio, script, B-roll, sponsor)
 * @returns Render result with video URL
 */
export async function renderShortVideo(
  input: RenderInput
): Promise<RenderResult> {
  const config = getRemotionConfig();

  // TODO: Implement Remotion Lambda render via @remotion/lambda
  // Steps:
  // 1. renderMediaOnLambda({ composition: 'ShortVideo', inputProps: input, ... })
  // 2. Wait for render completion
  // 3. Return the output URL
  throw new Error(
    `[REMOTION] Lambda render not yet implemented — awaiting AWS credentials. ` +
    `Would render ShortVideo (9:16) with ${input.script.scenes.length} scenes, ` +
    `audio duration: ${input.audioDurationSeconds}s`
  );
}

/**
 * Render both video formats (main + short) in parallel.
 *
 * @param input - Render input data
 * @returns Object with both render results
 */
export async function renderBothFormats(
  input: RenderInput
): Promise<{ main: RenderResult; short: RenderResult }> {
  console.log(
    `[REMOTION] Starting parallel render of MainVideo + ShortVideo ` +
    `(${input.script.scenes.length} scenes, ${input.audioDurationSeconds}s audio)`
  );

  const [main, short] = await Promise.all([
    renderMainVideo(input),
    renderShortVideo(input),
  ]);

  console.log(
    `[REMOTION] Both renders complete. Main: ${main.fileSizeBytes} bytes, Short: ${short.fileSizeBytes} bytes`
  );

  return { main, short };
}
