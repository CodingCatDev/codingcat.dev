/**
 * Video Production Pipeline Orchestrator
 *
 * Orchestrates the full automated video production flow:
 *   script_ready → audio_gen (ElevenLabs TTS) → video_gen (Remotion Lambda)
 *
 * On failure at any step, sets status to "flagged" with reason.
 *
 * @module lib/services/video-pipeline
 */

import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';
import { generateSpeechFromScript } from '@/lib/services/elevenlabs';
import { uploadAudioToSanity } from '@/lib/services/sanity-upload';
import { getBRollForScenes } from '@/lib/services/pexels';
import { startBothRenders } from '@/lib/services/remotion';

// --- Types (matching @content's automatedVideo schema) ---

interface VideoScene {
  sceneNumber: number;
  narration: string;
  visualDescription?: string;
  bRollKeywords?: string[];
  durationEstimate?: number;
}

interface VideoScript {
  hook: string;
  scenes: VideoScene[];
  cta: string;
}

interface AutomatedVideoDocument {
  _id: string;
  _type: 'automatedVideo';
  title?: string;
  status: string;
  script?: VideoScript;
  sponsorSlot?: { _ref: string };
  audioUrl?: string;
  videoUrl?: string;
  shortUrl?: string;
  flaggedReason?: string;
}

interface SponsorLeadDocument {
  _id: string;
  companyName: string;
  contactName?: string;
}

// --- Sanity Write Client ---

function getSanityWriteClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error('[VIDEO-PIPELINE] Missing SANITY_API_TOKEN environment variable');
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

// --- Status Update Helper ---

async function updateStatus(
  client: SanityClient,
  documentId: string,
  patch: Record<string, unknown>
): Promise<void> {
  await client.patch(documentId).set(patch).commit();
}

// --- Main Pipeline ---

/**
 * Process a video production pipeline for an automatedVideo document.
 *
 * Steps:
 * 1. Fetch document from Sanity
 * 2. Validate script structure
 * 3. Generate TTS audio (ElevenLabs)
 * 4. Upload audio to Sanity
 * 5. Fetch B-roll clips (Pexels)
 * 6. Render both video formats (Remotion Lambda)
 * 7. Upload videos to Sanity
 * 8. Update Sanity with video URLs and status
 *
 * On failure: sets status to "flagged" with flaggedReason.
 *
 * @param documentId - The Sanity document ID of the automatedVideo
 */
