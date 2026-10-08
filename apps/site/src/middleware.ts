import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { htmlToMarkdown } from "@/lib/html-to-markdown";
import { createSanityContext, PREVIEW_COOKIE } from "@/lib/sanity/context";
import { resolveSiteUrl } from "@/lib/site";

/**
 * Bindings and vars come from `cloudflare:workers`, not `locals.runtime.env`:
 * @astrojs/cloudflare v14 reduced `Runtime` to `{ cfContext }` and marks
 * `locals.runtime` a deprecated getter. Reading secrets here (rather than from
 * `import.meta.env`) also keeps them as Cloudflare secrets instead of letting
 * Vite inline them into the deployed Worker bundle.
 *
 * Implements Cloudflare Agent Readiness & AEO standards:
 * - RFC 8288 Link headers for discovery (api-catalog, mcp-server-card, agent-skills, llms-txt)
 * - Markdown Content Negotiation: Accept: text/markdown returns token-efficient Markdown
 * - Dynamic /index.md and *.md path rewriting to serve markdown versions of all pages
 */
export const onRequest = defineMiddleware(async (context, next) => {
	// `Astro.site` is baked in at build time, but SITE_URL is a per-environment
	// wrangler var and CI builds once for both. Without this, the dev Worker
	// would emit canonical and og:url values pointing at production.
	context.locals.siteUrl = resolveSiteUrl(
		(env as unknown as Record<string, string | undefined>).SITE_URL,
		context.site,
	);

	context.locals.sanity = createSanityContext({
		env: env as unknown as Record<string, string | undefined>,
		url: context.url,
		hasPreviewCookie: context.cookies.has(PREVIEW_COOKIE),
	});

	const origin = context.locals.siteUrl.origin;
	const pathname = context.url.pathname;
	const isMarkdownUrl =
		pathname.endsWith(".md") || pathname.endsWith("/index.md");
	const acceptMarkdown = context.request.headers
		.get("Accept")
		?.includes("text/markdown");
	const wantsMarkdown = isMarkdownUrl || Boolean(acceptMarkdown);

	let response: Response;
	if (isMarkdownUrl) {
		const cleanPath =
			pathname.replace(/\/index\.md$/, "").replace(/\.md$/, "") || "/";
		response = await context.rewrite(cleanPath);
	} else {
		response = await next();
	}

	if (context.locals.sanity.preview.enabled) {
		// Not cosmetic: without this a response containing unpublished drafts can
		// be written to the edge cache and served to the public.
		response.headers.set("Cache-Control", "no-store, private");
		response.headers.set("X-Robots-Tag", "noindex, nofollow");
	}

	// Always emit Link headers (RFC 8288) for AI agent discoverability
	response.headers.set(
		"Link",
		`<${origin}/.well-known/api-catalog>; rel="api-catalog", <${origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card", <${origin}/.well-known/agent-skills/index.json>; rel="agent-skills", <${origin}/llms.txt>; rel="llms-txt"`,
	);
	response.headers.append("Vary", "Accept");

	// Content negotiation: transform HTML to clean Markdown when requested
	const contentType = response.headers.get("content-type") || "";
	if (
		wantsMarkdown &&
		contentType.includes("text/html") &&
		response.status === 200
	) {
		const html = await response.text();
		const canonicalPath =
			pathname.replace(/\/index\.md$/, "").replace(/\.md$/, "") || "/";
		const canonicalUrl = `${origin}${canonicalPath}`;
		const markdown = htmlToMarkdown(html, canonicalUrl);

		const headers = new Headers(response.headers);
		headers.set("content-type", "text/markdown; charset=utf-8");
		headers.delete("content-length");

		return new Response(markdown, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	}

	return response;
});
