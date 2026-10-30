import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { getSanityServerClient } from "@/lib/sanity/write-client";
import { verifyStripeWebhookSignature } from "@/lib/stripe";

export const POST: APIRoute = async ({ request }) => {
	const rawBody = await request.text();
	const sigHeader = request.headers.get("stripe-signature");

	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const webhookSecret = workerEnv.STRIPE_WEBHOOK_SECRET;

	if (webhookSecret) {
		const valid = await verifyStripeWebhookSignature(
			rawBody,
			sigHeader,
			webhookSecret,
		);
		if (!valid) {
			return new Response(
				JSON.stringify({ error: "Invalid Stripe signature" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}
	}

	let event: {
		type?: string;
		data?: {
			object?: {
				id?: string;
				metadata?: {
					leadId?: string;
					portalToken?: string;
					milestone?: "deposit" | "balance";
					companyName?: string;
				};
			};
		};
	};

	try {
		event = JSON.parse(rawBody);
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON" }), {
			status: 400,
		});
	}

	if (
		event.type === "checkout.session.completed" ||
		event.type === "invoice.paid"
	) {
		const obj = event.data?.object;
		const leadId = obj?.metadata?.leadId;
		const milestone = obj?.metadata?.milestone || "deposit";
		const companyName = obj?.metadata?.companyName;
		const nowIso = new Date().toISOString();

		const { client, canWrite } = getSanityServerClient();
		if (canWrite && leadId) {
			try {
				const strippedLeadId = leadId.replace(/^private\./, "");
				const privateLeadId = `private.${strippedLeadId}`;
				const existingLead = await client.fetch<{ _id: string } | null>(
					`*[_type == "sponsorLead" && _id in [$privateLeadId, $strippedLeadId]][0]{ _id }`,
					{ privateLeadId, strippedLeadId },
				);
				const resolvedLeadId = existingLead?._id || privateLeadId;

				if (milestone === "deposit") {
					await client
						.patch(resolvedLeadId)
						.set({
							status: "deposit_paid",
							depositPaidAt: nowIso,
						})
						.commit();
				} else {
					// Final 50% balance paid -> mark paid in full and ensure public sponsor doc exists
					const sponsorId = `sponsor-${resolvedLeadId.replace(/^(private\.)?sponsorLead-/, "")}`;
					if (companyName) {
						await client.createIfNotExists({
							_id: sponsorId,
							_type: "sponsor",
							title: companyName,
							description: `Official CodingCat.dev Launch Partner (${companyName})`,
						});
					}
					await client
						.patch(resolvedLeadId)
						.set({
							status: "paid",
							balancePaidAt: nowIso,
							...(companyName
								? {
										sponsorDocId: {
											_type: "reference",
											_ref: sponsorId,
										},
									}
								: {}),
						})
						.commit();
				}
			} catch {
				// Non-fatal
			}
		}
	}

	return new Response(JSON.stringify({ received: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
