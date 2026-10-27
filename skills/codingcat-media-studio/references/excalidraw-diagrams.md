# Dark-Mode Excalidraw Architecture Diagrams (`excalidraw-diagrams.md`)

CodingCat.dev uses hand-drawn dark-mode **Excalidraw** diagrams for system architecture walkthroughs, "WTF is..." mental models, and side-by-side anti-pattern vs. recommended pattern comparisons.

## 1. Visual Token Rules for Excalidraw Canvases

| Diagram Element | Color Token | Hex Value | Style & Stroke Rules |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Pure Void or Canvas Obsidian | `#000000` or `#0F172A` | Always dark-mode-first. Never export white-background Excalidraw diagrams. |
| **Primary Box & Arrow Strokes** | Crisp White | `#FFFFFF` | 2D hand-drawn sketchy lines (`sloppiness: 1` or `2` in Excalidraw), double-stroked containers. |
| **Secondary / Grouping Strokes** | Soft Lavender | `#B4A7D6` | Dashed hand-drawn boundary boxes (for example, Cloudflare Edge Network, VPC, or Worker Isolate boundary). |
| **Accent Fill / Highlight Node** | Royal Purple / Surface Slate | `#4B2E83` / `#1E293B` | Cross-hatched (`hachure`) fill inside primary architecture nodes. |
| **Typography & Annotations** | White, Lavender, or Lime | `#FFFFFF`, `#B4A7D6`, `#C5E86C` | Always rendered in **`Virgil`** or **`Excalifont`** hand-drawn font at `20px+` so labels remain readable on mobile. |
| **Anti-Pattern Evaluation (`✗`)** | Coral Anti-Pattern | `#FCA5A5` | Hand-drawn Coral `X` mark and Coral border around slow, brittle, or deprecated architectures. |
| **Recommended Evaluation (`✓`)** | Mint Success or Electric Lime | `#86EFAC` or `#C5E86C` | Hand-drawn Mint/Lime checkmark (`✓`) and glowing highlight around the recommended architecture. |

## 2. Presenter Separation Rule
- **Keep `@alex.patterson` Separate from the Diagram Canvas**: When recording video walkthroughs or compositing slides, place the `@alex.patterson` camera cutaway in a dedicated side rail or Picture-in-Picture corner outside the active diagram nodes so hand-drawn `Virgil` labels and arrows are never covered.

## 3. Copy-Pasteable Excalidraw Image Generation Prompt
When generating an Excalidraw-style architecture diagram via an image model:

```text
2D hand-drawn dark-mode Excalidraw software architecture diagram on a pure black (#000000) background. Sketchy white (#FFFFFF) and Soft Lavender (#B4A7D6) hand-drawn boxes with diagonal hachure cross-hatching in Royal Purple (#4B2E83) and Surface Slate (#1E293B), connected by hand-drawn sketchy white arrows. All text labels are written in clean, legible white Virgil hand-drawn marker font. Left side shows the legacy anti-pattern marked with a Coral red (#FCA5A5) hand-drawn X mark; right side shows the modern edge architecture marked with a bright Electric Lime (#C5E86C) and Mint (#86EFAC) hand-drawn checkmark. Flat 2D whiteboard sketch aesthetic, no 3D perspective, high contrast developer diagram.
```
