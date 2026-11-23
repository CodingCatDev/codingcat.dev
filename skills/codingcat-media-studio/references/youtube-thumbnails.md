# YouTube Thumbnails (16:9) Specification (`youtube-thumbnails.md`)

Every CodingCat.dev 16:9 YouTube thumbnail (`1920x1080px`) is engineered for instant mobile recognition, high click-through rate (CTR), and zero overlap between the presenter cutout and the hand-drawn architecture diagram.

---

## 1. The 3-Zone Non-Overlapping Composition Grid

| Zone | Placement | Visual Contents | Styling & Shadow Rules |
| :--- | :--- | :--- | :--- |
| **Zone 1: Presenter / Mascot Cutout** | Strictly **Left Third (`0%-33%`)** OR **Right Third (`67%-100%`)** | Photorealistic studio cutout of **Alex Patterson (`@alex.patterson`)** (or 2D/3D **AJ the Cat**). **CRITICAL**: Confine the cutout strictly to its third so hands, elbows, and shoulders never overlap any diagram box or text label. | Apply a natural drop shadow (`0 12px 24px rgba(0, 0, 0, 0.85)`) and a vibrant colored rim/edge outline matching the brand accent (`#7C3AED` Royal Purple, `#C5E86C` Electric Lime, or `#38BDF8` Sky Cyan). |
| **Zone 2: Hand-Drawn Architecture Diagram** | Opposite **Two-Thirds** (below headline) | Flat 2D dark-mode whiteboard diagram (`Rough.js` double-stroked white/lavender boxes, `45-degree` diagonal hachure fills, max 3-4 boxes: Left anti-pattern cluster with Coral Red `#FCA5A5` `X` -> Center `Core Engine` -> Right `EDGE NATIVE` boxes with Electric Lime `#C5E86C` / Mint `#86EFAC` checkmark `✓`, or a Sequence / UML Class / State Machine / Layered Stack topology). | Pure black (`#000000`) canvas with subtle dark gray (`#212121`) `20px` technical gridlines. All node labels in large white `Virgil` hand-drawn marker font (`1-3` words max). |
| **Zone 3: Brand Mark + 2-Word Display Headline** | Top-Center or Top over Diagram Zone | Official `CodingCat.dev` AJ mascot badge (`AJHeadphones.png`) or tech stack mark paired with a **2 to 3 word** bold geometric grotesque headline (`Inter` / `Nunito` 800-900). First word in crisp white (`#FFFFFF`), second word in glowing brand accent (`#C5E86C` Electric Lime, `#C084FC` Royal Purple, or `#38BDF8` Sky Cyan). | Never repeat the full video title word-for-word. Never print hex codes on the canvas. |

---

## 2. Explicit `@alex.patterson` Likeness & Pose Lock for Gemini App

When generating thumbnails in the Gemini App (`gemini.google.com`) using `@alex.patterson` or `@codingcatthumbnails`, always include this explicit physical description so the model never hallucinates glasses, wrong hair, or rings:

> **Physical Likeness Lock (`@alex.patterson`)**: A Caucasian man in his mid-40s with a round friendly face, very short styled light-brown hair (slightly thinning on top), warm blue-green eyes, and a neatly trimmed greyish-brown salt-and-pepper beard. **He wears NO glasses.** He is wearing a clean black crew-neck t-shirt with the official **AJ the Cat headphone mascot logo** (`AJHeadphones.png`: black cat head with big Electric Lime Green eyes, pink nose, three white whiskers per cheek, purple over-ear headphones reading `"CodingCat.dev Podcast"`, pastel-rainbow hexagonal `"AJ"` collar tag, and a crisp white die-cut screen-print outline) printed on the center chest, and a sleek round black smartwatch (Google Pixel Watch) on his left wrist. Both hands have no rings, and his right wrist is completely bare.

### Canonical Thumbnail Poses (`@codingcatthumbnails`)

