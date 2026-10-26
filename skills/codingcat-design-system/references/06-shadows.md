# 06. Shadows & Elevation: Dark-Mode Glows & Borders

Because CodingCat.dev is dark-mode-first (`#0F172A` Canvas Obsidian), traditional dark drop shadows alone do not create clear surface hierarchy. Elevation combines subtle top-border specular highlights (`1px solid rgba(180, 167, 214, 0.15)`) with deep ambient drop shadows and brand-colored neon glows.

## Canonical Shadow & Glow Tokens

| CSS Variable | Token Name | CSS Value | Usage Rules |
| :--- | :--- | :--- | :--- |
| `--cc-shadow-card` | `shadow.card` | `0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` | Default resting elevation for Surface Slate (`#1E293B`) bento cards, modals, and code containers. |
| `--cc-glow-purple` | `shadow.glowPurple` | `0 0 25px -5px rgba(75, 46, 131, 0.6)` | Ambient Royal Purple glow for secondary buttons, podcast cards, and featured header badges. |
| `--cc-glow-lime` | `shadow.glowLime` | `0 0 20px -4px rgba(197, 232, 108, 0.45)` | High-energy Electric Lime glow on primary CTAs (`#C5E86C`), active filter pills, and focused cards. |
| `--cc-thumbnail-drop` | `shadow.thumbnailDrop` | `0 12px 24px rgba(0, 0, 0, 0.85)` | Hard separation shadow for AJ mascot cutouts, Alex Patterson cutouts, and 3-5 word display titles in YouTube thumbnails. |

## Dark-Mode Border & Highlight Rules
1. **Resting Card Border**: `border border-[#B4A7D6]/15` (`1px solid rgba(180, 167, 214, 0.15)`).
2. **Hover Card Elevation**: Transition border to `hover:border-[#B4A7D6]/40` or `hover:border-[#C5E86C]/50` paired with `hover:shadow-[var(--cc-glow-purple)]` or `hover:shadow-[var(--cc-glow-lime)]`.
3. **Tactile Button Lip**: Primary (`#C5E86C`) and secondary (`#4B2E83`) buttons can pair their ambient glow with a `border-b-4` tactile lip (`#9BC53D` for Lime, `#351F5E` for Purple) that depresses (`active:translate-y-0.5`) on click.
