/**
 * NotebookLM TypeScript Client — Main Client
 *
 * Pure TypeScript client for the NotebookLM API using fetch().
 * Replaces the Python CLI wrapper with direct HTTP calls to the
 * Google BatchExecute endpoint.
 *
 * @module lib/services/notebooklm/client
 */

import type {
  AuthTokens,
  Notebook,
  ResearchResult,
  GenerationStatus,
  Artifact,
} from './types';
import {
  RPCMethod,
  ArtifactTypeCode,
  ArtifactStatus,
} from './types';
import {
  encodeRpcRequest,
  buildRequestBody,
  buildRpcUrl,
  decodeResponse,
  NotebookLMRPCError,
  fetchWithTimeout,
  sleep,
} from './rpc';
import { initAuth } from './auth';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default fetch timeout for RPC calls (ms) */
const DEFAULT_FETCH_TIMEOUT_MS = 30_000;

/** Extended timeout for long-running operations like research polling (ms) */
const EXTENDED_FETCH_TIMEOUT_MS = 120_000;

/** Default source path for RPC URLs */
const DEFAULT_SOURCE_PATH = '/';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Check if a URL is a YouTube URL.
 */
function isYouTubeUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be');
}

/**
 * Safely access a deeply nested array value.
 * Returns undefined if any intermediate access fails.
 */
