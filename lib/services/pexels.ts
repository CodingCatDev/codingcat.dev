/**
 * Pexels B-Roll Video Service
 *
 * Provides functions to search for and select B-roll video clips from the
 * Pexels API for the CodingCat.dev automated video pipeline.
 *
 * @module lib/services/pexels
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A video result returned by the Pexels Video Search API. */
export interface PexelsVideo {
  id: number;
  url: string;
  width: number;
  height: number;
  duration: number;
  videoFiles: Array<{
    id: number;
    quality: string;
    fileType: string;
    width: number;
    height: number;
    link: string;
  }>;
}

/** A resolved B-roll clip ready for use in the video pipeline. */
export interface BRollClip {
  videoUrl: string;
  width: number;
  height: number;
  duration: number;
  pexelsId: number;
}

/** Options accepted by {@link searchVideos}. */
interface SearchVideosOptions {
  perPage?: number;
  orientation?: "landscape" | "portrait";
}

/** Options accepted by {@link getBRollForScene}. */
interface GetBRollForSceneOptions {
  orientation?: "landscape" | "portrait";
  minDuration?: number;
}

// ---------------------------------------------------------------------------
// Internal: Pexels API raw response shapes
// ---------------------------------------------------------------------------

/** Shape of a single video file entry in the raw Pexels API response. */
interface PexelsApiVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

/** Shape of a single video entry in the raw Pexels API response. */
interface PexelsApiVideo {
  id: number;
  url: string;
  width: number;
  height: number;
  duration: number;
  video_files: PexelsApiVideoFile[];
}

/** Shape of the Pexels Video Search API response. */
interface PexelsSearchResponse {
  videos: PexelsApiVideo[];
  total_results: number;
  page: number;
  per_page: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PEXELS_VIDEO_SEARCH_URL = "https://api.pexels.com/videos/search";

/** Default minimum clip duration in seconds. */
const DEFAULT_MIN_DURATION = 5;

/** Delay (ms) between successive API requests to respect rate limits. */
const RATE_LIMIT_DELAY_MS = 400;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the Pexels API key from the environment.
 *
 * @throws {Error} If `PEXELS_API_KEY` is not set.
 */
function getApiKey(): string {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error(
      "PEXELS_API_KEY environment variable is not set. " +
        "Please add it to your .env file or environment."
    );
  }
  return key;
}

/**
 * Map a raw Pexels API video object to our {@link PexelsVideo} interface,
 * converting snake_case fields to camelCase.
 */
function mapApiVideo(raw: PexelsApiVideo): PexelsVideo {
  return {
    id: raw.id,
    url: raw.url,
    width: raw.width,
    height: raw.height,
    duration: raw.duration,
    videoFiles: raw.video_files.map((f) => ({
      id: f.id,
      quality: f.quality,
      fileType: f.file_type,
      width: f.width,
      height: f.height,
      link: f.link,
    })),
  };
}

/**
 * Sleep for the given number of milliseconds.
 *
 * @param ms - Milliseconds to wait.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Select the best video file from a {@link PexelsVideo} for the given
 * orientation.
 *
 * Prefers HD resolution (1920×1080 for landscape, 1080×1920 for portrait).
 * Falls back to the file with the highest total pixel count.
 *
 * @param video       - The Pexels video to pick a file from.
 * @param orientation - Desired orientation.
 * @returns The best matching video file entry, or `undefined` if none exist.
 */
