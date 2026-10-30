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
		milestone?: "deposit" | "balance";
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
	const leadId = rawLeadId.startsWith("private.")
		? rawLeadId
		: `private.${rawLeadId}`;
	const milestone = body.milestone || "deposit";
	const mode = body.mode || "checkout";
	const tier = resolveSponsorTier(body.tier);
	const amountCents =
		milestone === "deposit" ? tier.depositAmountCents : tier.balanceAmountCents;

	const companyName = body.companyName || "Sponsor Partner";
	const contactEmail = body.contactEmail || "alex@codingcat.dev";

	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fallbackOrigin = url?.origin ?? new URL(request.url).origin;
	const siteUrl = (workerEnv.SITE_URL || fallbackOrigin).replace(/\/$/, "");

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
			daysUntilDue: body.daysUntilDue ?? 15,
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

		const { client, canWrite } = getSanityServerClient();
		if (canWrite) {
			try {
				await client
					.patch(leadId)
					.set(
						milestone === "deposit"
							? {
									stripeDepositInvoiceId: invoice.invoiceId,
									stripeDepositInvoiceUrl: invoice.hostedInvoiceUrl,
									status: "deposit_sent",
								}
							: {
									stripeBalanceInvoiceId: invoice.invoiceId,
									stripeBalanceInvoiceUrl: invoice.hostedInvoiceUrl,
									status: "balance_sent",
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

	const { client, canWrite } = getSanityServerClient();
	if (canWrite) {
		try {
			await client
				.patch(leadId)
				.set(
					milestone === "deposit"
						? {
								stripeDepositCheckoutUrl: checkout.checkoutUrl,
								status: "deposit_sent",
							}
						: {
								stripeBalanceCheckoutUrl: checkout.checkoutUrl,
								status: "balance_sent",
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
