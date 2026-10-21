import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	app: {
		organizationId: process.env.SANITY_ORGANIZATION_ID || "ovF2qiKSO",
		entry: "./src/index.tsx",
		title: "CodingCat Ops & Revenue OS",
	},
	...(process.env.SANITY_OPS_APP_ID
		? {
				deployment: {
					appId: process.env.SANITY_OPS_APP_ID,
				},
			}
		: {}),
});


