import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
import { createGoogleCalendarBookingEvent } from "@/lib/google-calendar";
import { computePortalAccessKey } from "@/lib/portal-security";
import {
	getSanityServerClient,
	resolveSponsorTier,
} from "@/lib/sanity/write-client";
import {
	createStripeMilestoneCheckout,
	createStripeMilestoneInvoice,
} from "@/lib/stripe";

interface SponsorshipPayload {
	name?: string;
	fullName?: string;
	email?: string;
	company?: string;
	companyName?: string;
	website?: string;
	tier?: string | string[];
	sponsorshipTier?: string | string[];
	paymentPreference?: "checkout" | "invoice";
	kickoffSlotStartAt?: string;
	message?: string;
}

export const POST: APIRoute = async ({ request, url }) => {
	let data: SponsorshipPayload = {};
	const contentType = request.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		try {
			data = (await request.json()) as SponsorshipPayload;
		} catch {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid JSON payload" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	} else if (
		contentType.includes("application/x-www-form-urlencoded") ||
		contentType.includes("multipart/form-data")
	) {
		try {
			const formData = await request.formData();
			const formObj: Record<string, unknown> = {};
			for (const [key, value] of formData.entries()) {
				if (typeof value === "string") {
					formObj[key] = value;
				}
			}
			data = formObj as SponsorshipPayload;
		} catch {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid form payload" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	} else {
		try {
			const text = await request.text();
			data = JSON.parse(text) as SponsorshipPayload;
		} catch {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Unsupported Content-Type or invalid payload",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	}

	const name = (data.name ?? data.fullName)?.trim();
	const email = data.email?.trim();
	const company =
		(data.company ?? data.companyName)?.trim() || name || "Sponsor Partner";
	const website = data.website?.trim();
	const rawTier = data.tier ?? data.sponsorshipTier;
	const kickoffSlotStartAt = data.kickoffSlotStartAt?.trim();
	const message = data.message?.trim();

	if (!name) {
		return new Response(
			JSON.stringify({ success: false, message: "Name is required" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	if (!email || !email.includes("@")) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "A valid email address is required",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const hasTier =
		(typeof rawTier === "string" && rawTier.trim().length > 0) ||
		(Array.isArray(rawTier) && rawTier.length > 0);

	if (!hasTier) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Sponsorship tier selection is required",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const selectedTier = resolveSponsorTier(rawTier);
	const portalToken = `spt_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
	const leadId = `private.sponsorLead-${portalToken}`;

	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fallbackOrigin = url?.origin ?? new URL(request.url).origin;
	const siteUrl = (workerEnv.SITE_URL || fallbackOrigin).replace(/\/$/, "");

	const accessKey = await computePortalAccessKey(portalToken, email);
	const queryFallback = new URLSearchParams({
		key: accessKey,
		...(kickoffSlotStartAt ? { bookedSlot: kickoffSlotStartAt } : {}),
	});
	const portalUrl = `${siteUrl}/portal/${portalToken}?${queryFallback.toString()}`;

	// 1. Optional 15-min Sponsor Kickoff Call booking if slot pre-selected on /sponsorships
	let calendarEventUrl: string | undefined;
	if (kickoffSlotStartAt) {
		try {
			const calResult = await createGoogleCalendarBookingEvent({
				guestName: name,
				guestEmail: email,
				company,
				track: "sponsor-kickoff",
				startAt: kickoffSlotStartAt,
				durationMinutes: 15,
				topics:
					message ||
					`15-Min Sponsor Kickoff: ${selectedTier.name} ($${selectedTier.priceUsd})`,
				portalUrl,
			});
			calendarEventUrl = calResult.htmlLink || calResult.addToCalendarUrl;
		} catch {
			// Non-fatal
		}
	}

	// 2. Optional Stripe 50% Upfront Deposit Checkout + Net-15 Invoice generation
	let stripeDepositCheckoutUrl: string | undefined;
	let stripeDepositInvoiceId: string | undefined;
	let stripeDepositInvoiceUrl: string | undefined;

	try {
		const [checkout, invoice] = await Promise.all([
			createStripeMilestoneCheckout({
				leadId,
				portalToken,
				companyName: company,
				contactEmail: email,
				packageName: selectedTier.name,
				milestone: "deposit",
				amountCents: selectedTier.depositAmountCents,
				siteUrl,
			}),
			createStripeMilestoneInvoice({
				leadId,
				portalToken,
				companyName: company,
				contactEmail: email,
				packageName: selectedTier.name,
				milestone: "deposit",
				amountCents: selectedTier.depositAmountCents,
				siteUrl,
				daysUntilDue: 15,
			}),
		]);
		stripeDepositCheckoutUrl = checkout?.checkoutUrl;
		stripeDepositInvoiceId = invoice?.invoiceId;
		stripeDepositInvoiceUrl = invoice?.hostedInvoiceUrl;
	} catch {
		// Non-fatal if Stripe is not configured in local dev
	}

	// 3. Persist sponsorLead directly in Sanity
	const { client, canWrite } = getSanityServerClient();
	if (canWrite) {
		try {
			await client.createOrReplace({
				_id: leadId,
				_type: "sponsorLead",
				companyName: company,
				contactName: name,
				contactEmail: email,
				...(website ? { website } : {}),
				portalToken,
				source: "inbound",
				status: kickoffSlotStartAt
					? "booked"
					: stripeDepositCheckoutUrl || stripeDepositInvoiceUrl
						? "deposit_sent"
						: "new",
				rateCard: selectedTier.id,
				totalAmountCents: selectedTier.totalAmountCents,
				depositAmountCents: selectedTier.depositAmountCents,
				balanceAmountCents: selectedTier.balanceAmountCents,
				...(stripeDepositCheckoutUrl ? { stripeDepositCheckoutUrl } : {}),
				...(stripeDepositInvoiceId ? { stripeDepositInvoiceId } : {}),
				...(stripeDepositInvoiceUrl ? { stripeDepositInvoiceUrl } : {}),
				intent:
					message ||
					`Selected package: ${selectedTier.name} ($${selectedTier.priceUsd})`,
				deliverables: selectedTier.deliverables.map((d, idx) => ({
					_key: `deliv-${idx}`,
					title: d.title,
					channel: d.channel,
					status: "pending",
				})),
				lastEmailAt: new Date().toISOString(),
			});
		} catch {
			// Fallback to stateless Deal Room params if write token lacks permissions
		}
	}

	// 4. Fire-and-forget notification email via Cloudflare Email Routing if bound
	await sendCodingCatEmail({
		to: "alex@codingcat.dev",
		subject: `[CodingCat.dev Sponsor Inquiry] ${company} (${selectedTier.name} - $${selectedTier.priceUsd})`,
		text: [
			"New Sponsorship Inquiry on CodingCat.dev",
			`Company: ${company}`,
			`Contact: ${name} <${email}>`,
			`Package: ${selectedTier.name} ($${selectedTier.priceUsd} total / $${selectedTier.depositAmountCents / 100} 50% deposit)`,
			...(kickoffSlotStartAt
				? [`15-Min Kickoff Slot Booked: ${kickoffSlotStartAt}`]
				: []),
			...(calendarEventUrl ? [`Calendar Event: ${calendarEventUrl}`] : []),
			`Deal Room URL: ${portalUrl}`,
			`Message: ${message || "(none)"}`,
		].join("\n"),
	});

	return new Response(
		JSON.stringify({
			success: true,
			message: "Inquiry received",
			inquiryId: leadId,
			dealId: leadId,
			portalToken,
			portalUrl,
			dealRoomUrl: portalUrl,
			kickoffSlotStartAt,
			calendarEventUrl,
			depositAmountUsd: selectedTier.depositAmountCents / 100,
			totalAmountUsd: selectedTier.priceUsd,
			stripeDepositCheckoutUrl,
			stripeDepositInvoiceUrl,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
};
