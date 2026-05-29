import { FaPodcast } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import contentType from "../partials/content";
import {
	socialPreviewFields,
	socialPreviewGroup,
} from "../partials/socialPreview";
import podcastType from "./podcastType";
import guestType from "./guest";
import authorType from "./author";
import podcastSeriesType from "./podcastSeries";
import shortType from "./short";
import postType from "./post";

export default defineType({
	...contentType,
	name: "podcast",
	title: "Podcast",
	icon: FaPodcast,
	type: "document",
	groups: [
		...(contentType.groups || []),
		socialPreviewGroup,
		{
			name: "podcast",
			title: "Podcast Details",
		},
	],
	fields: [
		...contentType.fields,
		...socialPreviewFields,
		// --- Existing podcast-specific fields ---
		defineField({
			name: "podcastType",
			title: "Podcast Type",
			type: "reference",
			group: "podcast",
			to: [{ type: podcastType.name }],
			validation: (rule) => [rule.required()],
		}),
		defineField({
			name: "season",
			title: "Season",
			type: "number",
			group: "podcast",
			validation: (rule) => [
				rule.required(),
				rule.min(0),
				rule.max(10),
				rule.integer(),
			],
		}),
		defineField({
			name: "episode",
			title: "Episode",
			type: "number",
			group: "podcast",
			validation: (rule) => [
				rule.required(),
				rule.min(0),
				rule.max(100),
				rule.integer(),
			],
		}),
		defineField({
			name: "recordingDate",
			title: "Recording Date",
			type: "datetime",
			group: "podcast",
			validation: (rule) => [rule.required()],
		}),
		defineField({
			name: "guest",
			title: "Guest(s)",
			type: "array",
			group: "podcast",
			of: [
				{
					type: "reference",
					to: [{ type: guestType.name }],
				},
			],
			validation: (rule) => [rule.required()],
		}),
		defineField({
			name: "pick",
			title: "Pick(s)",
			type: "array",
			group: "podcast",
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "user",
							title: "Author or Guest",
							type: "reference",
							to: [{ type: guestType.name }, { type: authorType.name }],
							validation: (rule) => [rule.required()],
						}),
						defineField({
							name: "name",
							title: "Pick Name",
							type: "string",
							validation: (rule) => [rule.required()],
						}),
						defineField({
							name: "site",
							title: "Pick Url",
							type: "url",
						}),
					],
					preview: {
						select: {
							title: "user.title",
							name: "name",
							site: "site",
						},
						prepare({ title, name, site }) {
							const subtitles = [name, ` - ${site}`].filter(Boolean);
							return {
								title,
								subtitle: subtitles.join(" "),
							};
						},
					},
				},
			],
		}),
		defineField({
			name: "spotify",
			title: "Spotify",
			type: "podcastRssEpisode",
			// validation: (rule) => [rule.required()],
		}),
		// --- New fields ---
		defineField({
			name: "thumbnail",
			title: "Thumbnail",
			type: "image",
			options: {
				hotspot: true,
			},
			group: "podcast",
			description:
				"YouTube-optimized thumbnail (1280×720). Falls back to coverImage.",
		}),
		defineField({
			name: "duration",
			title: "Duration",
			type: "number",
			group: "podcast",
			description: "Episode duration in seconds",
		}),
		defineField({
			name: "chapters",
			title: "Chapters",
			type: "array",
			group: "podcast",
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "title",
							title: "Title",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "timestamp",
							title: "Timestamp",
							type: "string",
							validation: (rule) => rule.required(),
							description: "Display format e.g. 02:34",
						}),
						defineField({
							name: "seconds",
							title: "Seconds",
							type: "number",
							validation: (rule) => rule.required(),
							description: "Timestamp in seconds for seeking",
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
			name: "series",
			title: "Series",
			type: "reference",
			to: [{ type: podcastSeriesType.name }],
			group: "podcast",
		}),
		defineField({
			name: "seriesOrder",
			title: "Series Order",
			type: "number",
			group: "podcast",
			description: "Position within the series",
		}),
		defineField({
			name: "listenLinks",
			title: "Listen Links",
			type: "object",
			group: "podcast",
			description: "Multi-platform listen links",
			fields: [
				defineField({
					name: "youtube",
					title: "YouTube",
					type: "string",
				}),
				defineField({
					name: "spotify",
					title: "Spotify",
					type: "string",
				}),
				defineField({
					name: "apple",
					title: "Apple Podcasts",
					type: "string",
				}),
				defineField({
					name: "overcast",
					title: "Overcast",
					type: "string",
				}),
				defineField({
					name: "pocketCasts",
					title: "Pocket Casts",
					type: "string",
				}),
				defineField({
					name: "rss",
					title: "RSS",
					type: "string",
				}),
			],
		}),
		defineField({
			name: "transcript",
			title: "Transcript",
			type: "text",
			group: "podcast",
			description: "Full episode transcript",
		}),
		defineField({
			name: "contentType",
			title: "Content Type",
			type: "string",
			group: "podcast",
			description: "Episode format",
			options: {
				list: ["interview", "solo", "tutorial", "news", "review"],
			},
		}),
		defineField({
			name: "relatedShorts",
			title: "Related Shorts",
			type: "array",
			group: "podcast",
			of: [
				{
					type: "reference",
					to: [{ type: shortType.name }],
				},
			],
		}),
		defineField({
			name: "relatedBlogPost",
			title: "Related Blog Post",
			type: "reference",
			group: "podcast",
			to: [{ type: postType.name }],
		}),
	],
	orderings: [
		{
			title: "Season Episode New",
			name: "seasonDesc",
			by: [
				{ field: "season", direction: "desc" },
				{ field: "episode", direction: "desc" },
			],
		},
		{
			title: "Season Episode Old",
			name: "seasonAsc",
			by: [
				{ field: "season", direction: "asc" },
				{ field: "episode", direction: "asc" },
			],
		},
	],
	preview: {
		...contentType.preview,
		select: {
			...contentType.preview?.select,
			episode: "episode",
			season: "season",
		},
		prepare({ title, _createdAt, _updatedAt, episode, season }) {
			const subtitles = [
				_createdAt && `on ${format(parseISO(_createdAt), "LLL d, yyyy")}`,
				_updatedAt && `updated ${format(parseISO(_updatedAt), "LLL d, yyyy")}`,
			].filter(Boolean);

			return {
				title: `${season}.${episode} - ${title}`,
				subtitle: subtitles.join(" "),
			};
		},
	},
});
