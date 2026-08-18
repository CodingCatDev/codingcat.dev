import { portableTextToHtml } from "./portable-text-html";
import type { SanityRequestContext } from "./sanity/context";
import { SITE_NAME } from "./site";
import { cdata, escapeXml, imageMimeType, rfc822 } from "./xml";

/**
 * Feed serialization.
 *
 * The output reproduces what the `feed` npm package emitted, element order and
 * all, because these documents are already subscribed to. In particular:
 *
 * - `<guid isPermaLink="false">` stays the Sanity `_id`. Changing a podcast
 *   GUID makes Apple and Spotify re-publish the entire back catalogue as new
 *   episodes; this is the single most destructive thing this file could get
 *   wrong.
 * - Enclosure MIME types keep the library's `image/jpg` spelling.
 *
 * The library itself is not ported: it reaches for Node built-ins that are
 * awkward on workerd, and this is a fixed document shape.
 */

/** Feeds only ever carry the most recent entries. */
export const FEED_LIMIT = 50;

const FEED_AUTHOR = {
	name: "Alex Patterson",
	email: "alex@codingcat.dev",
	slug: "alex-patterson",
};

/** Sanity `_type` to the URL segment its listing lives under. */
export function typePath(type: string): string {
	switch (type) {
		case "post":
			return "blog";
		case "podcast":
			return "podcasts";
		default:
			return `${type}s`;
	}
}

export interface FeedItemSource {
	_id: string;
	_type: string;
	title: string;
	slug: string | null;
	excerpt?: string | null;
	coverImage?: unknown;
	date?: string | null;
	content?: unknown;
	author?: Array<{ title: string; slug: string | null }> | null;
	season?: number | null;
	episode?: number | null;
	spotify?: {
		link?: string;
		enclosures?: Array<{ url?: string; length?: number; type?: string }>;
		itunes?: {
			duration?: string;
			episodeType?: string;
			explicit?: string;
			summary?: string;
			image?: { href?: string };
		};
	} | null;
}

interface FeedContext {
	origin: string;
	sanity: SanityRequestContext;
	type: "post" | "podcast";
	items: FeedItemSource[];
	now: Date;
}

function itemUrl(origin: string, item: FeedItemSource) {
	return `${origin}/${item._type}/${item.slug}`;
}

function itemImage(
	ctx: FeedContext,
	item: FeedItemSource,
	width: number,
	height: number,
) {
	return ctx.sanity
		.urlForImage(item.coverImage as never)
		?.width(width)
		.height(height)
		.url();
}

function itemHtml(ctx: FeedContext, item: FeedItemSource) {
	return portableTextToHtml(item.content, {
		origin: ctx.origin,
		imageUrl: (source) =>
			ctx.sanity
				.urlForImage(source as never)
				?.width(1200)
				.url(),
	});
}

function itemAuthors(item: FeedItemSource) {
	return item.author?.length ? item.author : null;
}

// --- RSS 2.0 (blog) ---

