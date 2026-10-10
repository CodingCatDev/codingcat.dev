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

interface Cue {
	start: number;
	duration: number;
	text: string;
}

function decodeHtmlEntities(text: string): string {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
			String.fromCodePoint(parseInt(hex, 16)),
		)
		.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
		.replace(/\s+/g, " ")
		.trim();
}

async function fetchYouTubeCaptions(videoId: string): Promise<{
	cues: Cue[];
	fullText: string;
	status: "completed" | "no_caption_available";
	error?: string;
}> {
	// 1. Try Residential Bridge Service
	try {
		const bridgeResp = await fetch(`https://transcripts.codingcat.dev/transcript?videoId=${videoId}`, {
			headers: {
				Authorization: "Bearer e06fdac10c7c18aed27e47e3d18860121a0ca378288a3e04",
			},
		});
		if (bridgeResp.ok) {
			const data = (await bridgeResp.json()) as any;
			if (data?.status === "completed" && Array.isArray(data?.cues) && data.cues.length > 0) {
				return {
					cues: data.cues,
					fullText: data.fullText || data.cues.map((c: any) => c.text).join(" "),
					status: "completed",
				};
			}
		}
	} catch (bridgeErr) {
		console.warn("[transcript api] Bridge service call error:", bridgeErr);
	}

	const INNERTUBE_API_URL =
		"https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
	const INNERTUBE_CLIENT_VERSION = "20.10.38";

	try {
		// Acquire fresh visitorData token to bypass LOGIN_REQUIRED in Cloudflare datacenters
		let visitorData: string | undefined;
		try {
			const pageResp = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
					"Accept-Language": "en-US,en;q=0.9",
				},
			});
			if (pageResp.ok) {
				const html = await pageResp.text();
				const match = html.match(/"visitorData":"([^"]+)"/);
				if (match) {
					visitorData = match[1];
				}
			}
		} catch {}

		const requestHeaders: Record<string, string> = {
			"Content-Type": "application/json",
			"User-Agent": `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`,
		};
		if (visitorData) {
			requestHeaders["X-Goog-Visitor-Id"] = visitorData;
		}

		const response = await fetch(INNERTUBE_API_URL, {
			method: "POST",
			headers: requestHeaders,
			body: JSON.stringify({
				context: {
					client: {
						clientName: "ANDROID",
						clientVersion: INNERTUBE_CLIENT_VERSION,
						...(visitorData ? { visitorData } : {}),
					},
				},
				videoId,
			}),
		});

		if (!response.ok) {
			return { cues: [], fullText: "", status: "no_caption_available", error: `innertube_http_${response.status}` };
		}

		const data: any = await response.json();
		const playability = data?.playabilityStatus?.status;
		const captionTracks =
			data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

		if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
			return { cues: [], fullText: "", status: "no_caption_available", error: `no_tracks_playability_${playability}` };
		}

		// Prefer English track or default to first
		const track =
			captionTracks.find(
				(t: any) =>
					t?.languageCode?.toLowerCase().startsWith("en") ||
					t?.name?.runs?.[0]?.text?.toLowerCase().includes("english"),
			) || captionTracks[0];

		if (!track?.baseUrl) {
			return { cues: [], fullText: "", status: "no_caption_available", error: "missing_track_baseUrl" };
		}

		const captionResp = await fetch(track.baseUrl);
		if (!captionResp.ok) {
			return { cues: [], fullText: "", status: "no_caption_available", error: `caption_fetch_http_${captionResp.status}` };
		}

		const xml = await captionResp.text();
		if (!xml || xml.length === 0) {
			return { cues: [], fullText: "", status: "no_caption_available", error: "caption_xml_empty" };
		}
		const cues: Cue[] = [];

		// Try srv3 format (<p t="ms" d="ms">text</p>)
		const pRegex = /<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
		let match: RegExpExecArray | null;

		while ((match = pRegex.exec(xml)) !== null) {
			const startMs = parseInt(match[1], 10);
			const durMs = match[2] ? parseInt(match[2], 10) : 3000;
			const inner = match[3];

			let text = "";
			const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
			let sMatch: RegExpExecArray | null;
			while ((sMatch = sRegex.exec(inner)) !== null) {
				text += sMatch[1];
			}
			if (!text) {
				text = inner.replace(/<[^>]+>/g, "");
			}

			text = decodeHtmlEntities(text);
			if (text && !text.startsWith("[")) {
				cues.push({
					start: Math.round((startMs / 1000) * 100) / 100,
					duration: Math.round((durMs / 1000) * 100) / 100,
					text,
				});
			}
		}

		// Fallback to standard <text start="s" dur="s"> format
		if (cues.length === 0) {
			const textRegex =
				/<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g;
			while ((match = textRegex.exec(xml)) !== null) {
				const start = parseFloat(match[1]);
				const dur = match[2] ? parseFloat(match[2]) : 3.0;
				let text = decodeHtmlEntities(match[3].replace(/<[^>]+>/g, ""));
				if (text && !text.startsWith("[")) {
					cues.push({
						start: Math.round(start * 100) / 100,
						duration: Math.round(dur * 100) / 100,
						text,
					});
				}
			}
		}

		const fullText = cues.map((c) => c.text).join(" ");
		return {
			cues,
			fullText,
			status: cues.length > 0 ? "completed" : "no_caption_available",
		};
	} catch (err: any) {
		console.warn("[fetchYouTubeCaptions error]", err);
		return {
			cues: [],
			fullText: "",
			status: "no_caption_available",
			error: err?.message || String(err),
		};
	}
}

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
	let ytId: string | undefined;
	let parentDocTitle = "Transcript";

	// 1. Try finding by ID
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
			if (transcriptDoc?.youtubeId) {
				ytId = transcriptDoc.youtubeId;
			}
		} catch {}
	}

	// 2. Try finding by content slug
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
				ytId = parseYoutubeId(parent.youtube) || transcriptDoc?.youtubeId;
			}
		} catch {}
	}

	// 3. Try finding by YouTube ID
	if (!transcriptDoc && (youtubeParam || ytId)) {
		const rawYt = youtubeParam || ytId || "";
		ytId = parseYoutubeId(rawYt) || (rawYt.length === 11 ? rawYt : undefined);
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

	// If we have a transcript in Sanity with real text, return it
	if (transcriptDoc && transcriptDoc.fullText && transcriptDoc.fullText.trim().length > 50) {
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
					"cache-control": "public, max-age=3600, s-maxage=86400",
				},
			},
		);
	}

	// If Sanity doc is missing fullText, but we have a YouTube video ID, fetch on demand
	const targetYtId = ytId || transcriptDoc?.youtubeId || parseYoutubeId(youtubeParam);
	let captionsResult: any = null;
	if (targetYtId) {
		captionsResult = await fetchYouTubeCaptions(targetYtId);
		if (captionsResult.status === "completed" && captionsResult.fullText.length > 50) {
			return new Response(
				JSON.stringify(
					{
						id: transcriptDoc?._id || `transcript-yt-${targetYtId}`,
						title: transcriptDoc?.title || parentDocTitle,
						youtubeUrl: `https://www.youtube.com/watch?v=${targetYtId}`,
						duration: transcriptDoc?.duration || "",
						durationSeconds: transcriptDoc?.durationSeconds || 0,
						summary: transcriptDoc?.summary || "",
						fullText: captionsResult.fullText,
						chapters: transcriptDoc?.chapters || [],
						cues: captionsResult.cues,
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
	}

	// If transcript exists but has only summary/chapters without captions
	if (transcriptDoc) {
		return new Response(
			JSON.stringify(
				{
					id: transcriptDoc._id,
					title: transcriptDoc.title || parentDocTitle,
					youtubeUrl: transcriptDoc.youtubeUrl,
					duration: transcriptDoc.duration,
					summary: transcriptDoc.summary || "",
					fullText:
						transcriptDoc.fullText ||
						transcriptDoc.summary ||
						"No auto-generated captions were available for this video from YouTube.",
					chapters: transcriptDoc.chapters || [],
					cues: transcriptDoc.cues || [],
					status: transcriptDoc.status || "no_caption_available",
					_debug: {
						targetYtId,
						captionsStatus: captionsResult?.status,
						captionsError: captionsResult?.error,
					},
				},
				null,
				2,
			),
			{
				status: 200,
				headers: {
					...CORS_HEADERS,
					"cache-control": "no-store, no-cache, must-revalidate",
				},
			},
		);
	}

	return new Response(
		JSON.stringify({ error: "Transcript not found" }),
		{ status: 404, headers: CORS_HEADERS },
	);
};
