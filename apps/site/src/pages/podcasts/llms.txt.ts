import type { APIRoute } from "astro";
import { defineQuery } from "groq";

export const prerender = false;

const podcastsLlmsQuery = defineQuery(`
	*[_type == "podcast" && defined(slug.current)] | order(coalesce(date, _createdAt) desc) [0...100] {
		"title": coalesce(title, "Untitled"),
		"slug": slug.current,
		excerpt,
		season,
		episode,
		"date": coalesce(date, _createdAt),
		"guests": guest[]->title
	}
`);

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	let episodes: Array<{
		title: string;
		slug: string;
		excerpt?: string | null;
		season?: number | null;
		episode?: number | null;
		date?: string | null;
		guests?: Array<string | null> | null;
	}> = [];

	try {
		episodes = (await locals.sanity.fetchPublished(podcastsLlmsQuery)) ?? [];
	} catch (err) {
		console.warn("Failed to fetch podcasts for /podcasts/llms.txt:", err);
	}

	let content = `# CodingCat.dev Podcasts — Episodes, Interviews & Transcripts

> Scoped LLM directory of CodingCat.dev podcast episodes and engineering interviews. Each episode page includes full show notes and transcripts when requested as Markdown via \`/index.md\`, \`.md\`, or \`Accept: text/markdown\`. For the site-wide index see ${origin}/llms.txt.

## Podcast Episodes
`;

	for (const ep of episodes) {
		const url = `${origin}/podcast/${ep.slug}/index.md`;
		const guestList = (ep.guests ?? []).filter(Boolean);
		const guestSuffix =
			guestList.length > 0 ? ` (with ${guestList.join(", ")})` : "";
		const desc = ep.excerpt
			? `: ${ep.excerpt.replace(/\s+/g, " ").trim()}`
			: "";
		content += `- [${ep.title}${guestSuffix}](${url})${desc}\n`;
	}

	return new Response(content, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			"access-control-allow-origin": "*",
			Vary: "Accept",
			Link: `<${origin}/llms.txt>; rel="up", <${origin}/podcasts/rss.xml>; rel="alternate"; type="application/rss+xml"`,
		},
	});
};
