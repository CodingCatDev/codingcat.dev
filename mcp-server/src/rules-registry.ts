/**
 * CodingCat.dev Agent Toolkit & 13-Module Design System Registry
 * Modeled after sanity-io/agent-toolkit MCP rules registry.
 * Bundles all canonical rule categories, W3C tokens, and Tailwind v4 CSS variables
 * so the Cloudflare Worker runs with zero filesystem dependencies at the edge.
 */

export type CodingCatRuleCategory =
  | "overview"
  | "colors"
  | "typography"
  | "spacing"
  | "corner-radius"
  | "shadows"
  | "focus"
  | "components"
  | "assets"
  | "files"
  | "voice"
  | "excalidraw"
  | "thumbnails"
  | "video-intros";

export interface CodingCatRuleEntry {
  category: CodingCatRuleCategory;
  title: string;
  skill: "codingcat-design-system" | "alex-voice-and-copy" | "codingcat-media-studio";
  sourcePath: string;
  summary: string;
  markdown: string;
}

export const CODINGCAT_TOKENS_JSON = {
  $schema: "https://tr.designtokens.org/format/",
  color: {
    bg: {
      primary: {
        $value: "#0F172A",
        $type: "color",
        $description: "Canvas Obsidian (Primary Background, slate-900)",
      },
      void: {
        $value: "#000000",
        $type: "color",
        $description: "Pure Void (Excalidraw diagram wells / deepest dark)",
      },
    },
    surface: {
      default: {
        $value: "#1E293B",
        $type: "color",
        $description: "Surface Slate (Cards, Code Blocks, Panels, slate-800)",
      },
      elevated: {
        $value: "#334155",
        $type: "color",
        $description: "Elevated Surface (Hover / Modals, slate-700)",
      },
    },
    brand: {
      purple: {
        primary: {
          $value: "#4B2E83",
          $type: "color",
          $description: "CodingCat Royal Purple (Primary Brand)",
        },
        vivid: {
          $value: "#7C3AED",
          $type: "color",
          $description: "Vibrant Purple Accent for dark-mode interactive highlights",
        },
        lip: {
          $value: "#351F5E",
          $type: "color",
          $description: "Tactile 3D bottom lip for Royal Purple buttons",
        },
      },
      lavender: {
        $value: "#B4A7D6",
        $type: "color",
        $description: "Soft Lavender (Secondary Accent / Borders / Subheadings)",
      },
      lime: {
        primary: {
          $value: "#C5E86C",
          $type: "color",
          $description:
            "Electric Lime Green (Primary CTA / Highlights / Focus / Checkmarks / AJ Eyes)",
        },
        lip: {
          $value: "#9BC53D",
          $type: "color",
          $description: "Tactile 3D bottom lip for Electric Lime buttons",
        },
      },
    },
    semantic: {
      mint: {
        $value: "#86EFAC",
        $type: "color",
        $description: "Mint Success (Diagram Good Pattern / Check, green-300)",
      },
      coral: {
        $value: "#FCA5A5",
        $type: "color",
        $description: "Coral Anti-Pattern (Diagram Bad Pattern / X Mark / Error, red-300)",
      },
    },
    text: {
      primary: {
        $value: "#F8FAFC",
        $type: "color",
        $description: "Text Primary (slate-50, 15.4:1 AAA contrast on #0F172A)",
      },
      muted: {
        $value: "#94A3B8",
        $type: "color",
        $description: "Text Muted (slate-400, 7.1:1 AA+ contrast on #0F172A)",
      },
    },
  },
  typography: {
    fontFamily: {
      display: {
        $value: ["Nunito", "Inter", "system-ui", "sans-serif"],
        $type: "fontFamily",
        $description: "Chunky rounded H1 display font (Nunito 800/900)",
      },
      sans: {
        $value: ["Inter", "system-ui", "sans-serif"],
        $type: "fontFamily",
        $description: "UI Sans, H2-H6 headings, and long-form prose font",
      },
      mono: {
        $value: ["JetBrains Mono", "monospace"],
        $type: "fontFamily",
        $description: "Code blocks, terminal snippets, badge tags, and metadata",
      },
      hand: {
        $value: ["Virgil", "Excalifont", "Caveat", "cursive", "sans-serif"],
        $type: "fontFamily",
        $description: "Excalidraw hand-drawn diagram annotations and explanations",
      },
    },
  },
  spacing: {
    base: { $value: "4px", $type: "dimension" },
    containerMax: { $value: "1280px", $type: "dimension" },
    sectionPaddingY: { $value: "64px", $type: "dimension" },
    cardPadding: { $value: "24px", $type: "dimension" },
    bentoGap: { $value: "24px", $type: "dimension" },
    safeZones: {
      youtube16x9: {
        edgeMargin: "96px",
        timestampClear: "320x120px",
      },
      shorts9x16: {
        topClear: "250px",
        bottomClear: "420px",
      },
    },
  },
  radius: {
    none: { $value: "0px", $type: "dimension" },
    md: { $value: "6px", $type: "dimension" },
    lg: { $value: "8px", $type: "dimension" },
    xl: { $value: "12px", $type: "dimension" },
    "2xl": { $value: "16px", $type: "dimension" },
    full: { $value: "9999px", $type: "dimension" },
  },
  shadow: {
    card: {
      $value:
        "0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
      $type: "shadow",
    },
    glowPurple: {
      $value: "0 0 25px -5px rgba(75, 46, 131, 0.6)",
      $type: "shadow",
    },
    glowLime: {
      $value: "0 0 20px -4px rgba(197, 232, 108, 0.45)",
      $type: "shadow",
    },
    thumbnailDrop: {
      $value: "0 12px 24px rgba(0, 0, 0, 0.85)",
      $type: "shadow",
    },
  },
} as const;

