import { NextResponse, after } from 'next/server';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { processVideoProduction } from '@/lib/services/video-pipeline';

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

interface SanityWebhookBody {
  _id: string;
  _type: string;
  status?: string;
}

/**
 * Sanity webhook handler for the video production pipeline.
 *
 * Listens for automatedVideo documents transitioning to "script_ready" status
 * and triggers the video production pipeline in the background.
 *
 * Configure in Sanity: Webhook → POST → filter: `_type == "automatedVideo"`
 * with projection: `{ _id, _type, status }`
 */
export async function POST(request: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      console.log('[WEBHOOK] Missing SANITY_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Server misconfigured: missing webhook secret' },
        { status: 500 }
      );
    }

    // Read the raw body as text for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);

    if (!signature) {
      console.log('[WEBHOOK] Missing signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify the webhook signature
    const isValid = await isValidSignature(rawBody, signature, WEBHOOK_SECRET);

    if (!isValid) {
      console.log('[WEBHOOK] Invalid signature received');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the verified body
    let body: SanityWebhookBody;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.log('[WEBHOOK] Failed to parse webhook body');
      return NextResponse.json(
        { skipped: true, reason: 'Invalid JSON body' },
        { status: 200 }
      );
    }

    console.log(`[WEBHOOK] Received document: type=${body._type}, id=${body._id}, status=${body.status}`);

    if (body._type !== 'automatedVideo') {
      console.log(`[WEBHOOK] Skipping: document type is "${body._type}", not "automatedVideo"`);
      return NextResponse.json(
        { skipped: true, reason: `Document type "${body._type}" is not "automatedVideo"` },
        { status: 200 }
      );
    }

    if (body.status !== 'script_ready') {
      console.log(`[WEBHOOK] Skipping: status is "${body.status}", not "script_ready"`);
      return NextResponse.json(
        { skipped: true, reason: `Status "${body.status}" is not "script_ready"` },
        { status: 200 }
      );
    }

    // Use after() to run the pipeline after the response is sent.
    // On Vercel, serverless functions terminate after the response — fire-and-forget
    // (promise.catch() without await) silently dies. after() keeps the function alive.
    console.log(`[WEBHOOK] Triggering video production for document: ${body._id}`);
    after(async () => {
      try {
        await processVideoProduction(body._id);
      } catch (error) {
        console.error(`[WEBHOOK] Background processing error for ${body._id}:`, error);
      }
    });

    return NextResponse.json({ triggered: true }, { status: 200 });
  } catch (error) {
    console.log('[WEBHOOK] Unexpected error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
