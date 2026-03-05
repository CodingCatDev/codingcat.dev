// Config migration: audited — no tweakable config in this route.
// Remotion/ElevenLabs config is in the service layer (owned by @videopipe).
// YouTube SEO prompt is specific to this route, not the shared system instruction.
export const fetchCache = 'force-no-store';
export const maxDuration = 60;

import { type NextRequest } from 'next/server';
import { after } from 'next/server';
import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';
import { processVideoProduction } from '@/lib/services/video-pipeline';
import { checkBothRenders } from '@/lib/services/remotion';
import { uploadVideoToSanity } from '@/lib/services/sanity-upload';
import { generateWithGemini } from '@/lib/gemini';
import { uploadVideo, uploadShort, generateShortsMetadata } from '@/lib/youtube-upload';
import { notifySubscribers } from '@/lib/resend-notify';
import { postVideoAnnouncement } from '@/lib/x-social';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface ScriptReadyDoc {
  _id: string;
  title?: string;
}

interface VideoGenDoc {
  _id: string;
  title?: string;
}

interface StuckDoc {
  _id: string;
  title?: string;
  _updatedAt: string;
}

interface RenderProcessResult {
  id: string;
  title?: string;
  status: 'completed' | 'rendering' | 'error';
  mainProgress?: number;
  shortProgress?: number;
  error?: string;
}

interface AutomatedVideoDoc {
  _id: string;
  _type: 'automatedVideo';
  title: string;
  script: {
    hook: string;
    scenes: Array<{
      sceneNumber: number;
      narration: string;
      visualDescription: string;
      bRollKeywords: string[];
      durationEstimate: number;
    }>;
    cta: string;
  };
  status: string;
  videoUrl?: string;
  shortUrl?: string;
  audioUrl?: string;
  youtubeId?: string;
  youtubeShortId?: string;
  flaggedReason?: string;
}

interface YouTubeMetadata {
  title: string;
  description: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Sanity Write Client
// ---------------------------------------------------------------------------

function getSanityWriteClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error('[PIPELINE] Missing SANITY_API_TOKEN environment variable');
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

// ---------------------------------------------------------------------------
// YouTube Metadata Generation (via Gemini)
// ---------------------------------------------------------------------------

async function generateYouTubeMetadata(doc: AutomatedVideoDoc): Promise<YouTubeMetadata> {
  const scriptText = doc.script
    ? [doc.script.hook, ...(doc.script.scenes?.map((s) => s.narration) ?? []), doc.script.cta].filter(Boolean).join('\n\n')
    : '';

  const prompt = `You are a YouTube SEO expert for CodingCat.dev, a developer education channel.

Video Title: ${doc.title}
Script: ${scriptText}

Generate optimized YouTube metadata for a LONG-FORM video (not Shorts).

Return JSON:
{
  "title": "SEO-optimized title, max 100 chars, engaging but not clickbait",
  "description": "500-1000 chars with key points, timestamps placeholder, channel links, and hashtags",
  "tags": ["10-15 relevant tags for discoverability"]
}

Include in the description:
- Brief summary of what viewers will learn
- Key topics covered
- Links section placeholder (🔗 Links mentioned in this video:)
- Social links placeholder
- Relevant hashtags at the end`;

  const raw = await generateWithGemini(prompt);
  try {
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as YouTubeMetadata;
    return {
      title: parsed.title?.slice(0, 100) || doc.title,
      description: parsed.description || doc.title,
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 15) : [],
    };
  } catch {
    return { title: doc.title, description: doc.title, tags: [] };
  }
}

// ---------------------------------------------------------------------------
// Distribution Pipeline (extracted from sanity-distribute webhook)
// ---------------------------------------------------------------------------

