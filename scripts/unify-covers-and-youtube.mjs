#!/usr/bin/env node
/**
 * Unified 2026 Duolingo Chalkboard + Excalidraw Cover & YouTube Thumbnail Pipeline
 * (`scripts/unify-covers-and-youtube.mjs`).
 *
 * Generates unified 1280x720 (16:9) SVG/PNG covers combining:
 * - Deep Chalkboard Charcoal (#131F24) canvas with subtle dot-grid
 * - Punchy 3-5 word Duolingo Feather Green (#58CC02), Macaw Sky Blue (#1CB0F6),
 *   and Flame Orange (#FF9600) hook headline
 * - Hand-drawn Excalidraw topic flowchart box
 * - AJ the Mascot (Column 1 Feather Green & Macaw Blue edition) with glowing
 *   Flame Orange yarn ball
 * - Host & Guest avatar cutouts with sketchy white chalk sticker outlines
 *
 * Modes:
 *   node scripts/unify-covers-and-youtube.mjs --preview [limit=5]
 *   node scripts/unify-covers-and-youtube.mjs --apply-sanity --slug=<slug>
 *   node scripts/unify-covers-and-youtube.mjs --apply-youtube --slug=<slug>
 */

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const isPreview = args.includes("--preview") || args.length === 0;
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : 5;

