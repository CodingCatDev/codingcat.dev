import { defineField, defineType } from "sanity";
import { FaLayerGroup } from "react-icons/fa";

export default defineType({
	name: "podcastSeries",
	title: "Podcast Series",
	type: "document",
	icon: FaLayerGroup,
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
			title: "Description",
			type: "text",
		}),
		defineField({
			name: "coverImage",
			title: "Cover Image",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "youtubePlaylistId",
			title: "YouTube Playlist ID",
			type: "string",
			description: "YouTube playlist ID for this series",
		}),
		defineField({
			name: "isActive",
			title: "Is Active",
			type: "boolean",
			initialValue: true,
			description: "Is this series still producing new episodes?",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
