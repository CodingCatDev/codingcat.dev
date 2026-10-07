/**
 * Canonical site identity.
 *
 * SITE_URL is a per-environment wrangler var, so the origin is resolved per
 * request in middleware and exposed as `Astro.locals.siteUrl`. `SITE_URL`
 * below is the build-time fallback for modules with no Astro context.
 */
export const SITE_URL = (
	process.env.SITE_URL ?? "https://codingcat.dev"
).replace(/\/+$/, "");

export const SITE_NAME = "CodingCat.dev";

export const SITE_DESCRIPTION = "CodingCat.dev — Purrfect Web Tutorials";

const FALLBACK = new URL(SITE_URL);

/** Pick the runtime SITE_URL when it is a usable absolute URL. */
export function resolveSiteUrl(
	runtimeSiteUrl: string | undefined,
	buildTimeSite: URL | undefined,
): URL {
	if (runtimeSiteUrl) {
		try {
			return new URL(runtimeSiteUrl);
		} catch {
			// A malformed var must not take the whole site down; fall through.
		}
	}
	return buildTimeSite ?? FALLBACK;
}

/** Build an absolute URL from a site-relative path (e.g. "/blog/foo"). */
export function absoluteUrl(path: string, base: string | URL = FALLBACK) {
	if (/^https?:\/\//.test(path)) {
		return path;
	}
	const origin = (typeof base === "string" ? base : base.origin).replace(
		/\/+$/,
		"",
	);
	return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
