import { documentEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";
import { youtubeParser } from "../../lib/utils";

interface TargetContentDocument {
	_id: string;
	_type: string;
	title?: string;
	youtube?: string;
	transcript?: {
		_type: "reference";
		_ref: string;
	};
}

interface Chapter {
	title: string;
	start: number;
	timestamp: string;
}

interface Cue {
	start: number;
	duration: number;
	text: string;
}

function parseIsoDuration(duration?: string): number {
	if (!duration) return 0;
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return 0;
	const hours = parseInt(match[1] || "0", 10);
	const minutes = parseInt(match[2] || "0", 10);
	const seconds = parseInt(match[3] || "0", 10);
	return hours * 3600 + minutes * 60 + seconds;
}

function extractChaptersFromDescription(description?: string): Chapter[] {
	if (!description) return [];
	const lines = description.split("\n");
	const chapters: Chapter[] = [];
	const chapterRegex =
		/(?:^|\s)(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\s+[-–—:]\s*|\s+)(.+)$/;

	for (const line of lines) {
		const match = line.trim().match(chapterRegex);
		if (match) {
			const hours = match[1] ? parseInt(match[1], 10) : 0;
			const minutes = parseInt(match[2], 10);
			const seconds = parseInt(match[3], 10);
			const totalSeconds = hours * 3600 + minutes * 60 + seconds;
			const title = match[4].trim();
			const timestamp = match[1]
				? `${match[1]}:${match[2].padStart(2, "0")}:${match[3].padStart(2, "0")}`
				: `${match[2]}:${match[3].padStart(2, "0")}`;
			chapters.push({ title, start: totalSeconds, timestamp });
		}
	}
	return chapters;
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
}> {
	// 1. Try Residential Bridge Service if configured
	const bridgeUrl = process.env.TRANSCRIPT_BRIDGE_URL || "https://transcripts.codingcat.dev";
	const bridgeToken = process.env.TRANSCRIPT_BRIDGE_TOKEN || "e06fdac10c7c18aed27e47e3d18860121a0ca378288a3e04";

	if (bridgeUrl) {
		try {
			const bridgeResp = await fetch(`${bridgeUrl.replace(/\/+$/, "")}/transcript?videoId=${videoId}`, {
				headers: bridgeToken ? { Authorization: `Bearer ${bridgeToken}` } : {},
			});
			if (bridgeResp.ok) {
				const data = (await bridgeResp.json()) as any;
				if (data?.status === "completed" && Array.isArray(data?.cues) && data.cues.length > 0) {
					console.log(`[Sync YouTube Transcript] Successfully fetched captions via residential bridge for ${videoId}`);
					return {
						cues: data.cues,
						fullText: data.fullText || data.cues.map((c: any) => c.text).join(" "),
						status: "completed",
					};
				}
			}
		} catch (bridgeErr) {
			console.warn(`[Sync YouTube Transcript] Residential bridge failed, trying direct fallback:`, bridgeErr);
		}
	}

	const INNERTUBE_API_URL =
		"https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
	const INNERTUBE_CLIENT_VERSION = "20.10.38";

	try {
		// Acquire fresh visitorData token to bypass LOGIN_REQUIRED in datacenter environments
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
			console.warn(
				`[Sync YouTube Transcript] Innertube API returned HTTP ${response.status}`,
			);
			return { cues: [], fullText: "", status: "no_caption_available" };
		}

		const data = await response.json();
		const captionTracks =
			data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

		if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
			console.log(
				`[Sync YouTube Transcript] No caption tracks found for video: ${videoId}`,
			);
			return { cues: [], fullText: "", status: "no_caption_available" };
		}

		// Prefer English track or default to first
		const track =
			captionTracks.find(
				(t: any) =>
					t?.languageCode?.toLowerCase().startsWith("en") ||
					t?.name?.runs?.[0]?.text?.toLowerCase().includes("english"),
			) || captionTracks[0];

		if (!track?.baseUrl) {
			return { cues: [], fullText: "", status: "no_caption_available" };
		}

		const captionResp = await fetch(track.baseUrl);
		if (!captionResp.ok) {
			console.warn(
				`[Sync YouTube Transcript] Failed to fetch caption track XML: HTTP ${captionResp.status}`,
			);
			return { cues: [], fullText: "", status: "no_caption_available" };
		}

		const xml = await captionResp.text();
		const cues: Cue[] = [];

		// Try srv3 format (<p t="ms" d="ms">text</p>)
		const pRegex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
		let match: RegExpExecArray | null;

		while ((match = pRegex.exec(xml)) !== null) {
			const startMs = parseInt(match[1], 10);
			const durMs = parseInt(match[2], 10);
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
			if (text) {
				cues.push({
					start: Math.round((startMs / 1000) * 100) / 100,
					duration: Math.round((durMs / 1000) * 100) / 100,
					text,
				});
			}
		}

		// Fallback to classic format (<text start="s" dur="s">text</text>)
		if (cues.length === 0) {
			const textRegex = /<text\s+start="([^"]*)"\s+dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
			while ((match = textRegex.exec(xml)) !== null) {
				const start = parseFloat(match[1]);
				const dur = parseFloat(match[2]);
				const text = decodeHtmlEntities(match[3]);
				if (text) {
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
	} catch (error) {
		console.warn(
			`[Sync YouTube Transcript] Error fetching captions for ${videoId}:`,
			error,
		);
		return { cues: [], fullText: "", status: "no_caption_available" };
	}
}

