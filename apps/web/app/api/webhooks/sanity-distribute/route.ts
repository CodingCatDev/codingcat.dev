import { NextResponse, after } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { writeClient } from "@/lib/sanity-write-client";
import { generateWithGemini } from "@/lib/gemini";
import { uploadVideo, uploadShort, generateShortsMetadata } from "@/lib/youtube-upload";
import { notifySubscribers } from "@/lib/resend-notify";
import { postVideoAnnouncement } from "@/lib/x-social";
import { getConfig } from "@/lib/config";

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
  distributionLog?: DistributionLogEntry[];
}

interface DistributionLogEntry {
  _key: string;
  step: string;
  status: "success" | "failed" | "skipped";
  error?: string;
  timestamp: string;
  result?: string;
}

interface YouTubeMetadata { title: string; description: string; tags: string[]; }

// ---------------------------------------------------------------------------
// Distribution log helpers
// ---------------------------------------------------------------------------

function logEntry(step: string, status: "success" | "failed" | "skipped", opts?: { error?: string; result?: string }): DistributionLogEntry {
  return {
    _key: `${step}-${Date.now()}`,
    step,
    status,
    error: opts?.error,
    timestamp: new Date().toISOString(),
    result: opts?.result,
  };
}

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
- Links section placeholder
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

async function appendDistributionLog(docId: string, entries: DistributionLogEntry[]): Promise<void> {
  const ops = entries.map((entry) => ({
    insert: { after: "distributionLog[-1]", items: [entry] },
  }));
  // Use setIfMissing to create the array if it doesn't exist, then append
  let patch = writeClient.patch(docId).setIfMissing({ distributionLog: [] });
  for (const entry of entries) {
    patch = patch.append("distributionLog", [entry]);
  }
  await patch.commit();
}

// ---------------------------------------------------------------------------
// Core distribution pipeline (runs inside after())
// ---------------------------------------------------------------------------

