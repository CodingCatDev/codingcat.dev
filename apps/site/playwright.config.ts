import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT || 4329);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 45_000,
	expect: {
		timeout: 10_000,
	},
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: [["list"]],
	use: {
		baseURL: BASE_URL,
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "mobile-portrait",
			use: {
				...devices["iPhone 14"],
				browserName: "chromium",
				viewport: { width: 390, height: 844 },
				isMobile: true,
				hasTouch: true,
			},
		},
		{
			name: "mobile-landscape",
			use: {
				...devices["iPhone 14 landscape"],
				browserName: "chromium",
				viewport: { width: 844, height: 390 },
				isMobile: true,
				hasTouch: true,
			},
		},
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				browserName: "chromium",
				viewport: { width: 1280, height: 800 },
			},
		},
	],
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: `ASTRO_DEV_BACKGROUND=1 pnpm exec astro dev --port ${PORT} --ignore-lock`,
				url: BASE_URL,
				reuseExistingServer: !process.env.CI,
				timeout: 90_000,
			},
});
