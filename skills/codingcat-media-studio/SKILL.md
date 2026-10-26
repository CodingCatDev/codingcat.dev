---
name: codingcat-media-studio
description: Visual and video generation rules for CodingCat.dev, including 2D upright bipedal and 3D vinyl-toy AJ the Cat mascot prompts, dark-mode Excalidraw architecture diagrams, 16:9 YouTube thumbnails, and high-retention video intros. Activate whenever generating images, diagrams, thumbnails, or video scripts/storyboards.
---

# CodingCat.dev Media Studio Skill

This skill governs all visual media, mascot illustration prompts, dark-mode Excalidraw diagrams, YouTube thumbnails, and video production workflows for **CodingCat.dev**.

## Canonical Reference Assets

Always ground multimodal image and video generation in the canonical reference files stored in `assets/`:
- `assets/AJHeadphones.png`: Canonical 2D vector head-and-collar emblem of AJ wearing `"CodingCat.dev Podcast"` over-ear headphones and the pastel rainbow hexagonal `"AJ"` tag.
- `assets/AJ-2D-Bipedal.jpg`: Canonical 2D flat vector full-body upright bipedal AJ standing on two legs.
- `assets/AJ-3D-Headphones-Front.jpg`: Canonical 3D stylized vinyl-toy front 3/4 turnaround render on a matte black pedestal.
- `assets/AJ-3D-Headphones-Left.jpg`: Canonical 3D stylized vinyl-toy left profile turnaround render.
- `assets/AJ-3D-Headphones-Right.jpg`: Canonical 3D stylized vinyl-toy right profile turnaround render.

## Reference Modules (`references/`)

| Reference File | Purpose |
| :--- | :--- |
| [`references/aj-mascot-prompts.md`](./references/aj-mascot-prompts.md) | Exact 2D upright bipedal vector prompt, 3D vinyl-toy turnaround prompt modifiers, and anatomical guardrails for AJ |
| [`references/excalidraw-diagrams.md`](./references/excalidraw-diagrams.md) | Dark-mode Excalidraw architecture rules (`#000000` / `#0F172A`), `Virgil` / `Excalifont` labels, Coral `#FCA5A5` `X` vs. Mint `#86EFAC` / Lime `#C5E86C` checkmarks |
| [`references/youtube-thumbnails.md`](./references/youtube-thumbnails.md) | 16:9 YouTube thumbnail composition, safe zones (`96px` edge, `320x120px` bottom-right clear), and 3-4 word `Nunito` display text rules |
| [`references/youtube-intros-and-video.md`](./references/youtube-intros-and-video.md) | First-15-second retention hooks, presenter cutaway rules, lower-third plates, and 9:16 vertical Shorts safe zones |
