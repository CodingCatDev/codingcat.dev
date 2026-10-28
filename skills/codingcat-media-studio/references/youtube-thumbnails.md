# YouTube Thumbnails (16:9) Specification (`youtube-thumbnails.md`)

Every CodingCat.dev 16:9 YouTube thumbnail (`1920x1080px`) is engineered for instant mobile recognition, high click-through rate (CTR), and zero overlap between the presenter cutout and the hand-drawn architecture diagram.

---

## 1. The 3-Zone Non-Overlapping Composition Grid

| Zone | Placement | Visual Contents | Styling & Shadow Rules |
| :--- | :--- | :--- | :--- |
| **Zone 1: Presenter / Mascot Cutout** | Strictly **Left Third (`0%-33%`)** OR **Right Third (`67%-100%`)** | Photorealistic studio cutout of **Alex Patterson (`@alex.patterson`)** (or 2D/3D **AJ the Cat**). **CRITICAL**: Confine the cutout strictly to its third so hands, elbows, and shoulders never overlap any diagram box or text label. | Apply a natural drop shadow (`0 12px 24px rgba(0, 0, 0, 0.85)`) and a vibrant colored rim/edge outline matching the brand accent (`#7C3AED` Royal Purple, `#C5E86C` Electric Lime, or `#FF5500` Sanity OrangeRed). |
| **Zone 2: Hand-Drawn Architecture Diagram** | Opposite **Two-Thirds** (below headline) | Flat 2D dark-mode whiteboard diagram (`Rough.js` double-stroked white/lavender boxes, `45-degree` diagonal hachure fills, max 3-4 boxes: Left `DUPLICATES` cluster with Coral Red `#FCA5A5` `X` -> Center `Base Document` -> Right `DYNAMIC` boxes with Electric Lime `#C5E86C` / Mint `#86EFAC` checkmark `✓`). | Pure black (`#000000`) canvas with subtle dark gray (`#212121`) `20px` technical gridlines. All node labels in large white `Virgil` hand-drawn marker font (`1-3` words max). |
| **Zone 3: Brand Mark + 2-Word Display Headline** | Top-Center or Top over Diagram Zone | Official white-on-black vendor logo lockup above a **2 to 3 word** bold geometric grotesque headline (`Inter` / `Nunito` 800-900). First word in crisp white (`#FFFFFF`), second word in glowing brand accent (`#C5E86C` Lime, `#C084FC` Purple, or `#FF5500` Sanity OrangeRed). | Never repeat the full video title word-for-word. Never print hex codes on the canvas. |

---

## 2. Explicit `@alex.patterson` Likeness & Pose Lock for Gemini App

When generating thumbnails in the Gemini App (`gemini.google.com`) using `@alex.patterson` or `@codingcatthumbnails`, always include this explicit physical description so the model never hallucinates glasses, wrong hair, or rings:

> **Physical Likeness Lock (`@alex.patterson`)**: A Caucasian man in his mid-40s with a round friendly face, very short styled light-brown hair (slightly thinning on top), warm blue-green eyes, and a neatly trimmed greyish-brown salt-and-pepper beard. **He wears NO glasses.** He is wearing a clean black crew-neck t-shirt (with either the official white stepped zig-zag `@sanitybrand` mark, the `CodingCat.dev` logo, or plain black fabric) and a sleek round black smartwatch (Google Pixel Watch) on his left wrist. Both hands have no rings, and his right wrist is completely bare.

### Canonical Thumbnail Poses (`@codingcatthumbnails`)

| Pose Name | Gesture Description | Best Thumbnail Placement & Use Case |
| :--- | :--- | :--- |
| **`alex_mind_blown`** | Both hands raised splayed on either side of his head, wide eyes, open-mouthed shocked expression | **Left Third** (or Right Third) reacting to eliminating boilerplate/duplicates |
| **`alex_pointing_left`** | Smiling warmly, pointing index finger or gesturing open-palmed directly left toward the center diagram node | **Right Third** directing viewer eye-line into the architecture flow |
| **`alex_pointing_right`** | Smiling warmly, pointing index finger directly right toward the diagram | **Left Third** directing viewer eye-line right |
| **`alex_pointing_up`** | Looking at camera, pointing index finger straight up at the 2-word headline | **Right or Left Third** for major feature launches |
| **`alex_thinking`** | Hand on chin evaluating architectural trade-offs | **Right Third** for framework/database comparison videos |
| **`alex_thumbs_up`** | Confident double thumbs up with big open smile | **Right Third** for best-practice & starter kit guides |

---

## 3. Copy-Pasteable Winning YouTube Thumbnail Prompt Template (`KzhGWTEGxJdm` Proven Formula)

```text
@codingcatthumbnails create a high-contrast 16:9 YouTube thumbnail on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

1. Left Third (Presenter Cutout - @alex.patterson):
- Position a photorealistic studio cutout of @alex.patterson strictly on the left third of the frame, completely clear of any diagram boxes or text.
- Likeness lock: Caucasian man in his mid-40s, very short light-brown hair, warm blue-green eyes, trimmed salt-and-pepper beard, wearing NO glasses. He is in the shocked "mind-blown" pose with both hands raised to the sides of his head, wearing a round black smartwatch on his left wrist (no rings) and a black crew-neck t-shirt with the official white stepped zig-zag brand symbol on the chest.

2. Top Center-Right (Brand Lockup & Headline):
- Centered near the top above the diagram is the official white brand logo lockup.
- Directly below the logo is the large, bold headline "[Word 1] [Word 2]" (for example, "Content Variants") in a heavy geometric grotesque font, with "[Word 1]" in crisp white (#FFFFFF) and "[Word 2]" in vibrant glowing accent color (#FF5500 or #C5E86C).

3. Right Two-Thirds (Flat 2D Hand-Drawn Dark-Mode Whiteboard Diagram):
- Authentic flat 2D whiteboard sketch aesthetic (Rough.js / Excalidraw style) with zero 3D perspective.
- Every box is drawn with TWO slightly offset, overlapping, hand-drawn sketchy white (#FFFFFF) marker strokes.
- Left side of diagram: A double-stroked sketchy boundary box labeled "DUPLICATES" at the top and bottom in white Virgil hand-drawn marker font, containing three stacked cards ("Hero US", "Hero EU", "Hero Test") slashed with a large Coral Red (#FCA5A5) hand-drawn "X" mark.
- Center of diagram: Three sketchy white hand-drawn arrows point from the left cards into a single central document card (with folded top-right corner) labeled "Base Document".
- Right side of diagram: Two sketchy white arrows branch from "Base Document" to two double-stroked boxes labeled "audience: loyal" and "market: eu".
- Above the right-side boxes, draw a large, vibrant Electric Lime Green (#C5E86C) and Mint (#86EFAC) hand-drawn checkmark labeled "DYNAMIC" in white Virgil marker font.
- Maintain a 96px safe margin from all edges, keep the bottom-right 320x120px clear for the YouTube timestamp, and never render hex codes as text.
```
