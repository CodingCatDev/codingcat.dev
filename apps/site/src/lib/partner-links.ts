/**
 * Canonical Partner & Affiliate Link Tracker Registry.
 *
 * Ensures that whenever CodingCat.dev references a partner domain (in Portable
 * Text links, Markdown exports, or Sponsor cards), our contracted coupon code,
 * referral shortlink, or UTM parameters are automatically applied.
 */

export interface PartnerLinkRule {
	/** Partner identifier (matches Sanity sponsor slug where applicable). */
	slug: string;
	/** Display name of the partner. */
	name: string;
	/** Bare hostnames to match (automatically matches `www.` and subdomains). */
	matchDomains: string[];
	/** Canonical partner landing URL when linking to the root domain or `/manage`. */
	landingUrl: string;
	/** Optional coupon query param key/value (e.g. `coupon=CodingCatDev`). */
	couponParam?: { key: string; value: string };
	/** Additional query parameters appended to deep links on matching domains. */
	queryParams?: Record<string, string>;
	/**
	 * - `root_or_append`: If the link points to `/` or `/manage` (with no existing
	 *   partner params), rewrite to `landingUrl`; for deep links (like `/docs/...`),
	 *   preserve the deep path and append `couponParam` + `queryParams`.
	 * - `append_params`: Always preserve the target path and append `couponParam`
	 *   + `queryParams` if not already present.
	 * - `replace_root_only`: Only replace bare root links (`/`) with `landingUrl`
	 *   (used for shortener redirects like `cld.media` or `mule.to` so deep docs
	 *   links on the main domain aren't broken).
	 */
	rewriteMode: "root_or_append" | "append_params" | "replace_root_only";
}

export const PARTNER_LINK_RULES: readonly PartnerLinkRule[] = [
	{
		slug: "sanity",
		name: "Sanity",
		matchDomains: ["sanity.io"],
		landingUrl: "https://www.sanity.io/manage?coupon=CodingCatDev",
		couponParam: { key: "coupon", value: "CodingCatDev" },
		queryParams: { utm_source: "codingcatdev" },
		rewriteMode: "root_or_append",
	},
	{
		slug: "algolia",
		name: "Algolia",
		matchDomains: ["algolia.com"],
		landingUrl: "https://www.algolia.com/?utm_source=codingcatdev",
		queryParams: { utm_source: "codingcatdev" },
		rewriteMode: "append_params",
	},
	{
		slug: "builder-io",
		name: "Builder.io",
		matchDomains: ["builder.io"],
		landingUrl: "https://www.builder.io/?utm_source=codingcatdev",
		queryParams: { utm_source: "codingcatdev" },
		rewriteMode: "append_params",
	},
	{
		slug: "cloudinary",
		name: "Cloudinary",
		matchDomains: ["cloudinary.com"],
		landingUrl: "https://cld.media/codingcatdev",
		queryParams: { utm_source: "codingcatdev" },
		rewriteMode: "replace_root_only",
	},
	{
		slug: "multiplayer",
		name: "Multiplayer",
		matchDomains: ["multiplayer.app"],
		landingUrl: "https://www.multiplayer.app/?utm_campaign=coding_cat_dev_pod",
		queryParams: { utm_campaign: "coding_cat_dev_pod" },
		rewriteMode: "append_params",
	},
	{
		slug: "refine",
		name: "Refine",
		matchDomains: ["refine.dev"],
		landingUrl: "https://s.refine.dev/codingcat?utm=codingcat.dev",
		queryParams: { utm: "codingcat.dev" },
		rewriteMode: "replace_root_only",
	},
	{
		slug: "sticker-mule",
		name: "Sticker Mule",
		matchDomains: ["stickermule.com"],
		landingUrl: "https://mule.to/p5h2",
		rewriteMode: "replace_root_only",
	},
	{
		slug: "storyblok",
		name: "Storyblok",
		matchDomains: ["storyblok.com"],
		landingUrl:
			"https://www.storyblok.com/?utm_source=codingcat&utm_medium=sponsor&utm_campaign=AWA_SPON_PURRFECT_TRA&utm_content=purrfect-podcast",
		queryParams: {
			utm_source: "codingcat",
			utm_medium: "sponsor",
			utm_campaign: "AWA_SPON_PURRFECT_TRA",
			utm_content: "purrfect-podcast",
		},
		rewriteMode: "append_params",
	},
	{
		slug: "authzed",
		name: "AuthZed",
		matchDomains: ["authzed.com"],
		landingUrl: "https://authzed.com/?utm_source=codingcatdev",
		queryParams: { utm_source: "codingcatdev" },
		rewriteMode: "append_params",
	},
];

/**
 * Canonical sponsor social media accounts by sponsor slug.
 * Merged with Sanity `sponsor.socials` on `/sponsor/[slug]` so official
 * partner social icons are always available and overridable in Studio.
 */
