---
name: codingcat-media-studio
description: Visual and video generation rules for CodingCat.dev, including Gemini App Avatar (@alex.patterson) & Style workflows, 2D/3D AJ the Cat mascot prompts, hand-drawn dark-mode Excalidraw architecture diagrams, 16:9 YouTube thumbnails, and Veo 3.1 / Gemini App video prompts. Activate whenever generating images, diagrams, thumbnails, or video scripts/storyboards.
---

# CodingCat.dev Media Studio Skill

This skill governs all visual media, mascot illustration prompts, hand-drawn dark-mode architecture diagrams, YouTube thumbnails, and video production workflows for **CodingCat.dev** across **Gemini App (`gemini.google.com`)**, **Google Flow (`Veo 3.1`)**, and **Google Antigravity (`agy`)**.

## 0. Mandatory Pre-Tool Prompt Compiler & Reference Attachment Rule

1. **Always Attach Bundled Reference Images (`assets/*`) on the First Tool Call**:
   Before calling your image generation tool, you **MUST** load and pass the actual PNG/JPG files from `assets/` (and from any `@`-mentioned skill like `@sanity-brand-guidelines`, `@sanitybrand`, `@alex.patterson`, or `@codingcatthumbnails`) as **input reference images** to the image generation tool call:
   - `assets/excalidraw-thumbnail-left-pose.png` or `assets/excalidraw-thumbnail-right-pose.png` (authentic Rough.js double-stroked white boxes, 45-degree diagonal hachure fills, Coral `X`, and green checkmark; **NEVER** draw a macOS window with red/yellow/green dots or circular UI icons).
   - `assets/Sanity-Full_logo--white_on_black.png` and `assets/Sanity-Symbol--white_on_black.png` (official stepped diagonal 3-line geometric symbol + bold serif `Sanity` wordmark; **NEVER** invent a red square `"S"` app icon).
   - `assets/alex_pointing_left.jpg` or `assets/alex_mind_blown.jpg` (photorealistic studio cutout of `@alex.patterson`).
2. **Compile Any 1-Sentence Request into the Full 6-Part Prompt**:
   Whenever the user asks for a diagram, thumbnail, or video with a short 1-sentence request (for example, *"Create a diagram for Sanity Content Releases"* or *"Make a thumbnail for WebMCP"*), **YOU (Gemini) must automatically compile their short request into the full 6-Part Zero-Shot Excalidraw Prompt in `references/excalidraw-diagrams.md` (or the 3-Zone Thumbnail Prompt in `references/youtube-thumbnails.md`) and pass that full expanded prompt into the image generation tool**. Never pass a short unexpanded summary to the image generator, and never ask the user to copy-paste the template themselves.

## 1. Environment-Aware Asset & Likeness Resolution (Gemini App vs. Antigravity)

Because **Gemini App (`gemini.google.com`)** uses **Avatar (`@alex.patterson`) + Styles + Skills** (rather than legacy Gems with attached photo folders), always resolve likenesses, brand marks, and styles based on the active runtime:

| Asset / Element | In Gemini App (`gemini.google.com`) | In Google Antigravity (`agy` Local Repo) |
| :--- | :--- | :--- |
| **Alex Patterson Likeness** | Invoke `@alex.patterson` (or `@codingcatthumbnails`) + always include the **Explicit Physical Likeness Lock** in the image/video prompt (mid-40s Caucasian man, short light-brown hair, blue-green eyes, trimmed salt-and-pepper beard, **NO glasses**, black crew-neck t-shirt, round black Pixel Watch on left wrist, no rings). | Read directly from `assets/alex-likeness/alex-likeness-01.jpg` .. `13.jpg` (`10.jpg`/`02.jpg` pointing left; `11.jpg` pointing right; `03.jpg`/`04.jpg` mind-blown). |
| **Vendor Brand Logos (Sanity, Firebase, Amplify)** | Invoke `@sanitybrand` (or attach official white-on-black PNG) and explicitly specify: `"stepped diagonal 3-line geometric zig-zag symbol + bold serif Sanity wordmark, NEVER a red square or lightning bolt"`. | Read directly from `assets/logos/sanity-logos/Sanity-Full_logo/Sanity-Full_logo--white_on_black.png`, `assets/logos/firebase-brand-assets/`, and `assets/logos/Amplify.png`. |
| **Hand-Drawn Architecture Diagrams** | Expand every diagram request into the **6-Part Zero-Shot Excalidraw Geometry Prompt** in `references/excalidraw-diagrams.md` (double-stroked wobbly white outlines, 45-degree diagonal hachure line fills, max 4-5 nodes, 2-3 word Virgil labels, zero hex code text rendered on canvas). | Use `references/excalidraw-diagrams.md` or render interactive SVG diagrams via `ExcalidrawDiagram.astro`. |
| **AJ the Cat Mascot** | Use the self-contained 2D/3D anatomical prompt lock in `references/aj-mascot-prompts.md`. | Ground in `assets/AJHeadphones.png`, `assets/AJ-2D-Bipedal.jpg`, and `assets/AJ-3D-Headphones-*.jpg`. |

## 2. Canonical Terminology Guardrail

- In user-facing UI text, captions, and badges, always call diagrams **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams** (never write the brand name `"Excalidraw"` in user-facing UI copy, and never call content `"Teardowns"` or `"Blueprints"`).
- Content pillars are strictly **Courses** (made of **Lessons**), **Podcasts** (made of **Episodes**), and **Blog** (made of **Blog Posts**).
- **Never Print Hex Codes as Visible Text**: When expanding color tokens (`#000000`, `#C5E86C`, `#FCA5A5`, `#B4A7D6`) into an image generation prompt, always instruct the image generator: `"Use these colors strictly for rendering; never write hex codes or metadata text onto the image canvas."`

## 3. Reference Modules (`references/`)

| Reference File | Purpose |
| :--- | :--- |
| [`references/excalidraw-diagrams.md`](./references/excalidraw-diagrams.md) | **6-Part Zero-Shot Excalidraw Prompt Expander**, Gemini App `Style` preset, Rough.js double-stroke + hachure geometry rules, and Gemini Canvas interactive SVG mode |
| [`references/youtube-thumbnails.md`](./references/youtube-thumbnails.md) | 16:9 YouTube thumbnail 3-zone grid, `@alex.patterson` non-overlapping likeness lock, and brand logo rules |
| [`references/google-flow-veo.md`](./references/google-flow-veo.md) | Gemini App 9:16 & 16:9 talking-head video prompts (`@alex.patterson` with synced audio) + Google Flow (Veo 3.1) 3-slot recipes |
| [`references/aj-mascot-prompts.md`](./references/aj-mascot-prompts.md) | Self-contained 2D upright bipedal vector prompt and 3D vinyl-toy turnaround prompt modifiers for AJ |
| [`references/youtube-intros-and-video.md`](./references/youtube-intros-and-video.md) | First-15-second retention hooks, presenter cutaway rules, lower-third plates, and 9:16 vertical Shorts safe zones |
