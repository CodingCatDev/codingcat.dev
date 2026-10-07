import fs from "node:fs";
import path from "node:path";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

/**
 * Inline font files as Uint8Array at build time.
 * Required for OG image generation on Workers, which has no filesystem.
 * Harvested verbatim from the pre-Next Astro app (branch `dev`,
 * apps/web/astro.config.mjs) — it is the payoff of a long debugging arc
 * around Satori/workers-og and should not be re-derived.
 */
function rawFonts(extensions) {
	return {
		name: "vite-plugin-raw-fonts",
		enforce: "pre",
		resolveId(id, importer) {
			if (extensions.some((ext) => id.includes(ext))) {
				if (id.startsWith(".")) {
					return path.resolve(path.dirname(importer), id);
				}
				return id;
			}
		},
		load(id) {
			if (extensions.some((ext) => id.includes(ext))) {
				const buffer = fs.readFileSync(id);
				return `export default new Uint8Array([${Array.from(buffer).join(",")}]);`;
			}
		},
	};
}

export default defineConfig({
	session: false,
	site: process.env.SITE_URL ?? "https://codingcat.dev",
	output: "server",
	adapter: cloudflare({
		// Images are Sanity CDN URLs already transformed by @sanity/image-url;
		// do not route them through Cloudflare Images.
		imageService: "passthrough",
		platformProxy: { enabled: true },
	}),
	integrations: [react()],
	// Replaces next/font/google. The CSS variable names match the ones
	// apps/web/app/globals.css already binds to body / headings, so the token
	// contract carries over unchanged.
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-inter",
			weights: ["400 700"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["system-ui", "sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Nunito",
			cssVariable: "--font-nunito",
			weights: ["400 900"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["system-ui", "sans-serif"],
		},
	],
	// Legacy RSS feed redirects. Listing stubs (/blog/page, /podcasts/page,
	// /authors, /guests, /sponsors) are implemented as dedicated SSR redirect
	// pages to guarantee true HTTP 302 Found status codes.
	redirects: {
		"/rss.xml": { status: 301, destination: "/blog/rss.xml" },
		"/podcast/rss.xml": { status: 301, destination: "/podcasts/rss.xml" },
		"/feed.xml": { status: 301, destination: "/blog/rss.xml" },
	},
	vite: {
		plugins: [tailwindcss(), rawFonts([".ttf", ".otf"])],
		assetsInclude: ["**/*.wasm"],
	},
});
