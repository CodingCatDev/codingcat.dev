import type { APIRoute } from "astro";

export const prerender = false;

export const SKILL_CONTENT = `---
name: search-content
description: Search fullstack web development tutorials, podcasts, and blog posts on CodingCat.dev
---

# Search CodingCat.dev Content

Use this skill to search and retrieve CodingCat.dev tutorials, articles, podcasts, transcripts, and metadata across modern web development topics (Astro, TypeScript, React, Svelte, Sanity, Cloudflare Workers, Tailwind CSS).

## Actions
- Search API: GET https://codingcat.dev/api/search?q={query}
- Model Context Protocol (MCP): POST https://codingcat.dev/api/mcp
`;

export const GET: APIRoute = async () => {
	return new Response(SKILL_CONTENT, {
		headers: {
			"content-type": "text/markdown; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
