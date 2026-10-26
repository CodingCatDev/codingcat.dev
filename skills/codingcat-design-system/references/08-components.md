# Module 08: Core UI Components (Dual-Theme Chalkboard & Royal Purple)

1. **Floating Pill Navigation Bar (`Header.astro`)**:
   - Contained within `max-w-7xl mx-auto px-4 sm:px-6 pt-4` as a `rounded-full hand-border shadow-sketch` bar (`bg-white/95 dark:bg-[#131B2E]/90 backdrop-blur-md`).
   - Features AJ mascot inside a `#7C3AED` circular medallion with `.shadow-sketch-sm`, `CodingCat.dev` wordmark (`.dev` in `#7C3AED` Light / `#C084FC` Dark), nav links, Search (`⌘K`), Ask Agent, Theme Toggle, and tactile `Get Started →` pill button.
2. **Hero Masthead (`AnimatedHero.astro`)**:
   - Left column (`lg:col-span-5`): `100% Free Developer Media` pill with pulsing green dot -> `free. fun. purrfect.` (`purrfect.` in `#7C3AED` Light / purple-to-fuchsia gradient Dark with hand-drawn squiggle underline SVG) -> `learn by building real apps.` in sketch font -> `GET STARTED →` & `Watch Teardowns` pill buttons -> `320+ Free Teardowns / 45k+ Cat Devs / 0$ Forever` stats row.
   - Right column (`lg:col-span-7`): `codingcat-app-flow.excalidraw` (`LIVE SKETCH`) whiteboard/chalkboard card with multi-branch flowchart (`Root Orchestrator` -> `Sky Blue ?`, `Signals Engine`, `Edge Cache` -> `WebSockets`), tilted `#FEF08A` yellow sticky note (`AJ's Tip`), glowing purple/fuchsia yarn swirl + yarn ball, and bobbling AJ mascot with `"Purrfect code!"` speech bubble.
3. **Learn by Building Dual Section (`index.astro`)**:
   - Left (`lg:col-span-6`): `SYSTEM FLOW TEARDOWN #104` (`Full-Stack SSR`) two-branch Excalidraw flowchart card (`Sunny Yellow` vs `Candy Purple` branches) with `Diagram generated with Excalidraw` footer.
   - Right (`lg:col-span-6`): `meet real codingcat learners & guests` Spotlight Card featuring the latest Podcast episode inside an `EXCALIDRAW DEEP DIVE` chalkboard video player frame with a glowing `#7C3AED` circular play button.
4. **Architecture Teardowns & Content Cards (`ContentCard.astro` / `HomeSection.astro`)**:
   - `.hand-border shadow-sketch rounded-3xl p-5` cards with pastel/dark Excalidraw headers (Lilac, Sky Blue, Candy Pink), category badges, and `Free` / `Listen →` actions.
5. **Production Teardown Code & Sticky Note Banner**:
   - Deep `#2A1155` (Light) / `#131B2E` (Dark) `rounded-3xl hand-border shadow-sketch-lg` banner pairing a streaming `ReadableStream` code block (`lg:col-span-8`) with a tilted `#FEF08A` yellow sticky note (`AJ's Architecture Rule`) (`lg:col-span-4`).
6. **Contained Sketch Footer (`Footer.astro`)**:
   - Contained `rounded-3xl p-8 md:p-12 hand-border shadow-sketch` card featuring CodingCat.dev brand bio, Content & LLM links, and `The Purrfect Dispatch` newsletter card.
