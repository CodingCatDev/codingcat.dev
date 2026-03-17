import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
