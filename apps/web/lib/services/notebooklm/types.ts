/**
 * NotebookLM TypeScript Client — Type Definitions
 *
 * RPC method IDs, artifact codes, and interfaces for the pure-TS
 * NotebookLM client. Method IDs are reverse-engineered from the
 * notebooklm-py Python package.
 *
 * @module lib/services/notebooklm/types
 */

// ---------------------------------------------------------------------------
// RPC Method IDs (reverse-engineered from notebooklm-py)
// ---------------------------------------------------------------------------

export const RPCMethod = {
  // Notebook operations
  LIST_NOTEBOOKS: 'wXbhsf',
  CREATE_NOTEBOOK: 'CCqFvf',
  GET_NOTEBOOK: 'rLM1Ne',
  DELETE_NOTEBOOK: 'WWINqb',

  // Source operations
  ADD_SOURCE: 'izAoDd',

  // Research
  START_FAST_RESEARCH: 'Ljjv0c',
  START_DEEP_RESEARCH: 'QA9ei',
  POLL_RESEARCH: 'e3bVqc',
  IMPORT_RESEARCH: 'LBwxtb',

  // Artifacts
  CREATE_ARTIFACT: 'R7cb6c',
  LIST_ARTIFACTS: 'gArtLc',

  // Summary
  SUMMARIZE: 'VfAZjd',

  // Mind map
  GENERATE_MIND_MAP: 'yyryJe',
} as const;

export type RPCMethodId = (typeof RPCMethod)[keyof typeof RPCMethod];

// ---------------------------------------------------------------------------
// Artifact type codes
// ---------------------------------------------------------------------------

export const ArtifactTypeCode = {
  AUDIO: 1,
  REPORT: 2,
  VIDEO: 3,
  QUIZ: 4,
  MIND_MAP: 5,
  INFOGRAPHIC: 7,
  SLIDE_DECK: 8,
  DATA_TABLE: 9,
} as const;

// ---------------------------------------------------------------------------
// Artifact status codes
// ---------------------------------------------------------------------------

export const ArtifactStatus = {
  PROCESSING: 1,
  PENDING: 2,
  COMPLETED: 3,
  FAILED: 4,
} as const;

// ---------------------------------------------------------------------------
// Infographic options
// ---------------------------------------------------------------------------

export const InfographicOrientation = {
  LANDSCAPE: 1,
  PORTRAIT: 2,
  SQUARE: 3,
} as const;

export const InfographicDetail = {
  CONCISE: 1,
  STANDARD: 2,
  DETAILED: 3,
} as const;

// ---------------------------------------------------------------------------
// API endpoints
// ---------------------------------------------------------------------------

export const BATCHEXECUTE_URL =
  'https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface NotebookLMCookie {
  name: string;
  value: string;
  domain: string;
}

export interface AuthTokens {
  cookies: Record<string, string>;
  cookieHeader: string;
  csrfToken: string;
  sessionId: string;
}

export interface Notebook {
  id: string;
  title: string;
}

export interface ResearchResult {
  taskId: string;
  status: 'in_progress' | 'completed' | 'no_research';
  query: string;
  sources: Array<{ url: string; title: string }>;
  summary: string;
}

export interface GenerationStatus {
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export interface Artifact {
  id: string;
  typeCode: number;
  statusCode: number;
  title?: string;
  raw: unknown[];
}
