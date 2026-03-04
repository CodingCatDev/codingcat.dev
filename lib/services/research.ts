/**
 * NotebookLM Research Service
 *
 * Wraps the `notebooklm` Python CLI (v0.3.3) to conduct deep research on a
 * topic and produce a structured payload for Gemini script generation.
 *
 * Pipeline:
 *   topic → NotebookLM deep research → artifacts + Q&A → ResearchPayload
 *
 * TEMPORARY APPROACH: This shells out to the CLI and parses JSON output.
 * Eventually we'll replace CLI calls with direct HTTP/gRPC to the NotebookLM
 * API once a stable TypeScript SDK or REST endpoint is available.
 *
 * @module lib/services/research
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Research payload that feeds into Gemini script generation */
export interface ResearchPayload {
  topic: string;
  notebookId: string;
  createdAt: string;
  completedAt: string;
  sources: ResearchSource[];
  briefing: string;
  talkingPoints: string[];
  codeExamples: CodeExample[];
  comparisonData?: ComparisonData[];
  mindMap?: string;
  dataTable?: string;
  prosCons?: Record<string, string[]>;
  commonMistakes?: string[];
  sceneHints: SceneHint[];
  infographicPath?: string; // local path to downloaded PNG
}

export interface ResearchSource {
  title: string;
  url: string;
  type: "youtube" | "article" | "docs" | "unknown";
}

export interface CodeExample {
  snippet: string;
  language: string;
  context: string;
}

export interface ComparisonData {
  leftLabel: string;
  rightLabel: string;
  rows: { left: string; right: string }[];
}

export interface SceneHint {
  content: string;
  suggestedSceneType: "narration" | "code" | "list" | "comparison" | "mockup";
  reason: string;
}

export interface ResearchConfig {
  /** Path to notebooklm CLI binary (default: "notebooklm") */
  cliBinary?: string;
  /** Path to storage_state.json for auth */
  storagePath?: string;
  /** Working directory for output files */
  outputDir?: string;
  /** Timeout for individual CLI commands in ms (default: 120000) */
  commandTimeout?: number;
  /** Timeout for research/artifact generation in ms (default: 300000) */
  generationTimeout?: number;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function resolveConfig(overrides?: ResearchConfig): Required<ResearchConfig> {
  return {
    cliBinary:
      overrides?.cliBinary ||
      process.env.NOTEBOOKLM_CLI_PATH ||
      "notebooklm",
    storagePath:
      overrides?.storagePath || process.env.NOTEBOOKLM_STORAGE_PATH || "",
    outputDir:
      overrides?.outputDir ||
      process.env.NOTEBOOKLM_OUTPUT_DIR ||
      "/tmp/notebooklm-research",
    commandTimeout: overrides?.commandTimeout ?? 120_000,
    generationTimeout: overrides?.generationTimeout ?? 300_000,
  };
}

// ---------------------------------------------------------------------------
// CLI Wrapper
// ---------------------------------------------------------------------------

/**
 * Execute a `notebooklm` CLI command and return stdout.
 *
 * Automatically appends `--json` when the command supports it, and routes
 * notebook-scoped commands via the `-n <id>` flag.
 */
async function runNotebookLM(
  cfg: Required<ResearchConfig>,
  args: string[],
  options?: {
    timeout?: number;
    notebook?: string;
    /** Some commands (e.g. `download`) don't support --json */
    skipJson?: boolean;
  }
): Promise<string> {
  const cmd = cfg.cliBinary;
  const fullArgs = [...args];

  // Scope to a specific notebook
  if (options?.notebook) {
    fullArgs.unshift("-n", options.notebook);
  }

  // Add --json flag if not already present and not explicitly skipped
  if (!options?.skipJson && !fullArgs.includes("--json")) {
    fullArgs.push("--json");
  }

  const timeout = options?.timeout ?? cfg.commandTimeout;

  try {
    const { stdout, stderr } = await execFileAsync(cmd, fullArgs, {
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10 MB — artifacts can be large
      env: {
        ...process.env,
        ...(cfg.storagePath
          ? { NOTEBOOKLM_STORAGE: cfg.storagePath }
          : undefined),
      },
    });

    if (stderr) {
      console.warn(`[research] CLI stderr: ${stderr.slice(0, 500)}`);
    }

    return stdout;
  } catch (error: unknown) {
    // Provide a clear message if the CLI is not installed
    if (isExecError(error) && error.code === "ENOENT") {
      throw new Error(
        `[research] notebooklm CLI not found at "${cmd}". ` +
          `Install it with: pip install notebooklm  (or set NOTEBOOKLM_CLI_PATH ` +
          `to the full path of the binary)`
      );
    }
    throw error;
  }
}

/** Parse JSON from CLI stdout, with a fallback for non-JSON output. */
function parseJsonOutput<T = unknown>(stdout: string): T {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return {} as T;
  }
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Some commands return text with JSON embedded — try to extract it
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    // Return raw text wrapped in an object
    return { raw: trimmed } as T;
  }
}

