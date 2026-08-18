import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

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
  site: process.env.SITE_URL ?? "https://codingcat.dev",
  output: "server",
  adapter: cloudflare({
    // Images are Sanity CDN URLs already transformed by @sanity/image-url;
    // do not route them through Cloudflare Images.
    imageService: "passthrough",
    platformProxy: { enabled: true },
  }),
  integrations: [react()],
  redirects: {
    "/blog/page": "/blog",
    "/podcasts/page": "/podcasts",
    "/authors/page": "/authors",
    "/guests/page": "/guests",
    "/sponsors/page": "/sponsors",
  },
  vite: {
    plugins: [tailwindcss(), rawFonts([".ttf", ".otf"])],
    assetsInclude: ["**/*.wasm"],
  },
});