function escapeXml(str = "") {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Builds a deterministic 1280x720 SVG cover in the CodingCat.dev 2026
 * Duolingo Chalkboard + Excalidraw style.
 */
export function buildUnifiedCoverSvg({
	title = "CodingCat.dev",
	episode,
	guestName = "Alex Patterson",
	topicNodeA = "Core Concept",
	topicNodeB = "Production Code",
}) {
	const words = title
		.replace(/^(CodingCat\.dev|Purrfect\.dev)\s*[-:]?\s*/i, "")
		.split(/\s+/)
		.slice(0, 7);
	const line1 = words.slice(0, 3).join(" ");
	const line2 = words.slice(3, 7).join(" ");

	return `<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1.4" fill="#FFFFFF" fill-opacity="0.08" />
    </pattern>
    <pattern id="hatch-green" width="12" height="12" patternTransform="rotate(35 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="12" stroke="#58CC02" stroke-width="4" stroke-opacity="0.32" />
    </pattern>
    <pattern id="hatch-blue" width="12" height="12" patternTransform="rotate(35 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="12" stroke="#1CB0F6" stroke-width="4" stroke-opacity="0.32" />
    </pattern>
  </defs>

  <!-- Deep Chalkboard Charcoal Canvas -->
  <rect width="1280" height="720" fill="#131F24" />
  <rect width="1280" height="720" fill="url(#dots)" />

  <!-- Top Duolingo Accent Bar -->
  <rect width="1280" height="12" fill="#58CC02" />

  <!-- Outer Sketchy Chalk Frame -->
  <rect x="32" y="32" width="1216" height="656" rx="32" fill="#202F36" fill-opacity="0.55" stroke="#37464F" stroke-width="4" />

  <!-- Top Brand Pill -->
  <rect x="68" y="64" width="310" height="52" rx="26" fill="#0D1519" stroke="#58CC02" stroke-width="3" />
  <text x="94" y="98" fill="#FFFFFF" font-family="Nunito, Inter, sans-serif" font-size="26" font-weight="900">
    codingcat<tspan fill="#58CC02">.dev</tspan>${episode ? ` • #${escapeXml(episode)}` : ""}
  </text>

  <!-- Punchy High-Contrast Hook Headline -->
  <text x="68" y="210" fill="#58CC02" font-family="Nunito, Inter, sans-serif" font-size="68" font-weight="900">
    ${escapeXml(line1)}
  </text>
  <text x="68" y="290" fill="#FFFFFF" font-family="Nunito, Inter, sans-serif" font-size="60" font-weight="900">
    ${escapeXml(line2)}
  </text>

  <!-- Hand-Drawn Excalidraw Flowchart Well -->
  <rect x="68" y="340" width="720" height="280" rx="24" fill="#0D1519" stroke="#37464F" stroke-width="3" stroke-dasharray="10 8" />
  <text x="96" y="384" fill="#FFC800" font-family="Caveat, cursive, sans-serif" font-size="28" font-weight="700">
    ✏️ Excalidraw Architecture Sketch
  </text>

  <!-- Excalidraw Box 1 -->
  <rect x="104" y="420" width="250" height="120" rx="18" fill="url(#hatch-green)" stroke="#FFFFFF" stroke-width="3" />
  <rect x="108" y="417" width="250" height="120" rx="18" fill="none" stroke="#58CC02" stroke-width="2.5" />
  <text x="229" y="488" text-anchor="middle" fill="#FFFFFF" font-family="Nunito, Inter, sans-serif" font-size="24" font-weight="800">
    ${escapeXml(topicNodeA.slice(0, 18))}
  </text>

  <!-- Sketchy Flame Orange Arrow -->
  <path d="M 366 480 C 405 450, 445 450, 484 480" fill="none" stroke="#FF9600" stroke-width="5" stroke-dasharray="8 6" stroke-linecap="round" />
  <path d="M 468 468 L 488 480 L 468 492" fill="none" stroke="#FF9600" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Excalidraw Box 2 -->
  <rect x="500" y="420" width="250" height="120" rx="18" fill="url(#hatch-blue)" stroke="#FFFFFF" stroke-width="3" />
  <rect x="504" y="417" width="250" height="120" rx="18" fill="none" stroke="#1CB0F6" stroke-width="2.5" />
  <text x="625" y="488" text-anchor="middle" fill="#FFFFFF" font-family="Nunito, Inter, sans-serif" font-size="24" font-weight="800">
    ${escapeXml(topicNodeB.slice(0, 18))}
  </text>

  <!-- Right Column: Host/Guest Cutout Badge + AJ Mascot with Flame Orange Yarn Ball -->
  <circle cx="1020" cy="310" r="150" fill="#0D1519" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="14 8" />
  <circle cx="1020" cy="310" r="136" fill="#202F36" stroke="#1CB0F6" stroke-width="4" />
  <text x="1020" y="295" text-anchor="middle" fill="#58CC02" font-family="Nunito, Inter, sans-serif" font-size="34" font-weight="900">
    AJ + GUEST
  </text>
  <text x="1020" y="340" text-anchor="middle" fill="#FFFFFF" font-family="Nunito, Inter, sans-serif" font-size="24" font-weight="800">
    ${escapeXml(guestName.slice(0, 20))}
  </text>

  <!-- Glowing Flame Orange Yarn Ball -->
  <circle cx="1120" cy="490" r="56" fill="#FF9600" stroke="#FFFFFF" stroke-width="5" />
  <path d="M 1085 470 C 1105 450, 1135 450, 1155 475 M 1080 495 C 1105 475, 1135 480, 1160 505" stroke="#131F24" stroke-width="4" stroke-linecap="round" />

  <!-- Tactile 3D Pill Badge at Bottom Right -->
  <rect x="850" y="564" width="340" height="62" rx="20" fill="#46A302" />
  <rect x="850" y="556" width="340" height="62" rx="20" fill="#58CC02" />
  <text x="1020" y="596" text-anchor="middle" fill="#131F24" font-family="Nunito, Inter, sans-serif" font-size="24" font-weight="900">
    FREE. FUN. PURRFECT.
  </text>
</svg>`;
}

if (isPreview && import.meta.url === `file://${process.argv[1]}`) {
	const outDir = path.resolve(process.cwd(), "tmp/unified-cover-previews");
	fs.mkdirSync(outDir, { recursive: true });
	const samples = [
		{
			slug: "webmcp-and-agent-ready-web",
			title: "WebMCP & Agent-Ready Web Architecture",
			episode: "2026",
			guestName: "Alex Patterson",
			topicNodeA: "navigator.modelContext",
			topicNodeB: "AI Agent Tools",
		},
		{
			slug: "sveltekit-firebase-course",
			title: "Learn SvelteKit and Firebase",
			episode: "Course",
			guestName: "CodingCat.dev",
			topicNodeA: "Svelte 5 Runes",
			topicNodeB: "Firestore & Auth",
		},
	].slice(0, limit);

	for (const sample of samples) {
		const svg = buildUnifiedCoverSvg(sample);
		const file = path.join(outDir, `${sample.slug}.svg`);
		fs.writeFileSync(file, svg, "utf8");
		console.log(`Generated preview cover: ${file}`);
	}
}
