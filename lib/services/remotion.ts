/**
 * Remotion Lambda rendering service — runtime only.
 *
 * Handles triggering and polling Remotion Lambda renders for video production.
 * Produces both 16:9 (main) and 9:16 (short) video formats.
 *
 * Deploy functions (deploySite, deployFunction, getOrCreateBucket) live in
 * `remotion-deploy.ts` to avoid pulling @rspack/binding into Vercel bundles.
 *
 * Requires env vars:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 *
 * Remotion-specific config (region, serveUrl, functionName) is read from
 * Sanity singletons via getConfigValue().
 *
 * @module lib/services/remotion
 */

import {
  renderMediaOnLambda,
  getRenderProgress,
  type AwsRegion,
} from "@remotion/lambda/client";
import { getConfigValue } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RemotionLambdaConfig {
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
      sceneType?: string;
      code?: { snippet: string; language: string; highlightLines?: number[] };
      list?: { items: string[]; icon?: string };
      comparison?: { leftLabel: string; rightLabel: string; rows: { left: string; right: string }[] };
      mockup?: { deviceType: string; screenContent: string };
      infographicUrl?: string;
      wordTimestamps?: Array<{ text: string; startMs: number; endMs: number }>;
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default Lambda function name if not configured in Sanity */
const DEFAULT_FUNCTION_NAME = "remotion-render-4-0-431";

/** Polling interval in ms when waiting for render completion */
const POLL_INTERVAL_MS = 2_000;

/** Maximum time to wait for a render before timing out (15 minutes) */
const RENDER_TIMEOUT_MS = 15 * 60 * 1_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(message: string, data?: Record<string, unknown>): void {
  const ts = new Date().toISOString();
  if (data) {
    console.log(`[REMOTION] [${ts}] ${message}`, data);
  } else {
    console.log(`[REMOTION] [${ts}] ${message}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Map a RenderInput into the inputProps shape expected by the Remotion composition.
 */
function mapInputProps(input: RenderInput): Record<string, unknown> {
  return {
    audioUrl: input.audioUrl,
    audioDurationInSeconds: input.audioDurationSeconds,
    hook: input.script.hook,
    scenes: input.script.scenes.map((s, i) => ({
      ...s,
      bRollUrl: input.bRollUrls[i],
    })),
    cta: input.script.cta,
    sponsor: input.sponsor,
  };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Get Remotion Lambda configuration from Sanity config + environment variables.
 * AWS credentials come from env vars; Remotion-specific config from Sanity.
 * Throws if any required value is missing.
 */
export async function getRemotionConfig(): Promise<RemotionLambdaConfig> {
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = await getConfigValue("remotion_config", "awsRegion", "us-east-1");
  const serveUrl = await getConfigValue("remotion_config", "serveUrl", undefined);

  const missing: string[] = [];
  if (!awsAccessKeyId) missing.push("AWS_ACCESS_KEY_ID");
  if (!awsSecretAccessKey) missing.push("AWS_SECRET_ACCESS_KEY");
  if (!region) missing.push("remotion_config.awsRegion");
  if (!serveUrl) missing.push("remotion_config.serveUrl");

  if (missing.length > 0) {
    throw new Error(
      `[REMOTION] Missing required configuration: ${missing.join(", ")}. ` +
        `AWS credentials come from env vars. Remotion config (region, serveUrl, functionName) ` +
        `is managed in the Sanity Remotion Config singleton. ` +
        `serveUrl is generated by running deployRemotionLambda().`
    );
  }

  return {
    awsAccessKeyId: awsAccessKeyId!,
    awsSecretAccessKey: awsSecretAccessKey!,
    region: region!,
    serveUrl: serveUrl!,
  };
}

/**
 * Get the Lambda function name from Sanity config or use the default.
 */
async function getFunctionName(): Promise<string> {
  return getConfigValue("remotion_config", "functionName", "remotion-render-4-0-431-mem2048mb-disk2048mb-240sec");
}

// ---------------------------------------------------------------------------
// Types – render start (no polling)
// ---------------------------------------------------------------------------

export interface RenderStartResult {
  mainRenderId: string;
  shortRenderId: string;
  bucketName: string;
}

export interface RenderProgressResult {
  done: boolean;
  /** 0-100 */
  progress: number;
  outputUrl?: string;
  outputSize?: number;
  errors?: string;
}

export interface BothRendersResult {
  allDone: boolean;
  main: RenderProgressResult;
  short: RenderProgressResult;
}

// ---------------------------------------------------------------------------
// Core – start a single render (no polling)
// ---------------------------------------------------------------------------

/**
 * Trigger a render on Lambda and return immediately with the render ID.
 * Does NOT poll for completion.
 */
async function startRender(
  composition: string,
  input: RenderInput
): Promise<{ renderId: string; bucketName: string }> {
  const config = await getRemotionConfig();
  const functionName = await getFunctionName();
  const region = config.region as AwsRegion;

  log(`Starting render for composition "${composition}"`, {
    scenes: input.script.scenes.length,
    audioDuration: input.audioDurationSeconds,
    functionName,
    region,
  });

  try {
    const renderResponse = await renderMediaOnLambda({
      composition,
      serveUrl: config.serveUrl,
      codec: "h264",
      inputProps: mapInputProps(input),
      region,
      functionName,
    });

    log(`Render triggered successfully`, {
      renderId: renderResponse.renderId,
      bucketName: renderResponse.bucketName,
      composition,
    });

    return {
      renderId: renderResponse.renderId,
      bucketName: renderResponse.bucketName,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[REMOTION] Failed to trigger Lambda render for "${composition}": ${message}. ` +
        `Ensure the Lambda function "${functionName}" is deployed in ${region} ` +
        `and the Remotion Config serveUrl points to a valid Remotion bundle.`
    );
  }
}

// ---------------------------------------------------------------------------
// Public API – start renders
// ---------------------------------------------------------------------------

/**
 * Start both video renders (main 16:9 + short 9:16) in parallel on Lambda.
 * Returns render IDs immediately — does NOT poll for completion.
 *
 * Use `checkBothRenders` to poll for progress separately.
 */
export async function startBothRenders(
  input: RenderInput
): Promise<RenderStartResult> {
  log(
    `Starting parallel render of MainVideo + ShortVideo ` +
      `(${input.script.scenes.length} scenes, ${input.audioDurationSeconds}s audio)`
  );

  const [mainResult, shortResult] = await Promise.all([
    startRender("MainVideo", input),
    startRender("ShortVideo", input),
  ]);

  // Both should use the same bucket, but we take the main one as canonical
  log(`Both renders started`, {
    mainRenderId: mainResult.renderId,
    shortRenderId: shortResult.renderId,
    bucketName: mainResult.bucketName,
  });

  return {
    mainRenderId: mainResult.renderId,
    shortRenderId: shortResult.renderId,
    bucketName: mainResult.bucketName,
  };
}

// ---------------------------------------------------------------------------
// Public API – check render progress
// ---------------------------------------------------------------------------

/**
 * Check the progress of a single Remotion Lambda render.
 */
export async function checkRenderProgress(
  renderId: string,
  bucketName: string
): Promise<RenderProgressResult> {
  const config = await getRemotionConfig();
  const functionName = await getFunctionName();
  const region = config.region as AwsRegion;

  const progress = await getRenderProgress({
    renderId,
    bucketName,
    region,
    functionName,
  });

  // Check for fatal errors
  if (progress.fatalErrorEncountered) {
    const errorMessages = (progress.errors ?? [])
      .map((e) => {
        if (typeof e === "string") return e;
        if (e && typeof e === "object" && "message" in e)
          return (e as { message: string }).message;
        return JSON.stringify(e);
      })
      .join("; ");

    return {
      done: false,
      progress: Math.round((progress.overallProgress ?? 0) * 100),
      errors:
        errorMessages ||
        `Fatal error in render ${renderId}. Check CloudWatch logs for "${functionName}" in ${region}.`,
    };
  }

  if (progress.done) {
    const outputUrl = progress.outputFile ?? "";
    const outputSize = progress.outputSizeInBytes ?? 0;

    return {
      done: true,
      progress: 100,
      outputUrl: outputUrl || undefined,
      outputSize,
    };
  }

  return {
    done: false,
    progress: Math.round((progress.overallProgress ?? 0) * 100),
  };
}

/**
 * Check progress of both main and short renders.
 */
export async function checkBothRenders(
  mainRenderId: string,
  shortRenderId: string,
  bucketName: string
): Promise<BothRendersResult> {
  const [main, short] = await Promise.all([
    checkRenderProgress(mainRenderId, bucketName),
    checkRenderProgress(shortRenderId, bucketName),
  ]);

  return {
    allDone: main.done && short.done,
    main,
    short,
  };
}

// ---------------------------------------------------------------------------
// Legacy API (kept for backward compatibility)
// ---------------------------------------------------------------------------

/**
 * @deprecated Use `startBothRenders` + `checkBothRenders` instead.
 * Render both video formats (main + short) in parallel, polling until done.
 */
export async function renderBothFormats(
  input: RenderInput
): Promise<{ main: RenderResult; short: RenderResult }> {
  log(
    `[DEPRECATED] renderBothFormats called — use startBothRenders + checkBothRenders instead`
  );

  const startResult = await startBothRenders(input);

  // Poll until both are done
  const pollSingle = async (
    renderId: string,
    bucketName: string,
    label: string
  ): Promise<RenderResult> => {
    const startTime = Date.now();
    while (true) {
      const elapsed = Date.now() - startTime;
      if (elapsed > RENDER_TIMEOUT_MS) {
        throw new Error(
          `[REMOTION] Render timed out after ${Math.round(elapsed / 1000)}s (${label}, renderId: ${renderId})`
        );
      }
      await sleep(POLL_INTERVAL_MS);
      const result = await checkRenderProgress(renderId, bucketName);
      if (result.errors) {
        throw new Error(`[REMOTION] Render failed (${label}): ${result.errors}`);
      }
      if (result.done) {
        if (!result.outputUrl) {
          throw new Error(`[REMOTION] Render done but no output URL (${label})`);
        }
        return {
          videoUrl: result.outputUrl,
          renderDurationSeconds: Math.round(elapsed / 100) / 10,
          fileSizeBytes: result.outputSize ?? 0,
        };
      }
      log(`${label} progress: ${result.progress}%`);
    }
  };

  const [main, short] = await Promise.all([
    pollSingle(startResult.mainRenderId, startResult.bucketName, "MainVideo"),
    pollSingle(startResult.shortRenderId, startResult.bucketName, "ShortVideo"),
  ]);

  return { main, short };
}
