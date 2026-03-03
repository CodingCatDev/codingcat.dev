export const fetchCache = "force-no-store";
import { publicURL, youtubeParser } from "@/lib/utils";
import { createClient } from "next-sanity";
import type { NextRequest } from "next/server";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

const sanityWriteClient = createClient({
	projectId,
	dataset,
	apiVersion,
	token: process.env.SANITY_API_WRITE_TOKEN,
	perspective: "published",
	useCdn: false,
});

async function processBatchTasks() {
	console.log(
		"[YOUTUBE] Fetching up to 10 pending youtubeUpdateTask tasks from Sanity",
	);
	let tasks = await sanityWriteClient.fetch(
		`*[_type == "youtubeUpdateTask" && status == "pending"]| order(lastChecked asc)[0...10]{ _id, targetDoc->{_id, _type, youtube}, status }`,
	);
	console.log(`[YOUTUBE] Fetched ${tasks?.length || 0} tasks`);
	if (!tasks || tasks.length === 0) {
		console.log("[YOUTUBE] No pending tasks found");
		return { processed: 0 };
	}

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
	console.log(
		`[YOUTUBE] validTasks: ${validTasks.length}, errorTasks: ${errorTasks.length}`,
	);

	// Mark all valid tasks as inProgress (sequential)
	try {
		for (const t of validTasks) {
			console.log(`[YOUTUBE] Marking task ${t.taskId} as inProgress`);
			try {
				await sanityWriteClient
					.patch(t.taskId)
					.set({ status: "inProgress", lastChecked: new Date().toISOString() })
					.commit({ visibility: "async" });
				console.log(`[YOUTUBE] Task ${t.taskId} marked as inProgress`);
			} catch (err) {
				console.error(
					`[YOUTUBE] Error marking task ${t.taskId} as inProgress:`,
					err,
				);
			}
		}
		console.log(`[YOUTUBE] Marked ${validTasks.length} tasks as inProgress`);
	} catch (err) {
		console.error("[YOUTUBE] Error marking tasks as inProgress", err);
	}

	// Mark all error tasks as error (sequential)
	if (errorTasks.length > 0) {
		try {
			for (const t of errorTasks) {
				console.log(
					`[YOUTUBE] Marking error task ${t.taskId} as error: ${t.error}`,
				);
				try {
					await sanityWriteClient
						.patch(t.taskId)
						.set({
							status: "error",
							errorMessage: t.error,
							lastChecked: new Date().toISOString(),
						})
						.commit({ visibility: "async" });
					console.log(`[YOUTUBE] Error task ${t.taskId} marked as error`);
				} catch (err) {
					console.error(`[YOUTUBE] Error marking error task ${t.taskId}:`, err);
				}
			}
			console.log(`[YOUTUBE] Marked ${errorTasks.length} tasks as error`);
		} catch (err) {
			console.error("[YOUTUBE] Error marking error tasks", err);
		}
	}

	if (validTasks.length === 0) {
		console.log("[YOUTUBE] No valid tasks to process");
		return { processed: 0, errors: errorTasks.length };
	}

	// Batch YouTube API call in groups of 50 IDs
	const statsMap = new Map();
	const batchSize = 50;
	let apiError = null;
	for (let i = 0; i < validTasks.length; i += batchSize) {
		const batch = validTasks.slice(i, i + batchSize);
		const ids = batch.map((t) => t.youtubeId).join(",");
		console.log(`[YOUTUBE] Fetching stats for IDs batch: ${ids}`);
		let videoResp: Response, json: any;
		try {
			videoResp = await fetch(
				`https://www.googleapis.com/youtube/v3/videos?id=${ids}&key=${process.env.YOUTUBE_API_KEY}&fields=items(id,statistics)&part=statistics`,
			);
			json = await videoResp.json();
			console.log(`[YOUTUBE] YouTube API response status: ${videoResp.status}`);
			if (videoResp.status !== 200) {
				console.error("[YOUTUBE] YouTube API error", json);
				apiError = json;
				// Mark all tasks in this batch as error
				for (const t of batch) {
					console.log(
						`[YOUTUBE] Marking batch task ${t.taskId} as error due to API error`,
					);
					try {
						await sanityWriteClient
							.patch(t.taskId)
							.set({
								status: "error",
								errorMessage: JSON.stringify(json),
								lastChecked: new Date().toISOString(),
							})
							.commit({ visibility: "async" });
						console.log(`[YOUTUBE] Batch task ${t.taskId} marked as error`);
					} catch (err) {
						console.error(
							`[YOUTUBE] Error marking task ${t.taskId} as error after YouTube API error:`,
							err,
						);
					}
				}
				break;
			}
			for (const item of json?.items || []) {
				console.log(`[YOUTUBE] Adding stats for video ID: ${item.id}`);
				statsMap.set(item.id, item.statistics);
			}
		} catch (err) {
			console.error("[YOUTUBE] Error fetching YouTube stats", err);
			apiError = err;
			for (const t of batch) {
				console.log(
					`[YOUTUBE] Marking batch task ${t.taskId} as error due to fetch error`,
				);
				try {
					await sanityWriteClient
						.patch(t.taskId)
						.set({
							status: "error",
							errorMessage: String(err),
							lastChecked: new Date().toISOString(),
						})
						.commit({ visibility: "async" });
					console.log(`[YOUTUBE] Batch task ${t.taskId} marked as error`);
				} catch (err2) {
					console.error(
						`[YOUTUBE] Error marking task ${t.taskId} as error after fetch error:`,
						err2,
					);
				}
			}
			break;
		}
	}
	console.log(`[YOUTUBE] StatsMap size: ${statsMap.size}`);
	if (apiError) {
		return { processed: 0, errors: validTasks.length };
	}

	let completed = 0;
	const patchOps = [];
	const completedTaskOps = [];
	const erroredTaskOps = [];
	for (const t of validTasks) {
		console.log(
			`[YOUTUBE] Processing validTask: taskId=${t.taskId}, docId=${t.docId}, youtubeId=${t.youtubeId}`,
		);
		const statistics = statsMap.get(t.youtubeId);
		if (!statistics) {
			console.log(
				`[YOUTUBE] No statistics found for youtubeId=${t.youtubeId}, marking task ${t.taskId} as error`,
			);
			try {
				await sanityWriteClient
					.patch(t.taskId)
					.set({
						status: "error",
						errorMessage: "No statistics found",
						lastChecked: new Date().toISOString(),
					})
					.commit({ visibility: "async" });
				console.log(
					`[YOUTUBE] Task ${t.taskId} marked as error (no statistics)`,
				);
			} catch (err) {
				console.error(
					`[YOUTUBE] Error marking task ${t.taskId} as error:`,
					err,
				);
			}
			continue;
		}
		try {
			console.log(
				`[YOUTUBE] Updating doc ${t.docId} with statistics for youtubeId=${t.youtubeId}`,
			);
			await sanityWriteClient
				.patch(t.docId)
				.set({
					"statistics.youtube.commentCount": Number.parseInt(
						statistics.commentCount,
					),
					"statistics.youtube.favoriteCount": Number.parseInt(
						statistics.favoriteCount,
					),
					"statistics.youtube.likeCount": Number.parseInt(statistics.likeCount),
					"statistics.youtube.viewCount": Number.parseInt(statistics.viewCount),
				})
				.commit({ visibility: "async" });
			console.log(`[YOUTUBE] Updated doc ${t.docId}`);
			await sanityWriteClient
				.patch(t.taskId)
				.set({
					status: "completed",
					lastChecked: new Date().toISOString(),
					errorMessage: undefined,
				})
				.commit({ visibility: "async" });
			console.log(`[YOUTUBE] Task ${t.taskId} marked as completed`);
			completed++;
		} catch (err) {
			console.error(
				`[YOUTUBE] Error updating doc ${t.docId} or task ${t.taskId}:`,
				err,
			);
		}
	}
	// Log summary
	console.log(`[YOUTUBE] Patched ${completed} docs/tasks sequentially`);
	return {
		processed: completed,
		errors: errorTasks.length + (validTasks.length - completed),
	};
}

