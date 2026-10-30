import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
import {
	approveGoogleCalendarRecordingEvent,
	cancelGoogleCalendarBookingEvent,
	createGoogleCalendarBookingEvent,
	STREAMYARD_STUDIO_URL,
} from "@/lib/google-calendar";
import { getSanityServerClient } from "@/lib/sanity/write-client";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Content-Type": "application/json",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

interface ManageBookingPayload {
	action?:
		| "approve_recording"
		| "cancel_booking"
		| "request_pre_meeting"
		| "schedule_pre_meeting"
		| "bypass_pre_meeting"
		| "reconcile_calendar_holds"
		| "migrate_private_ids";
	bookingId?: string;
	eventId?: string;
	guestName?: string;
	guestEmail?: string;
	company?: string;
	track?: string;
	slotStartAt?: string;
	preMeetingSlotStartAt?: string;
	topics?: string;
	portalToken?: string;
	docs?: Array<Record<string, any>>;
	patches?: Array<{ id: string; set: Record<string, any> }>;
}

export const POST: APIRoute = async ({ request, url }) => {
	let body: ManageBookingPayload = {};
	try {
		body = (await request.json()) as ManageBookingPayload;
	} catch {
		return new Response(
			JSON.stringify({ ok: false, message: "Invalid JSON body" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const { client, canWrite } = getSanityServerClient();

	if (body.action === "migrate_private_ids") {
		if (!canWrite) {
			return new Response(
				JSON.stringify({ ok: false, message: "Sanity write token unavailable" }),
				{ status: 500, headers: CORS_HEADERS },
			);
		}
		const publicDocs = await client.fetch<Array<Record<string, any>>>(
			`*[_type in ["booking", "sponsorLead", "sponsorPool"] && !(_id in path("private.**")) && !(_id in path("drafts.**"))]`,
		);
		const migratedIds: string[] = [];
		const deletedIds: string[] = [];
		for (const d of publicDocs || []) {
			const oldId = String(d._id || "");
			if (!oldId || oldId.startsWith("private.")) continue;
			const newId = `private.${oldId}`;
			const { _rev, ...rest } = d;
			await client.createOrReplace({
				...rest,
				_id: newId,
			} as any);
			migratedIds.push(newId);
			try {
				await client.delete(oldId);
				deletedIds.push(oldId);
			} catch {
				// Ignore if referenced
			}
		}
		return new Response(
			JSON.stringify({
				ok: true,
				migratedCount: migratedIds.length,
				deletedCount: deletedIds.length,
				migratedIds,
				deletedIds,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	if (body.action === "reconcile_calendar_holds") {
		if (!canWrite) {
			return new Response(
				JSON.stringify({ ok: false, message: "Sanity write token unavailable" }),
				{ status: 500, headers: CORS_HEADERS },
			);
		}
		let patched = 0;
		let created = 0;
		for (const doc of body.docs || []) {
			if (doc._id && doc._type === "booking") {
				const normalizedId = String(doc._id).startsWith("private.")
					? String(doc._id)
					: `private.${doc._id}`;
				await client.createOrReplace({
					...doc,
					_id: normalizedId,
				} as any);
				created++;
			}
		}
		for (const p of body.patches || []) {
			if (p.id && p.set) {
				const targetIds = [
					p.id,
					p.id.startsWith("private.") ? p.id.replace(/^private\./, "") : `private.${p.id}`,
				];
				for (const tid of targetIds) {
					try {
						await client.patch(tid).set(p.set).commit();
						patched++;
					} catch {
						// Ignore if doc does not exist in target dataset
					}
				}
			}
		}
		return new Response(
			JSON.stringify({ ok: true, created, patched }),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	const rawBookingId = body.bookingId?.trim();
	if (!rawBookingId || !body.action) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "bookingId and action are required",
			}),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const strippedId = rawBookingId.replace(/^private\./, "");
	const privateId = `private.${strippedId}`;
	let doc: Record<string, any> | null = null;
	try {
		doc = await client.fetch(
			`*[_type == "booking" && _id in [$privateId, $strippedId]][0]`,
			{ privateId, strippedId },
		);
	} catch {
		// Fallback to payload fields
	}
	const bookingId = doc?._id || privateId;

	const guestName = body.guestName || doc?.guestName || "Podcast Guest";
	const guestEmail = body.guestEmail || doc?.guestEmail || "";
	const company = body.company || doc?.company || guestName;
	const track = body.track || doc?.track || "editorial";
	const slotStartAt =
		body.slotStartAt ||
		doc?.slotStartAt ||
		new Date(Date.now() + 7 * 86400_000).toISOString();
	const topics = body.topics || doc?.topics || "CodingCat.dev Podcast Session";
	const portalToken =
		body.portalToken ||
		doc?.portalToken ||
		`spt_${bookingId.replace(/^(private\.)?booking-/, "").slice(0, 12)}`;
	const googleCalendarEventId = body.eventId || doc?.googleCalendarEventId;

	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fallbackOrigin = url?.origin ?? new URL(request.url).origin;
	const siteUrl = (workerEnv.SITE_URL || fallbackOrigin).replace(/\/$/, "");
	const portalUrl = `${siteUrl}/portal/${portalToken}?company=${encodeURIComponent(company)}&name=${encodeURIComponent(guestName)}&email=${encodeURIComponent(guestEmail)}`;

	if (body.action === "approve_recording") {
		const approved = await approveGoogleCalendarRecordingEvent({
			eventId: googleCalendarEventId,
			guestName,
			guestEmail,
			company,
			track,
			startAt: slotStartAt,
			durationMinutes: 60,
			topics,
			portalUrl,
		});

		const patchFields: Record<string, unknown> = {
			status: "approved",
			recordingUrl: STREAMYARD_STUDIO_URL,
			portalToken,
			...(approved.eventId ? { googleCalendarEventId: approved.eventId } : {}),
			...(approved.htmlLink
				? { appointmentScheduleUrl: approved.htmlLink }
				: {}),
		};

		if (canWrite) {
			try {
				await client.patch(bookingId).set(patchFields).commit();
			} catch {
				// Non-fatal
			}
		}

		if (guestEmail) {
			await sendCodingCatEmail({
				to: guestEmail,
				subject: `Approved: CodingCat.dev Podcast Recording & Studio Link (${company})`,
				text: [
					`Hi ${guestName},`,
					"",
					`Your CodingCat.dev Podcast recording session is approved and confirmed on Google Calendar!`,
					"",
					`Scheduled Time: ${new Date(slotStartAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: "America/New_York" })} ET`,
					`StreamYard Recording Studio: ${STREAMYARD_STUDIO_URL}`,
					`Deal Room & Asset Vault (Drop logos, slides, or talking points): ${portalUrl}#vault`,
					"",
					"Looking forward to recording with you!",
					"Alex Patterson",
					"Founder, CodingCat.dev",
				].join("\n"),
			});
		}

		return new Response(
			JSON.stringify({
				ok: true,
				action: "approve_recording",
				bookingId,
				status: "approved",
				recordingUrl: STREAMYARD_STUDIO_URL,
				googleCalendarEventId: approved.eventId || googleCalendarEventId,
				appointmentScheduleUrl: approved.htmlLink || doc?.appointmentScheduleUrl,
				portalToken,
				portalUrl,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	if (
		body.action === "request_pre_meeting" ||
		body.action === "schedule_pre_meeting"
	) {
		const preSlot = body.preMeetingSlotStartAt || doc?.preMeetingSlotStartAt;
		let meetUrl: string | undefined = doc?.preMeetingMeetUrl;
		let preEventId: string | undefined = doc?.preMeetingGoogleEventId;

		if (preSlot) {
			const cal = await createGoogleCalendarBookingEvent({
				guestName,
				guestEmail,
				company,
				track: "sponsor-kickoff",
				startAt: preSlot,
				durationMinutes: 15,
				topics: `15-Minute Google Meet Pre-Meeting: ${topics}`,
				portalUrl,
				isPreMeeting: true,
			});
			meetUrl = cal.meetUrl;
			preEventId = cal.eventId;
		}

		const nextPreStatus = preSlot ? "scheduled" : "requested";
		const preMeetingBookUrl = `${siteUrl}/book?track=sponsor-kickoff&preMeetingFor=${encodeURIComponent(bookingId)}&portalToken=${encodeURIComponent(portalToken)}&company=${encodeURIComponent(company)}&name=${encodeURIComponent(guestName)}&email=${encodeURIComponent(guestEmail)}`;

		if (canWrite) {
			try {
				await client
					.patch(bookingId)
					.set({
						preMeetingStatus: nextPreStatus,
						portalToken,
						...(preSlot ? { preMeetingSlotStartAt: preSlot } : {}),
						...(meetUrl ? { preMeetingMeetUrl: meetUrl } : {}),
						...(preEventId ? { preMeetingGoogleEventId: preEventId } : {}),
					})
					.commit();
			} catch {
				// Non-fatal
			}
		}

		if (guestEmail) {
			await sendCodingCatEmail({
				to: guestEmail,
				subject: preSlot
					? `Google Meet Pre-Call Confirmed: ${company} × CodingCat.dev`
					: `Quick 15-Min Google Meet Pre-Call for CodingCat.dev (${company})`,
				text: preSlot
					? [
							`Hi ${guestName},`,
							"",
							`Your 15-minute Google Meet pre-call with Alex Patterson is scheduled for ${new Date(preSlot).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: "America/New_York" })} ET.`,
							...(meetUrl ? [`Google Meet Link: ${meetUrl}`] : []),
							`Asset Vault & Deal Room: ${portalUrl}#vault`,
							"",
							"Talk soon,",
							"Alex Patterson",
						].join("\n")
					: [
							`Hi ${guestName},`,
							"",
							"Before we lock in the final StreamYard recording script, let's jump on a quick 15-minute Google Meet pre-call to align on talking points and flow.",
							"",
							`Pick a 15-minute Google Meet slot here: ${preMeetingBookUrl}`,
							`Drop any slides, logos, or briefs in your Asset Vault: ${portalUrl}#vault`,
							"",
							"Talk soon,",
							"Alex Patterson",
						].join("\n"),
			});
		}

		return new Response(
			JSON.stringify({
				ok: true,
				action: body.action,
				bookingId,
				preMeetingStatus: nextPreStatus,
				preMeetingSlotStartAt: preSlot,
				preMeetingMeetUrl: meetUrl,
				preMeetingBookUrl,
				portalToken,
				portalUrl,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	if (body.action === "bypass_pre_meeting") {
		if (canWrite) {
			try {
				await client
					.patch(bookingId)
					.set({ preMeetingStatus: "bypassed" })
					.commit();
			} catch {
				// Non-fatal
			}
		}
		return new Response(
			JSON.stringify({
				ok: true,
				action: "bypass_pre_meeting",
				bookingId,
				preMeetingStatus: "bypassed",
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	if (body.action === "cancel_booking") {
		await cancelGoogleCalendarBookingEvent({
			eventId: googleCalendarEventId,
			startAt: slotStartAt,
			durationMinutes: 60,
			guestName,
		});
		if (canWrite) {
			try {
				await client
					.patch(bookingId)
					.set({ status: "cancelled" })
					.commit();
			} catch {
				// Non-fatal
			}
		}
		return new Response(
			JSON.stringify({
				ok: true,
				action: "cancel_booking",
				bookingId,
				status: "cancelled",
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	}

	return new Response(
		JSON.stringify({ ok: false, message: "Unsupported action" }),
		{ status: 400, headers: CORS_HEADERS },
	);
};
