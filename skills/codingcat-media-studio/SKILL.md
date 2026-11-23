---
name: codingcat-media-studio
description: Visual and video generation rules for CodingCat.dev, including Gemini App Avatar (@alex.patterson) & Style workflows, 2D/3D AJ the Cat mascot prompts, hand-drawn dark-mode Excalidraw architecture diagrams, 16:9 YouTube thumbnails, and Veo 3.1 / Gemini App video prompts. Activate whenever generating images, diagrams, thumbnails, or video scripts/storyboards.
---

# CodingCat.dev Media Studio Skill

This skill governs all visual media, mascot illustration prompts, hand-drawn dark-mode architecture diagrams, YouTube thumbnails, and video production workflows for **CodingCat.dev** across **Gemini App (`gemini.google.com`)**, **Google Flow (`Veo 3.1`)**, and **Google Antigravity (`agy`)**.

## 0. Mandatory Pre-Tool Prompt Compiler & Reference Attachment Rule

1. **Always Attach Bundled `1376x768` CodingCat.dev Template Images (`assets/*`) on the First Tool Call**:
   Before calling your image generation tool, you **MUST** load and pass the actual PNG/JPG files from `assets/` (and from `@alex.patterson` or `@codingcatthumbnails`) as **input reference images** to the image generation tool call:
   - `assets/codingcat-thumbnail-template-left.jpg`, `assets/codingcat-thumbnail-template-right.jpg`, or `assets/diagram-base-purple-green.jpg` (full-resolution `1376x768` templates featuring the 100% photorealistic cutout of Alex Patterson wearing the black t-shirt with the screen-printed AJ the Cat logo, official `AJHeadphones.png` brand mark, double-stroked white boxes, 45-degree diagonal hachure fills, Coral `X`, and green checkmark; **NEVER** draw a macOS window with red/yellow/green dots or circular UI icons, and **NEVER** turn the presenter into a cartoon drawing or sketch).
   - `assets/AJHeadphones.png` (official AJ the Cat mascot head with purple over-ear headphones reading `"CodingCat.dev Podcast"` and pastel-rainbow hexagonal `"AJ"` collar tag; **NEVER** use a paw emoji `🐾` with `codingcat.dev`).
   - `assets/alex_pointing_left.jpg`, `assets/alex_pointing_right.jpg`, `assets/alex_mind_blown.jpg`, `assets/alex_thinking.jpg`, `assets/alex_thumbs_up.jpg`, `assets/alex_shrug.jpg`, or `assets/alex_facepalm.jpg` (photorealistic studio cutouts of `@alex.patterson` wearing his black crew-neck t-shirt with the screen-printed AJ the Cat logo on the chest).
   - **CRITICAL ANTI-CARTOON RULE**: Never write the word `"Excalidraw"` in the prompt sent to `image_generation` when a presenter is included (writing `"Excalidraw"` causes the image rewriter to turn the presenter into a cartoon sketch). Instead, pass `assets/codingcat-thumbnail-template-left.jpg` or `assets/codingcat-thumbnail-template-right.jpg` as Input Image 0 and instruct the tool to keep the **photorealistic studio photograph cutout** of Alex Patterson 100% unchanged while updating the title text and 2D double-stroked diagram node labels.
2. **Compile Any 1-Sentence Request into the Full 6-Part Prompt**:
   Whenever the user asks for a diagram, thumbnail, or video with a short 1-sentence request (for example, *"Create a diagram for Cloudflare D1 at the edge"* or *"Make a thumbnail for WebMCP"*), **YOU (Gemini) must automatically compile their short request into the full 6-Part Zero-Shot Excalidraw Prompt in `references/excalidraw-diagrams.md` (or the 3-Zone Thumbnail Prompt in `references/youtube-thumbnails.md`) and pass that full expanded prompt into the image generation tool**. Never pass a short unexpanded summary to the image generator, and never ask the user to copy-paste the template themselves.

## 1. Environment-Aware Asset & Likeness Resolution (Gemini App vs. Antigravity)

Because **Gemini App (`gemini.google.com`)** uses **Avatar (`@alex.patterson`) + Styles + Skills** (rather than legacy Gems with attached photo folders), always resolve likenesses, brand marks, and styles based on the active runtime:

