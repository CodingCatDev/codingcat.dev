import { Feed, type Item } from "feed";
import { sanityFetch } from "@/sanity/lib/live";
import type { LivePerspective } from "next-sanity/live";
import type { RssQueryResult } from "@/sanity/types";
import { rssQuery, rssPodcastQuery } from "@/sanity/lib/queries";
import { toHTML } from "@portabletext/to-html";
import { urlForImage } from "@/sanity/lib/utils";

const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = productionDomain
	? `https://${productionDomain}`
	: "https://codingcat.dev";

/**
 * Feeds only ever surface the most recent entries. Pulling the entire archive
 * (the previous `10000`) meant every cache miss fetched and serialized every
 * post/podcast — expensive on both the Sanity side and in `toHTML`.
 */
const DEFAULT_FEED_LIMIT = 50;

/** Map Sanity _type to the URL path segment used on the site */
function typePath(type: string): string {
	switch (type) {
		case "post":
			return "blog";
		case "podcast":
			return "podcasts";
		default:
			return type + "s";
	}
}

/**
 * Fetches feed data. Called only from within a `'use cache'` boundary so the
 * sync tags `sanityFetch` attaches propagate to the surrounding cache entry —
 * the serialized feed below is then cached and revalidated by Sanity Live when
 * the underlying content changes, instead of being re-serialized per request.
 */
async function fetchFeedData(
	type: string,
	perspective: LivePerspective,
): Promise<RssQueryResult> {
	const query = type === "podcast" ? rssPodcastQuery : rssQuery;
	const { data } = await sanityFetch({
		query,
		params: {
			type,
			skip: "none",
			limit: DEFAULT_FEED_LIMIT,
			offset: 0,
		},
		perspective,
		stega: false,
	});
	return data as RssQueryResult;
}

/** Build a `feed` library `Feed` from already-fetched data (no I/O). */
function createFeed(data: RssQueryResult, type: string): Feed {
	const feedPath = typePath(type);
	const currentYear = new Date().getFullYear();
	const isPodcast = type === "podcast";

	const feed = new Feed({
		title: `CodingCat.dev - ${type} feed`,
		description: `CodingCat.dev - ${type} feed`,
		id: `${site}`,
		link: `${site}/${feedPath}`,
		language: "en",
		image: `${site}/icon.svg`,
		favicon: `${site}/favicon.ico`,
		copyright: `All rights reserved ${currentYear}, CodingCat.dev`,
		updated: new Date(),
		feedLinks: {
			rss2: `${site}/${feedPath}/rss.xml`,
			json: `${site}/${feedPath}/rss.json`,
		},
		author: {
			name: "Alex Patterson",
			email: "alex@codingcat.dev",
			link: `${site}`,
		},
	});

	for (const item of data) {
		const imageUrl =
			urlForImage(item.coverImage)?.width(1200).height(630).url() || undefined;

		const feedItem: Item = {
			title: item.title || "",
			content:
				item.content && Array.isArray(item.content) ? toHTML(item.content) : "",
			link: `${site}/${item._type}/${item.slug}`,
			description: item.excerpt || "",
			image: imageUrl,
			date: item.date ? new Date(item.date) : new Date(),
			id: item._id,
			author: item.author
				? item.author.map((a) => ({
						name: a.title,
						link: `${site}/author/${a.slug}`,
					}))
				: [
						{
							name: "Alex Patterson",
							email: "alex@codingcat.dev",
							link: `${site}/author/alex-patterson`,
						},
					],
		};

		// Add podcast enclosure from Spotify RSS data if available
		if (isPodcast && "spotify" in item && (item as any).spotify) {
			const spotify = (item as any).spotify;
			const enclosures = spotify.enclosures;
			if (Array.isArray(enclosures) && enclosures.length > 0) {
				const enc = enclosures[0];
				if (enc.url) {
					feedItem.enclosure = {
						url: enc.url,
						length: enc.length || 0,
						type: enc.type || "audio/mpeg",
					};
				}
			}
			// Add audio URL as fallback if no enclosure but link exists
			if (!feedItem.enclosure && spotify.link) {
				feedItem.audio = spotify.link;
			}
		}

		feed.addItem(feedItem);
	}

	return feed;
}

/**
 * Cached RSS 2.0 string for the `feed`-library feeds (blog).
 * The `sanityFetch` runs inside this `'use cache'` scope so the rendered XML is
 * cached and tagged for on-demand revalidation via Sanity Live.
 */
export async function getFeedRss2(params: {
	type: string;
	perspective: LivePerspective;
}): Promise<string> {
	"use cache";
	const data = await fetchFeedData(params.type, params.perspective);
	return createFeed(data, params.type).rss2();
}

