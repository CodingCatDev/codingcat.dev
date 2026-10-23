import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
import { createGoogleCalendarBookingEvent } from "@/lib/google-calendar";
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
	slotStartAt?: string;
	durationMinutes?: number;
	topics?: string;
	portalToken?: string;
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
	const isKickoff = track === "sponsor-kickoff";
	const isSponsored =
		track === "sponsored" || track === "full-stack-launch" || isKickoff;
	const durationMinutes = data.durationMinutes === 15 || isKickoff ? 15 : 45;
	const slotStartAt =
		data.slotStartAt || new Date(Date.now() + 7 * 86400_000).toISOString();
	const topics =
		data.topics?.trim() ||
		(isKickoff ? `15-Minute Sponsor Kickoff Call (${company})` : "");
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

	const bookingId = `booking-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
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
	let portalUrl: string | undefined;
	let stripeDepositCheckoutUrl: string | undefined;
	let stripeDepositInvoiceUrl: string | undefined;

	if (isSponsored) {
		const tier = resolveSponsorTier(
			track === "full-stack-launch" ? "full-stack-launch" : "podcast-showcase",
		);
		const leadId = `sponsorLead-${portalToken}`;

		const queryFallback = new URLSearchParams({
			company,
			name: guestName,
			email: guestEmail,
			tier: tier.id,
			bookedSlot: slotStartAt,
		});
		portalUrl = `${siteUrl}/portal/${portalToken}?${queryFallback.toString()}`;

		if (!existingToken) {
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
						source: "booking",
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

	// Create live Google Calendar event (Confirmed Invite for Sponsored, Tentative Hold for Editorial)
	const calendarEvent = await createGoogleCalendarBookingEvent({
		guestName,
		guestEmail,
		company,
		track,
		startAt: slotStartAt,
		durationMinutes,
		topics,
		portalUrl,
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

	const appointmentScheduleUrl =
		calendarEvent.htmlLink || calendarEvent.addToCalendarUrl;

	if (canWrite) {
		try {
			await client.createOrReplace({
				_id: bookingId,
				_type: "booking",
				guestName,
				guestEmail,
				company,
				...(socialUrl ? { socialUrl } : {}),
				track: isKickoff ? "sponsored" : track,
				status: isSponsored ? "confirmed" : "pending",
				slotStartAt,
				topics,
				appointmentScheduleUrl,
				signatureMode,
				signatureData,
				signedAt: new Date().toISOString(),
				consentRecording: data.consentRecording ?? true,
				consentCommercial: data.consentCommercial ?? true,
				consentLikeness: data.consentLikeness ?? true,
				...(isSponsored ? { portalToken } : {}),
			});
		} catch {
			// Non-fatal
		}
	}

	const subjectLabel = isKickoff
		? "Sponsor Kickoff Call"
		: isSponsored
			? "Fast-Track Sponsored Booking"
			: "Editorial Booking Hold";

	const calendarStatusLabel =
		calendarEvent.calendarMode === "confirmed_invite"
			? "Confirmed Google Calendar invite sent to guest & Alex"
			: calendarEvent.calendarMode === "tentative_hold"
				? "Tentative hold created on Alex's Google Calendar (pending editorial approval)"
				: "Add-to-Calendar link generated";

	await sendCodingCatEmail({
		to: "alex.patterson@gmail.com",
		subject: `[CodingCat.dev ${subjectLabel}] ${guestName} (${company})`,
		text: [
			`New CodingCat.dev ${subjectLabel}`,
			`Track: ${track} (${durationMinutes} min)`,
			`Guest / Contact: ${guestName} <${guestEmail}>`,
			`Company: ${company}`,
			`Scheduled Slot: ${slotStartAt}`,
			`Calendar Status: ${calendarStatusLabel}`,
			`Topics: ${topics}`,
			`Google Calendar Event: ${appointmentScheduleUrl}`,
			...(portalUrl ? [`Deal Room: ${portalUrl}`] : []),
		].join("\n"),
	});

	return new Response(
		JSON.stringify({
			success: true,
			bookingId,
			track,
			durationMinutes,
			slotStartAt,
			isSponsored,
			calendarMode: calendarEvent.calendarMode,
			calendarEventId: calendarEvent.eventId,
			calendarEventUrl: calendarEvent.htmlLink,
			addToCalendarUrl: calendarEvent.addToCalendarUrl,
			appointmentScheduleUrl,
			portalToken: isSponsored ? portalToken : undefined,
			portalUrl,
			stripeDepositCheckoutUrl,
			stripeDepositInvoiceUrl,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};
