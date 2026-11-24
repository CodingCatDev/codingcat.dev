# Dark-Mode Whiteboard & UML Architecture Diagrams (`excalidraw-diagrams.md`)

CodingCat.dev uses content-driven, hand-drawn dark-mode whiteboard diagrams across **6 architectural and UML topologies**: **Sequence Diagrams**, **UML Class & Hierarchy Diagrams**, **State Machines & Feedback Loops**, **Layered System Stacks**, **Multi-Stage Dataflow Pipelines**, and **Anti-Pattern vs. Recommended Comparisons**.

Never default every diagram to a Coral Red `X` on the left and a Green Checkmark on the right. Select the exact topology that matches the engineering mechanism being explained.

---

## 1. Content-Driven Topology Selector (12 Archetypes)

| Archetype ID | Diagram Type | When to Use It | Visual Primitives on `#000000` Grid Canvas |
| :--- | :--- | :--- | :--- |
| **`sequence`** | **UML Sequence Diagram** | Auth flows, MCP tool calls, `window.seek(t)` frame loops, webhooks, SSR/streaming lifecycles, request/response protocols | 3 to 4 top participant boxes, vertical dashed lifelines, narrow activation bars, numbered solid request arrows (`->`), dashed return arrows (`-->`), and a dashed `loop` / `alt` combined fragment frame. |
| **`uml-class`** | **UML Class, Schema & Rig Hierarchy Diagram** | TypeScript interfaces, Sanity schemas, 3D GLB bone/node hierarchies (`AjRoot` -> 12 nodes), component composition, ORM models | 3 to 4 **3-compartment UML Class boxes** (`«stereotype» ClassName` header \| `+ field: type` attributes \| `+ method(): return` operations) connected by open diamonds (`◇` composition) or hollow triangles (`▷` inheritance). |
| **`state-machine`** | **UML State Machine & Feedback Loop Diagram** | Agentic critic loops (FFmpeg contact sheets, Chrome DevTools MCP), audio-clock state transitions, retry/backoff machines, UI lifecycles | Initial UML bullseye dot (`●`), 4 rounded state boxes (`STATE 01`..`04`), central decision diamond (`◇`), and curved transition arrows with `[guard condition]` pill labels. |
| **`layered-stack`** | **Layered System Stack Diagram** | Full-stack architectures, Cloudflare Edge + D1 + Workers tiers, multi-layer media studios, framework comparisons | 3 wide horizontal tier bands (`LAYER 1`..`LAYER 3`) with 45-degree hachure fills, each containing 3 inner component pills, connected vertically by labeled protocol arrows. |
| **`pipeline`** | **Multi-Stage Dataflow Pipeline** | Compilers, ETL pipelines, CI/CD workflows, 3D asset build chains (`ComfyUI -> Blender -> Three.js`) | 4 left-to-right stage boxes (`01`..`04`), a **3D cylinder database/store node** below Stage 2, and a **decision diamond** (`◇`) below Stage 3 with `[PASS]` arrow. Zero Coral `X` or checkmark clutter. |
| **`erd`** | **Crow's Foot Entity-Relationship Diagram (ERD)** | Cloudflare D1 / SQLite schemas, Postgres migrations, Sanity document references, Drizzle/Prisma tables, auth user/session/account models | 4 double-stroked table boxes with `PK` (Gold `#FACC15`), `FK` (Sky `#38BDF8`), and `UK` (Purple `#C084FC`) key badges, connected by **Crow's Foot cardinality lines** (`\|\|--o{` `1:N`). |
| **`c4-context`** | **C4 Container & Trust-Boundary Diagram** | Browser Sandbox vs. Cloudflare Edge Isolate vs. Durable Storage Plane, zero-trust security boundaries, CORS/mTLS perimeters | 3 vertical **dashed trust-boundary containers** (`BOUNDARY 01..03`) wrapping internal service nodes and database cylinders, connected across boundaries by `mTLS` / `RPC` arrows. |
| **`swimlane`** | **UML Activity Swimlane Diagram** | Cross-actor handoffs (`Browser / User` \| `Edge Worker` \| `D1 / Identity`), OAuth / Better-Auth login flows, Stripe checkout webhooks | 3 parallel **swimlane columns** with hachure headers and step cards flowing across lane dividers (`1 -> 2 -> 3 -> 4 -> 5`). |
| **`timeline-gantt`** | **Concurrency, Waterfall & Latency Timeline** | Cold start (`480ms`) vs. V8 Isolate (`4.2ms`), SSR vs. Streaming Suspense waterfalls, `Promise.all` parallel execution, TTFB/LCP | Millisecond time axis (`0ms..500ms`) with vertical dashed ticks and **stacked horizontal duration bars** comparing blocking stalls (Coral `#FCA5A5`) vs. fast parallel streams (Mint `#86EFAC`). |
| **`tree-graph`** | **AST, DOM, Server Island & DAG Tree** | Astro 7 Server Islands (`server:defer`, `client:visible`), React Fiber/DOM trees, Git commit DAGs, monorepo routing | Hierarchical **root -> branch -> leaf tree** with color-coded island/branch badges and parent-to-child arrows. |
| **`quadrant-matrix`** | **2x2 Architectural Trade-Off Quadrant** | Plotting 4 architectural approaches across 2 axes (for example, `DX / Simplicity` vs. `Sub-5ms Edge Scale`) | Intersecting **X and Y axes** with top/bottom axis pills and 4 quadrant cards (`Top-Right = SWEET SPOT · S-TIER` in Mint hachure). |
| **`comparison`** | **Anti-Pattern (`✗`) vs. Recommended (`✓`)** | **ONLY** when the section explicitly contrasts a legacy myth/anti-pattern against a new pattern (cap at max 10-15% of diagrams) | Left boundary box with Coral Red (`#FCA5A5`) `X` mark -> Center resolution node -> Right recommended boxes with Electric Lime (`#C5E86C`) checkmark (`✓`). |

