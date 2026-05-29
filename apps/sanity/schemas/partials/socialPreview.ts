import { defineField } from "sanity";

export const socialPreviewGroup = {
	name: "socialPreview",
	title: "Social Preview",
};

export const socialPreviewFields = [
	defineField({
		name: "ogTitle",
		title: "Social Title",
		type: "string",
		group: "socialPreview",
		description: "Override title for social sharing (max 60 chars)",
		validation: (rule) => rule.max(60),
	}),
	defineField({
		name: "ogDescription",
		title: "Social Description",
		type: "text",
		group: "socialPreview",
		rows: 3,
		description: "Override description for social sharing (max 155 chars)",
		validation: (rule) => rule.max(155),
	}),
	defineField({
		name: "ogImage",
		title: "Social Image",
		type: "image",
		group: "socialPreview",
		options: {
			hotspot: true,
		},
		description:
			"Custom social preview image (1200×630). Auto-generated if empty.",
	}),
	defineField({
		name: "twitterCardType",
		title: "Twitter Card Type",
		type: "string",
		group: "socialPreview",
		options: {
			list: ["summary_large_image", "summary"],
		},
		initialValue: "summary_large_image",
	}),
	defineField({
		name: "noIndex",
		title: "No Index",
		type: "boolean",
		group: "socialPreview",
		initialValue: false,
		description: "Hide this page from search engines",
	}),
];
