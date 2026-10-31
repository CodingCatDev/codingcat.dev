import type { APIRoute } from "astro";
import {
	extractPortalAllowedEmails,
	verifyPortalRequestAuth,
} from "@/lib/portal-security";
import { getSanityServerClient } from "@/lib/sanity/write-client";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Portal-Key, X-Portal-Email",
	"Content-Type": "application/json",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

/**
 * POST /api/portal/notes
 * 2-Way co-editable Run-of-Show, Pre-Call Notes, and Guest Questions endpoint
 * shared between the Guest/Sponsor Portal (/portal/[token]#run-of-show) and the Sanity Ops App.
 */
export const POST: APIRoute = async ({ request, url }) => {
	let body: {
		token?: string;
		docId?: string;
		preCallNotes?: string;
		runOfShowNotes?: string;
		guestQuestions?: string;
		topics?: string;
		updatedBy?: string;
		email?: string;
		key?: string;
	} = {};

	try {
		body = await request.json();
	} catch {
		return new Response(
			JSON.stringify({ ok: false, message: "Invalid JSON payload" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const token = (body.token || "").trim();
	const docId = (body.docId || "").trim();
	if (!token && !docId) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "token or docId is required to save Run-of-Show notes",
			}),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const { client, canWrite } = getSanityServerClient();
	if (!canWrite) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Sanity write token is not configured in this environment.",
			}),
			{ status: 503, headers: CORS_HEADERS },
		);
	}

	const targetDocs = await client.fetch<
		Array<{
			_id: string;
			_type: string;
			portalToken?: string;
			legacyPortalToken?: string;
			guestEmail?: string;
			contactEmail?: string;
		}>
	>(
		`*[_type in ["booking", "sponsorLead"] && (
			($token != "" && (portalToken == $token || legacyPortalToken == $token)) ||
			($docId != "" && (_id == $docId || _id == "private." + $docId)) ||
			($token != "" && (_id == "private.sponsorLead-" + $token || _id == "private.booking-" + $token))
		)]{
			_id,
			_type,
			portalToken,
			legacyPortalToken,
			guestEmail,
			contactEmail,
			coordinatorEmail,
			coordinatorEmails,
			allowedEmails
		}`,
		{ token, docId },
	);

	if (!targetDocs || targetDocs.length === 0) {
		return new Response(
			JSON.stringify({
				ok: false,
				message: "Matching booking or deal room document not found.",
			}),
			{ status: 404, headers: CORS_HEADERS },
		);
	}

	const canonicalToken = targetDocs[0]?.portalToken || token;
	const allowedEmails = extractPortalAllowedEmails(...targetDocs);

	const auth = await verifyPortalRequestAuth({
		request,
		url: url ?? new URL(request.url),
		token: canonicalToken,
		allowedEmails,
	});

	if (!auth.authorized) {
		return new Response(
			JSON.stringify({
				ok: false,
				message:
					"Unauthorized: Please sign in with your invited guest or sponsor email via Better-Auth before editing Run-of-Show notes.",
			}),
			{ status: 403, headers: CORS_HEADERS },
		);
	}

	const nowIso = new Date().toISOString();
	const updatedBy =
		body.updatedBy?.trim() || auth.verifiedEmail || "Guest / Studio";

	const patchFields: Record<string, unknown> = {
		runOfShowUpdatedAt: nowIso,
		runOfShowUpdatedBy: updatedBy,
	};

	if (typeof body.preCallNotes === "string") {
		patchFields.preCallNotes = body.preCallNotes.slice(0, 12000);
	}
	if (typeof body.runOfShowNotes === "string") {
		patchFields.runOfShowNotes = body.runOfShowNotes.slice(0, 24000);
	}
	if (typeof body.guestQuestions === "string") {
		patchFields.guestQuestions = body.guestQuestions.slice(0, 12000);
	}
	if (typeof body.topics === "string" && body.topics.trim()) {
		patchFields.topics = body.topics.trim().slice(0, 8000);
	}

	const updatedIds: string[] = [];
	for (const doc of targetDocs) {
		await client.patch(doc._id).set(patchFields).commit();
		updatedIds.push(doc._id);
	}

	return new Response(
		JSON.stringify({
			ok: true,
			updatedDocIds: updatedIds,
			runOfShowUpdatedAt: nowIso,
			runOfShowUpdatedBy: updatedBy,
		}),
		{
			status: 200,
			headers: CORS_HEADERS,
		},
	);
};
