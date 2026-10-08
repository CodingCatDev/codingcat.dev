import { defineField, defineType } from "sanity";
import { HiOutlineDocumentText } from "react-icons/hi";

export default defineType({
	name: "transcript",
	title: "Transcript & Video Intelligence",
	type: "document",
	icon: HiOutlineDocumentText,
	groups: [
		{ name: "transcript", title: "Transcript & Cues", default: true },
		{ name: "video", title: "Video Metadata" },
		{ name: "stats", title: "Statistics" },
	],
	fields: [
		defineField({
			name: "title",
			title: "Video Title",
			type: "string",
			group: "video",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "youtubeId",
			title: "YouTube Video ID",
			type: "string",
			group: "video",
			description: "11-character YouTube video ID",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "youtubeUrl",
			title: "YouTube URL",
			type: "url",
			group: "video",
		}),
		defineField({
			name: "contentRef",
			title: "Source Document",
			type: "reference",
			to: [
				{ type: "post" },
				{ type: "podcast" },
				{ type: "page" },
				{ type: "lesson" },
				{ type: "course" },
			],
			group: "video",
			description: "The source content document referencing this transcript",
		}),
		defineField({
			name: "channelTitle",
			title: "Channel Title",
			type: "string",
			group: "video",
		}),
		defineField({
			name: "channelId",
			title: "Channel ID",
			type: "string",
			group: "video",
		}),
		defineField({
			name: "publishedAt",
			title: "Video Published At",
			type: "datetime",
			group: "video",
		}),
		defineField({
			name: "duration",
			title: "Duration (ISO 8601)",
			type: "string",
			group: "video",
			description: "ISO 8601 duration e.g. PT15M33S",
		}),
		defineField({
			name: "durationSeconds",
			title: "Duration (Seconds)",
			type: "number",
			group: "video",
		}),
		defineField({
			name: "description",
			title: "Video Description",
			type: "text",
			rows: 6,
			group: "video",
		}),
		defineField({
			name: "tags",
			title: "Video Tags",
			type: "array",
			of: [{ type: "string" }],
			options: { layout: "tags" },
			group: "video",
		}),
		defineField({
			name: "topicCategories",
			title: "Topic Entities (Wikipedia)",
			type: "array",
			of: [{ type: "url" }],
			group: "video",
		}),
		defineField({
			name: "status",
			title: "Transcript Status",
			type: "string",
			options: {
				list: [
					{ title: "Completed", value: "completed" },
					{ title: "No Captions Available", value: "no_caption_available" },
					{ title: "Error", value: "error" },
				],
			},
			group: "transcript",
			initialValue: "completed",
		}),
		defineField({
			name: "fullText",
			title: "Full Transcript Text",
			type: "text",
			rows: 14,
			group: "transcript",
			description:
				"Continuous plain-text transcript indexed for search and retrieval.",
		}),
		defineField({
			name: "summary",
			title: "Transcript Summary & Key Concepts",
			type: "text",
			rows: 5,
			group: "transcript",
			description:
				"High-density topical summary for semantic similarity search and knowledgebase indexing.",
		}),
		defineField({
			name: "chapters",
			title: "Chapters & Timestamps",
			type: "array",
			group: "transcript",
			of: [
				{
					type: "object",
					name: "chapter",
					fields: [
						defineField({ name: "title", title: "Title", type: "string" }),
						defineField({
							name: "start",
							title: "Start (Seconds)",
							type: "number",
						}),
						defineField({
							name: "timestamp",
							title: "Display Timestamp",
							type: "string",
						}),
					],
					preview: {
						select: {
							title: "title",
							subtitle: "timestamp",
						},
					},
				},
			],
		}),
		defineField({
			name: "cues",
			title: "Timed Transcript Cues",
			type: "array",
			group: "transcript",
			of: [
				{
					type: "object",
					name: "cue",
					fields: [
						defineField({
							name: "start",
							title: "Start Offset (s)",
							type: "number",
						}),
						defineField({
							name: "duration",
							title: "Duration (s)",
							type: "number",
						}),
						defineField({ name: "text", title: "Spoken Text", type: "string" }),
					],
					preview: {
						select: {
							title: "text",
							subtitle: "start",
						},
						prepare({ title, subtitle }) {
							const mins = Math.floor((subtitle || 0) / 60);
							const secs = Math.floor((subtitle || 0) % 60);
							const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
							return {
								title: title || "(no text)",
								subtitle: timeStr,
							};
						},
					},
				},
			],
		}),
		defineField({
			name: "statistics",
			title: "YouTube Statistics",
			type: "object",
			group: "stats",
			fields: [
				defineField({ name: "viewCount", title: "Views", type: "number" }),
				defineField({ name: "likeCount", title: "Likes", type: "number" }),
				defineField({
					name: "commentCount",
					title: "Comments",
					type: "number",
				}),
				defineField({
					name: "favoriteCount",
					title: "Favorites",
					type: "number",
				}),
			],
		}),
		defineField({
			name: "lastFetchedAt",
			title: "Last Fetched At",
			type: "datetime",
			group: "video",
			readOnly: true,
		}),
	],
	preview: {
		select: {
			title: "title",
			youtubeId: "youtubeId",
			status: "status",
			duration: "duration",
		},
		prepare({ title, youtubeId, status, duration }) {
			return {
				title: title || `YouTube: ${youtubeId}`,
				subtitle: `${status || "completed"} · ${duration || ""}`,
				media: HiOutlineDocumentText,
			};
		},
	},
});
