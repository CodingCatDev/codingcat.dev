/**
 * FFmpeg post-render compression for video pipeline.
 *
 * Downloads the rendered video from Remotion Lambda's S3 output,
 * compresses it with FFmpeg, and returns the compressed buffer.
 *
 * Uses two-pass encoding for optimal quality/size ratio.
 */

import { execFileSync, execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompressOptions {
  /** Target bitrate for video (default: "2M" for 2 Mbps) */
  videoBitrate?: string;
  /** Audio bitrate (default: "128k") */
  audioBitrate?: string;
  /** CRF value for quality (default: 23, lower = better quality) */
  crf?: number;
  /** Preset (default: "medium", options: ultrafast … veryslow) */
  preset?: string;
  /** Max width — will scale down if larger, maintaining aspect ratio */
  maxWidth?: number;
  /** Max height — will scale down if larger, maintaining aspect ratio */
  maxHeight?: number;
}

export interface CompressResult {
  /** Compressed video as Buffer */
  buffer: Buffer;
  /** Original size in bytes */
  originalSize: number;
  /** Compressed size in bytes */
  compressedSize: number;
  /** Compression ratio (e.g., 0.6 means 60% of original) */
  ratio: number;
  /** Duration of compression in ms */
  durationMs: number;
}

export interface VideoMetadata {
  /** Duration in seconds */
  duration: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Video codec (e.g. "h264") */
  videoCodec: string;
  /** Audio codec (e.g. "aac") */
  audioCodec: string;
  /** Overall bitrate in bits/s */
  bitrate: number;
  /** File size in bytes */
  fileSize: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LOG_PREFIX = "[FFMPEG]";

function log(...args: unknown[]) {
  console.log(LOG_PREFIX, ...args);
}

function warn(...args: unknown[]) {
  console.warn(LOG_PREFIX, ...args);
}

function isFfmpegAvailable(): boolean {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function isFfprobeAvailable(): boolean {
  try {
    execSync("ffprobe -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Download a URL to a Buffer. Works in Node 18+ (global fetch).
 */
async function downloadUrl(url: string): Promise<Buffer> {
  log("Downloading video from URL …");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${LOG_PREFIX} Failed to download video: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Create a temp directory and return helpers for managing temp files.
 */
function makeTempDir() {
  const dir = mkdtempSync(join(tmpdir(), "ffmpeg-compress-"));
  const inputPath = join(dir, "input.mp4");
  const outputPath = join(dir, "output.mp4");
  const passLogPrefix = join(dir, "ffmpeg2pass");

  function cleanup() {
    for (const f of [inputPath, outputPath]) {
      try {
        unlinkSync(f);
      } catch {
        /* ignore */
      }
    }
    // Two-pass log files
    for (const suffix of ["", "-0.log", "-0.log.mbtree"]) {
      try {
        unlinkSync(passLogPrefix + suffix);
      } catch {
        /* ignore */
      }
    }
    try {
      // Remove the temp directory itself
      execSync(`rm -rf "${dir}"`, { stdio: "ignore" });
    } catch {
      /* ignore */
    }
  }

  return { dir, inputPath, outputPath, passLogPrefix, cleanup };
}

// ---------------------------------------------------------------------------
// Build FFmpeg arguments
// ---------------------------------------------------------------------------

function buildScaleFilter(opts: CompressOptions): string | null {
  if (!opts.maxWidth && !opts.maxHeight) return null;

  const w = opts.maxWidth ? `'min(${opts.maxWidth},iw)'` : "-2";
  const h = opts.maxHeight ? `'min(${opts.maxHeight},ih)'` : "-2";

  // Ensure dimensions are divisible by 2 for H.264
  return `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2`;
}

function buildFfmpegArgs(
  inputPath: string,
  outputPath: string,
  opts: CompressOptions,
  pass: 1 | 2 | "crf",
  passLogPrefix?: string,
): string[] {
  const args: string[] = ["-y", "-i", inputPath];

  // Video codec
  args.push("-c:v", "libx264");

  // Preset
  args.push("-preset", opts.preset || "medium");

  // Scale filter
  const scaleFilter = buildScaleFilter(opts);
  if (scaleFilter) {
    args.push("-vf", scaleFilter);
  }

  if (pass === "crf") {
    // Single-pass CRF mode
    args.push("-crf", String(opts.crf ?? 23));
    // Audio
    args.push("-c:a", "aac", "-b:a", opts.audioBitrate || "128k");
    // Faststart for web playback
    args.push("-movflags", "+faststart");
    args.push(outputPath);
  } else if (pass === 1) {
    // Two-pass: first pass
    args.push("-b:v", opts.videoBitrate || "2M");
    args.push("-pass", "1");
    args.push("-passlogfile", passLogPrefix!);
    args.push("-an"); // No audio in first pass
    args.push("-f", "null");
    args.push(process.platform === "win32" ? "NUL" : "/dev/null");
  } else {
    // Two-pass: second pass
    args.push("-b:v", opts.videoBitrate || "2M");
    args.push("-pass", "2");
    args.push("-passlogfile", passLogPrefix!);
    args.push("-c:a", "aac", "-b:a", opts.audioBitrate || "128k");
    args.push("-movflags", "+faststart");
    args.push(outputPath);
  }

  return args;
}

// ---------------------------------------------------------------------------
// Main: compressVideo
// ---------------------------------------------------------------------------

/**
 * Compress a video using FFmpeg.
 *
 * @param input - A video URL (string) or a Buffer containing the video data.
 * @param options - Compression options.
 * @returns CompressResult with the compressed buffer and stats.
 */
export async function compressVideo(
  input: string | Buffer,
  options: CompressOptions = {},
): Promise<CompressResult> {
  const startTime = Date.now();

  // 1. Resolve input to a Buffer
  let inputBuffer: Buffer;
  if (typeof input === "string") {
    inputBuffer = await downloadUrl(input);
  } else {
    inputBuffer = input;
  }

  const originalSize = inputBuffer.length;
  log(`Original video size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

  // 2. Check FFmpeg availability
  if (!isFfmpegAvailable()) {
    warn("FFmpeg is not available — returning original video uncompressed.");
    return {
      buffer: inputBuffer,
      originalSize,
      compressedSize: originalSize,
      ratio: 1,
      durationMs: Date.now() - startTime,
    };
  }

  // 3. Write input to temp file
  const { inputPath, outputPath, passLogPrefix, cleanup } = makeTempDir();

  try {
    writeFileSync(inputPath, inputBuffer);

    // 4. Decide encoding strategy
    const useTwoPass = !!options.videoBitrate;

    if (useTwoPass) {
      log("Running two-pass encode …");

      // Pass 1
      const pass1Args = buildFfmpegArgs(inputPath, outputPath, options, 1, passLogPrefix);
      log("Pass 1:", "ffmpeg", pass1Args.join(" "));
      execFileSync("ffmpeg", pass1Args, {
        stdio: ["ignore", "ignore", "pipe"],
        timeout: 600_000, // 10 min
      });

      // Pass 2
      const pass2Args = buildFfmpegArgs(inputPath, outputPath, options, 2, passLogPrefix);
      log("Pass 2:", "ffmpeg", pass2Args.join(" "));
      execFileSync("ffmpeg", pass2Args, {
        stdio: ["ignore", "ignore", "pipe"],
        timeout: 600_000,
      });
    } else {
      log("Running CRF encode …");
      const crfArgs = buildFfmpegArgs(inputPath, outputPath, options, "crf");
      log("ffmpeg", crfArgs.join(" "));
      execFileSync("ffmpeg", crfArgs, {
        stdio: ["ignore", "ignore", "pipe"],
        timeout: 600_000,
      });
    }

    // 5. Read compressed output
    const compressedBuffer = readFileSync(outputPath);
    const compressedSize = compressedBuffer.length;
    const ratio = compressedSize / originalSize;
    const durationMs = Date.now() - startTime;

    log(
      `Compression complete: ${(compressedSize / 1024 / 1024).toFixed(2)} MB ` +
        `(${(ratio * 100).toFixed(1)}% of original) in ${(durationMs / 1000).toFixed(1)}s`,
    );

    return {
      buffer: compressedBuffer,
      originalSize,
      compressedSize,
      ratio,
      durationMs,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    warn(`Compression failed: ${errMsg} — returning original video.`);
    return {
      buffer: inputBuffer,
      originalSize,
      compressedSize: originalSize,
      ratio: 1,
      durationMs: Date.now() - startTime,
    };
  } finally {
    // 6. Clean up temp files
    cleanup();
  }
}

// ---------------------------------------------------------------------------
// getVideoMetadata
// ---------------------------------------------------------------------------

/**
 * Get video metadata using ffprobe.
 *
 * @param input - A file path, URL, or Buffer.
 * @returns VideoMetadata with duration, resolution, codecs, etc.
 */
export async function getVideoMetadata(input: string | Buffer): Promise<VideoMetadata> {
  if (!isFfprobeAvailable()) {
    throw new Error(`${LOG_PREFIX} ffprobe is not available`);
  }

  let filePath: string;
  let cleanupFn: (() => void) | null = null;

  if (Buffer.isBuffer(input)) {
    const { inputPath, cleanup } = makeTempDir();
    writeFileSync(inputPath, input);
    filePath = inputPath;
    cleanupFn = cleanup;
  } else if (input.startsWith("http://") || input.startsWith("https://")) {
    // ffprobe can read URLs directly, but downloading is more reliable
    const buf = await downloadUrl(input);
    const { inputPath, cleanup } = makeTempDir();
    writeFileSync(inputPath, buf);
    filePath = inputPath;
    cleanupFn = cleanup;
  } else {
    filePath = input;
  }

  try {
    const probeArgs = [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      filePath,
    ];

    const result = execFileSync("ffprobe", probeArgs, {
      encoding: "utf-8",
      timeout: 30_000,
    });

    const data = JSON.parse(result);

    const videoStream = data.streams?.find(
      (s: { codec_type: string }) => s.codec_type === "video",
    );
    const audioStream = data.streams?.find(
      (s: { codec_type: string }) => s.codec_type === "audio",
    );
    const format = data.format || {};

    return {
      duration: parseFloat(format.duration || "0"),
      width: videoStream?.width || 0,
      height: videoStream?.height || 0,
      videoCodec: videoStream?.codec_name || "unknown",
      audioCodec: audioStream?.codec_name || "unknown",
      bitrate: parseInt(format.bit_rate || "0", 10),
      fileSize: parseInt(format.size || "0", 10),
    };
  } finally {
    if (cleanupFn) cleanupFn();
  }
}
