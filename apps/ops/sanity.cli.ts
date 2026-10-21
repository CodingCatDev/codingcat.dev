import { defineCliConfig } from "sanity/cli";

const dataset =
	process.env.SANITY_APP_DATASET ||
	process.env.SANITY_STUDIO_DATASET ||
	"production";
const isDev = dataset === "dev";

export default defineCliConfig({
	app: {
		organizationId: process.env.SANITY_ORGANIZATION_ID || "ovF2qiKSO",
		entry: "./src/index.tsx",
		title: isDev
			? "CodingCat Ops & Revenue OS (Dev)"
			: "CodingCat Ops & Revenue OS (Production)",
	},
	deployment: {
		appId:
			process.env.SANITY_OPS_APP_ID ||
			(isDev ? "yiugiba2sjnhpehqmky6nulc" : undefined),
	},
});




