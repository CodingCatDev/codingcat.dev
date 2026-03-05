import { Feed, type Author as FeedAuthor, type Item } from "feed";
import { sanityFetch } from "@/sanity/lib/live";
import type { RssQueryResult } from "@/sanity/types";
import { rssQuery, rssPodcastQuery } from "@/sanity/lib/queries";
import { toHTML } from "@portabletext/to-html";
import { urlForImage } from "@/sanity/lib/utils";

const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = productionDomain
	? `https://${productionDomain}`
	: "https://codingcat.dev";

/** Map Sanity _type to the URL path segment used on the site */
function typePath(type: string): string {
	switch (type) {
		case "post":
			return "blog";
		case "podcast":
			return "podcasts";
		case "course":
			return "courses";
		default:
			return type + "s";
	}
}

export async function buildFeed(params: {
	type: string;
	skip?: string;
	limit?: number;
	offset?: number;
}) {
	const isPodcast = params.type === "podcast";
	const query = isPodcast ? rssPodcastQuery : rssQuery;

	const data = (
		await sanityFetch({
			query,
			params: {
				type: params.type,
				skip: params.skip || "none",
				limit: params.limit || 10000,
				offset: params.offset || 0,
			},
			tags: isPodcast ? ["podcast-rss", "podcast"] : [params.type + "-rss", params.type],
		})
	).data as RssQueryResult;

	const feedPath = typePath(params.type);
	const currentYear = new Date().getFullYear();

	const feed = new Feed({
		title: `CodingCat.dev - ${params.type} feed`,
		description: `CodingCat.dev - ${params.type} feed`,
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
 * Build a podcast-specific RSS feed with iTunes namespace tags.
 * Returns raw XML string with proper iTunes/podcast namespace support.
 */
export async function buildPodcastFeed(params: {
	skip?: string;
	limit?: number;
	offset?: number;
}): Promise<string> {
	const data = (
		await sanityFetch({
			query: rssPodcastQuery,
			params: {
				type: "podcast",
				skip: params.skip || "none",
				limit: params.limit || 10000,
				offset: params.offset || 0,
			},
		})
	).data as RssQueryResult;

	const currentYear = new Date().getFullYear();
	const feedUrl = `${site}/podcasts/rss.xml`;
	const feedImage = `${site}/icon.svg`;

	// Build RSS 2.0 XML with iTunes namespace manually for full podcast support
	const items = data
		.map((item) => {
			const imageUrl =
				urlForImage(item.coverImage)?.width(1400).height(1400).url() || feedImage;
			const pubDate = item.date
				? new Date(item.date).toUTCString()
				: new Date().toUTCString();
			const link = `${site}/${item._type}/${item.slug}`;
			const description = escapeXml(item.excerpt || "");
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
