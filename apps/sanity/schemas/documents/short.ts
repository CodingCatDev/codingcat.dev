import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

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
			name: "youtube",
			title: "YouTube",
			type: "string",
			description: "YouTube Shorts video ID or URL",
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