// ---------------------------------------------------------------------------
// Type guard helpers
// ---------------------------------------------------------------------------

interface ExecError extends Error {
  code?: string;
  killed?: boolean;
  signal?: string;
}

function isExecError(err: unknown): err is ExecError {
  return err instanceof Error && "code" in err;
}

// ---------------------------------------------------------------------------
// Source type classification
// ---------------------------------------------------------------------------

function classifySourceType(
  url: string
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

// ---------------------------------------------------------------------------
// Scene hint generation
// ---------------------------------------------------------------------------

/**
 * Analyze a piece of content and suggest what type of video scene it maps to.
 */
function classifyScene(
  content: string
): "narration" | "code" | "list" | "comparison" | "mockup" {
  // Code blocks
  if (/```[\s\S]*?```/.test(content) || /^\s{2,}(const|let|var|function|import|export|class|def|return)\b/m.test(content)) {
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
      content
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
      content: section.slice(0, 500), // Truncate for payload size
      suggestedSceneType: sceneType,
      reason: reasonMap[sceneType],
    });
  }

  return hints;
}

// ---------------------------------------------------------------------------
// Content extraction helpers
// ---------------------------------------------------------------------------

/**
 * Parse talking points from a free-text Q&A response.
 * Expects numbered or bulleted items.
 */
function extractTalkingPoints(text: string): string[] {
  const lines = text.split("\n");
  const points: string[] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[\s]*[-•*\d]+[.)]\s*/, "").trim();
    if (cleaned.length > 20) {
      points.push(cleaned);
    }
  }

  return points.slice(0, 8); // Cap at 8 points
}

/**
 * Parse code examples from a free-text Q&A response.
 * Looks for fenced code blocks with optional language tags.
 */
function extractCodeExamples(text: string): CodeExample[] {
  const examples: CodeExample[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || "typescript";
    const snippet = match[2].trim();

    // Try to find context: the text immediately before the code block
    const beforeBlock = text.slice(0, match.index);
    const contextLines = beforeBlock.split("\n").filter((l) => l.trim());
    const context = contextLines.length > 0
      ? contextLines[contextLines.length - 1].trim()
      : "Code example";

    examples.push({ snippet, language, context });
  }

  return examples;
}

/**
 * Parse pros and cons from a free-text Q&A response.
 * Returns a record like { "Pros": [...], "Cons": [...] }.
 */
function extractProsCons(text: string): Record<string, string[]> {
  const result: Record<string, string[]> = { Pros: [], Cons: [] };
  let currentSection: "Pros" | "Cons" | null = null;

  for (const line of text.split("\n")) {
    const lower = line.toLowerCase().trim();
    if (lower.startsWith("pro") || lower.includes("advantages") || lower.includes("benefits")) {
      currentSection = "Pros";
      continue;
    }
    if (lower.startsWith("con") || lower.includes("disadvantages") || lower.includes("drawbacks")) {
      currentSection = "Cons";
      continue;
    }
    if (currentSection) {
      const cleaned = line.replace(/^[\s]*[-•*\d]+[.)]\s*/, "").trim();
      if (cleaned.length > 10) {
        result[currentSection].push(cleaned);
      }
    }
  }

  return result;
}

