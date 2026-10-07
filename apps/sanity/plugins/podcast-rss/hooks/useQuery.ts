import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { LOADING_TIMER_MS } from "../constants";
import type { Podcast } from "../index";
import type { Episode } from "../types";
import { fetchRssToJson } from "../utils/rss";
import useDebouncedCallback from "./useDebouncedCallback";

interface UseQueryResult {
	query: string;
	loading: boolean;
	error: string | null;
	results: Episode[];
	setQuery: Dispatch<SetStateAction<string>>;
}

export const useQuery = (podcast: Podcast | undefined): UseQueryResult => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<Episode[]>([]);

	const debouncedFetchEpisodes = useDebouncedCallback(async () => {
		if (!query || !podcast) {
			setResults([]);
			setError(null);
			setLoading(false);
			return;
		}
		try {
			const episodes = await fetchRssToJson(podcast);
			const needle = query.toLowerCase();
			setResults(episodes.filter(({ title }) => title.toLowerCase().includes(needle)));
			setError(null);
		} catch (e) {
			// Upstream only console.error'd here, leaving the UI spinning forever.
			setResults([]);
			setError(e instanceof Error ? e.message : "Failed to load RSS feed");
		} finally {
			setLoading(false);
		}
	}, LOADING_TIMER_MS);

	useEffect(() => {
		if (query && podcast) setLoading(true);
		debouncedFetchEpisodes();
	}, [query, podcast]);

	return { query, loading, error, results, setQuery };
};
