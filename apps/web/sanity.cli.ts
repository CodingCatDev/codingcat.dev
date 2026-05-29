import { defineCliConfig } from "sanity/cli";

/** Minimal CLI config for Sanity typegen in the Next.js app (Studio lives in apps/sanity). */
export default defineCliConfig({
	api: {
		projectId: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
		dataset: process.env.SANITY_STUDIO_DATASET || "production",
	},
	// Replaces the deprecated sanity-typegen.json. The schema is extracted in
	// apps/sanity (sanity schema extract --> ../sanity/extract.json).
	typegen: {
		path: "./**/*.{ts,tsx,js,jsx}",
		schema: "../sanity/extract.json",
		generates: "./sanity/types.ts",
	},
});
