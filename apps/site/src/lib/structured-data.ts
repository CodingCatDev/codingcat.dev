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

interface ArticleInput {
	title?: string | null;
	excerpt?: string | null;
	date?: string | null;
	_updatedAt?: string | null;
	imageUrl?: string;
	authors?: Array<{ title?: string | null; slug?: string | null }> | null;
}

export function articleSchema(
	origin: string,
	content: ArticleInput,
	path: string,
): Node {
	const url = absoluteUrl(path, origin);
	const authors = (content.authors ?? [])
		.filter((a): a is { title: string; slug?: string | null } =>
			Boolean(a?.title),
		)
		.map((a) => ({
			"@type": "Person",
			name: a.title,
			...(a.slug ? { url: absoluteUrl(`/author/${a.slug}`, origin) } : {}),
		}));

	return {
		"@type": "Article",
		"@id": `${url}#article`,
		headline: content.title ?? undefined,
		description: content.excerpt ?? undefined,
		...(content.imageUrl ? { image: content.imageUrl } : {}),
		...(content.date ? { datePublished: content.date } : {}),
		...(content._updatedAt ? { dateModified: content._updatedAt } : {}),
		...(authors.length ? { author: authors } : {}),
		publisher: { "@id": orgId(origin) },
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		url,
	};
}

interface PersonInput {
	title?: string | null;
	excerpt?: string | null;
	imageUrl?: string;
	socials?: Record<string, unknown> | null;
	websites?: unknown[] | null;
}

/** Collect URL-like strings from the loosely-typed socials object and websites array. */
function collectProfileUrls(
	socials?: Record<string, unknown> | null,
	websites?: unknown[] | null,
): string[] {
	const urls: string[] = [];
	const pushIfUrl = (value: unknown) => {
		if (typeof value === "string" && value.startsWith("http")) {
			urls.push(value);
		}
	};
	if (socials) {
		for (const value of Object.values(socials)) {
			pushIfUrl(value);
		}
	}
	if (Array.isArray(websites)) {
		for (const entry of websites) {
			if (entry && typeof entry === "object") {
				for (const value of Object.values(entry)) {
					pushIfUrl(value);
				}
			}
		}
	}
	return Array.from(new Set(urls));
}

export function personSchema(
	origin: string,
	content: PersonInput,
	path: string,
): Node {
	const url = absoluteUrl(path, origin);
	const sameAs = collectProfileUrls(content.socials, content.websites);

	return {
		"@type": "Person",
		"@id": `${url}#person`,
		name: content.title ?? undefined,
		description: content.excerpt ?? undefined,
		...(content.imageUrl ? { image: content.imageUrl } : {}),
		...(sameAs.length ? { sameAs } : {}),
		url,
	};
}