function selectBestFile(
  video: PexelsVideo,
  orientation: "landscape" | "portrait" = "landscape"
): PexelsVideo["videoFiles"][number] | undefined {
  const files = video.videoFiles.filter(
    (f) => f.fileType === "video/mp4" || f.fileType.startsWith("video/")
  );

  if (files.length === 0) return undefined;

  // Target HD dimensions based on orientation
  const targetWidth = orientation === "landscape" ? 1920 : 1080;
  const targetHeight = orientation === "landscape" ? 1080 : 1920;

  // Try to find an exact HD match first
  const hdMatch = files.find(
    (f) => f.width === targetWidth && f.height === targetHeight
  );
  if (hdMatch) return hdMatch;

  // Try to find an HD-quality file (matching width at minimum)
  const hdWidthMatch = files.find((f) => f.width === targetWidth);
  if (hdWidthMatch) return hdWidthMatch;

  // Fall back to the highest resolution file available
  return files.reduce((best, current) => {
    const bestPixels = best.width * best.height;
    const currentPixels = current.width * current.height;
    return currentPixels > bestPixels ? current : best;
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Search the Pexels Video API for videos matching the given query.
 *
 * @param query   - Search query string (e.g. "coding", "nature").
 * @param options - Optional search parameters.
 * @param options.perPage     - Number of results per page (default 15, max 80).
 * @param options.orientation - Filter by orientation (`"landscape"` or `"portrait"`).
 * @returns An array of {@link PexelsVideo} results, or an empty array on error.
 *
 * @example
 * ```ts
 * const videos = await searchVideos("programming", { perPage: 5, orientation: "landscape" });
 * console.log(videos.length); // up to 5
 * ```
 */
export async function searchVideos(
  query: string,
  options?: SearchVideosOptions
): Promise<PexelsVideo[]> {
  try {
    const apiKey = getApiKey();

    const params = new URLSearchParams({
      query,
      per_page: String(options?.perPage ?? 15),
    });

    if (options?.orientation) {
      params.set("orientation", options.orientation);
    }

    const response = await fetch(`${PEXELS_VIDEO_SEARCH_URL}?${params}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      console.error(
        `[pexels] Search request failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = (await response.json()) as PexelsSearchResponse;

    return (data.videos ?? []).map(mapApiVideo);
  } catch (error) {
    console.error("[pexels] Error searching videos:", error);
    return [];
  }
}

/**
 * Find a suitable B-roll clip for a single scene by searching through the
 * provided keywords in order.
 *
 * The function iterates over each keyword, queries the Pexels API, and
 * returns the first clip that meets the minimum duration requirement. It
 * prefers HD quality and falls back to the best available resolution.
 *
 * @param keywords - Ordered list of search keywords to try.
 * @param options  - Optional selection parameters.
 * @param options.orientation - Desired orientation (default `"landscape"`).
 * @param options.minDuration - Minimum clip duration in seconds (default 5).
 * @returns A {@link BRollClip} if a suitable video is found, otherwise `null`.
 *
 * @example
 * ```ts
 * const clip = await getBRollForScene(["typescript coding", "programming"]);
 * if (clip) {
 *   console.log(`Found clip: ${clip.videoUrl}`);
 * }
 * ```
 */
export async function getBRollForScene(
  keywords: string[],
  options?: GetBRollForSceneOptions
): Promise<BRollClip | null> {
  const orientation = options?.orientation ?? "landscape";
  const minDuration = options?.minDuration ?? DEFAULT_MIN_DURATION;

  for (const keyword of keywords) {
    const videos = await searchVideos(keyword, {
      perPage: 15,
      orientation,
    });

    // Filter videos that meet the minimum duration requirement
    const eligible = videos.filter((v) => v.duration >= minDuration);

    for (const video of eligible) {
      const file = selectBestFile(video, orientation);
      if (!file) continue;

      return {
        videoUrl: file.link,
        width: file.width,
        height: file.height,
        duration: video.duration,
        pexelsId: video.id,
      };
    }
  }

  return null;
}

/**
 * Get B-roll clips for multiple scenes, avoiding duplicate Pexels videos
 * across scenes and respecting API rate limits.
 *
 * @param scenes      - Array of scene objects, each optionally containing keywords.
 * @param orientation - Desired orientation for all clips (default `"landscape"`).
 * @returns A `Map` keyed by scene index with the corresponding {@link BRollClip}.
 *          Scenes without keywords or without a matching clip are omitted.
 *
 * @example
 * ```ts
 * const scenes = [
 *   { bRollKeywords: ["coding", "developer"] },
 *   { bRollKeywords: ["nature", "forest"] },
 *   { bRollKeywords: undefined }, // skipped
 * ];
 * const clips = await getBRollForScenes(scenes, "landscape");
 * clips.forEach((clip, idx) => {
 *   console.log(`Scene ${idx}: ${clip.videoUrl}`);
 * });
 * ```
 */
export async function getBRollForScenes(
  scenes: Array<{ bRollKeywords?: string[] }>,
  orientation: "landscape" | "portrait" = "landscape"
): Promise<Map<number, BRollClip>> {
  const result = new Map<number, BRollClip>();
  const usedPexelsIds = new Set<number>();

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];

    // Skip scenes without bRollKeywords
    if (!scene.bRollKeywords || scene.bRollKeywords.length === 0) {
      continue;
    }

    // Rate-limit: pause between requests (skip delay for the first scene)
    if (result.size > 0 || i > 0) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }

    const clip = await findUnusedClip(
      scene.bRollKeywords,
      usedPexelsIds,
      orientation
    );

    if (clip) {
      usedPexelsIds.add(clip.pexelsId);
      result.set(i, clip);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Internal helpers for getBRollForScenes
// ---------------------------------------------------------------------------

/**
 * Search for a B-roll clip that has not already been used (by Pexels ID).
 *
 * @param keywords     - Keywords to search.
 * @param usedIds      - Set of Pexels video IDs already assigned to other scenes.
 * @param orientation  - Desired orientation.
 * @returns A {@link BRollClip} not in `usedIds`, or `null`.
 */
async function findUnusedClip(
  keywords: string[],
  usedIds: Set<number>,
  orientation: "landscape" | "portrait"
): Promise<BRollClip | null> {
  for (const keyword of keywords) {
    const videos = await searchVideos(keyword, {
      perPage: 15,
      orientation,
    });

    const eligible = videos.filter(
      (v) => v.duration >= DEFAULT_MIN_DURATION && !usedIds.has(v.id)
    );

    for (const video of eligible) {
      const file = selectBestFile(video, orientation);
      if (!file) continue;

      return {
        videoUrl: file.link,
        width: file.width,
        height: file.height,
        duration: video.duration,
        pexelsId: video.id,
      };
    }

    // Small delay between keyword attempts within the same scene
    if (keywords.length > 1) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  return null;
}
