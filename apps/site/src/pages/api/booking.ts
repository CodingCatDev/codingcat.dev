import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
import {
	createGoogleCalendarBookingEvent,
	STREAMYARD_STUDIO_URL,
} from "@/lib/google-calendar";
import {
	getSanityServerClient,
	resolveSponsorTier,
} from "@/lib/sanity/write-client";
import {
	createStripeMilestoneCheckout,
	createStripeMilestoneInvoice,
} from "@/lib/stripe";

interface BookingPayload {
	guestName?: string;
	guestEmail?: string;
	company?: string;
	socialUrl?: string;
	track?: "editorial" | "sponsored" | "full-stack-launch" | "sponsor-kickoff";
	sessionType?:
		| "recording-45m"
		| "pre-meeting-15m"
		| "recording-with-pre-meeting";
	slotStartAt?: string;
	preMeetingSlotStartAt?: string;
	requestPreMeeting?: boolean;
	preMeetingForBookingId?: string;
	durationMinutes?: number;
	topics?: string;
	portalToken?: string;
	bookingSource?: "direct" | "passionfroot";
	signatureMode?: "draw" | "type";
	signatureData?: string;
	consentRecording?: boolean;
	consentCommercial?: boolean;
	consentLikeness?: boolean;
}

export const POST: APIRoute = async ({ request, url }) => {
	let data: BookingPayload = {};
	try {
		data = (await request.json()) as BookingPayload;
	} catch {
		return new Response(
			JSON.stringify({ success: false, message: "Invalid JSON payload" }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const guestName = data.guestName?.trim();
	const guestEmail = data.guestEmail?.trim();
	const company = data.company?.trim() || guestName || "Podcast Guest";
	const socialUrl = data.socialUrl?.trim();
	const track = data.track || "editorial";
	const isKickoff =
		track === "sponsor-kickoff" || data.sessionType === "pre-meeting-15m";
	const isSponsored =
		track === "sponsored" || track === "full-stack-launch" || isKickoff;
	const durationMinutes = data.durationMinutes === 15 || isKickoff ? 15 : 45;
	const slotStartAt =
		data.slotStartAt || new Date(Date.now() + 7 * 86400_000).toISOString();
	const preMeetingSlotStartAt = data.preMeetingSlotStartAt?.trim() || undefined;
	const wantsPreMeeting =
		Boolean(data.requestPreMeeting) ||
		Boolean(preMeetingSlotStartAt) ||
		data.sessionType === "recording-with-pre-meeting";
	const sessionType = isKickoff
		? "pre-meeting-15m"
		: wantsPreMeeting
			? "recording-with-pre-meeting"
			: "recording-45m";
	const bookingSource =
		data.bookingSource === "passionfroot" ? "passionfroot" : "direct";
	const topics =
		data.topics?.trim() ||
		(isKickoff ? `15-Minute Google Meet Pre-Meeting (${company})` : "");
	const signatureMode = data.signatureMode || "type";
	const signatureData = data.signatureData || guestName;

	if (!guestName || !guestEmail || !guestEmail.includes("@") || !topics) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Guest name, valid email, and talking points are required.",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const bookingId =
		data.preMeetingForBookingId?.trim() ||
		`booking-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
	const existingToken = data.portalToken?.trim();
	const portalToken =
		existingToken && existingToken.length > 0
			? existingToken
			: `spt_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fallbackOrigin = url?.origin ?? new URL(request.url).origin;
	const siteUrl = (workerEnv.SITE_URL || fallbackOrigin).replace(/\/$/, "");

	const { client, canWrite } = getSanityServerClient();
	const queryFallback = new URLSearchParams({
		company,
		name: guestName,
		email: guestEmail,
		tier:
			track === "full-stack-launch"
				? "full-stack-launch"
				: isSponsored
					? "podcast-showcase"
					: "editorial",
		bookedSlot: slotStartAt,
	});
	const portalUrl = `${siteUrl}/portal/${portalToken}?${queryFallback.toString()}`;
	let stripeDepositCheckoutUrl: string | undefined;
	let stripeDepositInvoiceUrl: string | undefined;

	if (isSponsored) {
		const tier = resolveSponsorTier(
			track === "full-stack-launch" ? "full-stack-launch" : "podcast-showcase",
		);
		const leadId = `sponsorLead-${portalToken}`;

		if (!existingToken && bookingSource !== "passionfroot") {
			try {
				const [checkout, invoice] = await Promise.all([
					createStripeMilestoneCheckout({
						leadId,
						portalToken,
						companyName: company,
						contactEmail: guestEmail,
						packageName: tier.name,
						milestone: "deposit",
						amountCents: tier.depositAmountCents,
						siteUrl,
					}),
					createStripeMilestoneInvoice({
						leadId,
						portalToken,
						companyName: company,
						contactEmail: guestEmail,
						packageName: tier.name,
						milestone: "deposit",
						amountCents: tier.depositAmountCents,
						siteUrl,
						daysUntilDue: 15,
					}),
				]);
				stripeDepositCheckoutUrl = checkout?.checkoutUrl;
				stripeDepositInvoiceUrl = invoice?.hostedInvoiceUrl;
			} catch {
				// Stripe optional in dev
			}
		}

		if (canWrite) {
			try {
				if (existingToken) {
					await client
						.patch(leadId)
						.set({
							status: "booked",
							lastEmailAt: new Date().toISOString(),
						})
						.commit();
				} else {
					await client.createOrReplace({
						_id: leadId,
						_type: "sponsorLead",
						companyName: company,
						contactName: guestName,
						contactEmail: guestEmail,
						...(socialUrl ? { website: socialUrl } : {}),
						portalToken,
						source: bookingSource === "passionfroot" ? "passionfroot" : "booking",
						billingProvider:
							bookingSource === "passionfroot" ? "passionfroot" : "stripe",
						status: "booked",
						rateCard: tier.id,
						totalAmountCents: tier.totalAmountCents,
						depositAmountCents: tier.depositAmountCents,
						balanceAmountCents: tier.balanceAmountCents,
						...(stripeDepositCheckoutUrl ? { stripeDepositCheckoutUrl } : {}),
						...(stripeDepositInvoiceUrl ? { stripeDepositInvoiceUrl } : {}),
						intent: topics,
						deliverables: tier.deliverables.map((d, idx) => ({
							_key: `deliv-${idx}`,
							title: d.title,
							channel: d.channel,
							status: "pending",
						})),
						lastEmailAt: new Date().toISOString(),
					});
				}
			} catch {
				// Non-fatal
			}
		}
	}

	// Create live Google Calendar event:
	// - 15m Pre-Meetings get a confirmed Google Meet invite immediately.
	// - 45m Recording slots create an OPAQUE (Busy) placeholder hold on Alex's calendars
	//   so nothing can jump them; StreamYard (https://streamyard.com/c4kv26is93) is revealed once approved.
	const calendarEvent = await createGoogleCalendarBookingEvent({
		guestName,
		guestEmail,
		company,
		track,
		startAt: slotStartAt,
		durationMinutes,
		topics,
		portalUrl,
		isPreMeeting: isKickoff,
		autoApproveRecording: false,
	});

	if (calendarEvent.conflictDetected) {
		return new Response(
			JSON.stringify({
				success: false,
				conflictDetected: true,
				message:
					"That time slot was just taken on Alex's calendar. Please select another available window.",
			}),
			{ status: 409, headers: { "Content-Type": "application/json" } },
		);
	}

	// Optional secondary 15m Google Meet pre-meeting when booked alongside a 45m recording hold
	let preMeetingEvent:
		| Awaited<ReturnType<typeof createGoogleCalendarBookingEvent>>
		| undefined;
	if (!isKickoff && preMeetingSlotStartAt) {
		preMeetingEvent = await createGoogleCalendarBookingEvent({
			guestName,
			guestEmail,
			company,
			track: "sponsor-kickoff",
			startAt: preMeetingSlotStartAt,
			durationMinutes: 15,
			topics: `15-Minute Google Meet Pre-Meeting for ${company}: ${topics}`,
			portalUrl,
			isPreMeeting: true,
		});
	}

	const appointmentScheduleUrl =
		calendarEvent.htmlLink || calendarEvent.addToCalendarUrl;
	const preMeetingStatus = isKickoff
		? "scheduled"
		: preMeetingSlotStartAt
			? "scheduled"
			: wantsPreMeeting
				? "requested"
				: "not_needed";
	const preMeetingMeetUrl = isKickoff
		? calendarEvent.meetUrl
		: preMeetingEvent?.meetUrl;
	const preMeetingGoogleEventId = isKickoff
		? calendarEvent.eventId
		: preMeetingEvent?.eventId;

	if (canWrite) {
		try {
			if (data.preMeetingForBookingId && isKickoff) {
				await client
					.patch(data.preMeetingForBookingId)
					.set({
						preMeetingStatus: "scheduled",
						preMeetingSlotStartAt: slotStartAt,
						...(calendarEvent.eventId
							? { preMeetingGoogleEventId: calendarEvent.eventId }
							: {}),
						...(calendarEvent.meetUrl
							? { preMeetingMeetUrl: calendarEvent.meetUrl }
							: {}),
					})
					.commit();
			} else {
				await client.createOrReplace({
					_id: bookingId,
					_type: "booking",
					bookingSource,
					sessionType,
					guestName,
					guestEmail,
					company,
					...(socialUrl ? { socialUrl } : {}),
					track,
					status: isKickoff ? "scheduled" : "pending",
					slotStartAt,
					recordingUrl: STREAMYARD_STUDIO_URL,
					preMeetingStatus,
					...(isKickoff
						? { preMeetingSlotStartAt: slotStartAt }
						: preMeetingSlotStartAt
							? { preMeetingSlotStartAt }
							: {}),
					...(preMeetingGoogleEventId ? { preMeetingGoogleEventId } : {}),
					...(preMeetingMeetUrl ? { preMeetingMeetUrl } : {}),
					topics,
					appointmentScheduleUrl,
					...(calendarEvent.eventId
						? { googleCalendarEventId: calendarEvent.eventId }
						: {}),
					signatureMode,
					signatureData,
					signedAt: new Date().toISOString(),
					consentRecording: data.consentRecording ?? true,
					consentCommercial: data.consentCommercial ?? true,
					consentLikeness: data.consentLikeness ?? true,
					portalToken,
				});
			}
		} catch {
			// Non-fatal
		}
	}

	const subjectLabel = isKickoff
		? "15m Google Meet Pre-Meeting"
		: isSponsored
			? "Fast-Track Sponsored Booking Hold"
			: "Editorial Booking Hold";

	const calendarStatusLabel = isKickoff
		? `15m Google Meet invite sent (${preMeetingMeetUrl || "Google Calendar Meet link"})`
		: "Opaque Busy hold created on Alex's Google Calendar (Approve in Ops App to send StreamYard https://streamyard.com/c4kv26is93)";

	await sendCodingCatEmail({
		to: "alex.patterson@gmail.com",
		subject: `[CodingCat.dev ${subjectLabel}] ${guestName} (${company})`,
		text: [
			`New CodingCat.dev ${subjectLabel}`,
			`Source: ${bookingSource.toUpperCase()} · Session: ${sessionType}`,
			`Track: ${track} (${durationMinutes} min)`,
			`Guest / Contact: ${guestName} <${guestEmail}>`,
			`Company: ${company}`,
			`Scheduled Slot: ${slotStartAt}`,
			...(preMeetingSlotStartAt
				? [`15m Pre-Meeting Slot (Google Meet): ${preMeetingSlotStartAt} (${preMeetingMeetUrl || "Meet attached"})`]
				: wantsPreMeeting
					? ["15m Pre-Meeting: Requested by guest"]
					: []),
			`Calendar Status: ${calendarStatusLabel}`,
			`Topics: ${topics}`,
			`Google Calendar Event: ${appointmentScheduleUrl}`,
			`Deal Room & Sanity Media Vault: ${portalUrl}#vault`,
		].join("\n"),
	});

	return new Response(
		JSON.stringify({
			success: true,
			bookingId,
			bookingSource,
			sessionType,
			track,
			durationMinutes,
			slotStartAt,
			preMeetingSlotStartAt,
			preMeetingStatus,
			preMeetingMeetUrl,
			recordingUrl: isKickoff ? undefined : STREAMYARD_STUDIO_URL,
			recordingApproved: false,
			isSponsored,
			calendarMode: calendarEvent.calendarMode,
			calendarEventId: calendarEvent.eventId,
			calendarEventUrl: calendarEvent.htmlLink,
			addToCalendarUrl: calendarEvent.addToCalendarUrl,
			appointmentScheduleUrl,
			portalToken,
			portalUrl,
			vaultUrl: `${portalUrl}#vault`,
			stripeDepositCheckoutUrl,
			stripeDepositInvoiceUrl,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};