| Pose Name | Gesture Description | Best Thumbnail Placement & Use Case |
| :--- | :--- | :--- |
| **`alex_mind_blown`** | Both hands raised splayed on either side of his head, wide eyes, open-mouthed shocked expression | **Left Third** (or Right Third) reacting to eliminating boilerplate/duplicates |
| **`alex_pointing_left`** | Smiling warmly, pointing index finger or gesturing open-palmed directly left toward the center diagram node | **Right Third** directing viewer eye-line into the architecture flow |
| **`alex_pointing_right`** | Smiling warmly, pointing index finger directly right toward the diagram | **Left Third** directing viewer eye-line right |
| **`alex_pointing_up`** | Looking at camera, pointing index finger straight up at the 2-word headline | **Right or Left Third** for major feature launches |
| **`alex_thinking`** | Hand on chin evaluating architectural trade-offs | **Right Third** for framework/database comparison videos |
| **`alex_thumbs_up`** | Confident double thumbs up with big open smile | **Right Third** for best-practice & starter kit guides |
| **`alex_shrug`** | Both hands open palms-up in a questioning shrug ("Why?!") | **Right or Left Third** for debunking over-engineered architectures |
| **`alex_celebrate`** | Big smile with celebratory fist-pump | **Right Third** for sub-5ms benchmark wins & production launches |
| **`alex_facepalm`** | Hand covering forehead in disbelief | **Left or Right Third** for post-mortems, outages, and config nightmares |
| **`alex_skeptical`** | Raised eyebrow, candid Senior Solutions Architect skepticism | **Right Third** for "Is [Tech] Worth the Hype?" teardowns |

---

## 3. Copy-Pasteable Winning YouTube Thumbnail Prompt Template

```text
@codingcatthumbnails create a high-contrast 16:9 YouTube thumbnail on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

1. Left Third (Presenter Cutout - @alex.patterson):
- Position a photorealistic studio cutout of @alex.patterson strictly on the left third of the frame, completely clear of any diagram boxes or text.
- Likeness lock: Caucasian man in his mid-40s, very short light-brown hair, warm blue-green eyes, trimmed salt-and-pepper beard, wearing NO glasses. He is in the shocked "mind-blown" pose with both hands raised to the sides of his head, wearing a round black smartwatch on his left wrist (no rings) and a black crew-neck t-shirt with the official AJ the Cat headphone mascot logo (black cat with lime-green eyes, purple headphones reading "CodingCat.dev Podcast", white die-cut outline) screen-printed on the chest.

2. Top Center-Right (Brand Lockup & Headline):
- Directly above the diagram is the large, bold headline "[Word 1] [Word 2]" (for example, "Edge Native") in a heavy geometric grotesque font, with "[Word 1]" in crisp white (#FFFFFF) and "[Word 2]" in vibrant glowing Electric Lime (#C5E86C) or Royal Purple (#C084FC).

3. Right Two-Thirds (Flat 2D Hand-Drawn Dark-Mode Whiteboard Diagram):
- Authentic flat 2D whiteboard sketch aesthetic (Rough.js style) with zero 3D perspective.
- Every box is drawn with TWO slightly offset, overlapping, hand-drawn sketchy white (#FFFFFF) and Soft Lavender (#B4A7D6) marker strokes.
- Left side of diagram: A double-stroked sketchy boundary box labeled "LEGACY" in white Virgil hand-drawn marker font, containing three stacked cards slashed with a large Coral Red (#FCA5A5) hand-drawn "X" mark.
- Center of diagram: Three sketchy white hand-drawn arrows point from the left cards into a single central document card (with folded top-right corner) labeled "Edge Worker".
- Right side of diagram: Two sketchy white arrows branch from "Edge Worker" to two double-stroked boxes labeled "D1 Read Replica" and "< 5ms Auth".
- Above the right-side boxes, draw a large, vibrant Electric Lime Green (#C5E86C) and Mint (#86EFAC) hand-drawn checkmark labeled "PRODUCTION" in white Virgil marker font.
- Maintain a 96px safe margin from all edges, keep the bottom-right 320x120px clear for the YouTube timestamp, and never render hex codes as text.
```
