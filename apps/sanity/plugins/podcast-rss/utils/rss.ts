import type { Podcast } from "../index";
import type { Episode } from "../types";

/**
 * Read a direct child element's text content.
 * Namespaced tags (itunes:*) are matched by their full prefixed name, which is
 * what an XML-mode DOMParser reports as `tagName`.
 */
function text(parent: Element, tag: string): string {
	for (const child of Array.from(parent.children)) {
		if (child.tagName === tag) return child.textContent?.trim() ?? "";
	}
	return "";
}

function element(parent: Element, tag: string): Element | undefined {
	return Array.from(parent.children).find((c) => c.tagName === tag);
}

/**
 * Parse a podcast RSS feed into Episode records.
 *
 * Uses the browser-native DOMParser rather than `xml2js`: this runs inside the
 * Studio (a browser), and xml2js is a Node library that only resolved via a
 * Vite polyfill that Vite 8 no longer provides.
 */
export async function fetchRssToJson(
	podcast: Podcast | undefined,
): Promise<Episode[]> {
	if (!podcast) return [];

	const response = await fetch(podcast.url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch RSS feed (${response.status} ${response.statusText})`,
		);
	}

	const doc = new DOMParser().parseFromString(
		await response.text(),
		"application/xml",
	);
	if (doc.querySelector("parsererror")) {
		throw new Error("Failed to parse RSS feed: malformed XML");
	}

	return Array.from(doc.getElementsByTagName("item")).map((item) => {
		const guidEl = element(item, "guid");
		const pubDate = text(item, "pubDate");
		const parsedDate = pubDate ? new Date(pubDate) : null;
		const itunesImage = element(item, "itunes:image");

		return {
			title: text(item, "title"),
			description: text(item, "description"),
			link: text(item, "link"),
			pubDate:
				parsedDate && !Number.isNaN(parsedDate.valueOf())
					? parsedDate.toISOString()
					: new Date().toISOString(),
			guid: {
				id: guidEl?.textContent?.trim() ?? "",
				isPermaLink: guidEl?.getAttribute("isPermaLink") === "true",
			},
			enclosures: Array.from(item.children)
				.filter((c) => c.tagName === "enclosure")
				.map((enc) => ({
					url: enc.getAttribute("url") ?? "",
					length: Number(enc.getAttribute("length") ?? 0) || 0,
					type: enc.getAttribute("type") ?? "",
				})),
			itunes: {
				summary: text(item, "itunes:summary"),
				explicit: text(item, "itunes:explicit"),
				duration: text(item, "itunes:duration"),
				season: text(item, "itunes:season"),
				episode: text(item, "itunes:episode"),
				episodeType: text(item, "itunes:episodeType"),
				image: { href: itunesImage?.getAttribute("href") ?? "" },
			},
		} satisfies Episode;
	});
}
