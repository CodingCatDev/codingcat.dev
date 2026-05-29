/**
 * Gemini Deep Research Service
 *
 * Uses the Gemini Interactions API for autonomous web research.
 * Replaces the NotebookLM-based research pipeline.
 *
 * Pipeline:
 *   topic → Gemini Deep Research → markdown report → structured ResearchPayload
 *
 * @module lib/services/gemini-research
 */

import { GoogleGenAI, type Interactions } from "@google/genai";
import { getConfigValue } from "@/lib/config";
import { generateWithGemini, stripCodeFences } from "@/lib/gemini";

// Re-export types for backward compatibility
export type {
  ResearchPayload,
  ResearchSource,
  CodeExample,
  ComparisonData,
  SceneHint,
} from "./research";

import type {
  ResearchPayload,
  ResearchSource,
  CodeExample,
  SceneHint,
} from "./research";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeminiResearchConfig {
  /** Timeout for research polling in ms (default: 1200000 = 20 min) */
  researchTimeout?: number;
  /** Polling interval in ms (default: 15000 = 15s) */
  pollInterval?: number;
  /** Source URLs from trend discovery (included in research prompt) */
  sourceUrls?: string[];
}

export interface ResearchStatus {
  status: "in_progress" | "completed" | "failed" | "not_found";
  interactionId: string;
  report?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Lazy AI client init
// ---------------------------------------------------------------------------

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// ---------------------------------------------------------------------------
// Default prompt template
// ---------------------------------------------------------------------------

const DEFAULT_PROMPT_TEMPLATE = `Research comprehensively: "{topic}"

Focus areas:
- What is it and why does it matter for web developers?
- How does it work technically? Include architecture details.
- Key features, capabilities, and limitations
- Comparison with alternatives (include specific metrics where possible)
- Real-world use cases and code examples
- Latest developments and future roadmap

Target audience: Web developers who want to stay current with modern tools and frameworks.
Include code examples where relevant (TypeScript/JavaScript preferred).
Include specific version numbers, dates, and statistics where available.`;

// ---------------------------------------------------------------------------
// Submit Research
// ---------------------------------------------------------------------------

/**
 * Submit a research query to Gemini Deep Research.
 * Returns the interaction ID for polling.
 */
export async function submitResearch(
  topic: string,
  config?: GeminiResearchConfig,
): Promise<string> {
  const ai = getAI();
  const agent = await getConfigValue(
    "pipeline_config",
    "deepResearchAgent",
    "deep-research-pro-preview-12-2025",
  );
  const promptTemplate = await getConfigValue(
    "pipeline_config",
    "deepResearchPromptTemplate",
    DEFAULT_PROMPT_TEMPLATE,
  );

  // Build the research prompt
  let prompt = promptTemplate.replace(/\{topic\}/g, topic);

  // Add source URLs if provided (gives the researcher starting points)
  const sourceUrls = config?.sourceUrls ?? [];
  if (sourceUrls.length > 0) {
    prompt += `\n\nStarting reference URLs:\n${sourceUrls.map((u) => `- ${u}`).join("\n")}`;
  }

  console.log(`[gemini-research] Submitting research for: "${topic}"`);
  console.log(`[gemini-research] Agent: ${agent}`);

  // Submit via Interactions API (background: true for async deep research)
  const interaction = await ai.interactions.create({
    agent,
    input: prompt,
    background: true,
    stream: false,
  });

  const interactionId = interaction.id;
  if (!interactionId) {
    throw new Error("[gemini-research] No interaction ID returned");
  }

  console.log(`[gemini-research] Interaction created: ${interactionId}`);
  return interactionId;
}

// ---------------------------------------------------------------------------
// Poll Research
// ---------------------------------------------------------------------------

/**
 * Check the status of a research interaction.
 */
export async function pollResearch(
  interactionId: string,
): Promise<ResearchStatus> {
  const ai = getAI();

  try {
    const result = await ai.interactions.get(interactionId, { stream: false });

    if (result.status === "completed") {
      // Extract the report text from outputs
      const report = extractTextFromOutputs(result.outputs);

      return {
        status: "completed",
        interactionId,
        report: report || undefined,
      };
    }

    if (
      result.status === "failed" ||
      result.status === "cancelled" ||
      result.status === "incomplete"
    ) {
      return {
        status: "failed",
        interactionId,
        error: `Research ${result.status}`,
      };
    }

    // 'in_progress' or 'requires_action'
    return { status: "in_progress", interactionId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // 404 = interaction not found
    if (message.includes("404") || message.includes("not found")) {
      return { status: "not_found", interactionId, error: message };
    }

    throw error; // Re-throw unexpected errors
  }
}

// ---------------------------------------------------------------------------
// Extract text from Interaction outputs
// ---------------------------------------------------------------------------

/**
 * Extract text content from Interaction outputs array.
 * Outputs are Content_2 items (TextContent, ImageContent, etc.).
 * We only care about TextContent items.
 */
function extractTextFromOutputs(
  outputs: Interactions.Interaction["outputs"],
): string {
  if (!outputs || !Array.isArray(outputs)) return "";

  const textParts: string[] = [];
  for (const output of outputs) {
    // TextContent has type: 'text' and text: string
    if (
      output &&
      typeof output === "object" &&
      "type" in output &&
      output.type === "text" &&
      "text" in output
    ) {
      const textContent = output as Interactions.TextContent;
      if (textContent.text) {
        textParts.push(textContent.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

// ---------------------------------------------------------------------------
// Parse Report → ResearchPayload
// ---------------------------------------------------------------------------

/**
 * Parse a markdown research report into a structured ResearchPayload.
 * Uses Gemini Flash to extract structured data.
 */
export async function parseResearchReport(
  topic: string,
  report: string,
): Promise<ResearchPayload> {
  const createdAt = new Date().toISOString();

  // Use Gemini Flash to extract structured data from the report
  const extractionPrompt = `You are a content analyst. Extract structured data from this research report for a web development video script.

RESEARCH REPORT:
${report.slice(0, 30000)}

Extract and return ONLY valid JSON (no markdown fences):
{
  "briefing": "A 2-3 paragraph executive summary of the key findings",
  "sources": [{"title": "Source title", "url": "https://...", "type": "article|docs|youtube|unknown"}],
  "talkingPoints": ["Key point 1", "Key point 2", ...],
  "codeExamples": [{"snippet": "code here", "language": "typescript", "context": "What this code demonstrates"}],
  "comparisonData": [{"leftLabel": "Option A", "rightLabel": "Option B", "rows": [{"left": "feature", "right": "feature"}]}],
  "sceneHints": [{"content": "Brief description", "suggestedSceneType": "narration|code|list|comparison|mockup", "reason": "Why this scene type"}]
}

Rules:
- Extract 5-8 talking points
- Extract ALL code examples from the report (up to 10)
- If the report compares technologies, create comparisonData
- Generate 6-10 scene hints covering the full report
- Sources should include URLs from citations in the report
- Keep the briefing concise but informative`;

  try {
    const raw = await generateWithGemini(extractionPrompt);
    const cleaned = stripCodeFences(raw);
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    // Build the payload with safe defaults
    return {
      topic,
      notebookId: "", // No notebook — using Gemini Deep Research
      createdAt,
      completedAt: new Date().toISOString(),
      sources: Array.isArray(parsed.sources)
        ? (parsed.sources as ResearchSource[])
        : [],
      briefing:
        typeof parsed.briefing === "string"
          ? parsed.briefing
          : report.slice(0, 2000),
      talkingPoints: Array.isArray(parsed.talkingPoints)
        ? (parsed.talkingPoints as string[])
        : [],
      codeExamples: Array.isArray(parsed.codeExamples)
        ? (parsed.codeExamples as CodeExample[])
        : [],
      comparisonData: Array.isArray(parsed.comparisonData)
        ? parsed.comparisonData
        : undefined,
      sceneHints: Array.isArray(parsed.sceneHints)
        ? (parsed.sceneHints as SceneHint[])
        : [],
      infographicUrls: undefined, // Infographics handled separately
    };
  } catch (error) {
    console.error(
      "[gemini-research] Failed to parse report, using fallback extraction:",
      error,
    );

    // Fallback: regex-based extraction (same logic as research.ts helpers)
    return buildFallbackPayload(topic, report, createdAt);
  }
}

// ---------------------------------------------------------------------------
// Fallback extraction helpers (regex-based, from research.ts)
// ---------------------------------------------------------------------------

function classifySourceType(
  url: string,
): "youtube" | "article" | "docs" | "unknown" {
  if (!url) return "unknown";
  const lower = url.toLowerCase();
  if (
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("youtube")
  ) {
    return "youtube";
  }
  if (
    lower.includes("/docs") ||
    lower.includes("documentation") ||
    lower.includes("developer.") ||
    lower.includes("devdocs") ||
    lower.includes("mdn") ||
    lower.includes("spec.")
  ) {
    return "docs";
  }
  if (
    lower.includes("blog") ||
    lower.includes("medium.com") ||
    lower.includes("dev.to") ||
    lower.includes("hashnode") ||
    lower.includes("article")
  ) {
    return "article";
  }
  return "unknown";
}

function extractTalkingPoints(text: string): string[] {
  const lines = text.split("\n");
  const points: string[] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[\s]*[-•*\d]+[.)]\s*/, "").trim();
    if (cleaned.length > 20) {
      points.push(cleaned);
    }
  }

  return points.slice(0, 8);
}

function extractCodeExamples(text: string): CodeExample[] {
  const examples: CodeExample[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || "typescript";
    const snippet = match[2].trim();

    const beforeBlock = text.slice(0, match.index);
    const contextLines = beforeBlock.split("\n").filter((l) => l.trim());
    const context =
      contextLines.length > 0
        ? contextLines[contextLines.length - 1].trim()
        : "Code example";

    examples.push({ snippet, language, context });
  }

  return examples;
}

function classifyScene(
  content: string,
): "narration" | "code" | "list" | "comparison" | "mockup" {
  // Code blocks
  if (
    /```[\s\S]*?```/.test(content) ||
    /^\s{2,}(const|let|var|function|import|export|class|def|return)\b/m.test(
      content,
    )
  ) {
    return "code";
  }
  // Numbered or bulleted lists (3+ items)
  const listMatches = content.match(/^[\s]*[-•*\d]+[.)]\s/gm);
  if (listMatches && listMatches.length >= 3) {
    return "list";
  }
  // Comparison language
  if (
    /\bvs\.?\b/i.test(content) ||
    /\bcompare[ds]?\b/i.test(content) ||
    /\bdifference[s]?\b/i.test(content) ||
    /\bpros\s+(and|&)\s+cons\b/i.test(content)
  ) {
    return "comparison";
  }
  // UI / mockup language
  if (
    /\b(UI|interface|dashboard|screen|layout|component|widget|button|modal)\b/i.test(
      content,
    )
  ) {
    return "mockup";
  }
  return "narration";
}

function generateSceneHints(sections: string[]): SceneHint[] {
  const hints: SceneHint[] = [];

  for (const section of sections) {
    if (!section.trim()) continue;

    const sceneType = classifyScene(section);
    const reasonMap: Record<typeof sceneType, string> = {
      code: "Contains code blocks or programming constructs",
      list: "Contains a numbered or bulleted list with 3+ items",
      comparison: "Contains comparison language (vs, compare, differences)",
      mockup: "Describes UI elements or interface components",
      narration: "General explanatory content best suited for narration",
    };

    hints.push({
      content: section.slice(0, 500),
      suggestedSceneType: sceneType,
      reason: reasonMap[sceneType],
    });
  }

  return hints;
}

function extractSourcesFromReport(report: string): ResearchSource[] {
  const sources: ResearchSource[] = [];
  // Match markdown links: [title](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let match: RegExpExecArray | null;
  const seenUrls = new Set<string>();

  while ((match = linkRegex.exec(report)) !== null) {
    const url = match[2];
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    sources.push({
      title: match[1],
      url,
      type: classifySourceType(url),
    });
  }

  return sources;
}

function buildFallbackPayload(
  topic: string,
  report: string,
  createdAt: string,
): ResearchPayload {
  const talkingPoints = extractTalkingPoints(report);
  const codeExamples = extractCodeExamples(report);
  const sources = extractSourcesFromReport(report);

  // Generate scene hints from report sections
  const sections = report
    .split(/\n(?=#{1,3}\s)|\n\n/)
    .filter((s) => s.trim().length > 50);
  const sceneHints = generateSceneHints(sections);

  return {
    topic,
    notebookId: "", // No notebook — using Gemini Deep Research
    createdAt,
    completedAt: new Date().toISOString(),
    sources,
    briefing: report.slice(0, 2000),
    talkingPoints,
    codeExamples,
    sceneHints,
    infographicUrls: undefined,
  };
}

// ---------------------------------------------------------------------------
// Full pipeline: submit → poll → parse
// ---------------------------------------------------------------------------

/**
 * Run the full Gemini Deep Research pipeline for a topic.
 * This is the high-level function called by the ingest route.
 */
export async function conductGeminiResearch(
  topic: string,
  config?: GeminiResearchConfig,
): Promise<ResearchPayload> {
  const timeout = config?.researchTimeout ?? 1_200_000; // 20 min
  const pollInterval = config?.pollInterval ?? 15_000; // 15s

  // Submit
  const interactionId = await submitResearch(topic, config);

  // Poll until complete
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const status = await pollResearch(interactionId);

    if (status.status === "completed" && status.report) {
      console.log(
        `[gemini-research] Research completed (${Math.round((Date.now() - startTime) / 1000)}s)`,
      );
      return parseResearchReport(topic, status.report);
    }

    if (status.status === "failed") {
      throw new Error(`[gemini-research] Research failed: ${status.error}`);
    }

    if (status.status === "not_found") {
      throw new Error(
        `[gemini-research] Interaction not found: ${interactionId}`,
      );
    }

    await new Promise((r) => setTimeout(r, pollInterval));
  }

  throw new Error(`[gemini-research] Research timed out after ${timeout}ms`);
}