function safeGet(obj: unknown, ...path: (number | string)[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null || typeof current !== 'object') return undefined;
    if (Array.isArray(current)) {
      if (typeof key === 'number') {
        current = current[key];
      } else {
        return undefined;
      }
    } else {
      current = (current as Record<string, unknown>)[String(key)];
    }
  }
  return current;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class NotebookLMClient {
  private auth: AuthTokens;

  constructor(auth: AuthTokens) {
    this.auth = auth;
  }

  /**
   * Initialize authentication and create a new client instance.
   */
  static async create(): Promise<NotebookLMClient> {
    const auth = await initAuth();
    return new NotebookLMClient(auth);
  }

  // -------------------------------------------------------------------------
  // Internal RPC helper
  // -------------------------------------------------------------------------

  /**
   * Make an RPC call to the NotebookLM BatchExecute endpoint.
   *
   * @param methodId - The RPC method ID
   * @param params - The method parameters
   * @param sourcePath - Optional source path for the URL (default: '/')
   * @param timeoutMs - Optional fetch timeout override
   * @returns The decoded RPC result
   */
  private async rpcCall(
    methodId: string,
    params: unknown[],
    sourcePath?: string,
    timeoutMs?: number
  ): Promise<unknown> {
    const rpcRequest = encodeRpcRequest(methodId, params);
    const body = buildRequestBody(rpcRequest, this.auth.csrfToken);
    const url = buildRpcUrl(
      methodId,
      sourcePath ?? DEFAULT_SOURCE_PATH,
      this.auth.sessionId
    );

    console.log(`[NotebookLM] RPC ${methodId} URL: ${url}`);
    console.log(`[NotebookLM] RPC ${methodId} body length: ${body.length}`);
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Cookie: this.auth.cookieHeader,
        },
        body,
        cache: 'no-store' as RequestCache,
      },
      timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS
    );

    if (!response.ok) {
      throw new NotebookLMRPCError(
        `HTTP ${response.status} ${response.statusText} for method ${methodId}`,
        { methodId }
      );
    }

    const responseText = await response.text();
    console.log(`[NotebookLM] RPC ${methodId} response: ${responseText.length} bytes, first 200: ${responseText.substring(0, 200)}`);
    return decodeResponse(responseText, methodId);
  }

  // -------------------------------------------------------------------------
  // Notebook operations
  // -------------------------------------------------------------------------

  /**
   * List all notebooks.
   */
  async listNotebooks(): Promise<Notebook[]> {
    try {
      console.log('[NotebookLM] Listing notebooks...');
      const result = await this.rpcCall(RPCMethod.LIST_NOTEBOOKS, [
        null,
        1,
        null,
        [2],
      ]);

      const resultArr = result as unknown[];
      if (!Array.isArray(resultArr) || !Array.isArray(resultArr[0])) {
        return [];
      }

      const notebooks: Notebook[] = [];
      const items = resultArr[0] as unknown[][];
      for (const item of items) {
        if (!Array.isArray(item)) continue;
        // Response format per notebook: [title, null, notebookId, ...]
        // Index 0 = title string, Index 2 = UUID string
        const title = typeof item[0] === 'string' ? item[0] : '';
        const id = typeof item[2] === 'string' ? item[2] : '';
        if (id) {
          notebooks.push({ id, title });
        }
      }

      return notebooks;
    } catch (error: unknown) {
      console.error(
        '[NotebookLM] Failed to list notebooks:',
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }

  /**
   * Create a new notebook with the given title.
   */
  async createNotebook(title: string): Promise<Notebook> {
    console.log(`[NotebookLM] Creating notebook: "${title}"`);
    const result = await this.rpcCall(RPCMethod.CREATE_NOTEBOOK, [
      title,
      null,
      null,
      [2],
      [1],
    ]);

    const resultArr = result as unknown[];
    if (!Array.isArray(resultArr)) {
      throw new NotebookLMRPCError(
        'Unexpected response format from createNotebook',
        { methodId: RPCMethod.CREATE_NOTEBOOK }
      );
    }

    // Response format: [title, null, notebookId, ...]
    // Index 0 = title string, Index 2 = UUID string
    const notebookTitle =
      typeof resultArr[0] === 'string' ? resultArr[0] : title;
    const id =
      typeof resultArr[2] === 'string' ? resultArr[2] : '';

    if (!id) {
      throw new NotebookLMRPCError(
        'No notebook ID returned from createNotebook — expected UUID at index 2',
        { methodId: RPCMethod.CREATE_NOTEBOOK }
      );
    }

    console.log(`[NotebookLM] Notebook created: ${id}`);
    return { id, title: notebookTitle };
  }

  // -------------------------------------------------------------------------
  // Source operations
  // -------------------------------------------------------------------------

  /**
   * Add a URL source to a notebook.
   *
   * Automatically detects YouTube URLs and uses the appropriate params format.
   *
   * @returns The source ID
   */
  async addSource(notebookId: string, url: string): Promise<string> {
    console.log(
      `[NotebookLM] Adding source to notebook ${notebookId}: ${url}`
    );

    let params: unknown[];

    if (isYouTubeUrl(url)) {
      // YouTube URL format
      params = [
        [
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            [url],
            null,
            null,
            1,
          ],
        ],
        notebookId,
        [2],
        [1, null, null, null, null, null, null, null, null, null, [1]],
      ];
    } else {
      // Regular URL format
      params = [
        [[null, null, [url], null, null, null, null, null]],
        notebookId,
        [2],
        null,
        null,
      ];
    }

    const result = await this.rpcCall(RPCMethod.ADD_SOURCE, params, `/notebook/${notebookId}`);

    // Extract source ID from response
    const resultArr = result as unknown[];
    if (Array.isArray(resultArr)) {
      // Source ID is typically in the first element
      const sourceId = safeGet(resultArr, 0, 0, 0);
      if (typeof sourceId === 'string') {
        return sourceId;
      }
      // Fallback: try other common positions
      const altId = safeGet(resultArr, 0, 0);
      if (typeof altId === 'string') {
        return altId;
      }
    }

    console.warn('[NotebookLM] Could not extract source ID from response');
    return '';
  }

  // -------------------------------------------------------------------------
  // Research operations
  // -------------------------------------------------------------------------

  /**
   * Start a research task on a notebook.
   *
   * @param notebookId - The notebook to research in
   * @param query - The research query
   * @param mode - 'fast' or 'deep' research (default: 'fast')
   * @returns Task ID and optional report ID
   */
  async startResearch(
    notebookId: string,
    query: string,
    mode: 'fast' | 'deep' = 'fast'
  ): Promise<{ taskId: string; reportId?: string }> {
    console.log(
      `[NotebookLM] Starting ${mode} research in notebook ${notebookId}: "${query}"`
    );

    let methodId: string;
    let params: unknown[];

    if (mode === 'deep') {
      methodId = RPCMethod.START_DEEP_RESEARCH;
      params = [null, [1], [query, 1], 5, notebookId];
    } else {
      methodId = RPCMethod.START_FAST_RESEARCH;
      params = [[query, 1], null, 1, notebookId];
    }

    const result = await this.rpcCall(methodId, params, `/notebook/${notebookId}`);
    console.log(`[NotebookLM] startResearch raw result:`, JSON.stringify(result));
    const resultArr = result as unknown[];

    // Extract task ID from response
    let taskId = '';
    let reportId: string | undefined;

    if (Array.isArray(resultArr)) {
      // Task ID is typically at [0] or [0][0]
      const firstEl = resultArr[0];
      if (typeof firstEl === 'string') {
        taskId = firstEl;
      } else if (Array.isArray(firstEl) && typeof firstEl[0] === 'string') {
        taskId = firstEl[0];
      }

      // Report ID may be at [1] for deep research
      const secondEl = resultArr[1];
      if (typeof secondEl === 'string') {
        reportId = secondEl;
      }
    }

    console.log(
      `[NotebookLM] Research started — taskId: ${taskId || 'unknown'}`
    );
    return { taskId, reportId };
  }

  /**
   * Poll the research status for a notebook.
   */
  async pollResearch(notebookId: string): Promise<ResearchResult> {
    const result = await this.rpcCall(
      RPCMethod.POLL_RESEARCH,
      [null, null, notebookId],
      `/notebook/${notebookId}`,
      EXTENDED_FETCH_TIMEOUT_MS
    );

    console.log(`[NotebookLM] pollResearch raw result:`, JSON.stringify(result)?.substring(0, 500));

    const resultArr = result as unknown[];
    const emptyResult: ResearchResult = {
      taskId: '',
      status: 'no_research',
      query: '',
      sources: [],
      summary: '',
    };

    if (!Array.isArray(resultArr) || resultArr.length === 0) {
      return emptyResult;
    }

    // Response format (from live API debugging):
    // result = [[[reportId, taskInfo, startTimestamp, updateTimestamp]]]
    // taskInfo = [notebookId, [query, sourceType], mode, null, statusCode, researchMeta]
    // researchMeta = [taskId, null, ?, null, "deep_research.v3p1s.prod"]
    // statusCode: 1=in_progress, 2=completed
    //
    // When completed, taskInfo has additional data:
    // taskInfo = [notebookId, [query, sourceType], mode, sourcesAndSummary, statusCode, researchMeta]
    // sourcesAndSummary = [sourcesArray, summaryText]

    // Unwrap the triple-nesting to get to the task array
    // result = [[[...]]] → task = result[0][0]
    let task: unknown[] | null = null;

    if (
      Array.isArray(resultArr[0]) &&
      Array.isArray((resultArr[0] as unknown[])[0])
    ) {
      const inner = (resultArr[0] as unknown[])[0] as unknown[];
      if (inner.length >= 2 && typeof inner[0] === 'string') {
        task = inner;
      }
    }

    if (!task) {
      // Try single-nested: result = [[taskId, taskInfo, ...]]
      if (
        Array.isArray(resultArr[0]) &&
        typeof (resultArr[0] as unknown[])[0] === 'string'
      ) {
        task = resultArr[0] as unknown[];
      }
    }

    if (!task || task.length < 2) {
      return emptyResult;
    }

    const reportId = task[0] as string;
    const taskInfo = task[1] as unknown[];

    if (!Array.isArray(taskInfo) || taskInfo.length < 5) {
      return emptyResult;
    }

    // taskInfo = [notebookId, [query, sourceType], mode, sourcesAndSummary, statusCode, researchMeta]
    const queryInfo = taskInfo[1];
    const sourcesAndSummary = taskInfo[3];
    const statusCode = taskInfo[4];
    const researchMeta = taskInfo[5];

    const queryText =
      Array.isArray(queryInfo) && typeof queryInfo[0] === 'string'
        ? queryInfo[0]
        : '';

    // Extract the research task ID from researchMeta
    let taskId = reportId; // fallback to reportId
    if (Array.isArray(researchMeta) && typeof researchMeta[0] === 'string') {
      taskId = researchMeta[0];
    }

    // Parse sources
    const sources: Array<{ url: string; title: string }> = [];
    let summary = '';

    if (Array.isArray(sourcesAndSummary) && sourcesAndSummary.length >= 1) {
      const sourcesData = Array.isArray(sourcesAndSummary[0])
        ? sourcesAndSummary[0]
        : [];
      if (
        sourcesAndSummary.length >= 2 &&
        typeof sourcesAndSummary[1] === 'string'
      ) {
        summary = sourcesAndSummary[1];
      }

      for (const src of sourcesData) {
        if (!Array.isArray(src) || src.length < 2) continue;
        const url =
          typeof src[0] === 'string' ? src[0] : '';
        const title =
          typeof src[1] === 'string' ? src[1] : '';
        if (title || url) {
          sources.push({ url, title });
        }
      }
    }

    // Research status: 1=in_progress, 2=completed
    const status: ResearchResult['status'] =
      statusCode === 2 ? 'completed' : 'in_progress';

    return { taskId, status, query: queryText, sources, summary };
  }

  /**
   * Import research sources into a notebook.
   */
  async importResearchSources(
    notebookId: string,
    taskId: string,
    sources: Array<{ url: string; title: string }>
  ): Promise<void> {
    console.log(
      `[NotebookLM] Importing ${sources.length} research sources into notebook ${notebookId}`
    );

    const sourceArray = sources
      .filter((s) => s.url) // Skip sources without URLs
      .map((s) => {
        if (isYouTubeUrl(s.url)) {
          // YouTube URLs go in index 7 as [url] array
          return [null, null, null, null, null, null, null, [s.url], null, null, 2];
        }
        // Regular URLs go in index 2 as [url, title]
        return [null, null, [s.url, s.title || 'Untitled'], null, null, null, null, null, null, null, 2];
      });

    await this.rpcCall(RPCMethod.IMPORT_RESEARCH, [
      null,
      [1],
      taskId,
      notebookId,
      sourceArray,
    ], `/notebook/${notebookId}`);

    console.log('[NotebookLM] Research sources imported');
  }

  // -------------------------------------------------------------------------
  // Artifact generation
  // -------------------------------------------------------------------------

  /**
   * Get all source IDs from a notebook.
   * Required for artifact generation (infographics, reports, etc.)
   */
  async getSourceIds(notebookId: string): Promise<string[]> {
    try {
      const result = await this.rpcCall(
        RPCMethod.GET_NOTEBOOK,
        [notebookId, null, [2], null, 0],
        `/notebook/${notebookId}`
      );

      const resultArr = result as unknown[];
      if (!Array.isArray(resultArr) || !Array.isArray(resultArr[0])) {
        return [];
      }

      const notebookInfo = resultArr[0] as unknown[];
      if (!Array.isArray(notebookInfo[1])) {
        return [];
      }

      const sources = notebookInfo[1] as unknown[][];
      const sourceIds: string[] = [];
      for (const source of sources) {
        if (!Array.isArray(source) || source.length === 0) continue;
        const first = source[0];
        if (Array.isArray(first) && first.length > 0 && typeof first[0] === 'string') {
          sourceIds.push(first[0]);
        }
      }
      return sourceIds;
    } catch (error: unknown) {
      console.warn(
        '[NotebookLM] Failed to get source IDs:',
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }

  /**
   * Generate an infographic for a notebook.
   */
  async generateInfographic(
    notebookId: string,
    options?: {
      sourceIds?: string[];
      language?: string;
      instructions?: string;
      orientation?: number;
      detailLevel?: number;
    }
  ): Promise<GenerationStatus> {
    console.log(
      `[NotebookLM] Generating infographic for notebook ${notebookId}`
    );

    // Auto-fetch source IDs if not provided
    const sourceIds = options?.sourceIds ?? await this.getSourceIds(notebookId);
    if (sourceIds.length === 0) {
      console.warn('[NotebookLM] No source IDs found — infographic generation may fail');
    }

    // Python format: [[[sid]] for sid in source_ids] → [[[sid1]], [[sid2]], ...]
    const sourceIdsTriple = sourceIds.map((sid) => [[sid]]);
    const instructions = options?.instructions ?? null;
    const language = options?.language ?? null;
    const orientation = options?.orientation ?? null;
    const detailLevel = options?.detailLevel ?? null;

    const params = [
      [2],
      notebookId,
      [
        null,
        null,
        ArtifactTypeCode.INFOGRAPHIC,
        sourceIdsTriple,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [[instructions, language, null, orientation, detailLevel]],
      ],
    ];

    try {
      const result = await this.rpcCall(RPCMethod.CREATE_ARTIFACT, params, `/notebook/${notebookId}`);
      return this.parseGenerationResult(result);
    } catch (error: unknown) {
      console.error(
        '[NotebookLM] Failed to generate infographic:',
        error instanceof Error ? error.message : String(error)
      );
      return {
        taskId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Generate a report/briefing doc for a notebook.
   */
  async generateReport(
    notebookId: string,
    options?: {
      sourceIds?: string[];
      language?: string;
      instructions?: string;
    }
  ): Promise<GenerationStatus> {
    console.log(`[NotebookLM] Generating report for notebook ${notebookId}`);

    // Auto-fetch source IDs if not provided
    const sourceIds = options?.sourceIds ?? await this.getSourceIds(notebookId);
    if (sourceIds.length === 0) {
      console.warn('[NotebookLM] No source IDs found — report generation may fail');
    }

    // Python format: [[[sid]] for sid in source_ids] → [[[sid1]], [[sid2]], ...]
    const sourceIdsTriple = sourceIds.map((sid) => [[sid]]);
    const instructions = options?.instructions ?? null;
    const language = options?.language ?? null;

    const params = [
      [2],
      notebookId,
      [
        null,
        null,
        ArtifactTypeCode.REPORT,
        sourceIdsTriple,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [[instructions, language, null, null, null]],
      ],
    ];

    try {
      const result = await this.rpcCall(RPCMethod.CREATE_ARTIFACT, params, `/notebook/${notebookId}`);
      return this.parseGenerationResult(result);
    } catch (error: unknown) {
      console.error(
        '[NotebookLM] Failed to generate report:',
        error instanceof Error ? error.message : String(error)
      );
      return {
        taskId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Parse a generation result from the CREATE_ARTIFACT RPC response.
   */
  private parseGenerationResult(result: unknown): GenerationStatus {
    const resultArr = result as unknown[];
    if (!Array.isArray(resultArr)) {
      return { taskId: '', status: 'pending' };
    }

    // Task/artifact ID is typically at [0] or [0][0]
    let taskId = '';
    const firstEl = resultArr[0];
    if (typeof firstEl === 'string') {
      taskId = firstEl;
    } else if (Array.isArray(firstEl) && typeof firstEl[0] === 'string') {
      taskId = firstEl[0];
    }

    return { taskId, status: 'pending' };
  }

  // -------------------------------------------------------------------------
  // Artifact listing and retrieval
  // -------------------------------------------------------------------------

  /**
   * List all artifacts in a notebook (excluding suggested ones).
   */
  async listArtifacts(notebookId: string): Promise<Artifact[]> {
    try {
      const result = await this.rpcCall(RPCMethod.LIST_ARTIFACTS, [
        [2],
        notebookId,
        'NOT artifact.status = "ARTIFACT_STATUS_SUGGESTED"',
      ], `/notebook/${notebookId}`);

      const resultArr = result as unknown[];
      if (!Array.isArray(resultArr) || !Array.isArray(resultArr[0])) {
        return [];
      }

      const artifacts: Artifact[] = [];
      const items = resultArr[0] as unknown[][];
      for (const item of items) {
        if (!Array.isArray(item)) continue;

        // Artifact structure: [id, title, typeCode, ?, statusCode, ...]
        const id = typeof item[0] === 'string' ? item[0] : '';
        const title = typeof item[1] === 'string' ? item[1] : undefined;
        const typeCode = typeof item[2] === 'number' ? item[2] : 0;
        const statusCode = typeof item[4] === 'number' ? item[4] : 0;

        if (id) {
          artifacts.push({
            id,
            typeCode,
            statusCode,
            title,
            raw: item,
          });
        }
      }

      return artifacts;
    } catch (error: unknown) {
      console.error(
        '[NotebookLM] Failed to list artifacts:',
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }

  /**
   * Get the notebook summary.
   */
  async getSummary(notebookId: string): Promise<string> {
    try {
      console.log(
        `[NotebookLM] Getting summary for notebook ${notebookId}`
      );
      const result = await this.rpcCall(RPCMethod.SUMMARIZE, [
        notebookId,
        [2],
      ], `/notebook/${notebookId}`);

      const resultArr = result as unknown[];
      if (!Array.isArray(resultArr)) {
        return '';
      }

      // Summary text is at result[0][0]
      const summaryContainer = resultArr[0];
      if (Array.isArray(summaryContainer) && typeof summaryContainer[0] === 'string') {
        return summaryContainer[0];
      }
      if (typeof summaryContainer === 'string') {
        return summaryContainer;
      }

      return '';
    } catch (error: unknown) {
      console.error(
        '[NotebookLM] Failed to get summary:',
        error instanceof Error ? error.message : String(error)
      );
      return '';
    }
  }

  /**
   * Get the infographic URL from a notebook's artifacts.
   *
   * Lists artifacts, finds a completed infographic, and extracts the
   * image URL from deeply nested metadata.
   */
  async getInfographicUrl(
    notebookId: string,
    artifactId?: string
  ): Promise<string | null> {
    try {
      const artifacts = await this.listArtifacts(notebookId);

      // Find the target infographic
      let infographic: Artifact | undefined;
      if (artifactId) {
        infographic = artifacts.find(
          (a) =>
            a.id === artifactId &&
            a.typeCode === ArtifactTypeCode.INFOGRAPHIC &&
            a.statusCode === ArtifactStatus.COMPLETED
        );
      } else {
        // Find the first completed infographic
        infographic = artifacts.find(
          (a) =>
            a.typeCode === ArtifactTypeCode.INFOGRAPHIC &&
            a.statusCode === ArtifactStatus.COMPLETED
        );
      }

      if (!infographic) {
        console.log('[NotebookLM] No completed infographic found');
        return null;
      }

      // Extract URL from deeply nested metadata
      // URL is at: artifact.raw[last_list_item][2][0][1][0]
      const raw = infographic.raw;
      if (!Array.isArray(raw) || raw.length === 0) {
        return null;
      }

      const lastItem = raw[raw.length - 1];
      const url = safeGet(lastItem, 2, 0, 1, 0);
      if (typeof url === 'string' && url.startsWith('http')) {
        return url;
      }

      // Try alternative paths for the URL
      // Sometimes it's at different nesting levels
      for (let i = raw.length - 1; i >= 0; i--) {
        const item = raw[i];
        if (!Array.isArray(item)) continue;

        // Walk through the item looking for URLs
        const candidateUrl = findUrlInNested(item);
        if (candidateUrl) {
          return candidateUrl;
        }
      }

      console.log(
        '[NotebookLM] Could not extract infographic URL from artifact metadata'
      );
      return null;
    } catch (error: unknown) {
      console.error(
        '[NotebookLM] Failed to get infographic URL:',
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  /**
   * Wait for an artifact to complete, polling at intervals.
   *
   * @param notebookId - The notebook containing the artifact
   * @param taskId - The artifact/task ID to wait for
   * @param options - Timeout and polling interval options
   * @returns The completed artifact, or null if timed out or failed
   */
  async waitForArtifact(
    notebookId: string,
    taskId: string,
    options?: {
      timeoutMs?: number;
      pollIntervalMs?: number;
    }
  ): Promise<Artifact | null> {
    const timeoutMs = options?.timeoutMs ?? 300_000; // 5 minutes default
    const pollIntervalMs = options?.pollIntervalMs ?? 10_000; // 10 seconds default
    const startTime = Date.now();

    console.log(
      `[NotebookLM] Waiting for artifact ${taskId} (timeout: ${timeoutMs}ms)`
    );

    while (Date.now() - startTime < timeoutMs) {
      try {
        const artifacts = await this.listArtifacts(notebookId);
        const target = artifacts.find((a) => a.id === taskId);

        if (target) {
          if (target.statusCode === ArtifactStatus.COMPLETED) {
            console.log(`[NotebookLM] Artifact ${taskId} completed`);
            return target;
          }
          if (target.statusCode === ArtifactStatus.FAILED) {
            console.error(`[NotebookLM] Artifact ${taskId} failed`);
            return target;
          }
        }
      } catch (error: unknown) {
        console.warn(
          '[NotebookLM] Error polling artifact status:',
          error instanceof Error ? error.message : String(error)
        );
      }

      await sleep(pollIntervalMs);
    }

    console.warn(
      `[NotebookLM] Timed out waiting for artifact ${taskId} after ${timeoutMs}ms`
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Utility: find URL in nested arrays
// ---------------------------------------------------------------------------

/**
 * Recursively search a nested array structure for a URL string.
 * Returns the first URL found, or null.
 */
function findUrlInNested(data: unknown, depth = 0): string | null {
  // Prevent infinite recursion
  if (depth > 10) return null;

  if (typeof data === 'string') {
    if (
      data.startsWith('https://') &&
      (data.includes('googleusercontent.com') ||
        data.includes('google.com') ||
        data.includes('.png') ||
        data.includes('.jpg') ||
        data.includes('.svg'))
    ) {
      return data;
    }
    return null;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findUrlInNested(item, depth + 1);
      if (found) return found;
    }
  }

  return null;
}
