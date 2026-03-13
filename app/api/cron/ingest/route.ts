export const fetchCache = "force-no-store";

import type { NextRequest } from "next/server";

import { generateWithGemini, stripCodeFences } from "@/lib/gemini";
import { writeClient } from "@/lib/sanity-write-client";
import { getConfigValue } from "@/lib/config";
import { discoverTrends, type TrendResult } from "@/lib/services/trend-discovery";
import type { ResearchPayload } from "@/lib/services/research";
import { submitResearch } from "@/lib/services/gemini-research";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScriptScene {
	sceneNumber: number;
	sceneType: "narration" | "code" | "list" | "comparison" | "mockup";
	narration: string;
	visualDescription: string;
	bRollKeywords: string[];
	durationEstimate: number;
	imagePrompts?: string[];
	// Scene-type-specific data
	code?: {
		snippet: string;
		language: string;
		highlightLines?: number[];
	};
	list?: {
		items: string[];
		icon?: string;
	};
	comparison?: {
		leftLabel: string;
		rightLabel: string;
		rows: { left: string; right: string }[];
	};
	mockup?: {
		deviceType: "browser" | "phone" | "terminal";
		screenContent: string;
	};
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
// Fallback topics (used when discoverTrends returns empty)
// ---------------------------------------------------------------------------

const FALLBACK_TRENDS: TrendResult[] = [
	{
		topic: "React Server Components: The Future of Web Development",
		slug: "react-server-components",
		score: 80,
		signals: [{ source: "blog", title: "React Server Components", url: "https://react.dev/blog", score: 80 }],
		whyTrending: "Major shift in React architecture",
		suggestedAngle: "Explain what RSC changes for everyday React developers",
	},
	{
		topic: "TypeScript 5.x: New Features Every Developer Should Know",
		slug: "typescript-5x-features",
		score: 75,
		signals: [{ source: "blog", title: "TypeScript 5.x", url: "https://devblogs.microsoft.com/typescript/", score: 75 }],
		whyTrending: "New TypeScript release with major DX improvements",
		suggestedAngle: "Walk through the top 5 new features with code examples",
	},
	{
		topic: "Next.js App Router Best Practices for 2025",
		slug: "nextjs-app-router-2025",
		score: 70,
		signals: [{ source: "blog", title: "Next.js App Router", url: "https://nextjs.org/blog", score: 70 }],
		whyTrending: "App Router adoption is accelerating",
		suggestedAngle: "Common pitfalls and how to avoid them",
	},
	{
		topic: "The State of CSS in 2025: Container Queries, Layers, and More",
		slug: "css-2025-state",
		score: 65,
		signals: [{ source: "blog", title: "CSS 2025", url: "https://web.dev/blog", score: 65 }],
		whyTrending: "CSS has gained powerful new features",
		suggestedAngle: "Demo the top 3 CSS features you should be using today",
	},
	{
		topic: "WebAssembly is Changing How We Build Web Apps",
		slug: "webassembly-web-apps",
		score: 60,
		signals: [{ source: "blog", title: "WebAssembly", url: "https://webassembly.org/", score: 60 }],
		whyTrending: "WASM adoption growing in production apps",
		suggestedAngle: "Real-world use cases where WASM outperforms JS",
	},
];

// ---------------------------------------------------------------------------
// Common stop words stripped when extracting search terms for dedup
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
	"the", "a", "an", "is", "of", "in", "for", "and", "to", "how", "why",
	"what", "with", "new", "your", "are", "was", "be", "been", "being",
	"have", "has", "had", "do", "does", "did", "will", "would", "could",
	"should", "may", "might", "must", "shall", "can", "need", "dare",
	"ought", "used", "every", "all", "both", "few", "more", "most",
	"other", "some", "such", "no", "nor", "not", "only", "own", "same",
	"so", "than", "too", "very", "just", "because", "as", "until",
	"while", "about", "between", "through", "during", "before", "after",
	"above", "below", "from", "up", "down", "out", "on", "off", "over",
	"under", "again", "further", "then", "once", "that", "this", "these",
	"those", "it", "its", "we", "you", "they", "them", "their", "our",
	"my", "he", "she", "him", "her", "his", "who", "which", "when",
	"where", "there", "here",
]);

