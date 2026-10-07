import { definePlugin } from "sanity";

import { podcastRssEpisode } from "./schema/podcastRssEpisode";

export interface Podcast {
	title: string;
	url: string;
}

export interface PodcastRssConfig {
	podcasts: Podcast[];
}

/**
 * Registers the `podcastRssEpisode` object type used by `podcast.spotify`,
 * with an input that can search a podcast RSS feed and fill the fields in.
 *
 * Vendored from @codingcatdev/sanity-plugin-podcast-rss — see ./README.md.
 */
export const podcastRss = definePlugin<PodcastRssConfig | void>((config) => ({
	name: "sanity-plugin-podcast-rss",
	schema: {
		types: [podcastRssEpisode(config)],
	},
}));
