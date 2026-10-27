/**
 * Bundles CodingCat.dev skills (SKILL.md + all references/*.md + tokens/tokens.json)
 * into standalone Markdown bundle files in dist/gemini-web-skills/ so they can be
 * pasted or uploaded directly into Gemini Web Saved Skills / Gems.
 *
 * Usage:
 *   node --experimental-strip-types scripts/bundle-gemini-skills.ts
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const SKILLS_DIR = join(REPO_ROOT, "skills");
const TOKENS_DIR = join(REPO_ROOT, "tokens");
const OUT_DIR = join(REPO_ROOT, "dist", "gemini-web-skills");

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
      parts.push(`\n---\n\n<!-- Reference: references/${refFile} -->\n\n${refContent}`);
    }
  }

  if (skillName === "codingcat-design-system") {
    const tokensJsonPath = join(TOKENS_DIR, "tokens.json");
    const themeCssPath = join(TOKENS_DIR, "theme.css");
    if (statSync(tokensJsonPath, { throwIfNoEntry: false })?.isFile()) {
      parts.push(
        `\n---\n\n## Bundled W3C Design Tokens (tokens/tokens.json)\n\n\`\`\`json\n${readFileSync(tokensJsonPath, "utf8").trim()}\n\`\`\``
      );
    }
    if (statSync(themeCssPath, { throwIfNoEntry: false })?.isFile()) {
      parts.push(
        `\n---\n\n## Bundled Tailwind CSS v4 Theme (tokens/theme.css)\n\n\`\`\`css\n${readFileSync(themeCssPath, "utf8").trim()}\n\`\`\``
      );
    }
  }

  return `${parts.join("\n")}\n`;
}

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true });

  const skills = readdirSync(SKILLS_DIR).filter((name) =>
    statSync(join(SKILLS_DIR, name)).isDirectory()
  );

  const masterParts: string[] = [
    "# CodingCat.dev Complete Agent Toolkit Bundle (Gemini Web Master Skill)\n",
  ];

  for (const skill of skills) {
    const bundled = bundleSkill(skill);
    const outFile = join(OUT_DIR, `${skill}.bundle.md`);
    writeFileSync(outFile, bundled, "utf8");
    masterParts.push(bundled);
    console.log(`[bundle-gemini-skills] Wrote ${outFile}`);
  }

  const masterOutFile = join(OUT_DIR, "codingcatdev-complete-toolkit.bundle.md");
  writeFileSync(masterOutFile, masterParts.join("\n\n===\n\n"), "utf8");
  console.log(`[bundle-gemini-skills] Wrote master bundle ${masterOutFile}`);
}

main();
