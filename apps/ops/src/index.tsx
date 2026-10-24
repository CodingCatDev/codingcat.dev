import { type SanityConfig } from "@sanity/sdk";
import { SanityApp } from "@sanity/sdk-react";
import { studioTheme, ThemeProvider } from "@sanity/ui";
import { StrictMode } from "react";
import { App } from "./App";

const projectId = process.env.SANITY_APP_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_APP_DATASET || "production";

const config: SanityConfig[] = [
	{
		projectId,
		dataset,
	},
];

export default function RootApp() {
	return (
		<StrictMode>
			<ThemeProvider theme={studioTheme}>
				<SanityApp
					config={config}
					fallback={
						<div>
							Loading CodingCat.dev Ops ({dataset === "dev" ? "Dev" : "Production"})...
						</div>
					}
				>
					<App />
				</SanityApp>
			</ThemeProvider>
		</StrictMode>
	);
}


