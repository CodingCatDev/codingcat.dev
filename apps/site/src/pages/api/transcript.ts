import { env } from "cloudflare:workers";
import { createClient } from "@sanity/client";
import type { APIRoute } from "astro";
import { youtubeId as parseYoutubeId } from "../../lib/youtube";

export const prerender = false;

const CORS_HEADERS = {
	"content-type": "application/json; charset=utf-8",
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, OPTIONS",
	"access-control-allow-headers": "Content-Type",
};

function getSanityClient() {
	const cfEnv = env as unknown as Record<string, unknown> | undefined;
	const token =
		(cfEnv?.SANITY_API_READ_TOKEN as string | undefined) ||
		process.env.SANITY_API_READ_TOKEN;

	return createClient({
		projectId: (cfEnv?.PUBLIC_SANITY_PROJECT_ID as string) || "hfh83o0w",
		dataset: (cfEnv?.PUBLIC_SANITY_DATASET as string) || "production",
		apiVersion: (cfEnv?.PUBLIC_SANITY_API_VERSION as string) || "2025-09-30",
		useCdn: !token,
		perspective: "published",
		stega: false,
		...(token ? { token } : {}),
	});
}

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: CORS_HEADERS,
	});
};

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const idParam = url.searchParams.get("id")?.trim();
	const slugParam = url.searchParams.get("slug")?.trim();
	const youtubeParam = url.searchParams.get("youtube")?.trim();

	if (!idParam && !slugParam && !youtubeParam) {
		return new Response(
			JSON.stringify({ error: "Missing required query parameter: id, slug, or youtube" }),
			{ status: 400, headers: CORS_HEADERS },
		);
	}

	const client = getSanityClient();

	let transcriptDoc: any = null;
	let parentDocTitle = "Transcript";

	// 1. Try finding transcript document directly by ID
	if (idParam) {
		try {
			transcriptDoc = await client.fetch(
				`*[_type == "transcript" && (_id == $id || _id == "transcript-yt-" + $id)][0]{
					_id,
					title,
					youtubeId,
					youtubeUrl,
					duration,
					durationSeconds,
					status,
					summary,
					fullText,
					chapters,
					cues
				}`,
				{ id: idParam },
			);
		} catch {}
	}

	// 2. Try finding parent content (podcast or post) by slug
	if (!transcriptDoc && slugParam) {
		try {
			const parent = await client.fetch(
				`*[_type in ["podcast", "post"] && slug.current == $slug][0]{
					title,
					youtube,
					"transcript": transcript->{
						_id,
						title,
						youtubeId,
						youtubeUrl,
						duration,
						durationSeconds,
						status,
						summary,
						fullText,
						chapters,
						cues
					}
				}`,
				{ slug: slugParam },
			);
			if (parent) {
				parentDocTitle = parent.title || parentDocTitle;
				transcriptDoc = parent.transcript;
			}
		} catch {}
	}

	// 3. Try finding by YouTube video ID
	if (!transcriptDoc && youtubeParam) {
		const parsedYt = parseYoutubeId(youtubeParam);
		const ytId = parsedYt || (youtubeParam.length === 11 ? youtubeParam : undefined);
		if (ytId) {
			try {
				transcriptDoc = await client.fetch(
					`*[_type == "transcript" && (youtubeId == $ytId || _id == "transcript-yt-" + $ytId)][0]{
						_id,
						title,
						youtubeId,
						youtubeUrl,
						duration,
						durationSeconds,
						status,
						summary,
						fullText,
						chapters,
						cues
					}`,
					{ ytId },
				);
			} catch {}
		}
	}

	// If no transcript found in Sanity
	if (!transcriptDoc) {
		return new Response(
			JSON.stringify({ error: "Transcript not found" }),
			{
				status: 404,
				headers: {
					...CORS_HEADERS,
					"cache-control": "no-store, no-cache, must-revalidate",
				},
			},
		);
	}

	// If transcript exists in Sanity with completed captions
	if (transcriptDoc.fullText && transcriptDoc.fullText.trim().length > 50) {
		return new Response(
			JSON.stringify(
				{
					id: transcriptDoc._id,
					title: transcriptDoc.title || parentDocTitle,
					youtubeUrl:
						transcriptDoc.youtubeUrl ||
						(transcriptDoc.youtubeId
							? `https://www.youtube.com/watch?v=${transcriptDoc.youtubeId}`
							: undefined),
					duration: transcriptDoc.duration,
					durationSeconds: transcriptDoc.durationSeconds,
					summary: transcriptDoc.summary || "",
					fullText: transcriptDoc.fullText,
					chapters: transcriptDoc.chapters || [],
					cues: transcriptDoc.cues || [],
					status: "completed",
				},
				null,
				2,
			),
			{
				status: 200,
				headers: {
					...CORS_HEADERS,
					"cache-control": "public, max-age=86400, s-maxage=604800",
				},
			},
		);
	}

	// If transcript document exists in Sanity but captions have not synced yet
	return new Response(
		JSON.stringify(
			{
				id: transcriptDoc._id,
				title: transcriptDoc.title || parentDocTitle,
				youtubeUrl: transcriptDoc.youtubeUrl,
				duration: transcriptDoc.duration,
				durationSeconds: transcriptDoc.durationSeconds,
				summary: transcriptDoc.summary || "",
				fullText:
					transcriptDoc.fullText ||
					transcriptDoc.summary ||
					"Transcript is being processed.",
				chapters: transcriptDoc.chapters || [],
				cues: transcriptDoc.cues || [],
				status: transcriptDoc.status || "pending",
			},
			null,
			2,
		),
		{
			status: 200,
			headers: {
				...CORS_HEADERS,
				"cache-control": "public, max-age=60, s-maxage=300",
			},
		},
	);
};
