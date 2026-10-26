# Module 08: Core UI Components & Canonical Terminology

1. **Canonical Content Pillars & Labels**:
   - **Courses** (`/courses` -> `/course/[slug]`): Cards show lesson count (`X Lessons`), badge `Course`, and CTA `Start Course →`.
   - **Podcasts** (`/podcasts` -> `/podcast/[slug]`): Cards show badge `Podcast`, and CTA `Watch Episode →`.
   - **Blog** (`/blog` -> `/post/[slug]`): Cards show badge `Blog Post`, and CTA `Read Post →`.
   - **Diagrams**: Always label hand-drawn diagrams as `Visual Diagram`, `Architecture Diagram`, or `[Diagram Walkthrough]`. Never write the brand name `"Excalidraw"` in user-facing UI text, and never invent synonyms like `"Teardowns"`, `"Blueprints"`, `"Curriculum"`, `"Units"`, or `"Skill Trees"`.
2. **Floating Pill Navigation Bar & Mobile 3-Line Drawer (`Header.astro`)**:
   - Contained within `max-w-7xl mx-auto` as a `rounded-full border-2 border-[#2A1155] dark:border-white/22 shadow-sketch` bar (`bg-white/95 dark:bg-[#131B2E]/90 backdrop-blur-md`).
   - Features AJ mascot inside a `#7C3AED` circular medallion, `CodingCat.dev` wordmark (`.dev` in `#7C3AED` Light / `#C084FC` Dark), desktop nav links (`Courses`, `Podcasts`, `Blog`, `Sponsors`, `Sponsorships` on `lg:flex`), and right-side utility buttons (`Search`, `Ask Agent`, `ThemeToggle`, and on `<lg` the 3-line Hamburger Menu `#nav-drawer-toggle`).
   - Do not include a `"Get Started"` CTA button in `#site-header` so the mobile header never overflows.
   - Tapping `#nav-drawer-toggle` opens `#nav-drawer` with `Home`, `Courses`, `Podcasts`, `Blog`, `Sponsors`, `Sponsorships` and `#nav-drawer-close` (`✕`).
3. **Hero Masthead (`AnimatedHero.astro`)**:
   - Left column (`lg:col-span-5`): `Courses · Podcasts · Blog` pill -> `free. fun. purrfect.` -> `learn by building real apps.` -> explicit hero buttons: `Explore Courses →`, `Watch Podcasts`, and `Read Blog`.
   - Right column (`lg:col-span-7`): `codingcat-app-flow.diagram` (`VISUAL DIAGRAM`) card with multi-branch flowchart, tilted `#FEF08A` yellow sticky note (`AJ's Tip`), glowing purple yarn trail, and bobbling 2D upright bipedal AJ mascot (`"Purrfect code!"`).
4. **Homepage Sections (`index.astro`)**:
   - Section 2 (`learn by building.`): Left `SYSTEM ARCHITECTURE DIAGRAM` card + Right `Featured Podcast Episode` card (`Watch Episode →`).
   - Section 3 (`courses.`): Real Courses from Sanity (`coursesQuery`) with `X Lessons` badge and `Start Course →`.
   - Section 4 (`latest podcasts.`): Chronological podcast episodes (`Watch Episode →`).
   - Section 5 (`most-watched episodes.`): Top podcast episodes (`Watch Episode →`).
   - Section 6 (`latest blog posts.`): Chronological blog posts (`Read Post →`).
   - Section 7 (`Architecture Note`): Streaming server code block + tilted `#FEF08A` yellow sticky note (`AJ's Architecture Rule`).
5. **Contained Sketch Footer (`Footer.astro`)**:
   - Contained `rounded-3xl p-8 md:p-12 hand-border shadow-sketch` card featuring CodingCat.dev brand bio, Explore & LLM links, and `The Purrfect Dispatch` newsletter card.
