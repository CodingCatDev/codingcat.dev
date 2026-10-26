# "WTF is..." Series Blueprint (`wtf-is-series.md`)

The **"What the F\*ck is [Tech]?" ("WTF is...")** series is CodingCat.dev's signature rapid-fire technical explainer format. It cuts through marketing buzzwords to explain what a tool actually is, how it works under the hood, when you should use it, and when you should skip it.

## 5-Part Narrative Structure

Every "WTF is..." blog post and video script follows this exact 5-part arc:

| Section | Target Length / Time | Objective | Visual / Code Element |
| :--- | :--- | :--- | :--- |
| **1. The 15-Second Hook** | `0:00 - 0:15` (50 words) | Call out the confusing marketing buzzword and state in one plain sentence what the technology actually does. | Presenter cutaway (`@alex.patterson`) + AJ reaction graphic. |
| **2. The Mental Model (Excalidraw)** | `0:15 - 1:30` (150 words) | Contrast the old painful way (Coral `#FCA5A5` `X` mark) with how the new tool works (Mint `#86EFAC` / Lime `#C5E86C` checkmark). | Dark-mode Excalidraw diagram on `#000000` or `#0F172A` canvas. |
| **3. Show Me the Code** | `1:30 - 4:30` (300 words) | Walk through a minimal, real-world implementation in Astro, Next.js, Hono, Sanity, or Cloudflare Workers. | `JetBrains Mono` annotated code blocks with zero placeholder TODOs. |
| **4. The Trade-Off Matrix** | `4:30 - 6:00` (150 words) | Compare the tool honestly against its top 2 competitors using a Markdown comparison table. | Styled dark-mode Comparison Table (`08-components.md`). |
| **5. Verdict: Purrfect or Pass?** | `6:00 - End` (75 words) | Give a clear, opinionated recommendation on who should adopt it today and who should wait. | AJ Pro-Tip Callout Box + link to starter repo. |

## Approved Hook Templates
- *"Every conference talk this year mentions [Tech], but half the docs read like a PhD thesis. Let's break down what [Tech] actually is in plain English, look at the architecture in Excalidraw, and wire it up in TypeScript."*
- *"If you have ever tried to wire up [Pain Point] at the edge, you know how quickly it turns into configuration hell. Here is how [Tech] solves it, and where the hidden trade-offs live."*