// ---------------------------------------------------------------------------
// Topic Dedup — check if a topic has already been covered recently
// ---------------------------------------------------------------------------

/**
 * Extract 2-3 meaningful search terms from a topic title.
 * Strips stop words and short tokens, returns lowercase terms.
 */
function extractSearchTerms(title: string): string[] {
	const words = title
		.toLowerCase()
		.replace(/[^a-z0-9\s.-]/g, " ")
		.split(/\s+/)
		.filter((w) => w.length > 2 && !STOP_WORDS.has(w));

	// Return up to 3 most meaningful terms (first terms tend to be most specific)
	return words.slice(0, 3);
}

/**
 * Check whether a topic (by title + slug) has already been covered within
 * the configured dedup window. Queries both `contentIdea` and `automatedVideo`
 * documents in Sanity.
 *
 * Returns `true` if the topic should be skipped (already covered).
 */
async function isTopicAlreadyCovered(topic: string, topics: string[]): Promise<boolean> {
	const dedupWindowDays = await getConfigValue("content_config", "dedupWindowDays", 90);

	// Dedup disabled when window is 0
	if (dedupWindowDays <= 0) {
		return false;
	}

	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - dedupWindowDays);
	const cutoffISO = cutoff.toISOString();

	const searchTerms = extractSearchTerms(topic);
	if (searchTerms.length === 0) {
		return false;
	}

	// Build a GROQ match pattern — each term becomes a wildcard prefix match
	// GROQ `match` supports patterns like "react*" and works with ||
	const matchPatterns = searchTerms.map((t) => `${t}*`);

	// Query 1: Title-based match on contentIdea and automatedVideo
	// The `match` operator in GROQ does case-insensitive prefix matching
	const titleQuery = `{
		"ideas": *[_type == "contentIdea" && _createdAt > $cutoff && title match $patterns] { _id, title, topics },
		"videos": *[_type == "automatedVideo" && _createdAt > $cutoff && title match $patterns] { _id, title }
	}`;

	try {
		const titleResults = await writeClient.fetch(titleQuery, {
			cutoff: cutoffISO,
			patterns: matchPatterns,
		});

		const ideaMatches: Array<{ _id: string; title: string; topics?: string[] }> = titleResults.ideas ?? [];
		const videoMatches: Array<{ _id: string; title: string }> = titleResults.videos ?? [];

		// If any title match is found, topic is covered
		if (ideaMatches.length > 0 || videoMatches.length > 0) {
			console.log(
				`[CRON/ingest] Dedup: title match found for "${topic}" — ${ideaMatches.length} ideas, ${videoMatches.length} videos`,
			);
			return true;
		}

		// Query 2: Check topic tag overlap on contentIdea documents
		// We consider a topic covered if 2+ tags overlap
		if (topics.length > 0) {
			const topicLower = topics.map((t) => t.toLowerCase());
			const overlapQuery = `*[_type == "contentIdea" && _createdAt > $cutoff && count((topics[])[@ in $topicTags]) >= 2] { _id, title, topics }`;

			const overlapResults = await writeClient.fetch(overlapQuery, {
				cutoff: cutoffISO,
				topicTags: topicLower,
			});

			if (overlapResults.length > 0) {
				console.log(
					`[CRON/ingest] Dedup: topic overlap found for "${topic}" — ${overlapResults.length} matching ideas`,
				);
				return true;
			}
		}

		return false;
	} catch (err) {
		// If dedup query fails, don't block the pipeline — log and continue
		console.warn("[CRON/ingest] Dedup query failed, allowing topic:", err);
		return false;
	}
}

/**
 * Check if a slug already exists on an automatedVideo document.
 */
