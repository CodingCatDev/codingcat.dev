export const fetchCache = "force-no-store";

import { publicURL } from "@/lib/utils";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.error("[CRON] Unauthorized request: invalid authorization header");
		return new Response("Unauthorized", {
			status: 401,
		});
	}
	try {
		let totalUpdated = 0;
		let keepGoing = true;
		let loopCount = 0;
		const maxLoops = 200; // Safety: 200*10 = 2000 videos max per day
		while (keepGoing && loopCount < maxLoops) {
			const url = `${publicURL()}/api/youtube/views`;
			const res = await fetch(url, {
				method: "POST",
				headers: {
					authorization: `Bearer ${process.env.CRON_SECRET}`,
					"Cache-Control": "no-cache",
				},
			});
			if (!res.ok) {
				console.error("[CRON] Failed to trigger YouTube views:", res.status);
				break;
			}
			const json = await res.json();
			if (json && json.updatedCount) {
				totalUpdated += json.updatedCount;
			}
			// If no more tasks, stop
			if (!json || !json.updatedCount || json.updatedCount === 0) {
				keepGoing = false;
			}
			loopCount++;
		}
		return Response.json({ success: true, totalUpdated, loops: loopCount });
	} catch (err) {
		console.error("[CRON] Unexpected error:", err);
		return Response.json(
			{ success: false, error: String(err) },
			{ status: 500 },
		);
	}
}
