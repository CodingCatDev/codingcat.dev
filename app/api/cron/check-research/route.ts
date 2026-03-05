export const fetchCache = 'force-no-store';
export const maxDuration = 60;

import { type NextRequest } from 'next/server';
import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';
import { NotebookLMClient } from '@/lib/services/notebooklm/client';
import { initAuth } from '@/lib/services/notebooklm/auth';
import { ArtifactTypeCode, ArtifactStatus } from '@/lib/services/notebooklm/types';
import { generateWithGemini, stripCodeFences } from '@/lib/gemini';
import type { ResearchPayload } from '@/lib/services/research';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PipelineDoc {
  _id: string;
  title: string;
  status: string;
  researchNotebookId: string;
  researchTaskId?: string;
  trendScore?: number;
  trendSources?: string;
  script?: {
    hook: string;
    scenes: Array<{
      _key: string;
      sceneNumber: number;
      sceneType: string;
      narration: string;
      visualDescription: string;
      bRollKeywords: string[];
      durationEstimate: number;
      code?: { snippet: string; language: string; highlightLines?: number[] };
      list?: { items: string[]; icon?: string };
      comparison?: {
        leftLabel: string;
        rightLabel: string;
        rows: { left: string; right: string }[];
      };
      mockup?: { deviceType: string; screenContent: string };
    }>;
    cta: string;
  };
  researchData?: string;
  infographicArtifactIds?: string[];
  _updatedAt: string;
}

interface EnrichedScript {
  title: string;
  summary: string;
  sourceUrl: string;
  topics: string[];
  script: {
    hook: string;
    scenes: Array<{
      sceneNumber: number;
      sceneType: string;
      narration: string;
      visualDescription: string;
      bRollKeywords: string[];
      durationEstimate: number;
      code?: { snippet: string; language: string; highlightLines?: number[] };
      list?: { items: string[]; icon?: string };
      comparison?: {
        leftLabel: string;
        rightLabel: string;
        rows: { left: string; right: string }[];
      };
      mockup?: { deviceType: string; screenContent: string };
    }>;
    cta: string;
  };
  qualityScore: number;
}

interface CriticResult {
  score: number;
  issues: string[];
  summary: string;
}

interface StepResult {
  id: string;
  title: string;
  step: string;
  outcome: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Stuck thresholds per status (ms) */
const STUCK_THRESHOLDS: Record<string, number> = {
  researching: 30 * 60 * 1000,           // 30 minutes
  infographics_generating: 15 * 60 * 1000, // 15 minutes
  enriching: 10 * 60 * 1000,              // 10 minutes
};

/** Max docs to process per status per run — keeps total time well under 60s */
const MAX_DOCS_PER_STATUS = 2;

/** Infographic instructions for visual variety */
const INFOGRAPHIC_INSTRUCTIONS = [
  'Create a high-level architecture overview diagram',
  'Create a comparison chart of key features and alternatives',
  'Create a step-by-step workflow diagram',
  'Create a timeline of key developments and milestones',
  'Create a pros and cons visual summary',
];

// ---------------------------------------------------------------------------
// Sanity Write Client
// ---------------------------------------------------------------------------

function getSanityWriteClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error('[check-research] Missing SANITY_API_TOKEN environment variable');
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

// ---------------------------------------------------------------------------
// Stuck detection — runs FIRST, no external API calls needed
// ---------------------------------------------------------------------------

async function flagStuckDocs(
  docs: PipelineDoc[],
  sanity: SanityClient,
): Promise<StepResult[]> {
  const results: StepResult[] = [];
  const now = Date.now();

  for (const doc of docs) {
    const threshold = STUCK_THRESHOLDS[doc.status];
    if (!threshold) continue;

    const docAge = now - new Date(doc._updatedAt).getTime();
    if (docAge > threshold) {
      const ageMin = Math.round(docAge / 60_000);
      console.warn(
        `[check-research] Doc ${doc._id} ("${doc.title}") stuck in "${doc.status}" for ${ageMin}min — flagging`,
      );
      try {
        await sanity
          .patch(doc._id)
          .set({
            status: 'flagged',
            flaggedReason: `Stuck in "${doc.status}" for ${ageMin} minutes (threshold: ${Math.round(threshold / 60_000)}min). May need manual intervention.`,
          })
          .commit();
        results.push({
          id: doc._id,
          title: doc.title,
          step: 'stuck-detection',
          outcome: 'flagged',
          error: `Stuck in "${doc.status}" for ${ageMin}min`,
        });
      } catch (err) {
        console.error(`[check-research] Failed to flag stuck doc ${doc._id}:`, err);
      }
    }
  }

  return results;
}
