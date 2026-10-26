# CodingCat.dev Canonical Design System (2026 Dual-Theme Chalkboard & Royal Purple)

This document defines the canonical design system for CodingCat.dev based on the Google Stitch reference screens:
- **Light Mode (Chalkboard Paper)**: `https://stitch.withgoogle.com/projects/3020591313534241286?node-id=8d1319903d504a79ae56110486455e17`
- **Dark Mode (Obsidian Chalkboard)**: `https://stitch.withgoogle.com/projects/3020591313534241286?node-id=b9e00f99c0d34e9884bf7766a014577b`

## 1. Visual Direction & Dual-Theme Philosophy

CodingCat.dev blends Duolingo-inspired playful educational UI with authentic, hand-drawn Excalidraw architectural diagrams, sticky notes, and live code teardowns. Both Light Mode and Dark Mode are first-class citizens:
- **Light Mode (`:root`)** uses a warm Chalkboard Paper background (`#FAF9FC`) with a subtle lavender dot grid (`#D8B4FE`), crisp white cards (`#FFFFFF`), deep Royal Purple ink (`#2A1155`), and hard-offset sketch shadows (`3px 4px 0 #2A1155`).
- **Dark Mode (`.dark`)** uses an Obsidian Chalkboard background (`#0B1326`) with ambient purple/fuchsia radial glows, slate-obsidian cards (`#131B2E` / `#171F33`), deep code/diagram wells (`#060E20`), chalk-white sketch borders (`rgba(255, 255, 255, 0.22)`), and dark offset sketch shadows (`3px 4px 0 rgba(0, 0, 0, 0.75)`).

## 2. Dual-Theme Color Tokens

| Token Role | Light Mode (`8d1319903d504a79ae56110486455e17`) | Dark Mode (`b9e00f99c0d34e9884bf7766a014577b`) | CSS Custom Property |
| :--- | :--- | :--- | :--- |
| **Page Canvas** | `#FAF9FC` (`brand.chalk`) + `#D8B4FE` dot grid | `#0B1326` (`obsidian.DEFAULT`) + radial glows & dot grid | `--cc-bg-primary` |
| **Secondary Canvas** | `#F5F3FB` (`brand.canvas`) | `#131B2E` (`obsidian.surface`) | `--cc-bg-canvas` |
| **Card / Whiteboard** | `#FFFFFF` (`brand.paper`) | `#171F33` (`obsidian.card`) | `--cc-card` |
| **Deep Code / Video Well** | `#2A1155` (`brand.dark`) | `#060E20` (`obsidian.deep`) | `--cc-bg-void` |
| **Primary Ink / Text** | `#2A1155` (`brand.dark`) | `#F1F5F9` (`chalk.white`) | `--cc-text-primary` |
| **Secondary Body Text** | `#4C1D95` (`purple-900`) | `#CBD5E1` (`slate-300`) | `--cc-text-secondary` |
| **Muted / Accent Text** | `#6B21A8` (`purple-800`) | `#D8B4FE` (`purple-300`) | `--cc-text-muted` |
| **Primary Brand Purple** | `#7C3AED` (hover `#8B5CF6`) | `#7C3AED` (hover `#8B5CF6`, lip `#4C1D95`) | `--cc-purple-primary` |
| **Candy / Fuchsia Accent** | `#A855F7` / `#D946EF` | `#C084FC` (`chalk.candy`) / `#D946EF` | `--cc-candy` |
| **Sketch Border** | `2px solid #2A1155` | `2px solid rgba(255, 255, 255, 0.22)` | `--cc-border-sketch` |
| **Sunny Yellow (Sticky/Node)** | `#FEF08A` (text `#713F12`, border `#2A1155`) | Sticky `#FEF08A` / Node `rgba(66, 32, 6, 0.8)` (`#FACC15` border) | `--cc-yellow-bg` |
| **Sky Blue (Node/Header)** | `#BAE6FD` (text `#0369A1`, border `#2A1155`) | `rgba(8, 47, 73, 0.8)` (`#38BDF8` border, `#BAE6FD` text) | `--cc-sky-bg` |
| **Candy Pink (Node/Header)** | `#FBCFE8` (text `#9D174D`, border `#2A1155`) | `rgba(80, 7, 36, 0.55)` (`#F472B6` border, `#F9A8D4` text) | `--cc-pink-bg` |
| **Lilac (Node/Header)** | `#EDE9FE` (text `#5B21B6`, border `#2A1155`) | `rgba(59, 7, 100, 0.65)` (`#C084FC` border, `#E9D5FF` text) | `--cc-lilac-bg` |
| **Mint / Emerald Green** | `#86EFAC` / `#58CC02` (pill `#DCFCE7`, text `#166534`) | `#86EFAC` / `#34D399` (pill `rgba(2, 44, 34, 0.8)`, text `#6EE7B7`) | `--cc-mint` |

## 3. Typography Hierarchy

1. **Display Headlines (`--font-display`)**: `Nunito` / `Fredoka` (`800-900` weight, tight tracking `-0.03em`). Used for playful lowercase hero and section titles (`free. fun. purrfect.`, `learn by building.`, `meet real codingcat learners & guests`).
2. **Excalidraw Hand-Drawn Explanations (`--font-hand`)**: `Virgil` / `Caveat` (`400-700` weight). Used for sketch subtitles (`learn by building real apps.`), sticky notes (`AJ's Tip`), flowchart node labels, and speech bubbles (`"Purrfect code!"`).
3. **UI & Editorial Body (`--font-sans`)**: `Plus Jakarta Sans` / `Inter` (`400-700` weight).
4. **Code & Metadata Badges (`--font-mono`)**: `JetBrains Mono` (`500-700` weight).

## 4. Hand-Drawn Borders, Sketch Shadows & Tactile Buttons

- **`.hand-border`**:
  ```css
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  border: 2px solid var(--cc-border-sketch);
  ```
- **`.hand-border-rect`**:
  ```css
  border-radius: 20px 8px 18px 10px;
  border: 2px solid var(--cc-border-sketch);
  ```
- **`.shadow-sketch`**:
  - Light Mode: `3px 4px 0px 0px #2A1155` (`sm`: `2px 2px`, `lg`: `6px 7px`)
  - Dark Mode: `3px 4px 0px 0px rgba(0, 0, 0, 0.75)` (`sm`: `2px 2px`, `lg`: `6px 7px`)
- **Primary Tactile CTA (`.tactile-btn`)**:
  - Light Mode: `background: #2A1155` (hover `#7C3AED`), white text, `#86EFAC` arrow, `box-shadow: 3px 4px 0 #2A1155`
  - Dark Mode: `background: #7C3AED` (hover `#8B5CF6`), white text, `#6EE7B7` arrow, `box-shadow: 0 4px 0 #4C1D95, 0 8px 20px rgba(124, 58, 237, 0.4)`
- **`.chalk-hatch`**:
  - Diagonal `-45deg` repeating marker hatch fill in purple/lavender (`rgba(167, 139, 250, 0.35)` Light / `rgba(168, 85, 247, 0.35)` Dark).
