import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const skillsIndex = {
		$schema:
			"https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/index.schema.json",
		version: "0.2.0",
		provider: {
			name: "CodingCat.dev",
			url: origin,
		},
		skills: [
			{
				name: "search-content",
				type: "skill-md",
				description:
					"Search fullstack web development tutorials, podcasts, and blog posts on CodingCat.dev",
				url: `${origin}/.well-known/agent-skills/search-content/SKILL.md`,
				digest:
					"sha256:16567e9f7d6d3ed78c4be72cdb450eb46b384f5f91fc355ae866f364859164db",
			},
		],
	};

	return new Response(JSON.stringify(skillsIndex, null, 2), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			"access-control-allow-origin": "*",
			Vary: "Accept",
			Link: `<${origin}/llms.txt>; rel="llms-txt", <${origin}/.well-known/api-catalog>; rel="api-catalog"`,
		},
	});
};
