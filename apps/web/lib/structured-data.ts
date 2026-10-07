import type {
	Article,
	BreadcrumbList,
	Graph,
	Organization,
	Person,
	Thing,
	WebSite,
	WithContext,
} from "schema-dts";

import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type GraphNode = Organization | WebSite | Article | Person | BreadcrumbList;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Wrap one or more schema nodes in a single @graph document. */
export function buildGraph(nodes: GraphNode[]): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@graph": nodes,
	} as unknown as Graph as unknown as WithContext<Thing>;
}

export function organizationSchema(logoUrl?: string): Organization {
	return {
		"@type": "Organization",
		"@id": ORG_ID,
		name: SITE_NAME,
		url: SITE_URL,
		...(logoUrl
			? { logo: { "@type": "ImageObject", url: logoUrl } as const }
			: {}),
		sameAs: [
			"https://www.youtube.com/@CodingCatDev",
			"https://twitter.com/CodingCatDev",
			"https://github.com/codingcatdev",
		],
	};
}

export function websiteSchema(): WebSite {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		name: SITE_NAME,
		url: SITE_URL,
		publisher: { "@id": ORG_ID },
	};
}

interface ContentForArticle {
	title?: string | null;
	excerpt?: string | null;
	date?: string | null;
	_updatedAt?: string | null;
	coverImage?: unknown;
	author?: Array<{ title?: string | null; slug?: string | null }> | null;
}

export function articleSchema(
	content: ContentForArticle,
	path: string,
): Article {
	const url = absoluteUrl(path);
	const image = resolveOpenGraphImage(content.coverImage)?.url;
	const authors = (content.author ?? [])
		.filter((a): a is { title: string; slug?: string | null } => !!a?.title)
		.map<Person>((a) => ({
			"@type": "Person",
			name: a.title,
			...(a.slug ? { url: absoluteUrl(`/author/${a.slug}`) } : {}),
		}));

	return {
		"@type": "Article",
		"@id": `${url}#article`,
		headline: content.title ?? undefined,
		description: content.excerpt ?? undefined,
		...(image ? { image } : {}),
		...(content.date ? { datePublished: content.date } : {}),
		...(content._updatedAt ? { dateModified: content._updatedAt } : {}),
		...(authors.length ? { author: authors } : {}),
		publisher: { "@id": ORG_ID },
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		url,
	};
}

interface ContentForPerson {
	title?: string | null;
	excerpt?: string | null;
	coverImage?: unknown;
	socials?: Record<string, unknown> | null;
	websites?: unknown[] | null;
}

/** Collect URL-like strings from the loosely-typed socials object and websites array. */
function collectProfileUrls(
	socials?: Record<string, unknown> | null,
	websites?: unknown[] | null,
): string[] {
	const urls: string[] = [];
	const pushIfUrl = (v: unknown) => {
		if (typeof v === "string" && v.startsWith("http")) urls.push(v);
	};
	if (socials) for (const v of Object.values(socials)) pushIfUrl(v);
	if (Array.isArray(websites)) {
		for (const w of websites) {
			if (w && typeof w === "object") {
				for (const v of Object.values(w)) pushIfUrl(v);
			}
		}
	}
	return Array.from(new Set(urls));
}

export function personSchema(content: ContentForPerson, path: string): Person {
	const url = absoluteUrl(path);
	const image = resolveOpenGraphImage(content.coverImage)?.url;
	const sameAs = collectProfileUrls(content.socials, content.websites);

	return {
		"@type": "Person",
		"@id": `${url}#person`,
		name: content.title ?? undefined,
		description: content.excerpt ?? undefined,
		...(image ? { image } : {}),
		...(sameAs.length ? { sameAs } : {}),
		url,
	};
}

export function breadcrumbSchema(
	crumbs: { name: string; path: string }[],
): BreadcrumbList {
	return {
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path),
		})),
	};
}
