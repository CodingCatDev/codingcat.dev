import { Button, Flex, Spinner, Text } from "@sanity/ui";
import styled from "styled-components";

import type { Episode } from "../types";

const Wrapper = styled.section`
	min-height: 200px;
	width: 100%;
	position: relative;
`;

export type SearchResultsOnSelectCallback = (episode: Episode) => void;

interface ISearchResults {
	results: Episode[];
	onSelect: SearchResultsOnSelectCallback;
	loading: boolean;
	error?: string | null;
	selectedEpisode?: Episode;
}

const overlay = {
	width: "100%",
	height: "100%",
	position: "absolute",
} as const;

const SearchResults = ({
	results,
	loading,
	error,
	onSelect,
	selectedEpisode,
}: ISearchResults) => (
	<Wrapper>
		{loading && (
			<Flex align="center" justify="center" style={overlay}>
				<Spinner size={4} muted />
			</Flex>
		)}
		{!loading && error && (
			<Flex align="center" justify="center" style={overlay}>
				<Text size={2}>{error}</Text>
			</Flex>
		)}
		{!loading && !error && (
			<Flex
				direction="column"
				align="flex-start"
				justify="flex-start"
				style={overlay}
			>
				{results.map((episode) => (
					<Button
						key={episode.guid.id || episode.link || episode.title}
						mode="ghost"
						onClick={() => onSelect(episode)}
						text={episode.title}
						style={{ marginTop: "5px" }}
						selected={
							!!selectedEpisode &&
							selectedEpisode.guid?.id === episode.guid.id
						}
					/>
				))}
			</Flex>
		)}
	</Wrapper>
);

export default SearchResults;