async function runDistribution(docId: string, doc: AutomatedVideoDoc): Promise<void> {
  const log: DistributionLogEntry[] = [];

  // Fetch distribution config from Sanity singleton
  const distConfig = await getConfig("distribution_config");

  try {
    await updateStatus(docId, "uploading");

    // Step 1: Generate long-form YouTube metadata via Gemini
    console.log("[sanity-distribute] Step 1/6 - Generating long-form metadata");
    let metadata: YouTubeMetadata;
    try {
      metadata = await generateYouTubeMetadata(doc);
      log.push(logEntry("gemini-metadata", "success"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[sanity-distribute] Gemini metadata failed:", msg);
      log.push(logEntry("gemini-metadata", "failed", { error: msg }));
      // Fallback metadata so we can still upload
      metadata = { title: doc.title, description: doc.title, tags: [] };
    }

    // Step 2: Upload main video to YouTube
    let youtubeVideoId = "";
    if (doc.videoUrl) {
      console.log("[sanity-distribute] Step 2/6 - Uploading main video");
      try {
        const r = await uploadVideo({ videoUrl: doc.videoUrl, title: metadata.title, description: metadata.description, tags: metadata.tags });
        youtubeVideoId = r.videoId;
        log.push(logEntry("youtube-upload", "success", { result: youtubeVideoId }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[sanity-distribute] YouTube upload failed:", msg);
        log.push(logEntry("youtube-upload", "failed", { error: msg }));
      }
    } else {
      log.push(logEntry("youtube-upload", "skipped", { error: "No videoUrl" }));
    }

    // Step 3: Generate Shorts-optimized metadata + upload Short
    let youtubeShortId = "";
    if (doc.shortUrl) {
      console.log("[sanity-distribute] Step 3/6 - Generating Shorts metadata + uploading");
      try {
        const shortsMetadata = await generateShortsMetadata(generateWithGemini, doc);
        const r = await uploadShort({
          videoUrl: doc.shortUrl,
          title: shortsMetadata.title,
          description: shortsMetadata.description,
          tags: shortsMetadata.tags,
        });
        youtubeShortId = r.videoId;
        log.push(logEntry("youtube-short", "success", { result: youtubeShortId }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[sanity-distribute] Short upload failed:", msg);
        log.push(logEntry("youtube-short", "failed", { error: msg }));
      }
    } else {
      log.push(logEntry("youtube-short", "skipped", { error: "No shortUrl" }));
    }

    // Step 4: Email notification (non-fatal) — uses distribution config
    console.log("[sanity-distribute] Step 4/6 - Sending email");
    const ytUrl = youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : doc.videoUrl || "";
    try {
      await notifySubscribers({
        subject: `New Video: ${metadata.title}`,
        videoTitle: metadata.title,
        videoUrl: ytUrl,
        description: metadata.description.slice(0, 280),
        fromEmail: distConfig.resendFromEmail,
        notificationEmails: distConfig.notificationEmails,
      });
      log.push(logEntry("email", "success"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[sanity-distribute] Email error:", msg);
      log.push(logEntry("email", "failed", { error: msg }));
    }

    // Step 5: Post to X/Twitter (non-fatal)
    console.log("[sanity-distribute] Step 5/6 - Posting to X/Twitter");
    try {
      const tweetResult = await postVideoAnnouncement({
        videoTitle: metadata.title,
        youtubeUrl: ytUrl,
        tags: metadata.tags,
      });
      if (tweetResult.success) {
        log.push(logEntry("x-twitter", "success", { result: tweetResult.tweetId }));
      } else {
        log.push(logEntry("x-twitter", "failed", { error: tweetResult.error }));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[sanity-distribute] X/Twitter error:", msg);
      log.push(logEntry("x-twitter", "failed", { error: msg }));
    }

    // Step 6: Mark published in Sanity + save distribution log
    console.log("[sanity-distribute] Step 6/6 - Marking published");
    await writeClient
      .patch(docId)
      .set({
        status: "published",
        youtubeId: youtubeVideoId || undefined,
        youtubeShortId: youtubeShortId || undefined,
      })
      .setIfMissing({ distributionLog: [] })
      .append("distributionLog", log)
      .commit();

    console.log(`[sanity-distribute] ✅ Distribution complete for ${docId}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[sanity-distribute] ❌ Failed ${docId}: ${msg}`);
    log.push(logEntry("pipeline", "failed", { error: msg }));

    try {
      await writeClient
        .patch(docId)
        .set({
          status: "flagged",
          flaggedReason: `Distribution error: ${msg}`,
        })
        .setIfMissing({ distributionLog: [] })
        .append("distributionLog", log)
        .commit();
    } catch {
      // Last resort — at least try to save the log
      console.error("[sanity-distribute] Failed to save error state");
    }
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

/**
 * Sanity webhook handler for the distribution pipeline.
 *
 * Listens for automatedVideo documents transitioning to "video_gen" status
 * and triggers YouTube upload, email notification, and social posting.
 *
 * Uses after() to return 200 immediately and run the heavy pipeline work
 * in the background — prevents Vercel from killing the function mid-upload.
 *
 * Configure in Sanity: Webhook → POST → filter: `_type == "automatedVideo"`
 * with projection: `{ _id, _type, status }`
 */
export async function POST(request: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      console.log("[sanity-distribute] Missing SANITY_WEBHOOK_SECRET environment variable");
      return NextResponse.json(
        { error: "Server misconfigured: missing webhook secret" },
        { status: 500 }
      );
    }

    // Read the raw body as text for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);

    if (!signature) {
      console.log("[sanity-distribute] Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify the webhook signature (same as sanity-content route)
    const isValid = await isValidSignature(rawBody, signature, WEBHOOK_SECRET);

    if (!isValid) {
      console.log("[sanity-distribute] Invalid signature received");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the verified body
    let webhookPayload: WebhookPayload;
    try {
      webhookPayload = JSON.parse(rawBody);
    } catch {
      console.log("[sanity-distribute] Failed to parse webhook body");
      return NextResponse.json(
        { skipped: true, reason: "Invalid JSON body" },
        { status: 200 }
      );
    }

    console.log(`[sanity-distribute] Received: type=${webhookPayload._type}, id=${webhookPayload._id}, status=${webhookPayload.status}`);

    if (webhookPayload._type !== "automatedVideo") {
      return NextResponse.json(
        { skipped: true, reason: `Not automatedVideo` },
        { status: 200 }
      );
    }

    if (webhookPayload.status !== "video_gen") {
      return NextResponse.json(
        { skipped: true, reason: `Status "${webhookPayload.status}" is not "video_gen"` },
        { status: 200 }
      );
    }

    const docId = webhookPayload._id;

    // Fetch the full document from Sanity (webhook only sends minimal projection)
    const doc = await writeClient.fetch<AutomatedVideoDoc | null>(
      `*[_id == $id][0]`,
      { id: docId }
    );

    if (!doc) {
      console.error(`[sanity-distribute] Document ${docId} not found`);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Re-check status from the actual document (race condition guard)
    if (doc.status !== "video_gen") {
      return NextResponse.json(
        { skipped: true, reason: `Document status is "${doc.status}", not "video_gen"` },
        { status: 200 }
      );
    }
    if (doc.flaggedReason) {
      return NextResponse.json(
        { skipped: true, reason: "Flagged" },
        { status: 200 }
      );
    }

    // Use after() to run the distribution pipeline after the response is sent.
    // On Vercel, serverless functions terminate after the response — fire-and-forget
    // (promise.catch() without await) silently dies. after() keeps the function alive.
    console.log(`[sanity-distribute] Triggering distribution for: ${docId}`);
    after(async () => {
      try {
        await runDistribution(docId, doc);
      } catch (error) {
        console.error(`[sanity-distribute] Background processing error for ${docId}:`, error);
      }
    });

    return NextResponse.json({ triggered: true, docId }, { status: 200 });
  } catch (error) {
    console.log("[sanity-distribute] Unexpected error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