async function isSlugTaken(slug: string): Promise<boolean> {
	try {
		const results = await writeClient.fetch(
			`*[_type == "automatedVideo" && slug.current == $slug][0..0] { _id }`,
			{ slug },
		);
		return results.length > 0;
	} catch (err) {
		console.warn("[CRON/ingest] Slug check failed, allowing:", err);
		return false;
	}
}

// ---------------------------------------------------------------------------
// Gemini Script Generation
// ---------------------------------------------------------------------------

// SYSTEM_INSTRUCTION fallback — used when content_config singleton doesn't exist yet in Sanity.
// The live value is fetched from getConfigValue() inside the GET handler.
const SYSTEM_INSTRUCTION_FALLBACK = `You are a content strategist and scriptwriter for CodingCat.dev, a web development education channel run by Alex Patterson.

Your style is inspired by Cleo Abram's "Huge If True" — you make complex technical topics feel exciting, accessible, and important. Key principles:
- Start with a BOLD claim or surprising fact that makes people stop scrolling
- Use analogies and real-world comparisons to explain technical concepts
- Build tension: "Here's the problem... here's why it matters... here's the breakthrough"
- Keep energy HIGH — short sentences, active voice, conversational tone
- End with a clear takeaway that makes the viewer feel smarter
- Target audience: developers who want to stay current but don't have time to read everything

Script format: 2-4 minute explainer videos for horizontal YouTube, 60-90 seconds for Shorts. Think Cleo Abram energy with real educational depth.

CodingCat.dev covers: React, Next.js, TypeScript, Svelte, web APIs, CSS, Node.js, cloud services, AI/ML for developers, and web platform updates.`;

