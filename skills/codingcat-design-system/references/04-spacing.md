# 04. Spacing: Layout Grid & Video Safe Zones

CodingCat.dev uses a `4px` (`0.25rem`) base spacing unit across web layouts, bento grids, and video production safe zones.

## Web Layout Spacing Tokens

| Layout Element | Tailwind Class | Pixel / Rem Value | Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Base Unit** | `p-1` / `gap-1` | `4px` (`0.25rem`) | Atomic spacing increment for icon gaps and inline pills. |
| **Max Container Width** | `max-w-7xl` | `1280px` (`80rem`) | Standard centered page container (`mx-auto px-4 sm:px-6 lg:px-8`). |
| **Section Vertical Padding** | `py-16` to `py-24` | `64px` to `96px` | Vertical breathing room between major page sections. |
| **Bento Grid Gap** | `gap-6` | `24px` (`1.5rem`) | Standard spacing between tutorial cards, podcast cards, and bento cells. |
| **Card Internal Padding** | `p-6` or `p-8` | `24px` or `32px` | Internal padding for Surface Slate (`#1E293B`) cards and callout boxes. |
| **Prose Measure** | `max-w-3xl` | `768px` (`48rem`) | Maximum line width for long-form MDX tutorials and show notes. |

## Visual & Video Safe Zones

When generating YouTube thumbnails, 16:9 video overlays, or 9:16 vertical Shorts/Reels, enforce these strict pixel safe zones so platform UI never obscures text or mascot faces:

| Format | Canvas Dimensions | Safe Zone Rule | Clear Margin / Exclusion Zone |
| :--- | :--- | :--- | :--- |
| **16:9 YouTube Thumbnail & Video** | `1920x1080px` | Outer Edge Safe Margin | Keep all display text, logos, and AJ / Alex faces at least **`96px`** inset from all four outer edges. |
| **16:9 YouTube Timestamp Zone** | `1920x1080px` | Bottom-Right Exclusion | Keep the bottom-right **`320x120px`** rectangle completely clear of text, badges, or key diagram nodes (reserved for the YouTube duration badge). |
| **9:16 Vertical Shorts / Reels / TikTok** | `1080x1920px` | Top & Bottom UI Safe Zones | Keep the top **`250px`** and bottom **`420px`** clear of critical captions and diagrams so platform titles, audio tickers, and action buttons do not overlap content. |
| **9:16 Side Action Rail** | `1080x1920px` | Right Edge Safe Margin | Keep the right **`140px`** column clear in the lower half of vertical videos for like/comment/share icons. |
