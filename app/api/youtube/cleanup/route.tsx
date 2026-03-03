/**
 * One-time cleanup script: Delete all youtubeUpdateTask documents from Sanity.
 * 
 * Run via: POST /api/youtube/cleanup
 * Auth: Bearer CRON_SECRET
 * 
 * DELETE THIS FILE after running it once.
 */
export const fetchCache = "force-no-store";

import { createClient } from "next-sanity";
import type { NextRequest } from "next/server";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

const sanityWriteClient = createClient({
	projectId,
	dataset,
	apiVersion,
	token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
	perspective: "published",
	useCdn: false,
});

export async function POST(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		// Count existing tasks
		const count = await sanityWriteClient.fetch(
			`count(*[_type == "youtubeUpdateTask"])`
		);
		console.log(`[CLEANUP] Found ${count} youtubeUpdateTask documents to delete`);

		if (count === 0) {
			return Response.json({ success: true, deleted: 0, message: "No documents to delete" });
		}

		// Delete in batches of 100
		let totalDeleted = 0;
		while (true) {
			const tasks: { _id: string }[] = await sanityWriteClient.fetch(
				`*[_type == "youtubeUpdateTask"][0...100]{ _id }`
			);

			if (!tasks || tasks.length === 0) break;

			// Use transaction for batch delete
			const tx = sanityWriteClient.transaction();
			for (const task of tasks) {
				tx.delete(task._id);
			}
			await tx.commit({ visibility: "async" });

			totalDeleted += tasks.length;
			console.log(`[CLEANUP] Deleted batch of ${tasks.length} (total: ${totalDeleted})`);
		}

		console.log(`[CLEANUP] Done. Deleted ${totalDeleted} youtubeUpdateTask documents.`);
		return Response.json({ success: true, deleted: totalDeleted });
	} catch (error) {
		console.error("[CLEANUP] Error:", error);
		return Response.json(
			{ success: false, error: String(error) },
			{ status: 500 }
		);
	}
}
