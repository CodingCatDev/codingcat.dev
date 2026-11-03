import { defineField, defineType } from "sanity";

import baseType from "./base";
import authorType from "../documents/author";
import sponsorType from "../documents/sponsor";

import { input } from "../../components/YouTubePreview";

const content = defineType({
	...baseType,
	name: "content",
	type: "object",
	groups: [
		{
			name: "data",
			title: "Data Updates",
		},
	],
	fields: [
		...baseType.fields,
		defineField({
			name: "videoCloudinary",
			title: "Video",
			type: "file",
		}),
		defineField({
			name: "youtube",
			title: "YouTube",
			type: "string",
			components: {
				input,
			},
		}),
		defineField({
			name: "transcript",
			title: "Transcript & Video Intelligence",
			type: "reference",
			to: [{ type: "transcript" }],
			group: "data",
			description:
				"Automated YouTube transcript, metadata, and video intelligence",
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: authorType.name }],
				},
			],
			initialValue: [
				{
					_type: "reference",
					_ref: "RIgC5r4TJ0hCGOzxHszD1w",
				},
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "sponsor",
			title: "Sponsor",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: sponsorType.name }],
				},
			],
		}),
		defineField({
			name: "devto",
			title: "Dev.to",
			type: "url",
			group: "data",
		}),
		defineField({
			name: "hashnode",
			title: "Hashnode",
			type: "string",
			group: "data",
		}),
		defineField({
			name: "awsbuilder",
			title: "AWS Builder Center",
			type: "url",
			group: "data",
		}),
		defineField({
			name: "dailydev",
			title: "daily.dev Squad",
			type: "url",
			group: "data",
		}),
		defineField({
			name: "medium",
			title: "Medium",
			type: "url",
			group: "data",
		}),
		defineField({
			name: "reddit",
			title: "Reddit (r/CodingCatDev)",
			type: "url",
			group: "data",
		}),
		defineField({
			name: "tags",
			title: "Tags",
			description:
				"Topic, programming language, and company tags used for filtering and platform syndication (e.g., AWS Builder Center requires the AWS tag).",
			type: "array",
			of: [
				{
					type: "object",
					name: "tag",
					fields: [
						defineField({ name: "label", title: "Label", type: "string" }),
						defineField({ name: "value", title: "Value", type: "string" }),
					],
				},
			],
		}),
		defineField({
			name: "relatedVideo",
			title: "Related Video Deep Dive",
			description:
				"Optional explicit video shown in the 'Watch the Related Video Deep Dive' card when this document does not have its own primary YouTube video. Reference an existing Sanity document (Post, Podcast, Course, or Lesson) OR provide a custom YouTube URL, title, and description. If left blank, the site dynamically matches the best published video by tags and topics.",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "reference",
					title: "Referenced Sanity Document (Post, Podcast, Course, or Lesson)",
					type: "reference",
					to: [
						{ type: "post" },
						{ type: "podcast" },
						{ type: "course" },
						{ type: "lesson" },
					],
				}),
				defineField({
					name: "youtube",
					title: "Custom YouTube URL Override",
					description:
						"Optional YouTube URL (used if no Sanity document is referenced, or to override the referenced document's YouTube link).",
					type: "string",
				}),
				defineField({
					name: "title",
					title: "Custom Video Title Override",
					type: "string",
				}),
				defineField({
					name: "description",
					title: "Custom Video Description Override",
					type: "text",
					rows: 2,
				}),
			],
		}),
		defineField({
			name: "relatedContent",
			title: "Curated Related Content (Posts, Podcasts & Courses)",
			description:
				"Optional curated related content items displayed at the bottom of the page. Any remaining slots are automatically filled using dynamic tag and topic matching.",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "post" }, { type: "podcast" }, { type: "course" }],
				},
			],
		}),
		defineField({
			name: "syndications",
			title: "Syndications",
			type: "array",
			group: "data",
			of: [{ type: "reference", to: [{ type: "syndication" }] }],
			description: "Associated cross-platform syndication records (Dev.to, Hashnode, AWS Builder Center, etc.)",
			readOnly: true,
		}),
		defineField({
			name: "statistics",
			type: "object",
			group: "data",
			fields: [
				defineField({
					name: "youtube",
					type: "object",
					fields: [
						defineField({
							name: "commentCount",
							type: "number",
						}),
						defineField({
							name: "favoriteCount",
							type: "number",
						}),
						defineField({
							name: "likeCount",
							type: "number",
						}),
						defineField({
							name: "viewCount",
							type: "number",
						}),
					],
				}),
			],
		}),
		// Legacy fields retained as hidden/readOnly so existing production documents
		// do not trigger "Unknown fields found" warnings in Sanity Studio.
		defineField({
			name: "views",
			type: "number",
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "ogTitle",
			type: "string",
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "ogDescription",
			type: "text",
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "twitterCardType",
			type: "string",
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: "noIndex",
			type: "boolean",
			hidden: true,
			readOnly: true,
		}),
	],
});

export default content;
