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
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	const searchParams = request.nextUrl.searchParams;
	const lastIdParam = searchParams.get("lastId");

	try {
		// Assume if lastId is missing that the request will be the initial starting the process.
		const sanityRead = await sanityWriteClient.fetch(
			`*[youtube != null && _id > $lastId]| order(_id)[0]{
        _id,
        youtube
      }`,
			{
				lastId: lastIdParam || "",
			},
		);

		const lastId = sanityRead?._id;

		if (!lastId) {
			const message = `No doc found based on lastId ${lastId}`;
			console.log(message);
			return Response.json({ success: true, message }, { status: 200 });
		}

		// These should never match, if they do bail.
		if (lastId === lastIdParam) {
			console.error("lastId matches current doc, stopping calls.");
			return new Response("lastId matches current doc, stopping calls.", {
				status: 200,
			});
		}

		const id = youtubeParser(sanityRead?.youtube);

		if (!id) {
			console.error("Missing YouTube Id");
			return new Response("Missing YouTube Id", { status: 404 });
		}

		const videoResp = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.YOUTUBE_API_KEY}&fields=items(id,statistics)&part=statistics`,
		);
		const json = await videoResp.json();
		if (videoResp.status !== 200) {
			console.error(JSON.stringify(json));
			return Response.json(json, { status: videoResp.status });
		}
		console.log(JSON.stringify(json));
		const statistics = json?.items?.at(0)?.statistics;

		if (!statistics) {
			const words = `No statistics found for YouTube Id ${id}`;
			console.error(words);
			return new Response(words, { status: 404 });
		}

		// Update current doc with stats
		const sanityUpdate = await sanityWriteClient
			.patch(lastId)
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
			.commit();

		// Trigger next call, don't wait for response
		fetch(publicURL() + `/api/youtube/views?lastId=${lastId}`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${process.env.CRON_SECRET}`,
				"Cache-Control": "no-cache",
			},
		});

		return Response.json(sanityUpdate);
	} catch (error) {
		console.error(JSON.stringify(error));
		return Response.json({ success: false }, { status: 404 });
	}
}
