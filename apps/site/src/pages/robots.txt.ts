import type { APIRoute } from "astro";

/**
 * Runtime rather than prerendered: the Host and Sitemap lines carry the
 * environment's own origin, which is only known per request (SITE_URL is a
 * wrangler var, and one build serves both Workers).
 *
 * Non-production environments are disallowed wholesale so the dev Worker and
 * any preview alias cannot be indexed alongside the real site.
 *
 * In production, implements modern AI Agent Readiness standards:
 * - RFC 9309 compliance
 * - Content Signals (contentsignals.org): search=yes, ai-input=yes, ai-train=no
 * - Explicit access for AI search and assistant crawlers
 * - Explicit allow rules for machine-readable discovery endpoints (/api/search, /api/mcp, /.well-known/, /llms.txt)
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;
	const isProduction = origin === "https://codingcat.dev";

	const body = isProduction
		? `User-Agent: *
Content-Signal: ai-train=no, search=yes, ai-input=yes
Allow: /
Allow: /api/search
Allow: /api/mcp
Allow: /.well-known/
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /api/
Disallow: /dashboard/

User-Agent: GPTBot
Allow: /
Allow: /api/search
Allow: /api/mcp
Allow: /.well-known/
Allow: /llms.txt
Allow: /llms-full.txt

User-Agent: ClaudeBot
Allow: /
Allow: /api/search
Allow: /api/mcp
Allow: /.well-known/
Allow: /llms.txt
Allow: /llms-full.txt

User-Agent: PerplexityBot
Allow: /
Allow: /api/search
Allow: /api/mcp
Allow: /.well-known/
Allow: /llms.txt
Allow: /llms-full.txt

User-Agent: Applebot-Extended
Allow: /
Allow: /api/search
Allow: /api/mcp
Allow: /.well-known/
Allow: /llms.txt
Allow: /llms-full.txt

Host: ${origin}
Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/sitemap-index.xml
`
		: `User-Agent: *
Disallow: /
`;

	return new Response(body, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "max-age=0, s-maxage=3600",
		},
	});
};
