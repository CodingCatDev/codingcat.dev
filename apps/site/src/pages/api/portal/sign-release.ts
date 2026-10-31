import type { APIRoute } from "astro";
import {
	extractPortalAllowedEmails,
	verifyPortalRequestAuth,
} from "@/lib/portal-security";
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

/**
 * POST /api/portal/sign-release
 * Inline E-SIGN Media Release endpoint inside `/portal/[token]` for guests whose
 * recording slot was booked via Google Calendar or a PR coordinator and who still
 * need to execute their E-SIGN appearance release.
 */
export const POST: APIRoute = async ({ request, url }) => {
	try {
		const body = (await request.json()) as {
			token?: string;
			signatureMode?: "draw" | "type";
			signatureData?: string;
			consentRecording?: boolean;
			consentCommercial?: boolean;
			consentLikeness?: boolean;
		};

		const token = (body.token || "").trim();
		const signatureData = (body.signatureData || "").trim();
		const signatureMode = body.signatureMode === "type" ? "type" : "draw";

		if (!token || !signatureData) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: "Portal token and signature are required.",
				}),
				{ status: 400, headers: CORS_HEADERS },
			);
		}

		if (
			body.consentRecording === false ||
			body.consentCommercial === false ||
			body.consentLikeness === false
		) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: "All three appearance release consent checkboxes are required.",
				}),
				{ status: 400, headers: CORS_HEADERS },
			);
		}

		const { client, canWrite } = getSanityServerClient();
		if (!canWrite) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: "Sanity write token is not configured in this environment.",
				}),
				{ status: 503, headers: CORS_HEADERS },
			);
		}

		const targetDocs = await client.fetch<Array<Record<string, any>>>(
			`*[_type in ["booking", "sponsorLead"] && (
				portalToken == $token ||
				legacyPortalToken == $token ||
				_id == "private.sponsorLead-" + $token ||
				_id == "private.booking-" + $token
			)]{
				_id,
				_type,
				portalToken,
				legacyPortalToken,
				guestName,
				contactName,
				guestEmail,
				contactEmail,
				coordinatorEmail,
				coordinatorEmails,
				allowedEmails
			}`,
			{ token },
		);

		if (!targetDocs || targetDocs.length === 0) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: "Matching Studio Portal not found.",
				}),
				{ status: 404, headers: CORS_HEADERS },
			);
		}

		const canonicalToken = targetDocs[0]?.portalToken || token;
		const auth = await verifyPortalRequestAuth({
			request,
			url: url ?? new URL(request.url),
			token: canonicalToken,
			allowedEmails: extractPortalAllowedEmails(...targetDocs),
		});

		if (!auth.authorized) {
			return new Response(
				JSON.stringify({
					ok: false,
					error:
						"Unauthorized: Please sign in via Better-Auth before signing the E-SIGN Media Release.",
				}),
				{ status: 403, headers: CORS_HEADERS },
			);
		}

		const signedAt = new Date().toISOString();
		await Promise.all(
			targetDocs.map((d) =>
				client
					.patch(d._id)
					.set({
						signatureMode,
						signatureData,
						signedAt,
						consentRecording: true,
						consentCommercial: true,
						consentLikeness: true,
					})
					.commit()
					.catch(() => {}),
			),
		);

		return new Response(
			JSON.stringify({
				ok: true,
				signedAt,
				signatureMode,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ ok: false, error: message }), {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
};
