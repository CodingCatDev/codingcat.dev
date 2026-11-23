import { env } from "cloudflare:workers";

export interface StripeMilestoneSessionParams {
	leadId: string;
	portalToken: string;
	companyName: string;
	contactEmail: string;
	packageName: string;
	milestone: "full" | "deposit" | "balance";
	amountCents: number;
	siteUrl: string;
}

export interface StripeInvoiceResult {
	invoiceId: string;
	hostedInvoiceUrl: string;
}

function getStripeSecretKey(): string | undefined {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	return workerEnv.STRIPE_SECRET_KEY;
}

function toFormUrlEncoded(
	params: Record<string, string | number | undefined>,
): string {
	const search = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== "") {
			search.append(k, String(v));
		}
	}
	return search.toString();
}

/**
 * Creates a Stripe Checkout Session for a sponsorship (100% single payment,
 * or legacy 50% deposit / balance milestones).
 */
export async function createStripeMilestoneCheckout(
	params: StripeMilestoneSessionParams,
): Promise<{ checkoutUrl: string; sessionId: string } | null> {
	const secretKey = getStripeSecretKey();
	if (!secretKey) {
		return null;
	}

	const label =
		params.milestone === "deposit"
			? `50% Upfront Deposit: ${params.packageName} (${params.companyName})`
			: params.milestone === "balance"
				? `50% Final Balance: ${params.packageName} (${params.companyName})`
				: `${params.packageName} (${params.companyName})`;

	const description =
		params.milestone === "deposit"
			? "Locks your production & recording slot on CodingCat.dev. Remaining 50% balance due upon publication."
			: params.milestone === "balance"
				? "Final 50% balance upon publication of your CodingCat.dev launch campaign."
				: "CodingCat.dev Sponsorship Campaign (100% upfront card or ACH payment).";

	const successNotice =
		params.milestone === "full" ? "paid_success" : `${params.milestone}_success`;

	const body = toFormUrlEncoded({
		mode: "payment",
		customer_email: params.contactEmail,
		success_url: `${params.siteUrl}/portal/${params.portalToken}?payment=${successNotice}`,
		cancel_url: `${params.siteUrl}/portal/${params.portalToken}?payment=cancelled`,
		"line_items[0][price_data][currency]": "usd",
		"line_items[0][price_data][unit_amount]": params.amountCents,
		"line_items[0][price_data][product_data][name]": label,
		"line_items[0][price_data][product_data][description]": description,
		"line_items[0][quantity]": 1,
		"metadata[leadId]": params.leadId,
		"metadata[portalToken]": params.portalToken,
		"metadata[milestone]": params.milestone,
		"metadata[companyName]": params.companyName,
		"metadata[packageName]": params.packageName,
	});

	const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body,
	});

	if (!res.ok) {
		return null;
	}
	const data = (await res.json()) as { id?: string; url?: string };
	if (!data.id || !data.url) {
		return null;
	}
	return { sessionId: data.id, checkoutUrl: data.url };
}

/**
 * Creates & finalizes a Stripe Hosted Invoice (Net-15 or Net-30) for enterprise
 * sponsors who pay via AP / ACH / Wire or Corporate Card.
 */
