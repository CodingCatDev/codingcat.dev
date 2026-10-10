import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
	process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!token) {
	console.error(
		"Error: Neither SANITY_API_WRITE_TOKEN nor SANITY_AUTH_TOKEN is defined in the environment.",
	);
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: "2025-09-30",
	useCdn: false,
});

function markdownToPortableText(markdownText) {
	const lines = markdownText.split("\n");
	const blocks = [];
	let keyCounter = 1;
	const getKey = () =>
		`b_${Date.now().toString(36)}_${(keyCounter++).toString(36)}`;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		if (line.startsWith("### ")) {
			blocks.push({
				_key: getKey(),
				_type: "block",
				style: "h3",
				markDefs: [],
				children: [
					{
						_key: getKey(),
						_type: "span",
						marks: [],
						text: line.replace(/^###\s+/, ""),
					},
				],
			});
		} else if (line.startsWith("## ")) {
			blocks.push({
				_key: getKey(),
				_type: "block",
				style: "h2",
				markDefs: [],
				children: [
					{
						_key: getKey(),
						_type: "span",
						marks: [],
						text: line.replace(/^##\s+/, ""),
					},
				],
			});
		} else if (line.startsWith("> ")) {
			blocks.push({
				_key: getKey(),
				_type: "block",
				style: "blockquote",
				markDefs: [],
				children: [
					{
						_key: getKey(),
						_type: "span",
						marks: [],
						text: line.replace(/^>\s+/, ""),
					},
				],
			});
		} else if (line.startsWith("- ")) {
			blocks.push({
				_key: getKey(),
				_type: "block",
				style: "normal",
				listItem: "bullet",
				level: 1,
				markDefs: [],
				children: [
					{
						_key: getKey(),
						_type: "span",
						marks: [],
						text: line.replace(/^-\s+/, ""),
					},
				],
			});
		} else {
			blocks.push({
				_key: getKey(),
				_type: "block",
				style: "normal",
				markDefs: [],
				children: [{ _key: getKey(), _type: "span", marks: [], text: line }],
			});
		}
	}
	return blocks;
}

// Curated high-fidelity content synthesized directly from full episode transcripts:

const SVELTEKIT_DAISYUI_CONTENT = `## Overview: SvelteKit, DaisyUI, and Headless APIs
In this stream, Alex and Brittany dive into modern frontend development with SvelteKit, exploring how to build polished, responsive user interfaces without writing hundreds of lines of custom CSS. The discussion focuses on combining utility-first Tailwind CSS with the component-driven philosophy of DaisyUI, alongside integrating external dynamic content via Notion APIs.

## Why DaisyUI with Tailwind CSS?
Tailwind CSS provides incredible design flexibility, but constructing common UI components—such as buttons, modals, dropdowns, and navigation bars—often requires long strings of utility classes. DaisyUI solves this by adding semantic class names (like \`btn\`, \`btn-primary\`, \`card\`, and \`navbar\`) directly to Tailwind CSS as a plugin.
- Pure CSS Components: DaisyUI components don't require external JavaScript runtime overhead.
- Built-in Theme Support: Instant light/dark and retro themes configurable via simple HTML \`data-theme\` attributes.
- Clean Svelte Markup: Allows Svelte components to remain concise and readable while retaining full Tailwind override capabilities.

## Architecture & Code Concepts Explored
- SvelteKit Project Setup: Initializing a SvelteKit project and configuring \`tailwind.config.cjs\` with the DaisyUI plugin.
- Dynamic Component Styling: Using Svelte reactive props and template literals to conditionally apply DaisyUI variant classes (e.g., swapping button states dynamically).
- Data Ingestion & API Handling: Structuring server routes and environment variables in SvelteKit to securely query external endpoints.
- Layouts & Reusability: Creating reusable layout components and navigation wrappers across SvelteKit route hierarchies.

## Key Takeaways
1. Semantic Tailwind: DaisyUI dramatically speeds up prototyping without locking you into rigid JavaScript UI frameworks.
2. SvelteKit Ergonomics: The intuitive separation of routing, server load functions, and client components in SvelteKit makes working with third-party CSS libraries seamless.
3. Rapid Theming: Switching whole application color palettes with DaisyUI themes takes just a single attribute change.`;

const GITHUB_CMS_CONTENT = `## Overview: Using GitHub as a Headless Content Management System
In this live coding session, Alex explores treating GitHub repositories as a fully functional, open-source content management system (CMS) for modern web applications. By utilizing GitHub Discussions, Issues, Projects, and the GraphQL API, creators and developer communities can manage content openly without relying on proprietary databases or paid headless platforms.

## The Motivation: Open Source & Community-Driven Content
Traditional CMS platforms often introduce separate authentication silos, proprietary editing interfaces, and recurring hosting costs. By contrast, leveraging GitHub as a CMS provides several distinct advantages:
- Transparent Contributions: Authors and readers already possess GitHub accounts and understand Markdown/Git workflows.
- Built-in Moderation & Version Control: Every edit, discussion thread, or revision history is preserved automatically with full cryptographic integrity.
- Zero Database Maintenance: GitHub stores and hosts the content while providing high-uptime GraphQL and REST APIs.

## Architecture & Practical Implementation
- Authentication & Scoped Access: Generating GitHub Personal Access Tokens (PATs) with minimal scopes (\`read:org\`, \`repo\`) to safely query content.
- GraphQL API Integration: Constructing GitHub GraphQL queries to fetch project boards, milestone tasks, issue bodies, and discussion categories.
- Mapping Content to SvelteKit: Transforming fetched GitHub Markdown and frontmatter into structured data objects for rendering in SvelteKit pages.
- Sponsorships & Creator Compensation: Discussing models for using GitHub Sponsors to directly fund community authors and lesson creators.

## Key Takeaways
1. Developer-Friendly Publishing: For developer-centric platforms and educational sites, GitHub represents a natural, accessible content authoring environment.
2. Structured Data from Projects: GitHub Projects (v2) with custom fields, statuses, and milestones provide enough metadata structure to power blogs, course outlines, and community roadmaps.
3. Openness by Default: Empowering users to submit improvements via pull requests or discussions turns a static blog into a collaborative knowledge base.`;

async function run() {
	console.log(`Target dataset: ${dataset}, project: ${projectId}`);

	// 1. SvelteKit with DaisyUI
	const doc1Id = "52775db0-6f8e-4a54-9e7d-2910a96b662a";
	console.log(`Backfilling content for "${doc1Id}" (SvelteKit with DaisyUI)...`);
	const blocks1 = markdownToPortableText(SVELTEKIT_DAISYUI_CONTENT);
	await client
		.patch(doc1Id)
		.set({ content: blocks1 })
		.commit()
		.then(() => console.log(`✓ Successfully updated ${doc1Id}`))
		.catch((err) => console.error(`✗ Error updating ${doc1Id}:`, err.message));

	// 2. GitHub CMS
	const doc2Id = "25596293-2ad4-47e5-b692-dbe6b8f80084";
	console.log(`Backfilling content for "${doc2Id}" (GitHub CMS)...`);
	const blocks2 = markdownToPortableText(GITHUB_CMS_CONTENT);
	await client
		.patch(doc2Id)
		.set({ content: blocks2 })
		.commit()
		.then(() => console.log(`✓ Successfully updated ${doc2Id}`))
		.catch((err) => console.error(`✗ Error updating ${doc2Id}:`, err.message));

	console.log("Backfill complete!");
}

run().catch((err) => {
	console.error("Backfill script error:", err);
	process.exit(1);
});
