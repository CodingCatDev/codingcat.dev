export const fetchCache = "force-no-store";

import { publicURL } from "@/lib/utils";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.error("[CRON] Unauthorized request: invalid authorization header");
		return new Response("Unauthorized", {
			status: 401,
		});
	}
	try {
		const url = `${publicURL()}/api/youtube/views`;
		console.log("[CRON] Triggering YouTube views update:", url);
		fetch(url, {
			method: "POST",
			headers: {
				authorization: `Bearer ${process.env.CRON_SECRET}`,
				"Cache-Control": "no-cache",
			},
		})
			.then((res) => {
				if (!res.ok) {
					console.error("[CRON] Failed to trigger YouTube views:", res.status);
				} else {
					console.log("[CRON] Successfully triggered YouTube views update.");
				}
			})
			.catch((err) => {
				console.error("[CRON] Error triggering YouTube views:", err);
			});
		return Response.json({ success: true });
	} catch (err) {
		console.error("[CRON] Unexpected error:", err);
		return Response.json(
			{ success: false, error: String(err) },
			{ status: 500 },
		);
	}
}
