/**
 * Map a Sanity document type + slug to its route on the site.
 *
 * Single source of truth for internalLink marks, the sitemap, and the Studio's
 * Presentation `defineDocuments` / `defineLocations` route map — those must
 * agree or edit-intent overlays resolve to the wrong page.
 *
 * The Next app's version handled only "post" and console.warn'd on everything
 * else; this covers the full public route map.
 */
export function resolveHref(
	documentType?: string,
	slug?: string,
): string | undefined {
	if (!slug) {
		return undefined;
	}
	switch (documentType) {
		case "post":
			return `/post/${slug}`;
		case "podcast":
			return `/podcast/${slug}`;
		case "author":
			return `/author/${slug}`;
		case "guest":
			return `/guest/${slug}`;
		case "sponsor":
			return `/sponsor/${slug}`;
		case "page":
			return `/${slug}`;
		default:
			return undefined;
	}
}

/** Listing page for a document type, used for breadcrumbs and Presentation locations. */
export function listHref(documentType?: string): string {
	switch (documentType) {
		case "post":
			return "/blog";
		case "podcast":
			return "/podcasts";
		case "author":
			return "/authors";
		case "guest":
			return "/guests";
		case "sponsor":
			return "/sponsors";
		default:
			return "/";
	}
}
