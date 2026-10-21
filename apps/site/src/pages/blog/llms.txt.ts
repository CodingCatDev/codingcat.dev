import type { APIRoute } from "astro";
import { defineQuery } from "groq";

export const prerender = false;

const blogLlmsQuery = defineQuery(`
	*[_type == "post" && defined(slug.current)] | order(coalesce(date, _createdAt) desc) [0...100] {
		"title": coalesce(title, "Untitled"),
		"slug": slug.current,
		excerpt,
		"date": coalesce(date, _createdAt),
		"authors": author[]->title
	}
`);

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	let posts: Array<{
		title: string;
		slug: string;
		excerpt?: string | null;
		date?: string | null;
		authors?: Array<string | null> | null;
	}> = [];

	try {
		posts = (await locals.sanity.fetchPublished(blogLlmsQuery)) ?? [];
	} catch (err) {
		console.warn("Failed to fetch posts for /blog/llms.txt:", err);
	}

	let content = `# CodingCat.dev Blog — Tutorials & Architecture Guides

> Scoped LLM directory of CodingCat.dev blog posts, tutorials, and technical articles. Each URL supports \`/index.md\`, \`.md\`, or \`Accept: text/markdown\`. For the site-wide index see ${origin}/llms.txt.

## Tutorials & Articles
`;

	for (const post of posts) {
		const url = `${origin}/post/${post.slug}/index.md`;
		const desc = post.excerpt
			? `: ${post.excerpt.replace(/\s+/g, " ").trim()}`
			: "";
		content += `- [${post.title}](${url})${desc}\n`;
	}

	return new Response(content, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			"access-control-allow-origin": "*",
			Vary: "Accept",
			Link: `<${origin}/llms.txt>; rel="up", <${origin}/blog/rss.xml>; rel="alternate"; type="application/rss+xml"`,
		},
	});
};
