/** Canonical site origin, used for metadataBase, canonicals, sitemap, robots, and JSON-LD. */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	: "https://codingcat.dev";

export const SITE_NAME = "CodingCat.dev";

/** Build an absolute URL from a site-relative path (e.g. "/blog/foo"). */
export function absoluteUrl(path: string): string {
	if (path.startsWith("http")) return path;
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
