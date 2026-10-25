import { defineField, defineType } from "sanity";
import { FaFire } from "react-icons/fa";

export default defineType({
	name: "trendSignal",
	title: "Trend Radar (Web Dev & AI)",
	type: "document",
	icon: FaFire,
	fields: [
		defineField({
			name: "title",
			title: "Trend Topic / Headline",
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
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "source",
			title: "Primary Signal Source",
			type: "string",
			options: {
				list: [
					{ title: "Google Trends (Tech & AI)", value: "google-trends" },
					{ title: "daily.dev (Trending / Discussed)", value: "dailydev" },
					{ title: "Hacker News (Front Page / Show HN)", value: "hackernews" },
					{ title: "GitHub Trending (Breakout Repos)", value: "github-trending" },
					{ title: "Reddit (r/webdev, r/LocalLLaMA, r/nextjs)", value: "reddit" },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "sourceUrl",
			title: "Source URL",
			type: "url",
		}),
		defineField({
			name: "score",
			title: "Relevance & Velocity Score (0-100)",
			type: "number",
			validation: (rule) => rule.min(0).max(100),
		}),
		defineField({
			name: "status",
			title: "Editorial Status",
			type: "string",
			options: {
				list: [
					{ title: "Discovered (Active Window)", value: "discovered" },
					{ title: "Draft Created in Sanity", value: "drafted" },
					{ title: "Scheduled on Socials", value: "scheduled" },
					{ title: "Published", value: "published" },
					{ title: "Ignored / Skipped", value: "ignored" },
				],
			},
			initialValue: "discovered",
		}),
		defineField({
			name: "tags",
			title: "Matched Topic Tags",
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
			name: "summary",
			title: "Technical Summary & CodingCat.dev Angle",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "rawMetrics",
			title: "Velocity Metrics (Upvotes, Stars, Search Volume, Comments)",
			type: "string",
		}),
		defineField({
			name: "matchedContent",
			title: "Matched CodingCat.dev Posts & Podcasts (YouTube Backlink Targets)",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "post" }, { type: "podcast" }],
				},
			],
		}),
		defineField({
			name: "draftPostId",
			title: "Generated Sanity Draft Document ID",
			type: "string",
		}),
		defineField({
			name: "socialDrafts",
			title: "Generated Social Takes (with CodingCat.dev YouTube Backlinks)",
			type: "object",
			fields: [
				defineField({ name: "x", title: "X / Twitter Post", type: "text", rows: 4 }),
				defineField({ name: "linkedin", title: "LinkedIn Post", type: "text", rows: 6 }),
				defineField({ name: "bluesky", title: "Bluesky Post", type: "text", rows: 4 }),
				defineField({ name: "reddit", title: "r/CodingCatDev Discussion", type: "text", rows: 6 }),
			],
		}),
		defineField({
			name: "discoveredAt",
			title: "Discovered At",
			type: "datetime",
		}),
		defineField({
			name: "expiresAt",
			title: "Auto-Purge At (30-Day Rolling Window)",
			type: "datetime",
			description:
				"Discovered or ignored trend records past this date are automatically purged so Sanity stays clean.",
		}),
	],
	preview: {
		select: {
			title: "title",
			source: "source",
			score: "score",
			status: "status",
		},
		prepare({ title, source, score, status }) {
			return {
				title: `[${score ?? 0}] ${title || "Untitled Trend"}`,
				subtitle: `${(source || "trend").toUpperCase()} • Status: ${status || "discovered"}`,
			};
		},
	},
});
