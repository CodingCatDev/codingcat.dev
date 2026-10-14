import crypto from "node:crypto";

export const ANCHOR_RSS_URL = "https://anchor.fm/s/115b203c/podcast/rss";
export const APPLE_PODCAST_ID = "1491655542";
export const APPLE_SHOW_URL =
	"https://podcasts.apple.com/us/podcast/codingcat-dev-podcast/id1491655542";
export const SPOTIFY_SHOW_URL =
	"https://open.spotify.com/show/2kiOI0PCB2jXMU0cdqUy4z";
export const OVERCAST_SHOW_URL = "https://overcast.fm/itunes1491655542";
export const POCKET_CASTS_SHOW_UUID = "79f99220-fd32-0137-b5ad-0acc26574db2";
export const POCKET_CASTS_SHOW_URL = "https://pca.st/aysv9xg5";
export const CASTBOX_CHANNEL_ID = "2508485";
export const CASTBOX_SHOW_URL =
	"https://castbox.fm/channel/CodingCat.dev-Podcast-id2508485";
export const CASTRO_SHOW_URL =
	"https://castro.fm/podcast/ee563e73-ec44-4460-b253-274ca4236475";

export interface PodcastRssEpisodeRecord {
	title?: string;
	description?: string;
	link?: string;
	guid?: {
		id?: string;
		isPermaLink?: boolean;
	};
	pubDate?: string;
	enclosures?: Array<{
		_key: string;
		url: string;
		length: number;
		type: string;
	}>;
	itunes?: {
		summary?: string;
		explicit?: string;
		duration?: string;
		season?: string;
		episode?: string;
		episodeType?: string;
		image?: {
			href?: string;
		};
	};
}

export interface ListenLinksRecord {
	youtube?: string;
	spotify?: string;
	apple?: string;
	overcast?: string;
	pocketCasts?: string;
	castbox?: string;
	castro?: string;
	rss?: string;
}

export interface SanityPodcastDoc {
	_id: string;
	_type?: string;
	title?: string;
	slug?: { current?: string } | string;
	season?: number;
	episode?: number;
	youtube?: string;
	spotify?: PodcastRssEpisodeRecord | null;
	listenLinks?: ListenLinksRecord | null;
}

export interface ProviderCatalog {
	rssItems: PodcastRssEpisodeRecord[];
	spotifyByGuid: Map<string, string>;
	spotifyBySharePath: Map<string, string>;
	spotifyByTitle: Map<string, string>;
	appleByGuid: Map<string, string>;
	appleByTitle: Map<string, string>;
	appleBySeasonEp: Map<string, string>;
	pocketCastsByEnclosure: Map<string, string>;
	pocketCastsBySeasonEp: Map<string, string>;
	pocketCastsByTitle: Map<string, string>;
	castboxByWebsite: Map<string, string>;
	castboxByEnclosure: Map<string, string>;
	castboxByTitle: Map<string, string>;
	castroByTitle: Map<string, string>;
	castroBySeasonEp: Map<string, string>;
}

function decodeXml(str: string): string {
	return str
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&#x27;/g, "'")
		.replace(/&apos;/g, "'")
		.trim();
}

