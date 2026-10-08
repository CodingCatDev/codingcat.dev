import {
	defineBlueprint,
	defineDocumentFunction,
	defineScheduledFunction,
	defineStudio,
} from "@sanity/blueprints";

export default defineBlueprint({
	resources: [
		defineStudio({
			name: "studio",
			title: "CodingCatDev Studio",
			project: process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w",
			root: ".",
			slug: process.env.SANITY_STUDIO_HOSTNAME || "codingcat-prod",
			autoUpdates: {
				enabled: true,
			},
		}),
		defineDocumentFunction({
			name: "syndicate-content",
			displayName: "Syndicate Content (Dev.to & Hashnode)",
			event: {
				on: ["create", "update"],
				filter: '_type in ["post", "podcast"] && !(_id in path("drafts.**"))',
			},
			runtime: "nodejs22.x",
			timeout: 30,
		}),
		defineDocumentFunction({
			name: "sync-youtube-transcript",
			displayName: "Sync YouTube Transcripts & Video Intelligence",
			event: {
				on: ["create", "update"],
				filter: 'defined(youtube) && !(_id in path("drafts.**"))',
			},
			runtime: "nodejs22.x",
			timeout: 60,
			env: {
				YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",
			},
		}),
		defineScheduledFunction({
			name: "sync-nightly-dataset",
			displayName: "Nightly Dataset Sync (production -> dev)",
			event: {
				expression: "0 4 * * *",
			},
			runtime: "nodejs22.x",
			timeout: 300,
		}),
	],
});
