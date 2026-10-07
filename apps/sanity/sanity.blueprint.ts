import { defineBlueprint, defineDocumentFunction } from "@sanity/blueprints";

export default defineBlueprint({
	resources: [
		defineDocumentFunction({
			name: "syndicate-content",
			displayName: "Syndicate Content (Dev.to & Hashnode)",
			event: {
				on: ["create", "update"],
				filter: '_type in ["post", "podcast"] && !(_id in path("drafts.**"))',
			},
		}),
	],
});
