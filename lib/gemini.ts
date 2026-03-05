import { GoogleGenerativeAI } from "@google/generative-ai";
import { getConfigValue } from "@/lib/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
	const model = genAI.getGenerativeModel({
		model: geminiModel,
		...(systemInstruction && { systemInstruction }),
	});
	const result = await model.generateContent(prompt);
	const response = result.response;
	return response.text();
}

/**
 * Strip markdown code fences from a string.
 * Gemini often wraps JSON responses in ```json ... ``` blocks.
 */
export function stripCodeFences(text: string): string {
	return text.replace(/^```(?:\w+)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
}
