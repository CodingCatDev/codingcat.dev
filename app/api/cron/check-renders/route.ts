export const fetchCache = 'force-no-store';

import { type NextRequest } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';
import { checkBothRenders } from '@/lib/services/remotion';
import { uploadVideoToSanity } from '@/lib/services/sanity-upload';

// --- Types ---

interface RenderingDoc {
  _id: string;
  title?: string;
  renderData: {
    mainRenderId: string;
    shortRenderId: string;
    bucketName: string;
    startedAt: string;
  };
}

interface ProcessResult {
  id: string;
  title?: string;
  status: 'completed' | 'rendering' | 'error';
  mainProgress?: number;
  shortProgress?: number;
  error?: string;
}

// --- Sanity Write Client ---

function getSanityWriteClient() {
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error('[CHECK-RENDERS] Missing SANITY_API_TOKEN environment variable');
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

// --- Route Handler ---

/**
 * Cron endpoint: Check Remotion Lambda render progress for all documents
 * in "rendering" status. When renders complete, download videos, upload
 * to Sanity, and advance status to "video_gen".
 *
 * Triggered hourly by Vercel cron, or manually via curl.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[CHECK-RENDERS] Unauthorized request');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[CHECK-RENDERS] Starting render progress check...');

  const client = getSanityWriteClient();

  // Find all docs in "rendering" status with render data
  const renderingDocs = await client.fetch<RenderingDoc[]>(
    `*[_type == "automatedVideo" && status == "rendering" && defined(renderData)]{
      _id, title, renderData
    }`
  );

  if (renderingDocs.length === 0) {
    console.log('[CHECK-RENDERS] No documents in "rendering" status');
    return Response.json({ processed: 0, results: [] });
  }

  console.log(`[CHECK-RENDERS] Found ${renderingDocs.length} document(s) to check`);

  const results: ProcessResult[] = [];

  for (const doc of renderingDocs) {
    try {
      console.log(`[CHECK-RENDERS] Checking renders for "${doc.title || doc._id}"...`);

      const progress = await checkBothRenders(
        doc.renderData.mainRenderId,
        doc.renderData.shortRenderId,
        doc.renderData.bucketName
      );

      // Check for render errors
      if (progress.main.errors || progress.short.errors) {
        const errorMsg = [progress.main.errors, progress.short.errors]
          .filter(Boolean)
          .join('; ');
        console.error(`[CHECK-RENDERS] Render error for ${doc._id}: ${errorMsg}`);

        await client.patch(doc._id).set({
          status: 'flagged',
          flaggedReason: `Remotion render failed: ${errorMsg}`,
        }).commit();

        results.push({ id: doc._id, title: doc.title, status: 'error', error: errorMsg });
        continue;
      }

      if (progress.allDone) {
        console.log(`[CHECK-RENDERS] Both renders done for "${doc.title || doc._id}", downloading...`);

        // Download rendered videos from Remotion S3
        const [mainVideoResponse, shortVideoResponse] = await Promise.all([
          fetch(progress.main.outputUrl!),
          fetch(progress.short.outputUrl!),
        ]);

        if (!mainVideoResponse.ok) {
          throw new Error(`Failed to download main video: ${mainVideoResponse.status}`);
        }
        if (!shortVideoResponse.ok) {
          throw new Error(`Failed to download short video: ${shortVideoResponse.status}`);
        }

        const [mainVideoBuffer, shortVideoBuffer] = await Promise.all([
          Buffer.from(await mainVideoResponse.arrayBuffer()),
          Buffer.from(await shortVideoResponse.arrayBuffer()),
        ]);

        console.log(
          `[CHECK-RENDERS] Downloaded — main: ${mainVideoBuffer.length} bytes, short: ${shortVideoBuffer.length} bytes`
        );

        // Upload to Sanity
        const [mainUploadResult, shortUploadResult] = await Promise.all([
          uploadVideoToSanity(mainVideoBuffer, `${doc._id}-main.mp4`),
          uploadVideoToSanity(shortVideoBuffer, `${doc._id}-short.mp4`),
        ]);

        console.log(
          `[CHECK-RENDERS] Uploaded — main: ${mainUploadResult.url}, short: ${shortUploadResult.url}`
        );

        // Update Sanity document with video URLs and advance to video_gen
        await client.patch(doc._id).set({
          status: 'video_gen',
          videoUrl: mainUploadResult.url,
          videoFile: {
            _type: 'file',
            asset: { _type: 'reference', _ref: mainUploadResult.assetId },
          },
          shortUrl: shortUploadResult.url,
          shortFile: {
            _type: 'file',
            asset: { _type: 'reference', _ref: shortUploadResult.assetId },
          },
        }).commit();

        console.log(`[CHECK-RENDERS] ✅ ${doc._id} → video_gen`);
        results.push({ id: doc._id, title: doc.title, status: 'completed' });
      } else {
        console.log(
          `[CHECK-RENDERS] Still rendering "${doc.title || doc._id}" — ` +
            `main: ${progress.main.progress}%, short: ${progress.short.progress}%`
        );
        results.push({
          id: doc._id,
          title: doc.title,
          status: 'rendering',
          mainProgress: progress.main.progress,
          shortProgress: progress.short.progress,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[CHECK-RENDERS] ❌ Error processing ${doc._id}: ${errorMessage}`);

      // Flag the document so it doesn't get stuck
      try {
        await client.patch(doc._id).set({
          status: 'flagged',
          flaggedReason: `check-renders error: ${errorMessage}`,
        }).commit();
      } catch (patchError) {
        console.error(`[CHECK-RENDERS] Failed to flag ${doc._id}:`, patchError);
      }

      results.push({ id: doc._id, title: doc.title, status: 'error', error: errorMessage });
    }
  }

  console.log(`[CHECK-RENDERS] Done. Processed ${results.length} document(s).`);
  return Response.json({ processed: results.length, results });
}