---

## 2. Visual Token Rules for Dark-Mode Whiteboard Canvases

| Diagram Element | Color Token | Hex Value | Physical Drawing & Stroke Rules |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Pure Void + Technical Grid | `#000000` with `#212121` grid | Flat 2D pure black canvas with a faint `20px` dark gray technical gridline pattern. Never export white-background diagrams. |
| **Primary Box & UML Strokes** | Crisp White Chalk/Marker | `#FFFFFF` | Double-stroked (`2` overlapping slightly crooked hand-drawn lines) rectangles, 3-compartment UML class boxes, cylinders, or diamond gates. |
| **Grouping / Fragment Strokes** | Soft Lavender | `#B4A7D6` | Double-stroked or dashed hand-drawn outer container or UML `loop` / `alt` fragment frame. |
| **Interior Hachure Fill** | Purple / Sky / Emerald / Gold | `#4B2E83`, `#0C4A6E`, `#064E3B`, `#FACC15` | Sparse **45-degree diagonal parallel hatch lines** (`hachure` cross-hatching) inside primary boxes, state nodes, and layer bands. |
| **Connector & Lifeline Arrows** | Hand-Drawn Marker | `#FFFFFF`, `#C5E86C`, `#38BDF8` | Sketchy double-stroked arrows supporting open heads (`->`), hollow UML inheritance triangles (`▷`), and composition diamonds (`◇`). |
| **Typography & Annotations** | White Hand-Drawn Marker | `#FFFFFF` | Large, clean, legible hand-drawn marker lettering (`Virgil` style) + `JetBrains Mono` for code/method signatures. Keep node labels concise and strictly inside box borders. |

---

## 3. Copy-Pasteable Gemini App `Style` Preset ("CodingCat Dark Whiteboard")

Save the following block as your reusable **Style** inside the Gemini App (`gemini.google.com`) for diagrams and thumbnails:

```text
Always render visuals in the CodingCat.dev Dark Whiteboard & Studio aesthetic:
1. Canvas: Flat 2D pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern. Zero 3D perspective, zero isometric angles, zero glossy bevels.
2. Hand-Drawn Diagram Mechanics (Rough.js / Excalidraw look): Every diagram box, UML class compartment, cylinder store, decision diamond, and layer container is drawn with TWO slightly offset, overlapping, hand-drawn sketchy white or soft lavender marker strokes (double-stroked wobble). Box interiors use visible 45-degree diagonal parallel marker hatch lines (hachure cross-hatching) in deep purple, sky blue, emerald green, or gold, never solid gradients.
3. Content-Driven Diagram Topology: Select the exact diagram archetype that fits the technical topic (Sequence Diagram with lifelines, 3-Compartment UML Class Hierarchy, State Machine & Feedback Loop, 3-Tier Layered Stack, 4-Stage Dataflow Pipeline with cylinder store and decision gate, or Anti-Pattern vs. Recommended Comparison). All text uses clean, legible white hand-drawn marker handwriting (Virgil font style), strictly fitting inside box bounds. Never print hex codes on the image.
4. Presenter Likeness (@alex.patterson): When a presenter cutout is requested, place Alex Patterson (mid-40s Caucasian man, short styled light-brown hair, warm blue-green eyes, neatly trimmed salt-and-pepper beard, NO glasses, fitted matte-black crew-neck t-shirt with the screen-printed CodingCat.dev AJ the Cat headphone mascot logo on the center chest, round black Pixel Watch on left wrist) in the Left Third or Right Third with a colored studio rim-light, overlaid cleanly (z-index: 20) without clipping his fingers or shoulders.
```

---

## 4. Prompt Templates by Archetype (Standalone 16:9 Diagrams)

