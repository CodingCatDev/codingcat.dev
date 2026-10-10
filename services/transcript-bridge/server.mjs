import http from "node:http";
import { URL } from "node:url";

const PORT = parseInt(process.env.PORT || "4005", 10);
const AUTH_TOKEN = process.env.BRIDGE_AUTH_TOKEN || "e06fdac10c7c18aed27e47e3d18860121a0ca378288a3e04";

function decodeHtmlEntities(text) {
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

async function fetchYouTubeCaptions(videoId) {
	const INNERTUBE_API_URL = "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
	const INNERTUBE_CLIENT_VERSION = "20.10.38";

	try {
		let visitorData;
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

		const requestHeaders = {
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

		const data = await response.json();
		const playability = data?.playabilityStatus?.status;
		const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

		if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
			return { cues: [], fullText: "", status: "no_caption_available", error: `no_tracks_status_${playability}` };
		}

		const track =
			captionTracks.find(
				(t) =>
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
		const cues = [];

		const pRegex = /<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
		let match;

		while ((match = pRegex.exec(xml)) !== null) {
			const startMs = parseInt(match[1], 10);
			const durMs = match[2] ? parseInt(match[2], 10) : 3000;
			const inner = match[3];

			let text = "";
			const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
			let sMatch;
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

		if (cues.length === 0) {
			const textRegex = /<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g;
			while ((match = textRegex.exec(xml)) !== null) {
				const start = parseFloat(match[1]);
				const dur = match[2] ? parseFloat(match[2]) : 3.0;
				const text = decodeHtmlEntities(match[3].replace(/<[^>]+>/g, ""));
				if (text && !text.startsWith("[")) {
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
	} catch (err) {
		return {
			cues: [],
			fullText: "",
			status: "no_caption_available",
			error: err?.message || String(err),
		};
	}
}

const server = http.createServer(async (req, res) => {
	const reqUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

	if (reqUrl.pathname === "/health") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }));
		return;
	}

	if (reqUrl.pathname === "/transcript") {
		const auth = req.headers["authorization"] || req.headers["x-bridge-token"];
		const token = typeof auth === "string" ? auth.replace(/^Bearer\s+/i, "") : "";

		if (AUTH_TOKEN && token !== AUTH_TOKEN) {
			res.writeHead(401, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Unauthorized" }));
			return;
		}

		const videoId = reqUrl.searchParams.get("videoId") || reqUrl.searchParams.get("v");
		if (!videoId) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Missing videoId parameter" }));
			return;
		}

		const result = await fetchYouTubeCaptions(videoId);
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=86400",
		});
		res.end(JSON.stringify(result));
		return;
	}

	res.writeHead(404, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`[Transcript Bridge] Listening on http://127.0.0.1:${PORT}`);
});
