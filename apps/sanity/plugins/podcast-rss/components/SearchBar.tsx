import { TextInput } from "@sanity/ui";
import type { ChangeEvent } from "react";

export type SearchBarOnChange = (e: ChangeEvent<HTMLInputElement>) => void;

interface ISearchBar {
	value: string;
	onChange: SearchBarOnChange;
}

const SearchBar = ({ value, onChange }: ISearchBar) => (
	<TextInput
		fontSize={2}
		padding={4}
		value={value}
		placeholder="Episode Search"
		onChange={onChange}
	/>
);

export default SearchBar;