function generateSummary(
	title: string,
	description: string,
	fullText: string,
): string {
	const descSnippet = description ? description.slice(0, 300).trim() : "";
	if (fullText && fullText.length > 50) {
		const transcriptSnippet = fullText.slice(0, 400).trim();
		return `${title}: ${descSnippet ? descSnippet + " — " : ""}${transcriptSnippet}...`;
	}
	return `${title}: ${descSnippet}`;
}

export const handler = documentEventHandler<TargetContentDocument>(
	async ({ context, event }) => {
		const rawData = event.data;
		if (!rawData?._id || !rawData?._type) {
			console.log("[Sync YouTube Transcript] No valid document data in event, skipping.");
			return;
		}

		// Skip drafts
		if (rawData._id.startsWith("drafts.")) {
			console.log("[Sync YouTube Transcript] Skipping draft document:", rawData._id);
			return;
		}

		// Production dataset enforcement
		const dataset = context.clientOptions?.dataset || "dev";
		if (dataset !== "production") {
			console.log(
				`[Sync YouTube Transcript] Skipping execution: dataset is "${dataset}", execution restricted to "production".`,
			);
			return;
		}

		// Extract YouTube ID
		if (!rawData.youtube) {
			console.log(
				`[Sync YouTube Transcript] Document ${rawData._id} has no youtube field, skipping.`,
			);
			return;
		}

		const youtubeId = youtubeParser(rawData.youtube);
		if (!youtubeId) {
			console.log(
				`[Sync YouTube Transcript] Could not parse YouTube video ID from "${rawData.youtube}" for document ${rawData._id}.`,
			);
			return;
		}

		// YouTube API Key validation: strictly required per project specification
		const apiKey = process.env.YOUTUBE_API_KEY;
		if (!apiKey) {
			throw new Error(
				"[Sync YouTube Transcript] YOUTUBE_API_KEY environment variable is missing. Full access to video intelligence is required.",
			);
		}

		const client = createClient({
			...context.clientOptions,
			apiVersion: "2025-09-30",
		});

		const transcriptId = `transcript-yt-${youtubeId}`;

		// Recursion guard and recent fetch check:
		// If document already links to this transcript and the transcript was fetched within the last 24 hours, skip.
		const existingTranscript = await client
			.getDocument<{ _id: string; lastFetchedAt?: string }>(transcriptId)
			.catch(() => null);

		const isLinked = rawData.transcript?._ref === transcriptId;

		if (existingTranscript && isLinked && existingTranscript.lastFetchedAt) {
			const lastFetched = new Date(existingTranscript.lastFetchedAt).getTime();
			const now = Date.now();
			const oneDayMs = 24 * 60 * 60 * 1000;
			if (now - lastFetched < oneDayMs) {
				console.log(
					`[Sync YouTube Transcript] Transcript ${transcriptId} already up to date and linked to ${rawData._id}. Skipping.`,
				);
				return;
			}
		}

		console.log(
			`[Sync YouTube Transcript] Fetching YouTube Data API v3 for video ID: ${youtubeId}`,
		);

		// Fetch video metadata via YouTube Data API v3
		const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,topicDetails&id=${youtubeId}&key=${apiKey}`;
		const ytResp = await fetch(ytApiUrl);

		if (!ytResp.ok) {
			const errorText = await ytResp.text();
			throw new Error(
				`[Sync YouTube Transcript] YouTube Data API returned HTTP ${ytResp.status}: ${errorText}`,
			);
		}

		const ytData = await ytResp.json();
		const videoItem = ytData?.items?.[0];

		if (!videoItem) {
			throw new Error(
				`[Sync YouTube Transcript] Video not found on YouTube for ID: ${youtubeId}`,
			);
		}

		const snippet = videoItem.snippet || {};
		const contentDetails = videoItem.contentDetails || {};
		const statistics = videoItem.statistics || {};
		const topicDetails = videoItem.topicDetails || {};

		const duration = contentDetails.duration || "";
		const durationSeconds = parseIsoDuration(duration);
		const chapters = extractChaptersFromDescription(snippet.description);

		console.log(
			`[Sync YouTube Transcript] Fetching timed captions for video ID: ${youtubeId}`,
		);
		const captionResult = await fetchYouTubeCaptions(youtubeId);

		const summary = generateSummary(
			snippet.title || rawData.title || "Video",
			snippet.description || "",
			captionResult.fullText,
		);

		// 1. Create or replace the published transcript document
		await client.createOrReplace({
			_id: transcriptId,
			_type: "transcript",
			title: snippet.title || rawData.title || `YouTube: ${youtubeId}`,
			youtubeId,
			youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
			contentRef: {
				_type: "reference",
				_ref: rawData._id,
			},
			channelTitle: snippet.channelTitle,
			channelId: snippet.channelId,
			publishedAt: snippet.publishedAt,
			duration,
			durationSeconds,
			description: snippet.description || "",
			tags: snippet.tags || [],
			topicCategories: topicDetails.topicCategories || [],
			status: captionResult.status,
			fullText: captionResult.fullText,
			summary,
			chapters,
			cues: captionResult.cues,
			statistics: {
				viewCount: statistics.viewCount
					? parseInt(statistics.viewCount, 10)
					: undefined,
				likeCount: statistics.likeCount
					? parseInt(statistics.likeCount, 10)
					: undefined,
				commentCount: statistics.commentCount
					? parseInt(statistics.commentCount, 10)
					: undefined,
				favoriteCount: statistics.favoriteCount
					? parseInt(statistics.favoriteCount, 10)
					: undefined,
			},
			lastFetchedAt: new Date().toISOString(),
		});

		console.log(
			`[Sync YouTube Transcript] Successfully created/updated published transcript ${transcriptId} (cues: ${captionResult.cues.length}, status: ${captionResult.status}).`,
		);

		// 2. Link reference in parent document if not already linked
		if (!isLinked) {
			console.log(
				`[Sync YouTube Transcript] Linking transcript ${transcriptId} to source document ${rawData._id}.`,
			);
			await client
				.patch(rawData._id)
				.set({
					transcript: {
						_type: "reference",
						_ref: transcriptId,
					},
				})
				.commit();
			console.log(
				`[Sync YouTube Transcript] Parent document ${rawData._id} patched with transcript reference.`,
			);
		}
	},
);
