import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for codingcat.dev E2E tests.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use */
	reporter: process.env.CI ? "github" : "html",
	/* Shared settings for all the projects below */
	use: {
		/* Base URL to use in actions like `await page.goto('/')` */
		baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
		/* Collect trace when retrying the failed test */
		trace: "on-first-retry",
	},
	/* Only chromium for CI speed */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	/* Run your local dev server before starting the tests */
	webServer: process.env.CI
		? undefined
		: {
				command: "pnpm dev",
				url: "http://localhost:3000",
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
});
