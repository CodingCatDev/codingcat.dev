import { type NextRequest, NextResponse } from "next/server";
import * as crypto from "node:crypto";
import { writeClient } from "@/lib/sanity-write-client";
import { generateWithGemini } from "@/lib/gemini";
import { uploadVideo, uploadShort } from "@/lib/youtube-upload";
import { notifySubscribers } from "@/lib/resend-notify";

function isValidSignature(body: string, signature: string | null): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[sanity-distribute] SANITY_WEBHOOK_SECRET not set");
    return true;
  }
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const digest = hmac.digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
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

async function generateYouTubeMetadata(doc: AutomatedVideoDoc): Promise<YouTubeMetadata> {
  const scriptText = doc.script
    ? [doc.script.hook, ...(doc.script.scenes?.map((s) => s.narration) ?? []), doc.script.cta].filter(Boolean).join("\n\n")
    : "";
  const prompt = `You are a YouTube SEO expert for CodingCat.dev, a developer education channel.\n\nVideo Title: ${doc.title}\nScript: ${scriptText}\n\nReturn JSON: {"title": "SEO title max 100 chars", "description": "500-1000 chars", "tags": ["10-15 tags"]}`;
  const raw = await generateWithGemini(prompt);
  try {
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim()) as YouTubeMetadata;
    return { title: parsed.title?.slice(0, 100) || doc.title, description: parsed.description || doc.title, tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 15) : [] };
  } catch {
    return { title: doc.title, description: doc.title, tags: [] };
  }
}

async function updateStatus(docId: string, status: string, extra: Record<string, unknown> = {}): Promise<void> {
  await writeClient.patch(docId).set({ status, ...extra }).commit();
  console.log(`[sanity-distribute] ${docId} -> ${status}`);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get("sanity-webhook-signature");
  if (!isValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: AutomatedVideoDoc;
  try { payload = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (payload._type !== "automatedVideo") return NextResponse.json({ skipped: true, reason: "Not automatedVideo" });
  if (payload.status !== "video_gen") return NextResponse.json({ skipped: true, reason: `Status "${payload.status}" != "video_gen"` });
  if (payload.flaggedReason) return NextResponse.json({ skipped: true, reason: "Flagged" });

  const docId = payload._id;
  console.log(`[sanity-distribute] Processing ${docId}: "${payload.title}"`);

  try {
    await updateStatus(docId, "uploading");

    // Step 1: Gemini metadata
    const metadata = await generateYouTubeMetadata(payload);

    // Step 2: Upload main video
    let youtubeVideoId = "";
    if (payload.videoUrl) {
      const r = await uploadVideo({ videoUrl: payload.videoUrl, title: metadata.title, description: metadata.description, tags: metadata.tags });
      youtubeVideoId = r.videoId;
    }

    // Step 3: Upload short
    let youtubeShortId = "";
    if (payload.shortUrl) {
      const r = await uploadShort({ videoUrl: payload.shortUrl, title: metadata.title, description: metadata.description, tags: metadata.tags });
      youtubeShortId = r.videoId;
    }

    // Step 4: Email (non-fatal)
    const ytUrl = youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : payload.videoUrl || "";
    try {
      await notifySubscribers({ subject: `New Video: ${metadata.title}`, videoTitle: metadata.title, videoUrl: ytUrl, description: metadata.description.slice(0, 280) });
    } catch (e) { console.warn("[sanity-distribute] Email error:", e); }

    // Step 5: Mark published
    await updateStatus(docId, "published", { youtubeId: youtubeVideoId || undefined, youtubeShortId: youtubeShortId || undefined });

    return NextResponse.json({ success: true, docId, youtubeId: youtubeVideoId, youtubeShortId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[sanity-distribute] Failed ${docId}: ${msg}`);
    try { await updateStatus(docId, "flagged", { flaggedReason: `Distribution error: ${msg}` }); } catch {}
    return NextResponse.json({ error: "Distribution failed", details: msg }, { status: 500 });
  }
}
