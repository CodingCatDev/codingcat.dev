import { stegaClean } from "@sanity/client/stega";

export interface NavMatchResult {
	cleanHref: string;
	isExternal: boolean;
	isExact: boolean;
	isActive: boolean;
	ariaCurrent: "page" | "true" | undefined;
}

export interface ActivePillarInfo {
	id: "courses" | "podcasts" | "blog" | "topics" | "sponsors" | "sponsorships";
	label: string;
	href: string;
	isExact: boolean;
}

/**
 * Strips Sanity Stega characters and normalizes trailing slashes.
 */
export function normalizeNavPath(rawPath: string | null | undefined): string {
	const cleaned = stegaClean(rawPath ?? "").trim();
	if (!cleaned) {
		return "/";
	}
	if (/^https?:\/\//i.test(cleaned)) {
		return cleaned;
	}
	const withLeadingSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
	return withLeadingSlash.replace(/\/+$/, "") || "/";
}

/**
 * Route prefixes belonging to each high-level navigation category.
 * Ensures singular detail pages (e.g. /post/[slug], /course/[slug], /podcast/[slug])
 * and related sub-routes highlight their parent pillar in both desktop and mobile nav.
 */
const PILLAR_ROUTE_PREFIXES: Record<string, readonly string[]> = {
	"/courses": ["/courses", "/course"],
	"/podcasts": ["/podcasts", "/podcast", "/guests", "/guest"],
	"/blog": ["/blog", "/post", "/authors", "/author", "/newsletter"],
	"/topics": ["/topics", "/topic"],
	"/sponsors": ["/sponsors", "/sponsor"],
	"/sponsorships": ["/sponsorships"],
};

function matchesPrefixGroup(
	current: string,
	prefixes: readonly string[],
): boolean {
	return prefixes.some(
		(prefix) => current === prefix || current.startsWith(`${prefix}/`),
	);
}

/**
 * Determines whether a navigation link (`href`) is active for `currentPathname`.
 * Returns `aria-current="page"` for an exact URL match and `aria-current="true"`
 * when matching a descendant or associated detail route within that pillar.
 */
export function matchNavHref(
	currentPathname: string,
	href: string,
	options?: { prefix?: boolean },
): NavMatchResult {
	const prefix = options?.prefix ?? true;
	const cleanHref = stegaClean(href ?? "").trim() || "/";
	const isExternal = /^https?:\/\//i.test(cleanHref);

	if (isExternal) {
		return {
			cleanHref,
			isExternal: true,
			isExact: false,
			isActive: false,
			ariaCurrent: undefined,
		};
	}

	const current = normalizeNavPath(currentPathname);
	const target = normalizeNavPath(cleanHref);
	const isExact = current === target;

	if (!prefix || target === "/") {
		return {
			cleanHref: target,
			isExternal: false,
			isExact,
			isActive: isExact,
			ariaCurrent: isExact ? "page" : undefined,
		};
	}

	const pillarPrefixes = PILLAR_ROUTE_PREFIXES[target];
	const isActive = pillarPrefixes
		? matchesPrefixGroup(current, pillarPrefixes)
		: isExact || current.startsWith(`${target}/`);

	return {
		cleanHref: target,
		isExternal: false,
		isExact,
		isActive,
		ariaCurrent: isExact ? "page" : isActive ? "true" : undefined,
	};
}

/**
 * Resolves the active high-level category for the closed mobile header badge (`<lg`).
 * Returns `null` on `/` or utility routes that do not belong to a content pillar.
 */
export function resolveActivePillar(
	currentPathname: string,
): ActivePillarInfo | null {
	const current = normalizeNavPath(currentPathname);

	const pillars: ReadonlyArray<{
		id: ActivePillarInfo["id"];
		label: string;
		href: string;
	}> = [
		{ id: "courses", label: "Courses", href: "/courses" },
		{ id: "podcasts", label: "Podcasts", href: "/podcasts" },
		{ id: "blog", label: "Blog", href: "/blog" },
		{ id: "topics", label: "Topics", href: "/topics" },
		{ id: "sponsors", label: "Sponsors", href: "/sponsors" },
		{ id: "sponsorships", label: "Sponsorships", href: "/sponsorships" },
	];

	for (const pillar of pillars) {
		const prefixes = PILLAR_ROUTE_PREFIXES[pillar.href] ?? [pillar.href];
		if (matchesPrefixGroup(current, prefixes)) {
			return {
				...pillar,
				isExact: current === pillar.href,
			};
		}
	}

	return null;
}
