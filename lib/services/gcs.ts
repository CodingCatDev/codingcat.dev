/**
 * Google Cloud Storage service for uploading media assets.
 *
 * Requires env vars:
 * - GCS_BUCKET
 * - GCS_PROJECT_ID
 * - GCS_CLIENT_EMAIL
 * - GCS_PRIVATE_KEY
 *
 * @module lib/services/gcs
 */

export interface GCSConfig {
  bucket: string;
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

export interface UploadResult {
  /** Public URL of the uploaded file */
  url: string;
  /** GCS object path (bucket/path) */
  gcsPath: string;
  /** Content type of the uploaded file */
  contentType: string;
  /** File size in bytes */
  size: number;
}

/**
 * Get GCS configuration from environment variables.
 * Throws if any required env var is missing.
 */
export function getGCSConfig(): GCSConfig {
  const bucket = process.env.GCS_BUCKET;
  const projectId = process.env.GCS_PROJECT_ID;
  const clientEmail = process.env.GCS_CLIENT_EMAIL;
  const privateKey = process.env.GCS_PRIVATE_KEY;

  if (!bucket || !projectId || !clientEmail || !privateKey) {
    throw new Error(
      "[GCS] Missing required environment variables. Need: GCS_BUCKET, GCS_PROJECT_ID, GCS_CLIENT_EMAIL, GCS_PRIVATE_KEY"
    );
  }

  return { bucket, projectId, clientEmail, privateKey };
}

/**
 * Upload a buffer to Google Cloud Storage.
 *
 * Uses the GCS JSON API with a service account JWT for authentication.
 * Once GCS credentials are provided, this will be fully implemented.
 *
 * @param buffer - File content as a Buffer
 * @param path - Destination path within the bucket (e.g., "audio/video-123.mp3")
 * @param contentType - MIME type (e.g., "audio/mpeg", "video/mp4")
 * @returns Upload result with public URL
 */
export async function uploadToGCS(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<UploadResult> {
  const config = getGCSConfig();

  // TODO: Implement JWT signing for service account auth
  // TODO: Upload via GCS JSON API
  // For now, throw a clear error indicating credentials are needed
  throw new Error(
    `[GCS] Upload not yet implemented — awaiting GCS credentials. ` +
    `Would upload ${buffer.length} bytes to gs://${config.bucket}/${path}`
  );
}

/**
 * Upload an audio file (MP3) to GCS.
 *
 * @param buffer - MP3 audio buffer
 * @param videoId - The Sanity document ID for the video
 * @returns Upload result with public URL for the audio file
 */
export async function uploadAudio(
  buffer: Buffer,
  videoId: string
): Promise<UploadResult> {
  const path = `audio/${videoId}-${Date.now()}.mp3`;
  return uploadToGCS(buffer, path, "audio/mpeg");
}

/**
 * Upload a rendered video (MP4) to GCS.
 *
 * @param buffer - MP4 video buffer
 * @param videoId - The Sanity document ID for the video
 * @param variant - Video variant ("main" for 16:9, "short" for 9:16)
 * @returns Upload result with public URL for the video file
 */
export async function uploadVideo(
  buffer: Buffer,
  videoId: string,
  variant: "main" | "short"
): Promise<UploadResult> {
  const path = `video/${videoId}-${variant}-${Date.now()}.mp4`;
  return uploadToGCS(buffer, path, "video/mp4");
}

/**
 * Generate a signed URL for temporary access to a GCS object.
 * Useful for giving Remotion Lambda access to audio files.
 *
 * @param path - GCS object path
 * @param expiresInMinutes - URL expiry time in minutes (default: 60)
 * @returns Signed URL string
 */
export async function getSignedUrl(
  path: string,
  expiresInMinutes = 60
): Promise<string> {
  const config = getGCSConfig();

  // TODO: Implement signed URL generation with JWT
  throw new Error(
    `[GCS] Signed URL generation not yet implemented — awaiting GCS credentials. ` +
    `Would generate URL for gs://${config.bucket}/${path} (expires in ${expiresInMinutes}m)`
  );
}
