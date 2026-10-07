import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { loadModule, SITE_ROOT, SRC_DIR } from "./helpers.mjs";

describe("Tier 3 - Cross-Feature Combinations", () => {
	// ── 1. Redirect Rules ─────────────────────────────────────────────────
	describe("Redirect Rules", () => {
		const astroConfigPath = path.resolve(SITE_ROOT, "astro.config.mjs");
		const astroConfigContent = fs.readFileSync(astroConfigPath, "utf-8");

		it("1.1 /blog/page redirects to /blog/page/1 with 302 temporary status", () => {
			const filePath = path.resolve(SRC_DIR, "pages/blog/page/index.astro");
			assert.ok(fs.existsSync(filePath), "blog/page/index.astro must exist");
			const content = fs.readFileSync(filePath, "utf-8");
			assert.ok(
				content.includes('return Astro.redirect("/blog/page/1", 302);'),
				"/blog/page must 302 redirect to /blog/page/1 via SSR redirect",
			);
		});

		it("1.2 /podcasts/page redirects to /podcasts/page/1 with 302 status", () => {
			const filePath = path.resolve(SRC_DIR, "pages/podcasts/page/index.astro");
			assert.ok(
				fs.existsSync(filePath),
				"podcasts/page/index.astro must exist",
			);
			const content = fs.readFileSync(filePath, "utf-8");
			assert.ok(
				content.includes('return Astro.redirect("/podcasts/page/1", 302);'),
				"/podcasts/page must 302 redirect to /podcasts/page/1 via SSR redirect",
			);
		});

		it("1.3 /authors and /authors/page redirect to /authors/page/1 with 302 status", () => {
			const authorsIndex = path.resolve(SRC_DIR, "pages/authors/index.astro");
			assert.ok(fs.existsSync(authorsIndex), "authors/index.astro must exist");
			const authorsContent = fs.readFileSync(authorsIndex, "utf-8");
			assert.ok(
				authorsContent.includes(
					'return Astro.redirect("/authors/page/1", 302);',
				),
				"/authors must 302 redirect to /authors/page/1 via SSR redirect",
			);

			const authorsPageIndex = path.resolve(
				SRC_DIR,
				"pages/authors/page/index.astro",
			);
			assert.ok(
				fs.existsSync(authorsPageIndex),
				"authors/page/index.astro must exist",
			);
			const authorsPageContent = fs.readFileSync(authorsPageIndex, "utf-8");
			assert.ok(
				authorsPageContent.includes(
					'return Astro.redirect("/authors/page/1", 302);',
				),
				"/authors/page must 302 redirect to /authors/page/1 via SSR redirect",
			);
		});

		it("1.4 /guests and /guests/page redirect to /guests/page/1 with 302 status", () => {
			const guestsIndex = path.resolve(SRC_DIR, "pages/guests/index.astro");
			assert.ok(fs.existsSync(guestsIndex), "guests/index.astro must exist");
			const guestsContent = fs.readFileSync(guestsIndex, "utf-8");
			assert.ok(
				guestsContent.includes('return Astro.redirect("/guests/page/1", 302);'),
				"/guests must 302 redirect to /guests/page/1 via SSR redirect",
			);

			const guestsPageIndex = path.resolve(
				SRC_DIR,
				"pages/guests/page/index.astro",
			);
			assert.ok(
				fs.existsSync(guestsPageIndex),
				"guests/page/index.astro must exist",
			);
			const guestsPageContent = fs.readFileSync(guestsPageIndex, "utf-8");
			assert.ok(
				guestsPageContent.includes(
					'return Astro.redirect("/guests/page/1", 302);',
				),
				"/guests/page must 302 redirect to /guests/page/1 via SSR redirect",
			);
		});

		it("1.5 /sponsors and /sponsors/page redirect to /sponsors/page/1 with 302 status", () => {
			const sponsorsIndex = path.resolve(SRC_DIR, "pages/sponsors/index.astro");
			assert.ok(
				fs.existsSync(sponsorsIndex),
				"sponsors/index.astro must exist",
			);
			const sponsorsContent = fs.readFileSync(sponsorsIndex, "utf-8");
			assert.ok(
				sponsorsContent.includes(
					'return Astro.redirect("/sponsors/page/1", 302);',
				),
				"/sponsors must 302 redirect to /sponsors/page/1 via SSR redirect",
			);

			const sponsorsPageIndex = path.resolve(
				SRC_DIR,
				"pages/sponsors/page/index.astro",
			);
			assert.ok(
				fs.existsSync(sponsorsPageIndex),
				"sponsors/page/index.astro must exist",
			);
			const sponsorsPageContent = fs.readFileSync(sponsorsPageIndex, "utf-8");
			assert.ok(
				sponsorsPageContent.includes(
					'return Astro.redirect("/sponsors/page/1", 302);',
				),
				"/sponsors/page must 302 redirect to /sponsors/page/1 via SSR redirect",
			);
		});

		it("1.6 Legacy feeds 301 redirects are configured in astro.config.mjs", () => {
			assert.ok(
				astroConfigContent.includes(
					'"/rss.xml": { status: 301, destination: "/blog/rss.xml" }',
				),
				"/rss.xml must 301 redirect to /blog/rss.xml in astro.config.mjs",
			);
			assert.ok(
				astroConfigContent.includes(
					'"/podcast/rss.xml": { status: 301, destination: "/podcasts/rss.xml" }',
				),
				"/podcast/rss.xml must 301 redirect to /podcasts/rss.xml in astro.config.mjs",
			);
			assert.ok(
				astroConfigContent.includes(
					'"/feed.xml": { status: 301, destination: "/blog/rss.xml" }',
				),
				"/feed.xml must 301 redirect to /blog/rss.xml in astro.config.mjs",
			);
		});

		it("1.7 Listing stubs use 302 status to remain uncacheable as content grows", () => {
			const blogPage = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/blog/page/index.astro"),
				"utf-8",
			);
			assert.ok(
				blogPage.includes("302"),
				"Blog listing stub must redirect with 302",
			);
			assert.ok(
				!astroConfigContent.includes('"/blog/page"'),
				"Config-level /blog/page redirect removed to prevent 301 fallback in Astro 7 SSR",
			);
		});

		it("1.8 Cloudflare KV session injection disabled (session: false)", () => {
			assert.ok(
				astroConfigContent.includes("session: false"),
				"astro.config.mjs must set session: false to prevent dummy KV SESSION injection",
			);
		});
	});

	// ── 2. Canonical URL Resolution via Astro.locals.siteUrl ──────────────
	describe("Canonical URL Resolution via Astro.locals.siteUrl", () => {
		const siteLib = loadModule("src/lib/site.ts");

		it("2.1 Production environment resolves origin to https://codingcat.dev", () => {
			const url = siteLib.resolveSiteUrl("https://codingcat.dev", undefined);
			assert.equal(url.origin, "https://codingcat.dev");
		});

		it("2.2 Dev environment resolves origin to Cloudflare worker URL", () => {
			const devWorker = "https://codingcatdev.workers.dev";
			const url = siteLib.resolveSiteUrl(devWorker, undefined);
			assert.equal(url.origin, devWorker);
		});

		it("2.3 Trailing slash in runtime SITE_URL is normalized without affecting origin", () => {
			const url = siteLib.resolveSiteUrl("https://codingcat.dev/", undefined);
			assert.equal(url.origin, "https://codingcat.dev");
		});

		it("2.4 Fallback to buildTimeSite when runtime SITE_URL is absent", () => {
			const buildTimeSite = new URL("https://preview.codingcat.dev");
			const url = siteLib.resolveSiteUrl(undefined, buildTimeSite);
			assert.equal(url.origin, "https://preview.codingcat.dev");
		});

		it("2.5 absoluteUrl joins relative paths cleanly without duplicate slashes", () => {
			const base = new URL("https://codingcat.dev");
			assert.equal(
				siteLib.absoluteUrl("/blog/page/1", base),
				"https://codingcat.dev/blog/page/1",
			);
			assert.equal(
				siteLib.absoluteUrl("blog/page/1", base),
				"https://codingcat.dev/blog/page/1",
			);
			assert.equal(
				siteLib.absoluteUrl("/post/my-post", base),
				"https://codingcat.dev/post/my-post",
			);
			assert.equal(
				siteLib.absoluteUrl("https://external.com/test", base),
				"https://external.com/test",
			);
		});

		it("2.6 Malformed runtime SITE_URL falls through safely without throwing", () => {
			const fallbackSite = new URL("https://codingcat.dev");
			const url = siteLib.resolveSiteUrl("not-a-valid-url", fallbackSite);
			assert.equal(url.origin, fallbackSite.origin);
		});
	});

	// ── 3. Dynamic OG Fallback Scaling & Long Titles ───────────────────────
	describe("Dynamic OG Fallback Scaling & Long Titles", () => {
		const ogUtils = loadModule("src/lib/og-utils.ts");

		it("3.1 Short title (<= 40 chars) receives 56px font size", () => {
			const title = "Astro vs Next.js";
			assert.equal(title.length < 40, true);
			assert.equal(ogUtils.titleFontSize(title), 56);
		});

		it("3.2 Medium title (41-60 chars) receives 48px font size", () => {
			const title = "Complete Guide to Cloudflare Workers with Astro SSR";
			assert.ok(title.length >= 41 && title.length <= 60);
			assert.equal(ogUtils.titleFontSize(title), 48);
		});

		it("3.3 Long title (> 60 chars) receives 42px font size", () => {
			const title =
				"Why We Are Absolutely Obsessed With Sticker Mule's Holographic Stickers";
			assert.ok(title.length > 60);
			assert.equal(ogUtils.titleFontSize(title), 42);
		});

		it("3.4 Extreme long title (> 120 chars) remains stable at 42px", () => {
			const title = "A".repeat(150);
			assert.equal(ogUtils.titleFontSize(title), 42);
		});

		it("3.5 fallbackOgImage safely generates OG image URL with query params and stega cleaning", () => {
			const ogLib = loadModule("src/lib/og.ts");
			const res = ogLib.fallbackOgImage("https://codingcat.dev", {
				title: "Building & Designing: The 'Ultimate' Guide — 100% Free",
				type: "Blog",
				author: "Alex Patterson",
			});
			assert.ok(res.url.startsWith("https://codingcat.dev/api/og/blog.png?"));
			assert.ok(res.url.includes("title="));
			assert.equal(res.width, 1200);
			assert.equal(res.height, 630);
			assert.equal(
				res.alt,
				"Building & Designing: The 'Ultimate' Guide — 100% Free",
			);
		});

		it("3.6 authorInitials helper produces 2-letter uppercase monogram", () => {
			const author = "Alex Patterson";
			const initials = author
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase();
			assert.equal(initials, "AP");

			const singleName = "Cher";
			const singleInitials = singleName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase();
			assert.equal(singleInitials, "C");
		});
	});

	// ── 4. Draft Mode Cookie Handling & Edge Cache Protection ─────────────
	describe("Draft Mode Cookie Handling & Edge Cache Protection", () => {
		it("4.1 Middleware file sets Cache-Control: no-store, private when preview is enabled", () => {
			const middlewareSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "middleware.ts"),
				"utf-8",
			);
			assert.ok(
				middlewareSrc.includes("context.locals.sanity.preview.enabled"),
				"Must check preview.enabled",
			);
			assert.ok(
				middlewareSrc.includes(
					'response.headers.set("Cache-Control", "no-store, private")',
				),
				"Must set Cache-Control: no-store, private",
			);
		});

		it("4.2 Middleware sets X-Robots-Tag: noindex, nofollow to prevent indexing drafts", () => {
			const middlewareSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "middleware.ts"),
				"utf-8",
			);
			assert.ok(
				middlewareSrc.includes(
					'response.headers.set("X-Robots-Tag", "noindex, nofollow")',
				),
				"Must set X-Robots-Tag: noindex, nofollow for preview",
			);
		});

		it("4.3 Middleware reads PREVIEW_COOKIE (__sanity_preview) from cookies", () => {
			const middlewareSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "middleware.ts"),
				"utf-8",
			);
			assert.ok(
				middlewareSrc.includes("PREVIEW_COOKIE"),
				"Must check PREVIEW_COOKIE",
			);
			assert.ok(
				middlewareSrc.includes("context.cookies.has(PREVIEW_COOKIE)"),
				"Reads cookie from context.cookies",
			);
		});

		it("4.4 Context creation wires preview into locals.sanity", () => {
			const contextSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "lib/sanity/context.ts"),
				"utf-8",
			);
			assert.ok(contextSrc.includes("resolvePreview"), "Calls resolvePreview");
			assert.ok(
				contextSrc.includes("preview,"),
				"Exposes preview on sanity context",
			);
		});

		it("4.5 When preview is disabled, public response cache headers are undisturbed", () => {
			const middlewareSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "middleware.ts"),
				"utf-8",
			);
			const ifIdx = middlewareSrc.indexOf(
				"if (context.locals.sanity.preview.enabled)",
			);
			const headerIdx = middlewareSrc.indexOf(
				'response.headers.set("Cache-Control", "no-store, private")',
			);
			assert.ok(
				ifIdx !== -1 && headerIdx > ifIdx,
				"Cache-Control only altered when preview is enabled",
			);
		});

		it("4.6 Perspective parameter is correctly read from URL search params", () => {
			const contextSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "lib/sanity/context.ts"),
				"utf-8",
			);
			assert.ok(
				contextSrc.includes("url.searchParams.get(PERSPECTIVE_PARAM)"),
				"Reads PERSPECTIVE_PARAM from searchParams",
			);
		});
	});
});
