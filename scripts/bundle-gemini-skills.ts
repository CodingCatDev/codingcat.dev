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
2. Hand-Drawn Diagram Mechanics (Rough.js / Excalidraw look): Every diagram box, document card (with folded top-right corner), and boundary container is drawn with TWO slightly offset, overlapping, hand-drawn sketchy white or soft lavender marker strokes (double-stroked wobble). Box interiors use visible 45-degree diagonal parallel marker hatch lines (hachure cross-hatching) in deep purple, dark slate, or brand orange, never solid gradients.
3. Diagram Layout & Labels: Maximum 3 to 5 boxes flowing left-to-right connected by thick, sketchy, double-stroked white hand-drawn arrows. Left cluster shows the old painful anti-pattern slashed with a large sketchy Coral Red X mark and an ALL-CAPS marker caption (e.g., "DUPLICATES"). Right cluster shows the modern pattern topped with a bright sketchy Electric Lime / Mint Green checkmark and an ALL-CAPS marker caption (e.g., "DYNAMIC"). All text uses clean, legible white hand-drawn marker handwriting (Virgil font style), strictly 1 to 3 words per box. Never print hex codes as text on the image.
4. Presenter Likeness (@alex.patterson): When a presenter cutout or video is requested, depict Alex Patterson (Caucasian man in his mid-40s, short styled light-brown hair, warm blue-green eyes, neatly trimmed salt-and-pepper beard, NO glasses, black crew-neck t-shirt, sleek round black Pixel Watch on left wrist, bare right wrist, no rings). In 16:9 thumbnails, lock Alex strictly to the Left Third or Right Third with a colored sketch rim-light, ensuring zero overlap with any diagram boxes or text.
5. Editorial Voice: Direct, pragmatic Senior Solutions Engineer tone. Never use em-dashes anywhere. Always use Markdown tables when comparing two or more tools, frameworks, or architectural patterns.
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
}

main();
