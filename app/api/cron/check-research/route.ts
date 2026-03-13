export const fetchCache = 'force-no-store';
export const maxDuration = 60;

import { type NextRequest } from 'next/server';
import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';
import { pollResearch, parseResearchReport } from '@/lib/services/gemini-research';
import { generateInfographicsForTopic, generateFromScenePrompts } from '@/lib/services/gemini-infographics';
import { generateWithGemini, stripCodeFences } from '@/lib/gemini';
import { getConfigValue } from '@/lib/config';
import type { ResearchPayload } from '@/lib/services/research';
import { writeClient } from '@/lib/sanity-write-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PipelineDoc {
  _id: string;
  title: string;
  status: string;
  researchInteractionId?: string;
  researchNotebookId?: string;
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
      imagePrompts?: string[];
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
      imagePrompts?: string[];
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

/** Build stuck thresholds from config (with fallbacks) */
async function buildStuckThresholds(): Promise<Record<string, number>> {
  const stuckMinutes = await getConfigValue('pipeline_config', 'stuckTimeoutMinutes', 30);
  return {
    researching: stuckMinutes * 60 * 1000,
    infographics_generating: Math.round(stuckMinutes * 0.5) * 60 * 1000, // half the main timeout
    enriching: Math.round(stuckMinutes * 0.33) * 60 * 1000, // third of main timeout
  };
}