#### Archetype A: `sequence` (UML Sequence Diagram)
```text
Flat 2D hand-drawn dark-mode whiteboard UML Sequence Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.
1. Across the top, draw 4 double-stroked wobbly white (#FFFFFF) participant boxes with 45-degree diagonal purple hachure fills labeled "[PARTICIPANT_1]", "[PARTICIPANT_2]", "[PARTICIPANT_3]", and "[PARTICIPANT_4]" in clean white hand-drawn marker font (Virgil style).
2. Below each participant box, draw a vertical dashed lifeline extending to the bottom, with narrow vertical rectangular activation bars along each lifeline.
3. Surround the middle interaction zone with a dashed rectangular UML combined fragment box featuring a top-left pentagonal tag labeled "loop [deterministic cycle]".
4. Draw numbered horizontal solid white request arrows (1, 2, 3) and dashed mint-green (#86EFAC) return arrows (4, 5) between the lifelines, each with a concise 2-to-4 word pill label above the arrow. Never print hex codes as text on the canvas.
```

#### Archetype B: `uml-class` (UML Class & Hierarchy Diagram)
```text
Flat 2D hand-drawn dark-mode whiteboard UML Class Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.
1. Draw 4 large double-stroked wobbly white (#FFFFFF) UML Class rectangles with 45-degree diagonal hachure header fills in Royal Purple (#4B2E83), Sky Blue (#0C4A6E), and Emerald (#064E3B).
2. Divide each class box horizontally into 3 classic UML compartments: Top («stereotype» and bold class name "[CLASS_1]".."[CLASS_4]"), Middle (2 typed fields "+ field: type"), and Bottom (2 method signatures "+ method(): ReturnType" in Electric Lime #C5E86C).
3. Connect the class boxes with sketchy white UML relationship lines featuring diamond composition heads and hollow triangle inheritance arrowheads, each labeled with a short relationship pill. Never print hex codes as text on the canvas.
```

#### Archetype C: `state-machine` (UML State Machine & Feedback Loop)
```text
Flat 2D hand-drawn dark-mode whiteboard UML State Machine and Feedback Loop Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.
1. Start on the top-left with a solid Electric Lime (#C5E86C) UML initial state circle leading into 4 rounded double-stroked state boxes arranged in a clockwise loop: "[STATE_01]" (top-left), "[STATE_02]" (top-right), "[STATE_03]" (bottom-right), and "[STATE_04]" (bottom-left), each filled with 45-degree diagonal hatch lines.
2. In the center of the loop, draw a double-stroked wobbly diamond gate node labeled "[CENTER_CLOCK_OR_GATE]".
3. Connect the 4 states clockwise with curved white arrows and a dashed yellow (#FACC15) feedback loop arrow from "[STATE_04]" back to "[STATE_01]" labeled with a guard condition in brackets ("[guard] retry"). Never print hex codes as text on the canvas.
```

#### Archetype D: `layered-stack` (Layered System Stack)
```text
Flat 2D hand-drawn dark-mode whiteboard Layered System Architecture Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.
1. Draw 3 wide horizontal double-stroked tier containers stacked top-to-bottom ("LAYER 1: [TOP_TIER]", "LAYER 2: [MIDDLE_TIER]", "LAYER 3: [BOTTOM_TIER]") with 45-degree diagonal hachure fills in Purple, Sky Blue, and Mint Green.
2. Inside each horizontal tier container, draw 3 clean double-stroked component pills (1-3 words each).
3. Connect Layer 1 -> Layer 2 -> Layer 3 with short vertical Electric Lime (#C5E86C) arrows and protocol pills. Never print hex codes as text on the canvas.
```

#### Archetype E: `pipeline` (Multi-Stage Dataflow Pipeline)
```text
Flat 2D hand-drawn dark-mode whiteboard Multi-Stage Dataflow Pipeline Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.
1. Across the top row, draw 4 double-stroked stage boxes flowing left-to-right ("01: [INPUT]", "02: [CORE]", "03: [TRANSFORM]", "04: [OUTPUT]") with 45-degree diagonal hachure fills in Purple, Sky Blue, Gold, and Mint Green.
2. Below Stage 02, draw a double-stroked 3D cylinder database/store node connected via a dashed bidirectional sync arrow. Below Stage 03, draw a double-stroked decision diamond gate ("Gate >= 8/10") routing a "[PASS]" arrow to Stage 04. Never print hex codes as text on the canvas.
```

#### Archetype F: `comparison` (Anti-Pattern `✗` vs. Recommended `✓` - Use Only for Explicit Myth-Busting)
```text
Flat 2D hand-drawn dark-mode whiteboard comparison diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.
1. Left Section (Anti-Pattern Cluster): Inside a double-stroked boundary box, draw 3 overlapping document cards labeled "[Bad Node 1..3]" slashed with a large sketchy Coral Red (#FCA5A5) "X" mark and bottom caption "[PAINFUL]".
2. Center Section (Core Resolution Node): Sketchy white arrow pointing from the left cluster to a single center card labeled "[Core Node]" with 45-degree hachure fill.
3. Right Section (Recommended Cluster): Branching arrows from center to 2 clean double-stroked output boxes on the right topped with a vibrant sketchy Electric Lime (#C5E86C) checkmark and caption "[PURRFECT]". Never print hex codes as text on the canvas.
```
