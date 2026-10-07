import { generateWithGemini } from "@/lib/gemini";

export interface VideoMetadataInput { title: string; description: string; script: string; tags: string[]; }
export interface VideoMetadataOutput { title: string; description: string; tags: string[]; }

export async function generateVideoMetadata(input: VideoMetadataInput): Promise<VideoMetadataOutput> {
  const prompt = `YouTube SEO expert for CodingCat.dev.\n\nTitle: ${input.title}\nDescription: ${input.description}\nScript: ${input.script.slice(0, 2000)}\nTags: ${input.tags.join(", ")}\n\nReturn JSON: {"title": "max 100 chars", "description": "500-1000 chars", "tags": ["10-15 tags"]}`;
  const raw = await generateWithGemini(prompt);
  try {
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim()) as VideoMetadataOutput;
    return { title: parsed.title?.slice(0, 100) || input.title, description: parsed.description || input.title, tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 15) : [] };
  } catch {
    return { title: input.title, description: input.description || input.title, tags: input.tags };
  }
}
