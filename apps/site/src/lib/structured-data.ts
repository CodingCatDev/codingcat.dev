import { absoluteUrl, SITE_NAME } from "./site";

/**
 * JSON-LD builders, ported from the Next app's lib/structured-data.ts.
 *
 * The `schema-dts` types are deliberately not carried over — they cost a
 * dependency and a great deal of type gymnastics (the Next version needed a
 * triple cast to build a @graph) to describe objects that are serialized to
 * a string immediately. The shapes below are the ones actually emitted.
 */

interface Node {
	"@type": string;
	"@id"?: string;
	[key: string]: unknown;
}

export function buildGraph(nodes: Node[]) {
	return {
		"@context": "https://schema.org",
		"@graph": nodes,
	};
}

export const orgId = (origin: string) => `${origin}/#organization`;
export const websiteId = (origin: string) => `${origin}/#website`;

export function organizationSchema(origin: string, logoUrl?: string): Node {
	return {
		"@type": "Organization",
		"@id": orgId(origin),
		name: SITE_NAME,
		url: origin,
		...(logoUrl ? { logo: { "@type": "ImageObject", url: logoUrl } } : {}),
		sameAs: [
			"https://www.youtube.com/@CodingCatDev",
			"https://twitter.com/CodingCatDev",
			"https://github.com/codingcatdev",
		],
	};
}

export function websiteSchema(origin: string): Node {
	return {
		"@type": "WebSite",
		"@id": websiteId(origin),
		name: SITE_NAME,
		url: origin,
		publisher: { "@id": orgId(origin) },
	};
}

export function breadcrumbSchema(
	origin: string,
	crumbs: Array<{ name: string; path: string }>,
): Node {
	return {
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path, origin),
		})),
	};
}
