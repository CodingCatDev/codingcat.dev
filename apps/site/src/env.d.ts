/// <reference path="../.astro/types.d.ts" />

/**
 * Font files imported for OG image generation.
 *
 * The `rawFonts` Vite plugin in astro.config.mjs intercepts these and returns
 * the file contents as a Uint8Array — Workers has no filesystem, so Satori
 * cannot read them at runtime. Astro's own asset typings declare `.ttf`
 * imports as a URL string, which is the opposite of what actually arrives, so
 * they are re-declared here.
 */
declare module "*.ttf" {
	const data: Uint8Array;
	export default data;
}

declare module "*.otf" {
	const data: Uint8Array;
	export default data;
}

declare namespace App {
	interface Locals {
		sanity: import("./lib/sanity/context").SanityRequestContext;
		/**
		 * Canonical origin for this request, resolved from the runtime SITE_URL
		 * var. Prefer this over `Astro.site`, which is fixed at build time.
		 */
		siteUrl: URL;
	}
}

declare namespace Cloudflare {
	interface Env {
		SANITY_API_READ_TOKEN?: string;
	}
}

declare namespace astroHTML.JSX {
	interface FormHTMLAttributes {
		toolname?: string;
		tooldescription?: string;
	}
	interface InputHTMLAttributes {
		toolparamdescription?: string;
	}
	interface SelectHTMLAttributes {
		toolparamdescription?: string;
	}
	interface TextareaHTMLAttributes {
		toolparamdescription?: string;
	}
}
