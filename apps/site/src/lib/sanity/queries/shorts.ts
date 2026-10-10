import { defineQuery } from "groq";

export interface ShortItem {
	_id: string;
	_type: string;
	title?: string | null;
	slug?: string | null;
	description?: string | null;
	youtube?: string | null;
	youtubeShortId?: string | null;
	shortVideoUrl?: string | null;
	publishedAt?: string | null;
	duration?: number | null;
	viewCount?: number | null;
	likeCount?: number | null;
}

export const shortsPageQuery = defineQuery(`{
  "standaloneShorts": *[_type == "short"]|order(coalesce(publishedAt, _createdAt) desc)[0...36]{
    _id,
    _type,
    title,
    "slug": slug.current,
    "description": coalesce(description, ""),
    "youtube": youtube,
    "youtubeShortId": null,
    "shortVideoUrl": shortVideoUrl,
    "publishedAt": coalesce(publishedAt, _createdAt),
    "duration": coalesce(duration, 60),
    "viewCount": coalesce(statistics.youtube.viewCount, 0),
    "likeCount": coalesce(statistics.youtube.likeCount, 0)
  },
  "automatedShorts": *[_type == "automatedVideo" && defined(youtubeShortId)]|order(_createdAt desc)[0...36]{
    _id,
    _type,
    title,
    "slug": slug.current,
    "description": coalesce(script.hook, summary, ""),
    "youtube": "https://www.youtube.com/shorts/" + youtubeShortId,
    youtubeShortId,
    "shortVideoUrl": shortUrl,
    "publishedAt": coalesce(publishedAt, _createdAt),
    "duration": 60,
    "viewCount": coalesce(statistics.youtube.viewCount, analytics.views, 0),
    "likeCount": coalesce(statistics.youtube.likeCount, analytics.likes, 0)
  }
}`);

/**
 * Deduplicate standalone `_type == "short"` documents and `automatedVideo` shorts
 * by YouTube video ID so that synced shorts never appear twice.
 */
export function mergeAndDedupeShorts(data?: {
	standaloneShorts?: ShortItem[] | null;
	automatedShorts?: ShortItem[] | null;
} | null): ShortItem[] {
	const standalone = data?.standaloneShorts ?? [];
	const automated = data?.automatedShorts ?? [];
	const seenIds = new Set<string>();
	const result: ShortItem[] = [];

	const extractYtId = (item: ShortItem): string | null => {
		if (item.youtubeShortId) return item.youtubeShortId;
		if (!item.youtube) return null;
		const match = item.youtube.match(
			/(?:shorts\/|v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/,
		);
		return match?.[1] ?? item.youtube;
	};

	for (const item of [...standalone, ...automated]) {
		const ytId = extractYtId(item);
		const key = ytId || item._id;
		if (seenIds.has(key)) continue;
		seenIds.add(key);
		result.push({
			...item,
			youtubeShortId: ytId,
			youtube:
				item.youtube ||
				(ytId ? `https://www.youtube.com/shorts/${ytId}` : undefined),
		});
	}

	return result;
}
