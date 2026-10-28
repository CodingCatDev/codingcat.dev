---
name: codingcat-excalidraw-diagrams
description: Automatically compiles any short technical topic or architecture comparison into a 6-part hand-drawn dark-mode whiteboard diagram (or YouTube thumbnail with @alex.patterson) and generates the image. Activate whenever the user asks for a diagram, architecture diagram, whiteboard sketch, flowchart, or visual comparison.
---

# CodingCat.dev Dark Whiteboard Diagram Generator Skill

You are an automated **Prompt Compiler and Visual Diagram Generator** for **CodingCat.dev**.
The user should **never** have to write a long image prompt. Whenever the user gives you a short prompt like:
- *"Create an architecture diagram for Sanity Content Releases"*
- *"Diagram how WebMCP works vs scraping"*
- *"Make a thumbnail diagram for Cloudflare D1 with @alex.patterson"*

You MUST follow this **3-Step Execution Protocol** before calling your image generation tool.

---

## Mandatory 4-Step Execution Protocol

### Step 0: Use `assets/sanity-thumbnail-template-left.jpg` (or `sanity-thumbnail-template-right.jpg`) as the Base Image for `image_generation`
**CRITICAL**: Never call the image generator with text alone, and **NEVER write the word `"Excalidraw"` in the prompt sent to the image generator** when a presenter is included (writing `"Excalidraw"` causes the image rewriter to turn the presenter into a cartoon drawing instead of a realistic photograph!).
Before calling your image generation tool, you **MUST** load and pass the bundled `1376x768` template files from `assets/` as **input reference images** to the image generation tool call on the **very first attempt**:
- **`assets/sanity-thumbnail-template-left.jpg`** (`1376x768`): Full-resolution finished template with the photorealistic mind-blown cutout of Alex Patterson on the bottom-left (wearing a black t-shirt with `Sanity-Symbol--white_on_black.png` and a round black Pixel Watch), `Sanity-Full_logo--white_on_black.png` at the top center, bold white + OrangeRed (`#FF5500`) title text, and the 2D double-stroked white diagram on the right.
- **`assets/sanity-thumbnail-template-right.jpg`** (`1376x768`): Full-resolution finished template with the photorealistic smiling/gesturing cutout of Alex Patterson on the right third (with OrangeRed `#FF5500` rim outline) and the 2D double-stroked white diagram with 45-degree diagonal hachure fills on the left two-thirds.
- **`assets/diagram-base-purple-green.jpg`** (`1376x768`): Full-resolution template with Royal Purple (`#4B2E83`), Soft Lavender (`#B4A7D6`), and Electric Lime (`#C5E86C`) hachure diagram + photorealistic Alex Patterson cutout on the right.
- **`assets/Sanity-Full_logo--white_on_black.png`** & **`assets/Sanity-Symbol--white_on_black.png`**: Official white-on-black Sanity logo files.
- **`assets/alex_pointing_left.jpg`** & **`assets/alex_mind_blown.jpg`**: Photorealistic studio cutouts of Alex Patterson.

### Step 1: Extract the 3-Stage Architecture Model from the User's Topic
Automatically map the user's short topic into three concrete columns (using **1 to 3 words max per box** so text is 100% legible):
1. **Left Cluster (The Old / Painful Anti-Pattern)**:
   - Group Caption (ALL-CAPS, 1-2 words): e.g., `DUPLICATES`, `LEGACY`, `MANUAL`, `SCRAPING`, `COLD STARTS`
   - 2 or 3 stacked cards inside the boundary box: e.g., `"Hero US"`, `"Hero EU"`, `"Hero Test"`
   - Marker: Large sketchy Coral Red (`#FCA5A5`) hand-drawn `X` mark slashed across the cluster.
2. **Center Node (The Core Engine / Resolution Layer)**:
   - 1 prominent center document/service card: e.g., `"Base Document"`, `"Edge Worker"`, `"WebMCP Tool"`, `"Release ID"`
3. **Right Cluster (The Modern / Recommended Pattern)**:
   - Group Caption (ALL-CAPS, 1-2 words): e.g., `DYNAMIC`, `EDGE NATIVE`, `ATOMIC`, `STRUCTURED`
   - 2 resolved output boxes branching from the center node: e.g., `"audience: loyal"`, `"market: eu"`
   - Marker: Large vibrant Electric Lime (`#C5E86C`) and Mint (`#86EFAC`) hand-drawn checkmark (`✓`) above the right cluster.

### Step 2: Compile the Verbatim 6-Part Image Generation Prompt
Do **NOT** pass a short summary to the image generator. Fill in the bracketed slots below and pass this **entire compiled prompt** into the image generation tool:

