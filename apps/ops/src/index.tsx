import { type SanityConfig } from "@sanity/sdk";
import { SanityApp } from "@sanity/sdk-react";
import { studioTheme, ThemeProvider } from "@sanity/ui";
import { StrictMode } from "react";
import { App } from "./App";

const config: SanityConfig[] = [
	{
		projectId: "hfh83o0w",
		dataset: "production",
	},
];

export default function RootApp() {
	return (
		<StrictMode>
			<ThemeProvider theme={studioTheme}>
				<SanityApp config={config} fallback={<div>Loading CodingCat.dev Ops...</div>}>
					<App />
				</SanityApp>
			</ThemeProvider>
		</StrictMode>
	);
}

