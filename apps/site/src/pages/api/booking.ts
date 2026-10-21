import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { sendCodingCatEmail } from "@/lib/email";
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
	track?: "editorial" | "sponsored" | "full-stack-launch";
	slotStartAt?: string;
	topics?: string;
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
	const slotStartAt =
		data.slotStartAt || new Date(Date.now() + 7 * 86400_000).toISOString();
	const topics = data.topics?.trim();
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
	const portalToken = `spt_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
	const isSponsored = track === "sponsored" || track === "full-stack-launch";
	const appointmentScheduleUrl =
		track === "full-stack-launch"
			? "https://calendar.app.google/tyGiF6dGFQeaVrN66"
			: "https://calendar.app.google/s3B6PEqbVsGcY81MA";

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

		if (canWrite) {
			try {
				await client.createOrReplace({
					_id: leadId,
					_type: "sponsorLead",
					companyName: company,
					contactName: guestName,
					contactEmail: guestEmail,
					...(socialUrl ? { website: socialUrl } : {}),
					portalToken,
					source: "booking",
					status:
						stripeDepositCheckoutUrl || stripeDepositInvoiceUrl
							? "deposit_sent"
							: "new",
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
			} catch {
				// Non-fatal
			}
		}

		const queryFallback = new URLSearchParams({
			company,
			name: guestName,
			email: guestEmail,
			tier: tier.id,
		});
		portalUrl = `${siteUrl}/portal/${portalToken}?${queryFallback.toString()}`;
	}

	if (canWrite) {
		try {
			await client.createOrReplace({
				_id: bookingId,
				_type: "booking",
				guestName,
				guestEmail,
				company,
				...(socialUrl ? { socialUrl } : {}),
				track,
				status: "pending",
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

	await sendCodingCatEmail({
		to: "alex.patterson@gmail.com",
		subject: `[CodingCat.dev ${isSponsored ? "Fast-Track Sponsored" : "Editorial"} Booking] ${guestName} (${company})`,
		text: [
			"New Podcast Booking & Signed Media Release",
			`Track: ${track}`,
			`Guest: ${guestName} <${guestEmail}>`,
			`Company: ${company}`,
			`Requested Slot: ${slotStartAt}`,
			`Topics: ${topics}`,
			`Calendar Link: ${appointmentScheduleUrl}`,
			...(portalUrl ? [`Deal Room: ${portalUrl}`] : []),
		].join("\n"),
	});

	return new Response(
		JSON.stringify({
			success: true,
			bookingId,
			track,
			isSponsored,
			appointmentScheduleUrl,
			portalToken: isSponsored ? portalToken : undefined,
			portalUrl,
			stripeDepositCheckoutUrl,
			stripeDepositInvoiceUrl,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};