export function normalizeTitle(title?: string): string {
	if (!title) return "";
	return decodeXml(title)
		.toLowerCase()
		.replace(/^\s*\d+\s*[.-]\s*\d+\s*[-–—:]?\s*/, "") // strip leading "5.13 - "
		.replace(/^s\d+e\d+\s*[-–—:]?\s*/i, "")
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

export function extractSeasonEpisodeFromTitle(
	title?: string,
): { season: number; episode: number } | null {
	if (!title) return null;
	const match = title.match(/^\s*(\d{1,2})\s*[.]\s*(\d{1,3})\b/);
	if (match) {
		return {
			season: parseInt(match[1], 10),
			episode: parseInt(match[2], 10),
		};
	}
	return null;
}

function getTagValue(xml: string, tag: string): string | undefined {
	const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
	const m = xml.match(regex);
	return m ? decodeXml(m[1]) : undefined;
}

export async function fetchAnchorRssItems(): Promise<PodcastRssEpisodeRecord[]> {
	try {
		const resp = await fetch(ANCHOR_RSS_URL);
		if (!resp.ok) return [];
		const xml = await resp.text();
		const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
		const items: PodcastRssEpisodeRecord[] = [];

		for (const match of itemMatches) {
			const itemXml = match[1];
			const title = getTagValue(itemXml, "title");
			const description = getTagValue(itemXml, "description");
			const link = getTagValue(itemXml, "link");
			const guidId = getTagValue(itemXml, "guid");
			const guidTagMatch = itemXml.match(/<guid([^>]*)>/i);
			const isPermaLink = guidTagMatch
				? !/isPermaLink\s*=\s*["']false["']/i.test(guidTagMatch[1])
				: false;
			const pubDateRaw = getTagValue(itemXml, "pubDate");
			const pubDate = pubDateRaw
				? new Date(pubDateRaw).toISOString()
				: undefined;

			const encMatch = itemXml.match(/<enclosure\s+([^>]+)\/?>/i);
			const enclosures: NonNullable<PodcastRssEpisodeRecord["enclosures"]> = [];
			if (encMatch) {
				const attrs = encMatch[1];
				const url = attrs.match(/url=["']([^"']+)["']/i)?.[1];
				const lengthStr = attrs.match(/length=["']([^"']+)["']/i)?.[1];
				const type = attrs.match(/type=["']([^"']+)["']/i)?.[1] || "audio/mpeg";
				if (url) {
					enclosures.push({
						_key: crypto
							.createHash("md5")
							.update(url)
							.digest("hex")
							.slice(0, 16),
						url: decodeXml(url),
						length: lengthStr ? parseInt(lengthStr, 10) || 0 : 0,
						type,
					});
				}
			}

			const summary = getTagValue(itemXml, "itunes:summary") || description;
			const explicitRaw = getTagValue(itemXml, "itunes:explicit")?.toLowerCase();
			const explicit =
				explicitRaw === "yes" || explicitRaw === "true" ? "true" : "false";
			const duration = getTagValue(itemXml, "itunes:duration");
			const season = getTagValue(itemXml, "itunes:season");
			const episode = getTagValue(itemXml, "itunes:episode");
			const episodeType = getTagValue(itemXml, "itunes:episodeType") || "full";
			const imageHref = itemXml.match(
				/<itunes:image\s+[^>]*href=["']([^"']+)["']/i,
			)?.[1];

			items.push({
				title,
				description: description ? `${description}\n` : undefined,
				link,
				guid: guidId ? { id: guidId, isPermaLink } : undefined,
				pubDate,
				enclosures,
				itunes: {
					summary: summary ? `${summary}\n` : undefined,
					explicit,
					duration,
					season,
					episode,
					episodeType,
					image: imageHref ? { href: decodeXml(imageHref) } : undefined,
				},
			});
		}

		return items;
	} catch (err) {
		console.warn("[Podcast Providers] Failed to fetch Anchor RSS:", err);
		return [];
	}
}

function signCastboxQuery(queryStr: string): string {
	const permOrder = [
		24, 13, 4, 19, 6, 0, 8, 21, 25, 7, 28, 1, 15, 31, 10, 9, 17, 18, 22, 11, 27,
		23, 2, 26, 12, 5, 29, 14, 20, 30, 16, 3,
	];
	const params = Object.fromEntries(new URLSearchParams(queryStr));
	params.r = "1";
	const sortedKeys = Object.keys(params).sort();
	const canonical = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
	const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const md5 = crypto
		.createHash("md5")
		.update(`${canonical}evst${dateKey}`)
		.digest("hex");
	const signature = permOrder.map((idx) => md5[idx]).join("");
	return `${queryStr}&m=${dateKey}&n=${signature}&r=1`;
}

export async function fetchProviderCatalog(): Promise<ProviderCatalog> {
	const catalog: ProviderCatalog = {
		rssItems: [],
		spotifyByGuid: new Map(),
		spotifyBySharePath: new Map(),
		spotifyByTitle: new Map(),
		appleByGuid: new Map(),
		appleByTitle: new Map(),
		appleBySeasonEp: new Map(),
		pocketCastsByEnclosure: new Map(),
		pocketCastsBySeasonEp: new Map(),
		pocketCastsByTitle: new Map(),
		castboxByWebsite: new Map(),
		castboxByEnclosure: new Map(),
		castboxByTitle: new Map(),
		castroByTitle: new Map(),
		castroBySeasonEp: new Map(),
	};

	await Promise.all([
		// 1. Anchor RSS
		(async () => {
			catalog.rssItems = await fetchAnchorRssItems();
		})(),

		// 2. Spotify Creators profile state (contains all 191 episodes + open.spotify.com/episode/... URLs)
		(async () => {
			try {
				const resp = await fetch(
					"https://creators.spotify.com/pod/profile/codingcatdev/",
					{
						headers: { "User-Agent": "Mozilla/5.0" },
					},
				);
				if (!resp.ok) return;
				const html = await resp.text();
				const match = html.match(
					/window\.__STATE__\s*=\s*(\{[\s\S]*?\});\s*\n/,
				);
				if (!match) return;
				const state = JSON.parse(match[1]);
				const episodes: any[] = state?.episodePreview?.episodes || [];
				for (const ep of episodes) {
					const spotifyUrl = ep?.spotifyUrl;
					if (!spotifyUrl || !spotifyUrl.startsWith("http")) continue;
					if (ep.podcastEpisodeUuid) {
						catalog.spotifyByGuid.set(ep.podcastEpisodeUuid, spotifyUrl);
					}
					if (ep.shareLinkPath) {
						catalog.spotifyBySharePath.set(ep.shareLinkPath, spotifyUrl);
					}
					const norm = normalizeTitle(ep.title);
					if (norm) {
						catalog.spotifyByTitle.set(norm, spotifyUrl);
					}
				}
			} catch (err) {
				console.warn(
					"[Podcast Providers] Failed to fetch Spotify Creators catalog:",
					err,
				);
			}
		})(),

		// 3. Apple Podcasts iTunes Lookup API
		(async () => {
			try {
				const resp = await fetch(
					`https://itunes.apple.com/lookup?id=${APPLE_PODCAST_ID}&entity=podcastEpisode&limit=200`,
				);
				if (!resp.ok) return;
				const data = (await resp.json()) as any;
				const results: any[] = data?.results || [];
				for (const item of results) {
					if (item.wrapperType !== "podcastEpisode" || !item.trackViewUrl)
						continue;
					const cleanAppleUrl = item.trackViewUrl.replace(/&uo=4$/, "");
					if (item.episodeGuid) {
						catalog.appleByGuid.set(item.episodeGuid, cleanAppleUrl);
					}
					const norm = normalizeTitle(item.trackName);
					if (norm) {
						catalog.appleByTitle.set(norm, cleanAppleUrl);
					}
					const se = extractSeasonEpisodeFromTitle(item.trackName);
					if (se) {
						catalog.appleBySeasonEp.set(
							`${se.season}:${se.episode}`,
							cleanAppleUrl,
						);
					}
				}
			} catch (err) {
				console.warn("[Podcast Providers] Failed to fetch Apple catalog:", err);
			}
		})(),

		// 4. Pocket Casts Public API
		(async () => {
			try {
				const resp = await fetch(
					`https://podcast-api.pocketcasts.com/podcast/full/${POCKET_CASTS_SHOW_UUID}`,
				);
				if (!resp.ok) return;
				const data = (await resp.json()) as any;
				const episodes: any[] = data?.podcast?.episodes || [];
				for (const ep of episodes) {
					if (!ep.uuid) continue;
					const pcUrl = `https://pca.st/episode/${ep.uuid}`;
					if (ep.url) {
						catalog.pocketCastsByEnclosure.set(ep.url, pcUrl);
					}
					if (ep.season && ep.number) {
						catalog.pocketCastsBySeasonEp.set(
							`${ep.season}:${ep.number}`,
							pcUrl,
						);
					}
					const se = extractSeasonEpisodeFromTitle(ep.title);
					if (se) {
						catalog.pocketCastsBySeasonEp.set(
							`${se.season}:${se.episode}`,
							pcUrl,
						);
					}
					const norm = normalizeTitle(ep.title);
					if (norm) {
						catalog.pocketCastsByTitle.set(norm, pcUrl);
					}
				}
			} catch (err) {
				console.warn(
					"[Podcast Providers] Failed to fetch Pocket Casts catalog:",
					err,
				);
			}
		})(),

		// 5. Castbox Public API
		(async () => {
			try {
				const q = `cid=${CASTBOX_CHANNEL_ID}&skip=0&limit=200&ascending=0&web=1`;
				const resp = await fetch(
					`https://everest.castbox.fm/data/episode_list/v2?${signCastboxQuery(q)}`,
				);
				if (!resp.ok) return;
				const json = (await resp.json()) as any;
				const episodes: any[] = json?.data?.episode_list || [];
				for (const ep of episodes) {
					if (!ep.eid) continue;
					const cbUrl = `https://castbox.fm/episode/id${CASTBOX_CHANNEL_ID}-id${ep.eid}`;
					if (ep.website) {
						catalog.castboxByWebsite.set(ep.website, cbUrl);
					}
					if (ep.url) {
						catalog.castboxByEnclosure.set(ep.url, cbUrl);
					}
					const norm = normalizeTitle(ep.title);
					if (norm) {
						catalog.castboxByTitle.set(norm, cbUrl);
					}
					// Extract Spotify episode ID from Castbox's podcast_transcript URL if needed
					const transcriptUrl: string | undefined =
						ep.podcast_transcript?.[0]?.url;
					const spMatch = transcriptUrl?.match(
						/spotifycdn\.com\/[^/]+\/([a-zA-Z0-9]+)\//,
					);
					if (spMatch?.[1] && norm && !catalog.spotifyByTitle.has(norm)) {
						catalog.spotifyByTitle.set(
							norm,
							`https://open.spotify.com/episode/${spMatch[1]}`,
						);
					}
				}
			} catch (err) {
				console.warn(
					"[Podcast Providers] Failed to fetch Castbox catalog:",
					err,
				);
			}
		})(),

		// 6. Castro Show Page
		(async () => {
			try {
				const resp = await fetch(CASTRO_SHOW_URL, {
					headers: { "User-Agent": "Mozilla/5.0" },
				});
				if (!resp.ok) return;
				const html = await resp.text();
				const itemRegex =
					/<a\s+href="(https:\/\/castro\.fm\/episode\/[a-zA-Z0-9]+)"\s+class="episode-title-link">\s*([\s\S]*?)\s*<\/a>[\s\S]*?<div\s+class="episode-meta">\s*([\s\S]*?)\s*<\/div>/gi;
				let match: RegExpExecArray | null;
				while ((match = itemRegex.exec(html)) !== null) {
					const castroUrl = match[1];
					const rawTitle = decodeXml(match[2]);
					const meta = match[3];
					const norm = normalizeTitle(rawTitle);
					if (norm) {
						catalog.castroByTitle.set(norm, castroUrl);
					}
					const seTitle = extractSeasonEpisodeFromTitle(rawTitle);
					if (seTitle) {
						catalog.castroBySeasonEp.set(
							`${seTitle.season}:${seTitle.episode}`,
							castroUrl,
						);
					}
					const seMeta = meta.match(/S(\d+)\s*•\s*E(\d+)/i);
					if (seMeta) {
						catalog.castroBySeasonEp.set(
							`${parseInt(seMeta[1], 10)}:${parseInt(seMeta[2], 10)}`,
							castroUrl,
						);
					}
				}
			} catch (err) {
				console.warn(
					"[Podcast Providers] Failed to fetch Castro catalog:",
					err,
				);
			}
		})(),
	]);

	return catalog;
}

export function matchRssItemForPodcast(
	doc: SanityPodcastDoc,
	rssItems: PodcastRssEpisodeRecord[],
): PodcastRssEpisodeRecord | null {
	const slug =
		typeof doc.slug === "string" ? doc.slug : doc.slug?.current || "";
	const normDocTitle = normalizeTitle(doc.title);

	// 1. Match by codingcat.dev/podcast/<slug> inside RSS description
	if (slug) {
		const bySlug = rssItems.find((item) =>
			item.description
				?.toLowerCase()
				.includes(`/podcast/${slug.toLowerCase()}`),
		);
		if (bySlug) return bySlug;
	}

	// 2. Match by (season, episode)
	if (doc.season && doc.episode) {
		const bySeasonEp = rssItems.find((item) => {
			const iSeason = item.itunes?.season
				? parseInt(item.itunes.season, 10)
				: undefined;
			const iEp = item.itunes?.episode
				? parseInt(item.itunes.episode, 10)
				: undefined;
			if (iSeason === doc.season && iEp === doc.episode) return true;
			const parsed = extractSeasonEpisodeFromTitle(item.title);
			return parsed?.season === doc.season && parsed?.episode === doc.episode;
		});
		if (bySeasonEp) return bySeasonEp;
	}

	// 3. Match by normalized title
	if (normDocTitle) {
		const byTitle = rssItems.find(
			(item) => normalizeTitle(item.title) === normDocTitle,
		);
		if (byTitle) return byTitle;
	}

	return null;
}

export function resolvePodcastLinks(
	doc: SanityPodcastDoc,
	catalog: ProviderCatalog,
): {
	spotifyRecord: PodcastRssEpisodeRecord | null;
	listenLinks: ListenLinksRecord;
	changed: boolean;
} {
	const existingSpotify = doc.spotify?.guid?.id ? doc.spotify : null;
	const matchedRss =
		existingSpotify || matchRssItemForPodcast(doc, catalog.rssItems);

	const guid = matchedRss?.guid?.id;
	const enclosureUrl = matchedRss?.enclosures?.[0]?.url;
	const podcastersLink = matchedRss?.link;
	const sharePath = podcastersLink
		? podcastersLink.replace(/^https?:\/\/[^/]+\/pod\/show/, "")
		: undefined;

	const normRssTitle = normalizeTitle(matchedRss?.title);
	const normDocTitle = normalizeTitle(doc.title);
	const seFromRss = extractSeasonEpisodeFromTitle(matchedRss?.title);
	const season =
		doc.season ||
		(matchedRss?.itunes?.season
			? parseInt(matchedRss.itunes.season, 10)
			: seFromRss?.season);
	const episode =
		doc.episode ||
		(matchedRss?.itunes?.episode
			? parseInt(matchedRss.itunes.episode, 10)
			: seFromRss?.episode);
	const seKey = season && episode ? `${season}:${episode}` : undefined;

	// Resolve Spotify URL
	const spotifyEpisodeUrl =
		(guid && catalog.spotifyByGuid.get(guid)) ||
		(sharePath && catalog.spotifyBySharePath.get(sharePath)) ||
		(normRssTitle && catalog.spotifyByTitle.get(normRssTitle)) ||
		(normDocTitle && catalog.spotifyByTitle.get(normDocTitle)) ||
		doc.listenLinks?.spotify ||
		podcastersLink ||
		undefined;

	// Resolve Apple Podcasts URL
	const appleEpisodeUrl =
		(guid && catalog.appleByGuid.get(guid)) ||
		(seKey && catalog.appleBySeasonEp.get(seKey)) ||
		(normRssTitle && catalog.appleByTitle.get(normRssTitle)) ||
		(normDocTitle && catalog.appleByTitle.get(normDocTitle)) ||
		doc.listenLinks?.apple ||
		(matchedRss ? APPLE_SHOW_URL : undefined);

	// Resolve Pocket Casts URL
	const pocketCastsUrl =
		(enclosureUrl && catalog.pocketCastsByEnclosure.get(enclosureUrl)) ||
		(seKey && catalog.pocketCastsBySeasonEp.get(seKey)) ||
		(normRssTitle && catalog.pocketCastsByTitle.get(normRssTitle)) ||
		(normDocTitle && catalog.pocketCastsByTitle.get(normDocTitle)) ||
		doc.listenLinks?.pocketCasts ||
		(matchedRss ? POCKET_CASTS_SHOW_URL : undefined);

	// Resolve Castbox URL
	const castboxUrl =
		(podcastersLink && catalog.castboxByWebsite.get(podcastersLink)) ||
		(enclosureUrl && catalog.castboxByEnclosure.get(enclosureUrl)) ||
		(normRssTitle && catalog.castboxByTitle.get(normRssTitle)) ||
		(normDocTitle && catalog.castboxByTitle.get(normDocTitle)) ||
		doc.listenLinks?.castbox ||
		(matchedRss ? CASTBOX_SHOW_URL : undefined);

	// Resolve Castro URL
	const castroUrl =
		(seKey && catalog.castroBySeasonEp.get(seKey)) ||
		(normRssTitle && catalog.castroByTitle.get(normRssTitle)) ||
		(normDocTitle && catalog.castroByTitle.get(normDocTitle)) ||
		doc.listenLinks?.castro ||
		(matchedRss ? CASTRO_SHOW_URL : undefined);

	const youtubeUrl = doc.youtube || doc.listenLinks?.youtube || undefined;
	const overcastUrl =
		doc.listenLinks?.overcast || (matchedRss ? OVERCAST_SHOW_URL : undefined);
	const rssUrl =
		doc.listenLinks?.rss || (matchedRss ? ANCHOR_RSS_URL : undefined);

	const nextListenLinks: ListenLinksRecord = {
		...(doc.listenLinks || {}),
		...(youtubeUrl ? { youtube: youtubeUrl } : {}),
		...(spotifyEpisodeUrl ? { spotify: spotifyEpisodeUrl } : {}),
		...(appleEpisodeUrl ? { apple: appleEpisodeUrl } : {}),
		...(overcastUrl ? { overcast: overcastUrl } : {}),
		...(pocketCastsUrl ? { pocketCasts: pocketCastsUrl } : {}),
		...(castboxUrl ? { castbox: castboxUrl } : {}),
		...(castroUrl ? { castro: castroUrl } : {}),
		...(rssUrl ? { rss: rssUrl } : {}),
	};

	const spotifyChanged = !existingSpotify && Boolean(matchedRss);
	const currentLinks = doc.listenLinks || {};
	const keys: Array<keyof ListenLinksRecord> = [
		"youtube",
		"spotify",
		"apple",
		"overcast",
		"pocketCasts",
		"castbox",
		"castro",
		"rss",
	];
	const linksChanged = keys.some(
		(k) => (nextListenLinks[k] || "") !== (currentLinks[k] || ""),
	);

	return {
		spotifyRecord: spotifyChanged ? matchedRss : null,
		listenLinks: nextListenLinks,
		changed: spotifyChanged || linksChanged,
	};
}
