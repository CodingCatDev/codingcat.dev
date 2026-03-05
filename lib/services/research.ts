/**
 * NotebookLM Research Service
 *
 * Pure TypeScript implementation that uses the NotebookLM client directly
 * via fetch() — no Python CLI, no child_process, no external dependencies.
 *
 * Pipeline:
 *   topic → NotebookLM deep research → artifacts + summary → ResearchPayload
 *
 * @module lib/services/research
 */

import { NotebookLMClient } from './notebooklm/client';
import { sleep } from './notebooklm/rpc';

// ---------------------------------------------------------------------------
// Types (kept identical for backward compatibility with ingest route)
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
  infographicUrl?: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  type: 'youtube' | 'article' | 'docs' | 'unknown';
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
  suggestedSceneType: 'narration' | 'code' | 'list' | 'comparison' | 'mockup';
  reason: string;
}

export interface ResearchConfig {
  /** Timeout for research polling in ms (default: 600000 = 10 min) */
  researchTimeout?: number;
  /** Timeout for artifact generation in ms (default: 300000 = 5 min) */
  artifactTimeout?: number;
  /** Source URLs to add to the notebook before research (from trend discovery) */
  sourceUrls?: string[];
  /** Polling interval for research status in ms (default: 15000 = 15s) */
  pollInterval?: number;
}

// ---------------------------------------------------------------------------
// Source type classification
// ---------------------------------------------------------------------------

function classifySourceType(
  url: string
): 'youtube' | 'article' | 'docs' | 'unknown' {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  if (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('youtube')
  ) {
    return 'youtube';
  }
  if (
    lower.includes('/docs') ||
    lower.includes('documentation') ||
    lower.includes('developer.') ||
    lower.includes('devdocs') ||
    lower.includes('mdn') ||
    lower.includes('spec.')
  ) {
    return 'docs';
  }
  if (
    lower.includes('blog') ||
    lower.includes('medium.com') ||
    lower.includes('dev.to') ||
    lower.includes('hashnode') ||
    lower.includes('article')
  ) {
    return 'article';
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Scene hint generation
// ---------------------------------------------------------------------------

function classifyScene(
  content: string
): 'narration' | 'code' | 'list' | 'comparison' | 'mockup' {
  // Code blocks
  if (
    /```[\s\S]*?```/.test(content) ||
    /^\s{2,}(const|let|var|function|import|export|class|def|return)\b/m.test(
      content
    )
  ) {
    return 'code';
  }
  // Numbered or bulleted lists (3+ items)
  const listMatches = content.match(/^[\s]*[-•*\d]+[.)]\s/gm);
  if (listMatches && listMatches.length >= 3) {
    return 'list';
  }
  // Comparison language
  if (
    /\bvs\.?\b/i.test(content) ||
    /\bcompare[ds]?\b/i.test(content) ||
    /\bdifference[s]?\b/i.test(content) ||
    /\bpros\s+(and|&)\s+cons\b/i.test(content)
  ) {
    return 'comparison';
  }
  // UI / mockup language
  if (
    /\b(UI|interface|dashboard|screen|layout|component|widget|button|modal)\b/i.test(
      content
    )
  ) {
    return 'mockup';
  }
  return 'narration';
}

function generateSceneHints(sections: string[]): SceneHint[] {
  const hints: SceneHint[] = [];

  for (const section of sections) {
    if (!section.trim()) continue;

    const sceneType = classifyScene(section);
    const reasonMap: Record<typeof sceneType, string> = {
      code: 'Contains code blocks or programming constructs',
      list: 'Contains a numbered or bulleted list with 3+ items',
      comparison: 'Contains comparison language (vs, compare, differences)',
      mockup: 'Describes UI elements or interface components',
      narration: 'General explanatory content best suited for narration',
    };

    hints.push({
      content: section.slice(0, 500),
      suggestedSceneType: sceneType,
      reason: reasonMap[sceneType],
    });
  }

  return hints;
}

// ---------------------------------------------------------------------------
// Content extraction helpers
// ---------------------------------------------------------------------------

function extractTalkingPoints(text: string): string[] {
  const lines = text.split('\n');
  const points: string[] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[\s]*[-•*\d]+[.)]\s*/, '').trim();
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
    const language = match[1] || 'typescript';
    const snippet = match[2].trim();

    const beforeBlock = text.slice(0, match.index);
    const contextLines = beforeBlock.split('\n').filter((l) => l.trim());
    const context =
      contextLines.length > 0
        ? contextLines[contextLines.length - 1].trim()
        : 'Code example';

    examples.push({ snippet, language, context });
  }

  return examples;
}

