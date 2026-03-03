import { expect, test } from "@playwright/test";

test.describe("Smoke tests", () => {
	test("homepage renders", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/codingcat/i);
		// Ensure the page has meaningful content (not a blank error page)
		await expect(page.locator("body")).not.toBeEmpty();
	});

	test("/blog page renders", async ({ page }) => {
		await page.goto("/blog");
		// The blog page should have rendered content
		await expect(page.locator("body")).not.toBeEmpty();
		// Check for a heading or main content area
		await expect(
			page.locator("main, [role='main'], article, h1").first(),
		).toBeVisible();
	});

	test("Sanity studio route exists", async ({ page }) => {
		const response = await page.goto("/studio");
		// The studio route should return a valid response (not 404)
		expect(response).not.toBeNull();
		expect(response!.status()).toBeLessThan(400);
	});
});
