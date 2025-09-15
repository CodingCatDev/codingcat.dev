export const fetchCache = "force-no-store";


import { publicURL, youtubeParser } from "@/lib/utils";
import { createClient } from "next-sanity";
import type { NextRequest } from "next/server";

const sanityWriteClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_API_WRITE_TOKEN,
	apiVersion: "2022-03-07",
	perspective: "published",
	useCdn: false,
});




async function processBatchTasks() {
	// Fetch up to 50 pending tasks
	let tasks = await sanityWriteClient.fetch(
		`*[_type == "youtubeUpdateTask" && status == "pending"]| order(lastChecked asc)[0...50]{ _id, targetDoc->{_id, _type, youtube}, status }`
	);
	if (!tasks || tasks.length === 0) return { processed: 0 };

	// Prepare video IDs and map taskId to docId
	const validTasks = [];
	const errorTasks = [];
	for (const task of tasks) {
		const { _id: taskId, targetDoc } = task;
		if (!targetDoc || !targetDoc.youtube) {
			errorTasks.push({ taskId, error: "Missing YouTube field on targetDoc" });
			continue;
		}
		const id = youtubeParser(targetDoc.youtube);
		if (!id) {
			errorTasks.push({ taskId, error: "Invalid YouTube URL" });
			continue;
		}
		validTasks.push({ taskId, docId: targetDoc._id, youtubeId: id });
	}

	// Mark all valid tasks as inProgress
	for (const t of validTasks) {
		await sanityWriteClient.patch(t.taskId)
			.set({ status: "inProgress", lastChecked: new Date().toISOString() })
			.commit();
	}

	// Mark all error tasks as error
	for (const t of errorTasks) {
		await sanityWriteClient.patch(t.taskId)
			.set({ status: "error", errorMessage: t.error, lastChecked: new Date().toISOString() })
			.commit();
	}

	if (validTasks.length === 0) return { processed: 0, errors: errorTasks.length };

	// Batch YouTube API call
	const ids = validTasks.map(t => t.youtubeId).join(",");
	console.log("[YOUTUBE] Fetching stats for IDs:", ids);
	const videoResp = await fetch(
		`https://www.googleapis.com/youtube/v3/videos?id=${ids}&key=${process.env.YOUTUBE_API_KEY}&fields=items(id,statistics)&part=statistics`,
	);
	const json = await videoResp.json();
	if (videoResp.status !== 200) {
		// Mark all as error
		for (const t of validTasks) {
			await sanityWriteClient.patch(t.taskId)
				.set({ status: "error", errorMessage: JSON.stringify(json), lastChecked: new Date().toISOString() })
				.commit();
		}
		return { processed: 0, errors: validTasks.length };
	}
	const statsMap = new Map();
	for (const item of json?.items || []) {
		statsMap.set(item.id, item.statistics);
	}

	let completed = 0;
	for (const t of validTasks) {
		const statistics = statsMap.get(t.youtubeId);
		if (!statistics) {
			await sanityWriteClient.patch(t.taskId)
				.set({ status: "error", errorMessage: "No statistics found", lastChecked: new Date().toISOString() })
				.commit();
			continue;
		}
		// Update target doc with stats
		await sanityWriteClient.patch(t.docId)
			.set({
				"statistics.youtube.commentCount": Number.parseInt(statistics.commentCount),
				"statistics.youtube.favoriteCount": Number.parseInt(statistics.favoriteCount),
				"statistics.youtube.likeCount": Number.parseInt(statistics.likeCount),
				"statistics.youtube.viewCount": Number.parseInt(statistics.viewCount),
			})
			.commit();
		// Mark task as completed
		await sanityWriteClient.patch(t.taskId)
			.set({ status: "completed", lastChecked: new Date().toISOString(), errorMessage: undefined })
			.commit();
		completed++;
	}
	return { processed: completed, errors: errorTasks.length + (validTasks.length - completed) };
}

export async function POST(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.error("[YOUTUBE] Unauthorized request: invalid authorization header");
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		// Repopulate youtubeUpdateTask queue if empty
		let tasks = await sanityWriteClient.fetch(
			`*[_type == "youtubeUpdateTask" && status == "pending"]| order(lastChecked asc)[0...1]{ _id }`
		);
		if (!tasks || tasks.length === 0) {
			const posts = await sanityWriteClient.fetch(
				'*[_type == "post" && defined(youtube)]{_id, _type, youtube}'
			);
			const podcasts = await sanityWriteClient.fetch(
				'*[_type == "podcast" && defined(youtube)]{_id, _type, youtube}'
			);
			const allDocs = [...posts, ...podcasts];
			const existingTasks = await sanityWriteClient.fetch(
				'*[_type == "youtubeUpdateTask" && defined(targetDoc._ref)]{targetDoc}'
			);
			const existingIds = new Set(existingTasks.map((t: { targetDoc?: { _ref?: string } }) => t.targetDoc?._ref));
			for (const doc of allDocs) {
				if (!existingIds.has(doc._id)) {
					await sanityWriteClient.create({
						_type: "youtubeUpdateTask",
						targetDoc: { _type: "reference", _ref: doc._id },
						status: "pending",
						lastChecked: null,
					});
				}
			}
		}

		// Process a batch of tasks
		const result = await processBatchTasks();
		return Response.json({ success: true, ...result });
	} catch (error) {
		console.error("[YOUTUBE] Unexpected error:", error);
		return Response.json({ success: false, error: String(error) }, { status: 500 });
	}
}
