import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Serves /pricing.md machine-readable pricing and usage contract for AI agents.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const content = `# CodingCat.dev Pricing for Agents

> Machine-readable pricing, usage tiers, and API constraints for AI agents and automated systems.

## Public Read Operations
- **Cost**: $0.00 (Completely Free)
- **Authentication**: None required
- **Access**: Full access to all published articles, tutorials, podcast transcripts, author bios, guest listings, and search.
- **Fair Use**: Standard edge rate limiting applies (up to 60 requests per minute per origin).

## Agent Actions & Tools
- **Tool \`search_content\`**: Free (unlimited standard usage).
- **Tool \`submit_sponsorship_inquiry\`**: Free to submit.
- **Model Context Protocol (MCP)**: Free public read tools via \`${origin}/api/mcp\`.

## Commercial Partnerships & Sponsorships
For media sponsorships, newsletter inclusions, video features, or sponsored developer tutorials:
- **Packages & Inquiries**: [\`${origin}/sponsorships\`](${origin}/sponsorships)
- **Direct Contact**: alex@codingcat.dev
- **Agent Identity Registration**: [\`${origin}/auth.md\`](${origin}/auth.md)
`;

	return new Response(content, {
		headers: {
			"content-type": "text/markdown; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/.well-known/api-catalog>; rel="api-catalog", <${origin}/llms.txt>; rel="llms-txt", <${origin}/auth.md>; rel="auth-md"`,
		},
	});
};
