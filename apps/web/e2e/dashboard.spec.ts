import { expect, test } from "@playwright/test";

test.describe("Dashboard auth", () => {
	test("unauthenticated /dashboard redirects to /dashboard/login", async ({
		page,
	}) => {
		await page.goto("/dashboard");
		// Supabase auth proxy should redirect unauthenticated users to login
		await expect(page).toHaveURL(/\/dashboard\/login/);
	});

	test("/dashboard/login renders a login form", async ({ page }) => {
		await page.goto("/dashboard/login");
		await expect(page.locator("body")).not.toBeEmpty();
		// Should have email and password inputs
		await expect(
			page.locator('input[type="email"], input[name="email"]').first(),
		).toBeVisible();
		await expect(
			page.locator('input[type="password"], input[name="password"]').first(),
		).toBeVisible();
	});
});

test.describe("Dashboard pages exist", () => {
	const routes = [
		"/dashboard/content",
		"/dashboard/videos",
		"/dashboard/sponsors",
		"/dashboard/settings",
	];

	for (const route of routes) {
		test(`${route} returns a valid response`, async ({ page }) => {
			const response = await page.goto(route);
			expect(response).not.toBeNull();
			// Should not be a 404 — redirects (302) to login are fine
			expect(response!.status()).not.toBe(404);
		});
	}
});

test.describe("API routes respond", () => {
	test("POST /api/webhooks/sanity-content returns 401 without auth", async ({
		request,
	}) => {
		const response = await request.post("/api/webhooks/sanity-content");
		expect(response.status()).toBe(401);
	});

	test("POST /api/webhooks/sanity-distribute returns 401 without auth", async ({
		request,
	}) => {
		const response = await request.post("/api/webhooks/sanity-distribute");
		expect(response.status()).toBe(401);
	});

	test("POST /api/webhooks/sponsor-inbound returns 401 without auth", async ({
		request,
	}) => {
		const response = await request.post("/api/webhooks/sponsor-inbound");
		expect(response.status()).toBe(401);
	});

	test("GET /api/sponsor/opt-out returns 400 without token", async ({
		request,
	}) => {
		const response = await request.get("/api/sponsor/opt-out");
		expect(response.status()).toBe(400);
	});
});
