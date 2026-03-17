import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

// Load .env and .env.local into process.env before config runs.
// (Using a function config with loadEnv broke virtual module resolution.)
function loadEnvIntoProcess(dir) {
  for (const name of [".env", ".env.local"]) {
    const file = path.join(dir, name);
    try {
      const raw = fs.readFileSync(file, "utf8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
          value = value.slice(1, -1).replace(/\\(.)/g, "$1");
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) process.env[key] = value;
      }
    } catch {
      // ignore missing file
    }
  }
}
loadEnvIntoProcess(process.cwd());

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
      apiVersion: "2026-03-17",
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
    resolve: {
      alias: {
        // Sanity/visual-editing deps pull Node built-ins into client bundle; polyfill for browser
        stream: "stream-browserify",
        timers: "timers-browserify",
      },
      dedupe: ["react", "react-dom", "react-is", "react-compiler-runtime"],
    },
    optimizeDeps: {
      // Force pre-bundle CJS deps so ESM default/named exports work in client (Sanity visual-editing chain)
      include: [
        "react-is",
        "react-compiler-runtime",
        "lodash",
        "lodash/isObject",
      ],
    },
    ssr: {
      external: ["buffer", "path", "fs"].map((i) => `node:${i}`),
    },
  },
});
