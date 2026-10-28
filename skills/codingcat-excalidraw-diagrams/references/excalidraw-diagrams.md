# Dark-Mode Excalidraw Architecture Diagrams (`excalidraw-diagrams.md`)

CodingCat.dev uses hand-drawn dark-mode whiteboard diagrams for system architecture walkthroughs, technical mental models, and side-by-side anti-pattern vs. recommended pattern comparisons.

---

## 1. Why Generic "Excalidraw" Prompts Fail in Gemini App (and How to Fix Them)

When you prompt Gemini's image generator without a reference image attached, simply writing `"Excalidraw software architecture diagram"` fails because the diffusion model defaults to 3D isometric boxes, glowing cyberpunk gradients, or 10+ tiny boxes with unreadable gibberish text.

To force Gemini App to generate authentic, crisp, hand-drawn dark-mode whiteboard diagrams every single time, **you must translate "Excalidraw" into explicit `Rough.js` physical drawing mechanics** using the **6-Part Zero-Shot Excalidraw Prompt Formula** below.

| Failure Mode in Gemini Image Gen | Root Cause | Mandatory Fix in Prompt Expansion |
| :--- | :--- | :--- |
| **Looks like a 3D corporate flowchart or neon sci-fi UI** | Model treats "architecture diagram" as 3D isometric tech art | Explicitly specify: `"Flat 2D hand-drawn whiteboard sketch on pure black (#000000) with subtle dark gray (#212121) 20px gridlines. Zero 3D perspective, zero isometric angles, zero glossy bevels or drop shadows on boxes."` |
| **Boxes have smooth computer-drawn borders and solid gradient fills** | Model does not know `Rough.js` stroke/fill defaults | Explicitly specify: `"Every box is drawn with TWO slightly offset, overlapping, hand-drawn wobbly white (#FFFFFF) or Soft Lavender (#B4A7D6) marker strokes (double-stroked Rough.js sloppiness=2). Interior fills use visible 45-degree diagonal parallel marker hatch lines (hachure cross-hatching), never solid gradients."` |
| **Garbled / misspelled text inside boxes** | Too many nodes or long sentences inside boxes | Strictly cap the diagram at **3 to 5 boxes total**, and cap every box label at **1 to 3 short words** in large white hand-drawn marker font (`Virgil` style). |
| **Hex codes (`#C5E86C`) printed as literal text on the image** | Raw hex strings placed near label descriptions | Always add at the end of the prompt: `"Colors are visual rendering guidelines only; do not render any hex codes or UI chrome as text in the image."` |
| **Presenter cutout (`@alex.patterson`) covers diagram boxes** | No spatial boundary between portrait and diagram | In standalone diagrams, include **no presenter**. In thumbnails, lock `@alex.patterson` strictly to the **Left Third (`0%-33%`)** or **Right Third (`67%-100%`)** and confine all diagram boxes to the **opposite Two-Thirds** with zero overlap. |

---

## 2. Visual Token Rules for Dark-Mode Whiteboard Canvases

| Diagram Element | Color Token | Hex Value | Physical Drawing & Stroke Rules |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Pure Void + Technical Grid | `#000000` with `#212121` grid | Flat 2D pure black canvas with a faint `20px` dark gray technical gridline pattern. Never export white-background diagrams. |
| **Primary Box & Document Strokes** | Crisp White Chalk/Marker | `#FFFFFF` | Double-stroked (`2` overlapping slightly crooked hand-drawn lines) rectangles or document cards with a folded top-right corner. |
| **Grouping / Boundary Strokes** | Soft Lavender | `#B4A7D6` | Double-stroked or dashed hand-drawn outer container grouping related cards. |
| **Interior Hachure Fill** | Royal Purple / Slate / Brand Accent | `#4B2E83`, `#1E293B`, or `#FF5500` | Sparse **45-degree diagonal parallel hatch lines** (`hachure` cross-hatching) inside primary boxes over the black background. |
| **Connector Arrows** | Hand-Drawn White Marker | `#FFFFFF` | Thick, sketchy, double-stroked white arrows with open hand-drawn arrowheads (`->`) connecting left to right. |
| **Typography & Annotations** | White Hand-Drawn Marker | `#FFFFFF` | Large, clean, legible hand-drawn marker lettering (`Virgil` / `Excalifont` look). Keep labels to **1-3 words max**. |
| **Anti-Pattern Marker (`✗`)** | Coral Red | `#FCA5A5` | Large, thick, sketchy Coral Red hand-drawn `X` mark slashed directly over the legacy/bad cluster on the left, paired with an ALL-CAPS marker label (such as `"DUPLICATES"` or `"LEGACY"`). |
| **Recommended Marker (`✓`)** | Electric Lime & Mint | `#C5E86C` & `#86EFAC` | Large, vibrant, sketchy hand-drawn green checkmark (`✓`) above the resolved right-side nodes, paired with an ALL-CAPS marker label (such as `"DYNAMIC"` or `"EDGE NATIVE"`). |

---

## 3. Copy-Pasteable Gemini App `Style` Preset ("CodingCat Dark Whiteboard")

Since Gems with photo attachments are no longer used, save the following block as your reusable **Style** inside the Gemini App (`gemini.google.com`) for diagrams and thumbnails:

