import type { APIRoute } from "astro";
import {
	createPortalSessionValue,
	getPortalCookieName,
	isMatchingPortalEmail,
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

export const POST: APIRoute = async ({ request }) => {
	let body: {
		action?: "verify" | "logout";
		token?: string;
		email?: string;
	} = {};
	try {
		body = await request.json();
	} catch {
		return new Response(
			JSON.stringify({ ok: false, message: "Invalid JSON payload" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const rawToken = (body.token || "").trim();
	if (!rawToken) {
		return new Response(
			JSON.stringify({ ok: false, message: "Portal token is required" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	if (body.action === "logout") {
		const cookieName = getPortalCookieName(rawToken);
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: {
				...CORS_HEADERS,
				"Set-Cookie": `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
			},
		});
	}

	const email = (body.email || "").trim().toLowerCase();
	if (!email || !email.includes("@")) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Please enter the email address invited to this studio room.",
			}),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const { client } = getSanityServerClient();
	const docs = await client.fetch<
		Array<{
			_id: string;
			_type: string;
			portalToken?: string;
			legacyPortalToken?: string;
			guestEmail?: string;
			contactEmail?: string;
		}>
	>(
		`*[_type in ["sponsorLead", "booking"] && (
			portalToken == $token ||
			legacyPortalToken == $token ||
			_id == $privateLeadId ||
			_id == $leadId ||
			_id == $privateBookingId
		)]{
			_id,
			_type,
			portalToken,
			legacyPortalToken,
			guestEmail,
			contactEmail
		}`,
		{
			token: rawToken,
			privateLeadId: `private.sponsorLead-${rawToken}`,
			leadId: `sponsorLead-${rawToken}`,
			privateBookingId: `private.booking-${rawToken}`,
		},
	);

	if (!docs || docs.length === 0) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Studio portal not found or link has expired.",
			}),
			{ status: 404, headers: CORS_HEADERS },
		);
	}

	const allowedEmails = docs.flatMap((d) => [d.guestEmail, d.contactEmail]);
	if (!isMatchingPortalEmail(email, allowedEmails)) {
		return new Response(
			JSON.stringify({
				ok: false,
				message:
					"That email address does not match the invited guest or partner on this booking.",
			}),
			{ status: 403, headers: CORS_HEADERS },
		);
	}

	const canonicalToken = docs[0]?.portalToken || rawToken;
	const cookieName = getPortalCookieName(canonicalToken);
	const sessionVal = await createPortalSessionValue(canonicalToken, email);

	return new Response(
		JSON.stringify({
			ok: true,
			verifiedEmail: email,
			canonicalToken,
		}),
		{
			status: 200,
			headers: {
				...CORS_HEADERS,
				"Set-Cookie": `${cookieName}=${encodeURIComponent(sessionVal)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
			},
		},
	);
};