/**
 * Parse common mistakes from a free-text Q&A response.
 */
function extractMistakes(text: string): string[] {
  const lines = text.split("\n");
  const mistakes: string[] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[\s]*[-•*\d]+[.)]\s*/, "").trim();
    if (cleaned.length > 15) {
      mistakes.push(cleaned);
    }
  }

  return mistakes.slice(0, 10);
}

/**
 * Parse comparison data from a free-text Q&A response.
 * Attempts to find table-like or "X vs Y" structures.
 */
function extractComparisonData(text: string): ComparisonData[] {
  const comparisons: ComparisonData[] = [];

  // Look for "X vs Y" pattern in the text
  const vsMatch = text.match(/(\w[\w\s.]*?)\s+vs\.?\s+(\w[\w\s.]*?)[\n:]/i);
  if (vsMatch) {
    const leftLabel = vsMatch[1].trim();
    const rightLabel = vsMatch[2].trim();
    const rows: { left: string; right: string }[] = [];

    // Try to extract comparison rows from the remaining text
    const lines = text.split("\n");
    for (const line of lines) {
      // Look for lines with separators like "|", "→", or "vs"
      const pipeMatch = line.match(/^\s*\|?\s*(.+?)\s*\|\s*(.+?)\s*\|?\s*$/);
      if (pipeMatch && pipeMatch[1].trim() && pipeMatch[2].trim()) {
        const left = pipeMatch[1].trim();
        const right = pipeMatch[2].trim();
        // Skip header separators
        if (!left.match(/^[-=]+$/) && !right.match(/^[-=]+$/)) {
          rows.push({ left, right });
        }
      }
    }

    if (rows.length > 0) {
      comparisons.push({ leftLabel, rightLabel, rows });
    }
  }

  return comparisons;
}

// ---------------------------------------------------------------------------
// Targeted questions
// ---------------------------------------------------------------------------

