import { GoogleGenAI } from "@google/genai";
import { getConfigValue } from "@/lib/config";

let _ai: GoogleGenAI | null = null;

/** Lazy-initialize the GoogleGenAI client (avoids crash at import time if GEMINI_API_KEY is missing). */
function getAI(): GoogleGenAI {
	if (!_ai) {
		const apiKey = process.env.GEMINI_API_KEY || "";
		_ai = new GoogleGenAI({ apiKey });
	}
	return _ai;
}

/**
 * Generate text content using Gemini Flash.
 * Used across the content engine for script generation, metadata, and intent extraction.
 * @param prompt - User prompt
 * @param systemInstruction - Optional system instruction (persona/behavior)
 */
export async function generateWithGemini(
	prompt: string,
	systemInstruction?: string,
): Promise<string> {
	const geminiModel = await getConfigValue("pipeline_config", "geminiModel", "gemini-2.0-flash");
	const ai = getAI();
	const response = await ai.models.generateContent({
		model: geminiModel,
		contents: prompt,
		...(systemInstruction && { config: { systemInstruction } }),
	});
	return response.text ?? "";
}

/**
 * Strip markdown code fences from a string.
 * Gemini often wraps JSON responses in ```json ... ``` blocks.
 */
export function stripCodeFences(text: string): string {
	return text.replace(/^```(?:\w+)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
}
