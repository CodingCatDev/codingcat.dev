import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

const SCREENSHOT_DIR = process.env.PLAYWRIGHT_SCREENSHOT_DIR || "";

const CORE_ROUTES = [
	"/",
	"/courses",
	"/course/mcp-in-production",
	"/topics",
	"/topic/sanity",
	"/podcasts",
	"/blog",
];

async function assertNoHorizontalOverflow(page: Page, routeLabel: string) {
	const metrics = await page.evaluate(() => {
		const doc = document.documentElement;
		const innerWidth = window.innerWidth;
		const scrollWidth = doc.scrollWidth;
		const overflowingElements: Array<{
			tag: string;
			id: string;
			cls: string;
			right: number;
		}> = [];

		if (scrollWidth > innerWidth + 1) {
			const all = document.querySelectorAll("main *, header *");
			for (const el of all) {
				const rect = el.getBoundingClientRect();
				if (rect.width > 0 && rect.right > innerWidth + 2) {
					overflowingElements.push({
						tag: el.tagName.toLowerCase(),
						id: el.id,
						cls: (el.className || "").toString().slice(0, 80),
						right: Math.round(rect.right),
					});
					if (overflowingElements.length >= 5) {
						break;
					}
				}
			}
		}

		return {
			innerWidth,
			scrollWidth,
			overflowingElements,
		};
	});

	expect(
		metrics.scrollWidth,
		`Route ${routeLabel} has horizontal overflow (scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}). Offending elements: ${JSON.stringify(metrics.overflowingElements)}`,
	).toBeLessThanOrEqual(metrics.innerWidth + 1);
}

test.describe("Zero Horizontal Overflow & Layout Bounds", () => {
	for (const route of CORE_ROUTES) {
		test(`route ${route} has zero horizontal overflow`, async ({ page }) => {
			await page.goto(route, { waitUntil: "domcontentloaded" });
			await assertNoHorizontalOverflow(page, route);
		});
	}

	test("/topics Tier 2 category cards stay strictly within their parent container", async ({
		page,
	}) => {
		await page.goto("/topics", { waitUntil: "domcontentloaded" });
		await assertNoHorizontalOverflow(page, "/topics");

		const cardOverflow = await page.evaluate(() => {
			const group = document.querySelector("[data-topic-category-group]");
			if (!group) {
				return { found: false, overflows: [] };
			}
			const groupRect = group.getBoundingClientRect();
			const cards = Array.from(group.querySelectorAll("[data-topic-card]"));
			const overflows: Array<{
				text: string;
				cardRight: number;
				groupRight: number;
			}> = [];

			for (const card of cards) {
				const rect = card.getBoundingClientRect();
				if (
					rect.right > groupRect.right + 1 ||
					rect.left < groupRect.left - 1
				) {
					overflows.push({
						text: (card.textContent || "").trim().slice(0, 40),
						cardRight: Math.round(rect.right),
						groupRight: Math.round(groupRect.right),
					});
				}
			}
			return { found: true, overflows, cardCount: cards.length };
		});

		expect(cardOverflow.found).toBe(true);
		expect(cardOverflow.cardCount).toBeGreaterThan(0);
		expect(
			cardOverflow.overflows,
			`Tier 2 topic cards overflowed parent section: ${JSON.stringify(cardOverflow.overflows)}`,
		).toEqual([]);

		if (SCREENSHOT_DIR && test.info().project.name === "mobile-portrait") {
			const groupEl = page.locator("[data-topic-category-group]").first();
			await groupEl.evaluate((el) => {
				const y = el.getBoundingClientRect().top + window.scrollY - 88;
				window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
			});
			await page.screenshot({
				path: path.join(SCREENSHOT_DIR, "topics-mobile-portrait-fixed.png"),
			});
		}
	});
});

test.describe("Mobile Navigation Drawer & Soft-Navigation Flows", () => {
	test("mobile menu button opens reliably before and after soft navigation across pages", async ({
		page,
	}, testInfo) => {
		test.skip(
			testInfo.project.name === "desktop",
			"Mobile navigation drawer toggle is hidden on desktop (lg+)",
		);

		await page.goto("/", { waitUntil: "domcontentloaded" });

		const toggleBtn = page.locator("#nav-drawer-toggle");
		const drawer = page.locator("#nav-drawer");

		await expect(toggleBtn).toBeVisible();
		await toggleBtn.click();
		await expect(drawer).toBeVisible();
		await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

		// Navigate to /courses via the mobile drawer
		await drawer.locator('a[href="/courses"]').click();
		await expect(page).toHaveURL(/\/courses$/);
		await expect(drawer).toBeHidden();

		// Regression check: clicking menu button AFTER soft navigation must still open #nav-drawer!
		await toggleBtn.click();
		await expect(drawer).toBeVisible();
		await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

		if (SCREENSHOT_DIR && testInfo.project.name === "mobile-portrait") {
			await page.screenshot({
				path: path.join(SCREENSHOT_DIR, "nav-drawer-mobile-after-nav.png"),
			});
		}

		// Navigate to /topics via the mobile drawer
		await drawer.locator('a[href="/topics"]').click();
		await expect(page).toHaveURL(/\/topics$/);
		await expect(drawer).toBeHidden();

		// Third check: clicking menu button on /topics must still open #nav-drawer and close via close button
		await toggleBtn.click();
		await expect(drawer).toBeVisible();
		await page.locator("#nav-drawer-close").click();
		await expect(drawer).toBeHidden();
	});

	test("search modal and Ask Agent drawer open and close cleanly", async ({
		page,
	}) => {
		await page.goto("/courses", { waitUntil: "domcontentloaded" });

		// 1. Open & close Search Modal
		await page.locator("#search-header-trigger").click();
		const searchModal = page.locator("#search-modal");
		await expect(searchModal).toBeVisible();
		await page.locator("#search-modal-close").click();
		await expect(searchModal).toBeHidden();

		// 2. Open & close Ask Agent Drawer
		await page.locator("#ask-agent-header-trigger").click();
		const agentDrawer = page.locator("#aj-agent-drawer");
		await expect(agentDrawer).toBeVisible();
		await page.locator("#aj-drawer-close-btn").click();
		await expect(agentDrawer).toBeHidden();
	});
});