export function buildRss2(ctx: FeedContext): string {
	const { origin, type, items, now } = ctx;
	const feedPath = typePath(type);
	const title = `${SITE_NAME} - ${type} feed`;
	const home = `${origin}/${feedPath}`;

	const body = items
		.map((item) => {
			const image = itemImage(ctx, item, 1200, 630);
			const authors = itemAuthors(item) ?? [{ title: FEED_AUTHOR.name }];

			// One element per author, and description omitted entirely when the
			// excerpt is empty — both reproduce the `feed` library exactly, so
			// existing subscribers see no change.
			const authorTags = authors
				.map(
					(author) =>
						`\n            <author>${escapeXml(author.title)}</author>`,
				)
				.join("");

			const description = item.excerpt
				? `\n            <description>${cdata(item.excerpt)}</description>`
				: "";

			const enclosure = image
				? `\n            <enclosure url="${escapeXml(image)}" length="0" type="${imageMimeType(image)}"/>`
				: "";

			return `        <item>
            <title>${cdata(item.title)}</title>
            <link>${escapeXml(itemUrl(origin, item))}</link>
            <guid isPermaLink="false">${escapeXml(item._id)}</guid>
            <pubDate>${rfc822(item.date ? new Date(item.date) : now)}</pubDate>${description}
            <content:encoded>${cdata(itemHtml(ctx, item))}</content:encoded>${authorTags}${enclosure}
        </item>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>${escapeXml(title)}</title>
        <link>${escapeXml(home)}</link>
        <description>${escapeXml(title)}</description>
        <lastBuildDate>${rfc822(now)}</lastBuildDate>
        <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
        <generator>${escapeXml(origin)}</generator>
        <language>en</language>
        <image>
            <title>${escapeXml(title)}</title>
            <url>${escapeXml(origin)}/icon.svg</url>
            <link>${escapeXml(home)}</link>
        </image>
        <copyright>All rights reserved ${now.getUTCFullYear()}, ${SITE_NAME}</copyright>
${body}
    </channel>
</rss>`;
}

// --- JSON Feed 1.0 ---

export function buildJsonFeed(ctx: FeedContext): string {
	const { origin, type, items } = ctx;
	const feedPath = typePath(type);
	const title = `${SITE_NAME} - ${type} feed`;

	return JSON.stringify(
		{
			version: "https://jsonfeed.org/version/1",
			title,
			home_page_url: `${origin}/${feedPath}`,
			feed_url: `${origin}/${feedPath}/rss.json`,
			description: title,
			icon: `${origin}/icon.svg`,
			author: {
				name: FEED_AUTHOR.name,
				url: origin,
			},
			items: items.map((item) => {
				const authors = itemAuthors(item);
				const primary = authors?.[0];
				return {
					id: item._id,
					content_html: itemHtml(ctx, item),
					url: itemUrl(origin, item),
					title: item.title,
					summary: item.excerpt ?? undefined,
					image: itemImage(ctx, item, 1200, 630),
					date_modified: item.date
						? new Date(item.date).toISOString()
						: undefined,
					author: primary
						? {
								name: primary.title,
								url: `${origin}/author/${primary.slug}`,
							}
						: {
								name: FEED_AUTHOR.name,
								url: `${origin}/author/${FEED_AUTHOR.slug}`,
							},
				};
			}),
		},
		null,
		2,
	);
}

// --- Podcast RSS with the iTunes namespace ---

export function buildPodcastRss(ctx: FeedContext): string {
	const { origin, items, now } = ctx;
	const feedUrl = `${origin}/podcasts/rss.xml`;
	const feedImage = `${origin}/icon.svg`;

	const body = items
		.map((item) => {
			const image = itemImage(ctx, item, 1400, 1400) ?? feedImage;
			const title = escapeXml(item.title);
			const authors = itemAuthors(item);
			const authorName = authors
				? authors.map((a) => a.title).join(", ")
				: FEED_AUTHOR.name;

			const spotify = item.spotify;
			const enclosure = spotify?.enclosures?.[0];
			const enclosureXml = enclosure?.url
				? `<enclosure url="${escapeXml(enclosure.url)}" length="${enclosure.length ?? 0}" type="${escapeXml(enclosure.type ?? "audio/mpeg")}" />\n      `
				: "";

			const itunes = spotify?.itunes;
			let itunesXml = "";
			if (itunes?.explicit) {
				itunesXml += `\n        <itunes:explicit>${escapeXml(itunes.explicit)}</itunes:explicit>`;
			}
			if (itunes?.summary) {
				itunesXml += `\n        <itunes:summary>${escapeXml(itunes.summary)}</itunes:summary>`;
			}
			if (itunes?.image?.href) {
				itunesXml += `\n        <itunes:image href="${escapeXml(itunes.image.href)}" />`;
			}

			const season = item.season
				? `\n        <itunes:season>${item.season}</itunes:season>`
				: "";
			const episode = item.episode
				? `\n        <itunes:episode>${item.episode}</itunes:episode>`
				: "";
			const duration = itunes?.duration
				? `\n        <itunes:duration>${escapeXml(itunes.duration)}</itunes:duration>`
				: "";

			return `    <item>
      <title>${title}</title>
      <link>${escapeXml(itemUrl(origin, item))}</link>
      <guid isPermaLink="false">${escapeXml(item._id)}</guid>
      <pubDate>${rfc822(item.date ? new Date(item.date) : now)}</pubDate>
      <description>${cdata(item.excerpt ?? "")}</description>
      <author>${escapeXml(authorName)}</author>
      ${enclosureXml}<itunes:title>${title}</itunes:title>
      <itunes:author>${escapeXml(authorName)}</itunes:author>
      <itunes:image href="${escapeXml(image)}" />${season}${episode}
      <itunes:episodeType>${escapeXml(itunes?.episodeType ?? "full")}</itunes:episodeType>${duration}${itunesXml}
    </item>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.apple.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${SITE_NAME} Podcast</title>
    <link>${escapeXml(origin)}/podcasts</link>
    <description>The ${SITE_NAME} Podcast features conversations about web development, design, and technology with industry experts and community members.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(now)}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <copyright>All rights reserved ${now.getUTCFullYear()}, ${SITE_NAME}</copyright>
    <itunes:author>${FEED_AUTHOR.name}</itunes:author>
    <itunes:owner>
      <itunes:name>${FEED_AUTHOR.name}</itunes:name>
      <itunes:email>${FEED_AUTHOR.email}</itunes:email>
    </itunes:owner>
    <itunes:image href="${escapeXml(feedImage)}" />
    <itunes:category text="Technology" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <image>
      <url>${escapeXml(feedImage)}</url>
      <title>${SITE_NAME} Podcast</title>
      <link>${escapeXml(origin)}/podcasts</link>
    </image>
${body}
  </channel>
</rss>`;
}

export type { FeedContext };