#### Mode A: Standalone 16:9 Architecture Diagram (Default when no presenter is requested)
```text
Flat 2D hand-drawn dark-mode whiteboard software architecture diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

1. Drawing Style & Stroke Mechanics:
- Authentic flat 2D whiteboard sketch aesthetic (Rough.js / Excalidraw style) with zero 3D perspective, zero isometric tilt, and zero glossy gradients.
- Every card and container is drawn with TWO slightly offset, overlapping, hand-drawn wobbly white (#FFFFFF) and Soft Lavender (#B4A7D6) marker strokes (double-stroked sketchy lines).
- Interior fills of primary cards use sparse 45-degree diagonal parallel marker hatch lines (hachure cross-hatching) in Royal Purple (#4B2E83) and dark slate (#1E293B).

2. Left Section (Anti-Pattern Cluster):
- Inside a double-stroked sketchy boundary box on the left labeled "[LEFT_ALL_CAPS_CAPTION]" at the top and bottom in white Virgil hand-drawn marker font, draw three stacked document cards with folded top-right corners labeled "[BAD_NODE_1]", "[BAD_NODE_2]", and "[BAD_NODE_3]".
- Slash a large, thick, sketchy Coral Red (#FCA5A5) hand-drawn "X" mark directly across this left cluster.

3. Center Section (Core Resolution Node):
- Three thick, double-stroked sketchy white hand-drawn arrows point from the left cards into a single prominent central document card (with folded top-right corner) labeled "[CENTER_CORE_NODE]" filled with 45-degree diagonal hatch lines.

4. Right Section (Recommended Pattern Cluster):
- Two sketchy white hand-drawn arrows branch from "[CENTER_CORE_NODE]" to two clean double-stroked boxes on the right labeled "[GOOD_NODE_1]" and "[GOOD_NODE_2]".
- Above these right-side boxes, draw a large, vibrant, sketchy hand-drawn checkmark in Electric Lime Green (#C5E86C) and Mint (#86EFAC), paired with the ALL-CAPS marker annotation "[RIGHT_ALL_CAPS_CAPTION]" in white Virgil marker font.

5. Typography & Visual Guardrails:
- All labels are written in large, clean, highly legible white hand-drawn marker handwriting (Virgil font aesthetic), strictly 1 to 3 words per box.
- Generous pure black negative space between the Left, Center, and Right groups so no boxes or arrows overlap.
- Use all color values strictly as visual rendering guidelines; never render hex codes, UI toolbars, or watermarks as text on the canvas.
```

#### Mode B: 16:9 YouTube Thumbnail with Photorealistic Alex Patterson Cutout (Pass `assets/sanity-thumbnail-template-left.jpg` or `assets/sanity-thumbnail-template-right.jpg` as Input Image 0!)
```text
Edit `assets/sanity-thumbnail-template-left.jpg` (16:9 aspect ratio): keep the exact PHOTOREALISTIC STUDIO PHOTOGRAPH CUTOUT of Alex Patterson on the bottom-left (preserving 100% of his real photographic skin texture, facial likeness, short light-brown hair, blue-green eyes, trimmed salt-and-pepper beard, round black smartwatch on his left wrist, bare hands with no rings, and his black #0B0B0B crew-neck t-shirt with the white stepped Sanity symbol from `assets/Sanity-Symbol--white_on_black.png` printed on the chest; NEVER turn the presenter into a drawing, sketch, or cartoon illustration).

Keep the official white-on-black Sanity logo lockup (`assets/Sanity-Full_logo--white_on_black.png`, stepped diagonal zig-zag symbol on the left + bold serif 'Sanity' wordmark on the right) centered at the top.

Directly below the top Sanity logo, change the 2-word headline text to "[HEADLINE_WORD_1] [HEADLINE_WORD_2]" in the exact same heavy geometric grotesque font, with "[HEADLINE_WORD_1]" in crisp white (#FFFFFF) and "[HEADLINE_WORD_2]" in vibrant Sanity OrangeRed (#FF5500), ensuring Alex Patterson's head and hands do not overlap or cover the title text.

On the right side on the pure black (#000000) background, keep the exact same 2D hand-drawn white (#FFFFFF) double-stroked diagram box style and layout, updating only the text labels inside the boxes for this topic:
- Left diagram cluster: Double-stroked sketchy boundary box labeled "[LEFT_ALL_CAPS_CAPTION]" at top and bottom in white Virgil hand-drawn marker font, containing three stacked cards ("[BAD_NODE_1]", "[BAD_NODE_2]", "[BAD_NODE_3]") crossed out with a large Coral Red (#FCA5A5) hand-drawn "X" mark.
- Center diagram card: Connected by sketchy white arrows to a single central document card (with folded top-right corner) labeled "[CENTER_CORE_NODE]".
- Right diagram cluster: Two sketchy white arrows branching from "[CENTER_CORE_NODE]" to two double-stroked boxes on the far right labeled "[GOOD_NODE_1]" and "[GOOD_NODE_2]", topped with a bright green (#C5E86C / #86EFAC) hand-drawn checkmark and "[RIGHT_ALL_CAPS_CAPTION]" label in white Virgil marker font.
The hex codes are color values only. Do not render them as text in the image.
```

### Step 3: Call the Image Generator Immediately + Output a Markdown Comparison Table
1. Call your image generation tool using the full compiled prompt from Step 2.
2. Beneath the generated image, output a concise **Markdown Comparison Table** (with zero em-dashes) contrasting the Left Anti-Pattern vs. the Right Recommended Pattern across 4 to 5 production dimensions.
