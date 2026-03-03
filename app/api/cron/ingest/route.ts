export const fetchCache = "force-no-store";

import type { NextRequest } from "next/server";

import { generateWithGemini } from "@/lib/gemini";
import { writeClient } from "@/lib/sanity-write-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RSSItem {
	title: string;
	url: string;
}

interface ScriptScene {
	sceneNumber: number;
	narration: string;
	visualDescription: string;
	bRollKeywords: string[];
	durationEstimate: number;
}

interface GeneratedScript {
	title: string;
	summary: string;
	sourceUrl: string;
	topics: string[];
	script: {
		hook: string;
		scenes: ScriptScene[];
		cta: string;
	};
	qualityScore: number;
}

interface CriticResult {
	score: number;
	issues: string[];
	summary: string;
}

// ---------------------------------------------------------------------------
// RSS Feed Helpers
// ---------------------------------------------------------------------------

const RSS_FEEDS = [
	"https://hnrss.org/newest?q=javascript+OR+react+OR+nextjs+OR+typescript&points=50",
	"https://dev.to/feed/tag/webdev",
];

const FALLBACK_TOPICS: RSSItem[] = [
	{
		title: "React Server Components: The Future of Web Development",
		url: "https://react.dev/blog",
	},
	{
		title: "TypeScript 5.x: New Features Every Developer Should Know",
		url: "https://devblogs.microsoft.com/typescript/",
	},
	{
		title: "Next.js App Router Best Practices for 2025",
		url: "https://nextjs.org/blog",
	},
	{
		title: "The State of CSS in 2025: Container Queries, Layers, and More",
		url: "https://web.dev/blog",
	},
	{
		title: "WebAssembly is Changing How We Build Web Apps",
		url: "https://webassembly.org/",
	},
];

function extractRSSItems(xml: string): RSSItem[] {
	const items: RSSItem[] = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
	let itemMatch: RegExpExecArray | null;

	while ((itemMatch = itemRegex.exec(xml)) !== null) {
		const block = itemMatch[1];

		const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
		const titleAlt = block.match(/<title>(.*?)<\/title>/);
		const title = titleMatch?.[1] ?? titleAlt?.[1] ?? "";

		const linkMatch = block.match(/<link>(.*?)<\/link>/);
		const url = linkMatch?.[1] ?? "";

		if (title && url) {
			items.push({ title: title.trim(), url: url.trim() });
		}
	}

	return items;
}

async function fetchTrendingTopics(): Promise<RSSItem[]> {
	const allItems: RSSItem[] = [];

	const results = await Promise.allSettled(
		RSS_FEEDS.map(async (feedUrl) => {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 10_000);
			try {
				const res = await fetch(feedUrl, { signal: controller.signal });
				if (!res.ok) {
					console.warn(
						`[CRON/ingest] RSS fetch failed for ${feedUrl}: ${res.status}`,
					);
					return [];
				}
				const xml = await res.text();
				return extractRSSItems(xml);
			} finally {
				clearTimeout(timeout);
			}
		}),
	);

	for (const result of results) {
		if (result.status === "fulfilled") {
			allItems.push(...result.value);
		} else {
			console.warn("[CRON/ingest] RSS feed error:", result.reason);
		}
	}

	const seen = new Set<string>();
	const unique = allItems.filter((item) => {
		const key = item.title.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	if (unique.length === 0) {
		console.warn("[CRON/ingest] No RSS items fetched, using fallback topics");
		return FALLBACK_TOPICS;
	}

	return unique.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Gemini Script Generation
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTION =
	"You are a content strategist for CodingCat.dev, a web development education channel. You create engaging, Cleo Abram-style explainer video scripts that are educational, energetic, and concise (60-90 seconds).";

function buildPrompt(topics: RSSItem[]): string {
	const topicList = topics
		.map((t, i) => `${i + 1}. "${t.title}" — ${t.url}`)
		.join("\n");

	return `Here are today's trending web development topics:

${topicList}

Pick the MOST interesting and timely topic for a short explainer video (60-90 seconds). Then generate a complete video script as JSON matching this exact schema:

{
  "title": "string - catchy video title",
  "summary": "string - 1-2 sentence summary of what the video covers",
  "sourceUrl": "string - URL of the source article/trend you picked",
  "topics": ["string array of relevant tags, e.g. react, nextjs, typescript"],
  "script": {
    "hook": "string - attention-grabbing opening line (5-10 seconds)",
    "scenes": [
      {
        "sceneNumber": 1,
        "narration": "string - what the narrator says",
        "visualDescription": "string - what to show on screen",
        "bRollKeywords": ["keyword1", "keyword2"],
        "durationEstimate": 15
      }
    ],
    "cta": "string - call to action (subscribe, check link, etc.)"
  },
  "qualityScore": 75
}

Requirements:
- The script should have 3-5 scenes totaling 60-90 seconds
- The hook should be punchy and curiosity-driven
- Each scene should have clear visual direction
- The qualityScore should be your honest self-assessment (0-100)
- Return ONLY the JSON object, no markdown or extra text`;
}

// ---------------------------------------------------------------------------
// Optional Claude Critic
// ---------------------------------------------------------------------------

async function claudeCritic(script: GeneratedScript): Promise<CriticResult> {
	const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
	if (!ANTHROPIC_API_KEY) {
		return { score: script.qualityScore, issues: [], summary: "No critic available" };
	}

	try {
		const res = await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": ANTHROPIC_API_KEY,
				"anthropic-version": "2023-06-01",
			},
			body: JSON.stringify({
				model: "claude-sonnet-4-20250514",
				max_tokens: 1024,
				messages: [
					{
						role: "user",
						content: `You are a quality reviewer for short-form educational video scripts about web development.

Review this video script and provide a JSON response with:
- "score": number 0-100 (overall quality rating)
- "issues": string[] (list of specific problems, if any)
- "summary": string (brief overall assessment)

Evaluate based on:
1. Educational value — does it teach something useful?
2. Engagement — is the hook compelling? Is the pacing good?
3. Accuracy — are there any technical inaccuracies?
4. Clarity — is the narration clear and concise?
5. Visual direction — are the visual descriptions actionable?

Script to review:
${JSON.stringify(script, null, 2)}

Respond with ONLY the JSON object.`,
					},
				],
			}),
		});

		if (!res.ok) {
			console.warn(`[CRON/ingest] Claude critic failed: ${res.status}`);
			return { score: script.qualityScore, issues: [], summary: "Critic API error" };
		}

		const data = await res.json();
		const text = data.content?.[0]?.text ?? "{}";

		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			return { score: script.qualityScore, issues: [], summary: "Could not parse critic response" };
		}

		const parsed = JSON.parse(jsonMatch[0]) as CriticResult;
		return {
			score: typeof parsed.score === "number" ? parsed.score : script.qualityScore,
			issues: Array.isArray(parsed.issues) ? parsed.issues : [],
			summary: typeof parsed.summary === "string" ? parsed.summary : "No summary",
		};
	} catch (err) {
		console.warn("[CRON/ingest] Claude critic error:", err);
		return { score: script.qualityScore, issues: [], summary: "Critic error" };
	}
}

