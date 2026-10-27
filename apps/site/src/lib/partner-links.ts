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
