import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { ensureDefaultUserAndSession, getPortalAuth } from "@/lib/auth";
import {
	extractPortalAllowedEmails,
	isAllowedPortalEmail,
} from "@/lib/portal-security";
import { getSanityServerClient } from "@/lib/sanity/write-client";

export const prerender = false;

export const ALL: APIRoute = async ({ request, locals }) => {
	const url = new URL(request.url);
	const origin = locals.siteUrl?.origin || url.origin;
	const db =
		(locals as unknown as { db?: D1Database })?.db ??
		(env as unknown as { DB?: D1Database })?.DB;

	if (db) {
		try {
			await ensureDefaultUserAndSession(db);
		} catch {
			// non-fatal if tables already exist
		}
	}

	// Optional Portal ACL Pre-Check: If the sign-in request originates from `/portal/[token]`
	// (`x-portal-token` header), verify that the requested email is actually authorized
	// for that portal BEFORE sending an OTP or Magic Link email.
	const portalTokenHeader = request.headers.get("x-portal-token")?.trim();
	if (
		portalTokenHeader &&
		request.method === "POST" &&
		(url.pathname.endsWith("/email-otp/send-verification-otp") ||
			url.pathname.endsWith("/sign-in/magic-link"))
	) {
		try {
			const cloned = (await request.clone().json()) as { email?: string };
			const candidateEmail = (cloned.email || "").trim().toLowerCase();
			const { client } = getSanityServerClient();
			const [leadDoc, bookingDoc] = await Promise.all([
				client.fetch<Record<string, any> | null>(
					`*[_type == "sponsorLead" && (portalToken == $token || legacyPortalToken == $token || _id == $privateLeadId || _id == $leadId)][0]{ contactEmail, coordinatorEmail, coordinatorEmails, allowedEmails }`,
					{
						token: portalTokenHeader,
						privateLeadId: `private.sponsorLead-${portalTokenHeader}`,
						leadId: `sponsorLead-${portalTokenHeader}`,
					},
				),
				client.fetch<Record<string, any> | null>(
					`*[_type == "booking" && (portalToken == $token || legacyPortalToken == $token || _id == $privateBookingId)] | order(_createdAt desc)[0]{ guestEmail, coordinatorEmail, coordinatorEmails, allowedEmails }`,
					{
						token: portalTokenHeader,
						privateBookingId: `private.booking-${portalTokenHeader}`,
					},
				),
			]);

			const allowedEmails = extractPortalAllowedEmails(leadDoc, bookingDoc);
			if (!isAllowedPortalEmail(candidateEmail, allowedEmails)) {
				return new Response(
					JSON.stringify({
						code: "FORBIDDEN_PORTAL_EMAIL",
						message:
							"That email address is not on the invite list for this Studio Portal. Please use your invited guest/sponsor email or contact alex@codingcat.dev.",
					}),
					{
						status: 403,
						headers: { "Content-Type": "application/json" },
					},
				);
			}
		} catch {
			// Fall through to Better-Auth handler if body parsing fails
		}
	}

	const auth = getPortalAuth(origin, db);
	return auth.handler(request);
};