function buildPrompt(trends: TrendResult[], research?: ResearchPayload): string {
	const topicList = trends
		.map((t, i) => `${i + 1}. "${t.topic}" (score: ${t.score}) — ${t.whyTrending}\n   Sources: ${t.signals.map(s => s.url).join(", ")}`)
		.join("\n");

	// If we have research data, include it as enrichment
	let researchContext = "";
	if (research) {
		researchContext = `\n\n## Research Data (use this to create an informed, accurate script)\n\n`;
		researchContext += `### Briefing\n${research.briefing}\n\n`;

		if (research.talkingPoints.length > 0) {
			researchContext += `### Key Talking Points\n${research.talkingPoints.map((tp, i) => `${i + 1}. ${tp}`).join("\n")}\n\n`;
		}

		if (research.codeExamples.length > 0) {
			researchContext += `### Code Examples (use these in "code" scenes)\n`;
			for (const ex of research.codeExamples.slice(0, 5)) {
				researchContext += `\`\`\`${ex.language}\n${ex.snippet}\n\`\`\`\nContext: ${ex.context}\n\n`;
			}
		}

		if (research.comparisonData && research.comparisonData.length > 0) {
			researchContext += `### Comparison Data (use in "comparison" scenes)\n`;
			for (const comp of research.comparisonData) {
				researchContext += `${comp.leftLabel} vs ${comp.rightLabel}:\n`;
				for (const row of comp.rows) {
					researchContext += `  - ${row.left} | ${row.right}\n`;
				}
				researchContext += "\n";
			}
		}

		if (research.sceneHints.length > 0) {
			researchContext += `### Scene Type Suggestions\n`;
			for (const hint of research.sceneHints) {
				researchContext += `- ${hint.suggestedSceneType}: ${hint.reason}\n`;
			}
		}

		if (research.infographicUrls && research.infographicUrls.length > 0) {
			researchContext += `\n### Infographics Available (${research.infographicUrls.length})\nMultiple infographics have been generated for this topic. Use sceneType "narration" with bRollUrl pointing to an infographic for visual scenes.\n`;
		}
	}

	return `Here are today's trending web development topics:

${topicList}${researchContext}

Pick the MOST interesting and timely topic for an explainer video (2-4 minutes for horizontal YouTube). Then generate a complete video script as JSON.

## Scene Types

Each scene MUST have a "sceneType" that determines its visual treatment. Choose the best type for the content:

- **"code"** — Use when explaining code snippets, API usage, config files, or CLI commands. Provide the actual code in the "code" field.
- **"list"** — Use for enumerated content: "Top 5 features", "3 reasons why", key takeaways. Provide items in the "list" field.
- **"comparison"** — Use for A-vs-B content: "React vs Vue", "SQL vs NoSQL", pros/cons. Provide structured data in the "comparison" field.
- **"mockup"** — Use when showing a UI, website, app screen, or terminal output. Provide device type and content description in the "mockup" field.
- **"narration"** — Use for conceptual explanations, introductions, or transitions where B-roll footage is appropriate. This is the default/fallback.

**Guidelines:**
- A good video uses 2-3 different scene types for visual variety
- Code-heavy topics should have at least one "code" scene
- Always include "bRollKeywords" and "visualDescription" as fallbacks even for non-narration scenes
- For "code" scenes, provide REAL, working code snippets (not pseudocode)
- For "list" scenes, provide 3-6 concise items
- For "comparison" scenes, provide 2-4 rows

## Infographic Image Prompts

CRITICAL: This video will be a visual infographic explainer. There will be NO text, titles, or script words shown on screen — the narration audio carries all words. The visuals are entirely infographic images.

For EACH scene, generate an "imagePrompts" array with 2-5 image generation prompts. Each prompt should follow this exact template:

"Infographic 2D architecture diagram, black (#000000) background. Labeled diagram showing [SPECIFIC NAMED COMPONENTS FROM THIS SCENE]: [Component A] → [Component B] → [Component C] with data flow arrows. Each component is a labeled box filled with purple (#7c3aed). White arrows connecting components, white text labels on every element. NO abstract art, NO geometric shapes, NO glowing orbs."

Replace [SPECIFIC VISUAL FOR THIS SCENE] with a detailed description of what the infographic should show for that particular scene. Be specific — reference the actual technical concepts, comparisons, or workflows being discussed.

Guidelines for image prompts:
- Each scene needs Math.ceil(durationEstimate / 4) prompts (one image every ~4 seconds)
- A 15-second scene needs 4 prompts, a 20-second scene needs 5
- Each prompt should show a DIFFERENT aspect or angle of the scene's content
- For code scenes: show labeled architecture diagrams with named components, data flow arrows, and text annotations (NOT the code itself, NOT abstract art)
- For comparison scenes: show labeled side-by-side comparison diagrams with named components and feature annotations
- For list scenes: show each item as a labeled box/node in a diagram layout with connecting arrows
- Make prompts visually varied — don't repeat the same layout
- STRICT color palette: pure black background (#000000), vivid purple (#7c3aed) for highlighted elements, white for lines, arrows, and text annotations. Do NOT use blue, green, orange, red, or gradient backgrounds
- BANNED in imagePrompts: spheres, orbs, waves, particles, abstract shapes, geometric patterns, glowing effects without labels, artistic metaphors. Every visual element MUST have a text label identifying what it represents
- Each imagePrompt must reference SPECIFIC technologies, APIs, functions, or concepts mentioned in that scene's narration. Generic visuals are rejected
- FIRST SCENE imagePrompts should be a striking architectural overview diagram of the main topic — labeled components showing the system/concept at a high level. This is the thumbnail/hook frame

## JSON Schema

Return ONLY a JSON object matching this exact schema:

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
        "sceneType": "code | list | comparison | mockup | narration",
        "narration": "string - what the narrator says",
        "visualDescription": "string - what to show on screen (fallback for all types)",
        "bRollKeywords": ["keyword1", "keyword2"],
        "durationEstimate": 15,
        "imagePrompts": ["Infographic 2D architecture diagram, black (#000000) background. Labeled diagram showing [Component A] → [Component B] → [Component C] with data flow arrows. Each component is a labeled box filled with purple (#7c3aed). White arrows and white text labels. NO abstract art, NO glowing orbs."],
        "code": {
          "snippet": "string - actual code to display (only for sceneType: code)",
          "language": "typescript | javascript | jsx | tsx | css | html | json | bash",
          "highlightLines": [1, 3]
        },
        "list": {
          "items": ["Item 1", "Item 2", "Item 3"],
          "icon": "🚀"
        },
        "comparison": {
          "leftLabel": "Option A",
          "rightLabel": "Option B",
          "rows": [
            { "left": "Feature of A", "right": "Feature of B" }
          ]
        },
        "mockup": {
          "deviceType": "browser | phone | terminal",
          "screenContent": "Description of what appears on the device screen"
        }
      }
    ],
    "cta": "string - call to action (subscribe, check link, etc.)"
  },
  "qualityScore": 75
}

Requirements:
- The script should have 8-15 scenes totaling 2-4 minutes (120-240 seconds)
- The hook should be punchy and curiosity-driven
- Use at least 2 different scene types for visual variety
- Only include the type-specific field that matches the sceneType (e.g., only include "code" when sceneType is "code")
- For "code" scenes, provide real, syntactically correct code
- The qualityScore should be your honest self-assessment (0-100)
- Each scene MUST include an "imagePrompts" array with 2-5 image generation prompts. Every prompt MUST describe a LABELED ARCHITECTURAL DIAGRAM with named components, arrows, and text annotations
- Follow this structure for every imagePrompt: "Infographic 2D architecture diagram, black (#000000) background. Labeled diagram showing [specific named components from the narration]: [Component A] → [Component B] → [Component C]. Each component is a labeled box/node filled with purple (#7c3aed). White directional arrows showing data/control flow. White text labels on every element. NO abstract art, NO geometric shapes, NO glowing orbs, NO artistic metaphors."
- Do NOT include any text overlays, titles, or script words in the video — narration audio carries all words
- Calculate prompt count per scene: Math.ceil(durationEstimate / 4)
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
	selectedTrend: TrendResult,
	qualityThreshold: number,
	research?: ResearchPayload,
	researchInteractionId?: string,
) {
	const isFlagged = criticResult.score < qualityThreshold;
	// When research is in-flight, status is "researching" (check-research cron will transition to script_ready)
	const isResearching = !!researchInteractionId;
	// Route through research_complete so check-research generates infographics before enrichment
	const status = isFlagged ? "flagged" : isResearching ? "researching" : "research_complete";

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
		script: {
			...script.script,
			scenes: script.script.scenes.map((scene, i) => ({
				...scene,
				_key: `scene-${i + 1}`,
			})),
		},
		scriptQualityScore: criticResult.score,
		status,
		...(isFlagged && {
			flaggedReason: `Quality score ${criticResult.score}/100. Issues: ${criticResult.issues.join("; ") || "Low quality score"}`,
		}),
		trendScore: selectedTrend.score,
		trendSources: selectedTrend.signals.map(s => s.source).join(", "),
		researchInteractionId: researchInteractionId || undefined,
	});

	console.log(`[CRON/ingest] Created automatedVideo: ${automatedVideo._id}`);

	return {
		contentIdeaId: contentIdea._id,
		automatedVideoId: automatedVideo._id,
		status,
	};
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
	const cronSecret = process.env.CRON_SECRET;
	if (!cronSecret) {
		console.error("[CRON/ingest] CRON_SECRET not configured");
		return Response.json({ error: "Server misconfigured" }, { status: 503 });
	}
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${cronSecret}`) {
		console.error(
			"[CRON/ingest] Unauthorized request: invalid authorization header",
		);
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Fetch config values once per invocation (5-min in-memory cache)
		const SYSTEM_INSTRUCTION = await getConfigValue(
			"content_config",
			"systemInstruction",
			SYSTEM_INSTRUCTION_FALLBACK,
		);
		const enableDeepResearch = await getConfigValue(
			"pipeline_config",
			"enableDeepResearch",
			false,
		);
		const qualityThreshold = await getConfigValue(
			"pipeline_config",
			"qualityThreshold",
			50,
		);

		// Step 1: Discover trending topics (replaces fetchTrendingTopics)
		console.log("[CRON/ingest] Discovering trending topics...");
		let trends: TrendResult[];
		try {
			trends = await discoverTrends({ lookbackDays: 7, maxTopics: 10 });
			console.log(`[CRON/ingest] Found ${trends.length} trending topics`);
		} catch (err) {
			console.warn("[CRON/ingest] Trend discovery failed, using fallback topics:", err);
			trends = [];
		}

		// Fall back to hardcoded topics if discovery returns empty or failed
		if (trends.length === 0) {
			console.warn("[CRON/ingest] No trends discovered, using fallback topics");
			trends = FALLBACK_TRENDS;
		}

		// Step 1.5: Dedup — walk trends list, skip already-covered topics
		console.log("[CRON/ingest] Dedup: checking trends for already-covered topics...");
		let selectedTrend: TrendResult | undefined;
		let skippedCount = 0;

		for (const trend of trends) {
			// Extract keyword-style topics from the trend title for tag overlap check
			const topicKeywords = extractSearchTerms(trend.topic);

			const covered = await isTopicAlreadyCovered(trend.topic, topicKeywords);
			if (covered) {
				console.log(`[CRON/ingest] Dedup: skipping "${trend.topic}" (score: ${trend.score}) — already covered`);
				skippedCount++;
				continue;
			}

			// Also check for slug collision
			if (trend.slug) {
				const slugTaken = await isSlugTaken(trend.slug);
				if (slugTaken) {
					console.log(`[CRON/ingest] Dedup: skipping "${trend.topic}" — slug "${trend.slug}" already exists`);
					skippedCount++;
					continue;
				}
			}

			selectedTrend = trend;
			break;
		}

		if (!selectedTrend) {
			console.log(`[CRON/ingest] Dedup: all ${trends.length} trending topics already covered. Skipping ingestion.`);
			return Response.json({
				success: true,
				skipped: true,
				message: "All trending topics already covered",
				trendCount: trends.length,
				skippedCount,
			});
		}

		console.log(`[CRON/ingest] Dedup: selected "${selectedTrend.topic}" (score: ${selectedTrend.score}, skipped ${skippedCount} topics)`);

		// Step 2: Optional deep research on selected topic (fire-and-forget)
		// When research is enabled, we submit to Gemini Deep Research
		// but DON'T wait for it — the check-research cron will poll and enrich later
		let researchInteractionId: string | undefined;
		if (enableDeepResearch) {
			console.log(`[CRON/ingest] Starting Gemini Deep Research on: "${selectedTrend.topic}"...`);
			try {
				const sourceUrls = (selectedTrend.signals ?? [])
					.map((s: { url?: string }) => s.url)
					.filter((u): u is string => !!u && u.startsWith("http"))
					.slice(0, 5);

				researchInteractionId = await submitResearch(selectedTrend.topic, { sourceUrls });
				console.log(`[CRON/ingest] Deep Research submitted — interactionId: ${researchInteractionId}. check-research cron will poll.`);
			} catch (err) {
				console.warn("[CRON/ingest] Deep Research submission failed, continuing without:", err);
			}
		}

		// Step 3: Generate script with Gemini (basic — without research data)
		// When research is enabled, check-research will re-generate an enriched script later
		console.log("[CRON/ingest] Generating script with Gemini...");
		const prompt = buildPrompt([selectedTrend]);
		const rawResponse = await generateWithGemini(prompt, SYSTEM_INSTRUCTION);

		let script: GeneratedScript;
		try {
			// Strip markdown code fences if present (Gemini sometimes wraps JSON in ```json ... ```)
			const cleaned = stripCodeFences(rawResponse);
			script = JSON.parse(cleaned) as GeneratedScript;
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
		const result = await createSanityDocuments(script, criticResult, selectedTrend, qualityThreshold, undefined, researchInteractionId);

		console.log("[CRON/ingest] Done!", result);

		return Response.json({
			success: true,
			...result,
			title: script.title,
			criticScore: criticResult.score,
			trendCount: trends.length,
			trendScore: selectedTrend.score,
			skippedCount,
			researchStarted: !!researchInteractionId,
			researchInteractionId: researchInteractionId,
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
