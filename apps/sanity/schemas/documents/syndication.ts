import { defineField, defineType } from "sanity";
import { FaShareAlt } from "react-icons/fa";

export default defineType({
	name: "syndication",
	title: "Content Syndication",
	type: "document",
	icon: FaShareAlt,
	fields: [
		defineField({
			name: "target",
			title: "Target Content",
			type: "reference",
			to: [{ type: "post" }, { type: "podcast" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "platform",
			title: "Platform",
			type: "string",
			options: {
				list: [
					{ title: "Dev.to", value: "devto" },
					{ title: "Hashnode", value: "hashnode" },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "status",
			title: "Status",
			type: "string",
			options: {
				list: [
					{ title: "Pending", value: "pending" },
					{ title: "Published", value: "published" },
					{ title: "Simulated Complete", value: "simulated_complete" },
					{ title: "Failed", value: "failed" },
				],
			},
			initialValue: "pending",
		}),
		defineField({
			name: "externalUrl",
			title: "External URL",
			type: "url",
		}),
		defineField({
			name: "externalId",
			title: "External ID",
			type: "string",
		}),
		defineField({
			name: "canonicalUrl",
			title: "Canonical URL",
			type: "url",
		}),
		defineField({
			name: "syndicatedAt",
			title: "Syndicated At",
			type: "datetime",
		}),
		defineField({
			name: "error",
			title: "Error Details",
			type: "text",
		}),
	],
	preview: {
		select: {
			platform: "platform",
			status: "status",
			targetTitle: "target.title",
		},
		prepare({ platform, status, targetTitle }) {
			return {
				title: `${(platform || "Syndication").toUpperCase()}: ${targetTitle || "Unknown Content"}`,
				subtitle: `Status: ${status || "pending"}`,
			};
		},
	},
});