```text
Always render visuals in the CodingCat.dev Dark Whiteboard & Studio aesthetic:
1. Canvas: Flat 2D pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern. Zero 3D perspective, zero isometric angles, zero glossy bevels.
2. Hand-Drawn Diagram Mechanics (Rough.js / Excalidraw look): Every diagram box, document card (with folded top-right corner), and boundary container is drawn with TWO slightly offset, overlapping, hand-drawn sketchy white or soft lavender marker strokes (double-stroked wobble). Box interiors use visible 45-degree diagonal parallel marker hatch lines (hachure cross-hatching) in deep purple, dark slate, or brand orange, never solid gradients.
3. Diagram Layout & Labels: Maximum 3 to 5 boxes flowing left-to-right connected by thick, sketchy, double-stroked white hand-drawn arrows. Left cluster shows the old painful anti-pattern slashed with a large sketchy Coral Red X mark and an ALL-CAPS marker caption (e.g., "DUPLICATES"). Right cluster shows the modern pattern topped with a bright sketchy Electric Lime / Mint Green checkmark and an ALL-CAPS marker caption (e.g., "DYNAMIC"). All text uses clean, legible white hand-drawn marker handwriting (Virgil font style), strictly 1 to 3 words per box. Never print hex codes on the image.
4. Presenter Likeness (@alex.patterson): When a presenter cutout is requested, place Alex Patterson (mid-40s Caucasian man, short styled light-brown hair, warm blue-green eyes, neatly trimmed salt-and-pepper beard, NO glasses, black crew-neck t-shirt, round black Pixel Watch on left wrist) strictly in the Left Third or Right Third with a colored sketch rim-light, ensuring zero overlap with any diagram boxes or text.
```

---

## 4. The 6-Part Zero-Shot Excalidraw Prompt Template (Standalone 16:9 Diagram)

Whenever the user asks to generate an architecture diagram image in Gemini App, **always expand the prompt into this exact 6-part structure** before calling the image generator:

```text
Flat 2D hand-drawn dark-mode whiteboard software architecture diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) technical gridline pattern.

1. Drawing Style & Stroke Mechanics:
- Authentic flat 2D whiteboard sketch aesthetic (Rough.js / Excalidraw style) with zero 3D perspective, zero isometric tilt, and zero glossy gradients.
- Every card and container is drawn with TWO slightly offset, overlapping, hand-drawn wobbly white (#FFFFFF) and Soft Lavender (#B4A7D6) marker strokes (double-stroked sketchy lines).
- Interior fills of cards use sparse 45-degree diagonal parallel marker hatch lines (hachure cross-hatching) in Royal Purple (#4B2E83) and dark slate (#1E293B).

2. Left Section (Anti-Pattern Cluster):
- Inside a double-stroked sketchy boundary box on the left, draw three overlapping document cards with folded top-right corners labeled "[Bad Node 1]", "[Bad Node 2]", and "[Bad Node 3]".
- Slash a large, thick, sketchy Coral Red (#FCA5A5) hand-drawn "X" mark directly across this cluster.
- Underneath the boundary box, write the ALL-CAPS hand-drawn marker annotation "[ANTI-PATTERN CAPTION, e.g. DUPLICATES]" with a small sketchy curved white arrow pointing up at the box.

3. Center Section (Core Resolution Node):
- Thick, double-stroked sketchy white arrows point from the left cluster to a single prominent center card labeled "[Core Node, e.g. Base Document]" filled with 45-degree diagonal hatch lines.

4. Right Section (Recommended Pattern Cluster):
- Sketchy white hand-drawn arrows branch from the center card to two clean double-stroked boxes on the right labeled "[Good Output 1]" and "[Good Output 2]".
- Above these right-side boxes, draw a large, vibrant, sketchy hand-drawn checkmark in Electric Lime Green (#C5E86C) and Mint (#86EFAC), paired with the ALL-CAPS marker annotation "[GOOD CAPTION, e.g. DYNAMIC]" and a small sketchy pointer arrow.

5. Typography & Visual Guardrails:
- All labels are written in large, clean, highly legible white hand-drawn marker handwriting (Virgil font aesthetic).
- generous black negative space between the Left, Center, and Right groups so no boxes or arrows overlap.
- Use all color values strictly as visual rendering guidelines; never render hex codes, UI toolbars, or watermarks as text on the canvas.
```

---

## 5. Gemini Canvas Mode: True Vector Diagrams (`Rough.js` + `Virgil` Font)

When a diagram requires **more than 5 nodes**, exact code/API method names (like `releases.create()`, `sanity::partOfRelease()`), or 100% typo-free vector text that image diffusion models might misspell, offer or open **Gemini Canvas** and generate a self-contained HTML/SVG interactive diagram using:
- `@font-face` loading `Virgil` (`https://excalidraw.nyc3.cdn.digitaloceanspaces.com/fonts/Virgil.woff2`)
- `roughjs` (`https://unpkg.com/roughjs@4.6.6/bundled/rough.cjs.js`) with `roughness: 1.8, bowing: 1.5, fillStyle: "hachure", fillWeight: 1.5, hachureAngle: -41, hachureGap: 8`
- A built-in **"Download High-Res PNG (1920x1080)"** and **"Download SVG"** button so Alex can export pixel-perfect dark-mode diagrams directly from Gemini Canvas.
