import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Set via SANITY_STUDIO_HOSTNAME in CI: e.g. "codingcat.dev" (prod), "codingcat-dev" (dev)
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
});
