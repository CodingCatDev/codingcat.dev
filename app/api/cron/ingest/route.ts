export const fetchCache = "force-no-store";

import type { NextRequest } from "next/server";

import { generateWithGemini, stripCodeFences } from "@/lib/gemini";
import { writeClient } from "@/lib/sanity-write-client";
import { discoverTrends, type TrendResult } from "@/lib/services/trend-discovery";
import { conductResearch, type ResearchPayload } from "@/lib/services/research";

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
		whyTrending: "WASM adoption growing in [REDACTED SECRET: NEXT_PUBLIC_SANITY_DATASET] apps",
		suggestedAngle: "Real-world use cases where WASM outperforms JS",
	},
];

// ---------------------------------------------------------------------------
// Gemini Script Generation
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTION =
	"You are a content strategist for CodingCat.dev, a web development education channel. You create engaging, Cleo Abram-style explainer video scripts that are educational, energetic, and concise (60-90 seconds).";

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

Pick the MOST interesting and timely topic for a short explainer video (60-90 seconds). Then generate a complete video script as JSON.

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
- The script should have 3-5 scenes totaling 60-90 seconds
- The hook should be punchy and curiosity-driven
- Use at least 2 different scene types for visual variety
- Only include the type-specific field that matches the sceneType (e.g., only include "code" when sceneType is "code")
- For "code" scenes, provide real, syntactically correct code
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
	trends: TrendResult[],
	research?: ResearchPayload,
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
		script: {
			...script.script,
			scenes: script.script.scenes.map((scene, i) => ({
				...scene,
				_key: `scene-${i + 1}`,
			})),
		},
		scriptQualityScore: criticResult.score,
		status: isFlagged ? "flagged" : "script_ready",
		...(isFlagged && {
			flaggedReason: `Quality score ${criticResult.score}/100. Issues: ${criticResult.issues.join("; ") || "Low quality score"}`,
		}),
		trendScore: trends[0]?.score,
		trendSources: trends[0]?.signals.map(s => s.source).join(", "),
		researchNotebookId: research?.notebookId,
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

		// Step 2: Optional deep research on top topic
		let research: ResearchPayload | undefined;
		if (process.env.ENABLE_NOTEBOOKLM_RESEARCH === "true") {
			console.log(`[CRON/ingest] Conducting research on: "${trends[0].topic}"...`);
			try {
				// Extract source URLs from trend signals to seed the notebook
				const sourceUrls = (trends[0].signals ?? [])
					.map((s: { url?: string }) => s.url)
					.filter((u): u is string => !!u && u.startsWith("http"))
					.slice(0, 5);
				research = await conductResearch(trends[0].topic, { sourceUrls });
				console.log(`[CRON/ingest] Research complete: ${research.sources.length} sources, ${research.sceneHints.length} scene hints`);
			} catch (err) {
				console.warn("[CRON/ingest] Research failed, continuing without:", err);
			}
		}

		// Step 3: Generate script with Gemini (enriched with research)
		console.log("[CRON/ingest] Generating script with Gemini...");
		const prompt = buildPrompt(trends, research);
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
		const result = await createSanityDocuments(script, criticResult, trends, research);

		console.log("[CRON/ingest] Done!", result);

		return Response.json({
			success: true,
			...result,
			title: script.title,
			criticScore: criticResult.score,
			trendCount: trends.length,
			trendScore: trends[0]?.score,
			researchEnabled: !!research,
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
