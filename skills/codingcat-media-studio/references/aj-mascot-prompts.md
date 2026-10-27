# AJ the Cat & Alex Patterson Character Prompts (`aj-mascot-prompts.md`)

Canonical multimodal character prompts and anatomical guardrails for **AJ the Cat** and **Alex Patterson (`@alex.patterson`)** when generating thumbnails, bumpers, B-roll, and video clips in the Gemini App, Google Flow (Veo 3.1), and Imagen.

## 1. Choosing Between AJ the Cat and Alex Patterson (`@alex.patterson`)

| Dimension | Alex Patterson (`assets/alex-likeness/`) | AJ the Cat 3D (`assets/AJ-3D-Headphones-*.jpg`) | AJ the Cat 2D (`assets/AJ-2D-Bipedal.jpg`) |
| :--- | :--- | :--- | :--- |
| **Best Use Case** | Primary YouTube thumbnails, technical deep-dive presenter hooks, reaction cutouts, and talking-head Scene Builder clips | 1.5-second video bumper transitions, 3D B-roll stingers, and podcast intro animations | UI badges, Pro-Tip callout boxes, slide stickers, and 2D vector overlays |
| **Canonical Reference Files** | `alex-likeness-01.jpg` to `alex-likeness-13.jpg` (`2048x2048` on `#000000`) | `AJ-3D-Headphones-Front.jpg`, `Left.jpg`, `Right.jpg` | `AJ-2D-Bipedal.jpg`, `AJHeadphones.png` |
| **Lighting & Separation** | Studio key light with `--cc-thumbnail-drop` (`0 12px 24px rgba(0,0,0,0.85)`) and `#7C3AED` / `#FACC15` rim glow | Pixar-grade vinyl toy subsurface scattering with Royal Purple (`#7C3AED`) and Electric Lime (`#C5E86C`) rim light | Flat 2D vector with crisp white sticker border or `--cc-shadow-sketch` |

## 2. Alex Patterson (`@alex.patterson`) Reference Mapping

Always attach one to three canonical studio portraits from `assets/alex-likeness/` as **Ingredients** (in Google Flow) or **Reference Images** (in the Gemini App):

| Reference File | Pose & Expression | Recommended Video / Thumbnail Role |
| :--- | :--- | :--- |
| `alex-likeness-10.jpg` | Pointing left with left index finger, excited smile | **Primary Right-Third Anchor**: Pointing left toward an Architecture Diagram or logo |
| `alex-likeness-02.jpg` | Pointing left with right index finger, friendly smile | **Alternate Right-Third Anchor**: Conversational tutorial intro pointing left |
| `alex-likeness-11.jpg` | Pointing right with right index finger, excited smile | **Primary Left-Third Anchor**: Pointing right toward an Architecture Diagram or code block |
| `alex-likeness-03.jpg` | Mind-blown / shocked, both hands open near head | **High-CTR Hook (`0:00 - 0:05`)**: Reacting to a wild benchmark, outage, or architectural reveal |
| `alex-likeness-05.jpg` | Shrugging with both hands open ("Why?!") | **Trade-Off Matrix Intro**: Questioning legacy architecture complexity |
| `alex-likeness-06.jpg` | Celebrating with double fist-pump | **Shipped / Verdict Clip**: Celebrating a passing build or sub-5ms edge deploy |
| `alex-likeness-12.jpg` | Stroking chin thoughtfully, looking left | **Deep-Dive Architecture Analysis**: Evaluating system trade-offs |
| `alex-likeness-13.jpg` | Facepalm covering forehead | **Post-Mortem / Anti-Pattern Clip**: Reacting to a production bug or config nightmare |

## 3. Copy-Pasteable Prompts for AJ the Cat

### 3D Vinyl-Toy AJ Prompt (For Video Bumpers & 3D Renders)
```text
3D stylized Pixar-grade vinyl toy render of AJ the Cat, a friendly anthropomorphic matte-black cat mascot (#0B0B0E) standing upright on two hind legs with a dark charcoal-gray oval belly patch (#2D2D30). AJ has huge expressive Electric Lime Green (#C5E86C) eyes with vertical black pupils, a small pink triangular nose, three white whiskers per cheek, and a cheerful open-mouth smile showing a pink tongue. Wearing dark charcoal over-ear headphones that fit directly over his cat ears with "CodingCat.dev Podcast" printed in clean white text across the top headband, Royal Purple (#4B2E83) and Soft Lavender (#B4A7D6) earcups, and a Soft Lavender collar holding a pastel rainbow hexagonal "AJ" tag. Lit with cinematic Royal Purple (#7C3AED) and Electric Lime (#C5E86C) rim lighting against a dark obsidian (#0B1326) studio background.
```

### 2D Upright Bipedal Vector AJ Prompt (For Stickers & UI Illustrations)
```text
2D flat vector illustration of AJ the Cat standing upright on two hind legs, friendly anthropomorphic black cat mascot (#0B0B0E) with a charcoal-gray oval belly patch (#2D2D30), huge Electric Lime Green (#C5E86C) eyes, pink nose, three white whiskers on each cheek, wearing over-ear headphones covering his ears with Royal Purple (#4B2E83) and Soft Lavender (#B4A7D6) earcups and a pastel rainbow hexagonal "AJ" collar tag. Clean bold vector outlines, dark chalkboard obsidian (#0B1326) background.
```
