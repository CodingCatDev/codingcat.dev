# YouTube Intros, Hooks & Video Motion Rules (`youtube-intros-and-video.md`)

Guidelines for scripting, storyboarding, and editing YouTube tutorials, technical deep-dive explainers, podcasts, and 9:16 vertical Shorts on CodingCat.dev.

## 1. The First-15-Second Retention Hook
Never open a video with *"Hey guys, welcome back to the channel, don't forget to like and subscribe."* Viewers decide in the first 15 seconds whether the video delivers on the thumbnail's promise.

| Timestamp | Beat | Audio (`@alex.patterson`) | Visual Cue |
| :--- | :--- | :--- | :--- |
| **`0:00 - 0:05`** | **The Pain Point** | State the exact engineering problem or debunk the marketing hype in one punchy sentence. | Full-screen `@alex.patterson` camera or immediate screen recording of the bug/bottleneck. |
| **`0:05 - 0:10`** | **Visual Architecture Preview** | Explain the mental model we are about to use to fix it. | Animated dark-mode Excalidraw diagram (`#000000` canvas, `#FFFFFF` & `#B4A7D6` strokes, `#C5E86C` checkmark). |
| **`0:10 - 0:15`** | **Proof & Transition** | Show the finished working app or benchmark table, then say *"Let's build it."* | Quick flash of the working terminal/UI + 1.5-second AJ 3D headphone bumper transition. |

## 2. Motion Graphics & Lower-Third Plates
- **Lower-Third Speaker Plate**:
  - Surface: `#1E293B` (`--cc-surface`) with `rounded-xl` (`12px`) corners and `border-l-4 border-[#C5E86C]`.
  - Name Text: `Nunito` ExtraBold (`800`), `#F8FAFC`, `24px`.
  - Handle / Role Text: `JetBrains Mono` Medium (`500`), `#B4A7D6`, `16px` (for example, `@alex.patterson | CodingCat.dev`).
- **Chapter Divider Cards**:
  - Background: `#0F172A` with subtle `--cc-glow-purple` radial gradient.
  - Chapter Number: `JetBrains Mono` pill in `#C5E86C` text on `#4B2E83`/40 background.
  - Chapter Title: `Nunito` Black (`900`), `#F8FAFC`, `48px` (zero em-dashes).

## 3. Vertical Video (9:16 Shorts / Reels / TikTok) Safe Zones
When repurposing tutorials or podcast clips into `1080x1920px` vertical videos:
- **Top `250px` Clear**: Keep free of burned-in captions or diagram headers.
- **Bottom `420px` Clear**: Keep free of captions or code lines so platform descriptions and audio tickers do not block the code.
- **Right `140px` Rail Clear (Lower Half)**: Keep clear of critical diagram nodes for the platform like/comment/share buttons.
- **Active Caption Styling**: Center-aligned `Nunito` `900` (`#FFFFFF` with `#C5E86C` active spoken word highlight and heavy black stroke/drop shadow) positioned in the safe middle band (`Y: 850px` to `1350px`).
