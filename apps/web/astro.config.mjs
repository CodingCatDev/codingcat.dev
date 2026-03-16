import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

// Sanity config — dataset comes from env var (set by wrangler vars or .env)
// In astro.config.mjs, .env files are NOT loaded — use process.env
const sanityProjectId = process.env.SANITY_PROJECT_ID || "hfh83o0w";
const sanityDataset = process.env.SANITY_DATASET || "production";

/**
 * Vite plugin to inline font files as Uint8Array at build time.
 * Required for OG image generation on CF Workers (no filesystem access).
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
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    sanity({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      useCdn: false,
      apiVersion: "2024-01-01",
      // Visual Editing: stega encodes edit markers in strings
      // Studio is standalone (apps/sanity), not embedded — no studioBasePath
      stega: {
        studioUrl: "https://codingcat.dev.sanity.studio",
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss(), rawFonts([".ttf", ".otf"])],
    assetsInclude: ["**/*.wasm"],
    assetsExclude: ["**/*.ttf", "**/*.otf"],
    ssr: {
      external: ["buffer", "path", "fs"].map((i) => `node:${i}`),
    },
  },
});
