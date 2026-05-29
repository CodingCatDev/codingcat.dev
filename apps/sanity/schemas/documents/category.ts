import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export default defineType({
	name: "category",
	title: "Category",
	type: "document",
	icon: TagIcon,
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
			name: "color",
			title: "Color",
			type: "string",
			description: "Hex color for category badge (e.g. #7c3aed)",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
