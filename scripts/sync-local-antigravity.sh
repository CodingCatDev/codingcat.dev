#!/usr/bin/env bash
set -euo pipefail

# CodingCat.dev Agent Toolkit & Design System Local Sync Script
# Syncs skills, tokens, assets, and MCP server across:
#   1. /home/alex/codingcat.dev/.agent/skills/
#   2. ~/.gemini/skills/ (and ~/.gemini/config/skills/ if present)
#   3. ~/code/codingcatdev-agent-toolkit/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
GLOBAL_GEMINI_SKILLS="${HOME}/.gemini/skills"
GLOBAL_CONFIG_SKILLS="${HOME}/.gemini/config/skills"
WORKSPACE_AGENT_SKILLS="${REPO_ROOT}/.agent/skills"
STANDALONE_TOOLKIT="${HOME}/code/codingcatdev-agent-toolkit"

mkdir -p "${GLOBAL_GEMINI_SKILLS}"
mkdir -p "${WORKSPACE_AGENT_SKILLS}"

echo "[codingcat-toolkit] Linking skills from ${REPO_ROOT}/skills ..."
for skill_dir in "${REPO_ROOT}/skills"/*; do
  if [ -d "${skill_dir}" ]; then
    skill_name="$(basename "${skill_dir}")"
    ln -sfn "${skill_dir}" "${GLOBAL_GEMINI_SKILLS}/${skill_name}"
    ln -sfn "${skill_dir}" "${WORKSPACE_AGENT_SKILLS}/${skill_name}"
    if [ -d "${GLOBAL_CONFIG_SKILLS}" ]; then
      ln -sfn "${skill_dir}" "${GLOBAL_CONFIG_SKILLS}/${skill_name}"
    fi
    echo "  -> Linked skill: ${skill_name}"
  fi
done

echo "[codingcat-toolkit] Syncing standalone toolkit to ${STANDALONE_TOOLKIT} ..."
mkdir -p "${STANDALONE_TOOLKIT}/tokens" \
         "${STANDALONE_TOOLKIT}/assets" \
         "${STANDALONE_TOOLKIT}/skills" \
         "${STANDALONE_TOOLKIT}/scripts" \
         "${STANDALONE_TOOLKIT}/mcp-server" \
         "${STANDALONE_TOOLKIT}/.agent/skills"

if [ ! -d "${STANDALONE_TOOLKIT}/.git" ]; then
  git -C "${STANDALONE_TOOLKIT}" init -q
fi

cp -f "${REPO_ROOT}/AGENTS.md" "${STANDALONE_TOOLKIT}/AGENTS.md"
cp -f "${REPO_ROOT}/GEMINI.md" "${STANDALONE_TOOLKIT}/GEMINI.md"
cp -f "${REPO_ROOT}/DESIGN.md" "${STANDALONE_TOOLKIT}/DESIGN.md"
cp -f "${REPO_ROOT}/.cursorrules" "${STANDALONE_TOOLKIT}/.cursorrules"
cp -f "${REPO_ROOT}/plugin.json" "${STANDALONE_TOOLKIT}/plugin.json"
cp -f "${REPO_ROOT}/mcp.json" "${STANDALONE_TOOLKIT}/mcp.json"

cp -rf "${REPO_ROOT}/tokens/." "${STANDALONE_TOOLKIT}/tokens/"
cp -rf "${REPO_ROOT}/assets/." "${STANDALONE_TOOLKIT}/assets/"
cp -rf "${REPO_ROOT}/skills/." "${STANDALONE_TOOLKIT}/skills/"
cp -f "${REPO_ROOT}/scripts/sync-local-antigravity.sh" "${STANDALONE_TOOLKIT}/scripts/sync-local-antigravity.sh"
cp -f "${REPO_ROOT}/scripts/bundle-gemini-skills.ts" "${STANDALONE_TOOLKIT}/scripts/bundle-gemini-skills.ts"
chmod +x "${STANDALONE_TOOLKIT}/scripts/sync-local-antigravity.sh"

if [ -d "${REPO_ROOT}/apps/mcp-server" ]; then
  cp -rf "${REPO_ROOT}/apps/mcp-server/." "${STANDALONE_TOOLKIT}/mcp-server/"
fi

for skill_dir in "${STANDALONE_TOOLKIT}/skills"/*; do
  if [ -d "${skill_dir}" ]; then
    skill_name="$(basename "${skill_dir}")"
    ln -sfn "${skill_dir}" "${STANDALONE_TOOLKIT}/.agent/skills/${skill_name}"
  fi
done

cat > "${STANDALONE_TOOLKIT}/package.json" << 'EOF'
{
  "name": "@codingcatdev/agent-toolkit",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "CodingCat.dev 13-Module Design System, AJ Mascot & Excalidraw Visual Studio, and @alex.patterson Voice Toolkit for Google Antigravity and Gemini Web.",
  "scripts": {
    "sync": "./scripts/sync-local-antigravity.sh",
    "bundle": "node --experimental-strip-types ./scripts/bundle-gemini-skills.ts",
    "dev:mcp": "pnpm --dir mcp-server dev",
    "deploy:mcp": "pnpm --dir mcp-server deploy",
    "typecheck:mcp": "pnpm --dir mcp-server typecheck"
  }
}
EOF

cat > "${STANDALONE_TOOLKIT}/README.md" << 'EOF'
# CodingCat.dev Agent Toolkit & 13-Module Design System

Unified Design System, AJ the Cat Mascot & Dark-Mode Excalidraw Visual Rules, Video Production Workflows, and **Alex Patterson (`@alex.patterson`)** Voice Toolkit across **Google Antigravity (`agy`)**, **Gemini Web**, **Claude Code**, and **Cursor**.

## Quick Commands

- Sync skills to `~/.gemini/skills/` and `.agent/skills/`:
  ```bash
  ./scripts/sync-local-antigravity.sh
  ```
- Bundle skills into single-file Markdown exports for Gemini Web Saved Skills:
  ```bash
  node --experimental-strip-types ./scripts/bundle-gemini-skills.ts
  ```
- Run the Cloudflare Worker MCP Server (`list_codingcat_rules`, `get_codingcat_rules`, `get_codingcat_tokens`):
  ```bash
  cd mcp-server && pnpm dev
  ```
EOF

echo "[codingcat-toolkit] Sync complete!"
