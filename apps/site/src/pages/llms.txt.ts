import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const content = `# CodingCat.dev

> CodingCat.dev is an open-source technical education platform, podcast network, and developer resource covering fullstack JavaScript, TypeScript, modern frontend frameworks (Astro, Next.js, React, Svelte, Vue), edge computing, headless CMS architecture (Sanity), and AI agent workflows.

## Core Content Sections

- [Blog Tutorials and Articles](${origin}/blog): Practical, code-focused guides and tutorials for modern web developers.
- [Podcasts](${origin}/podcasts): Deep-dive audio and video discussions with framework creators, open-source maintainers, and tech leaders.
- [Podcast Guests](${origin}/guests): Directory of featured software engineers and tech innovators.
- [Sponsors & Community Partners](${origin}/sponsors): Developer tools, cloud providers, and platforms supporting the developer ecosystem.

## Machine-Readable Discovery & Agent Tools

- [Full LLM Directory](${origin}/llms-full.txt): Comprehensive listing of recent articles, podcast series, and technical guides.
- [API Catalog (RFC 9727)](${origin}/.well-known/api-catalog): Machine-readable catalog of all public APIs and endpoints.
- [OpenAPI Specification](${origin}/.well-known/openapi.json): OpenAPI 3.1 schema for search and agent endpoints.
- [ARD AI Catalog](${origin}/.well-known/ai-catalog.json): Agentic Resource Discovery capability manifest.
- [MCP Server Card](${origin}/.well-known/mcp/server-card.json): Model Context Protocol server metadata describing agent tools.
- [Agent Skills Discovery](${origin}/.well-known/agent-skills/index.json): Discoverable agent capabilities and task specifications.
- [Auth.md Specification](${origin}/auth.md): Autonomous AI agent authentication and registration guide.
- [OAuth Protected Resource Metadata](${origin}/.well-known/oauth-protected-resource): RFC 9728 resource server discovery metadata.
- [Search API](${origin}/api/search?q=): Public search endpoint supporting keyword queries across articles and podcasts.
- [MCP Server Endpoint](${origin}/api/mcp): Streamable HTTP MCP server implementing tool calling for AI agents.
- [Blog RSS Feed](${origin}/blog/rss.xml): RSS 2.0 feed of all published blog tutorials.
- [Podcast RSS Feed](${origin}/podcasts/rss.xml): RSS feed with podcast audio enclosures and transcripts.
- [Sitemap Index](${origin}/sitemap-index.xml): XML sitemap index of all pages and episodes.

## Markdown Content Negotiation

CodingCat.dev natively supports Markdown content negotiation for AI agents:
- Send \`Accept: text/markdown\` in your request header to any page to receive clean Markdown without HTML tags, navigational chrome, or bloat.
- Alternatively, append \`.md\` to any article, podcast, or page URL.
`;

	return new Response(content, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/.well-known/api-catalog>; rel="api-catalog", <${origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card", <${origin}/.well-known/agent-skills/index.json>; rel="agent-skills", <${origin}/llms-full.txt>; rel="alternate"; type="text/plain"`,
		},
	});
};