/** Max docs to process per status per run — keeps total time well under 60s */
const MAX_DOCS_PER_STATUS = 2;

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
  stuckThresholds: Record<string, number>,
): Promise<StepResult[]> {
  const results: StepResult[] = [];
  const now = Date.now();

  for (const doc of docs) {
    const threshold = stuckThresholds[doc.status];
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

// ---------------------------------------------------------------------------
// Step 1: researching → research_complete (Gemini Deep Research polling)
// ---------------------------------------------------------------------------

async function stepResearching(
  doc: PipelineDoc,
  sanity: SanityClient,
): Promise<StepResult> {
  // Use researchInteractionId (new Gemini) or fall back to researchNotebookId (legacy)
  const interactionId = doc.researchInteractionId;

  if (!interactionId) {
    // Legacy doc without interaction ID — skip to enriching with existing data
    console.warn(`[check-research] No researchInteractionId for "${doc.title}" — skipping to enriching`);
    await sanity.patch(doc._id).set({ status: 'enriching' }).commit();
    return { id: doc._id, title: doc.title, step: 'researching', outcome: 'no_interaction_skip_to_enriching' };
  }

  console.log(`[check-research] Polling research for "${doc.title}" (interaction: ${interactionId})`);

  const result = await pollResearch(interactionId);

  if (result.status === 'in_progress') {
    return { id: doc._id, title: doc.title, step: 'researching', outcome: 'still_in_progress' };
  }

  if (result.status === 'failed' || result.status === 'not_found') {
    console.error(`[check-research] Research ${result.status} for "${doc.title}": ${result.error}`);
    await sanity.patch(doc._id).set({
      status: 'flagged',
      flaggedReason: `Research ${result.status}: ${result.error || 'Unknown error'}`,
    }).commit();
    return { id: doc._id, title: doc.title, step: 'researching', outcome: result.status, error: result.error };
  }

  // Research completed — parse the report into structured data
  const report = result.report || '';
  console.log(`[check-research] Research completed for "${doc.title}" (${report.length} chars)`);

  const researchPayload = await parseResearchReport(doc.title, report);

  // Save research data and advance to research_complete
  await sanity.patch(doc._id).set({
    status: 'research_complete',
    researchData: JSON.stringify(researchPayload),
  }).commit();

  console.log(`[check-research] "${doc.title}" → research_complete`);
  return { id: doc._id, title: doc.title, step: 'researching', outcome: 'research_complete' };
}

// ---------------------------------------------------------------------------
// Step 2: research_complete → enriching (Gemini Imagen infographics)
// ---------------------------------------------------------------------------

async function stepResearchComplete(
  doc: PipelineDoc,
  sanity: SanityClient,
): Promise<StepResult> {
  console.log(`[check-research] Generating infographics for "${doc.title}"`);

  // Parse research data for briefing context
  let briefing = '';
  if (doc.researchData) {
    try {
      const data = JSON.parse(doc.researchData) as { briefing?: string };
      briefing = data.briefing || '';
    } catch { /* ignore */ }
  }

  // Collect imagePrompts from the script scenes (if available)
  // Collect imagePrompts from script scenes, tracking which scene each belongs to
  const scenePromptMap: Array<{ sceneNumber: number; promptCount: number }> = [];
  const sceneImagePrompts: string[] = [];
  if (doc.script?.scenes) {
    for (const scene of doc.script.scenes) {
      if (scene.imagePrompts && Array.isArray(scene.imagePrompts)) {
        scenePromptMap.push({ sceneNumber: scene.sceneNumber, promptCount: scene.imagePrompts.length });
        sceneImagePrompts.push(...scene.imagePrompts);
      }
    }
  }

  try {
    let horizontalRefs: Array<{
      _type: 'image'; _key: string; alt?: string;
      asset: { _type: 'reference'; _ref: string };
    }> = [];
    let verticalRefs: Array<{
      _type: 'image'; _key: string; alt?: string;
      asset: { _type: 'reference'; _ref: string };
    }> = [];
    let infographicUrls: string[] = [];
    let verticalUrls: string[] = [];

    if (sceneImagePrompts.length > 0) {
      // NEW PATH: Generate from per-scene prompts in both orientations
      console.log(`[check-research] Generating ${sceneImagePrompts.length} scene-specific infographics \u00d7 2 orientations`);
      const dualResult = await generateFromScenePrompts(sceneImagePrompts, doc.title);

      // Upload horizontal images to Sanity
      for (let i = 0; i < dualResult.horizontal.length; i++) {
        const imgResult = dualResult.horizontal[i];
        try {
          const buffer = Buffer.from(imgResult.imageBase64, 'base64');
          const filename = `infographic-h-${doc._id}-${i}.png`;
          const asset = await writeClient.assets.upload('image', buffer, {
            filename, contentType: imgResult.mimeType,
          });
          horizontalRefs.push({
            _type: 'image', _key: `h-${i}`,
            alt: `Infographic ${i + 1} for ${doc.title}`,
            asset: { _type: 'reference', _ref: asset._id },
          });
          const cdnUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset._id.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg')}`;
          infographicUrls.push(cdnUrl);
        } catch (err) {
          console.warn(`[check-research] Failed to upload horizontal infographic ${i}:`, err instanceof Error ? err.message : err);
        }
      }

      // Upload vertical images to Sanity
      for (let i = 0; i < dualResult.vertical.length; i++) {
        const imgResult = dualResult.vertical[i];
        try {
          const buffer = Buffer.from(imgResult.imageBase64, 'base64');
          const filename = `infographic-v-${doc._id}-${i}.png`;
          const asset = await writeClient.assets.upload('image', buffer, {
            filename, contentType: imgResult.mimeType,
          });
          verticalRefs.push({
            _type: 'image', _key: `v-${i}`,
            alt: `Infographic vertical ${i + 1} for ${doc.title}`,
            asset: { _type: 'reference', _ref: asset._id },
          });
          const cdnUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset._id.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg')}`;
          verticalUrls.push(cdnUrl);
        } catch (err) {
          console.warn(`[check-research] Failed to upload vertical infographic ${i}:`, err instanceof Error ? err.message : err);
        }
      }

      if (dualResult.errors.length > 0) {
        console.warn(`[check-research] ${dualResult.errors.length} infographic generation errors`);
      }
    } else {
      // FALLBACK: Use topic-level generation (existing behavior)
      console.log(`[check-research] No scene imagePrompts \u2014 falling back to topic-level generation`);
      const batchResult = await generateInfographicsForTopic(doc.title, briefing);

      console.log(`[check-research] Generated ${batchResult.results.length} infographics, ${batchResult.errors.length} failed`);

      for (let i = 0; i < batchResult.results.length; i++) {
        const imgResult = batchResult.results[i];
        try {
          const buffer = Buffer.from(imgResult.imageBase64, 'base64');
          const filename = `infographic-${doc._id}-${i}.png`;
          const asset = await writeClient.assets.upload('image', buffer, {
            filename, contentType: imgResult.mimeType,
          });
          horizontalRefs.push({
            _type: 'image', _key: `infographic-${i}`,
            alt: `Research infographic ${i + 1} for ${doc.title}`,
            asset: { _type: 'reference', _ref: asset._id },
          });
          const cdnUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset._id.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg')}`;
          infographicUrls.push(cdnUrl);
        } catch (err) {
          console.warn(`[check-research] Failed to upload infographic ${i}:`, err instanceof Error ? err.message : err);
        }
      }
    }

    // Update research data with infographic URLs
    let researchData: Record<string, unknown> = {};
    if (doc.researchData) {
      try { researchData = JSON.parse(doc.researchData); } catch { /* ignore */ }
    }
    researchData.infographicUrls = infographicUrls;
    if (verticalUrls.length > 0) {
      researchData.infographicVerticalUrls = verticalUrls;
    }

    const patchData: Record<string, unknown> = {
      status: 'enriching',
      researchData: JSON.stringify(researchData),
    };
    if (horizontalRefs.length > 0) {
      patchData.infographicsHorizontal = horizontalRefs;
    }
    if (verticalRefs.length > 0) {
      patchData.infographicsVertical = verticalRefs;
    }
    // Keep backward compat with old infographics field
    if (horizontalRefs.length > 0) {
      patchData.infographics = horizontalRefs;
    }

    // Distribute infographic URLs back to scene-level for Remotion mapInputProps()
    if (doc.script?.scenes && infographicUrls.length > 0) {
      let urlIndex = 0;
      const updatedScenes = doc.script.scenes.map((scene) => {
        const mapping = scenePromptMap.find(m => m.sceneNumber === scene.sceneNumber);
        if (mapping && mapping.promptCount > 0) {
          const sceneUrls = infographicUrls.slice(urlIndex, urlIndex + mapping.promptCount);
          urlIndex += mapping.promptCount;
          return { ...scene, infographicUrls: sceneUrls };
        }
        return scene;
      });
      patchData['script'] = { ...doc.script, scenes: updatedScenes };
    }

    await sanity.patch(doc._id).set(patchData).commit();

    console.log(`[check-research] "${doc.title}" \u2192 enriching (${horizontalRefs.length}H + ${verticalRefs.length}V infographics)`);
    return { id: doc._id, title: doc.title, step: 'research_complete', outcome: 'enriching' };
  } catch (err) {
    console.error(`[check-research] Infographic generation failed for "${doc.title}":`, err);
    await sanity.patch(doc._id).set({ status: 'enriching' }).commit();
    return { id: doc._id, title: doc.title, step: 'research_complete', outcome: 'enriching_no_infographics', error: err instanceof Error ? err.message : String(err) };
  }
}

// ---------------------------------------------------------------------------
// Step 3: infographics_generating → enriching (legacy migration handler)
// ---------------------------------------------------------------------------

async function stepInfographicsGenerating(
  doc: PipelineDoc,
  sanity: SanityClient,
): Promise<StepResult> {
  // Legacy migration: docs stuck in infographics_generating from old NotebookLM pipeline
  // Just advance them to enriching — they may or may not have infographics
  console.warn(`[check-research] Legacy doc "${doc.title}" in infographics_generating — advancing to enriching`);
  await sanity.patch(doc._id).set({ status: 'enriching' }).commit();
  return { id: doc._id, title: doc.title, step: 'infographics_generating', outcome: 'legacy_advance_to_enriching' };
}

// ---------------------------------------------------------------------------
// Step 4: enriching → script_ready
// ---------------------------------------------------------------------------

async function stepEnriching(
  doc: PipelineDoc,
  sanity: SanityClient,
): Promise<StepResult> {
  console.log(`[check-research] Step 4: Enriching script for "${doc.title}"`);

  // Parse research data from Sanity
  let researchData: Record<string, unknown> = {};

  if (doc.researchData) {
    try {
      researchData = JSON.parse(doc.researchData) as Record<string, unknown>;
    } catch {
      console.warn(`[check-research] Failed to parse researchData for "${doc.title}"`);
    }
  }

  // Build full research payload
  const researchPayload = buildResearchPayload(doc, researchData);

  // Generate enriched script with Gemini
  let enrichedScript: EnrichedScript | null = null;
  try {
    const SYSTEM_INSTRUCTION = await getConfigValue(
      'content_config',
      'systemInstruction',
      SYSTEM_INSTRUCTION_FALLBACK,
    );
    const prompt = buildEnrichmentPrompt(doc, researchPayload);
    const rawResponse = await generateWithGemini(prompt, SYSTEM_INSTRUCTION);
    const cleaned = stripCodeFences(rawResponse);
    enrichedScript = JSON.parse(cleaned) as EnrichedScript;
    console.log(`[check-research] Enriched script generated: "${enrichedScript.title}"`);
  } catch (err) {
    console.error('[check-research] Failed to generate enriched script:', err);
  }

  if (enrichedScript) {
    // Run critic pass
    const criticResult = await claudeCritic(enrichedScript);
    const criticScore = criticResult.score;
    console.log(`[check-research] Critic score: ${criticScore}/100 — ${criticResult.summary}`);

    const qualityThreshold = await getConfigValue('pipeline_config', 'qualityThreshold', 50);
    const isFlagged = criticScore < qualityThreshold;

    await sanity
      .patch(doc._id)
      .set({
        script: {
          ...enrichedScript.script,
          scenes: enrichedScript.script.scenes.map((scene, i) => ({
            ...scene,
            _key: `scene-${i + 1}`,
          })),
        },
        scriptQualityScore: criticScore,
        status: isFlagged ? 'flagged' : 'script_ready',
        researchData: JSON.stringify(researchPayload),
        ...(isFlagged && {
          flaggedReason: `Quality score ${criticScore}/100. Issues: ${(criticResult.issues ?? []).join('; ') || 'Low quality score'}`,
        }),
      })
      .commit();

    console.log(`[check-research] "${doc.title}" → ${isFlagged ? 'flagged' : 'script_ready'} (score: ${criticScore})`);
    return {
      id: doc._id,
      title: doc.title,
      step: 'enriching',
      outcome: isFlagged ? 'flagged' : 'script_ready',
    };
  }

  // Fallback: no enriched script — transition with existing script
  console.warn(`[check-research] No enriched script — transitioning "${doc.title}" to script_ready with existing script`);
  await sanity
    .patch(doc._id)
    .set({
      status: 'script_ready',
      researchData: JSON.stringify(researchPayload),
    })
    .commit();

  return { id: doc._id, title: doc.title, step: 'enriching', outcome: 'script_ready_fallback' };
}

// ---------------------------------------------------------------------------
// Gemini Script Enrichment
// ---------------------------------------------------------------------------

// SYSTEM_INSTRUCTION fallback — used when content_config singleton doesn't exist yet in Sanity.
// The live value is fetched from getConfigValue() inside stepEnriching().
const SYSTEM_INSTRUCTION_FALLBACK = `You are a content strategist and scriptwriter for CodingCat.dev, a web development education channel run by Alex Patterson.

Your style is inspired by Cleo Abram's "Huge If True" — you make complex technical topics feel exciting, accessible, and important. Key principles:
- Start with a BOLD claim or surprising fact that makes people stop scrolling
- Use analogies and real-world comparisons to explain technical concepts
- Build tension: "Here's the problem... here's why it matters... here's the breakthrough"
- Keep energy HIGH — short sentences, active voice, conversational tone
- End with a clear takeaway that makes the viewer feel smarter
- Target audience: developers who want to stay current but don't have time to read everything

Script format: 60-90 second explainer videos. Think TikTok/YouTube Shorts energy with real educational depth.

CodingCat.dev covers: React, Next.js, TypeScript, Svelte, web APIs, CSS, Node.js, cloud services, AI/ML for developers, and web platform updates.`;

function buildEnrichmentPrompt(
  doc: PipelineDoc,
  research: ResearchPayload,
): string {
  const existingScript = doc.script
    ? JSON.stringify(doc.script, null, 2)
    : 'No existing script';

  let researchContext = '';
  researchContext += `### Briefing\n${research.briefing}\n\n`;

  if (research.talkingPoints.length > 0) {
    researchContext += `### Key Talking Points\n${research.talkingPoints.map((tp, i) => `${i + 1}. ${tp}`).join('\n')}\n\n`;
  }

  if (research.codeExamples.length > 0) {
    researchContext += `### Code Examples (use these in "code" scenes)\n`;
    for (const ex of research.codeExamples.slice(0, 5)) {
      researchContext += `\`\`\`${ex.language}\n${ex.snippet}\n\`\`\`\nContext: ${ex.context}\n\n`;
    }
  }

  if (research.comparisonData && research.comparisonData.length > 0) {
    researchContext += `### Comparison Data (use in "comparison" scenes)\n`;
    for (const comp of research.comparisonData) {
      researchContext += `${comp.leftLabel} vs ${comp.rightLabel}:\n`;
      for (const row of comp.rows) {
        researchContext += `  - ${row.left} | ${row.right}\n`;
      }
      researchContext += '\n';
    }
  }

  if (research.sceneHints.length > 0) {
    researchContext += `### Scene Type Suggestions\n`;
    for (const hint of research.sceneHints) {
      researchContext += `- ${hint.suggestedSceneType}: ${hint.reason}\n`;
    }
  }

  if (research.infographicUrls && research.infographicUrls.length > 0) {
    researchContext += `\n### Infographics Available (${research.infographicUrls.length})\nMultiple infographics have been generated for this topic. Use sceneType "narration" with bRollUrl pointing to an infographic for visual scenes.\n`;
  }

  return `You have an existing video script for "${doc.title}" and new deep research data.
Re-write the script to be MORE accurate, MORE insightful, and MORE engaging using the research.

## Existing Script
${existingScript}

## Research Data (use this to create an informed, accurate script)
${researchContext}

Re-generate the complete video script as JSON. Keep the same format but enrich it with research insights.

## Scene Types
Each scene MUST have a "sceneType" that determines its visual treatment:
- **"code"** — code snippets, API usage, config files. Provide actual code in the "code" field.
- **"list"** — enumerated content: "Top 5 features", key takeaways. Provide items in the "list" field.
- **"comparison"** — A-vs-B content. Provide structured data in the "comparison" field.
- **"mockup"** — UI, website, app screen, or terminal output. Provide device type and content in the "mockup" field.
- **"narration"** — conceptual explanations, introductions, or transitions. Default/fallback.

## JSON Schema
Return ONLY a JSON object:
{
  "title": "string - catchy video title",
  "summary": "string - 1-2 sentence summary",
  "sourceUrl": "string - URL of the primary source",
  "topics": ["string array of relevant tags"],
  "script": {
    "hook": "string - attention-grabbing opening line (5-10 seconds)",
    "scenes": [
      {
        "sceneNumber": 1,
        "sceneType": "code | list | comparison | mockup | narration",
        "narration": "string - what the narrator says",
        "visualDescription": "string - what to show on screen",
        "bRollKeywords": ["keyword1", "keyword2"],
        "durationEstimate": 15,
        "code": { "snippet": "string", "language": "string", "highlightLines": [1, 3] },
        "list": { "items": ["Item 1", "Item 2"], "icon": "🚀" },
        "comparison": { "leftLabel": "A", "rightLabel": "B", "rows": [{ "left": "...", "right": "..." }] },
        "mockup": { "deviceType": "browser | phone | terminal", "screenContent": "..." },
        "imagePrompts": ["Infographic 2D architecture style, black background. [specific visual for this scene]. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations."]
      }
    ],
    "cta": "string - call to action"
  },
  "qualityScore": 75
}

Requirements:
- 3-5 scenes totaling 60-90 seconds
- Use at least 2 different scene types
- Each scene MUST include 2-5 imagePrompts following this exact template: "Infographic 2D architecture style, black background. [specific visual]. Highlighted elements filled with #15b27b. White lines connecting components and white text annotations."
- imagePrompts should describe specific 2D infographic visuals that illustrate the narration content
- Do NOT include any script text, titles, or word overlays in the video. The narration audio carries all words.
- Think of each imagePrompt as a frame that will be shown for 3-5 seconds while the narration plays
- Include REAL code snippets from the research where applicable
- The qualityScore should be your honest self-assessment (0-100)
- Return ONLY the JSON object, no markdown or extra text`;
}

// ---------------------------------------------------------------------------
// Claude Critic (optional — degrades gracefully without ANTHROPIC_API_KEY)
// ---------------------------------------------------------------------------

async function claudeCritic(script: EnrichedScript): Promise<CriticResult> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return { score: script.qualityScore, issues: [], summary: 'No critic available' };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a quality reviewer for short-form educational video scripts about web development.

Review this video script and provide a JSON response with:
- "score": number 0-100 (overall quality rating)
- "issues": string[] (list of specific problems, if any)
- "summary": string (brief overall assessment)

Evaluate based on:
1. Educational value — does it teach something useful?
2. Engagement — is the hook compelling? Is the pacing good?
3. Accuracy — are there any technical inaccuracies?
4. Clarity — is the narration clear and concise?
5. Visual direction — are the visual descriptions actionable?

Script to review:
${JSON.stringify(script, null, 2)}

Respond with ONLY the JSON object.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.warn(`[check-research] Claude critic failed: ${res.status}`);
      return { score: script.qualityScore, issues: [], summary: 'Critic API error' };
    }

    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data.content?.[0]?.text ?? '{}';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { score: script.qualityScore, issues: [], summary: 'Could not parse critic response' };
    }

    const parsed = JSON.parse(jsonMatch[0]) as CriticResult;
    return {
      score: typeof parsed.score === 'number' ? parsed.score : script.qualityScore,
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary : 'No summary',
    };
  } catch (err) {
    console.warn('[check-research] Claude critic error:', err);
    return { score: script.qualityScore, issues: [], summary: 'Critic error' };
  }
}