export async function POST(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.error(
			"[YOUTUBE] Unauthorized request: invalid authorization header",
		);
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		console.log("[YOUTUBE] POST handler started");
		// Repopulate youtubeUpdateTask queue if empty
		let tasks = await sanityWriteClient.fetch(
			`*[_type == "youtubeUpdateTask" && status == "pending"]| order(lastChecked asc)[0...1]{ _id }`,
		);
		console.log(`[YOUTUBE] Pending tasks in queue: ${tasks?.length || 0}`);
		if (!tasks || tasks.length === 0) {
			console.log(
				"[YOUTUBE] No pending tasks, repopulating queue from posts and podcasts",
			);
			const podcasts = await sanityWriteClient.fetch(
				'*[_type == "podcast" && defined(youtube)]{_id, _type, youtube,date} | order(date desc)[0...1000]',
			);
			const posts = await sanityWriteClient.fetch(
				'*[_type == "post" && defined(youtube)]{_id, _type, youtube,date} | order(date desc)[0...1000]',
			);
			const allDocs = [...podcasts, ...posts];
			console.log(`[YOUTUBE] Found ${allDocs.length} docs with YouTube`);
			// Fetch all existing youtubeUpdateTask docs for these docs
			const existingTasks = await sanityWriteClient.fetch(
				'*[_type == "youtubeUpdateTask" && defined(targetDoc._ref)]{_id, targetDoc}',
			);
			const existingTaskMap = new Map(
				existingTasks.map(
					(t: { _id: string; targetDoc?: { _ref?: string } }) => [
						t.targetDoc?._ref,
						t._id,
					],
				),
			);
			for (const doc of allDocs) {
				const taskId = existingTaskMap.get(doc._id);
				if (typeof taskId === "string" && taskId) {
					// Update status to pending
					try {
						await sanityWriteClient
							.patch(taskId)
							.set({ status: "pending", lastChecked: null })
							.commit({ visibility: "async" });
						console.log(
							`[YOUTUBE] Marked existing youtubeUpdateTask ${taskId} as pending for doc ${doc._id}`,
						);
					} catch (err) {
						console.error(
							`[YOUTUBE] Error marking youtubeUpdateTask ${taskId} as pending for doc ${doc._id}:`,
							err,
						);
					}
				} else {
					// Create new youtubeUpdateTask
					try {
						await sanityWriteClient.create({
							_type: "youtubeUpdateTask",
							targetDoc: { _type: "reference", _ref: doc._id },
							status: "pending",
							lastChecked: null,
						});
						console.log(
							`[YOUTUBE] Created new youtubeUpdateTask for doc ${doc._id}`,
						);
					} catch (err) {
						console.error(
							`[YOUTUBE] Error creating youtubeUpdateTask for doc ${doc._id}:`,
							err,
						);
					}
				}
			}
		}

		// Process a batch of tasks
		const result = await processBatchTasks();
		console.log("[YOUTUBE] Batch process result", result);
		return Response.json({ success: true, ...result });
	} catch (error) {
		console.error("[YOUTUBE] Unexpected error:", error);
		return Response.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}
