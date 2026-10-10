import { scheduledEventHandler } from "@sanity/functions";
import { createClient } from "@sanity/client";
import { youtubeParser } from "../../lib/utils";

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
				`[Sync Missing YouTube Transcripts] Innertube API returned HTTP ${response.status}`,
			);
			return { cues: [], fullText: "", status: "no_caption_available" };
		}

		const data = await response.json();
		const captionTracks =
			data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

		if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
			console.log(
				`[Sync Missing YouTube Transcripts] No caption tracks found for video: ${videoId}`,
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
				`[Sync Missing YouTube Transcripts] Failed to fetch caption track XML: HTTP ${captionResp.status}`,
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
				const rawText = match[3].replace(/<[^>]+>/g, "");
				const text = decodeHtmlEntities(rawText);
				if (text) {
					cues.push({
						start: Math.round(start * 100) / 100,
						duration: Math.round(dur * 100) / 100,
						text,
					});
				}
			}
		}

		cues.sort((a, b) => a.start - b.start);
		const fullText = cues.map((c) => c.text).join(" ");

		return {
			cues,
			fullText,
			status: cues.length > 0 ? "completed" : "no_caption_available",
		};
	} catch (error) {
		console.warn(
			`[Sync Missing YouTube Transcripts] Error fetching captions for ${videoId}:`,
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

export const handler = scheduledEventHandler(async ({ context }) => {
	console.log(
		"[Sync Missing YouTube Transcripts] Starting scheduled sync for missing transcripts...",
	);

	// 1. YouTube API Key validation: strictly required
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) {
		throw new Error(
			"[Sync Missing YouTube Transcripts] YOUTUBE_API_KEY environment variable is missing. Full access to video intelligence is required.",
		);
	}

	// 2. Token validation: prefer Sanity runtime token, then project write token, then fallback
	const token =
		context.clientOptions?.token ||
		process.env.SANITY_API_WRITE_TOKEN ||
		process.env.SANITY_AUTH_TOKEN;
	if (!token) {
		throw new Error(
			"[Sync Missing YouTube Transcripts] Missing Sanity API token (neither context.clientOptions.token nor SANITY_API_WRITE_TOKEN is present).",
		);
	}

	// 3. Dataset restriction: production only
	const dataset =
		process.env.SANITY_STUDIO_DATASET ||
		context.clientOptions?.dataset ||
		"production";

	if (dataset !== "production") {
		console.log(
			`[Sync Missing YouTube Transcripts] Stack is "${dataset}". Nightly missing transcript sync only executes on production. Skipping.`,
		);
		return;
	}

	const projectId =
		context.clientOptions?.projectId ||
		process.env.SANITY_STUDIO_PROJECT_ID ||
		"hfh83o0w";

	const client = createClient({
		projectId,
		dataset,
		token,
		apiVersion: "2025-09-30",
		useCdn: false,
	});

	const batchSize = parseInt(process.env.SYNC_BATCH_SIZE || "50", 10);

	console.log(
		`[Sync Missing YouTube Transcripts] Querying documents with YouTube URLs missing transcripts or full captions in project ${projectId}, dataset ${dataset}...`,
	);

	const missingDocs = await client.fetch<
		Array<{
			_id: string;
			_type: string;
			title?: string;
			youtube: string;
		}>
	>(
		`*[_type in ["post", "podcast", "course", "lesson", "short"] && (defined(youtube) || defined(listenLinks.youtube)) && (!defined(transcript) || !defined(transcript->fullText) || length(transcript->fullText) < 50) && !(_id in path("drafts.**"))][0...$batchSize]{
			_id,
			_type,
			title,
			"youtube": coalesce(youtube, listenLinks.youtube)
		}`,
		{ batchSize },
	);

	console.log(
		`[Sync Missing YouTube Transcripts] Processing batch of ${missingDocs.length} documents (batch limit: ${batchSize})...`,
	);

	let successCount = 0;
	let failCount = 0;

	for (const doc of missingDocs) {
		const youtubeId = youtubeParser(doc.youtube);
		if (!youtubeId) {
			console.warn(
				`[Sync Missing YouTube Transcripts] Could not parse YouTube video ID from "${doc.youtube}" for document ${doc._id}. Skipping.`,
			);
			continue;
		}

		console.log(
			`[Sync Missing YouTube Transcripts] Processing video ${youtubeId} for document ${doc._id} (${doc.title || "Untitled"})...`,
		);

		try {
			const transcriptId = `transcript-yt-${youtubeId}`;

			// Fetch video metadata via YouTube Data API v3
			const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,topicDetails&id=${youtubeId}&key=${apiKey}`;
			const ytResp = await fetch(ytApiUrl);

			if (!ytResp.ok) {
				const errorText = await ytResp.text();
				throw new Error(
					`YouTube Data API returned HTTP ${ytResp.status}: ${errorText}`,
				);
			}

			const ytData = await ytResp.json();
			const videoItem = ytData?.items?.[0];

			if (!videoItem) {
				throw new Error(`Video not found on YouTube for ID: ${youtubeId}`);
			}

			const snippet = videoItem.snippet || {};
			const contentDetails = videoItem.contentDetails || {};
			const statistics = videoItem.statistics || {};
			const topicDetails = videoItem.topicDetails || {};

			const duration = contentDetails.duration || "";
			const durationSeconds = parseIsoDuration(duration);
			const chapters = extractChaptersFromDescription(snippet.description);

			const captionResult = await fetchYouTubeCaptions(youtubeId);
			const summary = generateSummary(
				snippet.title || doc.title || "Video",
				snippet.description || "",
				captionResult.fullText,
			);

			// 1. Create or replace the published transcript document
			await client.createOrReplace({
				_id: transcriptId,
				_type: "transcript",
				title: snippet.title || doc.title || `YouTube: ${youtubeId}`,
				youtubeId,
				youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
				contentRef: {
					_type: "reference",
					_ref: doc._id,
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

			// 2. Link reference in parent document
			await client
				.patch(doc._id)
				.set({
					transcript: {
						_type: "reference",
						_ref: transcriptId,
					},
				})
				.commit();

			console.log(
				`[Sync Missing YouTube Transcripts] Successfully linked ${transcriptId} to document ${doc._id}.`,
			);
			successCount++;
		} catch (err) {
			console.error(
				`[Sync Missing YouTube Transcripts] Failed to process ${doc._id} (${youtubeId}):`,
				err,
			);
			failCount++;
		}
	}

	console.log(
		`[Sync Missing YouTube Transcripts] Completed batch run. Processed: ${successCount} successful, ${failCount} failed.`,
	);
});
