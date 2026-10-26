# 02. Colors: Dark-Mode-First Palette & Semantic Tokens

CodingCat.dev uses a high-contrast dark-mode palette anchored by **Canvas Obsidian (`#0F172A`)**, **CodingCat Royal Purple (`#4B2E83`)**, **Soft Lavender (`#B4A7D6`)**, and **Electric Lime Green (`#C5E86C`)**.

## Canonical Color Token Table

| Token Name | Hex | RGB | Tailwind Class | CSS Variable | Usage Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas Obsidian** | `#0F172A` | `rgb(15, 23, 42)` | `bg-slate-900` | `--cc-bg-primary` | Primary page background across all web layouts and app shells. |
| **Pure Void** | `#000000` | `rgb(0, 0, 0)` | `bg-black` | `--cc-bg-void` | Excalidraw diagram wells, terminal outputs, and deepest dark contrast wells. |
| **Surface Slate** | `#1E293B` | `rgb(30, 41, 59)` | `bg-slate-800` | `--cc-surface` | Bento tutorial cards, code block containers, callout panels, and table rows. |
| **Elevated Surface** | `#334155` | `rgb(51, 65, 85)` | `bg-slate-700` | `--cc-surface-elevated` | Interactive card hover states, dropdown menus, modals, and tooltips. |
| **CodingCat Royal Purple** | `#4B2E83` | `rgb(75, 46, 131)` | `bg-[#4B2E83]` | `--cc-purple-primary` | Primary brand identity color, secondary buttons, header accents, AJ's headphones. |
| **Vivid Purple Accent** | `#7C3AED` | `rgb(124, 58, 237)` | `bg-violet-600` | `--cc-purple-vivid` | Active gradients, badge highlights, and dark-mode interactive accents. |
| **Soft Lavender** | `#B4A7D6` | `rgb(180, 167, 214)` | `text-[#B4A7D6]` | `--cc-lavender` | Secondary accent, subtle card borders (`#B4A7D6/20`), overline kickers, AJ's ear-cup cushions and collar, and Excalidraw secondary strokes. |
| **Electric Lime Green** | `#C5E86C` | `rgb(197, 232, 108)` | `bg-[#C5E86C]` | `--cc-lime` | Primary CTA buttons, keyboard focus rings, thumbnail highlight words, AJ's eyes, and diagram checkmarks. |
| **Mint Success** | `#86EFAC` | `rgb(134, 239, 172)` | `text-green-300` | `--cc-mint` | Excalidraw good-pattern checkmarks, passing test badges, and positive diffs. |
| **Coral Anti-Pattern** | `#FCA5A5` | `rgb(252, 165, 165)` | `text-red-300` | `--cc-coral` | Excalidraw anti-pattern `X` marks, error states, and destructive action warnings. |
| **Text Primary** | `#F8FAFC` | `rgb(248, 250, 252)` | `text-slate-50` | `--cc-text-primary` | Headings, primary body copy, and primary table text (15.4:1 AAA contrast on `#0F172A`). |
| **Text Muted** | `#94A3B8` | `rgb(148, 163, 184)` | `text-slate-400` | `--cc-text-muted` | Secondary metadata, timestamps, captions, and muted descriptions (7.1:1 AA+ contrast on `#0F172A`). |

## Tactile 3D Lip Tokens (Buttons & Cards)

| Base Token | Base Hex | Lip Variable | Lip Hex | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Electric Lime CTA** | `#C5E86C` | `--cc-lime-lip` | `#9BC53D` | `4px` bottom border lip on primary `#C5E86C` CTA buttons. |
| **Royal Purple CTA** | `#4B2E83` | `--cc-purple-lip` | `#351F5E` | `4px` bottom border lip on secondary `#4B2E83` buttons. |

## Color Pairing & Accessibility Rules
1. **Text on Electric Lime (`#C5E86C`)**: Always use `#0F172A` (Canvas Obsidian) bold text on `#C5E86C` backgrounds for crisp readability. Never place white text on `#C5E86C`.
2. **Text on Royal Purple (`#4B2E83`)**: Always use `#F8FAFC` (Text Primary) on `#4B2E83` surfaces.
3. **Diagram Evaluation Contrast**: In dark-mode Excalidraw diagrams (`#000000` or `#0F172A`), pair Coral (`#FCA5A5`) `X` markers against Mint (`#86EFAC`) or Electric Lime (`#C5E86C`) checkmarks so architectural comparisons read at a glance.
