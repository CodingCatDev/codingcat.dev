import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Set via SANITY_STUDIO_HOSTNAME in CI: e.g. "codingcat.dev" (prod), "codingcat-dev" (dev)
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  deployment: {
    appId:
      process.env.SANITY_STUDIO_DATASET === "dev"
        ? "v3ekp24b18rznov8t8r8p8v7"
        : "kkqlvww6axzooqsa23pm0075",
  },
  typegen: {
    // Queries must live in .ts files — TypeGen cannot parse .astro frontmatter,
    // so defineQuery calls inside .astro are silently skipped.
    path: "../site/src/lib/sanity/queries/**/*.ts",
    schema: "./extract.json",
    generates: "../site/src/lib/sanity/types.gen.ts",
    overloadClientMethods: true,
  },
});