function getTargetedQuestions(topic: string): {
  key: string;
  question: string;
}[] {
  return [
    {
      key: "talkingPoints",
      question: `What are the 5-6 most important talking points about ${topic} for a web developer audience?`,
    },
    {
      key: "codeExamples",
      question: `Show me the most important code examples for ${topic} with explanations`,
    },
    {
      key: "prosCons",
      question: `What are the pros and cons of ${topic}?`,
    },
    {
      key: "mistakes",
      question: `What are common mistakes or misconceptions about ${topic}?`,
    },
    {
      key: "comparison",
      question: `How does ${topic} compare to alternatives?`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Safe wrapper for optional pipeline steps
// ---------------------------------------------------------------------------

/**
 * Run an async operation, returning `undefined` on failure instead of
 * throwing. Logs the error so the pipeline can continue.
 */
async function safeStep<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.error(
      `[research] Step "${label}" failed, continuing pipeline:`,
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

/**
 * Run the full NotebookLM research pipeline for a topic.
 *
 * Creates a notebook, runs deep web research, generates artifacts, asks
 * targeted questions, and returns a structured {@link ResearchPayload}.
 *
 * @param topic - The topic to research (e.g. "React Server Components")
 * @param configOverrides - Optional configuration overrides
 * @returns Structured research payload for downstream script generation
 *
 * @example
 * ```ts
 * import { conductResearch } from "@/lib/services/research";
 *
 * const research = await conductResearch("React Server Components");
 * console.log(research.talkingPoints);
 * ```
 */
export async function conductResearch(
  topic: string,
  configOverrides?: ResearchConfig
): Promise<ResearchPayload> {
  const cfg = resolveConfig(configOverrides);
  const createdAt = new Date().toISOString();

  console.log(`[research] Starting research pipeline for: "${topic}"`);

  // Ensure output directory exists
  await mkdir(cfg.outputDir, { recursive: true });

  // -----------------------------------------------------------------------
  // Step 1: Create a notebook
  // -----------------------------------------------------------------------
  console.log("[research] Step 1/8: Creating notebook...");
  const createOutput = await runNotebookLM(cfg, ["create", topic]);
  const createResult = parseJsonOutput<{ id?: string; notebook_id?: string }>(
    createOutput
  );
  const notebookId = createResult.id || createResult.notebook_id || "";

  if (!notebookId) {
    throw new Error(
      `[research] Failed to create notebook — no ID returned. Output: ${createOutput.slice(0, 200)}`
    );
  }

  console.log(`[research] Notebook created: ${notebookId}`);

  // -----------------------------------------------------------------------
  // Step 2: Run deep web research
  // -----------------------------------------------------------------------
  console.log("[research] Step 2/8: Running deep web research...");
  await runNotebookLM(
    cfg,
    [
      "source",
      "add-research",
      topic,
      "--mode",
      "deep",
      "--import-all",
      "--no-wait",
    ],
    {
      notebook: notebookId,
      timeout: cfg.commandTimeout,
      skipJson: true,
    }
  );

  // -----------------------------------------------------------------------
  // Step 3: Wait for research to complete
  // -----------------------------------------------------------------------
  console.log("[research] Step 3/8: Waiting for research to complete...");
  await runNotebookLM(cfg, ["research", "wait"], {
    notebook: notebookId,
    timeout: cfg.generationTimeout,
    skipJson: true,
  });

  console.log("[research] Research complete.");

  // -----------------------------------------------------------------------
  // Step 4: Generate artifacts in parallel
  // -----------------------------------------------------------------------
  console.log("[research] Step 4/8: Generating artifacts...");

  const [mindMapResult, briefingResult, dataTableResult, infographicResult] =
    await Promise.all([
      safeStep("mind-map", () =>
        runNotebookLM(cfg, ["generate", "mind-map", "--wait"], {
          notebook: notebookId,
          timeout: cfg.generationTimeout,
        })
      ),
      safeStep("briefing-doc", () =>
        runNotebookLM(
          cfg,
          ["generate", "report", "--type", "briefing-doc", "--wait"],
          {
            notebook: notebookId,
            timeout: cfg.generationTimeout,
          }
        )
      ),
      safeStep("data-table", () =>
        runNotebookLM(cfg, ["generate", "data-table", "--wait"], {
          notebook: notebookId,
          timeout: cfg.generationTimeout,
        })
      ),
      safeStep("infographic", () =>
        runNotebookLM(
          cfg,
          [
            "generate",
            "infographic",
            "--orientation",
            "landscape",
            "--detail",
            "detailed",
            "--wait",
          ],
          {
            notebook: notebookId,
            timeout: cfg.generationTimeout,
          }
        )
      ),
    ]);

  // Parse artifact results
  const mindMap = mindMapResult
    ? (parseJsonOutput<{ content?: string }>(mindMapResult).content ??
        mindMapResult.trim())
    : undefined;

  const briefingParsed = briefingResult
    ? parseJsonOutput<{ content?: string }>(briefingResult)
    : undefined;
  const briefing = briefingParsed?.content ?? briefingResult?.trim() ?? "";

  const dataTable = dataTableResult
    ? (parseJsonOutput<{ content?: string }>(dataTableResult).content ??
        dataTableResult.trim())
    : undefined;

  console.log("[research] Artifacts generated.");

  // -----------------------------------------------------------------------
  // Step 5: Ask targeted questions
  // -----------------------------------------------------------------------
  console.log("[research] Step 5/8: Asking targeted questions...");

  const questions = getTargetedQuestions(topic);
  const answers: Record<string, string> = {};

  // Run questions sequentially to avoid rate limiting
  for (const { key, question } of questions) {
    const result = await safeStep(`ask:${key}`, () =>
      runNotebookLM(cfg, ["ask", question], {
        notebook: notebookId,
        timeout: cfg.commandTimeout,
      })
    );

    if (result) {
      const parsed = parseJsonOutput<{
        answer?: string;
        response?: string;
        text?: string;
      }>(result);
      answers[key] =
        parsed.answer || parsed.response || parsed.text || result.trim();
    }
  }

  // Extract structured data from answers
  const talkingPoints = answers.talkingPoints
    ? extractTalkingPoints(answers.talkingPoints)
    : [];
  const codeExamples = answers.codeExamples
    ? extractCodeExamples(answers.codeExamples)
    : [];
  const prosCons = answers.prosCons
    ? extractProsCons(answers.prosCons)
    : undefined;
  const commonMistakes = answers.mistakes
    ? extractMistakes(answers.mistakes)
    : undefined;
  const comparisonData = answers.comparison
    ? extractComparisonData(answers.comparison)
    : undefined;

  console.log(
    `[research] Q&A complete: ${talkingPoints.length} talking points, ${codeExamples.length} code examples`
  );

  // -----------------------------------------------------------------------
  // Step 6: Download infographic PNG
  // -----------------------------------------------------------------------
  console.log("[research] Step 6/8: Downloading infographic...");

  let infographicPath: string | undefined;
  if (infographicResult) {
    const sanitizedTopic = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50);
    const pngPath = join(
      cfg.outputDir,
      `${sanitizedTopic}-infographic.png`
    );

    const downloaded = await safeStep("download-infographic", () =>
      runNotebookLM(cfg, ["download", "infographic", pngPath], {
        notebook: notebookId,
        timeout: cfg.commandTimeout,
        skipJson: true,
      })
    );

    if (downloaded !== undefined) {
      infographicPath = pngPath;
      console.log(`[research] Infographic saved to: ${pngPath}`);
    }
  }

  // -----------------------------------------------------------------------
  // Step 7: Fetch sources
  // -----------------------------------------------------------------------
  console.log("[research] Step 7/8: Fetching source list...");

  let sources: ResearchSource[] = [];
  const sourcesResult = await safeStep("source-list", () =>
    runNotebookLM(cfg, ["source", "list"], {
      notebook: notebookId,
    })
  );

  if (sourcesResult) {
    const parsed = parseJsonOutput<
      Array<{ title?: string; url?: string; name?: string; source_url?: string }>
    >(sourcesResult);

    if (Array.isArray(parsed)) {
      sources = parsed.map((s) => ({
        title: s.title || s.name || "Untitled",
        url: s.url || s.source_url || "",
        type: classifySourceType(s.url || s.source_url || ""),
      }));
    }
  }

  console.log(`[research] Found ${sources.length} sources.`);

  // -----------------------------------------------------------------------
  // Step 8: Generate scene hints
  // -----------------------------------------------------------------------
  console.log("[research] Step 8/8: Generating scene hints...");

  // Collect all content sections for scene analysis
  const contentSections: string[] = [];

  for (const point of talkingPoints) {
    contentSections.push(point);
  }
  for (const example of codeExamples) {
    contentSections.push(`\`\`\`${example.language}\n${example.snippet}\n\`\`\``);
  }
  if (briefing) {
    // Split briefing into paragraphs for granular scene hints
    const paragraphs = briefing.split(/\n\n+/).filter((p) => p.trim());
    contentSections.push(...paragraphs);
  }
  if (answers.comparison) {
    contentSections.push(answers.comparison);
  }

  const sceneHints = generateSceneHints(contentSections);

  const completedAt = new Date().toISOString();

  console.log(
    `[research] Pipeline complete for "${topic}" in ${Math.round(
      (new Date(completedAt).getTime() - new Date(createdAt).getTime()) / 1000
    )}s`
  );

  // -----------------------------------------------------------------------
  // Return structured payload
  // -----------------------------------------------------------------------
  return {
    topic,
    notebookId,
    createdAt,
    completedAt,
    sources,
    briefing,
    talkingPoints,
    codeExamples,
    comparisonData:
      comparisonData && comparisonData.length > 0
        ? comparisonData
        : undefined,
    mindMap,
    dataTable,
    prosCons,
    commonMistakes,
    sceneHints,
    infographicPath,
  };
}
