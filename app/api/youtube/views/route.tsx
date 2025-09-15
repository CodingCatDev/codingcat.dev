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


export async function POST(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.error("[YOUTUBE] Unauthorized request: invalid authorization header");
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		// Fetch up to 10 pending/inProgress youtubeUpdateTask docs
		const tasks = await sanityWriteClient.fetch(
			`*[_type == "youtubeUpdateTask" && (status == "pending" || status == "inProgress")]| order(lastChecked asc nulls first)[0...10]{ _id, targetDoc->{_id, _type, youtube}, status }`
		);

		if (!tasks || tasks.length === 0) {
			const message = `[YOUTUBE] No youtubeUpdateTask docs to process`;
			console.log(message);
			return Response.json({ success: true, message }, { status: 200 });
		}

		let updatedCount = 0;
		for (const task of tasks) {
			const { _id: taskId, targetDoc, status } = task;
			if (!targetDoc || !targetDoc.youtube) {
				await sanityWriteClient.patch(taskId)
					.set({ status: "error", errorMessage: "Missing YouTube field on targetDoc", lastChecked: new Date().toISOString() })
					.commit();
				continue;
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
				continue;
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
					continue;
				}
				const statistics = json?.items?.at(0)?.statistics;
				if (!statistics) {
					await sanityWriteClient.patch(taskId)
						.set({ status: "error", errorMessage: "No statistics found", lastChecked: new Date().toISOString() })
						.commit();
					continue;
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
				updatedCount++;
			} catch (err) {
				await sanityWriteClient.patch(taskId)
					.set({ status: "error", errorMessage: String(err), lastChecked: new Date().toISOString() })
					.commit();
			}
		}
		return Response.json({ success: true, updatedCount });
	} catch (error) {
		console.error("[YOUTUBE] Unexpected error:", error);
		return Response.json({ success: false, error: String(error) }, { status: 500 });
	}
}
