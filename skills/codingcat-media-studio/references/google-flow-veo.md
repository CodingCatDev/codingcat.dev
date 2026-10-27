# Google Flow & Gemini App Video Generation Guide (`google-flow-veo.md`)

Instructions and prompt templates for generating brand-consistent **CodingCat.dev** videos using **Google Flow** (`labs.google/fx/tools/flow` with **Veo 3.1**) and the **Gemini App** (`gemini.google.com`).

## 1. Platform Workflow Comparison: Gemini App vs. Google Flow vs. Antigravity MCP

| Capability | Gemini App (`gemini.google.com`) | Google Flow (`flow.google.com` / Veo 3.1) | Antigravity / Claude Code / Cursor |
| :--- | :--- | :--- | :--- |
| **Skill / Rule Mechanism** | Upload `.zip` or `.bundle.md` in **Settings -> Skills** (or attach to a custom **Gem**) | Use a **Custom Agent / System Prompt** in Flow chat or generate prompts via your Gemini Skill first | Automatic via `~/.gemini/config/skills/` and the `codingcat-agent-toolkit` MCP server |
| **Personalization Photos (`alex-likeness`)** | Attach `alex-likeness-*.jpg` directly in chat or store in a **Gem's Knowledge files** | Upload `alex-likeness-*.jpg` & `AJ-3D-Headphones-*.jpg` into the project **Ingredients Drawer** and tag with `@` | Referenced directly from `/home/alex/codingcat.dev/assets/alex-likeness/` |
| **Best Video Mode** | Rapid single-clip generation, script writing, and storyboard breakdown | Multi-scene **Ingredients to Video** (up to 3 reference images), **Frames to Video** transitions, and **Scene Builder** timelines | Automated asset preparation, FFmpeg / Remotion assembly, and social publishing |

## 2. Google Flow "Ingredients to Video" 3-Slot Casting Recipe

Veo 3.1 in Google Flow lets you anchor up to **3 reference images ("Ingredients")** per shot so faces, mascots, logos, and color palettes never drift across clips. Always cast the 3 slots using this structure:

| Ingredient Slot | What to Upload from `assets/` | Purpose in Veo 3.1 |
| :--- | :--- | :--- |
| **Slot 1: Character / Presenter (`@Alex` or `@AJ`)** | `assets/alex-likeness/alex-likeness-10.jpg` (or `02`, `03`, `11`) **OR** `assets/AJ-3D-Headphones-Front.jpg` | Locks in Alex Patterson's exact facial likeness, glasses/beard/wardrobe, or AJ the Cat's 3D vinyl-toy proportions and headphones. |
| **Slot 2: Technical Subject (`@Diagram` or `@Logo`)** | Dark-mode Architecture Diagram (`#000000` canvas) **OR** official vendor logo (`Sanity-Full_logo--white_on_black.png`, Firebase, AWS Amplify) | Anchors the exact technical diagram or official brand mark (preventing hallucinated logos like the old red Sanity square). |
| **Slot 3: Studio Environment / Style (`@Studio`)** | Dark Obsidian studio background (`#0B1326` / `#0F172A`) or a previous frame saved from your Flow timeline | Maintains consistent Royal Purple (`#7C3AED`) and Electric Lime (`#C5E86C`) rim lighting across every cut in Scene Builder. |

## 3. Google Flow "Frames to Video" Recipes for the 15-Second Hook

Use **Frames to Video** (Start Frame + End Frame) in Google Flow to animate the signature CodingCat.dev 15-second retention hook:

1. **Beat 1 (`0:00 - 0:05` | The Pain Point)**:
   - **Start Frame**: `assets/alex-likeness/alex-likeness-03.jpg` (shocked/mind-blown) or `alex-likeness-10.jpg` composited on `#0B1326` obsidian.
   - **Motion Prompt**:
     ```text
     Locked-off medium studio shot on 35mm lens. @Alex reacts with expressive hand gestures and points toward the left side of the frame where a floating dark-mode architecture diagram materializes. Crisp studio key light, subtle Royal Purple (#7C3AED) and Electric Lime (#C5E86C) rim lighting on pure dark obsidian (#0B1326) background.
     ```
2. **Beat 2 (`0:05 - 0:10` | Visual Architecture Reveal)**:
   - **Start Frame**: Dark-mode hand-drawn Architecture Diagram (`#000000` canvas, Coral `#FCA5A5` `X` on the legacy left side).
   - **End Frame**: Complete Architecture Diagram with glowing Mint (`#86EFAC`) and Electric Lime (`#C5E86C`) checkmark on the recommended edge architecture.
   - **Motion Prompt**:
     ```text
     Flat 2D dark-mode whiteboard animation on a pure black (#000000) canvas. Hand-drawn white (#FFFFFF) and Soft Lavender (#B4A7D6) sketchy arrows animate from left to right, lighting up the Royal Purple (#4B2E83) cross-hatched worker node with a glowing Electric Lime (#C5E86C) checkmark. Crisp high-contrast 60fps motion graphics.
     ```
3. **Beat 3 (`0:10 - 0:15` | 3D AJ Bumper Stinger)**:
   - **Start Frame**: `assets/AJ-3D-Headphones-Left.jpg`
   - **End Frame**: `assets/AJ-3D-Headphones-Front.jpg`
   - **Motion Prompt**:
     ```text
     Smooth gimbal arc shot around @AJ, a 3D vinyl-toy black cat mascot standing upright on two legs wearing over-ear "CodingCat.dev Podcast" headphones and a pastel rainbow hexagonal "AJ" collar tag. AJ turns toward the camera, nods to the beat, and gives a cheerful smile as his Electric Lime Green (#C5E86C) eyes catch the studio rim light. Subtle dark obsidian (#0B1326) studio backdrop with soft purple bokeh.
     ```

## 4. Camera, Lighting & Audio Tokens for Veo 3.1

Always include these three token blocks when prompting Veo 3.1 in Google Flow or the Gemini App:
- **Camera Framing**: Specify `"locked-off tripod medium shot"`, `"slow 35mm dolly-in"`, or `"smooth gimbal arc"`. Avoid handheld shake on technical diagrams.
- **Color & Lighting Palette**: Specify `"Canvas Obsidian (#0B1326 / #0F172A) background, CodingCat Royal Purple (#7C3AED) key rim light, and Electric Lime (#C5E86C) accent glow"`.
- **Native Audio Cues**: Specify `"clean studio room tone, subtle low-fi synth pulse underscore, crisp tactile UI pop on diagram checkmarks"`.
