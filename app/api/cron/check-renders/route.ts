// Config migration: audited â no tweakable config in this route.
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
- Links section placeholder (ð Links mentioned in this video:)
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
    console.log(`[PIPELINE] Distribution step 1/6 â Generating YouTube metadata for ${docId}`);
    const metadata = await generateYouTubeMetadata(doc);

    // Step 2: Upload main video to YouTube
    let youtubeVideoId = '';
    if (doc.videoUrl) {
      console.log(`[PIPELINE] Distribution step 2/6 â Uploading main video for ${docId}`);
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
      console.log(`[PIPELINE] Distribution step 3/6 â Generating Shorts metadata + uploading for ${docId}`);
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
    console.log(`[PIPELINE] Distribution step 4/6 â Sending email for ${docId}`);
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
    console.log(`[PIPELINE] Distribution step 5/6 â Posting to X/Twitter for ${docId}`);
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
    console.log(`[PIPELINE] Distribution step 6/6 â Marking published for ${docId}`);
    await client.patch(docId).set({
      status: 'published',
      youtubeId: youtubeVideoId || undefined,
      youtubeShortId: youtubeShortId || undefined,
    }).commit();

    console.log(`[PIPELINE] â Distribution complete for ${docId}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[PIPELINE] â Distribution failed for ${docId}: ${msg}`);
    try {
      await client.patch(docId).set({
        status: 'flagged',
        flaggedReason: `Distribution error: ${msg}`,
      }).commit();
    }