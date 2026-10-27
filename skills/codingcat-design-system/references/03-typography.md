# 03. Typography: Font Stacks, Type Scale & Hierarchy

CodingCat.dev pairs chunky, welcoming display titles (`Nunito`) with high-legibility UI typography (`Inter`), developer-grade monospace (`JetBrains Mono`), and authentic hand-drawn diagram lettering (`Virgil` / `Excalifont`).

## Canonical Font Stacks

| Role | Font Family Stack | CSS Variable | Weights | Primary Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Chunky H1 Display** | `'Nunito', 'Inter', system-ui, sans-serif` | `--font-display` | `800` (ExtraBold), `900` (Black) | Hero `H1` headlines, page titles, section display headers, and friendly callout titles. |
| **UI Sans & H2-H6** | `'Inter', system-ui, -apple-system, sans-serif` | `--font-sans` | `400`, `500`, `600`, `700`, `800` | `H2`-`H6` subheadings, long-form article prose, navigation, buttons, and table cells. |
| **Code & Badges** | `'JetBrains Mono', ui-monospace, monospace` | `--font-mono` | `400`, `500`, `700` | Code blocks, inline code snippets, terminal outputs, category badge tags, and episode metadata. |
| **Excalidraw Hand-Drawn** | `'Virgil', 'Excalifont', 'Caveat', cursive, sans-serif` | `--font-hand` | `400`, `700` | Dark-mode Excalidraw diagram explanations, sketchy arrow labels, and whiteboard callout notes. |

## Type Scale & Line-Height Specification

| Element / Token | Font Family | Size (rem / px) | Weight | Line Height | Letter Spacing | Color Token |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero (`H1`)** | `Nunito` | `3.5rem` (`56px`) | `900` | `1.1` (`62px`) | `-0.025em` (`tracking-tight`) | `#F8FAFC` with `#C5E86C` or `#B4A7D6` accent spans |
| **Page Title (`H1`)** | `Nunito` | `2.75rem` (`44px`) | `800` / `900` | `1.15` (`50px`) | `-0.025em` (`tracking-tight`) | `#F8FAFC` |
| **Section Heading (`H2`)** | `Inter` | `2rem` (`32px`) | `700` / `800` | `1.2` (`38px`) | `-0.025em` (`tracking-tight`) | `#F8FAFC` |
| **Subsection (`H3`)** | `Inter` | `1.5rem` (`24px`) | `700` | `1.3` (`32px`) | `-0.02em` | `#F8FAFC` |
| **Card Title (`H4`)** | `Inter` | `1.25rem` (`20px`) | `700` | `1.35` (`27px`) | `-0.015em` | `#F8FAFC` |
| **Body Large (Lead)** | `Inter` | `1.125rem` (`18px`) | `400` / `500` | `1.65` (`30px`) | `0em` | `#F8FAFC` |
| **Body Standard** | `Inter` | `1rem` (`16px`) | `400` | `1.6` (`26px`) | `0em` | `#F8FAFC` |
| **Caption / Metadata** | `JetBrains Mono` | `0.875rem` (`14px`) | `500` | `1.4` (`20px`) | `0.02em` | `#94A3B8` or `#B4A7D6` |
| **Badge / Pill Label** | `JetBrains Mono` | `0.75rem` (`12px`) | `700` | `1.2` (`14px`) | `0.05em` (`uppercase`) | `#C5E86C` or `#B4A7D6` |
| **Excalidraw Annotation** | `Virgil` / `Excalifont` | `1.25rem` (`20px`) | `700` | `1.25` (`25px`) | `0em` | `#FFFFFF`, `#B4A7D6`, or `#C5E86C` |

## Thumbnail & Video Display Typography Rules
- **Thumbnail Display Text**: Extra-bold uppercase or title-case `Nunito` (`900`) or `Inter` (`800`).
- **Word Limit**: Maximum **3 to 5 words** per thumbnail so mobile viewers can read it in under a second.
- **Color & Contrast**: High-contrast crisp white (`#FFFFFF`) paired with a single Electric Lime (`#C5E86C`) highlight keyword and a hard dark drop shadow (`--cc-thumbnail-drop`: `0 12px 24px rgba(0, 0, 0, 0.85)`).
- **Excalidraw Labels**: Always render diagram labels in `Virgil` or `Excalifont` in pure white (`#FFFFFF`), Soft Lavender (`#B4A7D6`), or Electric Lime (`#C5E86C`) on `#000000` or `#0F172A` canvases.
