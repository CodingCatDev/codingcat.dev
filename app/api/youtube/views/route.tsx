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



async function processSingleTask() {
	let tasks = await sanityWriteClient.fetch(
		`*[_type == "youtubeUpdateTask" && (status == "pending" || status == "inProgress")]| order(lastChecked asc)[0...1]{ _id, targetDoc->{_id, _type, youtube}, status }`
	);
	if (!tasks || tasks.length === 0) return false;
	const task = tasks[0];
	const { _id: taskId, targetDoc, status } = task;
	if (!targetDoc || !targetDoc.youtube) {
		await sanityWriteClient.patch(taskId)
			.set({ status: "error", errorMessage: "Missing YouTube field on targetDoc", lastChecked: new Date().toISOString() })
			.commit();
		return false;
	}
	// Mark as inProgress
	await sanityWriteClient.patch(taskId)
		.set({ status: "inProgress", lastChecked: new Date().toISOString() })
		.commit();

	const id = youtubeParser(targetDoc.youtube);
	if (!id) {
		await sanityWriteClient.patch(taskId)
			.set({ status: "error", errorMessage: "Invalid YouTube URL", lastChecked: new Date().toISOString() })
			.commit();
		return false;
	}

	try {
		const videoResp = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.YOUTUBE_API_KEY}&fields=items(id,statistics)&part=statistics`,
		);
		const json = await videoResp.json();
		if (videoResp.status !== 200) {
			await sanityWriteClient.patch(taskId)
				.set({ status: "error", errorMessage: JSON.stringify(json), lastChecked: new Date().toISOString() })
				.commit();
			return false;
		}
		const statistics = json?.items?.at(0)?.statistics;
		if (!statistics) {
			await sanityWriteClient.patch(taskId)
				.set({ status: "error", errorMessage: "No statistics found", lastChecked: new Date().toISOString() })
				.commit();
			return false;
		}

		// Update target doc with stats
		await sanityWriteClient.patch(targetDoc._id)
			.set({
				"statistics.youtube.commentCount": Number.parseInt(statistics.commentCount),
				"statistics.youtube.favoriteCount": Number.parseInt(statistics.favoriteCount),
				"statistics.youtube.likeCount": Number.parseInt(statistics.likeCount),
				"statistics.youtube.viewCount": Number.parseInt(statistics.viewCount),
			})
			.commit();

		// Mark task as completed
		await sanityWriteClient.patch(taskId)
			.set({ status: "completed", lastChecked: new Date().toISOString(), errorMessage: undefined })
			.commit();
		return true;
	} catch (err) {
		await sanityWriteClient.patch(taskId)
			.set({ status: "error", errorMessage: String(err), lastChecked: new Date().toISOString() })
			.commit();
		return false;
	}
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
			`*[_type == "youtubeUpdateTask" && (status == "pending" || status == "inProgress")]| order(lastChecked asc)[0...1]{ _id, targetDoc->{_id, _type, youtube}, status }`
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

		// Process a single task
		const didProcess = await processSingleTask();

		// Wait in a while loop until 30 seconds have passed
		const startTime = Date.now();
		const maxDuration = 30 * 1000; // 30 seconds
		while (Date.now() - startTime < maxDuration) {
			// Busy-wait (not recommended for production, but per user request)
			console.log('waiting...');
		}

		// Trigger the next batch by calling this API again
		fetch(`${publicURL()}/api/youtube/views`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${process.env.CRON_SECRET}`,
				"Cache-Control": "no-cache",
			},
		});

		return Response.json({ success: true, didProcess });
	} catch (error) {
		console.error("[YOUTUBE] Unexpected error:", error);
		return Response.json({ success: false, error: String(error) }, { status: 500 });
	}
}
