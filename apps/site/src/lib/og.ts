import { stegaClean } from "@sanity/client/stega";

/**
 * URL for a generated OG card.
 *
 * Every route uses the branded 1200×630 CodingCat.dev card by default
 * (unless an explicit custom `ogImage` override is set in Sanity). When a
 * document has a `coverImage`, its Sanity CDN URL is passed via `image` (16:9
 * showcase for blog/podcast/page) or `avatar` (circular frame for profiles)
 * and rendered inside the card alongside the title, badge, and branding.
 */
export interface OgFallback {
	title: string;
	/** Badge text: Blog, Podcast, Author, Guest, Sponsor. */
	type?: "Blog" | "Podcast" | "Author" | "Guest" | "Sponsor";
	author?: string | null;
	episode?: number | null;
	subtitle?: string | null;
	avatar?: string | null;
	image?: string | null;
}

export function fallbackOgImage(origin: string, options: OgFallback) {
	const { title, type, author, episode, subtitle, avatar, image } = options;

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

	const cleanSubtitle = stegaClean(subtitle)?.trim();
	if (cleanSubtitle && cleanSubtitle.toLowerCase() !== "fix me") {
		params.set("subtitle", cleanSubtitle);
	}

	const cleanAvatar = stegaClean(avatar)?.trim();
	if (cleanAvatar && endpoint === "person") {
		params.set("avatar", cleanAvatar);
	}

	const cleanImage = stegaClean(image)?.trim();
	if (cleanImage && endpoint !== "person") {
		params.set("image", cleanImage);
	}

	return {
		url: `${origin}/api/og/${endpoint}.png?${params}`,
		alt: stegaClean(title) ?? "CodingCat.dev",
		width: 1200,
		height: 630,
	};
}
