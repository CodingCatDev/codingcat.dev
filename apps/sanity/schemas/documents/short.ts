import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

import categoryType from "./category";

export default defineType({
	name: "short",
	title: "Short",
	type: "document",
	icon: PlayIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
				isUnique: (value, context) =>
					context.defaultIsUnique(value, context),
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description / Hook",
			type: "text",
			rows: 3,
			description: "Short hook or summary for SEO/AEO and card previews",
		}),
		defineField({
			name: "youtube",
			title: "YouTube",
			type: "string",
			description: "YouTube Shorts video ID or URL",
		}),
		defineField({
			name: "shortVideoUrl",
			title: "Direct MP4 Video URL",
			type: "url",
			description: "Direct Sanity CDN or R2 MP4 URL for native vertical video playback",
		}),
		defineField({
			name: "thumbnail",
			title: "Thumbnail",
			type: "image",
			options: {
				hotspot: true,
			},
			description: "Vertical thumbnail (9:16)",
		}),
		defineField({
			name: "parentEpisode",
			title: "Parent Episode",
			type: "reference",
			to: [{ type: "podcast" }],
			description: "Long-form episode this Short was clipped from",
		}),
		defineField({
			name: "sourceAutomatedVideo",
			title: "Source Automated Video",
			type: "reference",
			to: [{ type: "automatedVideo" }],
			description: "Automated video pipeline run that produced this Short",
		}),
		defineField({
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
		}),
		defineField({
			name: "duration",
			title: "Duration",
			type: "number",
			description: "Duration in seconds",
		}),
		defineField({
			name: "statistics",
			title: "Statistics",
			type: "object",
			fields: [
				defineField({
					name: "youtube",
					title: "YouTube Statistics",
					type: "object",
					fields: [
						defineField({ name: "viewCount", title: "Views", type: "number" }),
						defineField({ name: "likeCount", title: "Likes", type: "number" }),
						defineField({ name: "commentCount", title: "Comments", type: "number" }),
						defineField({ name: "favoriteCount", title: "Favorites", type: "number" }),
					],
				}),
			],
		}),
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: categoryType.name }],
				},
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "publishedAt",
		},
	},
});
