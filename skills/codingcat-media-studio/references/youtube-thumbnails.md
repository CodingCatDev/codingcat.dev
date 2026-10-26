# YouTube Thumbnails (16:9) Specification (`youtube-thumbnails.md`)

Every CodingCat.dev 16:9 YouTube thumbnail (`1920x1080px`) is engineered for instant mobile recognition, high click-through rate (CTR), and brand consistency.

## 1. The 3-Zone Composition Grid

| Zone | Placement | Visual Contents | Styling & Shadow Rules |
| :--- | :--- | :--- | :--- |
| **Zone 1: Character Cutout** | Left or Right Third | High-contrast cutout of **AJ the Cat** (2D `assets/AJ-2D-Bipedal.jpg` or 3D `assets/AJ-3D-Headphones-*.jpg` with headphones covering ears) **OR** die-cut cutout of **Alex Patterson (`@alex.patterson`)** (and podcast guest). | Apply `--cc-thumbnail-drop` (`0 12px 24px rgba(0, 0, 0, 0.85)`) and a subtle white sticker rim-light or Royal Purple (`#4B2E83`) / Lime (`#C5E86C`) backlight glow. |
| **Zone 2: Technical Subject** | Center / Opposite Two-Thirds | Simplified dark-mode **Excalidraw diagram** (3 boxes max) or a massive, recognizable **tech framework logo** (Astro, Sanity, Cloudflare, Hono) with glowing `#4B2E83` and `#C5E86C` accents. | Keep background in Canvas Obsidian (`#0F172A`) or Pure Void (`#000000`). |
| **Zone 3: Display Hook Text** | Top-Left or Top-Center | **Maximum 3 to 4 words** in extra-bold `Nunito` (`900`) or `Inter` (`800`) uppercase/title-case. Never repeat the exact video title word-for-word. | Crisp white (`#FFFFFF`) primary words paired with **1 Electric Lime (`#C5E86C`)** highlight word and hard drop shadow. |

## 2. Mandatory Safe Zones (`1920x1080px`)
1. **Outer Edge Margin (`96px`)**: Keep all text, logos, and character faces at least `96px` away from the top, bottom, left, and right edges.
2. **YouTube Timestamp Exclusion Zone (`320x120px` Bottom-Right)**: Never place text, logos, or AJ's face in the bottom-right `320x120px` corner where YouTube renders the video duration overlay.
3. **No Em-Dashes in Thumbnail Text**: Never use an em-dash character in thumbnail copy. Use a colon, arrow (`->`), or `VS` badge.