/** Cached JSON Feed string for the `feed`-library feeds (blog + podcast). */
export async function getFeedJson(params: {
	type: string;
	perspective: LivePerspective;
}): Promise<string> {
	"use cache";
	const data = await fetchFeedData(params.type, params.perspective);
	return createFeed(data, params.type).json1();
}

/**
 * Cached podcast RSS string with the full iTunes namespace. Manually serialized
 * XML, produced inside `'use cache'` so it isn't rebuilt on every request.
 */
export async function getPodcastFeedXml(params: {
	perspective: LivePerspective;
}): Promise<string> {
	"use cache";
	const data = await fetchFeedData("podcast", params.perspective);
	return buildPodcastXml(data);
}

/** Serialize podcast data into RSS 2.0 XML with iTunes namespace tags. */
function buildPodcastXml(data: RssQueryResult): string {
	const currentYear = new Date().getFullYear();
	const feedUrl = `${site}/podcasts/rss.xml`;
	const feedImage = `${site}/icon.svg`;

	const items = data
		.map((item) => {
			const imageUrl =
				urlForImage(item.coverImage)?.width(1400).height(1400).url() ||
				feedImage;
			const pubDate = item.date
				? new Date(item.date).toUTCString()
				: new Date().toUTCString();
			const link = `${site}/${item._type}/${item.slug}`;
			const title = escapeXml(item.title || "");

			let enclosureXml = "";
			let itunesXml = "";
			let itunesDuration = "";
			let itunesSeason = "";
			let itunesEpisode = "";
			let itunesEpisodeType = "full";

			// Extract podcast-specific fields
			const podcastItem = item as any;
			if (podcastItem.spotify) {
				const spotify = podcastItem.spotify;
				if (
					Array.isArray(spotify.enclosures) &&
					spotify.enclosures.length > 0
				) {
					const enc = spotify.enclosures[0];
					if (enc.url) {
						enclosureXml = `<enclosure url="${escapeXml(enc.url)}" length="${enc.length || 0}" type="${escapeXml(enc.type || "audio/mpeg")}" />\n      `;
					}
				}
				if (spotify.itunes) {
					const it = spotify.itunes;
					if (it.duration) itunesDuration = it.duration;
					if (it.episodeType) itunesEpisodeType = it.episodeType;
					if (it.explicit)
						itunesXml += `\n        <itunes:explicit>${escapeXml(it.explicit)}</itunes:explicit>`;
					if (it.summary)
						itunesXml += `\n        <itunes:summary>${escapeXml(it.summary)}</itunes:summary>`;
					if (it.image?.href)
						itunesXml += `\n        <itunes:image href="${escapeXml(it.image.href)}" />`;
				}
			}

			if (podcastItem.season) {
				itunesSeason = `\n        <itunes:season>${podcastItem.season}</itunes:season>`;
			}
			if (podcastItem.episode) {
				itunesEpisode = `\n        <itunes:episode>${podcastItem.episode}</itunes:episode>`;
			}

			const authors = item.author
				? item.author.map((a) => a.title).join(", ")
				: "Alex Patterson";

			return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${item._id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.excerpt || ""}]]></description>
      <author>${escapeXml(authors)}</author>
      ${enclosureXml}<itunes:title>${title}</itunes:title>
      <itunes:author>${escapeXml(authors)}</itunes:author>
      <itunes:image href="${escapeXml(imageUrl)}" />${itunesSeason}${itunesEpisode}
      <itunes:episodeType>${itunesEpisodeType}</itunes:episodeType>${itunesDuration ? `\n        <itunes:duration>${escapeXml(itunesDuration)}</itunes:duration>` : ""}${itunesXml}
    </item>`;
		})
		.join("\n");

	const lastBuildDate = new Date().toUTCString();

	return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.apple.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>CodingCat.dev Podcast</title>
    <link>${site}/podcasts</link>
    <description>The CodingCat.dev Podcast features conversations about web development, design, and technology with industry experts and community members.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <copyright>All rights reserved ${currentYear}, CodingCat.dev</copyright>
    <itunes:author>Alex Patterson</itunes:author>
    <itunes:owner>
      <itunes:name>Alex Patterson</itunes:name>
      <itunes:email>alex@codingcat.dev</itunes:email>
    </itunes:owner>
    <itunes:image href="${feedImage}" />
    <itunes:category text="Technology" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <image>
      <url>${feedImage}</url>
      <title>CodingCat.dev Podcast</title>
      <link>${site}/podcasts</link>
    </image>
${items}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
