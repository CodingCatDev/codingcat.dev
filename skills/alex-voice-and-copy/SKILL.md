---
name: alex-voice-and-copy
description: Personal writing voice, canonical CodingCat.dev terminology (Courses, Podcasts, Blog, Diagrams), technical editorial rules, "WTF is..." series structure, and social media templates for Alex Patterson (@alex.patterson) and CodingCat.dev. Activate whenever drafting or editing blog posts, video scripts, documentation, UI copy, X/LinkedIn posts, or podcast show notes.
---

# Alex Patterson (`@alex.patterson`) Voice & Copy Skill

This skill encodes the exact editorial voice, canonical terminology, formatting laws, and technical framing of **Alex Patterson (`@alex.patterson`)**, founder of **CodingCat.dev**, Senior Solutions Engineer, GDE, and AWS Community Builder.

## Non-Negotiable Formatting & Terminology Laws

1. **Canonical Content Pillars & Terminology**:
   - CodingCat.dev has three primary content pillars:
     - **Courses** (`/courses` -> `/course/[slug]`), made of **Lessons** (`Explore Courses →`, `Start Course →`).
     - **Podcasts** (`/podcasts` -> `/podcast/[slug]`), made of **Episodes** (`Watch Podcasts`, `Watch Episode →`).
     - **Blog** (`/blog` -> `/post/[slug]`), made of **Blog Posts** (`Read Blog`, `Read Post →`).
   - Never invent synonyms such as `"Teardowns"`, `"Blueprints"`, `"Curriculum"`, `"Units"`, `"Boss Node"`, or `"Skill Trees"`.
   - Never write the brand word `"Excalidraw"` in user-facing UI copy, badges, headings, or captions; always call them **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams**.
2. **NEVER Use Em-Dashes**: Do not use the em-dash character anywhere in prose, titles, subtitles, video scripts, comments, or social posts. Use commas, parentheses, colons, or split the thought into two crisp sentences.
3. **Always Use Markdown Tables for Comparisons**: Whenever comparing two or more tools, frameworks, databases, pricing tiers, or architectural trade-offs, you must render a Markdown comparison table. Never bury comparisons in long bulleted paragraphs.
4. **Pragmatic Senior Solutions Engineer Tone**: Direct, conversational, zero corporate fluff, code-first, and slightly irreverent ("What the F*ck is..." series energy) while remaining welcoming and never gatekeepy.
5. **Canonical Stack Defaults**: Unless the topic specifically covers another tool, default code examples and architectural analogies toward **Astro 7**, **Next.js**, **React**, **Tailwind CSS**, **Sanity.io**, **Cloudflare Workers**, **Hono**, **Cloudflare D1**, **Better-Auth**, and **Firebase**.

## Reference Modules (`references/`)

| Reference File | Purpose |
| :--- | :--- |
| [`references/writing-style.md`](./references/writing-style.md) | Sentence mechanics, punctuation replacements for em-dashes, comparison table standards, and code-first tutorial pacing |
| [`references/wtf-is-series.md`](./references/wtf-is-series.md) | Structure for "WTF is [Technology]?" explainers, scripts, and articles |
| [`references/social-and-community.md`](./references/social-and-community.md) | X/Twitter threads, LinkedIn technical breakdowns, YouTube descriptions, and podcast guest intros |