async function processDistribution(docId: string): Promise<void> {
  const client = getSanityWriteClient();

  try {
    // Fetch full document
    const doc = await client.fetch<AutomatedVideoDoc | null>(
      `*[_type == "automatedVideo" && _id == $id][0]`,
      { id: docId }
    );
    if (!doc) throw new Error(`Document not found: ${docId}`);

    // Step 1: Generate YouTube metadata via Gemini
    console.log(`[PIPELINE] Distribution step 1/6 — Generating YouTube metadata for ${docId}`);
    const metadata = await generateYouTubeMetadata(doc);

    // Step 2: Upload main video to YouTube
    let youtubeVideoId = '';
    if (doc.videoUrl) {
      console.log(`[PIPELINE] Distribution step 2/6 — Uploading main video for ${docId}`);
      const r = await uploadVideo({
        videoUrl: doc.videoUrl,
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
      });
      youtubeVideoId = r.videoId;
    }

    // Step 3: Generate Shorts metadata + upload Short
    let youtubeShortId = '';
    if (doc.shortUrl) {
      console.log(`[PIPELINE] Distribution step 3/6 — Generating Shorts metadata + uploading for ${docId}`);
      const shortsMetadata = await generateShortsMetadata(generateWithGemini, doc);
      const r = await uploadShort({
        videoUrl: doc.shortUrl,
        title: shortsMetadata.title,
        description: shortsMetadata.description,
        tags: shortsMetadata.tags,
      });
      youtubeShortId = r.videoId;
    }

    // Step 4: Email (non-fatal)
    console.log(`[PIPELINE] Distribution step 4/6 — Sending email for ${docId}`);
    const ytUrl = youtubeVideoId
      ? `https://www.youtube.com/watch?v=${youtubeVideoId}`
      : doc.videoUrl || '';
    try {
      await notifySubscribers({
        subject: `New Video: ${metadata.title}`,
        videoTitle: metadata.title,
        videoUrl: ytUrl,
        description: metadata.description.slice(0, 280),
      });
    } catch (e) {
      console.warn('[PIPELINE] Email error:', e);
    }

    // Step 5: X/Twitter (non-fatal)
    console.log(`[PIPELINE] Distribution step 5/6 — Posting to X/Twitter for ${docId}`);
    try {
      await postVideoAnnouncement({
        videoTitle: metadata.title,
        youtubeUrl: ytUrl,
        tags: metadata.tags,
      });
    } catch (e) {
      console.warn('[PIPELINE] X/Twitter error:', e);
    }

    // Step 6: Mark published
    console.log(`[PIPELINE] Distribution step 6/6 — Marking published for ${docId}`);
    await client.patch(docId).set({
      status: 'published',
      youtubeId: youtubeVideoId || undefined,
      youtubeShortId: youtubeShortId || undefined,
    }).commit();

    console.log(`[PIPELINE] ✅ Distribution complete for ${docId}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[PIPELINE] ❌ Distribution failed for ${docId}: ${msg}`);
    try {
      await client.patch(docId).set({
        status: 'flagged',
        flaggedReason: `Distribution error: ${msg}`,
      }).commit();
    } catch { /* best-effort flag */ }
  }
}

// ---------------------------------------------------------------------------
// Handler 1: script_ready → audio_gen (claim) → video pipeline via after()
// ---------------------------------------------------------------------------

async function handleScriptReady(client: SanityClient): Promise<{ claimed: number; ids: string[] }> {
  const docs = await client.fetch<ScriptReadyDoc[]>(
    `*[_type == "automatedVideo" && status == "script_ready"]{ _id, title }`
  );

  if (docs.length === 0) return { claimed: 0, ids: [] };

  const claimedIds: string[] = [];

  for (const doc of docs) {
    console.log(`[PIPELINE] Claiming script_ready → audio_gen: "${doc.title || doc._id}"`);
    try {
      // CLAIM: immediately advance status so next cron run skips this doc
      await client.patch(doc._id).set({ status: 'audio_gen' }).commit();
      claimedIds.push(doc._id);

      // WORK: run video [REDACTED SECRET: NEXT_PUBLIC_SANITY_DATASET] in background via after()
      after(async () => {
        try {
          console.log(`[PIPELINE] Starting video [REDACTED SECRET: NEXT_PUBLIC_SANITY_DATASET] for ${doc._id}`);
          await processVideoProduction(doc._id);
          console.log(`[PIPELINE] ✅ Video [REDACTED SECRET: NEXT_PUBLIC_SANITY_DATASET] complete for ${doc._id}`);
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error(`[PIPELINE] ❌ Video [REDACTED SECRET: NEXT_PUBLIC_SANITY_DATASET] failed for ${doc._id}: ${msg}`);
          // processVideoProduction already sets flagged on error, but just in case:
          try {
            const c = getSanityWriteClient();
            await c.patch(doc._id).set({
              status: 'flagged',
              flaggedReason: `Video [REDACTED SECRET: NEXT_PUBLIC_SANITY_DATASET] error: ${msg}`,
            }).commit();
          } catch { /* best-effort */ }
        }
      });
    } catch (error) {
      console.error(`[PIPELINE] Failed to claim ${doc._id}:`, error);
    }
  }

  return { claimed: claimedIds.length, ids: claimedIds };
}

