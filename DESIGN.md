---
name: CodingCat.dev 2026 — Duolingo Chalkboard & Excalidraw
colors:
  background: '#131F24'
  surface: '#131F24'
  surface-card: '#202F36'
  surface-elevated: '#283B44'
  surface-border: '#37464F'
  chalk-white: '#FFFFFF'
  chalk-muted: '#DCE6EC'
  chalk-subtle: '#8FA6B2'
  primary: '#58CC02'
  primary-lip: '#46A302'
  primary-hover: '#89E219'
  secondary: '#1CB0F6'
  secondary-lip: '#1899D6'
  tertiary: '#FF9600'
  tertiary-lip: '#E58700'
  highlight-yellow: '#FFC800'
  highlight-yellow-lip: '#E5B400'
  danger-coral: '#FF4B4B'
  danger-coral-lip: '#EA2B2B'
  accent-purple: '#CE82FF'
  accent-purple-lip: '#A560E8'
  canvas-diagram: '#0D1519'
typography:
  display-xl:
    fontFamily: Nunito
    fontSize: 56px
    fontWeight: '900'
    lineHeight: 62px
    letterSpacing: '-0.02em'
  display-lg:
    fontFamily: Nunito
    fontSize: 44px
    fontWeight: '900'
    lineHeight: 50px
    letterSpacing: '-0.02em'
  headline-lg:
    fontFamily: Nunito
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
  headline-md:
    fontFamily: Nunito
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  sketch-label:
    fontFamily: Caveat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  code-inline:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.5rem
  DEFAULT: 0.75rem
  md: 1rem
  lg: 1.25rem
  xl: 1.5rem
  full: 9999px
---

# CodingCat.dev 2026 — Duolingo Chalkboard & Hand-Drawn Excalidraw Design System

## 1. Core Brand Philosophy ("free. fun. purrfect.")
CodingCat.dev 2026 combines **Duolingo's joyful, high-saturation gamified learning UX** with **authentic hand-drawn Excalidraw chalkboard diagrams** so learners from Day-1 beginners to staff-level engineers feel welcomed, energized, and never intimidated.

- **No Generic Corporate Slop:** Never use muted slate-purple SaaS dashboards, tiny low-contrast text, or cramped 4-column bento grids.
- **Spacious Scrollytelling Rhythm:** Each scroll section focuses on **one big idea**, pairing a giant, friendly rounded lowercase headline in Feather Green (`#58CC02`) with a short scannable explanation and a playful hand-drawn Excalidraw chalkboard diagram.

## 2. Color Palette & Tactile 3D Tokens

| Token Role | Name | Main Hex | 3D Lip / Shadow Hex | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Chalkboard Canvas** | Deep Teal-Charcoal | `#131F24` | `#0D1519` (Diagram Well) | Primary background across all pages |
| **Elevated Card Surface** | Chalk Slate | `#202F36` | `#37464F` (`2px–3px` border + `4px` bottom lip) | Topic cards, podcast cards, interactive modules |
| **Primary Brand & Action** | Feather Green | `#58CC02` | `#46A302` (`4px` bottom lip) | Display headlines (`free. fun. purrfect.`), primary CTAs, AJ's eyes, `✓` pass states |
| **Secondary / Builder** | Macaw Sky Blue | `#1CB0F6` | `#1899D6` (`4px` bottom lip) | Inline highlighted copy, AJ's headphones, Excalidraw diagram boxes, Builder track |
| **Yarn & Energy Accent** | Fox Flame Orange | `#FF9600` | `#E58700` (`4px` bottom lip) | AJ's glowing yarn ball & scroll-unwinding string, cross-hatched Excalidraw nodes |
| **Spark & Tag Accent** | Bee Sunny Yellow | `#FFC800` | `#E5B400` (`4px` bottom lip) | AJ's headphone ear-cups & collar tag, star doodles, annotation callouts |
| **Play / Anti-Pattern** | Cardinal Coral Red | `#FF4B4B` | `#EA2B2B` (`4px` bottom lip) | YouTube/Podcast play buttons & Excalidraw `✗` anti-pattern strokes |
| **Pro / Agent Accent** | Beetle Candy Purple | `#CE82FF` | `#A560E8` (`4px` bottom lip) | Advanced AI Agent nodes & pro badges |
| **Chalk Ink** | Crisp White Chalk | `#FFFFFF` | `#DCE6EC` (Body) | Hand-drawn Excalidraw box strokes, sketchy arrows, and primary copy |

## 3. AJ the Mascot (2026 Feather Green & Macaw Blue Edition)
- **Silhouette & Sticker Rim-Light:** Friendly black cat (`#131F24` / `#0B1114`) with a bold, crisp white (`#FFFFFF`) die-cut sticker outline so AJ pops off every dark chalkboard surface.
- **Eyes:** Huge, expressive **Feather Green (`#58CC02`)** eyes with white catchlights.
- **Headphones & Collar:** Chunky **Macaw Sky Blue (`#1CB0F6`)** headband and outer cups accented with **Sunny Yellow (`#FFC800`)** ear-cup cushions and collar + golden `"AJ"` tag.
- **Interactive Prop:** A glowing **Flame Orange (`#FF9600`)** ball of yarn that unwinds into a scroll-driven SVG string winding down the page across Excalidraw diagrams and section dividers.

## 4. Hand-Drawn Excalidraw Diagram & Card Conventions
- **Sketchy Double Borders & Cross-Hatching:** Diagrams use crisp white (`#FFFFFF`) hand-drawn double-stroked boxes filled with diagonal cross-hatched marker strokes in `#1CB0F6` (Sky Blue), `#FF9600` (Flame Orange), `#58CC02` (Feather Green), `#FFC800` (Sunny Yellow), and `#CE82FF` (Candy Purple).
- **Tactile 3D Buttons:** All primary and secondary buttons use `16px` border-radius, bold uppercase/lowercase tracking, and a `4px` solid bottom lip (`border-bottom-width: 4px`) that physically depresses (`translateY(2px)`) on active click.
- **Podcast & YouTube Cover Unification:** Every 16:9 episode thumbnail & cover uses the `#131F24` / `#0D1519` blackboard canvas, a bold hand-drawn + chunky display title on top, an episode-specific Excalidraw cross-hatched diagram on the left/center, and a die-cut outlined cutout of host Alex Patterson + guest on the right with AJ & his orange yarn ball.
