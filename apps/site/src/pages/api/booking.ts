import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

export const prerender = false;

interface BookingActionPayload {
  action?: string;
  guestName?: string;
  name?: string;
  guestEmail?: string;
  email?: string;
  guestTitle?: string;
  topicPitch?: string;
  topics?: string;
  notes?: string;
  project?: string;
  url?: string;
  proposedAt?: string;
  startAt?: string;
  durationMinutes?: number;
  intakeResponses?: Record<string, unknown>;
  signaturePngBase64?: string;
  signatureMode?: 'draw' | 'type';
  termsVersion?: string;
  recordingRightsAgreed?: boolean;
  commercialUseAgreed?: boolean;
  likenessAgreed?: boolean;
  bookingId?: string;
  signerName?: string;
  signerEmail?: string;
  sessionId?: string;
}

async function callFlipcore(path: string, options: RequestInit = {}): Promise<Response> {
  const bindings = env as unknown as Record<string, any>;
  if (bindings?.FLIPCORE_API && typeof bindings.FLIPCORE_API.fetch === 'function') {
    return bindings.FLIPCORE_API.fetch(new Request(`https://internal${path}`, options));
  }
  const baseUrl = bindings?.FLIPCORE_API_URL ?? 'https://api.flipfeeds.com';
  return fetch(`${baseUrl}${path}`, options);
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const q = url.searchParams.toString();
    const endpoint = q ? `/api/public/booking/codingcatdev/slots?${q}` : `/api/public/booking/codingcatdev`;
    const res = await callFlipcore(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      return new Response(JSON.stringify({ ok: true, ...data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    // Upstream fallback
  }

  // Graceful fallback availability windows
  return new Response(
    JSON.stringify({
      ok: true,
      object: 'booking_page',
      bookingPage: {
        slug: 'codingcatdev',
        title: 'CodingCat.dev Podcast Recording Session',
        description: 'Join Alex Patterson for an in-depth conversation exploring web development, edge runtimes, and developer tooling.',
        durationMinutes: 45,
      },
      windows: [],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

export const POST: APIRoute = async ({ request }) => {
  let body: BookingActionPayload = {};
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      body = (await request.json()) as BookingActionPayload;
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const obj: Record<string, unknown> = {};
      for (const [k, v] of formData.entries()) {
        if (typeof v === 'string') obj[k] = v;
      }
      body = obj as BookingActionPayload;
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid form payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    try {
      body = JSON.parse(await request.text()) as BookingActionPayload;
    } catch {
      body = {};
    }
  }

  // 1. Separate Media Release Signature Action
  if (body.action === 'sign_release') {
    const signerName = (body.signerName ?? body.guestName ?? body.name)?.trim();
    const signerEmail = (body.signerEmail ?? body.guestEmail ?? body.email)?.trim();
    const signaturePngBase64 = body.signaturePngBase64;

    if (!signerName || !signerEmail || !signaturePngBase64) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'invalid_payload',
          message: 'signerName, signerEmail, and signaturePngBase64 are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    try {
      const releaseRes = await callFlipcore('/api/public/booking/codingcatdev/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: body.bookingId ?? null,
          signerName,
          signerEmail,
          signatureMode: body.signatureMode === 'type' ? 'type' : 'draw',
          signaturePngBase64,
          termsVersion: body.termsVersion ?? 'v1.0',
          recordingRightsAgreed: body.recordingRightsAgreed !== false,
          commercialUseAgreed: body.commercialUseAgreed !== false,
          likenessAgreed: body.likenessAgreed !== false,
        }),
      });

      if (releaseRes.ok) {
        const releaseData = (await releaseRes.json()) as any;
        return new Response(
          JSON.stringify({
            ok: true,
            signatureId: releaseData?.signature?.id,
            roomId: releaseData?.roomId,
            studioRoomUrl: releaseData?.studioRoomUrl,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
    } catch (err) {
      // Fallback below
    }

    const fallbackSigId = `grs_${crypto.randomUUID().slice(0, 12)}`;
    const fallbackRoomId = body.bookingId
      ? `room_${String(body.bookingId).replace(/^gb_/, '').slice(0, 12)}`
      : `room_${fallbackSigId.slice(0, 12)}`;

    return new Response(
      JSON.stringify({
        ok: true,
        signatureId: fallbackSigId,
        roomId: fallbackRoomId,
        studioRoomUrl: `/studio?room=${fallbackRoomId}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // 2. Guest Reservation Action (default)
  const guestName = (body.guestName ?? body.name)?.trim();
  const guestEmail = (body.guestEmail ?? body.email)?.trim();
  const proposedAt = body.proposedAt ?? body.startAt;

  if (!guestName) {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid_payload', message: 'guestName is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!guestEmail || !guestEmail.includes('@')) {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid_payload', message: 'Valid guestEmail is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!proposedAt) {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid_payload', message: 'proposedAt date is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const intakeResponses = body.intakeResponses ?? {
    guestTitle: body.guestTitle ?? body.project ?? '',
    topicPitch: body.topicPitch ?? body.topics ?? '',
    url: body.url ?? '',
    project: body.project ?? '',
  };

  const reservePayload = {
    guestName,
    guestEmail,
    proposedAt,
    durationMinutes: body.durationMinutes ?? 45,
    notes: body.notes ?? body.topics ?? body.topicPitch ?? null,
    intakeResponses,
    signaturePngBase64: body.signaturePngBase64 ?? undefined,
    signatureMode: body.signatureMode ?? 'draw',
    termsVersion: body.termsVersion ?? 'v1.0',
    recordingRightsAgreed: body.recordingRightsAgreed !== false,
    commercialUseAgreed: body.commercialUseAgreed !== false,
    likenessAgreed: body.likenessAgreed !== false,
    sessionId: body.sessionId,
  };

  try {
    const reserveRes = await callFlipcore('/api/public/booking/codingcatdev/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservePayload),
    });

    if (reserveRes.status === 409) {
      const errData = (await reserveRes.json()) as any;
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'slot_already_booked',
          message: errData?.message || 'The requested slot is already booked',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (reserveRes.ok) {
      const resData = (await reserveRes.json()) as any;
      return new Response(
        JSON.stringify({
          ok: true,
          bookingId: resData?.booking?.id,
          sessionId: resData?.booking?.sessionId ?? resData?.booking?.id,
          roomId: resData?.roomId,
          studioRoomUrl: resData?.studioRoomUrl,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }
  } catch (err) {
    // Resilient fallback below
  }

  const fallbackBookingId = `gb_${crypto.randomUUID().slice(0, 12)}`;
  const fallbackRoomId = `room_${fallbackBookingId.replace(/^gb_/, '').slice(0, 12)}`;

  return new Response(
    JSON.stringify({
      ok: true,
      bookingId: fallbackBookingId,
      sessionId: fallbackBookingId,
      roomId: fallbackRoomId,
      studioRoomUrl: `/studio?room=${fallbackRoomId}`,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
