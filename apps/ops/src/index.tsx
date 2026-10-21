import { type SanityConfig } from "@sanity/sdk";
import { SanityApp } from "@sanity/sdk-react";
import { StudioTheme, ThemeProvider } from "@sanity/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const config: SanityConfig[] = [
	{
		projectId: "hfh83o0w",
		dataset: "production",
	},
];

const rootEl = document.getElementById("root");
if (rootEl) {
	createRoot(rootEl).render(
		<StrictMode>
			<ThemeProvider theme={StudioTheme}>
				<SanityApp config={config} fallback={<div>Loading CodingCat.dev Ops...</div>}>
					<App />
				</SanityApp>
			</ThemeProvider>
		</StrictMode>,
	);
}