export const CODINGCAT_THEME_CSS = `/*
 * CodingCat.dev Canonical Design Tokens (Tailwind CSS v4 @theme + CSS Custom Properties)
 * Generated from tokens/tokens.json
 */

:root {
  /* 02-colors: Core CodingCat.dev Dark-Mode-First Palette */
  --cc-bg-primary: #0f172a;
  --cc-bg-void: #000000;
  --cc-surface: #1e293b;
  --cc-surface-elevated: #334155;
  --cc-purple-primary: #4b2e83;
  --cc-purple-vivid: #7c3aed;
  --cc-purple-lip: #351f5e;
  --cc-lavender: #b4a7d6;
  --cc-lime: #c5e86c;
  --cc-lime-lip: #9bc53d;
  --cc-mint: #86efac;
  --cc-coral: #fca5a5;
  --cc-text-primary: #f8fafc;
  --cc-text-muted: #94a3b8;

  /* 06-shadows: Elevation & Ambient Glows */
  --cc-shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
  --cc-glow-purple: 0 0 25px -5px rgba(75, 46, 131, 0.6);
  --cc-glow-lime: 0 0 20px -4px rgba(197, 232, 108, 0.45);
  --cc-thumbnail-drop: 0 12px 24px rgba(0, 0, 0, 0.85);
}
`;

