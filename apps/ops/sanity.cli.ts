import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	app: {
		organizationId: process.env.SANITY_ORGANIZATION_ID || "o1H0wB7xG",
		entry: "./src/index.tsx",
	},
});
