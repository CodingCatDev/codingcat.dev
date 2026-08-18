import { stegaClean } from "@sanity/client/stega";

/**
 * URL for a generated OG card.
 *
 * These are a fallback, not a replacement: when a document has a cover image
 * the card is that image, exactly as the Next app served it. Documents without
 * one previously produced no `og:image` at all — that is the gap these fill.
 */
export interface OgFallback {
	title: string;
	/** Badge text: Blog, Podcast, Author, Guest, Sponsor. */
	type?: "Blog" | "Podcast" | "Author" | "Guest" | "Sponsor";
	author?: string | null;
	episode?: number | null;
	subtitle?: string | null;
}

export function fallbackOgImage(origin: string, options: OgFallback) {
	const { title, type, author, episode, subtitle } = options;

	const params = new URLSearchParams({ title: stegaClean(title) ?? "" });

	let endpoint = "default";
	if (type === "Podcast") {
		endpoint = "podcast";
		if (episode) {
			params.set("episode", String(episode));
		}
	} else if (type === "Blog") {
		endpoint = "blog";
	} else if (type) {
		endpoint = "person";
		params.set("type", type);
	}

	const cleanAuthor = stegaClean(author);
	if (cleanAuthor && endpoint !== "person") {
		params.set("author", cleanAuthor);
	}

	const cleanSubtitle = stegaClean(subtitle);
	if (cleanSubtitle && endpoint === "default") {
		params.set("subtitle", cleanSubtitle);
	}

	return {
		url: `${origin}/api/og/${endpoint}.png?${params}`,
		alt: stegaClean(title) ?? "CodingCat.dev",
		width: 1200,
		height: 630,
	};
}
