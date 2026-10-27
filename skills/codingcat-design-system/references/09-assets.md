# 09. Assets: Canonical AJ Mascot & Visual Reference Sheet

All canonical mascot files live in `/home/alex/codingcat.dev/assets/` (and are synced to `~/code/codingcatdev-agent-toolkit/assets/`).

## Canonical Asset Manifest

| Asset ID | Repository Path | Format & Style | Primary Usage |
| :--- | :--- | :--- | :--- |
| `aj_headphones` | `assets/AJHeadphones.png` | 2D flat vector head emblem on transparent background | UI avatars, AJ Callout / Pro-Tip boxes, badges, watermarks, and site navigation emblems. |
| `aj_2d_bipedal` | `assets/AJ-2D-Bipedal.jpg` | 2D flat vector full-body upright bipedal AJ standing on two legs | Hero sections, empty states, stickers, slide decks, and 2D character reference prompts. |
| `aj_3d_headphones_front` | `assets/AJ-3D-Headphones-Front.jpg` | 3D stylized vinyl-toy / Pixar-grade render (front 3/4 view on pedestal) | YouTube thumbnails, 3D video bumpers, hero feature cards, and multimodal 3D character references. |
| `aj_3d_headphones_left` | `assets/AJ-3D-Headphones-Left.jpg` | 3D stylized vinyl-toy render (left profile turnaround) | Side-facing thumbnail reactions (looking right toward a diagram) and 3D modeling reference. |
| `aj_3d_headphones_right` | `assets/AJ-3D-Headphones-Right.jpg` | 3D stylized vinyl-toy render (right profile turnaround) | Side-facing thumbnail reactions (looking left toward a diagram) and 3D modeling reference. |
| `alex_likeness_library` | `assets/alex-likeness/alex-likeness-01.jpg` .. `13.jpg` | `2048x2048` studio portraits of Alex Patterson against pure `#000000` black | Multimodal character likeness reference & cutouts for 16:9 YouTube thumbnails, blog covers, and social graphics. |
| `sanity_official_logos` | `assets/logos/sanity-logos/` (`Sanity-Full_logo`, `Sanity-Symbol`, `Sanity-Logotype`) | Official Sanity brand assets (white-on-black, black-on-white, SVG/PNG) | **Always use these official Sanity logos** (the angular zig-zag symbol + serif `Sanity` wordmark). **NEVER** use the legacy red-square `"S"` icon. |
| `firebase_official_logos` | `assets/logos/firebase-brand-assets/` | Official Firebase Primary Lockups, Logomarks, and Product Icons (Genkit, App Hosting, Data Connect, Vertex AI, etc.) | Thumbnails, blog covers, and architecture diagrams referencing Firebase products. |
| `aws_amplify_logo` | `assets/logos/Amplify.svg` & `assets/logos/Amplify.png` | Official AWS Amplify logo | Thumbnails, blog covers, and diagrams referencing AWS Amplify. |

## Canonical Alex Patterson Studio Likeness Library (`assets/alex-likeness/`)

All 13 studio portraits from the canonical likeness album (`https://photos.app.goo.gl/bmrt6shq5YKfG16SA`) are `2048x2048` high-resolution images on a pure `#000000` studio black background, stored in `assets/alex-likeness/` across `/home/alex/codingcat.dev`, `/home/alex/codingcat-social-agent`, and `~/code/codingcatdev-agent-toolkit`:

| File | Pose & Direction | Best Thumbnail / Cover Placement |
| :--- | :--- | :--- |
| `assets/alex-likeness/alex-likeness-01.jpg` | Pointing up-right with left index finger, looking up-right with curious expression | Bottom-left placement pointing up-right toward header hook or diagram |
| `assets/alex-likeness/alex-likeness-02.jpg` | Pointing left with right index finger, friendly smile looking at camera | **Right-third placement** pointing left at an architecture diagram |
| `assets/alex-likeness/alex-likeness-03.jpg` | Mind-blown / shocked with both hands open near head | Breaking news, CVEs, wild benchmarks, or `"WTF is..."` deep dives |
| `assets/alex-likeness/alex-likeness-04.jpg` | Surprised / wide-eyed with both hands framing head | Unexpected framework changes or production incident stories |
| `assets/alex-likeness/alex-likeness-05.jpg` | Shrugging with both hands open (`"Why / What?!"` pose) | Trade-off comparisons, anti-patterns, or myth-busting covers |
| `assets/alex-likeness/alex-likeness-06.jpg` | Celebrating / double fist-pump with huge smile | Major releases, shipped milestones, or performance wins |
| `assets/alex-likeness/alex-likeness-07.jpg` | Cupping left ear (`"Listen to this"` pose) | Podcast episode covers or hot-take discussions |
| `assets/alex-likeness/alex-likeness-08.jpg` | Double thumbs-up with big smile | Recommended tools, best-practice guides, and cheat sheets |
| `assets/alex-likeness/alex-likeness-09.jpg` | Pointing straight up (`"Aha / Idea!"` pose) with left index finger | Top-banner callouts or key architectural insights |
| `assets/alex-likeness/alex-likeness-10.jpg` | Pointing left with left index finger, excited open-mouth smile | **Right-third placement (Primary)** pointing left directly at a diagram |
| `assets/alex-likeness/alex-likeness-11.jpg` | Pointing right with right index finger, excited open-mouth smile | **Left-third placement (Primary)** pointing right directly at a diagram |
| `assets/alex-likeness/alex-likeness-12.jpg` | Thinking / stroking chin with left hand, looking left thoughtfully | Architectural trade-offs, system design evaluations, and debugging |
| `assets/alex-likeness/alex-likeness-13.jpg` | Facepalm covering forehead/right eye (`"Oh no / Bug"` pose) | Post-mortems, security vulnerabilities, or painful dev mistakes |