// ---------------------------------------------------------------------------
// Research payload builder
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

function extractCodeExamples(text: string): Array<{ snippet: string; language: string; context: string }> {
  const examples: Array<{ snippet: string; language: string; context: string }> = [];
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

function classifyScene(
  content: string,
): 'narration' | 'code' | 'list' | 'comparison' | 'mockup' {
  if (
    /```[\s\S]*?```/.test(content) ||
    /^\s{2,}(const|let|var|function|import|export|class|def|return)\b/m.test(content)
  ) {
    return 'code';
  }
  const listMatches = content.match(/^[\s]*[-•*\d]+[.)]\s/gm);
  if (listMatches && listMatches.length >= 3) {
    return 'list';
  }
  if (
    /\bvs\.?\b/i.test(content) ||
    /\bcompare[ds]?\b/i.test(content) ||
    /\bdifference[s]?\b/i.test(content) ||
    /\bpros\s+(and|&)\s+cons\b/i.test(content)
  ) {
    return 'comparison';
  }
  if (
    /\b(UI|interface|dashboard|screen|layout|component|widget|button|modal)\b/i.test(content)
  ) {
    return 'mockup';
  }
  return 'narration';
}

function classifySourceType(url: string): 'youtube' | 'article' | 'docs' | 'unknown' {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('/docs') || lower.includes('documentation') || lower.includes('developer.') || lower.includes('mdn')) return 'docs';
  if (lower.includes('blog') || lower.includes('medium.com') || lower.includes('dev.to') || lower.includes('hashnode')) return 'article';
  return 'unknown';
}

