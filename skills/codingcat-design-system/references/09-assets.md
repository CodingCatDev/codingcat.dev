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

## Strict Anatomical & Visual Rules for AJ the Cat
Whenever selecting, compositing, or generating new poses of AJ using the reference images above, enforce every single trait below:
1. **Upright Bipedal Posture (Full-Body)**: AJ stands upright on two hind legs like a friendly anthropomorphic mascot (never on all fours as a feral cat), with a dark charcoal-gray oval belly patch (`#2D2D30`) on his matte black fur (`#0B0B0E`).
2. **Over-Ear Headphones Covering Ears**: AJ wears dark charcoal over-ear headphones with `"CodingCat.dev Podcast"` printed in clean white text across the top headband. The Royal Purple (`#4B2E83`) and Soft Lavender (`#B4A7D6`) earcups fit **over and around** his cat ears (with pink inner ear triangles peeking underneath the headband) and feature the pastel rainbow hexagonal `"AJ"` emblem on the outer earcup.
3. **Collar & Hexagonal `"AJ"` Tag**: Around AJ's neck is a Soft Lavender (`#B4A7D6`) collar holding a matching pastel rainbow hexagonal tag with `"AJ"` in bold Royal Purple (`#4B2E83`) lettering.
4. **Eyes & Expression**: Huge, expressive Electric Lime Green (`#C5E86C`) eyes with vertical oval black pupils and crisp white catchlights, paired with a small pink triangular nose, three white whiskers per cheek, and a cheerful open-mouth smile showing a pink tongue.
5. **Thumbnail Separation**: When compositing AJ onto a `#0F172A` or `#000000` thumbnail canvas, apply `--cc-thumbnail-drop` (`0 12px 24px rgba(0, 0, 0, 0.85)`) or a crisp white sticker rim-light so his black fur separates cleanly from dark backgrounds.
