/**
 * Bundles CodingCat.dev skills (SKILL.md + all references/*.md + tokens/tokens.json)
 * into standalone Markdown bundle files (.bundle.md) AND uploadable Gemini App
 * Skill archives (.skill.zip) in dist/gemini-web-skills/.
 *
 * Usage:
 *   node --experimental-strip-types scripts/bundle-gemini-skills.ts
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const SKILLS_DIR = join(REPO_ROOT, "skills");
const TOKENS_DIR = join(REPO_ROOT, "tokens");
const OUT_DIR = join(REPO_ROOT, "dist", "gemini-web-skills");

const GEMINI_STYLE_PRESET = `Always render visuals and copy in the CodingCat.dev Dark Whiteboard & Studio aesthetic:
1. Dark Whiteboard Diagram Canvas: Flat 2D pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern. Zero 3D perspective, zero isometric angles, zero glossy bevels or drop shadows on diagram boxes.
2. Hand-Drawn Diagram Mechanics (Rough.js / Excalidraw look): Every diagram box, UML class compartment, cylinder store, decision diamond, and layer container is drawn with TWO slightly offset, overlapping, hand-drawn sketchy white or soft lavender marker strokes (double-stroked wobble). Box interiors use visible 45-degree diagonal parallel marker hatch lines (hachure cross-hatching) in deep purple, sky blue, emerald green, or gold, never solid gradients.
3. Content-Driven Diagram Topology (12 Archetypes - Never Default Every Diagram to X vs. Checkmark): Select the exact diagram archetype that fits the technical topic:
   - sequence: UML Sequence Diagram with top participant boxes, vertical dashed lifelines, activation bars, and loop/alt fragment frames.
   - uml-class: 3-Compartment UML Class & Rig Hierarchy Diagram («stereotype» ClassName | + fields | + methods) with diamond composition and hollow triangle inheritance arrows.
   - state-machine: UML State Machine & Feedback Loop with initial bullseye dot, 4 rounded states, central decision diamond, and [guard] transition pills.
   - layered-stack: 3 horizontal system tier bands (LAYER 1..3) with inner component pills and vertical protocol arrows.
   - pipeline: 4-stage left-to-right dataflow pipeline with a 3D cylinder database store and decision diamond gate (zero Coral X or checkmark).
   - erd: Crow's Foot Entity-Relationship Diagram with PK/FK/UK badges and 1:N cardinality connectors.
   - c4-context: C4 Container & Trust-Boundary Diagram with dashed boundary containers (Browser Sandbox, Edge Isolate, Data Plane) and mTLS/RPC crossings.
   - swimlane: UML Activity Swimlane Diagram with parallel actor/service lanes and cross-lane handoff arrows.
   - timeline-gantt: Millisecond Latency & Streaming Waterfall Timeline comparing blocking stalls vs. parallel sub-5ms streams.
   - tree-graph: Hierarchical AST, DOM, Server Island, or Git DAG tree with root, branch, and leaf nodes.
   - quadrant-matrix: 2x2 Architectural Trade-Off Quadrant with intersecting X/Y axes and 4 plotted quadrants.
   - comparison: Anti-Pattern (Coral Red X) vs. Recommended (Electric Lime Checkmark), reserved strictly for explicit myth-busting comparisons.
   All text uses clean, legible white hand-drawn marker handwriting (Virgil font style), strictly fitting inside box bounds. Never print hex codes as text on the image.
4. Presenter Likeness (@alex.patterson): When a presenter cutout or video is requested, depict Alex Patterson (Caucasian man in his mid-40s, short styled light-brown hair, warm blue-green eyes, neatly trimmed salt-and-pepper beard, NO glasses, fitted matte-black crew-neck t-shirt with the screen-printed CodingCat.dev AJ the Cat headphone mascot logo on the center chest, sleek round black Pixel Watch on left wrist, bare right wrist, no rings). In 16:9 thumbnails, overlay Alex's unclipped cutout cleanly on top (z-index: 20) in the Left Third or Right Third with a colored studio rim-light.
5. Editorial Voice: Direct, pragmatic Senior Solutions Architect tone. Never use em-dashes anywhere. Always use Markdown tables when comparing two or more tools, frameworks, or architectural patterns.
`;

function bundleSkill(skillName: string): string {
	const skillPath = join(SKILLS_DIR, skillName);
	const skillMdPath = join(skillPath, "SKILL.md");
	const refsDir = join(skillPath, "references");

	const parts: string[] = [];
	parts.push(`<!-- Bundled Gemini Web Skill: ${skillName} -->`);
	parts.push(readFileSync(skillMdPath, "utf8").trim());

	if (statSync(refsDir, { throwIfNoEntry: false })?.isDirectory()) {
		const refFiles = readdirSync(refsDir)
			.filter((f) => f.endsWith(".md"))
			.sort();

		for (const refFile of refFiles) {
			const refContent = readFileSync(join(refsDir, refFile), "utf8").trim();
			parts.push(
				`\n---\n\n<!-- Reference: references/${refFile} -->\n\n${refContent}`,
			);
		}
	}

	if (skillName === "codingcat-design-system") {
		const tokensJsonPath = join(TOKENS_DIR, "tokens.json");
		const themeCssPath = join(TOKENS_DIR, "theme.css");
		if (statSync(tokensJsonPath, { throwIfNoEntry: false })?.isFile()) {
			parts.push(
				`\n---\n\n## Bundled W3C Design Tokens (tokens/tokens.json)\n\n\`\`\`json\n${readFileSync(tokensJsonPath, "utf8").trim()}\n\`\`\``,
			);
		}
		if (statSync(themeCssPath, { throwIfNoEntry: false })?.isFile()) {
			parts.push(
				`\n---\n\n## Bundled Tailwind CSS v4 Theme (tokens/theme.css)\n\n\`\`\`css\n${readFileSync(themeCssPath, "utf8").trim()}\n\`\`\``,
			);
		}
	}

	return `${parts.join("\n")}\n`;
}

function zipSkill(skillName: string): void {
	const skillPath = join(SKILLS_DIR, skillName);
	const zipOutFile = join(OUT_DIR, `${skillName}.skill.zip`);
	rmSync(zipOutFile, { force: true });
	const entries = ["SKILL.md", "references"];
	if (statSync(join(skillPath, "assets"), { throwIfNoEntry: false })?.isDirectory()) {
		entries.push("assets");
	}
	try {
		execFileSync("zip", ["-rq", zipOutFile, ...entries], {
			cwd: skillPath,
		});
		console.log(`[bundle-gemini-skills] Wrote ${zipOutFile}`);
	} catch (err) {
		console.warn(`[bundle-gemini-skills] Could not zip ${skillName}:`, err);
	}
}

function main(): void {
	mkdirSync(OUT_DIR, { recursive: true });

	const skills = readdirSync(SKILLS_DIR).filter((name) =>
		statSync(join(SKILLS_DIR, name)).isDirectory(),
	);

	const masterParts: string[] = [
		"# CodingCat.dev Complete Agent Toolkit Bundle (Gemini Web Master Skill)\n",
	];

	for (const skill of skills) {
		const bundled = bundleSkill(skill);
		const outFile = join(OUT_DIR, `${skill}.bundle.md`);
		writeFileSync(outFile, bundled, "utf8");
		zipSkill(skill);
		masterParts.push(bundled);
		console.log(`[bundle-gemini-skills] Wrote ${outFile}`);
	}

	const masterOutFile = join(OUT_DIR, "codingcatdev-complete-toolkit.bundle.md");
	writeFileSync(masterOutFile, masterParts.join("\n\n===\n\n"), "utf8");
	console.log(`[bundle-gemini-skills] Wrote master bundle ${masterOutFile}`);

	const styleOutFile = join(OUT_DIR, "codingcat-gemini-style.txt");
	writeFileSync(styleOutFile, GEMINI_STYLE_PRESET, "utf8");
	console.log(`[bundle-gemini-skills] Wrote Gemini Style preset ${styleOutFile}`);

	// Build a single all-in-one Master Skill Zip (codingcatdev-complete-toolkit.skill.zip)
	// that can be uploaded directly to Gemini Web (gemini.google.com) with all instructions,
	// references, W3C tokens, 12-archetype diagram templates, AJ mascot assets, and Alex reaction poses.
	const tmpMasterDir = "/tmp/codingcatdev-master-skill-staging";
	rmSync(tmpMasterDir, { recursive: true, force: true });
	mkdirSync(join(tmpMasterDir, "references"), { recursive: true });
	mkdirSync(join(tmpMasterDir, "assets"), { recursive: true });
	mkdirSync(join(tmpMasterDir, "tokens"), { recursive: true });

	const masterSkillFrontmatter = `---
name: codingcatdev-complete-studio
description: Complete CodingCat.dev Master Skill for Alex Patterson (@alex.patterson). Automatically handles voice & copy (zero em-dashes, mandatory Markdown comparison tables/Tier Lists), 12-archetype dark-mode whiteboard & UML diagrams (Sequence, UML Class, State Machine, Layered Stack, Pipeline, Crow's Foot ERD, C4 Trust Boundaries, Swimlanes, Latency Waterfall, AST/Island Tree, 2x2 Quadrant, and Comparison), 16:9 YouTube thumbnails with unclipped Alex cutouts wearing the AJ the Cat t-shirt, AJ mascot prompts, W3C design system tokens, and Veo 3.1 / Remotion / HyperFrames video walkthroughs.
---

`;
	writeFileSync(
		join(tmpMasterDir, "SKILL.md"),
		masterSkillFrontmatter +
			[
				readFileSync(join(SKILLS_DIR, "codingcat-media-studio", "SKILL.md"), "utf8").replace(/^---[\s\S]*?---\s*/, ""),
				readFileSync(join(SKILLS_DIR, "codingcat-excalidraw-diagrams", "SKILL.md"), "utf8").replace(/^---[\s\S]*?---\s*/, ""),
				readFileSync(join(SKILLS_DIR, "alex-voice-and-copy", "SKILL.md"), "utf8").replace(/^---[\s\S]*?---\s*/, ""),
				readFileSync(join(SKILLS_DIR, "codingcat-design-system", "SKILL.md"), "utf8").replace(/^---[\s\S]*?---\s*/, ""),
				readFileSync(join(SKILLS_DIR, "codingcat-video-walkthrough-studio", "SKILL.md"), "utf8").replace(/^---[\s\S]*?---\s*/, ""),
			].join("\n\n---\n\n"),
		"utf8",
	);

	for (const coreSkill of [
		"alex-voice-and-copy",
		"codingcat-design-system",
		"codingcat-media-studio",
		"codingcat-excalidraw-diagrams",
		"codingcat-video-walkthrough-studio",
	]) {
		const rDir = join(SKILLS_DIR, coreSkill, "references");
		if (statSync(rDir, { throwIfNoEntry: false })?.isDirectory()) {
			for (const rf of readdirSync(rDir).filter((f) => f.endsWith(".md"))) {
				writeFileSync(join(tmpMasterDir, "references", rf), readFileSync(join(rDir, rf)));
			}
		}
	}

	const mediaAssetsDir = join(SKILLS_DIR, "codingcat-media-studio", "assets");
	if (statSync(mediaAssetsDir, { throwIfNoEntry: false })?.isDirectory()) {
		for (const af of readdirSync(mediaAssetsDir)) {
			writeFileSync(join(tmpMasterDir, "assets", af), readFileSync(join(mediaAssetsDir, af)));
		}
	}

	for (const tf of ["tokens.json", "theme.css"]) {
		const tp = join(TOKENS_DIR, tf);
		if (statSync(tp, { throwIfNoEntry: false })?.isFile()) {
			writeFileSync(join(tmpMasterDir, "tokens", tf), readFileSync(tp));
		}
	}

	const masterZipOutFile = join(OUT_DIR, "codingcatdev-complete-toolkit.skill.zip");
	rmSync(masterZipOutFile, { force: true });
	execFileSync("zip", ["-rq", masterZipOutFile, "SKILL.md", "references", "assets", "tokens"], {
		cwd: tmpMasterDir,
	});
	rmSync(tmpMasterDir, { recursive: true, force: true });
	console.log(`[bundle-gemini-skills] Wrote Master Skill Zip ${masterZipOutFile}`);
}

main();
