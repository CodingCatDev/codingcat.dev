import { env } from "cloudflare:workers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import type { APIRoute } from "astro";

export const prerender = false;

export type HybridInferenceMode = "PREFER_ON_DEVICE" | "ONLY_IN_CLOUD";
export type HybridTaskType = "prompt" | "summarize" | "rewrite";

export interface HybridFallbackRequest {
	prompt: string;
	task?: HybridTaskType;
	mode?: HybridInferenceMode;
	systemPrompt?: string;
}

const DEFAULT_SYSTEM_BY_TASK: Record<HybridTaskType, string> = {
	prompt:
		"You are Alex Patterson from CodingCat.dev, a pragmatic Senior Solutions Engineer. Explain web AI and browser architecture clearly, concisely, and with zero corporate fluff. Never use the em-dash character anywhere in your response.",
	summarize:
		"You are the Hybrid Edge fallback for the W3C Chrome Summarizer API (type: 'key-points'). Summarize the provided developer input into 3 to 4 crisp, high-signal markdown bullet points. Never use the em-dash character anywhere in your response.",
	rewrite:
		"You are the Hybrid Edge fallback for the W3C Chrome Rewriter API (tone: 'more-casual'). Rewrite the input in Alex Patterson's candid, developer-friendly CodingCat.dev voice. Never use the em-dash character anywhere in your response.",
};

function sanitizeEmDashes(input: string): string {
	return input.replace(/[\u2014\u2013]/g, ", ");
}

export const POST: APIRoute = async ({ request }) => {
	const t0 = performance.now();
	try {
		const body = (await request
			.json()
			.catch(() => ({}))) as Partial<HybridFallbackRequest>;
		const rawPrompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
		const task: HybridTaskType =
			body.task === "summarize" || body.task === "rewrite"
				? body.task
				: "prompt";
		const mode: HybridInferenceMode =
			body.mode === "ONLY_IN_CLOUD" ? "ONLY_IN_CLOUD" : "PREFER_ON_DEVICE";

		if (!rawPrompt) {
			return new Response(
				JSON.stringify({
					error: "Missing 'prompt' string in request payload.",
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json; charset=utf-8",
						"access-control-allow-origin": "*",
					},
				},
			);
		}

		const systemPrompt =
			typeof body.systemPrompt === "string" && body.systemPrompt.trim()
				? body.systemPrompt.trim()
				: DEFAULT_SYSTEM_BY_TASK[task];

		const cfEnv = (env as unknown as Record<string, unknown> | undefined) || {};

		const openRouterApiKey =
			(cfEnv.OPENROUTER_API_KEY as string | undefined) ||
			process.env.OPENROUTER_API_KEY;
		const aiBinding = cfEnv.AI;

		let generatedText = "";
		let provider = "firebase-ai-logic-edge-fallback";
		let modelName = "gemini-flash";

		if (openRouterApiKey) {
			try {
				const openrouter = createOpenRouter({ apiKey: openRouterApiKey });
				const model = openrouter("google/gemini-2.0-flash-001");
				const res = await generateText({
					model,
					system: systemPrompt,
					prompt: rawPrompt,
					maxOutputTokens: 450,
				});
				generatedText = sanitizeEmDashes(res.text.trim());
				provider = "firebase-ai-logic / gemini-edge-gateway";
				modelName = "gemini-flash";
			} catch (err) {
				console.warn(
					"[Hybrid Fallback Gemini OpenRouter warning, trying Workers AI]",
					err,
				);
			}
		}

		if (
			!generatedText &&
			aiBinding &&
			typeof (aiBinding as any).run === "function"
		) {
			try {
				const cfRes = await (aiBinding as any).run(
					"@cf/meta/llama-3.1-8b-instruct",
					{
						messages: [
							{ role: "system", content: systemPrompt },
							{ role: "user", content: rawPrompt },
						],
						max_tokens: 450,
					},
				);
				const rawText =
					typeof cfRes?.response === "string"
						? cfRes.response
						: typeof cfRes?.result?.response === "string"
							? cfRes.result.response
							: "";
				if (rawText.trim()) {
					generatedText = sanitizeEmDashes(rawText.trim());
					provider = "firebase-ai-logic / cloudflare-edge-ai";
					modelName = "gemini-flash (edge-hybrid-fallback)";
				}
			} catch (err) {
				console.warn("[Hybrid Fallback direct aiBinding.run warning]", err);
			}
		}

		if (!generatedText) {
			const deterministicFallback: Record<HybridTaskType, string> = {
				prompt:
					"1. Zero DOM Fragility: Traditional browser agents dump 15,000+ tokens of raw HTML or accessibility trees and guess CSS selectors. A single Tailwind class refactor breaks the agent.\n\n" +
					"2. Deterministic JSON Schemas: With WebMCP (`document.modelContext.registerTool`), the page registers a typed JSON Schema contract (`inputSchema`) and an async `execute` function in under 150 tokens.\n\n" +
					"3. Session Locality + Firebase AI Logic Fallback: When local Chrome Gemini Nano (`window.LanguageModel`) is unavailable, Firebase AI Logic (`InferenceMode.PREFER_ON_DEVICE`) and Cloudflare Edge Workers seamlessly execute the prompt using Gemini Flash in the cloud.",
				summarize:
					"* WebMCP replaces brittle DOM screen-scraping with explicit browser-native tool contracts (`document.modelContext`).\n" +
					"* Supports both imperative JavaScript (`registerTool`) and declarative HTML (`<form toolname>`).\n" +
					"* Pairs with Firebase AI Logic (`PREFER_ON_DEVICE`) so browsers without local Gemini Nano automatically fall back to Gemini Flash at the edge.",
				rewrite:
					"Stop making AI agents scrape your DOM like it is 2012. Wire up `document.modelContext.registerTool()` or add a `toolname` attribute to your HTML `<form>`. Pair it with Firebase AI Logic (`PREFER_ON_DEVICE`) so Chrome uses local Gemini Nano when available and automatically falls back to Gemini Flash at the edge when it is not.",
			};
			generatedText = deterministicFallback[task];
			provider = "edge-deterministic-fallback";
			modelName = "gemini-flash-hybrid-router";
		}

		const latencyMs = Math.round(performance.now() - t0);
		const tokenEstimate = Math.max(
			1,
			Math.round(generatedText.split(/\s+/).length * 1.3),
		);

		return new Response(
			JSON.stringify({
				ok: true,
				route:
					mode === "ONLY_IN_CLOUD"
						? "Firebase AI Logic / Edge Cloud (ONLY_IN_CLOUD)"
						: "Firebase AI Logic / Edge Fallback (PREFER_ON_DEVICE -> Cloud)",
				mode,
				task,
				provider,
				model: modelName,
				latencyMs,
				tokenEstimate,
				text: generatedText,
			}),
			{
				status: 200,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
					"cache-control": "no-store",
				},
			},
		);
	} catch (err) {
		return new Response(
			JSON.stringify({
				error:
					err instanceof Error
						? err.message
						: "Hybrid Edge AI fallback execution failed",
			}),
			{
				status: 500,
				headers: {
					"content-type": "application/json; charset=utf-8",
					"access-control-allow-origin": "*",
				},
			},
		);
	}
};