function buildResearchPayload(
  doc: PipelineDoc,
  researchData: Record<string, unknown>,
): ResearchPayload {
  // If researchData already has the full ResearchPayload shape, use it directly
  if (researchData.topic && researchData.talkingPoints && researchData.sceneHints) {
    return researchData as unknown as ResearchPayload;
  }

  // Legacy format: extract from briefing + sources
  const briefing = (researchData.briefing as string) ?? '';
  const sources = (researchData.sources as Array<{ url: string; title: string }>) ?? [];
  const infographicUrls = (researchData.infographicUrls as string[]) ?? [];

  const talkingPoints = extractTalkingPoints(briefing);
  const codeExamples = extractCodeExamples(briefing);

  const sections = briefing
    .split(/\n(?=#{1,3}\s)|\n\n/)
    .filter((s) => s.trim().length > 50);
  const sceneHints = sections.map((section) => ({
    content: section.slice(0, 500),
    suggestedSceneType: classifyScene(section),
    reason: 'Classified from research content',
  }));

  return {
    topic: doc.title,
    notebookId: doc.researchNotebookId || '',
    createdAt: doc._updatedAt,
    completedAt: new Date().toISOString(),
    sources: sources.map((s) => ({
      title: s.title,
      url: s.url,
      type: classifySourceType(s.url),
    })),
    briefing,
    talkingPoints,
    codeExamples,
    sceneHints,
    infographicUrls: infographicUrls.length > 0 ? infographicUrls : undefined,
  };
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // Auth: fail-closed — if CRON_SECRET is not set, reject
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[check-research] CRON_SECRET not configured');
    return Response.json({ error: 'Server misconfigured' }, { status: 503 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error('[check-research] Unauthorized request');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sanity = getSanityWriteClient();

    // Single query for all active pipeline statuses
    // Include both researchInteractionId (new Gemini) and researchNotebookId (legacy)
    const docs = await sanity.fetch<PipelineDoc[]>(
      `*[_type == "automatedVideo" && status in ["researching", "research_complete", "infographics_generating", "enriching"] && (defined(researchInteractionId) || defined(researchNotebookId))] {
        _id, title, status, researchInteractionId, researchNotebookId, trendScore, trendSources,
        script, researchData, _updatedAt
      }`,
    );

    console.log(`[check-research] Found ${docs.length} docs in pipeline`);

    if (docs.length === 0) {
      return Response.json({ success: true, message: 'No docs to process', results: [] });
    }

    const results: StepResult[] = [];

    // Phase 1: Stuck detection — runs FIRST, no external API calls
    const stuckThresholds = await buildStuckThresholds();
    const stuckResults = await flagStuckDocs(docs, sanity, stuckThresholds);
    results.push(...stuckResults);

    // Remove flagged docs from further processing
    const stuckIds = new Set(stuckResults.map((r) => r.id));
    const activeDocs = docs.filter((d) => !stuckIds.has(d._id));

    // Group by status
    const researching = activeDocs.filter((d) => d.status === 'researching');
    const researchComplete = activeDocs.filter((d) => d.status === 'research_complete');
    const infographicsGenerating = activeDocs.filter((d) => d.status === 'infographics_generating');
    const enriching = activeDocs.filter((d) => d.status === 'enriching');

    console.log(
      `[check-research] Pipeline: ${researching.length} researching, ${researchComplete.length} research_complete, ${infographicsGenerating.length} infographics_generating, ${enriching.length} enriching`,
    );

    // Check enableDeepResearch toggle
    const enableDeepResearch = await getConfigValue('pipeline_config', 'enableDeepResearch', false);

    // Step 1: researching → research_complete
    if (!enableDeepResearch) {
      // Deep research disabled — skip researching docs to enriching
      for (const doc of researching.slice(0, MAX_DOCS_PER_STATUS)) {
        try {
          await sanity.patch(doc._id).set({ status: doc.script ? 'script_ready' : 'enriching' }).commit();
          results.push({ id: doc._id, title: doc.title, step: 'researching', outcome: 'deep_research_disabled_skip' });
        } catch (err) {
          console.error(`[check-research] Error skipping researching doc ${doc._id}:`, err);
          results.push({
            id: doc._id,
            title: doc.title,
            step: 'researching',
            outcome: 'error',
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    } else {
      for (const doc of researching.slice(0, MAX_DOCS_PER_STATUS)) {
        try {
          const result = await stepResearching(doc, sanity);
          results.push(result);
        } catch (err) {
          console.error(`[check-research] Error in stepResearching for ${doc._id}:`, err);
          results.push({
            id: doc._id,
            title: doc.title,
            step: 'researching',
            outcome: 'error',
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    // Step 2: research_complete → enriching (infographics generated inline)
    for (const doc of researchComplete.slice(0, MAX_DOCS_PER_STATUS)) {
      try {
        const result = await stepResearchComplete(doc, sanity);
        results.push(result);
      } catch (err) {
        console.error(`[check-research] Error in stepResearchComplete for ${doc._id}:`, err);
        results.push({
          id: doc._id,
          title: doc.title,
          step: 'research_complete',
          outcome: 'error',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // Step 3: infographics_generating → enriching (legacy migration only)
    for (const doc of infographicsGenerating.slice(0, MAX_DOCS_PER_STATUS)) {
      try {
        const result = await stepInfographicsGenerating(doc, sanity);
        results.push(result);
      } catch (err) {
        console.error(`[check-research] Error in stepInfographicsGenerating for ${doc._id}:`, err);
        results.push({
          id: doc._id,
          title: doc.title,
          step: 'infographics_generating',
          outcome: 'error',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // Step 4: enriching → script_ready
    for (const doc of enriching.slice(0, MAX_DOCS_PER_STATUS)) {
      try {
        const result = await stepEnriching(doc, sanity);
        results.push(result);
      } catch (err) {
        console.error(`[check-research] Error in stepEnriching for ${doc._id}:`, err);
        results.push({
          id: doc._id,
          title: doc.title,
          step: 'enriching',
          outcome: 'error',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    console.log(`[check-research] Run complete: ${results.length} results`);
    return Response.json({ success: true, results });
  } catch (err) {
    console.error('[check-research] Unexpected error:', err);
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
