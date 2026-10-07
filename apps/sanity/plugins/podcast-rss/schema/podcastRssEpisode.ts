import { MdPlayArrow } from "react-icons/md";
import { defineField, defineType, type ObjectInputProps } from "sanity";

import EpisodePicker from "../components/EpisodePicker";
import type { PodcastRssConfig } from "../index";

export type EpisodePickerParams = ObjectInputProps & PodcastRssConfig;

/**
 * Field shapes are kept byte-identical to the published plugin: `podcast`
 * documents already store data in this shape, so renaming or retyping a field
 * here would orphan existing content.
 */
export const podcastRssEpisode = (config: PodcastRssConfig | void | undefined) =>
	defineType({
		name: "podcastRssEpisode",
		title: "Episode",
		type: "object",
		icon: MdPlayArrow,
		components: {
			input: (props) =>
				EpisodePicker({ ...props, ...(config ?? { podcasts: [] }) } as EpisodePickerParams),
		},
		fields: [
			defineField({ name: "title", title: "Title", type: "string" }),
			defineField({ name: "description", title: "Description", type: "string" }),
			defineField({ name: "link", title: "Link to Podcast", type: "url" }),
			defineField({
				type: "object",
				name: "guid",
				fields: [
					defineField({ name: "id", type: "string" }),
					defineField({ name: "isPermaLink", type: "boolean" }),
				],
			}),
			defineField({ name: "pubDate", type: "datetime" }),
			defineField({
				name: "enclosures",
				type: "array",
				title: "Audio/Video File(s)",
				of: [
					defineField({
						type: "object",
						name: "enclosure",
						fields: [
							defineField({ name: "url", type: "url" }),
							defineField({ name: "length", type: "number" }),
							defineField({ name: "type", type: "string" }),
						],
					}),
				],
			}),
			defineField({
				name: "itunes",
				type: "object",
				fields: [
					defineField({ name: "summary", type: "string", title: "Summary" }),
					defineField({ name: "explicit", type: "string", title: "Explicit" }),
					defineField({
						name: "duration",
						type: "string",
						description: "HH:MM:SS",
						title: "Duration",
					}),
					defineField({ name: "season", type: "string", title: "Season" }),
					defineField({ name: "episode", type: "string", title: "Episode" }),
					defineField({
						name: "episodeType",
						type: "string",
						title: "Episode Type",
					}),
					defineField({
						name: "image",
						type: "object",
						fields: [defineField({ name: "href", type: "url" })],
					}),
				],
			}),
		],
	});
