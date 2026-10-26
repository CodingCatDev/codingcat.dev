import { defineType } from "sanity";
import type { IconType } from "react-icons";
import {
	FaBluesky,
	FaGithub,
	FaInstagram,
	FaLinkedin,
	FaMastodon,
	FaReddit,
	FaShareNodes,
	FaThreads,
	FaTiktok,
} from "react-icons/fa6";

const socialFields = [
	{
		name: "platform",
		type: "string",
		title: "Platform",
		description: "Optional: auto-detected from URL when left blank.",
		options: {
			list: [
				{ title: "Auto-detect from URL", value: "auto" },
				{ title: "X (Twitter)", value: "x" },
				{ title: "Bluesky", value: "bluesky" },
				{ title: "LinkedIn", value: "linkedin" },
				{ title: "Reddit", value: "reddit" },
				{ title: "TikTok", value: "tiktok" },
				{ title: "Instagram", value: "instagram" },
				{ title: "Threads", value: "threads" },
				{ title: "Mastodon", value: "mastodon" },
				{ title: "GitHub Gist", value: "gist" },
				{ title: "YouTube", value: "youtube" },
			],
		},
	},
	{
		name: "url",
		type: "url",
		title: "Post URL",
		validation: (rule: { required: () => unknown }) => rule.required(),
	},
	{
		name: "author",
		type: "string",
		title: "Author Name (Optional)",
	},
	{
		name: "handle",
		type: "string",
		title: "Author Handle (Optional)",
	},
	{
		name: "fallbackText",
		type: "text",
		title: "Post Text / Fallback Excerpt (Optional)",
		rows: 3,
	},
	{
		name: "caption",
		type: "string",
		title: "Caption (Optional)",
	},
];

function createPlatformEmbedSchema(
	name: string,
	title: string,
	defaultPlatform: string,
	icon: IconType,
) {
	return defineType({
		name,
		type: "object",
		title,
		icon,
		fields: socialFields,
		initialValue: {
			platform: defaultPlatform,
		},
		preview: {
			select: {
				title: "author",
				subtitle: "url",
			},
			prepare({ title: authorName, subtitle }) {
				return {
					title: authorName ? `${title}: ${authorName}` : title,
					subtitle: subtitle || "",
				};
			},
		},
	});
}

export const socialEmbed = createPlatformEmbedSchema(
	"socialEmbed",
	"Social Media Embed",
	"auto",
	FaShareNodes,
);
export const blueskyEmbed = createPlatformEmbedSchema(
	"bluesky",
	"Bluesky Embed",
	"bluesky",
	FaBluesky,
);
export const linkedinEmbed = createPlatformEmbedSchema(
	"linkedin",
	"LinkedIn Embed",
	"linkedin",
	FaLinkedin,
);
export const redditEmbed = createPlatformEmbedSchema(
	"reddit",
	"Reddit Embed",
	"reddit",
	FaReddit,
);
export const tiktokEmbed = createPlatformEmbedSchema(
	"tiktok",
	"TikTok Embed",
	"tiktok",
	FaTiktok,
);
export const instagramEmbed = createPlatformEmbedSchema(
	"instagram",
	"Instagram Embed",
	"instagram",
	FaInstagram,
);
export const threadsEmbed = createPlatformEmbedSchema(
	"threads",
	"Threads Embed",
	"threads",
	FaThreads,
);
export const mastodonEmbed = createPlatformEmbedSchema(
	"mastodon",
	"Mastodon Embed",
	"mastodon",
	FaMastodon,
);
export const githubGistEmbed = createPlatformEmbedSchema(
	"githubGist",
	"GitHub Gist Embed",
	"gist",
	FaGithub,
);

export default socialEmbed;
