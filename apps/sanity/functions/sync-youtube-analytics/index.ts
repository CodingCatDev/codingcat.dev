import { scheduledEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";
import { youtubeParser } from "../../lib/utils";

interface TargetVideoDoc {
	_id: string;
	_type: string;
	title?: string;
	youtube: string;
	transcript?: {
		_type: "reference";
		_ref: string;
	};
}

interface YouTubeVideoStatsItem {
	id: string;
	statistics?: {
		viewCount?: string;
		likeCount?: string;
		commentCount?: string;
		favoriteCount?: string;
	};
}

export const handler = scheduledEventHandler(async ({ context }) => {
	console.log(
		"[Sync YouTube Analytics] Starting scheduled sync for YouTube analytics...",
	);

	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) {
		throw new Error(
			"[Sync YouTube Analytics] YOUTUBE_API_KEY environment variable is missing.",
		);
	}

	const token =
		context.clientOptions?.token ||
		process.env.SANITY_API_WRITE_TOKEN ||
		process.env.SANITY_AUTH_TOKEN;
	if (!token) {
		throw new Error(
			"[Sync YouTube Analytics] Missing Sanity API token (neither context.clientOptions.token nor SANITY_API_WRITE_TOKEN is present).",
		);
	}

	const dataset =
		process.env.SANITY_STUDIO_DATASET ||
		context.clientOptions?.dataset ||
		"production";

	if (dataset !== "production") {
		console.log(
			`[Sync YouTube Analytics] Stack is "${dataset}". Nightly analytics sync only executes on production. Skipping.`,
		);
		return;
	}

	const projectId =
		context.clientOptions?.projectId ||
		process.env.SANITY_STUDIO_PROJECT_ID ||
		"hfh83o0w";

	const client = createClient({
		projectId,
		dataset,
		token,
		apiVersion: "2025-09-30",
		useCdn: false,
	});

	// Query all posts and podcasts with YouTube URLs
	console.log(
		`[Sync YouTube Analytics] Fetching documents with YouTube URLs in project ${projectId}, dataset ${dataset}...`,
	);

	const docs = await client.fetch<TargetVideoDoc[]>(
		`*[_type in ["post", "podcast"] && (defined(youtube) || defined(listenLinks.youtube)) && !(_id in path("drafts.**"))]{
			_id,
			_type,
			title,
			"youtube": coalesce(youtube, listenLinks.youtube),
			transcript
		}`,
	);

	console.log(
		`[Sync YouTube Analytics] Found ${docs.length} documents with YouTube URLs. Preparing batch lookups...`,
	);

	// Map documents by YouTube Video ID
	const videoMap = new Map<string, TargetVideoDoc[]>();
	for (const doc of docs) {
		const videoId = youtubeParser(doc.youtube);
		if (!videoId) continue;
		const list = videoMap.get(videoId) || [];
		list.push(doc);
		videoMap.set(videoId, list);
	}

	const allVideoIds = Array.from(videoMap.keys());
	console.log(
		`[Sync YouTube Analytics] Unique YouTube Video IDs to query: ${allVideoIds.length}`,
	);

	const BATCH_SIZE = 50; // YouTube Data API v3 allows up to 50 IDs per request
	let totalUpdated = 0;

	for (let i = 0; i < allVideoIds.length; i += BATCH_SIZE) {
		const batchIds = allVideoIds.slice(i, i + BATCH_SIZE);
		const idsParam = batchIds.join(",");

		console.log(
			`[Sync YouTube Analytics] Querying batch ${Math.floor(i / BATCH_SIZE) + 1} (${batchIds.length} videos)...`,
		);

		try {
			const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${idsParam}&key=${apiKey}`;
			const resp = await fetch(apiUrl);

			if (!resp.ok) {
				const errorText = await resp.text();
				console.error(
					`[Sync YouTube Analytics] YouTube API error (${resp.status}): ${errorText}`,
				);
				continue;
			}

			const data = (await resp.json()) as { items?: YouTubeVideoStatsItem[] };
			const items = data.items || [];

			for (const item of items) {
				const videoId = item.id;
				const stats = item.statistics;
				if (!stats) continue;

				const parsedStats = {
					viewCount: stats.viewCount ? parseInt(stats.viewCount, 10) : 0,
					likeCount: stats.likeCount ? parseInt(stats.likeCount, 10) : 0,
					commentCount: stats.commentCount
						? parseInt(stats.commentCount, 10)
						: 0,
					favoriteCount: stats.favoriteCount
						? parseInt(stats.favoriteCount, 10)
						: 0,
				};

				const targetDocs = videoMap.get(videoId) || [];
				for (const targetDoc of targetDocs) {
					// 1. Update source document statistics
					await client
						.patch(targetDoc._id)
						.set({
							statistics: {
								youtube: parsedStats,
							},
						})
						.commit()
						.catch((err) => {
							console.warn(
								`[Sync YouTube Analytics] Failed to patch stats on ${targetDoc._id}:`,
								err,
							);
						});

					// 2. Also update statistics on referenced transcript doc if present
					const transcriptId =
						targetDoc.transcript?._ref || `transcript-yt-${videoId}`;
					await client
						.patch(transcriptId)
						.set({
							statistics: parsedStats,
							lastFetchedAt: new Date().toISOString(),
						})
						.commit()
						.catch(() => {
							// Ignore if transcript doc doesn't exist yet
						});

					totalUpdated++;
				}
			}

			// Small delay between batches to respect YouTube quota
			await new Promise((resolve) => setTimeout(resolve, 500));
		} catch (err) {
			console.error(
				`[Sync YouTube Analytics] Failed processing batch starting at index ${i}:`,
				err,
			);
		}
	}

	console.log(
		`[Sync YouTube Analytics] Successfully completed YouTube analytics sync. Updated statistics on ${totalUpdated} references.`,
	);
});
