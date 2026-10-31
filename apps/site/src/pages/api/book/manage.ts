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
		| "request_recording_slot"
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
		const rotatedTokens: Array<{ id: string; legacyToken: string; newToken: string }> = [];
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

		// Rotate predictable human-readable portalToken values and seed Marie Lo Gerard's Run-of-Show
		const privatePortalDocs = await client.fetch<Array<Record<string, any>>>(
			`*[_type in ["booking", "sponsorLead"] && _id in path("private.**")]`,
		);
		for (const doc of privatePortalDocs || []) {
			const token = String(doc.portalToken || "").trim();
			const isPredictable =
				token.length > 0 &&
				!token.startsWith("spt_") &&
				!/^.+_[0-9a-f]{12}$/.test(token);
			const patchFields: Record<string, any> = {};

			if (isPredictable) {
				const hashBuf = await crypto.subtle.digest(
					"SHA-256",
					new TextEncoder().encode(`codingcat-portal-token:${doc._id}:${token}`),
				);
				const suffix = Array.from(new Uint8Array(hashBuf))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("")
					.slice(0, 12);
				const newToken = `${token}_${suffix}`;
				patchFields.portalToken = newToken;
				patchFields.legacyPortalToken = doc.legacyPortalToken || token;
				rotatedTokens.push({ id: doc._id, legacyToken: token, newToken });
			}

			if (
				doc._id === "private.booking-edaa31db78dc4c21" &&
				!doc.runOfShowNotes
			) {
				patchFields.preCallNotes = [
					"• Pre-Call Completed (Fri Oct 30, 2026) with Marie Lo Gerard (Lastware: bref-ui)",
					"• Primary Angle: Why UI component ergonomics and serverless/modern full-stack developer workflows need bref-ui",
					"• Screen-Share Prep: 1080p browser + editor zoomed to 135% for live component walkthrough",
					"• StreamYard Studio: Headphones on, mic & camera verified",
				].join("\n");
				patchFields.guestQuestions = [
					"• What was the exact frustration at Lastware that led you to build bref-ui?",
					"• How does bref-ui compare against existing component primitives in production?",
					"• Live Demo: Building & customizing a real workflow with bref-ui",
					"• What is next on the Lastware / bref-ui roadmap and where can developers try it?",
				].join("\n");
				patchFields.runOfShowNotes = [
					"00:00 - 03:00 | 1. Cold Open & Origin Story",
					"  • Welcome Marie Lo Gerard (Lastware: bref-ui) to CodingCat.dev",
					"  • The 30-second hook: What is bref-ui and what problem does it solve?",
					"",
					"03:00 - 12:00 | 2. The Architecture Mental Model",
					"  • Why traditional UI kits get in the way vs. how bref-ui structures components",
					"  • Design tokens, accessibility, and developer experience trade-offs",
					"",
					"12:00 - 28:00 | 3. Show Me the Code (Live Screen-Share Walkthrough)",
					"  • Live walkthrough of bref-ui in action",
					"  • Composing real views, state handling, and styling patterns",
					"",
					"28:00 - 38:00 | 4. Production Trade-Offs & Sharp Edges",
					"  • Lessons learned building Lastware and bref-ui",
					"  • Performance, bundle size, and AI-assisted UI generation",
					"",
					"38:00 - 45:00 | 5. Verdict, Roadmap & Where to Try It",
					"  • Upcoming releases and community links",
				].join("\n");
				patchFields.runOfShowUpdatedAt = new Date().toISOString();
				patchFields.runOfShowUpdatedBy = "Alex Patterson";
			}

			if (Object.keys(patchFields).length > 0) {
				await client.patch(doc._id).set(patchFields).commit();
			}
		}

		return new Response(
			JSON.stringify({
				ok: true,
				migratedCount: migratedIds.length,
				deletedCount: deletedIds.length,
				migratedIds,
				deletedIds,
				rotatedTokens,
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
	const portalUrl = `${siteUrl}/portal/${portalToken}`;

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

	if (body.action === "request_recording_slot") {
		const recordingBookUrl = `${siteUrl}/book?portalToken=${encodeURIComponent(portalToken)}&bookingId=${encodeURIComponent(bookingId)}`;

		if (canWrite) {
			try {
				await client
					.patch(bookingId)
					.set({
						preMeetingStatus: "completed",
						portalToken,
					})
					.commit();
			} catch {
				// Non-fatal
			}
		}

		if (guestEmail) {
			const subject = `Schedule Your CodingCat.dev Podcast Recording + Shared Run-of-Show (${company})`;
			const text = [
				`Hi ${guestName},`,
				"",
				"Great chatting during our pre-call! Everything is pre-filled and your E-SIGN release is already on file, so you can pick your 60-minute StreamYard recording slot in one click:",
				"",
				`1. Pick Your Recording Time Slot: ${recordingBookUrl}`,
				`2. Shared Run-of-Show & Asset Vault: ${portalUrl}#run-of-show`,
				"",
				"On your Studio Portal link above, you can also review or edit our 5-part Run-of-Show outline and drop any repo links, demo URLs, or logos into the Vault.",
				"",
				"Looking forward to recording with you!",
				"Alex Patterson",
				"Founder, CodingCat.dev",
			].join("\n");

			const html = `
				<div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background: #0B1326; color: #F8FAFC; border-radius: 16px; border: 2px solid #7C3AED;">
					<div style="font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #C084FC; font-weight: 700; margin-bottom: 8px;">
						CodingCat.dev Studio &middot; Next Step After Pre-Call
					</div>
					<h1 style="font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #FFFFFF;">
						Pick Your Podcast Recording Slot
					</h1>
					<p style="font-size: 14px; line-height: 1.6; color: #CBD5E1; margin: 0 0 20px;">
						Hi ${guestName}, great chatting during our pre-call! Your guest details and E-SIGN release are already on file. Click below to pick your 60-minute StreamYard recording window:
					</p>
					<div style="margin-bottom: 16px;">
						<a href="${recordingBookUrl}" style="display: inline-block; background: #7C3AED; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 22px; border-radius: 10px;">
							1. Pick Your 60-Min Recording Slot &rarr;
						</a>
					</div>
					<div style="margin-bottom: 20px;">
						<a href="${portalUrl}#run-of-show" style="display: inline-block; background: #131B2E; color: #C084FC; border: 1px solid #7C3AED; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 10px;">
							2. Review / Edit Shared Run-of-Show &amp; Asset Vault &rarr;
						</a>
					</div>
					<p style="font-size: 12px; color: #94A3B8; line-height: 1.5; margin: 0;">
						Once you pick a slot, I will lock it in on Google Calendar with the StreamYard studio link.
					</p>
				</div>
			`;

			await sendCodingCatEmail({
				to: guestEmail,
				subject,
				text,
				html,
			});
		}

		return new Response(
			JSON.stringify({
				ok: true,
				action: "request_recording_slot",
				bookingId,
				preMeetingStatus: "completed",
				recordingBookUrl,
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
