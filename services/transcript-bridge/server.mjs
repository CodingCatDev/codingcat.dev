import http from "node:http";
import { URL } from "node:url";
import "/home/alex/codingcat-social-agent/chrome-extension/shared/sanity-posts.js";

const PORT = parseInt(process.env.PORT || "4005", 10);
const AUTH_TOKEN = process.env.BRIDGE_AUTH_TOKEN || "e06fdac10c7c18aed27e47e3d18860121a0ca378288a3e04";
const DEFAULT_HASHNODE_DRAFT = "https://hashnode.com/draft/6adff331943e682eec05f06c";

function escapeHtml(str = "") {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function renderMobileHashnodeCopyPage(post) {
	const safeTitle = escapeHtml(post.title);
	const safeSubtitle = escapeHtml(post.subtitle || "");
	const safeCanonical = escapeHtml(post.canonicalUrl);
	const safeCover = escapeHtml(post.coverImageUrl || "");
	const safeTags = escapeHtml((post.tags || []).join(", "));
	const safeMarkdown = escapeHtml(post.markdown || "");

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Copy for Hashnode: ${safeTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0B1326;
      color: #FAF9FC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    .card {
      background: #131B2E;
      border: 2px solid #7C3AED;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 4px 4px 0px #7C3AED;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .badge {
      display: inline-block;
      background: #2A1155;
      color: #C084FC;
      border: 1px solid #7C3AED;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      width: fit-content;
    }
    h1 {
      font-size: 18px;
      line-height: 1.3;
      color: #FFFFFF;
    }
    .meta {
      font-size: 12px;
      color: #86EFAC;
      word-break: break-all;
      font-family: monospace;
    }
    .btn-hero {
      background: #7C3AED;
      color: #FFFFFF;
      border: 2px solid #C084FC;
      border-radius: 14px;
      padding: 16px;
      font-size: 16px;
      font-weight: 800;
      text-align: center;
      cursor: pointer;
      box-shadow: 3px 3px 0px #C5E86C;
      width: 100%;
    }
    .btn-hero:active {
      transform: translate(1px, 1px);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .btn {
      background: #0B1326;
      color: #FAF9FC;
      border: 1.5px solid #4B2E83;
      border-radius: 12px;
      padding: 13px 10px;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn:active {
      border-color: #C5E86C;
      color: #C5E86C;
    }
    .toast {
      display: none;
      background: rgba(20, 83, 45, 0.7);
      border: 1.5px solid #86EFAC;
      color: #86EFAC;
      padding: 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
    }
    .toast.show { display: block; }
    textarea {
      width: 100%;
      height: 180px;
      background: #0B1326;
      color: #CBD5E1;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🐾 CodingCat.dev Mobile Syndicator (${post.markdown.length.toLocaleString()} chars)</span>
    <h1>${safeTitle}</h1>
    <div class="meta">${safeCanonical}</div>

    <div id="toast" class="toast"></div>

    <button class="btn-hero" id="copy-and-open">
      📋 1-Tap Copy Full Markdown &amp; Open Hashnode →
    </button>

    <div class="grid">
      <button class="btn" id="copy-md">📝 Copy Markdown Only</button>
      <button class="btn" id="copy-title">📌 Copy Title</button>
      <button class="btn" id="copy-canonical">🔗 Copy Canonical URL</button>
      <button class="btn" id="copy-subtitle">💬 Copy Subtitle</button>
      <a class="btn" href="/hashnode/${encodeURIComponent(post.slug)}.md" download="${encodeURIComponent(post.slug)}.md">⬇️ Download .md File</a>
      <a class="btn" href="${DEFAULT_HASHNODE_DRAFT}" target="_blank" rel="noopener">🚀 Open Hashnode Draft</a>
    </div>

    <textarea id="raw-md" readonly>${safeMarkdown}</textarea>
  </div>

  <script>
    const DATA = {
      title: ${JSON.stringify(post.title)},
      subtitle: ${JSON.stringify(post.subtitle || "")},
      canonicalUrl: ${JSON.stringify(post.canonicalUrl)},
      tags: ${JSON.stringify(safeTags)},
      coverImageUrl: ${JSON.stringify(safeCover)},
      draftUrl: ${JSON.stringify(DEFAULT_HASHNODE_DRAFT)}
    };
    const mdEl = document.getElementById("raw-md");
    const toastEl = document.getElementById("toast");

    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
    }

    async function copyText(text, label) {
      try {
        await navigator.clipboard.writeText(text);
        showToast("✅ Copied " + label + " to clipboard!");
      } catch {
        mdEl.value = text;
        mdEl.select();
        document.execCommand("copy");
        showToast("✅ Copied " + label + "!");
      }
    }

    document.getElementById("copy-and-open").addEventListener("click", async () => {
      await copyText(mdEl.value, "Full Markdown (" + mdEl.value.length + " chars)");
      setTimeout(() => {
        window.location.href = DATA.draftUrl;
      }, 350);
    });

    document.getElementById("copy-md").addEventListener("click", () => copyText(mdEl.value, "Full Markdown"));
    document.getElementById("copy-title").addEventListener("click", () => copyText(DATA.title, "Title"));
    document.getElementById("copy-canonical").addEventListener("click", () => copyText(DATA.canonicalUrl, "Canonical URL"));
    document.getElementById("copy-subtitle").addEventListener("click", () => copyText(DATA.subtitle, "Subtitle"));
  </script>
</body>
</html>`;
}

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

	if (reqUrl.pathname.startsWith("/hashnode/")) {
		try {
			const rawSlug = decodeURIComponent(reqUrl.pathname.replace(/^\/hashnode\//, "")).trim();
			const isRawMd = rawSlug.endsWith(".md");
			const slug = isRawMd ? rawSlug.slice(0, -3) : rawSlug;

			const posts = await globalThis.CodingCatSanity.fetchCodingCatPosts({ forceRefresh: true });
			const matched = posts.find((p) => p.slug === slug) || posts[0];

			if (!matched) {
				res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
				res.end("Post not found");
				return;
			}

			if (isRawMd) {
				res.writeHead(200, {
					"Content-Type": "text/markdown; charset=utf-8",
					"Content-Disposition": `inline; filename="${matched.slug}.md"`,
				});
				res.end(matched.markdown);
				return;
			}

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(renderMobileHashnodeCopyPage(matched));
			return;
		} catch (err) {
			res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
			res.end(`Error rendering mobile Hashnode copy page: ${err?.message || err}`);
			return;
		}
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
