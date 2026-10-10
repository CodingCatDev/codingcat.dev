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
			"https://www.linkedin.com/company/codingcatdev",
			"https://bsky.app/profile/codingcat.dev",
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
	articleType?: "TechArticle" | "Article";
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
		"@type": content.articleType ?? "TechArticle",
		"@id": `${url}#article`,
		headline: content.title ?? undefined,
		description: content.excerpt ?? undefined,
		...(content.imageUrl ? { image: content.imageUrl } : {}),
		...(content.date ? { datePublished: content.date } : {}),
		...(content._updatedAt ? { dateModified: content._updatedAt } : {}),
		...(authors.length ? { author: authors } : {}),
		publisher: { "@id": orgId(origin) },
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: ["article h1", "article p:first-of-type"],
		},
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

export function videoObjectSchema(
	origin: string,
	video: {
		title?: string | null;
		description?: string | null;
		uploadDate?: string | null;
		thumbnailUrl?: string;
		youtubeUrl?: string | null;
		durationSeconds?: number | null;
	},
	path: string,
): Node | null {
	if (!video.youtubeUrl) return null;

	const url = absoluteUrl(path, origin);
	// Format ISO 8601 duration: PT#M#S or PT#S
	let durationIso: string | undefined;
	if (video.durationSeconds && video.durationSeconds > 0) {
		const hours = Math.floor(video.durationSeconds / 3600);
		const minutes = Math.floor((video.durationSeconds % 3600) / 60);
		const seconds = Math.floor(video.durationSeconds % 60);
		let d = "PT";
		if (hours > 0) d += `${hours}H`;
		if (minutes > 0) d += `${minutes}M`;
		if (seconds > 0 || d === "PT") d += `${seconds}S`;
		durationIso = d;
	}

	return {
		"@type": "VideoObject",
		"@id": `${url}#video`,
		name: video.title ?? undefined,
		description: video.description ?? undefined,
		...(video.thumbnailUrl ? { thumbnailUrl: [video.thumbnailUrl] } : {}),
		...(video.uploadDate ? { uploadDate: video.uploadDate } : {}),
		...(durationIso ? { duration: durationIso } : {}),
		contentUrl: video.youtubeUrl,
		embedUrl: video.youtubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/"),
	};
}

export function faqSchema(
	faqs: Array<{ question: string; answer: string }>,
): Node | null {
	if (!faqs || faqs.length === 0) return null;

	return {
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * Automatically extracts Q&A pairs from Portable Text blocks where an H2/H3 heading
 * is phrased as a question (ends with `?` or starts with How/Why/What/When/Where/Can/Should/Is).
 */
export function extractFaqsFromPortableText(
	blocks: unknown,
): Array<{ question: string; answer: string }> {
	if (!Array.isArray(blocks)) return [];

	const faqs: Array<{ question: string; answer: string }> = [];
	let currentQuestion: string | null = null;
	let currentAnswerParts: string[] = [];

	const flush = () => {
		if (currentQuestion && currentAnswerParts.length > 0) {
			const answer = currentAnswerParts.join(" ").trim();
			if (answer.length >= 25) {
				faqs.push({ question: currentQuestion, answer: answer.slice(0, 600) });
			}
		}
		currentQuestion = null;
		currentAnswerParts = [];
	};

	for (const block of blocks) {
		if (!block || typeof block !== "object") continue;
		const b = block as {
			_type?: string;
			style?: string;
			children?: Array<{ text?: string }>;
		};
		if (b._type !== "block" || !Array.isArray(b.children)) continue;

		const text = b.children
			.map((c) => (typeof c?.text === "string" ? c.text : ""))
			.join("")
			.trim();
		if (!text) continue;

		if (b.style === "h2" || b.style === "h3" || b.style === "h4") {
			flush();
			const isQuestion =
				text.endsWith("?") ||
				/^(how|why|what|when|where|can|should|is|does|do)\b/i.test(text);
			if (isQuestion) {
				currentQuestion = text.endsWith("?") ? text : `${text}?`;
			}
		} else if (currentQuestion && currentAnswerParts.length < 3) {
			currentAnswerParts.push(text);
		}
	}

	flush();
	return faqs.slice(0, 8);
}

interface PodcastEpisodeInput {
	title?: string | null;
	excerpt?: string | null;
	date?: string | null;
	imageUrl?: string;
	season?: number | null;
	episode?: number | null;
	audioUrl?: string | null;
}

export function podcastEpisodeSchema(
	origin: string,
	content: PodcastEpisodeInput,
	path: string,
): Node {
	const url = absoluteUrl(path, origin);
	return {
		"@type": "PodcastEpisode",
		"@id": `${url}#episode`,
		url,
		name: content.title ?? undefined,
		description: content.excerpt ?? undefined,
		...(content.date ? { datePublished: content.date } : {}),
		...(content.imageUrl ? { image: content.imageUrl } : {}),
		...(content.season ? { seasonNumber: content.season } : {}),
		...(content.episode ? { episodeNumber: content.episode } : {}),
		...(content.audioUrl
			? {
					associatedMedia: {
						"@type": "AudioObject",
						contentUrl: content.audioUrl,
					},
				}
			: {}),
		partOfSeries: {
			"@type": "PodcastSeries",
			name: "CodingCat.dev Podcast",
			url: `${origin}/podcasts`,
		},
	};
}
