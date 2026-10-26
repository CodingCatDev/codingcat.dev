# 05. Corner Radius: UI Cards, Code Frames & Lower-Thirds

CodingCat.dev uses rounded, tactile geometry that balances modern developer tooling with approachable card surfaces.

## Corner Radius Token Mapping

| Token | Tailwind Class | Pixel / Rem Value | Target Elements |
| :--- | :--- | :--- | :--- |
| `radius.none` | `rounded-none` | `0px` | Full-bleed video frames, edge-to-edge section dividers, and raw canvas viewports. |
| `radius.md` | `rounded-md` | `6px` (`0.375rem`) | Inline `<code>` tags, small metadata badges, and keyboard shortcut `<kbd>` pills. |
| `radius.lg` | `rounded-lg` | `8px` (`0.5rem`) | Standard buttons, form inputs, select menus, and inner code block frames. |
| `radius.xl` | `rounded-xl` | `12px` (`0.75rem`) | Standard UI cards, AJ pro-tip callout boxes, comparison table wrappers, and video lower-third plates. |
| `radius.2xl` | `rounded-2xl` | `16px` (`1rem`) | Bento grid containers, featured tutorial hero cards, Excalidraw diagram wells, and modal dialogs. |
| `radius.full` | `rounded-full` | `9999px` | AJ and host avatar frames, live status pills, and category filter chips. |

## Concentric Nesting Rule
When nesting a rounded element (such as a thumbnail image or code block) inside a padded parent card, subtract the parent padding or step down one radius token so corners align concentrically:
- **Parent Bento Card**: `rounded-2xl` (`16px`) with `p-4` (`16px`) or `p-6` (`24px`)
- **Inner Thumbnail / Code Frame**: `rounded-xl` (`12px`) or `rounded-lg` (`8px`)
