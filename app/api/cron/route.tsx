export const fetchCache = "force-no-store";

import { publicURL } from "@/lib/utils";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}
	// Don't await just trigger
	console.log("youtube views triggered");
	fetch(publicURL() + `/api/youtube/views`, {
		method: "POST",
		headers: {
			authorization: `Bearer ${process.env.CRON_SECRET}`,
			"Cache-Control": "no-cache",
		},
	});

	return Response.json({ success: true });
}
