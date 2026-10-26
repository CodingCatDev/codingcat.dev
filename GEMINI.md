# Gemini CLI & Google Antigravity Instructions (`GEMINI.md`)

Always follow [`AGENTS.md`](./AGENTS.md) and [`DESIGN.md`](./DESIGN.md).

## Key Rules

1. **Canonical Content Pillars**:
   - **Courses** (`/courses` -> `/course/[slug]`), made of **Lessons** (`Explore Courses →`, `Start Course →`).
   - **Podcasts** (`/podcasts` -> `/podcast/[slug]`), made of **Episodes** (`Watch Podcasts`, `Watch Episode →`).
   - **Blog** (`/blog` -> `/post/[slug]`), made of **Blog Posts** (`Read Blog`, `Read Post →`).
   - **Diagrams**: Never write the brand word `"Excalidraw"` in user-facing UI copy, badges, or captions; call them **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams**. Never invent synonyms like `"Teardowns"`, `"Blueprints"`, `"Curriculum"`, `"Units"`, or `"Skill Trees"`.
2. **Zero Em-Dashes**: Never use the em-dash character anywhere in prose, UI copy, markdown, or code comments.
3. **Always Use Tables for Comparisons**: Render Markdown or HTML tables whenever comparing two or more items.
4. **Header & Mobile Drawer**: Never add a `"Get Started"` button to `#site-header`. Keep the mobile header clean with `Search`, `Ask Agent`, `ThemeToggle`, and the 3-line menu toggle (`#nav-drawer-toggle`).