export const SPONSOR_SOCIALS_BY_SLUG: Record<string, Record<string, string>> = {
	algolia: {
		twitter: "https://x.com/algolia",
		github: "https://github.com/algolia",
		linkedin: "https://www.linkedin.com/company/algolia/",
		youtube: "https://www.youtube.com/user/Algolia",
		discord: "https://discord.com/invite/ytbZuTQukV",
		bluesky: "https://bsky.app/profile/algolia.bsky.social",
		instagram: "https://www.instagram.com/algolia.search/",
		facebook: "https://www.facebook.com/algolia/",
		devto: "https://dev.to/algolia",
	},
	authzed: {
		twitter: "https://x.com/authzed",
		github: "https://github.com/authzed",
		linkedin: "https://www.linkedin.com/company/authzed/",
		youtube: "https://www.youtube.com/@authzed",
		discord: "https://discord.gg/TUd4k5McMX",
		bluesky: "https://bsky.app/profile/authzed.com",
	},
	"builder-io": {
		twitter: "https://x.com/builderio",
		github: "https://github.com/BuilderIO",
		linkedin: "https://www.linkedin.com/company/builder-io/",
		youtube: "https://www.youtube.com/@Builderio",
		bluesky: "https://bsky.app/profile/builderio.bsky.social",
		devto: "https://dev.to/builderio",
	},
	cloudinary: {
		twitter: "https://x.com/cloudinary",
		github: "https://github.com/cloudinary",
		linkedin: "https://www.linkedin.com/company/cloudinary/",
		youtube: "https://www.youtube.com/@Cloudinary",
		discord: "https://discord.com/invite/D8ddQj6KnH",
		bluesky: "https://bsky.app/profile/cloudinary.bsky.social",
		instagram: "https://www.instagram.com/cloudinarylife",
		facebook: "https://www.facebook.com/Cloudinary",
		devto: "https://dev.to/cloudinary",
	},
	jamstackconf: {
		twitter: "https://x.com/jamstackconf",
		github: "https://github.com/jamstack",
		youtube: "https://www.youtube.com/c/JAMstackConf",
		discord: "https://discord.com/invite/jamstack",
	},
	multiplayer: {
		twitter: "https://x.com/trymultiplayer",
		github: "https://github.com/multiplayer-app",
		linkedin: "https://www.linkedin.com/company/multiplayer-app/",
		youtube: "https://www.youtube.com/@trymultiplayer",
		bluesky: "https://bsky.app/profile/multiplayer.app",
		threads: "https://www.threads.net/@trymultiplayer",
	},
	refine: {
		twitter: "https://x.com/refine_dev",
		github: "https://github.com/refinedev/refine",
		linkedin: "https://www.linkedin.com/company/refine-dev",
		youtube: "https://www.youtube.com/@refinedev",
		discord: "https://discord.gg/refine",
		bluesky: "https://bsky.app/profile/refine.dev",
		devto: "https://dev.to/refine",
	},
	stickermule: {
		twitter: "https://x.com/stickermule",
		github: "https://github.com/stickermule",
		linkedin: "https://www.linkedin.com/company/sticker-mule/",
		youtube: "https://www.youtube.com/user/stickermule",
		instagram: "https://www.instagram.com/stickermule/",
		facebook: "https://www.facebook.com/stickermule",
	},
	storyblok: {
		twitter: "https://x.com/storyblok",
		github: "https://github.com/storyblok",
		linkedin: "https://www.linkedin.com/company/storyblok",
		youtube: "https://www.youtube.com/c/Storyblok-com",
		discord: "https://discord.com/invite/storyblok",
		bluesky: "https://bsky.app/profile/storyblok.com",
		twitch: "https://www.twitch.tv/storyblok",
		instagram: "https://www.instagram.com/storybloklife/",
		facebook: "https://www.facebook.com/storyblok/",
		devto: "https://dev.to/storyblok",
	},
};

function hostnameMatches(hostname: string, domain: string): boolean {
	const cleanHost = hostname.toLowerCase().replace(/^www\./, "");
	const cleanDomain = domain.toLowerCase().replace(/^www\./, "");
	return cleanHost === cleanDomain || cleanHost.endsWith(`.${cleanDomain}`);
}

/**
 * Resolves an outgoing URL against CodingCat.dev's partner tracker rules.
 * Safe to call on relative paths, `mailto:`, `#anchor`, `null`, or `undefined`.
 */
export function resolvePartnerUrl(
	rawUrl: string | null | undefined,
	customRules: readonly PartnerLinkRule[] = PARTNER_LINK_RULES,
): string {
	if (!rawUrl || typeof rawUrl !== "string") {
		return "";
	}
	const trimmed = rawUrl.trim();
	if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
		return rawUrl;
	}

	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		return rawUrl;
	}

	// Never rewrite Sanity CDN asset URLs (cdn.sanity.io).
	if (parsed.hostname.toLowerCase() === "cdn.sanity.io") {
		return rawUrl;
	}

	const rule = customRules.find((candidate) =>
		candidate.matchDomains.some((domain) =>
			hostnameMatches(parsed.hostname, domain),
		),
	);
	if (!rule) {
		return rawUrl;
	}

	const normalizedPath = parsed.pathname.replace(/\/+$/, "") || "/";
	const isRootOrManage = normalizedPath === "/" || normalizedPath === "/manage";

	if (rule.rewriteMode === "root_or_append" && isRootOrManage) {
		const landing = new URL(rule.landingUrl);
		// Preserve any extra caller-provided query parameters or hash
		parsed.searchParams.forEach((val, key) => {
			if (!landing.searchParams.has(key)) {
				landing.searchParams.set(key, val);
			}
		});
		if (parsed.hash && !landing.hash) {
			landing.hash = parsed.hash;
		}
		return landing.toString();
	}

	if (rule.rewriteMode === "replace_root_only") {
		if (normalizedPath === "/") {
			return rule.landingUrl;
		}
		if (rule.queryParams) {
			for (const [k, v] of Object.entries(rule.queryParams)) {
				if (!parsed.searchParams.has(k)) {
					parsed.searchParams.set(k, v);
				}
			}
		}
		return parsed.toString();
	}

	// `append_params` or deep link in `root_or_append`
	if (rule.couponParam && !parsed.searchParams.has(rule.couponParam.key)) {
		parsed.searchParams.set(rule.couponParam.key, rule.couponParam.value);
	}
	if (rule.queryParams) {
		for (const [k, v] of Object.entries(rule.queryParams)) {
			if (!parsed.searchParams.has(k)) {
				parsed.searchParams.set(k, v);
			}
		}
	}

	return parsed.toString();
}