test.describe("Courses & Course Detail UX Contracts", () => {
	test("/courses renders clean track sections without floating number circles or sticky notes and filters interactively", async ({
		page,
	}) => {
		await page.goto("/courses", { waitUntil: "domcontentloaded" });

		// Ensure legacy clutter elements are gone
		await expect(page.locator("[data-course-number-circle]")).toHaveCount(0);
		await expect(page.locator("[data-course-sticky-note]")).toHaveCount(0);

		// Ensure track sections and course cards render
		const flagshipSection = page.locator(
			'[data-course-track-section="flagship"]',
		);
		const odinSection = page.locator('[data-course-track-section="odin"]');
		await expect(flagshipSection).toBeVisible();
		await expect(odinSection).toBeVisible();

		if (SCREENSHOT_DIR) {
			await flagshipSection.evaluate((el) => {
				const y = el.getBoundingClientRect().top + window.scrollY - 88;
				window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
			});
			await page.screenshot({
				path: path.join(
					SCREENSHOT_DIR,
					`courses-${test.info().project.name}.png`,
				),
			});
		}

		// Filter to "The Odin Project" track tab
		await page.locator('[data-course-track-tab="odin"]').click();
		await expect(flagshipSection).toBeHidden();
		await expect(odinSection).toBeVisible();

		// Reset back to All Tracks
		await page.locator("[data-courses-clear-filters]").click();
		await expect(flagshipSection).toBeVisible();
		await expect(odinSection).toBeVisible();
	});

	test("/course/[slug] renders Course Lessons above Course Overview on all viewports", async ({
		page,
	}) => {
		await page.goto("/course/mcp-in-production", {
			waitUntil: "domcontentloaded",
		});

		const lessonsSection = page.locator("#course-lessons-section");
		const overviewSection = page.locator("#course-overview-section");

		await expect(lessonsSection).toBeVisible();
		await expect(overviewSection).toBeVisible();

		const lessonsBox = await lessonsSection.boundingBox();
		const overviewBox = await overviewSection.boundingBox();

		expect(lessonsBox).not.toBeNull();
		expect(overviewBox).not.toBeNull();
		if (lessonsBox && overviewBox) {
			expect(
				lessonsBox.y,
				`Expected Course Lessons (y=${lessonsBox.y}) to appear above Course Overview (y=${overviewBox.y})`,
			).toBeLessThan(overviewBox.y);
		}

		if (SCREENSHOT_DIR && test.info().project.name === "mobile-portrait") {
			await lessonsSection.evaluate((el) => {
				const y = el.getBoundingClientRect().top + window.scrollY - 88;
				window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
			});
			await page.screenshot({
				path: path.join(
					SCREENSHOT_DIR,
					"course-detail-lessons-first-mobile.png",
				),
			});
		}
	});

	test("/course/[slug]/lesson/[lessonSlug] renders collapsible mobile Course Lessons switcher on mobile viewports", async ({
		page,
	}, testInfo) => {
		await page.goto("/course/mcp-in-production", {
			waitUntil: "domcontentloaded",
		});

		const firstLessonLink = page
			.locator('#course-lessons-section a[href*="/lesson/"]')
			.first();
		const lessonHref =
			(await firstLessonLink.getAttribute("href")) ||
			"/course/mcp-in-production";
		expect(lessonHref).toContain("/lesson/");

		await page.goto(lessonHref, { waitUntil: "domcontentloaded" });
		await assertNoHorizontalOverflow(page, lessonHref);

		const mobileOutline = page.locator("#mobile-lesson-outline");
		if (testInfo.project.name === "desktop") {
			await expect(mobileOutline).toBeHidden();
		} else {
			await expect(mobileOutline).toBeVisible();
			await mobileOutline.locator("summary").click();
			await expect(mobileOutline).toHaveJSProperty("open", true);
		}
	});
});
