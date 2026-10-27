# 07. Focus States: Keyboard Accessibility on Dark Surfaces

Every interactive element on CodingCat.dev must exhibit an unmistakable, WCAG AAA-compliant keyboard focus indicator against Canvas Obsidian (`#0F172A`) and Surface Slate (`#1E293B`).

## Canonical Focus Ring Patterns

| Context | Tailwind Classes | Ring Color | Offset Color |
| :--- | :--- | :--- | :--- |
| **Standard Interactive Elements (Buttons, Links, Cards, Tabs)** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5E86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]` | Electric Lime (`#C5E86C`) | Canvas Obsidian (`#0F172A`) |
| **Form Inputs, Search Bars & Select Menus** | `focus-visible:outline-none focus-visible:border-[#B4A7D6] focus-visible:ring-2 focus-visible:ring-[#4B2E83]/50` | Royal Purple (`#4B2E83` at 50%) + Soft Lavender (`#B4A7D6`) border | None (inline border + outer halo) |
| **Destructive Actions** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCA5A5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]` | Coral (`#FCA5A5`) | Canvas Obsidian (`#0F172A`) |

## Implementation Rules
1. **Always Prefer `:focus-visible` over `:focus`**: Prevent sticky focus rings on mouse click while guaranteeing full visibility for keyboard (`Tab` / `Shift+Tab`) and screen-reader users.
2. **Never Remove Outlines Without Replacement**: Never apply `outline-none` or `focus:outline-none` unless immediately paired with a `focus-visible:ring-2` token.
3. **Nested Card Focus**: When an entire Bento Tutorial Card is clickable, apply `group` to the outer `<a>` tag with the `#C5E86C` focus ring on the `rounded-2xl` container.
