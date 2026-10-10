#!/usr/bin/env node
/**
 * Syncs all published `automatedVideo` documents that have a `youtubeShortId`
 * into standalone `_type == "short"` documents in Sanity, and optionally
 * enriches them with YouTube Data API v3 statistics if YOUTUBE_API_KEY is set.
 *
 * Usage:
 *   node scripts/sync-shorts-from-automated-videos.mjs
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
	process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

if (!token) {
	console.error(
		"Error: SANITY_API_WRITE_TOKEN or SANITY_AUTH_TOKEN is required to sync short documents.",
	);
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: "2025-09-30",
	useCdn: false,
});

async function fetchYouTubeStats(videoIds) {
	const statsById = new Map();
	if (!youtubeApiKey || videoIds.length === 0) return statsById;

	for (let i = 0; i < videoIds.length; i += 50) {
		const batch = videoIds.slice(i, i + 50);
		const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${batch.join(",")}&key=${youtubeApiKey}`;
		try {
			const res = await fetch(url);
			if (!res.ok) continue;
			const data = await res.json();
			for (const item of data.items || []) {
				const s = item.statistics;
				if (!s) continue;
				statsById.set(item.id, {
					viewCount: s.viewCount ? Number.parseInt(s.viewCount, 10) : 0,
					likeCount: s.likeCount ? Number.parseInt(s.likeCount, 10) : 0,
					commentCount: s.commentCount
						? Number.parseInt(s.commentCount, 10)
						: 0,
					favoriteCount: s.favoriteCount
						? Number.parseInt(s.favoriteCount, 10)
						: 0,
				});
			}
		} catch (err) {
			console.warn("Warning: Failed to fetch YouTube stats batch:", err);
		}
	}
	return statsById;
}

async function main() {
	console.log(
		`[Sync Shorts] Querying automatedVideo documents with youtubeShortId in ${projectId}/${dataset}...`,
	);

	const autoShorts = await client.fetch(
		`*[_type == "automatedVideo" && defined(youtubeShortId) && !(_id in path("drafts.**"))]|order(_createdAt desc){
			_id,
			_createdAt,
			title,
			slug,
			youtubeShortId,
			shortUrl,
			"hook": script.hook
		}`,
	);

	console.log(
		`[Sync Shorts] Found ${autoShorts.length} automatedVideo documents with YouTube Shorts.`,
	);

	const shortIds = autoShorts.map((d) => d.youtubeShortId).filter(Boolean);
	const statsMap = await fetchYouTubeStats(shortIds);

	let upserted = 0;
	for (const doc of autoShorts) {
		const shortDocId = `short-${doc.youtubeShortId}`;
		const slugCurrent =
			doc.slug?.current ||
			doc.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "")
				.slice(0, 90);

		const ytStats = statsMap.get(doc.youtubeShortId);

		await client.createOrReplace({
			_id: shortDocId,
			_type: "short",
			title: doc.title,
			slug: { _type: "slug", current: slugCurrent },
			description: doc.hook || undefined,
			youtube: `https://www.youtube.com/shorts/${doc.youtubeShortId}`,
			shortVideoUrl: doc.shortUrl || undefined,
			sourceAutomatedVideo: {
				_type: "reference",
				_ref: doc._id,
			},
			publishedAt: doc._createdAt,
			duration: 60,
			...(ytStats ? { statistics: { youtube: ytStats } } : {}),
		});
		upserted++;
	}

	console.log(
		`[Sync Shorts] Successfully synced ${upserted} _type == "short" documents in ${dataset}.`,
	);
}

main().catch((err) => {
	console.error("[Sync Shorts] Fatal error:", err);
	process.exit(1);
});
