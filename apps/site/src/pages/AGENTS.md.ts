import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Serves /AGENTS.md guide for autonomous AI agents, coding assistants, and discovery systems.
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const content = `# codingcat.dev: Agent Guide

> Autonomous AI Agent Navigation & Capability Guide for CodingCat.dev.

This site welcomes AI agents, LLM researchers, and coding assistants. No authentication or API keys are required for read operations.

## Capabilities & Protocols
- **MCP Server Card**: [\`${origin}/.well-known/mcp/server-card.json\`](${origin}/.well-known/mcp/server-card.json)
- **MCP Streamable HTTP Endpoint**: \`${origin}/api/mcp\`
- **JSON API (OpenAPI 3.1)**: [\`${origin}/openapi.json\`](${origin}/openapi.json)
- **API Catalog (RFC 9727)**: [\`${origin}/.well-known/api-catalog\`](${origin}/.well-known/api-catalog)
- **Agent Skills**: [\`${origin}/.well-known/agent-skills/index.json\`](${origin}/.well-known/agent-skills/index.json)
- **AI Resource Manifest (ARD)**: [\`${origin}/.well-known/ai-catalog.json\`](${origin}/.well-known/ai-catalog.json)
- **Agent Index**: [\`${origin}/.well-known/agents.json\`](${origin}/.well-known/agents.json)
- **WebMCP**: Imperative tool \`search_content\` registered on page load and declarative form attributes

## Content Contracts
- **Authentication**: [\`${origin}/auth.md\`](${origin}/auth.md)
- **Pricing**: [\`${origin}/pricing.md\`](${origin}/pricing.md)
- **LLM Summary**: [\`${origin}/llms.txt\`](${origin}/llms.txt)
- **LLM Full Index**: [\`${origin}/llms-full.txt\`](${origin}/llms-full.txt)

## How to Connect

### 1. Direct Search API
\`\`\`http
GET ${origin}/api/search?q={query} HTTP/1.1
Accept: application/json
\`\`\`

### 2. Streamable HTTP Model Context Protocol (MCP)
\`\`\`http
POST ${origin}/api/mcp HTTP/1.1
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_content",
    "arguments": { "query": "astro" }
  },
  "id": 1
}
\`\`\`

### 3. Markdown Content Negotiation
Every URL on \`codingcat.dev\` serves clean, token-efficient Markdown:
- Add \`.md\` extension: \`${origin}/blog.md\`
- Or send header: \`Accept: text/markdown\`

## Etiquette & Policies
- Identify your agent with a descriptive User-Agent.
- Content usage preferences: \`train-ai=n, search=y\`.
- All public read requests are free and do not require rate-limiting under normal usage.
`;

	return new Response(content, {
		headers: {
			"content-type": "text/markdown; charset=utf-8",
			"cache-control": "public, max-age=3600, s-maxage=86400",
			Vary: "Accept",
			Link: `<${origin}/.well-known/api-catalog>; rel="api-catalog", <${origin}/llms.txt>; rel="llms-txt", <${origin}/pricing.md>; rel="pricing", <${origin}/auth.md>; rel="auth-md"`,
		},
	});
};
