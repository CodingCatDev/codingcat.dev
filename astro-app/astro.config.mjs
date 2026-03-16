import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    sanity({
      projectId: "hfh83o0w",
      dataset: "production",
      useCdn: false,
      apiVersion: "2024-01-01",
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
