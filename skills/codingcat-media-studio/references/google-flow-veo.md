# Gemini App & Google Flow (Veo 3.1) Video Generation Guide (`google-flow-veo.md`)

Instructions and proven prompt templates for generating brand-consistent **CodingCat.dev** videos using the **Gemini App (`gemini.google.com`)** and **Google Flow (`labs.google/fx/tools/flow` with Veo 3.1)**.

---

## 1. Platform Workflow Comparison: Gemini App vs. Google Flow vs. Antigravity MCP

| Capability | Gemini App (`gemini.google.com`) | Google Flow (`flow.google.com` / Veo 3.1) | Antigravity (`agy` Local Repo) |
| :--- | :--- | :--- | :--- |
| **Skill / Style Mechanism** | Upload `.skill.zip` or `.bundle.md` in **Skills** + save a **Gemini Style** | Use a **Custom System Prompt** in Flow or generate prompts via your Gemini Skill first | Automatic via `~/.gemini/config/skills/` and `/home/alex/codingcat.dev/skills/` |
| **Personal Likeness (`@alex.patterson`)** | Invoke `@alex.patterson` / `@codingcatthumbnails` + include the **Explicit Physical Likeness & Ownership Lock** (proven in `le9vMnfVm3fb`) | Upload `alex-likeness-*.jpg` & `AJ-3D-Headphones-*.jpg` into the **Ingredients Drawer** and tag with `@` | Referenced directly from `/home/alex/codingcat.dev/assets/alex-likeness/` |
| **Best Video Mode** | **9:16 Vertical Shorts & 16:9 Talking-Head Clips** with synchronized lip movement, spoken dialogue, and on-screen text cards | Multi-scene **Ingredients to Video** (up to 3 reference images) and **Frames to Video** transitions | Automated asset preparation, Remotion / FFmpeg assembly, and social publishing |

---

## 2. Proven Gemini App Talking-Head Video Formula (`le9vMnfVm3fb` Pattern)

When generating a 9:16 vertical Short or 16:9 talking-head clip of `@alex.patterson` directly inside the Gemini App with synchronized audio and lip movement, **always use this exact 5-block structure**:

```text
Cinematic 9:16 vertical video, photorealistic, 4k resolution. Front-facing talking head shot of @alex.patterson speaking directly to the camera with audio and synchronized lip movement.

Spoken Dialogue / Voiceover:
"[Insert punchy 12-to-20 word spoken script here. Zero em-dashes. Direct, authoritative Senior Solutions Engineer delivery.]"

Subject appearance and likeness:
A man in his mid-40s with short styled light-brown hair, warm blue-green eyes, and a neatly trimmed salt-and-pepper beard. Exact facial features, bone structure, and facial hair pattern matching the presenter from @codingcatthumbnails watermarked_img_7983427428736598214.jpg. He is wearing a clean black crew-neck t-shirt and a sleek round black smartwatch (Google Pixel Watch) on his left wrist. Both hands have no rings, and his right wrist is completely bare.

Action, delivery, and background setting:
Alex delivers a decisive, authoritative statement, looking straight down the lens with strong confidence. He brings both hands forward in a steady, natural hand gesture to punctuate the final line. A bold, clean text card snaps on-screen for a beat reading "[3-4 WORD ALL-CAPS HOOK]" before fading.
Background is a stylized purple and black checkered pattern extending edge-to-edge completely filling the background wall behind him, with zero ceiling showing. Rich purple rim lighting sculpting his shoulders and hair, razor-sharp focus on his face, crisp synchronized audio.

THIS IS ME I OWN ALL LIKENESS FOR VIDEO!
```

### Critical Guardrails for Gemini App Video Prompts
1. **Always Include the Ownership Declaration**: End talking-head prompts of `@alex.patterson` with `THIS IS ME I OWN ALL LIKENESS FOR VIDEO!` so safety filters recognize authorized first-party creator likeness usage.
2. **Lock Wrist & Hand Details**: Always specify `"sleek round black smartwatch (Google Pixel Watch) on his left wrist. Both hands have no rings, and his right wrist is completely bare."`
3. **Edge-to-Edge Studio Backdrop**: Specify `"extending edge-to-edge completely filling the background wall behind him, with zero ceiling showing"` so the camera never drifts upward into fake studio rafters.

---

## 3. Google Flow "Ingredients to Video" 3-Slot Casting Recipe

Veo 3.1 in Google Flow lets you anchor up to **3 reference images ("Ingredients")** per shot so faces, mascots, logos, and color palettes never drift across clips:

| Ingredient Slot | What to Upload from `assets/` | Purpose in Veo 3.1 |
| :--- | :--- | :--- |
| **Slot 1: Character / Presenter (`@Alex` or `@AJ`)** | `assets/alex-likeness/alex-likeness-10.jpg` (or `02`, `03`, `11`) **OR** `assets/AJ-3D-Headphones-Front.jpg` | Locks in Alex Patterson's exact facial likeness or AJ the Cat's 3D vinyl-toy proportions and headphones. |
| **Slot 2: Technical Subject (`@Diagram` or `@Logo`)** | Dark-mode Architecture Diagram (`#000000` canvas) **OR** official vendor logo (`Sanity-Full_logo--white_on_black.png`, Firebase, AWS Amplify) | Anchors the exact technical diagram or official brand mark. |
| **Slot 3: Studio Environment / Style (`@Studio`)** | Purple & black checkered studio wall or Dark Obsidian (`#0B1326` / `#0F172A`) backdrop | Maintains consistent Royal Purple (`#7C3AED`) and Electric Lime (`#C5E86C`) rim lighting across cuts. |
