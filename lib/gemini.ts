import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate text content using Gemini Flash.
 * Used across the content engine for script generation, metadata, and intent extraction.
 */
export async function generateWithGemini(prompt: string): Promise<string> {
	const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
	const result = await model.generateContent(prompt);
	const response = result.response;
	return response.text();
}
