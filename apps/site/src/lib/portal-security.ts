import { env } from "cloudflare:workers";

const ADMIN_EMAILS = new Set([
	"alex@codingcat.dev",
	"alex.patterson@sanity.io",
	"alex.patterson@gmail.com",
]);

/**
 * Private Sanity document types and ID path prefixes that MUST NEVER be
 * accessible via Agent AJ Chat (/api/chat), MCP (/mcp), or public GROQ tools.
 */
const FORBIDDEN_GROQ_PATTERNS = [
	/\bbooking\b/i,
	/\bsponsorLead\b/i,
	/\bsponsorPool\b/i,
	/\bsponsorConfig\b/i,
	/\bdistributionConfig\b/i,
	/\btrendSignal\b/i,
	/\bsyndication\b/i,
	/\bprivate\./i,
	/\btrend\./i,
	/\bdrafts\./i,
	/\bversions\./i,
	/\bportalToken\b/i,
	/\bsignatureData\b/i,
	/\bguestEmail\b/i,
	/\bcontactEmail\b/i,
	/\bpassionfroot/i,
	/\bstripeDeposit/i,
	/\bstripeBalance/i,
];

export function isForbiddenPrivateQuery(query: string): boolean {
	const trimmed = (query || "").trim();
	if (!trimmed) return false;
	for (const pattern of FORBIDDEN_GROQ_PATTERNS) {
		if (pattern.test(trimmed)) {
			return true;
		}
	}
	return false;
}

export function isForbiddenDocumentId(docId: string): boolean {
	const id = (docId || "").trim().toLowerCase();
	if (!id) return true;
	return (
		id.startsWith("private.") ||
		id.startsWith("trend.") ||
		id.startsWith("drafts.") ||
		id.startsWith("versions.") ||
		id.startsWith("booking-") ||
		id.startsWith("sponsorlead-") ||
		id.startsWith("sponsorpool-") ||
		id === "sponsorconfig" ||
		id === "distributionconfig"
	);
}

function getPortalSigningSecret(): string {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	return (
		workerEnv.GUEST_PORTAL_SECRET?.trim() ||
		process?.env?.GUEST_PORTAL_SECRET?.trim() ||
		workerEnv.SANITY_API_WRITE_TOKEN?.trim() ||
		process?.env?.SANITY_API_WRITE_TOKEN?.trim() ||
		workerEnv.SANITY_API_READ_TOKEN?.trim() ||
		process?.env?.SANITY_API_READ_TOKEN?.trim() ||
		"codingcat-portal-fallback-hmac-key-2026"
	);
}