// ---------------------------------------------------------------------------
// Safe wrapper for optional pipeline steps
// ---------------------------------------------------------------------------

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
// Sleep helper
// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

/**
 * Run the full NotebookLM research pipeline for a topic.
 *
 * Creates a notebook, runs deep web research, generates artifacts,
 * and returns a structured {@link ResearchPayload}.
 *
 * Requires `ENABLE_NOTEBOOKLM_RESEARCH=true` and `NOTEBOOKLM_AUTH_JSON`
 * env vars to be set.
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
  const researchTimeout = configOverrides?.researchTimeout ?? 600_000;
  const artifactTimeout = configOverrides?.artifactTimeout ?? 300_000;
  const pollInterval = configOverrides?.pollInterval ?? 15_000;
  const createdAt = new Date().toISOString();

  console.log(`[research] Starting research pipeline for: "${topic}"`);

  // -----------------------------------------------------------------------
  // Step 1: Initialize client
  // -----------------------------------------------------------------------
  console.log('[research] Step 1/10: Initializing NotebookLM client...');
  const client = await NotebookLMClient.create();

  // -----------------------------------------------------------------------
  // Step 2: Create a notebook
  // -----------------------------------------------------------------------
  console.log('[research] Step 2/10: Creating notebook...');
  const notebook = await client.createNotebook(topic);
  const notebookId = notebook.id;

  if (!notebookId) {
    throw new Error(
      `[research] Failed to create notebook — no ID returned.`
    );
  }

  console.log(`[research] Notebook created: ${notebookId}`);

  // -----------------------------------------------------------------------
  // Step 2b: Add source URLs from trend discovery (if provided)
  // -----------------------------------------------------------------------
  const sourceUrls = configOverrides?.sourceUrls ?? [];
  if (sourceUrls.length > 0) {
    console.log(`[research] Adding ${sourceUrls.length} source URLs to notebook...`);
    const addResults = await Promise.allSettled(
      sourceUrls.slice(0, 10).map((url) =>
        safeStep(`add-source-${url.substring(0, 40)}`, () =>
          client.addSource(notebookId, url)
        )
      )
    );
    const added = addResults.filter((r) => r.status === 'fulfilled' && r.value).length;
    console.log(`[research] Added ${added}/${sourceUrls.length} sources to notebook`);
    // Give NotebookLM a moment to process the sources
    if (added > 0) {
      await sleep(5000);
    }
  }

  // -----------------------------------------------------------------------
  // Step 3: Start deep web research
  // -----------------------------------------------------------------------
  console.log('[research] Step 3/10: Starting deep web research...');
  const researchTask = await safeStep('start-research', () =>
    client.startResearch(notebookId, topic, 'deep')
  );

  // -----------------------------------------------------------------------
  // Step 4: Poll research until completed
  // -----------------------------------------------------------------------
  console.log('[research] Step 4/10: Waiting for research to complete...');
  let researchSources: Array<{ url: string; title: string }> = [];
  let researchTaskId = researchTask?.taskId ?? '';

  if (researchTask) {
    const startTime = Date.now();
    let researchCompleted = false;

    while (Date.now() - startTime < researchTimeout) {
      try {
        const pollResult = await client.pollResearch(notebookId);

        if (pollResult.status === 'completed') {
          researchSources = pollResult.sources;
          researchTaskId = pollResult.taskId || researchTaskId;
          researchCompleted = true;
          console.log(
            `[research] Research completed — ${researchSources.length} sources found`
          );
          break;
        }

        if (pollResult.status === 'no_research') {
          console.log('[research] No research in progress');
          break;
        }
      } catch (error: unknown) {
        console.warn(
          '[research] Error polling research:',
          error instanceof Error ? error.message : String(error)
        );
      }

      await sleep(pollInterval);
    }

    if (!researchCompleted) {
      console.warn(
        `[research] Research timed out after ${researchTimeout}ms`
      );
    }
  }

  // -----------------------------------------------------------------------
  // Step 5: Import research sources
  // -----------------------------------------------------------------------
  if (researchSources.length > 0 && researchTaskId) {
    console.log(
      `[research] Step 5/10: Importing ${researchSources.length} research sources...`
    );
    await safeStep('import-sources', () =>
      client.importResearchSources(notebookId, researchTaskId, researchSources)
    );
  } else {
    console.log('[research] Step 5/10: No sources to import, skipping...');
  }

  // -----------------------------------------------------------------------
  // Step 6 & 7: Generate artifacts in parallel
  // -----------------------------------------------------------------------
  console.log('[research] Step 6-7/10: Generating artifacts...');

  const [infographicResult, reportResult] = await Promise.allSettled([
    safeStep('generate-infographic', () =>
      client.generateInfographic(notebookId)
    ),
    safeStep('generate-report', () => client.generateReport(notebookId)),
  ]);

  const infographicTaskId =
    infographicResult.status === 'fulfilled' && infographicResult.value
      ? infographicResult.value.taskId
      : '';
  const reportTaskId =
    reportResult.status === 'fulfilled' && reportResult.value
      ? reportResult.value.taskId
      : '';

  // -----------------------------------------------------------------------
  // Step 8: Wait for artifacts to complete
  // -----------------------------------------------------------------------
  console.log('[research] Step 8/10: Waiting for artifacts...');

  const waitPromises: Promise<unknown>[] = [];
  if (infographicTaskId) {
    waitPromises.push(
      safeStep('wait-infographic', () =>
        client.waitForArtifact(notebookId, infographicTaskId, {
          timeoutMs: artifactTimeout,
          pollIntervalMs: pollInterval,
        })
      )
    );
  }
  if (reportTaskId) {
    waitPromises.push(
      safeStep('wait-report', () =>
        client.waitForArtifact(notebookId, reportTaskId, {
          timeoutMs: artifactTimeout,
          pollIntervalMs: pollInterval,
        })
      )
    );
  }

  if (waitPromises.length > 0) {
    await Promise.allSettled(waitPromises);
  }

  // -----------------------------------------------------------------------
  // Step 9: Get notebook summary
  // -----------------------------------------------------------------------
  console.log('[research] Step 9/10: Getting notebook summary...');
  const summary = await safeStep('get-summary', () =>
    client.getSummary(notebookId)
  );
  const briefing = summary ?? '';

  // -----------------------------------------------------------------------
  // Step 10: Get infographic URL
  // -----------------------------------------------------------------------
  console.log('[research] Step 10/10: Getting infographic URL...');
  const infographicUrl = await safeStep('get-infographic-url', () =>
    client.getInfographicUrl(notebookId)
  );

  // -----------------------------------------------------------------------
  // Build the research payload
  // -----------------------------------------------------------------------
  const completedAt = new Date().toISOString();

  // Classify sources
  const classifiedSources: ResearchSource[] = researchSources.map((s) => ({
    title: s.title,
    url: s.url,
    type: classifySourceType(s.url),
  }));

  // Extract structured data from the briefing
  const talkingPoints = extractTalkingPoints(briefing);
  const codeExamples = extractCodeExamples(briefing);

  // Generate scene hints from briefing sections
  const sections = briefing
    .split(/\n(?=#{1,3}\s)|\n\n/)
    .filter((s) => s.trim().length > 50);
  const sceneHints = generateSceneHints(sections);

  const payload: ResearchPayload = {
    topic,
    notebookId,
    createdAt,
    completedAt,
    sources: classifiedSources,
    briefing,
    talkingPoints,
    codeExamples,
    sceneHints,
    infographicUrl: infographicUrl ?? undefined,
  };

  console.log(
    `[research] Pipeline complete: ${classifiedSources.length} sources, ` +
      `${talkingPoints.length} talking points, ${sceneHints.length} scene hints`
  );

  return payload;
}
