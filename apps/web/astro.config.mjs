import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";

// Sanity config — dataset comes from env var (set by wrangler vars or .env)
// In astro.config.mjs, .env files are NOT loaded — use process.env
const sanityProjectId = process.env.SANITY_PROJECT_ID || "hfh83o0w";
const sanityDataset = process.env.SANITY_DATASET || "production";

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
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
