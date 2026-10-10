#!/usr/bin/env node
/**
 * CodingCat.dev — AEO & High-Authority Community Distribution Pack Generator
 *
 * Uses Gemini 2.5 Pro (`gemini-2.5-pro`) to transform a Sanity `post` or `podcast`
 * (including its Portable Text content and YouTube transcript) into ready-to-publish:
 *   1. Reddit (`r/webdev` / `r/javascript`) native zero-fluff engineering post
 *   2. Hacker News (`Show HN` / technical submission) title + first comment
 *   3. X / Bluesky / LinkedIn 5-part technical thread
 *   4. 3 Cleo Abram ("Huge If True") × Better Stack 9:16 YouTube Shorts scripts (45s)
 *
 * Usage:
 *   pnpm aeo:pack --id 05eda048-efff-4e0f-8b76-83a2f482fa13
 *   pnpm aeo:pack --slug dockerless-serverless-gpus-how-i-built-a-fast-cheap-ai-saas-with-runpod-flash
 */

import { writeFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { portableTextToMarkdown } from "@portabletext/markdown";

const args = process.argv.slice(2);
const getArg = (flag, fallback = "") => {
	const idx = args.indexOf(flag);
	return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const docId = getArg("--id");
const slug = getArg("--slug");
const outPath = getArg("--out");
const modelName = getArg("--model", "gemini-2.5-pro");

const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const openRouterKey = process.env.OPENROUTER_API_KEY;

if (!geminiKey && !openRouterKey) {
	console.error(
		"Error: Set GEMINI_API_KEY (Google AI Studio) or OPENROUTER_API_KEY in your environment.",
	);
	process.exit(1);
}

const sanityClient = createClient({
	projectId: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
	dataset: process.env.SANITY_STUDIO_DATASET || "production",
	apiVersion: "2025-09-30",
	useCdn: true,
});

const SYSTEM_PROMPT = `You are the Principal Developer Advocate & Content Architect for CodingCat.dev (hosted by Alex Patterson, Google Developer Expert).

Your task is to generate a high-signal AEO (Answer Engine Optimization) & Community Distribution Pack from a technical post or podcast.

Follow these strict rules:
1. **Reddit Native Post (r/webdev, r/javascript, r/LocalLLaMA)**:
   - Write a 95% self-contained technical post with zero marketing fluff.
   - Include a 3-bullet "TL;DR Architecture & Numbers" section at the top, followed by "What We Tested / Built", "Where It Broke / Trade-offs", and a subtle canonical link at the very end.
2. **Hacker News Submission**:
   - Provide 3 factual, non-clickbait title options (under 80 chars) + the exact "First Comment" explaining the engineering motivation, architecture, and trade-offs.
3. **LinkedIn / X / Bluesky 5-Post Thread**:
   - Post 1: Bold architectural claim or benchmark hook.
   - Posts 2-4: Concrete technical mechanism, code/config insight, and cost/latency numbers.
   - Post 5: Takeaway + link.
4. **3 Vertical 9:16 YouTube Shorts Scripts (Cleo Abram "Huge If True" × Better Stack Style)**:
   - Each Short must be 35-45 seconds (~100-120 words) with:
     - **0-3s Hook**: Contrarian claim or visceral developer pain point.
     - **Kinetic Caption Highlights**: Words/metrics to highlight in #7c3aed (purple) or #f59e0b (amber).
     - **Gemini 3.1 Flash Image Infographic Prompt**: Dark-mode (#09090f) 2D architecture diagram prompt.
     - **Looping Payoff CTA**: Seamless loop back to the opening hook.`;

async function fetchTargetDocument() {
	if (docId) {
		return sanityClient.fetch(
			`*[_id == $docId][0]{ _id, _type, title, "slug": slug.current, excerpt, youtube, content, "transcriptText": transcript->fullText }`,
			{ docId },
		);
	}
	if (slug) {
		return sanityClient.fetch(
			`*[_type in ["post", "podcast"] && slug.current == $slug][0]{ _id, _type, title, "slug": slug.current, excerpt, youtube, content, "transcriptText": transcript->fullText }`,
			{ slug },
		);
	}
	return sanityClient.fetch(
		`*[_type == "post" && !(_id in path("drafts.**"))]|order(date desc)[0]{ _id, _type, title, "slug": slug.current, excerpt, youtube, content, "transcriptText": transcript->fullText }`,
	);
}

async function generatePack(prompt) {
	if (geminiKey) {
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
				contents: [{ role: "user", parts: [{ text: prompt }] }],
				generationConfig: { temperature: 0.65 },
			}),
		});
		if (!res.ok) {
			throw new Error(`Gemini API error (${res.status}): ${await res.text()}`);
		}
		const data = await res.json();
		return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
	}

	const openRouterModel = modelName.startsWith("google/")
		? modelName
		: `google/${modelName}`;
	const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${openRouterKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: openRouterModel,
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: prompt },
			],
			temperature: 0.65,
			max_tokens: 2800,
		}),
	});
	if (!res.ok) {
		throw new Error(
			`OpenRouter API error (${res.status}): ${await res.text()}`,
		);
	}
	const data = await res.json();
	return data.choices?.[0]?.message?.content || "";
}

async function main() {
	const doc = await fetchTargetDocument();
	if (!doc?._id) {
		console.error("Error: Could not find target document in Sanity.");
		process.exit(1);
	}

	const canonicalUrl = `https://codingcat.dev/${doc._type}/${doc.slug}`;
	let bodyMarkdown = "";
	try {
		if (Array.isArray(doc.content) && doc.content.length > 0) {
			bodyMarkdown = portableTextToMarkdown(doc.content);
		}
	} catch {
		bodyMarkdown = "";
	}

	const userPrompt = [
		`Title: ${doc.title}`,
		`Canonical URL: ${canonicalUrl}`,
		doc.youtube ? `YouTube URL: ${doc.youtube}` : "",
		doc.excerpt ? `Excerpt: ${doc.excerpt}` : "",
		bodyMarkdown ? `\nArticle Content:\n${bodyMarkdown.slice(0, 12000)}` : "",
		doc.transcriptText
			? `\nVideo Transcript Excerpt:\n${doc.transcriptText.slice(0, 8000)}`
			: "",
	]
		.filter(Boolean)
		.join("\n");

	console.log(
		`Generating AEO Distribution Pack for "${doc.title}" (${doc._id}) using ${modelName}...`,
	);
	const markdown = await generatePack(userPrompt);

	if (outPath) {
		writeFileSync(outPath, markdown, "utf8");
		console.log(`Saved AEO Distribution Pack to ${outPath}`);
	} else {
		console.log("\n" + markdown);
	}
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