// ---------------------------------------------------------------------------
// Sanity Document Creation
// ---------------------------------------------------------------------------

async function createSanityDocuments(
	script: GeneratedScript,
	criticResult: CriticResult,
) {
	const isFlagged = criticResult.score < 50;

	const contentIdea = await writeClient.create({
		_type: "contentIdea",
		title: script.title,
		summary: script.summary,
		sourceUrl: script.sourceUrl,
		topics: script.topics,
		collectedAt: new Date().toISOString(),
		status: "approved",
	});

	console.log(`[CRON/ingest] Created contentIdea: ${contentIdea._id}`);

	const automatedVideo = await writeClient.create({
		_type: "automatedVideo",
		title: script.title,
		slug: { _type: "slug", current: script.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
		contentIdea: {
			_type: "reference",
			_ref: contentIdea._id,
		},
		script: script.script,
		scriptQualityScore: criticResult.score,
		status: isFlagged ? "flagged" : "script_ready",
		...(isFlagged && {
			flaggedReason: `Quality score ${criticResult.score}/100. Issues: ${criticResult.issues.join("; ") || "Low quality score"}`,
		}),
	});

	console.log(`[CRON/ingest] Created automatedVideo: ${automatedVideo._id}`);

	return {
		contentIdeaId: contentIdea._id,
		automatedVideoId: automatedVideo._id,
		status: isFlagged ? "flagged" : "script_ready",
	};
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.error(
			"[CRON/ingest] Unauthorized request: invalid authorization header",
		);
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		console.log("[CRON/ingest] Fetching trending topics...");
		const topics = await fetchTrendingTopics();
		console.log(`[CRON/ingest] Found ${topics.length} topics`);

		console.log("[CRON/ingest] Generating script with Gemini...");
		const prompt = buildPrompt(topics);
		const rawResponse = await generateWithGemini(prompt, SYSTEM_INSTRUCTION);

		let script: GeneratedScript;
		try {
			script = JSON.parse(rawResponse) as GeneratedScript;
		} catch (parseErr) {
			console.error(
				"[CRON/ingest] Failed to parse Gemini response:",
				rawResponse,
			);
			return Response.json(
				{
					error: "Failed to parse Gemini response",
					raw: rawResponse.slice(0, 500),
				},
				{ status: 502 },
			);
		}

		console.log(`[CRON/ingest] Generated script: "${script.title}"`);

		console.log("[CRON/ingest] Running critic pass...");
		const criticResult = await claudeCritic(script);
		console.log(
			`[CRON/ingest] Critic score: ${criticResult.score}/100 — ${criticResult.summary}`,
		);

		console.log("[CRON/ingest] Creating Sanity documents...");
		const result = await createSanityDocuments(script, criticResult);

		console.log("[CRON/ingest] Done!", result);

		return Response.json({
			success: true,
			...result,
			title: script.title,
			criticScore: criticResult.score,
			topicCount: topics.length,
		});
	} catch (err) {
		console.error("[CRON/ingest] Unexpected error:", err);
		return Response.json(
			{
				success: false,
				error: err instanceof Error ? err.message : String(err),
			},
			{ status: 500 },
		);
	}
}