function toBase64Url(bytes: Uint8Array): string {
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

async function hmacSha256B64Url(message: string): Promise<string> {
	const secret = getPortalSigningSecret();
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
	return toBase64Url(new Uint8Array(sig)).slice(0, 24);
}

export async function computePortalAccessKey(token: string): Promise<string> {
	return hmacSha256B64Url(`portal-key:${token.trim()}`);
}

export async function verifyPortalAccessKey(
	token: string,
	providedKey: string | null | undefined,
): Promise<boolean> {
	if (!token || !providedKey) return false;
	const expected = await computePortalAccessKey(token);
	return expected === providedKey.trim();
}

export async function createPortalSessionValue(
	token: string,
	email: string,
): Promise<string> {
	const normalizedEmail = email.trim().toLowerCase();
	const exp = Date.now() + 30 * 86400_000; // 30 days
	const payload = `${token.trim()}|${normalizedEmail}|${exp}`;
	const sig = await hmacSha256B64Url(`portal-session:${payload}`);
	const enc = new TextEncoder();
	return `${toBase64Url(enc.encode(payload))}.${sig}`;
}

export async function verifyPortalSessionValue(
	cookieVal: string | undefined,
	expectedToken: string,
): Promise<{ valid: boolean; email?: string }> {
	if (!cookieVal || !cookieVal.includes(".")) {
		return { valid: false };
	}
	const [b64, sig] = cookieVal.split(".");
	if (!b64 || !sig) return { valid: false };
	try {
		const padded =
			b64.replace(/-/g, "+").replace(/_/g, "/") +
			"===".slice((b64.length + 3) % 4);
		const decoded = atob(padded);
		const [tok, email, expStr] = decoded.split("|");
		const exp = Number(expStr || 0);
		if (!tok || !email || !exp || Date.now() > exp) {
			return { valid: false };
		}
		if (tok !== expectedToken.trim()) {
			return { valid: false };
		}
		const expectedSig = await hmacSha256B64Url(`portal-session:${decoded}`);
		if (expectedSig !== sig) {
			return { valid: false };
		}
		return { valid: true, email };
	} catch {
		return { valid: false };
	}
}

export function getCookieValue(
	cookieHeader: string | null,
	name: string,
): string | undefined {
	if (!cookieHeader) return undefined;
	const parts = cookieHeader.split(";");
	for (const part of parts) {
		const [k, ...vParts] = part.trim().split("=");
		if (k === name) {
			return decodeURIComponent(vParts.join("="));
		}
	}
	return undefined;
}

export function getPortalCookieName(token: string): string {
	const safe = token.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
	return `cc_portal_${safe}`;
}

export function isMatchingPortalEmail(
	candidateEmail: string | null | undefined,
	allowedEmails: Array<string | null | undefined>,
): boolean {
	const clean = (candidateEmail || "").trim().toLowerCase();
	if (!clean || !clean.includes("@")) return false;
	if (ADMIN_EMAILS.has(clean)) return true;

	const candidateDomain = clean.split("@")[1];
	for (const rawAllowed of allowedEmails) {
		const allowed = (rawAllowed || "").trim().toLowerCase();
		if (!allowed) continue;
		if (allowed === clean) return true;
		// Allow teammates from the same corporate domain (excluding generic webmail providers)
		const allowedDomain = allowed.split("@")[1];
		const publicDomains = new Set([
			"gmail.com",
			"googlemail.com",
			"outlook.com",
			"hotmail.com",
			"yahoo.com",
			"icloud.com",
			"proton.me",
			"protonmail.com",
			"hey.com",
		]);
		if (
			candidateDomain &&
			allowedDomain &&
			candidateDomain === allowedDomain &&
			!publicDomains.has(allowedDomain)
		) {
			return true;
		}
	}
	return false;
}

export async function verifyPortalRequestAuth(opts: {
	request: Request;
	url: URL;
	token: string;
	allowedEmails: Array<string | null | undefined>;
	explicitEmail?: string | null;
	explicitKey?: string | null;
}): Promise<{
	authorized: boolean;
	verifiedEmail?: string;
	setCookieHeader?: string;
}> {
	const { request, url, token, allowedEmails, explicitEmail, explicitKey } =
		opts;

	// 1. Check signed session cookie first
	const cookieName = getPortalCookieName(token);
	const cookieVal = getCookieValue(request.headers.get("cookie"), cookieName);
	if (cookieVal) {
		const verified = await verifyPortalSessionValue(cookieVal, token);
		if (verified.valid) {
			return { authorized: true, verifiedEmail: verified.email };
		}
	}

	// 2. Check HMAC magic key in query string or body (?key=...)
	const keyCandidate =
		explicitKey ||
		url.searchParams.get("key") ||
		request.headers.get("x-portal-key");
	if (keyCandidate && (await verifyPortalAccessKey(token, keyCandidate))) {
		const primaryEmail =
			allowedEmails.find((e) => e && e.includes("@")) || "alex@codingcat.dev";
		const sessionVal = await createPortalSessionValue(token, primaryEmail);
		return {
			authorized: true,
			verifiedEmail: primaryEmail,
			setCookieHeader: `${cookieName}=${encodeURIComponent(sessionVal)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
		};
	}

	// 3. Check explicit email verification (e.g., from ?email=... on freshly created booking redirect or POST /api/portal/verify)
	const emailCandidate =
		explicitEmail ||
		url.searchParams.get("email") ||
		request.headers.get("x-portal-email");
	if (
		emailCandidate &&
		isMatchingPortalEmail(emailCandidate, allowedEmails)
	) {
		const sessionVal = await createPortalSessionValue(token, emailCandidate);
		return {
			authorized: true,
			verifiedEmail: emailCandidate.trim().toLowerCase(),
			setCookieHeader: `${cookieName}=${encodeURIComponent(sessionVal)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
		};
	}

	// 4. Allow requests originating from Sanity Studio / Ops App with Origin header
	const origin = (request.headers.get("origin") || "").toLowerCase();
	if (
		origin.endsWith(".sanity.studio") ||
		origin.endsWith(".sanity.io") ||
		origin === "https://sanity.io"
	) {
		return { authorized: true, verifiedEmail: "alex@codingcat.dev" };
	}

	return { authorized: false };
}

export function maskEmailAddress(email?: string | null): string {
	const raw = (email || "").trim();
	if (!raw || !raw.includes("@")) return "your invited email address";
	const [local, domain] = raw.split("@");
	if (!local || !domain) return "your invited email address";
	const visible = local.slice(0, Math.min(2, local.length));
	return `${visible}***@${domain}`;
}