export async function createStripeMilestoneInvoice(
	params: StripeMilestoneSessionParams & { daysUntilDue?: number },
): Promise<StripeInvoiceResult | null> {
	const secretKey = getStripeSecretKey();
	if (!secretKey) {
		return null;
	}

	const headers = {
		Authorization: `Bearer ${secretKey}`,
		"Content-Type": "application/x-www-form-urlencoded",
	};

	// 1. Find or create customer
	const searchRes = await fetch(
		`https://api.stripe.com/v1/customers?email=${encodeURIComponent(params.contactEmail)}&limit=1`,
		{ headers: { Authorization: `Bearer ${secretKey}` } },
	);
	const searchData = (await searchRes.json()) as {
		data?: Array<{ id: string }>;
	};
	let customerId = searchData.data?.[0]?.id;

	if (!customerId) {
		const createCustomerRes = await fetch(
			"https://api.stripe.com/v1/customers",
			{
				method: "POST",
				headers,
				body: toFormUrlEncoded({
					name: params.companyName,
					email: params.contactEmail,
					"metadata[leadId]": params.leadId,
					"metadata[portalToken]": params.portalToken,
				}),
			},
		);
		if (!createCustomerRes.ok) {
			return null;
		}
		const customer = (await createCustomerRes.json()) as { id: string };
		customerId = customer.id;
	}

	const daysUntilDue = params.daysUntilDue === 30 ? 30 : 15;
	const label =
		params.milestone === "deposit"
			? `50% Upfront Deposit: ${params.packageName} (${params.companyName})`
			: params.milestone === "balance"
				? `50% Final Balance: ${params.packageName} (${params.companyName})`
				: `${params.packageName} (${params.companyName}) - NET ${daysUntilDue}`;

	// 2. Create draft invoice
	const invoiceRes = await fetch("https://api.stripe.com/v1/invoices", {
		method: "POST",
		headers,
		body: toFormUrlEncoded({
			customer: customerId,
			collection_method: "send_invoice",
			days_until_due: daysUntilDue,
			description: `CodingCat.dev Sponsorship (${params.packageName}) | NET ${daysUntilDue} | Deal Room: ${params.siteUrl}/portal/${params.portalToken}`,
			"metadata[leadId]": params.leadId,
			"metadata[portalToken]": params.portalToken,
			"metadata[milestone]": params.milestone,
			"metadata[daysUntilDue]": daysUntilDue,
			"metadata[companyName]": params.companyName,
			"metadata[packageName]": params.packageName,
		}),
	});
	if (!invoiceRes.ok) {
		return null;
	}
	const invoice = (await invoiceRes.json()) as { id: string };

	// 3. Attach invoice item
	const itemRes = await fetch("https://api.stripe.com/v1/invoiceitems", {
		method: "POST",
		headers,
		body: toFormUrlEncoded({
			customer: customerId,
			invoice: invoice.id,
			amount: params.amountCents,
			currency: "usd",
			description: label,
		}),
	});
	if (!itemRes.ok) {
		return null;
	}

	// 4. Finalize invoice so hosted_invoice_url is immediately live
	const finalizeRes = await fetch(
		`https://api.stripe.com/v1/invoices/${invoice.id}/finalize`,
		{
			method: "POST",
			headers,
		},
	);
	if (!finalizeRes.ok) {
		return null;
	}
	const finalized = (await finalizeRes.json()) as {
		id: string;
		hosted_invoice_url?: string;
	};
	if (!finalized.hosted_invoice_url) {
		return null;
	}

	return {
		invoiceId: finalized.id,
		hostedInvoiceUrl: finalized.hosted_invoice_url,
	};
}

/**
 * Verifies a Stripe Webhook signature using Web Crypto API (Cloudflare Workers compatible).
 */
export async function verifyStripeWebhookSignature(
	payload: string,
	sigHeader: string | null,
	secret: string,
): Promise<boolean> {
	if (!sigHeader || !secret) {
		return false;
	}
	const parts = sigHeader
		.split(",")
		.reduce<Record<string, string>>((acc, part) => {
			const [k, v] = part.split("=");
			if (k && v) {
				acc[k.trim()] = v.trim();
			}
			return acc;
		}, {});

	const timestamp = parts.t;
	const signature = parts.v1;
	if (!timestamp || !signature) {
		return false;
	}

	const tsNum = Number(timestamp);
	if (
		!Number.isFinite(tsNum) ||
		Math.abs(Math.floor(Date.now() / 1000) - tsNum) > 300
	) {
		return false;
	}

	const signedPayload = `${timestamp}.${payload}`;
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sigBuffer = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(signedPayload),
	);
	const expectedHex = Array.from(new Uint8Array(sigBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	if (expectedHex.length !== signature.length) {
		return false;
	}
	let mismatch = 0;
	for (let i = 0; i < expectedHex.length; i++) {
		mismatch |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i);
	}
	return mismatch === 0;
}