| Asset / Element | In Gemini App (`gemini.google.com`) | In Google Antigravity (`agy` Local Repo) |
| :--- | :--- | :--- |
| **Alex Patterson Likeness** | Invoke `@alex.patterson` (or `@codingcatthumbnails`) + always include the **Explicit Physical Likeness Lock** in the image/video prompt (mid-40s Caucasian man, short light-brown hair, blue-green eyes, trimmed salt-and-pepper beard, **NO glasses**, black crew-neck t-shirt with the screen-printed AJ the Cat headphone mascot logo on the chest, round black Pixel Watch on left wrist, no rings). | Read directly from `assets/alex-likeness/alex-likeness-01.jpg` .. `16.jpg` (`10.jpg`/`02.jpg` pointing left; `11.jpg` pointing right; `03.jpg`/`04.jpg` mind-blown; `05.jpg` shrug; `06.jpg` celebrate; `08.jpg` thumbs up; `12.jpg` thinking; `13.jpg` facepalm). |
| **CodingCat.dev & Tech Stack Logos** | Attach `assets/AJHeadphones.png` as the primary CodingCat.dev brand mark. Only include an external framework or cloud logo when the post or video is explicitly about that tool. | Read directly from `assets/AJHeadphones.png` and `/home/alex/codingcat.dev/apps/site/public/logos/tags/`. |
| **Hand-Drawn Architecture Diagrams** | Expand every diagram request into the **6-Part Zero-Shot Excalidraw Geometry Prompt** in `references/excalidraw-diagrams.md` (double-stroked wobbly white outlines, 45-degree diagonal hachure line fills, max 4-5 nodes, 2-3 word Virgil labels, zero hex code text rendered on canvas). | Use `references/excalidraw-diagrams.md` or render deterministic SVG diagrams via `excalidraw-svg-renderer.mjs` and `ExcalidrawDiagram.astro`. |
| **AJ the Cat Mascot** | Use the self-contained 2D/3D anatomical prompt lock in `references/aj-mascot-prompts.md`. | Ground in `assets/AJHeadphones.png`, `assets/AJ-2D-Bipedal.jpg`, and `assets/AJ-3D-Headphones-*.jpg`. |

## 2. Canonical Terminology Guardrail

- In user-facing UI text, captions, and badges, always call diagrams **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams** (never write the brand name `"Excalidraw"` in user-facing UI copy, and never call content `"Teardowns"` or `"Blueprints"`).
- Content pillars are strictly **Courses** (made of **Lessons**), **Podcasts** (made of **Episodes**), and **Blog** (made of **Blog Posts**).
- **Never Print Hex Codes as Visible Text**: When expanding color tokens (`#000000`, `#C5E86C`, `#FCA5A5`, `#B4A7D6`) into an image generation prompt, always instruct the image generator: `"Use these colors strictly for rendering; never write hex codes or metadata text onto the image canvas."`
- **Never Use Paw Emojis (`🐾`) with `codingcat.dev`**: Always use the official AJ logo (`assets/AJHeadphones.png`) inside `codingcat.dev` brand pills, thumbnails, and video overlays; never render `🐾 codingcat.dev`.
- **Unclipped Presenter Cutouts (`z-index: 20`) & Strict Box Text Bounds**: Always overlay Alex Patterson's full transparent-alpha cutout on top of cover images and YouTube thumbnails so his pointing fingers, hands, and shoulders are never clipped by a crop rectangle, and dynamically size all diagram boxes and pills so 100% of words remain strictly inside their borders.

## 3. Reference Modules (`references/`)

| Reference File | Purpose |
| :--- | :--- |
| [`references/excalidraw-diagrams.md`](./references/excalidraw-diagrams.md) | **6-Part Zero-Shot Excalidraw Prompt Expander**, Gemini App `Style` preset, Rough.js double-stroke + hachure geometry rules, and Gemini Canvas interactive SVG mode |
| [`references/youtube-thumbnails.md`](./references/youtube-thumbnails.md) | 16:9 YouTube thumbnail 3-zone grid, `@alex.patterson` non-overlapping likeness lock, and brand logo rules |
| [`references/google-flow-veo.md`](./references/google-flow-veo.md) | Gemini App 9:16 & 16:9 talking-head video prompts (`@alex.patterson` with synced audio) + Google Flow (Veo 3.1) 3-slot recipes |
| [`references/aj-mascot-prompts.md`](./references/aj-mascot-prompts.md) | Self-contained 2D upright bipedal vector prompt and 3D vinyl-toy turnaround prompt modifiers for AJ |
| [`references/youtube-intros-and-video.md`](./references/youtube-intros-and-video.md) | First-15-second retention hooks, presenter cutaway rules, lower-third plates, and 9:16 vertical Shorts safe zones |
