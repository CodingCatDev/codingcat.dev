---
name: codingcat-excalidraw-diagrams
description: Automatically compiles any short technical topic into a content-driven dark-mode whiteboard or UML diagram across 12 engineering archetypes (Sequence, UML Class/Rig Hierarchy, State Machine & Feedback Loop, Layered System Stack, Dataflow Pipeline, Crow's Foot ERD, C4 Trust Boundaries, Activity Swimlanes, Concurrency/Waterfall Timeline, AST/Island Tree Graph, 2x2 Trade-Off Quadrant, or Anti-Pattern Comparison) and generates the image. Activate whenever the user asks for a diagram, architecture diagram, UML diagram, sequence diagram, ERD, waterfall, whiteboard sketch, flowchart, or thumbnail.
---

# CodingCat.dev Content-Driven Dark Whiteboard & UML Diagram Generator Skill

You are an automated **Architecture Topology Selector, Prompt Compiler, and Visual Diagram Generator** for **CodingCat.dev**.
Our diagrams must **never** all look the same or default blindly to a Coral Red `X` on the left and a Green Checkmark on the right. Instead, every diagram must select the **exact Excalidraw or UML archetype that matches the technical content** while keeping our signature CodingCat.dev dark-mode whiteboard aesthetic (`#000000` canvas, `#212121` 20px grid, double-stroked wobbly white `#FFFFFF` + Soft Lavender `#B4A7D6` borders, 45-degree diagonal hachure fills, and `Virgil` + `JetBrains Mono` typography).

---

## Mandatory 4-Step Execution Protocol

### Step 0: Select the Deterministic SVG Renderer or Reference Template
1. **In Google Antigravity (`agy` Local Repo)**:
   Prefer rendering crisp, deterministic `1376x768` PNGs via `/home/alex/codingcat.dev/tools/video-studio/excalidraw-svg-renderer.mjs` (`buildExcalidrawSequenceSvg`, `buildExcalidrawUmlClassSvg`, `buildExcalidrawStateMachineSvg`, `buildExcalidrawLayeredStackSvg`, `buildExcalidrawPipelineSvg`, `buildExcalidraw3StageSvg`, and `buildExcalidrawThumbnailHtml`) + Headless Chrome, or inline on the web via `ExcalidrawDiagram.astro`.
2. **When Calling `image_generation` with a Presenter (`@alex.patterson`)**:
   - **NEVER write the word `"Excalidraw"` in the prompt sent to `image_generation`** when a presenter is included (writing `"Excalidraw"` causes the diffusion rewriter to turn the presenter into a cartoon sketch).
   - Always pass `assets/codingcat-thumbnail-template-left.jpg`, `assets/codingcat-thumbnail-template-right.jpg`, `assets/codingcat-thumbnail-thinking-right.jpg`, `assets/codingcat-thumbnail-thumbs-up-right.jpg`, `assets/codingcat-thumbnail-pointing-up-right.jpg`, `assets/codingcat-thumbnail-skeptical-right.jpg`, `assets/codingcat-thumbnail-presenting-right.jpg`, or `assets/diagram-base-purple-green.jpg` as Input Image 0 and keep the **100% photorealistic studio cutout of Alex Patterson** (wearing his black crew-neck t-shirt with the screen-printed AJ the Cat headphone mascot logo on the chest) unchanged on the left/right third.
3. **Unclipped Presenter Overlay, Strict Box Text Bounds & Official AJ Logo**:
   - Overlay Alex Patterson's full transparent-alpha cutout on top (`z-index: 20`) so his pointing hand and shoulders are never clipped, and allow him to overlap slightly on top of the right edge of the diagram if needed.
   - Dynamically compute box and pill widths so 100% of text labels and badges fit strictly inside their boxes with zero overflow.
   - Never use the paw emoji (`🐾`) with `codingcat.dev`; always embed the official AJ logo (`AJHeadphones.png`) inside the `codingcat.dev` badge and on Alex's black crew-neck t-shirt.

---

### Step 1: Choose the Right Diagram Topology Based on the Content (12 Archetypes)

Never default every diagram to `X` vs. `✓`. Select the archetype that matches the engineering mechanism being explained:

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

### Step 2: Compile the Verbatim 6-Part Image Generation Prompt (For Standalone Diffusion Renders)

Fill in the bracketed slots for your chosen archetype from Step 1 and pass the full compiled prompt to the image generator:

#### Archetype A: `sequence` (UML Sequence Diagram)
```text
Flat 2D hand-drawn dark-mode whiteboard UML Sequence Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

1. Drawing Style & Stroke Mechanics:
- Authentic flat 2D whiteboard sketch aesthetic with zero 3D perspective and zero glossy gradients.
- Every participant box is drawn with TWO slightly offset, overlapping, hand-drawn wobbly white (#FFFFFF) and Soft Lavender (#B4A7D6) marker strokes and filled with sparse 45-degree diagonal parallel hatch lines.

2. Top Participant Row & Lifelines:
- Across the top, draw 4 double-stroked participant boxes labeled "[PARTICIPANT_1]", "[PARTICIPANT_2]", "[PARTICIPANT_3]", and "[PARTICIPANT_4]" in clean white hand-drawn marker font (Virgil style).
- Below each participant box, draw a vertical dashed lifeline extending to the bottom, with narrow vertical rectangular activation bars along each lifeline.

3. Combined Fragment & Message Arrows:
- Surround the middle interaction zone with a dashed rectangular UML combined fragment box featuring a top-left pentagonal tag labeled "loop [deterministic frame cycle]".
- Draw numbered horizontal solid white request arrows (1, 2, 3) and dashed mint-green (#86EFAC) return arrows (4, 5) between the lifelines, each with a concise 2-to-4 word pill label above the arrow.
- Use color values strictly for rendering; never print hex codes as text on the canvas.
```

#### Archetype B: `uml-class` (UML Class & Hierarchy Diagram)
```text
Flat 2D hand-drawn dark-mode whiteboard UML Class Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

1. Drawing Style & 3-Compartment UML Class Boxes:
- Draw 4 large double-stroked wobbly white (#FFFFFF) UML Class rectangles with 45-degree diagonal hachure header fills in Royal Purple (#4B2E83), Sky Blue (#0C4A6E), and Emerald (#064E3B).
- Divide each class box horizontally into 3 classic UML compartments:
  - Top compartment: «stereotype» and bold class name ("[CLASS_1]", "[CLASS_2]", "[CLASS_3]", "[CLASS_4]").
  - Middle compartment: 2 typed fields ("+ field: type") in clean monospace chalk lettering.
  - Bottom compartment: 2 method signatures ("+ method(): ReturnType") in Electric Lime (#C5E86C) lettering.

2. UML Relationships:
- Connect the class boxes with sketchy white UML relationship lines featuring diamond composition heads and hollow triangle inheritance arrowheads, each labeled with a short relationship pill.
- Never print hex codes as text on the canvas.
```

#### Archetype C: `state-machine` (UML State Machine & Feedback Loop)
```text
Flat 2D hand-drawn dark-mode whiteboard UML State Machine and Feedback Loop Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

1. State Nodes & Initial Bullseye:
- Start on the top-left with a solid Electric Lime (#C5E86C) UML initial state circle leading into 4 rounded double-stroked state boxes arranged in a clockwise loop: "[STATE_01]" (top-left), "[STATE_02]" (top-right), "[STATE_03]" (bottom-right), and "[STATE_04]" (bottom-left), each filled with 45-degree diagonal hatch lines.

2. Central Decision Diamond & Guard Transitions:
- In the center of the loop, draw a double-stroked wobbly diamond node labeled "[CENTER_CLOCK_OR_GATE]".
- Connect the 4 states clockwise with curved white arrows and a dashed yellow (#FACC15) feedback loop arrow from "[STATE_04]" back to "[STATE_01]" labeled with a guard condition in brackets ("[score < 8] patch & retry").
- Never print hex codes as text on the canvas.
```

#### Archetype D: `layered-stack` (Layered System Stack)
```text
Flat 2D hand-drawn dark-mode whiteboard Layered System Architecture Diagram (16:9 aspect ratio) on a pure black (#000000) background with a faint dark gray (#212121) 20px technical gridline pattern.

- Draw 3 wide horizontal double-stroked tier containers stacked top-to-bottom ("LAYER 1: [TOP_TIER]", "LAYER 2: [MIDDLE_TIER]", "LAYER 3: [BOTTOM_TIER]") with 45-degree diagonal hachure fills in Purple, Sky Blue, and Mint Green.
- Inside each horizontal tier container, draw 3 clean double-stroked component pills (1-3 words each).
- Connect Layer 1 -> Layer 2 -> Layer 3 with short vertical Electric Lime (#C5E86C) arrows and protocol pills. Never print hex codes as text on the canvas.
```

---

### Step 3: Output a Structured Markdown Table Beneath the Diagram
Beneath every generated diagram, include a concise **Markdown Table** (with zero em-dashes) summarizing the components, lifelines, states, or trade-offs shown in the diagram.
