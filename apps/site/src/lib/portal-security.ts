import { env } from "cloudflare:workers";
import { ensureDefaultUserAndSession, getPortalAuth } from "@/lib/auth";

const FORBIDDEN_GROQ_IDENTIFIERS = [
	"booking",
	"sponsorLead",
	"sponsorPool",
	"sponsorConfig",
	"distributionConfig",
	"trendSignal",
	"syndication",
	"private.",
	"drafts.",
	"versions.",
	"portalToken",
	"legacyPortalToken",
	"signatureData",
	"guestEmail",
	"contactEmail",
	"stripeDeposit",
	"stripeBalance",
	"passionfroot",
	"sharedAssets",
	"preCallNotes",
	"runOfShowNotes",
	"guestQuestions",
];

/**
 * Blocks any GROQ query from Agent AJ / MCP that references private CRM, booking,
 * trendSignal, draft, or system documents/fields.
 */
export function isForbiddenPrivateQuery(query: string): boolean {
	if (!query || typeof query !== "string") {
		return true;
	}
	const normalized = query.toLowerCase();
	for (const term of FORBIDDEN_GROQ_IDENTIFIERS) {
		if (normalized.includes(term.toLowerCase())) {
			return true;
		}
	}
	return false;
}

/**
 * Blocks any document ID in `array_field_reader` that is in a non-public path
 * (`private.*`, `drafts.*`, `trend.*`, `versions.*`, `_.**`).
 */
export function isForbiddenDocumentId(documentId: string): boolean {
	if (!documentId || typeof documentId !== "string") {
		return true;
	}
	const id = documentId.trim().toLowerCase();
	return (
		id.startsWith("private.") ||
		id.startsWith("drafts.") ||
		id.startsWith("trend.") ||
		id.startsWith("versions.") ||
		id.startsWith("_.") ||
		id.startsWith("booking-") ||
		id.startsWith("sponsorlead-") ||
		id.startsWith("sponsorpool-")
	);
}

const HOST_ADMIN_EMAILS = new Set([
	"alex@codingcat.dev",
	"alex.patterson@gmail.com",
	"alex.patterson@sanity.io",
]);

const PUBLIC_EMAIL_DOMAINS = new Set([
	"gmail.com",
	"googlemail.com",
	"outlook.com",
	"hotmail.com",
	"live.com",
	"icloud.com",
	"me.com",
	"yahoo.com",
	"proton.me",
	"protonmail.com",
	"aol.com",
	"hey.com",
	"fastmail.com",
]);

const CORPORATE_DOMAIN_ALIASES: Record<string, string[]> = {
	"aws.com": ["amazon.com", "aws.amazon.com"],
	"amazon.com": ["aws.com", "aws.amazon.com"],
};

/**
 * Extracts all allowed email addresses (including `coordinatorEmails` and comma-separated lists)
 * from one or more Sanity booking / sponsorLead documents.
 */
export function extractPortalAllowedEmails(
	...docs: Array<Record<string, any> | null | undefined>
): string[] {
	const out = new Set<string>();
	for (const doc of docs) {
		if (!doc || typeof doc !== "object") {
			continue;
		}
		const rawStrings = [
			doc.guestEmail,
			doc.contactEmail,
			doc.coordinatorEmail,
			...(Array.isArray(doc.coordinatorEmails) ? doc.coordinatorEmails : []),
			...(Array.isArray(doc.allowedEmails) ? doc.allowedEmails : []),
		];
		for (const item of rawStrings) {
			if (typeof item !== "string") {
				continue;
			}
			for (const part of item.split(/[,;\s]+/)) {
				const clean = part.trim().toLowerCase();
				if (clean?.includes("@")) {
					out.add(clean);
				}
			}
		}
	}
	return Array.from(out);
}

/**
 * Checks whether an authenticated Better-Auth user's email is authorized to unlock
 * a specific Studio Portal (exact guest/sponsor email, coordinator email, same non-public
 * corporate domain, or CodingCat.dev host admin).
 */