// ---------------------------------------------------------------------------
// Handler 2: rendering → check Lambda progress → video_gen
// ---------------------------------------------------------------------------

async function handleRendering(client: SanityClient): Promise<{
  completed: number;
  inProgress: number;
  errors: number;
  results: RenderProcessResult[];
}> {
  const docs = await client.fetch<RenderingDoc[]>(
    `*[_type == "automatedVideo" && status == "rendering" && defined(renderData)]{
      _id, title, renderData
    }`
  );

  if (docs.length === 0) return { completed: 0, inProgress: 0, errors: 0, results: [] };

  const results: RenderProcessResult[] = [];
  let completed = 0;
  let inProgress = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      console.log(`[PIPELINE] Checking renders for "${doc.title || doc._id}"...`);

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
        console.error(`[PIPELINE] Render error for ${doc._id}: ${errorMsg}`);

        await client.patch(doc._id).set({
          status: 'flagged',
          flaggedReason: `Remotion render failed: ${errorMsg}`,
        }).commit();

        errors++;
        results.push({ id: doc._id, title: doc.title, status: 'error', error: errorMsg });
        continue;
      }

      if (progress.allDone) {
        console.log(`[PIPELINE] Both renders done for "${doc.title || doc._id}", downloading...`);

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
          `[PIPELINE] Downloaded — main: ${mainVideoBuffer.length} bytes, short: ${shortVideoBuffer.length} bytes`
        );

        // Upload to Sanity
        const [mainUploadResult, shortUploadResult] = await Promise.all([
          uploadVideoToSanity(mainVideoBuffer, `${doc._id}-main.mp4`),
          uploadVideoToSanity(shortVideoBuffer, `${doc._id}-short.mp4`),
        ]);

        console.log(
          `[PIPELINE] Uploaded — main: ${mainUploadResult.url}, short: ${shortUploadResult.url}`
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

        console.log(`[PIPELINE] ✅ ${doc._id} → video_gen`);
        completed++;
        results.push({ id: doc._id, title: doc.title, status: 'completed' });
      } else {
        console.log(
          `[PIPELINE] Still rendering "${doc.title || doc._id}" — ` +
            `main: ${progress.main.progress}%, short: ${progress.short.progress}%`
        );
        inProgress++;
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
      console.error(`[PIPELINE] ❌ Error processing ${doc._id}: ${errorMessage}`);

      try {
        await client.patch(doc._id).set({
          status: 'flagged',
          flaggedReason: `check-renders error: ${errorMessage}`,
        }).commit();
      } catch (patchError) {
        console.error(`[PIPELINE] Failed to flag ${doc._id}:`, patchError);
      }

      errors++;
      results.push({ id: doc._id, title: doc.title, status: 'error', error: errorMessage });
    }
  }

  return { completed, inProgress, errors, results };
}

// ---------------------------------------------------------------------------
// Handler 3: video_gen → uploading (claim) → distribution via after()
// ---------------------------------------------------------------------------

async function handleVideoGen(client: SanityClient): Promise<{ claimed: number; ids: string[] }> {
  const docs = await client.fetch<VideoGenDoc[]>(
    `*[_type == "automatedVideo" && status == "video_gen"]{ _id, title }`
  );

  if (docs.length === 0) return { claimed: 0, ids: [] };

  const claimedIds: string[] = [];

  for (const doc of docs) {
    console.log(`[PIPELINE] Claiming video_gen → uploading: "${doc.title || doc._id}"`);
    try {
      // CLAIM: immediately advance status so next cron run skips this doc
      await client.patch(doc._id).set({ status: 'uploading' }).commit();
      claimedIds.push(doc._id);

      // WORK: run distribution in background via after()
      after(async () => {
        try {
          console.log(`[PIPELINE] Starting distribution for ${doc._id}`);
          await processDistribution(doc._id);
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error(`[PIPELINE] ❌ Distribution after() failed for ${doc._id}: ${msg}`);
        }
      });
    } catch (error) {
      console.error(`[PIPELINE] Failed to claim ${doc._id}:`, error);
    }
  }

  return { claimed: claimedIds.length, ids: claimedIds };
}

// ---------------------------------------------------------------------------
// Handler 4: Stuck detection
// ---------------------------------------------------------------------------

