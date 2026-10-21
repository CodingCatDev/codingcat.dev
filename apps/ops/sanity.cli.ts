import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	app: {
		organizationId: process.env.SANITY_ORGANIZATION_ID || "ovF2qiKSO",
		entry: "./src/index.tsx",
	},
});

