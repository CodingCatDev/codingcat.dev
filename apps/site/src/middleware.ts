import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { createSanityContext, PREVIEW_COOKIE } from "@/lib/sanity/context";
import { resolveSiteUrl } from "@/lib/site";

/**
 * Bindings and vars come from `cloudflare:workers`, not `locals.runtime.env`:
 * @astrojs/cloudflare v14 reduced `Runtime` to `{ cfContext }` and marks
 * `locals.runtime` a deprecated getter. Reading secrets here (rather than from
 * `import.meta.env`) also keeps them as Cloudflare secrets instead of letting
 * Vite inline them into the deployed Worker bundle.
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

	const response = await next();

	if (context.locals.sanity.preview.enabled) {
		// Not cosmetic: without this a response containing unpublished drafts can
		// be written to the edge cache and served to the public.
		response.headers.set("Cache-Control", "no-store, private");
		response.headers.set("X-Robots-Tag", "noindex, nofollow");
	}

	return response;
});
