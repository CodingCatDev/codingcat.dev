/**
 * NotebookLM TypeScript Client — Public Exports
 *
 * Pure TypeScript client for the NotebookLM API.
 * No Python dependencies — uses fetch() for all HTTP calls.
 *
 * @module lib/services/notebooklm
 *
 * @example
 * ```ts
 * import { NotebookLMClient } from '@/lib/services/notebooklm';
 *
 * const client = await NotebookLMClient.create();
 * const notebook = await client.createNotebook('My Research');
 * ```
 */

export { NotebookLMClient } from './client';
export { NotebookLMRPCError } from './rpc';
export type {
  AuthTokens,
  Notebook,
  ResearchResult,
  GenerationStatus,
  Artifact,
} from './types';
export {
  RPCMethod,
  ArtifactTypeCode,
  ArtifactStatus,
  InfographicOrientation,
  InfographicDetail,
} from './types';
