/**
 * Upload files to Sanity as assets.
 * Replaces GCS for audio and video storage.
 */
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';

interface UploadResult {
  /** Public URL of the uploaded asset */
  url: string;
  /** Sanity asset ID */
  assetId: string;
  /** File size in bytes */
  size: number;
}

function getSanityClient() {
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error('[SANITY-UPLOAD] Missing SANITY_API_TOKEN');
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

/**
 * Upload an audio file (MP3) to Sanity.
 */
export async function uploadAudioToSanity(
  buffer: Buffer,
  filename: string
): Promise<UploadResult> {
  const client = getSanityClient();
  console.log(`[SANITY-UPLOAD] Uploading audio: ${filename} (${buffer.length} bytes)`);
  
  const asset = await client.assets.upload('file', buffer, {
    filename,
    contentType: 'audio/mpeg',
  });
  
  const url = asset.url;
  console.log(`[SANITY-UPLOAD] Audio uploaded: ${url}`);
  
  return {
    url,
    assetId: asset._id,
    size: buffer.length,
  };
}

/**
 * Upload a video file (MP4) to Sanity.
 */
export async function uploadVideoToSanity(
  buffer: Buffer,
  filename: string
): Promise<UploadResult> {
  const client = getSanityClient();
  console.log(`[SANITY-UPLOAD] Uploading video: ${filename} (${buffer.length} bytes)`);
  
  const asset = await client.assets.upload('file', buffer, {
    filename,
    contentType: 'video/mp4',
  });
  
  const url = asset.url;
  console.log(`[SANITY-UPLOAD] Video uploaded: ${url}`);
  
  return {
    url,
    assetId: asset._id,
    size: buffer.length,
  };
}