export function isAllowedPortalEmail(
	candidateEmail: string,
	allowedEmails: Array<string | undefined | null>,
): boolean {
	const cleanCandidate = (candidateEmail || "").trim().toLowerCase();
	if (!cleanCandidate || !cleanCandidate.includes("@")) {
		return false;
	}
	if (cleanCandidate === "explorer@codingcat.dev") {
		return false;
	}
	if (HOST_ADMIN_EMAILS.has(cleanCandidate)) {
		return true;
	}

	const candidateDomain = cleanCandidate.split("@")[1] || "";

	for (const rawAllowed of allowedEmails) {
		if (!rawAllowed) {
			continue;
		}
		for (const part of String(rawAllowed).split(/[,;\s]+/)) {
			const cleanAllowed = part.trim().toLowerCase();
			if (!cleanAllowed || !cleanAllowed.includes("@")) {
				continue;
			}
			if (cleanCandidate === cleanAllowed) {
				return true;
			}

			// Allow teammates from the same corporate email domain (e.g. @mastra.ai, @fusionauth.io, @aws.com <-> @amazon.com)
			const allowedDomain = cleanAllowed.split("@")[1] || "";
			if (allowedDomain && !PUBLIC_EMAIL_DOMAINS.has(allowedDomain)) {
				if (candidateDomain === allowedDomain) {
					return true;
				}
				const aliases = CORPORATE_DOMAIN_ALIASES[allowedDomain] || [];
				if (aliases.includes(candidateDomain)) {
					return true;
				}
			}
		}
	}

	return false;
}

/**
 * Masks an email address for UI hints (e.g., `marielogerard01@gmail.com` -> `m***1@gmail.com`).
 */
export function maskEmailAddress(email?: string | null): string {
	const clean = (email || "").trim();
	if (!clean || !clean.includes("@")) {
		return "your invited email address";
	}
	const [local, domain] = clean.split("@");
	if (!local || !domain) {
		return "your invited email address";
	}
	if (local.length <= 2) {
		return `${local[0] || "*"}***@${domain}`;
	}
	return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export interface PortalAuthResult {
	authorized: boolean;
	authenticated: boolean;
	verifiedEmail?: string;
	userName?: string;
	reason?: "unauthenticated" | "forbidden_email";
}

/**
 * Verifies that an incoming Studio Portal request has an active, verified
 * Better-Auth session (`better-auth.session_token` backed by Cloudflare D1)
 * AND that the authenticated user's email matches the portal's ACL.
 */
export async function verifyPortalRequestAuth(opts: {
	request: Request;
	url: URL;
	token: string;
	allowedEmails: Array<string | undefined | null>;
}): Promise<PortalAuthResult> {
	const { request, url, allowedEmails } = opts;

	try {
		const db = (env as unknown as { DB?: D1Database })?.DB;
		if (db) {
			await ensureDefaultUserAndSession(db).catch(() => {});
		}
		const auth = getPortalAuth(url.origin, db);
		const sessionData = await auth.api.getSession({
			headers: request.headers,
		});

		const sessionUser = sessionData?.user;
		const email = sessionUser?.email?.trim().toLowerCase() || "";
		const isVerified = Boolean(sessionUser?.emailVerified);

		if (
			!sessionUser ||
			!email ||
			email === "explorer@codingcat.dev" ||
			!isVerified
		) {
			return {
				authorized: false,
				authenticated: false,
				reason: "unauthenticated",
			};
		}

		if (!isAllowedPortalEmail(email, allowedEmails)) {
			return {
				authorized: false,
				authenticated: true,
				verifiedEmail: email,
				userName: sessionUser.name || email,
				reason: "forbidden_email",
			};
		}

		return {
			authorized: true,
			authenticated: true,
			verifiedEmail: email,
			userName: sessionUser.name || email,
		};
	} catch {
		return {
			authorized: false,
			authenticated: false,
			reason: "unauthenticated",
		};
	}
}
