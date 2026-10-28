#!/usr/bin/env node
/**
 * Syncs official sponsor social accounts into the target Sanity dataset.
 */

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "dev";
const token =
	process.env.SANITY_API_WRITE_TOKEN ||
	process.env.SANITY_WRITE_TOKEN ||
	process.env.SANITY_AUTH_TOKEN ||
	"";

if (!token) {
	console.log(
		"[sync-sponsor-socials] No SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN provided, skipping.",
	);
	process.exit(0);
}

export const ENRICHED_SPONSORS = [
	{
		id: "T68Tm1I9oo5QeAPCgsFcOS",
		slug: "algolia",
		title: "Algolia",
		socials: {
			twitter: "https://x.com/algolia",
			github: "https://github.com/algolia",
			linkedin: "https://www.linkedin.com/company/algolia/",
			youtube: "https://www.youtube.com/user/Algolia",
			discord: "https://discord.com/invite/ytbZuTQukV",
			bluesky: "https://bsky.app/profile/algolia.bsky.social",
			instagram: "https://www.instagram.com/algolia.search/",
			facebook: "https://www.facebook.com/algolia/",
			devto: "https://dev.to/algolia",
		},
	},
	{
		id: "864088d7-a0b7-4879-8e0e-256964cb9cec",
		slug: "authzed",
		title: "Authzed",
		socials: {
			twitter: "https://x.com/authzed",
			github: "https://github.com/authzed",
			linkedin: "https://www.linkedin.com/company/authzed/",
			youtube: "https://www.youtube.com/@authzed",
			discord: "https://discord.gg/TUd4k5McMX",
			bluesky: "https://bsky.app/profile/authzed.com",
		},
	},
	{
		id: "T68Tm1I9oo5QeAPCgsFcDi",
		slug: "builder-io",
		title: "Builder.io",
		socials: {
			twitter: "https://x.com/builderio",
			github: "https://github.com/BuilderIO",
			linkedin: "https://www.linkedin.com/company/builder-io/",
			youtube: "https://www.youtube.com/@Builderio",
			bluesky: "https://bsky.app/profile/builderio.bsky.social",
			devto: "https://dev.to/builderio",
		},
	},
	{
		id: "T68Tm1I9oo5QeAPCgsFc2y",
		slug: "cloudinary",
		title: "Cloudinary",
		socials: {
			twitter: "https://x.com/cloudinary",
			github: "https://github.com/cloudinary",
			linkedin: "https://www.linkedin.com/company/cloudinary/",
			youtube: "https://www.youtube.com/@Cloudinary",
			discord: "https://discord.com/invite/D8ddQj6KnH",
			bluesky: "https://bsky.app/profile/cloudinary.bsky.social",
			instagram: "https://www.instagram.com/cloudinarylife",
			facebook: "https://www.facebook.com/Cloudinary",
			devto: "https://dev.to/cloudinary",
		},
	},
	{
		id: "T68Tm1I9oo5QeAPCgsFbsE",
		slug: "jamstackconf",
		title: "JamstackConf",
		socials: {
			twitter: "https://x.com/jamstackconf",
			github: "https://github.com/jamstack",
			youtube: "https://www.youtube.com/c/JAMstackConf",
			discord: "https://discord.com/invite/jamstack",
		},
	},
	{
		id: "2f21015f-2ff8-4c39-a07c-6f1856463866",
		slug: "multiplayer",
		title: "Multiplayer",
		socials: {
			twitter: "https://x.com/trymultiplayer",
			github: "https://github.com/multiplayer-app",
			linkedin: "https://www.linkedin.com/company/multiplayer-app/",
			youtube: "https://www.youtube.com/@trymultiplayer",
			bluesky: "https://bsky.app/profile/multiplayer.app",
			threads: "https://www.threads.net/@trymultiplayer",
		},
	},
	{
		id: "T68Tm1I9oo5QeAPCgsFbhU",
		slug: "refine",
		title: "Refine",
		socials: {
			twitter: "https://x.com/refine_dev",
			github: "https://github.com/refinedev/refine",
			linkedin: "https://www.linkedin.com/company/refine-dev",
			youtube: "https://www.youtube.com/@refinedev",
			discord: "https://discord.gg/refine",
			bluesky: "https://bsky.app/profile/refine.dev",
			devto: "https://dev.to/refine",
		},
	},
	{
		id: "T68Tm1I9oo5QeAPCgsFbWk",
		slug: "stickermule",
		title: "Stickermule",
		socials: {
			twitter: "https://x.com/stickermule",
			github: "https://github.com/stickermule",
			linkedin: "https://www.linkedin.com/company/sticker-mule/",
			youtube: "https://www.youtube.com/user/stickermule",
			instagram: "https://www.instagram.com/stickermule/",
			facebook: "https://www.facebook.com/stickermule",
		},
	},
	{
		id: "T68Tm1I9oo5QeAPCgsFbM0",
		slug: "storyblok",
		title: "Storyblok",
		socials: {
			twitter: "https://x.com/storyblok",
			github: "https://github.com/storyblok",
			linkedin: "https://www.linkedin.com/company/storyblok",
			youtube: "https://www.youtube.com/c/Storyblok-com",
			discord: "https://discord.com/invite/storyblok",
			bluesky: "https://bsky.app/profile/storyblok.com",
			twitch: "https://www.twitch.tv/storyblok",
			instagram: "https://www.instagram.com/storybloklife/",
			facebook: "https://www.facebook.com/storyblok/",
			devto: "https://dev.to/storyblok",
		},
	},
];

async function main() {
	const patchMutations = ENRICHED_SPONSORS.map((s) => ({
		patch: {
			id: s.id,
			set: {
				socials: s.socials,
			},
		},
	}));

	const res = await fetch(
		`https://${projectId}.api.sanity.io/v2025-09-30/data/mutate/${dataset}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ mutations: patchMutations }),
		},
	);

	if (!res.ok) {
		const text = await res.text();
		console.error(`[sync-sponsor-socials] Failed (${res.status}): ${text}`);
		process.exit(1);
	}

	console.log(
		`✔ Synced official socials for ${ENRICHED_SPONSORS.length} sponsors in Sanity (${projectId}/${dataset})`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
