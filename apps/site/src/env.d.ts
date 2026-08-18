/// <reference path="../.astro/types.d.ts" />

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