## Strict Anatomical & Visual Rules for AJ the Cat
Whenever selecting, compositing, or generating new poses of AJ using the reference images above, enforce every single trait below:
1. **Upright Bipedal Posture (Full-Body)**: AJ stands upright on two hind legs like a friendly anthropomorphic mascot (never on all fours as a feral cat), with a dark charcoal-gray oval belly patch (`#2D2D30`) on his matte black fur (`#0B0B0E`).
2. **Over-Ear Headphones Covering Ears**: AJ wears dark charcoal over-ear headphones with `"CodingCat.dev Podcast"` printed in clean white text across the top headband. The Royal Purple (`#4B2E83`) and Soft Lavender (`#B4A7D6`) earcups fit **over and around** his cat ears (with pink inner ear triangles peeking underneath the headband) and feature the pastel rainbow hexagonal `"AJ"` emblem on the outer earcup.
3. **Collar & Hexagonal `"AJ"` Tag**: Around AJ's neck is a Soft Lavender (`#B4A7D6`) collar holding a matching pastel rainbow hexagonal tag with `"AJ"` in bold Royal Purple (`#4B2E83`) lettering.
4. **Eyes & Expression**: Huge, expressive Electric Lime Green (`#C5E86C`) eyes with vertical oval black pupils and crisp white catchlights, paired with a small pink triangular nose, three white whiskers per cheek, and a cheerful open-mouth smile showing a pink tongue.
5. **Thumbnail Separation**: When compositing AJ onto a `#0F172A` or `#000000` thumbnail canvas, apply `--cc-thumbnail-drop` (`0 12px 24px rgba(0, 0, 0, 0.85)`) or a crisp white sticker rim-light so his black fur separates cleanly from dark backgrounds.

## Interactive 2D Vector Bone Rig (`AjAnimatedMascot.astro` & `/mascot-lab`)

All web UI mascot placements use `<AjAnimatedMascot />` (`apps/site/src/components/AjAnimatedMascot.astro` + modular 57-path bone rig in `apps/site/src/components/aj-rig/`) with zero external JS runtime dependencies:

| Variant / Component | SVG `viewBox` | Supported Angles (`angle` prop) | Active Rig Features | Canonical Placement on CodingCat.dev |
| :--- | :--- | :--- | :--- | :--- |
| `<AjAnimatedMascot variant="full-body" />` | `0 0 560 1030` | `three-quarter-right` (default) or `three-quarter-left` (counter-flipped readable text) | Full 57-layer traced skeleton: `#aj-shadow`, `#aj-sticker-underlay`, `#aj-tail`, `#aj-leg-right`, `#aj-leg-left`, `#aj-arm-left`, `#aj-torso`, `#aj-arm-right`, `#aj-head-group`, `#aj-collar` | Homepage Hero (`AnimatedHero.astro`), Courses Path Milestones (`courses/index.astro`), About Hero (`about.astro`), 404 Page (`404.astro`), and `/mascot-lab` (`112px to 260px`). |
| `<AjAnimatedMascot variant="head" />` | `10 12 540 676` | `three-quarter-right` or `three-quarter-left` | Shared upper skeleton (`#aj-head-group` + `#aj-collar` + `#aj-hex-tag`) with cursor pupil tracking, double-blink, and switchable mouth visemes (`smile-open`, `grin`, `surprised-o`, `talking`) | Visual Diagram Header Cards (`ExcalidrawBlueprintCard.astro`), Agent AJ Chat Drawer Header (`ChatModal.astro`), Sign-In Header (`sign-in.astro`), and inline AJ Pro-Tip Callouts (`40px to 96px`). |
| `<AjHeadphones />` | `0 0 276 275` | Static | Static zero-JS vector emblem | Top Navbar Medallion (`Header.astro`), Footer Medallion (`Footer.astro`), and OG Image Renderer (`og-mascots.ts`) (`24px to 40px`). |
