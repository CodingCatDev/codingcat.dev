import { env } from "cloudflare:workers";

export interface GuestPortalTokenPayload {
	/** Sanity guest document _id */
	id: string;
	/** Sanity guest slug.current */
	slug: string;
	/** Expiration timestamp in unix milliseconds */
	exp: number;
}

function getSigningSecret(): string | undefined {
	const workerEnv = (env ?? {}) as unknown as Record<
		string,
		string | undefined
	>;
	const fromWorker = workerEnv.GUEST_PORTAL_SECRET?.trim();
	if (fromWorker) {
		return fromWorker;
	}
	if (process?.env?.GUEST_PORTAL_SECRET) {
		return process.env.GUEST_PORTAL_SECRET.trim();
	}
	return undefined;
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

function fromBase64Url(str: string): Uint8Array {
	const padded =
		str.replace(/-/g, "+").replace(/_/g, "/") +
		"===".slice((str.length + 3) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

async function computeHmacB64Url(
	data: string,
	secret: string,
): Promise<string> {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
	return toBase64Url(new Uint8Array(sig)).slice(0, 24);
}

export async function createGuestPortalToken(
	payload: GuestPortalTokenPayload,
	secretOverride?: string,
): Promise<string> {
	const secret = secretOverride || getSigningSecret();
	if (!secret) {
		throw new Error(
			"GUEST_PORTAL_SECRET is required to sign guest portal tokens",
		);
	}
	const enc = new TextEncoder();
	const payloadB64 = toBase64Url(enc.encode(JSON.stringify(payload)));
	const sig = await computeHmacB64Url(payloadB64, secret);
	return `${payloadB64}.${sig}`;
}

export async function verifyGuestPortalToken(
	token: string | undefined,
): Promise<{
	valid: boolean;
	expired: boolean;
	payload: GuestPortalTokenPayload | null;
}> {
	if (!token || !token.includes(".")) {
		return { valid: false, expired: false, payload: null };
	}
	const secret = getSigningSecret();
	if (!secret) {
		return { valid: false, expired: false, payload: null };
	}
	const [payloadB64, providedSig] = token.split(".");
	if (!payloadB64 || !providedSig) {
		return { valid: false, expired: false, payload: null };
	}

	try {
		const dec = new TextDecoder();
		const parsed = JSON.parse(
			dec.decode(fromBase64Url(payloadB64)),
		) as GuestPortalTokenPayload;

		if (!parsed || !parsed.id || !parsed.exp) {
			return { valid: false, expired: false, payload: null };
		}

		const expected = await computeHmacB64Url(payloadB64, secret);
		if (expected !== providedSig) {
			return { valid: false, expired: false, payload: null };
		}

		if (Date.now() > parsed.exp) {
			return { valid: false, expired: true, payload: parsed };
		}

		return { valid: true, expired: false, payload: parsed };
	} catch {
		return { valid: false, expired: false, payload: null };
	}
}

export const ALLOWED_SOCIAL_KEYS = [
	"twitter",
	"bluesky",
	"linkedin",
	"instagram",
	"threads",
	"youtube",
	"github",
	"mastodon",
	"tiktok",
	"facebook",
	"twitch",
	"substack",
	"devto",
	"medium",
	"codepen",
	"discord",
	"stackoverflow",
] as const;

export type AllowedSocialKey = (typeof ALLOWED_SOCIAL_KEYS)[number];

/**
 * Normalizes a handle or URL into a canonical URL for Sanity storage.
 */
export function normalizeSocialInput(
	key: AllowedSocialKey,
	rawValue: string | undefined | null,
): string {
	const val = String(rawValue ?? "").trim();
	if (!val) {
		return "";
	}
	if (key === "discord") {
		return val;
	}
	if (/^https?:\/\//i.test(val)) {
		return val;
	}

	const clean = val.replace(/^@/, "");
	switch (key) {
		case "twitter":
			return `https://x.com/${clean}`;
		case "bluesky":
			return `https://bsky.app/profile/${clean.includes(".") ? clean : `${clean}.bsky.social`}`;
		case "linkedin":
			return clean.startsWith("in/")
				? `https://www.linkedin.com/${clean}`
				: `https://www.linkedin.com/in/${clean}`;
		case "instagram":
			return `https://www.instagram.com/${clean}`;
		case "threads":
			return `https://www.threads.net/@${clean}`;
		case "youtube":
			return `https://www.youtube.com/@${clean}`;
		case "github":
			return `https://github.com/${clean}`;
		case "tiktok":
			return `https://www.tiktok.com/@${clean}`;
		case "facebook":
			return `https://www.facebook.com/${clean}`;
		case "twitch":
			return `https://www.twitch.tv/${clean}`;
		case "devto":
			return `https://dev.to/${clean}`;
		case "mastodon": {
			// Support @user@instance.tld
			if (clean.includes("@")) {
				const [user, instance] = clean.split("@");
				if (user && instance) {
					return `https://${instance}/@${user}`;
				}
			}
			return `https://mastodon.social/@${clean}`;
		}
		default:
			return `https://${clean}`;
	}
}
