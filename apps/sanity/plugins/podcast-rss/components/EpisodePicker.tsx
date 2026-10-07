import { Avatar, Button, Card, Flex, Select, Stack, Text } from "@sanity/ui";
// v4 moved Menu/MenuButton/MenuItem off the root entry onto the /menu subpath.
import { Menu, MenuButton, MenuItem } from "@sanity/ui/menu";
import { useCallback, useState } from "react";
import { set, setIfMissing, unset } from "sanity";

import { useQuery } from "../hooks/useQuery";
import type { EpisodePickerParams } from "../schema/podcastRssEpisode";
import type { Episode } from "../types";
import Popup from "./Popup";
import SearchBar, { type SearchBarOnChange } from "./SearchBar";
import SearchResults, {
	type SearchResultsOnSelectCallback,
} from "./SearchResults";

const EpisodePicker = (params: EpisodePickerParams) => {
	const { podcasts = [], schemaType, onChange, value } = params;
	const defaultEpisode = value as Episode | undefined;

	const [selectedPodcast, setSelectedPodcast] = useState(podcasts.at(0));
	const [isPopupOpen, setOpen] = useState(false);
	const { query, loading, error, results, setQuery } = useQuery(selectedPodcast);
	const [selectedEpisode, setSelectedEpisode] = useState<Episode | undefined>(
		defaultEpisode,
	);

	const onClose = useCallback(() => setOpen(false), []);
	const onOpen = useCallback(() => setOpen(true), []);
	const onQueryChange: SearchBarOnChange = (e) => setQuery(e.target.value);

	const unsetEpisode = () => {
		onChange(unset());
		setSelectedEpisode(undefined);
	};

	const setEpisode: SearchResultsOnSelectCallback = (episode: Episode) => {
		if (selectedEpisode && episode.guid.id === selectedEpisode.guid.id) {
			return unsetEpisode();
		}
		onChange([setIfMissing({ _type: schemaType.name }), set(episode)]);
		setOpen(false);
		setSelectedEpisode(episode);
	};

	return (
		<Card>
			<Stack padding={2} gap={[3, 3, 4, 5]}>
				{selectedEpisode && (
					<Card padding={[3, 3, 4]} radius={2} shadow={1}>
						<Flex align="center" justify="space-between" gap={3}>
							<Avatar
								title={selectedEpisode.title}
								src={selectedEpisode.itunes?.image?.href}
								size={2}
							/>
							<Text size={[2, 2, 3]}>
								<a
									href={selectedEpisode.link}
									target="_blank"
									rel="noopener noreferrer"
								>
									{selectedEpisode.title}
								</a>
							</Text>
							<MenuButton
								button={<Button text="..." mode="ghost" />}
								id="podcast-rss-menu-button"
								menu={
									<Menu>
										<MenuItem text="Delete" onClick={unsetEpisode} />
									</Menu>
								}
								popover={{ portal: true, placement: "bottom-start" }}
							/>
						</Flex>
					</Card>
				)}

				<Button onClick={onOpen} mode="ghost" text="Search for Episodes" />

				<Popup onClose={onClose} isOpen={isPopupOpen}>
					<Stack padding={4} gap={[3, 3, 4, 5]}>
						<Select
							fontSize={[2, 2, 3, 4]}
							padding={[3, 3, 4]}
							value={selectedPodcast?.url ?? ""}
							onChange={(e) =>
								setSelectedPodcast(
									podcasts.find(
										(p) => p.url === (e.target as HTMLSelectElement).value,
									),
								)
							}
						>
							{podcasts.map((podcast) => (
								<option key={podcast.url} value={podcast.url}>
									{podcast.title}
								</option>
							))}
						</Select>
						<SearchBar value={query} onChange={onQueryChange} />
						<SearchResults
							onSelect={setEpisode}
							results={results}
							loading={loading}
							error={error}
							selectedEpisode={selectedEpisode}
						/>
					</Stack>
				</Popup>
			</Stack>
		</Card>
	);
};

export default EpisodePicker;
