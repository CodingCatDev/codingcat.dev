import {
	defineBlueprint,
	defineDocumentFunction,
	defineScheduledFunction,
} from "@sanity/blueprints";

export default defineBlueprint({
	resources: [
		defineDocumentFunction({
			name: "syndicate-content",
			displayName: "Syndicate Content (Dev.to & Hashnode)",
			project: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
			event: {
				on: ["create", "update"],
				filter: '_type in ["post", "podcast"] && !(_id in path("drafts.**"))',
			},
			src: "./apps/sanity/functions/syndicate-content",
			runtime: "nodejs22.x",
			timeout: 30,
		}),
		defineDocumentFunction({
			name: "sync-youtube-transcript",
			displayName: "Sync YouTube Transcripts & Video Intelligence",
			project: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
			event: {
				on: ["create", "update"],
				filter: 'defined(youtube) && !(_id in path("drafts.**"))',
			},
			src: "./apps/sanity/functions/sync-youtube-transcript",
			runtime: "nodejs22.x",
			timeout: 60,
			env: {
				YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",
			},
		}),
		defineScheduledFunction({
			name: "sync-nightly-dataset",
			displayName: "Nightly Dataset Sync (Production -> Dev)",
			src: "./apps/sanity/functions/sync-nightly-dataset",
			event: {
				expression: "0 4 * * *", // 4:00 AM UTC
			},
			runtime: "nodejs22.x",
			timeout: 300,
			env: {
				SANITY_AUTH_TOKEN: process.env.SANITY_AUTH_TOKEN || "",
				SANITY_STUDIO_PROJECT_ID:
					process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
				SANITY_STUDIO_DATASET:
					process.env.SANITY_STUDIO_DATASET || "production",
			},
		}),
	],
});
