import { type NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { writeClient } from "@/lib/sanity-write-client";
import { generateWithGemini } from "@/lib/gemini";
import { uploadVideo, uploadShort, generateShortsMetadata } from "@/lib/youtube-upload";
import { notifySubscribers } from "@/lib/resend-notify";
import { postVideoAnnouncement } from "@/lib/x-social";

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebhookPayload {
  _id: string;
  _type: string;
  status?: string;
}

interface AutomatedVideoDoc {
  _id: string;
  _type: "automatedVideo";
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
  status: "draft" | "script_ready" | "audio_gen" | "video_gen" | "flagged" | "uploading" | "published";
  videoUrl?: string;
  shortUrl?: string;
  audioUrl?: string;
  youtubeId?: string;
  youtubeShortId?: string;
  flaggedReason?: string;
  scheduledPublishAt?: string;
}

interface YouTubeMetadata { title: string; description: string; tags: string[]; }

// ---------------------------------------------------------------------------
// Gemini metadata generation for long-form videos
// ---------------------------------------------------------------------------

async function generateYouTubeMetadata(doc: AutomatedVideoDoc): Promise<YouTubeMetadata> {
  const scriptText = doc.script
    ? [doc.script.hook, ...(doc.script.scenes?.map((s) => s.narration) ?? []), doc.script.cta].filter(Boolean).join("\n\n")
    : "";

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
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim()) as YouTubeMetadata;
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
// Sanity helpers
// ---------------------------------------------------------------------------

async function updateStatus(docId: string, status: string, extra: Record<string, unknown> = {}): Promise<void> {
  await writeClient.patch(docId).set({ status, ...extra }).commit();
  console.log(`[sanity-distribute] ${docId} -> ${status}`);
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  if (!WEBHOOK_SECRET) {
    console.error("[sanity-distribute] Missing SANITY_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!signature || !(await isValidSignature(rawBody, signature, WEBHOOK_SECRET))) {
    console.log("[sanity-distribute] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let webhookPayload: WebhookPayload;
  try { webhookPayload = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (webhookPayload._type !== "automatedVideo") return NextResponse.json({ skipped: true, reason: "Not automatedVideo" });
  if (webhookPayload.status !== "video_gen") return NextResponse.json({ skipped: true, reason: `Status "${webhookPayload.status}" != "video_gen"` });

  const docId = webhookPayload._id;

  // Fetch the full document from Sanity
  const doc = await writeClient.fetch<AutomatedVideoDoc | null>(
    `*[_id == $id][0]`,
    { id: docId }
  );

  if (!doc) {
    console.error(`[sanity-distribute] Document ${docId} not found`);
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (doc.status !== "video_gen") {
    return NextResponse.json({ skipped: true, reason: `Document status is "${doc.status}", not "video_gen"` });
  }
  if (doc.flaggedReason) {
    return NextResponse.json({ skipped: true, reason: "Flagged" });
  }

  console.log(`[sanity-distribute] Processing ${docId}: "${doc.title}"`);

  try {
    await updateStatus(docId, "uploading");

    // Step 1: Generate long-form YouTube metadata via Gemini
    console.log("[sanity-distribute] Step 1/6 - Generating long-form metadata");
    const metadata = await generateYouTubeMetadata(doc);

    // Step 2: Upload main video to YouTube
    let youtubeVideoId = "";
    if (doc.videoUrl) {
      console.log("[sanity-distribute] Step 2/6 - Uploading main video");
      const r = await uploadVideo({ videoUrl: doc.videoUrl, title: metadata.title, description: metadata.description, tags: metadata.tags });
      youtubeVideoId = r.videoId;
    }

    // Step 3: Generate Shorts-optimized metadata + upload Short
    let youtubeShortId = "";
    if (doc.shortUrl) {
      console.log("[sanity-distribute] Step 3/6 - Generating Shorts metadata + uploading");
      const shortsMetadata = await generateShortsMetadata(generateWithGemini, doc);
      const r = await uploadShort({
        videoUrl: doc.shortUrl,
        title: shortsMetadata.title,
        description: shortsMetadata.description,
        tags: shortsMetadata.tags,
      });
      youtubeShortId = r.videoId;
    }

    // Step 4: Email notification (non-fatal)
    console.log("[sanity-distribute] Step 4/6 - Sending email");
    const ytUrl = youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : doc.videoUrl || "";
    try {
      await notifySubscribers({
        subject: `New Video: ${metadata.title}`,
        videoTitle: metadata.title,
        videoUrl: ytUrl,
        description: metadata.description.slice(0, 280),
      });
    } catch (e) { console.warn("[sanity-distribute] Email error:", e); }

    // Step 5: Post to X/Twitter (non-fatal)
    console.log("[sanity-distribute] Step 5/6 - Posting to X/Twitter");
    try {
      const tweetResult = await postVideoAnnouncement({
        videoTitle: metadata.title,
        youtubeUrl: ytUrl,
        tags: metadata.tags,
      });
      if (!tweetResult.success) {
        console.warn(`[sanity-distribute] Tweet failed: ${tweetResult.error}`);
      }
    } catch (e) { console.warn("[sanity-distribute] X/Twitter error:", e); }

    // Step 6: Mark published in Sanity
    console.log("[sanity-distribute] Step 6/6 - Marking published");
    await updateStatus(docId, "published", {
      youtubeId: youtubeVideoId || undefined,
      youtubeShortId: youtubeShortId || undefined,
    });

    console.log(`[sanity-distribute] ✅ Distribution complete for ${docId}`);
    return NextResponse.json({ success: true, docId, youtubeId: youtubeVideoId, youtubeShortId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[sanity-distribute] ❌ Failed ${docId}: ${msg}`);
    try { await updateStatus(docId, "flagged", { flaggedReason: `Distribution error: ${msg}` }); } catch {}
    return NextResponse.json({ error: "Distribution failed", details: msg }, { status: 500 });
  }
}
