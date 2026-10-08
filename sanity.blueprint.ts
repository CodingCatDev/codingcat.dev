import {
	defineBlueprint,
	defineDocumentFunction,
} from "@sanity/blueprints";

export default defineBlueprint({
	resources: [
		defineDocumentFunction({
			name: "syndicate-content",
			displayName: "Syndicate Content (Dev.to & Hashnode)",
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
	],
});
