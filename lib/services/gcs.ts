/**
 * Google Cloud Storage service for uploading media assets.
 *
 * Uses native Node.js `crypto` for JWT signing — no external auth libraries needed.
 * Authenticates via service account JWT → OAuth2 access token exchange.
 *
 * Requires env vars:
 * - GCS_BUCKET
 * - GCS_PROJECT_ID
 * - GCS_CLIENT_EMAIL
 * - GCS_PRIVATE_KEY
 *
 * @module lib/services/gcs
 */

import * as crypto from "crypto";
import { getConfigValue } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Module-level token cache
// ---------------------------------------------------------------------------

interface CachedToken {
  accessToken: string;
  /** Epoch ms when the token expires */
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

/** Tokens are refreshed when within this many ms of expiry */
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Get GCS configuration from environment variables.
 * Throws if any required env var is missing.
 *
 * The private key may contain literal `\\n` sequences from the env var;
 * these are converted to real newline characters.
 */
export async function getGCSConfig(): Promise<GCSConfig> {
  const bucket = await getConfigValue("gcs_config", "bucketName", process.env.GCS_BUCKET);
  const projectId = await getConfigValue("gcs_config", "projectId", process.env.GCS_PROJECT_ID);
  const clientEmail = process.env.GCS_CLIENT_EMAIL;
  let privateKey = process.env.GCS_PRIVATE_KEY;

  if (!bucket || !projectId || !clientEmail || !privateKey) {
    const missing = [
      !bucket && "GCS_BUCKET",
      !projectId && "GCS_PROJECT_ID",
      !clientEmail && "GCS_CLIENT_EMAIL",
      !privateKey && "GCS_PRIVATE_KEY",
    ].filter(Boolean);
    throw new Error(
      `[GCS] Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Convert literal \n to real newlines (common when env vars are set via
  // .env files or CI secret managers)
  privateKey = privateKey.replace(/\\n/g, "\n");

  return { bucket, projectId, clientEmail, privateKey };
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

/**
 * Base64url-encode a Buffer or string (no padding).
 */
function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64url");
}

/**
 * Create a signed JWT for the Google OAuth2 token endpoint.
 *
 * @see https://developers.google.com/identity/protocols/oauth2/service-account#authorizingrequests
 */
function createServiceAccountJWT(config: GCSConfig): string {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hour

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: config.clientEmail,
    scope: "https://www.googleapis.com/auth/devstorage.read_write",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: expiry,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  let signature: Buffer;
  try {
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(signingInput);
    signer.end();
    signature = signer.sign(config.privateKey);
  } catch (err) {
    throw new Error(
      `[GCS] Failed to sign JWT — check that GCS_PRIVATE_KEY is a valid PEM RSA private key. ` +
        `Original error: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const encodedSignature = base64url(signature);
  return `${signingInput}.${encodedSignature}`;
}

// ---------------------------------------------------------------------------
// OAuth2 token exchange
// ---------------------------------------------------------------------------

/**
 * Exchange a signed JWT for a Google OAuth2 access token.
 */
async function exchangeJWTForToken(jwt: string): Promise<CachedToken> {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  let response: Response;
  try {
    response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch (err) {
    throw new Error(
      `[GCS] Network error exchanging JWT for access token: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `[GCS] Token exchange failed (HTTP ${response.status}): ${text}`
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  if (!data.access_token) {
    throw new Error(
      `[GCS] Token exchange returned no access_token: ${JSON.stringify(data)}`
    );
  }

  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

/**
 * Get a valid access token, using the cache when possible.
 * Automatically refreshes when within 5 minutes of expiry.
 */
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS) {
    return cachedToken.accessToken;
  }

  const config = await getGCSConfig();
  const jwt = createServiceAccountJWT(config);
  cachedToken = await exchangeJWTForToken(jwt);
  return cachedToken.accessToken;
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Upload a buffer to Google Cloud Storage.
 *
 * Uses the GCS JSON API with `uploadType=media` (simple upload).
 * Objects are made publicly readable via `predefinedAcl=publicRead`.
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
  const config = await getGCSConfig();
  const token = await getAccessToken();

  const encodedPath = encodeURIComponent(path);
  const uploadUrl =
    `https://storage.googleapis.com/upload/storage/v1/b/${config.bucket}/o` +
    `?uploadType=media&name=${encodedPath}&predefinedAcl=publicRead`;

  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`,
        "Content-Length": String(buffer.length),
      },
      body: buffer as unknown as BodyInit,
    });
  } catch (err) {
    throw new Error(
      `[GCS] Network error uploading to gs://${config.bucket}/${path}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `[GCS] Upload failed (HTTP ${response.status}) for gs://${config.bucket}/${path}: ${text}`
    );
  }

  const result = (await response.json()) as { name: string; size: string };

  const publicUrl = `https://storage.googleapis.com/${config.bucket}/${path}`;

  return {
    url: publicUrl,
    gcsPath: `${config.bucket}/${result.name ?? path}`,
    contentType,
    size: buffer.length,
  };
}

// ---------------------------------------------------------------------------
// Convenience uploaders
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Signed / public URL
// ---------------------------------------------------------------------------

/**
 * Get a URL for accessing a GCS object.
 *
 * Since uploaded objects use `predefinedAcl=publicRead`, they are publicly
 * accessible. This function returns the public URL directly rather than
 * generating a V4 signed URL. The `expiresInMinutes` parameter is accepted
 * for interface compatibility but is effectively ignored — the public URL
 * does not expire.
 *
 * If you later need true signed URLs (e.g., for private objects), replace
 * this with V4 signed URL generation using the service account private key.
 *
 * @param path - GCS object path (e.g., "audio/video-123.mp3")
 * @param expiresInMinutes - Ignored for public objects (kept for API compat)
 * @returns Public URL string
 */
export async function getSignedUrl(
  path: string,
  expiresInMinutes = 60
): Promise<string> {
  // We still validate config to fail fast if env vars are missing
  const config = await getGCSConfig();

  // For public objects, the public URL is sufficient
  void expiresInMinutes; // acknowledged but unused for public objects

  return `https://storage.googleapis.com/${config.bucket}/${path}`;
}
