# Module 05: Corner Radius & Hand-Drawn Organic Borders

CodingCat.dev uses organic, slightly imperfect hand-drawn borders paired with generous rounded corners:

- **`.hand-border`** (Pills, Floating Navbar, Hero Whiteboard, Sticky Notes):
  ```css
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  border: 2px solid var(--cc-border-sketch);
  ```
- **`.hand-border-rect`** (Rectangular Cards, Flowchart Nodes):
  ```css
  border-radius: 20px 8px 18px 10px;
  border: 2px solid var(--cc-border-sketch);
  ```
- **Standard Radii**:
  - `rounded-xl` (`12px`): Inner video/thumbnail frames and flowchart nodes
  - `rounded-2xl` (`16px`): Sticky notes and callout boxes
  - `rounded-3xl` (`24px`): Content cards, teardown boards, and contained footer
  - `rounded-full` (`9999px`): Floating pill navbar, tactile CTA buttons, and category pills