async function handleStuckDocs(client: SanityClient): Promise<{ audioGen: number; rendering: number }> {
  let audioGenFlagged = 0;
  let renderingFlagged = 0;

  // audio_gen stuck > 10 minutes
  const stuckAudioGen = await client.fetch<StuckDoc[]>(
    `*[_type == "automatedVideo" && status == "audio_gen" && dateTime(_updatedAt) < dateTime(now()) - 60*10]{
      _id, title, _updatedAt
    }`
  );

  for (const doc of stuckAudioGen) {
    console.log(`[PIPELINE] Flagging stuck audio_gen: "${doc.title || doc._id}" (since ${doc._updatedAt})`);
    try {
      await client.patch(doc._id).set({
        status: 'flagged',
        flaggedReason: `Pipeline timed out during audio generation. Stuck in audio_gen since ${doc._updatedAt}. Reset status to script_ready to retry.`,
      }).commit();
      audioGenFlagged++;
    } catch (err) {
      console.error(`[PIPELINE] Failed to flag stuck audio_gen doc ${doc._id}:`, err);
    }
  }

  // rendering stuck > 30 minutes
  const stuckRendering = await client.fetch<StuckDoc[]>(
    `*[_type == "automatedVideo" && status == "rendering" && dateTime(_updatedAt) < dateTime(now()) - 60*30]{
      _id, title, _updatedAt
    }`
  );

  for (const doc of stuckRendering) {
    console.log(`[PIPELINE] Flagging stuck rendering: "${doc.title || doc._id}" (since ${doc._updatedAt})`);
    try {
      await client.patch(doc._id).set({
        status: 'flagged',
        flaggedReason: `Render timed out. Stuck in rendering since ${doc._updatedAt}. Reset status to script_ready to retry.`,
      }).commit();
      renderingFlagged++;
    } catch (err) {
      console.error(`[PIPELINE] Failed to flag stuck rendering doc ${doc._id}:`, err);
    }
  }

  return { audioGen: audioGenFlagged, rendering: renderingFlagged };
}

// ---------------------------------------------------------------------------
// Route Handler — Unified Pipeline Cron
// ---------------------------------------------------------------------------

/**
 * Unified pipeline cron — the single driver for ALL status transitions.
 * Replaces the sanity-content and sanity-distribute webhooks.
 *
 * Runs every 1-2 minutes via Supabase cron. Uses "claim first, work second"
 * pattern to prevent duplicate processing on overlapping runs.
 *
 * Status transitions handled:
 *   script_ready → audio_gen (claim) → video pipeline via after()
 *   rendering → check Lambda → video_gen (or flagged)
 *   video_gen → uploading (claim) → distribution via after()
 *   audio_gen stuck >10min → flagged
 *   rendering stuck >30min → flagged
 */
export async function GET(request: NextRequest) {
  // Auth check
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[PIPELINE] CRON_SECRET not configured');
    return Response.json({ error: 'Server misconfigured' }, { status: 503 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error('[PIPELINE] Unauthorized cron request');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[PIPELINE] ⏰ Unified cron starting...');

  const client = getSanityWriteClient();

  // Run all handlers in parallel where safe
  // Note: script_ready and video_gen use after() so they return quickly
  const [scriptReady, rendering, videoGen, stuckFlagged] = await Promise.all([
    handleScriptReady(client),
    handleRendering(client),
    handleVideoGen(client),
    handleStuckDocs(client),
  ]);

  const summary = {
    scriptReady,
    rendering: {
      completed: rendering.completed,
      inProgress: rendering.inProgress,
      errors: rendering.errors,
      results: rendering.results,
    },
    videoGen,
    stuckFlagged,
    timestamp: new Date().toISOString(),
  };

  const totalActions =
    scriptReady.claimed +
    rendering.completed +
    rendering.errors +
    videoGen.claimed +
    stuckFlagged.audioGen +
    stuckFlagged.rendering;

  if (totalActions > 0) {
    console.log(`[PIPELINE] ⏰ Cron complete — ${totalActions} actions taken`, JSON.stringify(summary, null, 2));
  } else if (rendering.inProgress > 0) {
    console.log(`[PIPELINE] ⏰ Cron complete — ${rendering.inProgress} renders in progress`);
  } else {
    console.log('[PIPELINE] ⏰ Cron complete — nothing to do');
  }

  return Response.json(summary);
}
