#!/usr/bin/env node
/**
 * CodingCat.dev AI Video Storyboard & Script Generator
 *
 * Inspired by:
 * - Better Stack: High-touch, high-pain developer problem solving (costs, downtime, benchmarks).
 * - Cleo Abram: Kinetic visual metaphors, 3-beat narrative arc, fast-paced animations, 10s curiosity hook.
 *
 * Powered by Google Gemini 1.5 Pro (via Google AI / OpenRouter).
 */

const topic = process.argv.slice(2).join(" ");

if (!topic) {
  console.log(`
Usage: node scripts/generate-video-storyboard.mjs "<Topic, Repository, or Architecture Problem>"

Example:
  node scripts/generate-video-storyboard.mjs "Dockerless Serverless GPUs: Cutting AI inference cost by 90% with RunPod Flash"
`);
  process.exit(1);
}

const openRouterKey = process.env.OPENROUTER_API_KEY;

if (!openRouterKey) {
  console.error("Error: OPENROUTER_API_KEY environment variable is required.");
  process.exit(1);
}

const SYSTEM_PROMPT = `You are the Lead Creative Director & Tech Scriptwriter for CodingCat.dev, producing top-tier developer educational videos.

Your mission is to blend two elite creator playbooks:
1. THE BETTER STACK CONTENT STRATEGY:
   - Target genuine developer pain, extreme cost optimization, performance benchmarks, and production post-mortems.
   - Ground everything in real metrics, architecture trade-offs, and actionable code.
2. THE CLEO ABRAM (Huge If True) VISUAL STYLE:
   - THE 10-SECOND HOOK: Start with a surprising contradiction, visual mystery, or bold curiosity question. Never start with "Hey guys, welcome back".
   - 3-BEAT NARRATIVE ARC:
     * Beat 1: The Frustrating Status Quo (Why the standard way is broken/expensive/slow).
     * Beat 2: The Secret Mechanism (Under the hood breakdown using visual metaphors).
     * Beat 3: The Proof & Benchmark ("Huge If True" - The live test, savings, or live demo).
   - DENSE VISUAL CHOREOGRAPHY: Never stay on talking head or a static screen for more than 4-5 seconds. Alternate with:
     * Kinetic isometric server/network diagrams
     * Code punch-ins (highlighting 2-3 key lines, not full files)
     * Side-by-side racing clocks or dollar meters
     * Tactile UI sound effects (foley pops, whooshes, mechanical keyboard clicks)

OUTPUT FORMAT:
Generate a complete, ready-to-produce production document in Markdown with the following sections:

# [Video Title: 3 High-CTR Options]

## Video Metadata
- **Target Audience:**
- **Core Frustration Solved:**
- **The "North Star" Metric:** (e.g. "$0.03 -> $0.0003 per image", "150ms -> 12ms TTFB")
- **YouTube Description & Key Moments:**

## Act 1: The 10-Second Hook (0:00 - 0:30)
Format as a 2-column table:
| Timestamp | Visual Director & Animation Notes (Cleo Style) | Spoken Audio / Voiceover | Sound Design (SFX) |

## Act 2: The Hidden Mechanism & Architecture (0:30 - 3:30)
Format as a 2-column table with precise animation prompts (e.g., Motion Canvas / Remotion code prompts, isometric SVG descriptions).

## Act 3: Live Benchmark & The Code (3:30 - 6:00)
Format as a 2-column table showing code highlights and race/cost comparison.

## Act 4: The Takeaway & Call to Action (6:00 - 7:00)
Direct punchy conclusion pointing to the canonical CodingCat.dev article and GitHub repo.

## Reusable Animation Prompts (For Motion Canvas / Remotion / After Effects)
Provide 2-3 exact TypeScript or motion graphic prompt specifications that can be fed into Motion Canvas or Remotion to generate the key graphics.
`;

async function run() {
  console.log(`\n🚀 Generating Cleo-style / Better Stack Storyboard for: "${topic}"\nUsing Gemini 1.5 Pro...\n`);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://codingcat.dev",
        "X-Title": "CodingCat Video Storyboard Generator",
      },
      body: JSON.stringify({
        model: "google/gemini-pro-1.5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Create a complete video storyboard and script for: ${topic}` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    console.log(result);
  } catch (err) {
    console.error("Generation failed:", err.message);
    process.exit(1);
  }
}

run();