export async function processVideoProduction(documentId: string): Promise<void> {
  const client = getSanityWriteClient();

  try {
    // Step 1: Fetch the automatedVideo document
    console.log(`[VIDEO-PIPELINE] Fetching document: ${documentId}`);
    const doc = await client.fetch<AutomatedVideoDocument | null>(
      `*[_type == "automatedVideo" && _id == $id][0]`,
      { id: documentId }
    );

    if (!doc) {
      throw new Error(`Document not found: ${documentId}`);
    }
    console.log(`[VIDEO-PIPELINE] Document fetched: ${doc._id}, status: ${doc.status}, title: "${doc.title || 'untitled'}"`);

    // Step 2: Validate script
    console.log(`[VIDEO-PIPELINE] Validating script for document: ${documentId}`);
    if (!doc.script?.hook || !doc.script?.scenes?.length || !doc.script?.cta) {
      throw new Error(
        'Document script is incomplete: missing hook, scenes, or cta'
      );
    }
    const script = doc.script;
    console.log(
      `[VIDEO-PIPELINE] Script validated: ${script.scenes.length} scenes, hook="${script.hook.substring(0, 50)}..."`
    );

    // Step 3: Update status to audio_gen
    console.log(`[VIDEO-PIPELINE] Updating status to "audio_gen"`);
    await updateStatus(client, documentId, { status: 'audio_gen' });

    // Step 4: Generate speech with ElevenLabs
    console.log(`[VIDEO-PIPELINE] Generating TTS audio...`);
    const audioBuffer = await generateSpeechFromScript({
      hook: script.hook,
      scenes: script.scenes,
      cta: script.cta,
    });
    console.log(`[VIDEO-PIPELINE] TTS audio generated: ${audioBuffer.length} bytes`);

    // Step 5: Upload audio to Sanity
    console.log(`[VIDEO-PIPELINE] Uploading audio to Sanity...`);
    const audioResult = await uploadAudioToSanity(audioBuffer, `${documentId}.mp3`);
    const audioUrl = audioResult.url;
    console.log(`[VIDEO-PIPELINE] Audio uploaded: ${audioUrl} (${audioResult.size} bytes)`);

    // Step 6: Update Sanity doc with audioUrl and file reference
    await updateStatus(client, documentId, {
      audioUrl,
      audioFile: {
        _type: 'file',
        asset: { _type: 'reference', _ref: audioResult.assetId },
      },
    });

    // Step 7: Fetch B-roll for scenes
    console.log(`[VIDEO-PIPELINE] Fetching B-roll for ${script.scenes.length} scenes...`);
    const bRollMap = await getBRollForScenes(
      script.scenes.map((s) => ({ bRollKeywords: s.bRollKeywords })),
      'landscape'
    );
    console.log(`[VIDEO-PIPELINE] B-roll fetched: ${bRollMap.size} clips found`);

    // Convert Map<number, BRollClip> to Record<number, string>
    const bRollUrls: Record<number, string> = {};
    bRollMap.forEach((clip, sceneIndex) => {
      bRollUrls[sceneIndex] = clip.videoUrl;
    });

    // Step 8: Calculate audio duration from scene estimates (or estimate from buffer)
    const estimatedDurationFromScenes = script.scenes.reduce(
      (sum, s) => sum + (s.durationEstimate || 15),
      0
    );
    // Add ~5s for hook and ~5s for CTA
    const audioDurationSeconds = estimatedDurationFromScenes + 10;
    console.log(`[VIDEO-PIPELINE] Estimated audio duration: ${audioDurationSeconds}s`);

    // Step 9: Fetch sponsor data if sponsorSlot is set
    let sponsor: { name: string; logoUrl?: string; message?: string } | undefined;
    if (doc.sponsorSlot?._ref) {
      console.log(`[VIDEO-PIPELINE] Fetching sponsor data: ${doc.sponsorSlot._ref}`);
      const sponsorDoc = await client.fetch<SponsorLeadDocument | null>(
        `*[_type == "sponsorLead" && _id == $id][0]`,
        { id: doc.sponsorSlot._ref }
      );
      if (sponsorDoc) {
        sponsor = { name: sponsorDoc.companyName };
        console.log(`[VIDEO-PIPELINE] Sponsor: ${sponsorDoc.companyName}`);
      }
    }

    // Step 10: Start Remotion renders for both formats (no polling — returns immediately)
    console.log(`[VIDEO-PIPELINE] Starting Remotion renders (main + short)...`);
    const renderResults = await startBothRenders({
      audioUrl,
      script: {
        hook: script.hook,
        scenes: script.scenes,
        cta: script.cta,
      },
      bRollUrls,
      sponsor,
      audioDurationSeconds,
    });
    console.log(
      `[VIDEO-PIPELINE] Renders started — mainRenderId: ${renderResults.mainRenderId}, shortRenderId: ${renderResults.shortRenderId}`
    );

    // Step 11: Store render IDs and set status to "rendering"
    // The check-renders cron will poll for completion, download, upload, and set video_gen.
    console.log(`[VIDEO-PIPELINE] Storing render IDs and setting status to "rendering"`);
    await updateStatus(client, documentId, {
      status: 'rendering',
      renderData: {
        mainRenderId: renderResults.mainRenderId,
        shortRenderId: renderResults.shortRenderId,
        bucketName: renderResults.bucketName,
        startedAt: new Date().toISOString(),
      },
    });

    console.log(`[VIDEO-PIPELINE] ✅ Pipeline phase 1 complete for document: ${documentId} (renders started, awaiting cron pickup)`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.log(
      `[VIDEO-PIPELINE] ❌ Pipeline failed for document: ${documentId} — ${errorMessage}`
    );

    try {
      await updateStatus(client, documentId, {
        status: 'flagged',
        flaggedReason: errorMessage,
      });
      console.log(`[VIDEO-PIPELINE] Status set to "flagged" for document: ${documentId}`);
    } catch (patchError) {
      console.log(
        `[VIDEO-PIPELINE] Failed to update status to "flagged" for document: ${documentId}:`,
        patchError
      );
    }
  }
}
