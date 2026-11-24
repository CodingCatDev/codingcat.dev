import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	getSanityServerClient,
	resolveSponsorTier,
} from "@/lib/sanity/write-client";
import {
	createStripeMilestoneCheckout,
	createStripeMilestoneInvoice,
} from "@/lib/stripe";

export const POST: APIRoute = async ({ request, url }) => {
	let body: {
		portalToken?: string;
		leadId?: string;
		companyName?: string;
		contactEmail?: string;
		tier?: string;
		milestone?: "full" | "deposit" | "balance";
		mode?: "checkout" | "invoice";
		daysUntilDue?: number;
	} = {};

	try {
		body = await request.json();
	} catch {
		return new Response(
			JSON.stringify({ success: false, message: "Invalid JSON body" }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const portalToken =
		body.portalToken ||
		`spt_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
	const rawLeadId = body.leadId || `private.sponsorLead-${portalToken}`;
	const strippedLeadId = rawLeadId.replace(/^private\./, "");
	const privateLeadId = `private.${strippedLeadId}`;

	const { client, canWrite } = getSanityServerClient();
	let existingLead: {
		_id: string;
		status?: string;
		companyName?: string;
		contactEmail?: string;
		rateCard?: string;
		totalAmountCents?: number;
		depositAmountCents?: number;
		balanceAmountCents?: number;
	} | null = null;

	try {
		existingLead = await client.fetch(
			`*[_type == "sponsorLead" && (
				_id in [$privateLeadId, $strippedLeadId] ||
				portalToken == $portalToken ||
				legacyPortalToken == $portalToken
			)][0]{
				_id,
				status,
				companyName,
				contactEmail,
				rateCard,
				totalAmountCents,
				depositAmountCents,
				balanceAmountCents
			}`,
			{ privateLeadId, strippedLeadId, portalToken },
		);
	} catch {
		// Non-fatal fallback to request payload
	}

	const leadId = existingLead?._id || privateLeadId;
	const milestone = body.milestone || "full";
	const mode = body.mode || "checkout";
	const daysUntilDue = body.daysUntilDue === 30 ? 30 : 15;
	const tier = resolveSponsorTier(body.tier || existingLead?.rateCard);

	const amountCents =
		milestone === "deposit"
			? existingLead?.depositAmountCents && existingLead.depositAmountCents > 0
				? existingLead.depositAmountCents
				: Math.round(tier.totalAmountCents / 2)
			: milestone === "balance"
				? existingLead?.balanceAmountCents &&
					existingLead.balanceAmountCents > 0
					? existingLead.balanceAmountCents
					: Math.round(tier.totalAmountCents / 2)
				: existingLead?.totalAmountCents && existingLead.totalAmountCents > 0
					? existingLead.totalAmountCents
					: tier.totalAmountCents;

	const companyName =
		body.companyName?.trim() || existingLead?.companyName || "Sponsor Partner";
	const contactEmail =
		body.contactEmail?.trim() ||
		existingLead?.contactEmail ||
		"alex@codingcat.dev";

	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fallbackOrigin = url?.origin ?? new URL(request.url).origin;
	const siteUrl = (workerEnv.SITE_URL || fallbackOrigin).replace(/\/$/, "");
	const canAdvanceStatus =
		!existingLead?.status ||
		["new", "contacted", "replied", "negotiating"].includes(
			existingLead.status,
		);

	if (mode === "invoice") {
		const invoice = await createStripeMilestoneInvoice({
			leadId,
			portalToken,
			companyName,
			contactEmail,
			packageName: tier.name,
			milestone,
			amountCents,
			siteUrl,
			daysUntilDue,
		});

		if (!invoice) {
			return new Response(
				JSON.stringify({
					success: false,
					message:
						"Stripe secret key not configured or invoice creation failed.",
				}),
				{ status: 503, headers: { "Content-Type": "application/json" } },
			);
		}

		if (canWrite) {
			try {
				await client
					.patch(leadId)
					.set(
						milestone === "balance"
							? {
									stripeBalanceInvoiceId: invoice.invoiceId,
									stripeBalanceInvoiceUrl: invoice.hostedInvoiceUrl,
									status: "balance_sent",
								}
							: {
									stripeDepositInvoiceId: invoice.invoiceId,
									stripeDepositInvoiceUrl: invoice.hostedInvoiceUrl,
									paymentTerms: `net${daysUntilDue}`,
									...(canAdvanceStatus ? { status: "deposit_sent" } : {}),
								},
					)
					.commit();
			} catch {
				// Non-fatal
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				milestone,
				mode: "invoice",
				daysUntilDue,
				invoiceId: invoice.invoiceId,
				url: invoice.hostedInvoiceUrl,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	const checkout = await createStripeMilestoneCheckout({
		leadId,
		portalToken,
		companyName,
		contactEmail,
		packageName: tier.name,
		milestone,
		amountCents,
		siteUrl,
	});

	if (!checkout) {
		return new Response(
			JSON.stringify({
				success: false,
				message:
					"Stripe secret key not configured or checkout creation failed.",
			}),
			{ status: 503, headers: { "Content-Type": "application/json" } },
		);
	}

	if (canWrite) {
		try {
			await client
				.patch(leadId)
				.set(
					milestone === "balance"
						? {
								stripeBalanceCheckoutUrl: checkout.checkoutUrl,
								status: "balance_sent",
							}
						: {
								stripeDepositCheckoutUrl: checkout.checkoutUrl,
								paymentTerms: "upfront",
								...(canAdvanceStatus ? { status: "deposit_sent" } : {}),
							},
				)
				.commit();
		} catch {
			// Non-fatal
		}
	}

	return new Response(
		JSON.stringify({
			success: true,
			milestone,
			mode: "checkout",
			sessionId: checkout.sessionId,
			url: checkout.checkoutUrl,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
};
