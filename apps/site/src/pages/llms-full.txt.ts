import type { APIRoute } from "astro";
import { defineQuery } from "groq";

export const prerender = false;

const llmsFullQuery = defineQuery(`
	*[_type in ["post", "podcast"] && defined(slug.current)] | order(coalesce(date, _createdAt) desc) [0...100] {
		_type,
		"title": coalesce(title, "Untitled"),
		"slug": slug.current,
		excerpt,
		"date": coalesce(date, _createdAt)
	}
`);

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	let items: Array<{
		_type: string;
		title: string;
		slug: string;
		excerpt?: string | null;
		date?: string | null;
	}> = [];

	try {
		items = (await locals.sanity.fetchPublished(llmsFullQuery)) ?? [];
	} catch (err) {
		console.warn("Failed to fetch documents for llms-full.txt:", err);
	}

	const posts = items.filter((i) => i._type === "post");
	const podcasts = items.filter((i) => i._type === "podcast");

	let content = `# CodingCat.dev - Complete LLM Directory

> Full technical content directory of CodingCat.dev web development tutorials, architecture deep dives, and podcast episodes. For high-level summary and APIs, see ${origin}/llms.txt.

## Machine Interfaces
- API Catalog: ${origin}/.well-known/api-catalog
- MCP Server Card: ${origin}/.well-known/mcp/server-card.json
- MCP Streamable Endpoint: ${origin}/api/mcp
- Search Endpoint: ${origin}/api/search?q={query}
- Markdown Negotiation: Send \`Accept: text/markdown\` on any URL.

## Recent Blog Posts & Tutorials
`;

	for (const post of posts) {
		const url = `${origin}/post/${post.slug}`;
		const desc = post.excerpt
			? ` - ${post.excerpt.replace(/\s+/g, " ").trim()}`
			: "";
		content += `- [${post.title}](${url}.md)${desc}\n`;
	}

	content += "\n## Recent Podcasts & Interviews\n";

	for (const ep of podcasts) {
		const url = `${origin}/podcast/${ep.slug}`;
		const desc = ep.excerpt
			? ` - ${ep.excerpt.replace(/\s+/g, " ").trim()}`
			: "";
		content += `- [${ep.title}](${url}.md)${desc}\n`;
	}

	return new Response(content, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/llms.txt>; rel="canonical", <${origin}/.well-known/api-catalog>; rel="api-catalog"`,
		},
	});
};