export const CODINGCAT_RULES_REGISTRY: Record<CodingCatRuleCategory, CodingCatRuleEntry> = {
  overview: {
    category: "overview",
    title: "01. Overview: Brand Ethos & Core Identity",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/01-overview.md",
    summary:
      "Brand identity for CodingCat.dev ('Purrfect Web Tutorials'), dark-mode-first philosophy, and when to use AJ the Cat vs. Alex Patterson (@alex.patterson).",
    markdown: `# 01. Overview: Brand Ethos & Core Identity

- **Brand**: CodingCat.dev ("Purrfect Web Tutorials").
- **Founder / Host**: Alex Patterson (\`@alex.patterson\`), Senior Solutions Engineer, GDE, AWS Community Builder.
- **Mascot**: AJ the Cat (anthropomorphic black coding cat standing upright on two legs, Electric Lime \`#C5E86C\` eyes, Soft Lavender \`#B4A7D6\` collar with hexagonal \`"AJ"\` tag, and over-ear \`"CodingCat.dev Podcast"\` Royal Purple/Lavender headphones covering his ears).
- **Aesthetic Philosophy**: Dark-mode-first (\`#0F172A\` Canvas Obsidian, \`#1E293B\` Surface Slate), high-contrast developer ergonomics, mixing crisp Tailwind UI with dark-mode hand-drawn Excalidraw architecture diagrams and 2D/3D AJ mascot illustrations.
- **When to use AJ vs. Alex**:
  - **AJ Mascot**: Brand graphics, YouTube thumbnails (reacting to tech logos/diagrams), callout boxes, empty states, stickers, 3D bumper animations.
  - **Alex Patterson**: Narrator voice, presenter cutaways, personal blog posts, DevRel speaking/event cards, first-person architectural opinions.`,
  },
  colors: {
    category: "colors",
    title: "02. Colors: Dark-Mode-First Palette & Semantic Tokens",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/02-colors.md",
    summary:
      "Canonical Hex, RGB, Tailwind, and CSS variables for Canvas Obsidian (#0F172A), Surface Slate (#1E293B), Royal Purple (#4B2E83), Soft Lavender (#B4A7D6), Electric Lime (#C5E86C), Mint (#86EFAC), and Coral (#FCA5A5).",
    markdown: `# 02. Colors

| Token Name | Hex | Tailwind Class | CSS Variable | Usage Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Obsidian** | \`#0F172A\` | \`bg-slate-900\` | \`--cc-bg-primary\` | Primary background |
| **Pure Void** | \`#000000\` | \`bg-black\` | \`--cc-bg-void\` | Excalidraw diagram wells / deepest dark |
| **Surface Slate** | \`#1E293B\` | \`bg-slate-800\` | \`--cc-surface\` | Cards, code blocks, panels |
| **Elevated Surface** | \`#334155\` | \`bg-slate-700\` | \`--cc-surface-elevated\` | Hover states, modals |
| **CodingCat Royal Purple** | \`#4B2E83\` | \`bg-[#4B2E83]\` | \`--cc-purple-primary\` | Primary brand, secondary buttons, AJ headphones |
| **Soft Lavender** | \`#B4A7D6\` | \`text-[#B4A7D6]\` | \`--cc-lavender\` | Secondary accent, borders, overlines, AJ collar |
| **Electric Lime Green** | \`#C5E86C\` | \`bg-[#C5E86C]\` | \`--cc-lime\` | Primary CTAs, focus rings, highlights, AJ eyes, checkmarks |
| **Mint Success** | \`#86EFAC\` | \`text-green-300\` | \`--cc-mint\` | Diagram good pattern / checkmark |
| **Coral Anti-Pattern** | \`#FCA5A5\` | \`text-red-300\` | \`--cc-coral\` | Diagram bad pattern / X mark / error |
| **Text Primary** | \`#F8FAFC\` | \`text-slate-50\` | \`--cc-text-primary\` | Primary headings & body copy |
| **Text Muted** | \`#94A3B8\` | \`text-slate-400\` | \`--cc-text-muted\` | Muted metadata & captions |`,
  },
  typography: {
    category: "typography",
    title: "03. Typography: Font Stacks, Type Scale & Hierarchy",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/03-typography.md",
    summary:
      "4-font system: Nunito (800/900 chunky H1 display), Inter (UI & H2-H6), JetBrains Mono (code & badges), and Virgil / Excalifont (Excalidraw diagram explanations).",
    markdown: `# 03. Typography

| Role | Font Stack | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Chunky H1 Display** | \`'Nunito', 'Inter', system-ui, sans-serif\` | \`800\`, \`900\` | Hero \`H1\` display titles, page headers, thumbnail 3-5 word titles |
| **UI & H2-H6 Sans** | \`'Inter', system-ui, sans-serif\` | \`400\`-\`800\` | \`H2\`-\`H6\` headings, body prose, UI controls, tables |
| **Code & Badges** | \`'JetBrains Mono', monospace\` | \`400\`, \`500\`, \`700\` | Code blocks, terminal snippets, badge tags, metadata |
| **Excalidraw Hand** | \`'Virgil', 'Excalifont', cursive, sans-serif\` | \`400\`, \`700\` | Hand-drawn diagram explanations in \`#FFFFFF\`, \`#B4A7D6\`, or \`#C5E86C\` |`,
  },
  spacing: {
    category: "spacing",
    title: "04. Spacing: Layout Grid & Video Safe Zones",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/04-spacing.md",
    summary:
      "4px base grid, 1280px max container, 24px bento gaps, and YouTube 16:9 (96px edge, 320x120px bottom-right) & Shorts 9:16 (250px top, 420px bottom) safe zones.",
    markdown: `# 04. Spacing & Safe Zones

- **Base Unit**: \`4px\` (\`0.25rem\`).
- **Web Layout Grid**: Max container \`1280px\` (\`max-w-7xl\`), section vertical padding \`py-16\` to \`py-24\`, card padding \`p-6\` (\`24px\`) or \`p-8\` (\`32px\`), bento gap \`gap-6\` (\`24px\`).
- **16:9 YouTube Safe Zones (\`1920x1080\`)**: Keep all text and mascot faces at least \`96px\` from edges; keep bottom-right \`320x120px\` clear for the YouTube timestamp overlay.
- **9:16 Vertical Shorts Safe Zones (\`1080x1920\`)**: Keep top \`250px\` and bottom \`420px\` clear of critical text for platform UI overlays.`,
  },
  "corner-radius": {
    category: "corner-radius",
    title: "05. Corner Radius: UI Cards, Code Frames & Lower-Thirds",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/05-corner-radius.md",
    summary:
      "Radius mappings from rounded-none (0px) to rounded-md (6px), rounded-lg (8px), rounded-xl (12px), rounded-2xl (16px), and rounded-full (9999px).",
    markdown: `# 05. Corner Radius

| Tailwind Class | Value | Target Elements |
| :--- | :--- | :--- |
| \`rounded-none\` | \`0px\` | Full-bleed video frames |
| \`rounded-md\` | \`6px\` | Inline code tags, small badges, \`kbd\` pills |
| \`rounded-lg\` | \`8px\` | Standard buttons, inputs, code block inner frames |
| \`rounded-xl\` | \`12px\` | Standard UI cards, AJ callout boxes, video lower-third plates |
| \`rounded-2xl\` | \`16px\` | Bento grid containers, featured tutorial cards, modal dialogs |
| \`rounded-full\` | \`9999px\` | Avatar frames, status pills, category tags |`,
  },
  shadows: {
    category: "shadows",
    title: "06. Shadows & Elevation: Dark-Mode Glows & Borders",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/06-shadows.md",
    summary:
      "Dark-mode top-border highlights paired with --cc-shadow-card, --cc-glow-purple, --cc-glow-lime, and --cc-thumbnail-drop.",
    markdown: `# 06. Shadows & Elevation

- \`--cc-shadow-card\`: \`0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)\`
- \`--cc-glow-purple\`: \`0 0 25px -5px rgba(75, 46, 131, 0.6)\`
- \`--cc-glow-lime\`: \`0 0 20px -4px rgba(197, 232, 108, 0.45)\`
- \`--cc-thumbnail-drop\`: \`0 12px 24px rgba(0, 0, 0, 0.85)\``,
  },
  focus: {
    category: "focus",
    title: "07. Focus States: Keyboard Accessibility on Dark Surfaces",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/07-focus.md",
    summary:
      "WCAG AAA high-contrast Electric Lime (#C5E86C) and Soft Lavender (#B4A7D6) focus rings on #0F172A surfaces.",
    markdown: `# 07. Focus States

- **Standard Focus Ring**: \`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5E86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]\`
- **Secondary Input Focus Ring**: \`focus-visible:outline-none focus-visible:border-[#B4A7D6] focus-visible:ring-2 focus-visible:ring-[#4B2E83]/50\``,
  },
  components: {
    category: "components",
    title: "08. Components: Astro, React & Tailwind Reference Patterns",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/08-components.md",
    summary:
      "Copy-pasteable patterns for Primary Lime CTA Button, Secondary Purple Button, Bento Tutorial Card, AJ Callout Box, and Dark Comparison Table.",
    markdown: `# 08. Components

1. **Primary CTA Button**: \`bg-[#C5E86C] text-[#0F172A] font-bold rounded-lg border-b-4 border-[#9BC53D] shadow-[var(--cc-glow-lime)]\`
2. **Secondary Purple Button**: \`bg-[#4B2E83] text-[#F8FAFC] font-semibold rounded-lg border border-[#B4A7D6]/30 border-b-4 border-b-[#351F5E]\`
3. **Bento Tutorial Card**: \`bg-[#1E293B] rounded-2xl p-6 border border-[#B4A7D6]/15 hover:border-[#B4A7D6]/45 shadow-[var(--cc-shadow-card)]\`
4. **AJ Callout / Pro-Tip Box**: \`bg-[#1E293B]/80 rounded-xl p-6 border-l-4 border-l-[#C5E86C]\` featuring \`/assets/AJHeadphones.png\`
5. **Comparison Table**: \`bg-[#0F172A]\` header with \`#C5E86C\` recommended column, \`#1E293B\` alternating rows, and \`JetBrains Mono\` metrics.`,
  },
  assets: {
    category: "assets",
    title: "09. Assets: Canonical AJ Mascot & Visual Reference Sheet",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/09-assets.md",
    summary:
      "Canonical asset paths (assets/AJHeadphones.png, assets/AJ-2D-Bipedal.jpg, assets/AJ-3D-Headphones-Front/Left/Right.jpg) and anatomical guardrails.",
    markdown: `# 09. Canonical AJ Assets

| Asset ID | Path | Description |
| :--- | :--- | :--- |
| \`aj_headphones\` | \`assets/AJHeadphones.png\` | 2D vector head-and-collar emblem with "CodingCat.dev Podcast" over-ear headphones and hexagonal "AJ" tag |
| \`aj_2d_bipedal\` | \`assets/AJ-2D-Bipedal.jpg\` | 2D flat vector full-body upright bipedal AJ standing on two legs |
| \`aj_3d_headphones_front\` | \`assets/AJ-3D-Headphones-Front.jpg\` | 3D vinyl-toy render (front 3/4 turnaround on pedestal) |
| \`aj_3d_headphones_left\` | \`assets/AJ-3D-Headphones-Left.jpg\` | 3D vinyl-toy render (left profile turnaround) |
| \`aj_3d_headphones_right\` | \`assets/AJ-3D-Headphones-Right.jpg\` | 3D vinyl-toy render (right profile turnaround) |`,
  },
  files: {
    category: "files",
    title: "10. Files & Templates: Tokens, Theme CSS & Schemas",
    skill: "codingcat-design-system",
    sourcePath: "skills/codingcat-design-system/references/10-files.md",
    summary:
      "W3C tokens/tokens.json, Tailwind v4 tokens/theme.css, Astro/Sanity MDX frontmatter schema, and social thread templates.",
    markdown: `# 10. Files & Schemas

- \`tokens/tokens.json\`: W3C Design Tokens format.
- \`tokens/theme.css\`: Tailwind CSS v4 \`:root\` custom properties.
- Frontmatter and social templates enforce zero em-dashes and mandatory comparison tables.`,
  },
  voice: {
    category: "voice",
    title: "11. Alex Patterson (@alex.patterson) Voice & Copy Rules",
    skill: "alex-voice-and-copy",
    sourcePath: "skills/alex-voice-and-copy/SKILL.md",
    summary:
      "Strict zero-em-dash law, mandatory comparison tables, pragmatic Senior SE tone, and 'WTF is...' series structure.",
    markdown: `# 11. Alex Patterson Voice & Copy Rules

1. **NEVER use em-dashes** anywhere in prose, titles, scripts, or social posts. Use commas, parentheses, colons, or separate sentences instead.
2. **Always use Markdown tables for comparisons** whenever comparing tools, frameworks, architectures, pricing, or trade-offs.
3. **Tone**: Pragmatic Senior Solutions Engineer / Developer Educator. Direct, conversational, zero fluff, code-first, slightly irreverent ("What the F*ck is..." series energy) without being gatekeepy.
4. **Tech Stack Context**: Default examples toward Astro 7, Next.js, React, Tailwind CSS, Sanity.io, Cloudflare Workers, Hono, D1, Better-Auth, and Firebase.`,
  },
  excalidraw: {
    category: "excalidraw",
    title: "12a. Dark-Mode Excalidraw Architecture Diagrams",
    skill: "codingcat-media-studio",
    sourcePath: "skills/codingcat-media-studio/references/excalidraw-diagrams.md",
    summary:
      "Dark-mode Excalidraw rules: #000000 or #0F172A background, white #FFFFFF & lavender #B4A7D6 sketchy strokes, Virgil font, Coral #FCA5A5 X vs. Mint #86EFAC / Lime #C5E86C checkmarks.",
    markdown: `# 12a. Dark-Mode Excalidraw Diagrams

- **Background**: Pure black \`#000000\` or Canvas Obsidian \`#0F172A\`.
- **Strokes**: 2D hand-drawn white \`#FFFFFF\` and Soft Lavender \`#B4A7D6\` sketchy lines and arrows.
- **Labels**: White, Lavender, or Lime \`Virgil\` / \`Excalifont\` hand-drawn typography.
- **Evaluation Markers**: Coral \`#FCA5A5\` \`X\` marks for anti-patterns; Mint \`#86EFAC\` or Electric Lime \`#C5E86C\` checkmarks for recommended patterns.
- **Presenter Separation**: Keep \`@alex.patterson\` presenter cutaways separate from the diagram canvas.`,
  },
  thumbnails: {
    category: "thumbnails",
    title: "12b. YouTube Thumbnails (16:9) & AJ Mascot Prompts",
    skill: "codingcat-media-studio",
    sourcePath: "skills/codingcat-media-studio/references/youtube-thumbnails.md",
    summary:
      "16:9 YouTube thumbnail layout, 3-4 word Nunito 900 display text (#FFFFFF + #C5E86C highlight), 2D upright bipedal & 3D vinyl-toy AJ cutout rules.",
    markdown: `# 12b. YouTube Thumbnails (16:9)

- **Left or Right Third**: High-contrast cutout of AJ (2D upright bipedal \`assets/AJ-2D-Bipedal.jpg\` or 3D \`assets/AJ-3D-Headphones-*.jpg\` with headphones covering ears) or Alex Patterson cutout with \`--cc-thumbnail-drop\`.
- **Center / Opposite Two-Thirds**: Dark-mode Excalidraw diagram or recognizable tech logo with glowing \`#4B2E83\` and \`#C5E86C\` accents.
- **Display Text**: Max 3-4 words in extra-bold \`Nunito\` (\`900\`) or \`Inter\` (\`800\`) (\`#FFFFFF\` + \`#C5E86C\` highlight word).
- **Safe Zones**: \`96px\` from outer edges; bottom-right \`320x120px\` clear for YouTube duration badge.`,
  },
  "video-intros": {
    category: "video-intros",
    title: "13. YouTube Intros, Hooks & Video Motion Rules",
    skill: "codingcat-media-studio",
    sourcePath: "skills/codingcat-media-studio/references/youtube-intros-and-video.md",
    summary:
      "First-15-second retention hook structure (Pain point -> Excalidraw preview -> 'Let's build it'), lower-third speaker plates, and 9:16 Shorts safe zones.",
    markdown: `# 13. YouTube Intros & Video Rules

- **First 15 Seconds**: Immediate visual hook + problem statement (never open with "Hey guys, welcome back to the channel").
- **Structure**: Pain point (\`0:00-0:05\`) -> Visual Architecture Preview in dark-mode Excalidraw (\`0:05-0:10\`) -> Working proof & "Let's build it" transition (\`0:10-0:15\`).
- **Lower-Third Plates**: \`#1E293B\` surface, \`rounded-xl\`, \`border-l-4 border-[#C5E86C]\`, \`Nunito\` 800 name, \`JetBrains Mono\` handle.`,
  },
};

export const ALL_RULE_CATEGORIES = Object.keys(
  CODINGCAT_RULES_REGISTRY
) as CodingCatRuleCategory[];
