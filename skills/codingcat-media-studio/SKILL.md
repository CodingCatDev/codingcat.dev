---
name: codingcat-media-studio
description: Visual and video generation rules for CodingCat.dev, including 2D upright bipedal and 3D vinyl-toy AJ the Cat mascot prompts, hand-drawn architecture diagrams, 16:9 YouTube thumbnails, and high-retention video intros. Activate whenever generating images, diagrams, thumbnails, or video scripts/storyboards.
---

# CodingCat.dev Media Studio Skill

This skill governs all visual media, mascot illustration prompts, hand-drawn architecture diagrams, YouTube thumbnails, and video production workflows for **CodingCat.dev**.

## Canonical Terminology Guardrail

- In user-facing UI text, captions, and badges, always call diagrams **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams** (never write the brand name `"Excalidraw"` in user-facing UI copy, and never call content `"Teardowns"` or `"Blueprints"`).
- Content pillars are strictly **Courses** (made of **Lessons**), **Podcasts** (made of **Episodes**), and **Blog** (made of **Blog Posts**).

## Canonical Reference Assets

Always ground multimodal image and video generation in the canonical reference files stored in `assets/`:
- `assets/AJHeadphones.png`: Canonical 2D vector head-and-collar emblem of AJ wearing `"CodingCat.dev Podcast"` over-ear headphones and the pastel rainbow hexagonal `"AJ"` tag.
- `assets/AJ-2D-Bipedal.jpg`: Canonical 2D flat vector full-body upright bipedal AJ standing on two legs.
- `assets/AJ-3D-Headphones-Front.jpg`: Canonical 3D stylized vinyl-toy front 3/4 turnaround render on a matte black pedestal.
- `assets/AJ-3D-Headphones-Left.jpg`: Canonical 3D stylized vinyl-toy left profile turnaround render.
- `assets/AJ-3D-Headphones-Right.jpg`: Canonical 3D stylized vinyl-toy right profile turnaround render.
- `assets/alex-likeness/alex-likeness-01.jpg` .. `assets/alex-likeness/alex-likeness-13.jpg`: Canonical `2048x2048` studio reaction & pointing portraits of **Alex Patterson** against `#000000` black (sourced from `https://photos.app.goo.gl/bmrt6shq5YKfG16SA`). Use `alex-likeness-10.jpg` or `alex-likeness-02.jpg` when Alex is placed on the right pointing left at a diagram, and `alex-likeness-11.jpg` when Alex is placed on the left pointing right at a diagram.
- `assets/logos/sanity-logos/`: Canonical **Sanity** brand logos (`Sanity-Full_logo/Sanity-Full_logo--white_on_black.png`, `Sanity-Symbol/Sanity-Symbol--white_on_black.png`, `Sanity-Logotype/Sanity-Logotype--white_on_black.png`, plus SVG & light-mode variants). **CRITICAL RULE**: Always read and use these official Sanity logos (angular zig-zag symbol + serif `Sanity` wordmark). **NEVER** generate or use the legacy red/coral square `"S"` icon.
- `assets/logos/firebase-brand-assets/` & `assets/logos/Amplify.png`: Official **Firebase** (Primary Lockup, Logomark, and Product Icons for Genkit, App Hosting, Data Connect, Firestore, etc.) and **AWS Amplify** brand logos.

## Reference Modules (`references/`)

| Reference File | Purpose |
| :--- | :--- |
| [`references/aj-mascot-prompts.md`](./references/aj-mascot-prompts.md) | Exact 2D upright bipedal vector prompt, 3D vinyl-toy turnaround prompt modifiers, and anatomical guardrails for AJ |
| [`references/excalidraw-diagrams.md`](./references/excalidraw-diagrams.md) | Hand-drawn architecture diagram style rules, `Virgil` labels, Coral `#FCA5A5` `✗` vs. Mint `#86EFAC` `✓` checkmarks |
| [`references/youtube-thumbnails.md`](./references/youtube-thumbnails.md) | 16:9 YouTube thumbnail composition, safe zones (`96px` edge, `320x120px` bottom-right clear), and 3-4 word `Nunito` display text rules |
| [`references/youtube-intros-and-video.md`](./references/youtube-intros-and-video.md) | First-15-second retention hooks, presenter cutaway rules, lower-third plates, and 9:16 vertical Shorts safe zones |
| [`references/google-flow-veo.md`](./references/google-flow-veo.md) | Google Flow (Veo 3.1) Ingredients-to-Video 3-slot casting, Frames-to-Video transitions, and Gemini App video prompts |
