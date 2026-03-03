import { GoogleGenerativeAI } from "@google/generative-ai";

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
	const model = genAI.getGenerativeModel({
		model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
		...(systemInstruction && { systemInstruction }),
	});
	const result = await model.generateContent(prompt);
	const response = result.response;
	return response.text();
}
