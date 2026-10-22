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

export interface PortableTextSpan {
	_type: "span";
	_key: string;
	text: string;
	marks: string[];
}

export interface PortableTextMarkDef {
	_type: "link";
	_key: string;
	href: string;
	blank?: boolean;
}

export interface PortableTextBlock {
	_type: "block";
	_key: string;
	style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
	listItem?: "bullet" | "number";
	level?: number;
	markDefs: PortableTextMarkDef[];
	children: PortableTextSpan[];
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function generateKey(): string {
	const bytes = new Uint8Array(6);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

/**
 * Converts Sanity Portable Text blocks into semantic HTML for the rich text editor.
 */
export function portableTextToHtml(
	rawBlocks: unknown[] | undefined | null,
): string {
	if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
		return "<h2>About</h2><p></p>";
	}

	const htmlParts: string[] = [];
	let currentListType: "bullet" | "number" | null = null;

	const closeListIfOpen = () => {
		if (currentListType === "bullet") {
			htmlParts.push("</ul>");
			currentListType = null;
		} else if (currentListType === "number") {
			htmlParts.push("</ol>");
			currentListType = null;
		}
	};

	for (const raw of rawBlocks) {
		if (!raw || typeof raw !== "object") {
			continue;
		}
		const block = raw as Record<string, unknown>;
		if (block._type !== "block") {
			continue;
		}

		const markDefs = Array.isArray(block.markDefs)
			? (block.markDefs as Array<Record<string, unknown>>)
			: [];
		const markDefByKey = new Map<string, Record<string, unknown>>();
		for (const md of markDefs) {
			if (typeof md._key === "string") {
				markDefByKey.set(md._key, md);
			}
		}

		const children = Array.isArray(block.children)
			? (block.children as Array<Record<string, unknown>>)
			: [];

		const inlineHtml = children
			.map((child) => {
				const rawText = typeof child.text === "string" ? child.text : "";
				let rendered = escapeHtml(rawText).replace(/\n/g, "<br>");
				const marks = Array.isArray(child.marks)
					? (child.marks as string[])
					: [];

				for (const mark of marks) {
					if (mark === "strong") {
						rendered = `<strong>${rendered}</strong>`;
					} else if (mark === "em") {
						rendered = `<em>${rendered}</em>`;
					} else if (mark === "code") {
						rendered = `<code>${rendered}</code>`;
					} else if (mark === "underline") {
						rendered = `<u>${rendered}</u>`;
					} else if (mark === "strike-through") {
						rendered = `<s>${rendered}</s>`;
					} else {
						const md = markDefByKey.get(mark);
						if (md && typeof md.href === "string") {
							const safeHref = escapeHtml(md.href);
							rendered = `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${rendered}</a>`;
						}
					}
				}
				return rendered;
			})
			.join("");

		const listItem =
			block.listItem === "bullet" || block.listItem === "number"
				? block.listItem
				: null;

		if (listItem) {
			if (currentListType !== listItem) {
				closeListIfOpen();
				htmlParts.push(listItem === "bullet" ? "<ul>" : "<ol>");
				currentListType = listItem;
			}
			htmlParts.push(`<li>${inlineHtml || "<br>"}</li>`);
			continue;
		}

		closeListIfOpen();

		const style = typeof block.style === "string" ? block.style : "normal";
		const tag =
			style === "h1" ||
			style === "h2" ||
			style === "h3" ||
			style === "h4" ||
			style === "blockquote"
				? style
				: "p";
		htmlParts.push(`<${tag}>${inlineHtml || "<br>"}</${tag}>`);
	}

	closeListIfOpen();
	return htmlParts.join("");
}

const ALLOWED_STYLES = new Set([
	"normal",
	"h1",
	"h2",
	"h3",
	"h4",
	"blockquote",
]);
const ALLOWED_DECORATORS = new Set([
	"strong",
	"em",
	"code",
	"underline",
	"strike-through",
]);

/**
 * Validates and normalizes incoming Portable Text blocks before persisting to Sanity.
 */
export function sanitizePortableTextBlocks(
	rawBlocks: unknown,
): PortableTextBlock[] {
	if (!Array.isArray(rawBlocks)) {
		return [];
	}

	const sanitized: PortableTextBlock[] = [];

	for (const item of rawBlocks) {
		if (!item || typeof item !== "object") {
			continue;
		}
		const b = item as Record<string, unknown>;
		if (b._type !== "block") {
			continue;
		}

		const styleRaw = typeof b.style === "string" ? b.style : "normal";
		const style = (
			ALLOWED_STYLES.has(styleRaw) ? styleRaw : "normal"
		) as PortableTextBlock["style"];

		const listItem =
			b.listItem === "bullet" || b.listItem === "number"
				? b.listItem
				: undefined;

		const rawMarkDefs = Array.isArray(b.markDefs)
			? (b.markDefs as Array<Record<string, unknown>>)
			: [];
		const validMarkDefs: PortableTextMarkDef[] = [];
		const validMarkKeys = new Set<string>();

		for (const md of rawMarkDefs) {
			if (!md || typeof md !== "object") {
				continue;
			}
			const rawHref = typeof md.href === "string" ? md.href.trim() : "";
			if (!rawHref) {
				continue;
			}
			// Only allow http(s)://, mailto:, or relative / paths
			const safeHref = /^(https?:\/\/|mailto:|\/)/i.test(rawHref)
				? rawHref
				: `https://${rawHref}`;
			const key =
				typeof md._key === "string" && /^[a-zA-Z0-9_-]{4,32}$/.test(md._key)
					? md._key
					: generateKey();
			validMarkDefs.push({
				_type: "link",
				_key: key,
				href: safeHref,
				blank: true,
			});
			validMarkKeys.add(key);
		}

		const rawChildren = Array.isArray(b.children)
			? (b.children as Array<Record<string, unknown>>)
			: [];
		const validChildren: PortableTextSpan[] = [];

		for (const ch of rawChildren) {
			if (!ch || typeof ch !== "object") {
				continue;
			}
			const text = typeof ch.text === "string" ? ch.text : "";
			const rawMarks = Array.isArray(ch.marks) ? (ch.marks as unknown[]) : [];
			const marks = rawMarks.filter(
				(m): m is string =>
					typeof m === "string" &&
					(ALLOWED_DECORATORS.has(m) || validMarkKeys.has(m)),
			);
			const spanKey =
				typeof ch._key === "string" && /^[a-zA-Z0-9_-]{4,32}$/.test(ch._key)
					? ch._key
					: generateKey();
			validChildren.push({
				_type: "span",
				_key: spanKey,
				text,
				marks,
			});
		}

		if (validChildren.length === 0) {
			validChildren.push({
				_type: "span",
				_key: generateKey(),
				text: "",
				marks: [],
			});
		}

		// Skip completely empty trailing normal blocks unless it's the only block
		const hasNonEmptyText = validChildren.some((s) => s.text.trim().length > 0);
		if (
			!hasNonEmptyText &&
			sanitized.length > 0 &&
			style === "normal" &&
			!listItem
		) {
			continue;
		}

		const blockKey =
			typeof b._key === "string" && /^[a-zA-Z0-9_-]{4,32}$/.test(b._key)
				? b._key
				: generateKey();

		const cleanBlock: PortableTextBlock = {
			_type: "block",
			_key: blockKey,
			style,
			markDefs: validMarkDefs,
			children: validChildren,
		};

		if (listItem) {
			cleanBlock.listItem = listItem;
			cleanBlock.level =
				typeof b.level === "number" && b.level >= 1 ? b.level : 1;
		}

		sanitized.push(cleanBlock);
	}

	return sanitized;
}
