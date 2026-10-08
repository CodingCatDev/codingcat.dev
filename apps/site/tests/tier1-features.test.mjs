import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
	createMockSanityContext,
	loadBaseline,
	loadModule,
	SRC_DIR,
} from "./helpers.mjs";

describe("Tier 1 - Feature Coverage", () => {
	// ── 1. Public Content Routes ──────────────────────────────────────────
	describe("Public Content Routes", () => {
		it("1.1 Core page files exist in src/pages/", () => {
			const requiredPages = [
				"index.astro",
				"404.astro",
				"[slug].astro",
				"blog/index.astro",
				"blog/page/[num].astro",
				"post/[slug].astro",
				"podcasts/index.astro",
				"podcasts/page/[num].astro",
				"podcast/[slug].astro",
				"authors/page/[num].astro",
				"author/[slug].astro",
				"guests/page/[num].astro",
				"guest/[slug].astro",
				"sponsors/page/[num].astro",
				"sponsor/[slug].astro",
				"search.astro",
				"sponsorships.astro",
			];

			for (const p of requiredPages) {
				const fullPath = path.resolve(SRC_DIR, "pages", p);
				assert.ok(
					fs.existsSync(fullPath),
					`Required page ${p} should exist on disk`,
				);
			}
		});

		it("1.2 [slug].astro catch-all handles page documents and 404s missing slugs", () => {
			const slugFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/[slug].astro"),
				"utf-8",
			);
			assert.ok(
				slugFile.includes("pageQuery"),
				"[slug].astro must load pageQuery",
			);
			assert.ok(
				slugFile.includes("return new Response(null, { status: 404 });"),
				"[slug].astro must return 404 when document is not found",
			);
			assert.ok(
				slugFile.includes("PortableTextContent"),
				"[slug].astro must render PortableTextContent",
			);
		});

		it("1.3 Pagination routes use resolvePage helper with numeric bounds", () => {
			const blogNumFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/blog/page/[num].astro"),
				"utf-8",
			);
			assert.ok(
				blogNumFile.includes("resolvePage"),
				"Blog pagination must import resolvePage",
			);
			assert.ok(
				blogNumFile.includes("Astro.params.num"),
				"Blog pagination must read num param",
			);

			const podcastsNumFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/podcasts/page/[num].astro"),
				"utf-8",
			);
			assert.ok(
				podcastsNumFile.includes("resolvePage"),
				"Podcasts pagination must import resolvePage",
			);
		});

		it("1.4 Detail routes verify document existence and return 404 on missing entity", () => {
			const postFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/post/[slug].astro"),
				"utf-8",
			);
			assert.ok(
				postFile.includes("return new Response(null, { status: 404 });"),
				"post/[slug].astro must 404 missing posts",
			);

			const podcastFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/podcast/[slug].astro"),
				"utf-8",
			);
			assert.ok(
				podcastFile.includes("return new Response(null, { status: 404 });"),
				"podcast/[slug].astro must 404 missing podcasts",
			);
		});

		it("1.5 404 page exists and renders BaseLayout with title and status", () => {
			const errPage = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/404.astro"),
				"utf-8",
			);
			assert.ok(
				errPage.includes("BaseLayout"),
				"404.astro must render BaseLayout",
			);
			assert.ok(
				errPage.includes("Page not found"),
				"404.astro must declare Page not found",
			);
			assert.ok(
				errPage.includes("Astro.response.status = 404;"),
				"404.astro must set status = 404",
			);
			assert.ok(
				errPage.includes("This page wandered off"),
				"404.astro must render error message",
			);
		});

		it("1.6 Route resolution contract check: /search and /sponsorships exist as dedicated routes", () => {
			const searchPageExists = fs.existsSync(
				path.resolve(SRC_DIR, "pages/search.astro"),
			);
			const sponsorshipsPageExists = fs.existsSync(
				path.resolve(SRC_DIR, "pages/sponsorships.astro"),
			);
			assert.ok(searchPageExists, "search.astro exists");
			assert.ok(sponsorshipsPageExists, "sponsorships.astro exists");

			const sitemapSrc = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/sitemap.xml.ts"),
				"utf-8",
			);
			assert.ok(
				sitemapSrc.includes("/search"),
				"sitemap.xml.ts advertises /search route",
			);
		});

		it("1.7 search.astro and SearchModal render semantic search UI with filters, modal, and breadcrumbs", () => {
			const searchFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/search.astro"),
				"utf-8",
			);
			const modalFile = fs.readFileSync(
				path.resolve(SRC_DIR, "components/SearchModal.astro"),
				"utf-8",
			);
			const apiFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/api/search.ts"),
				"utf-8",
			);
			assert.ok(searchFile.includes("BaseLayout"), "Must use BaseLayout");
			assert.ok(searchFile.includes("Breadcrumbs"), "Must render Breadcrumbs");
			assert.ok(searchFile.includes("search-input"), "Must have search input");
			assert.ok(searchFile.includes("/api/search"), "Must query /api/search");
			assert.ok(
				searchFile.includes('data-type="post"'),
				"Must have post filter",
			);
			assert.ok(
				searchFile.includes('data-type="podcast"'),
				"Must have podcast filter",
			);
			assert.ok(
				searchFile.includes('data-type="author"'),
				"Must have author filter",
			);
			assert.ok(
				searchFile.includes('data-type="guest"'),
				"Must have guest filter",
			);
			assert.ok(
				searchFile.includes("state-ready"),
				"Must have ready empty state",
			);
			assert.ok(
				modalFile.includes("search-modal"),
				"SearchModal must define modal dialog",
			);
			assert.ok(
				apiFile.includes("semanticSearchQuery"),
				"API must utilize semanticSearchQuery",
			);
		});

		it("1.8 sponsorships.astro renders the 5 tiers and inquiry form", () => {
			const sponsorFile = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/sponsorships.astro"),
				"utf-8",
			);
			assert.ok(sponsorFile.includes("BaseLayout"), "Must use BaseLayout");
			assert.ok(sponsorFile.includes("Breadcrumbs"), "Must render Breadcrumbs");
			assert.ok(sponsorFile.includes("Dedicated Video"), "Must render Tier 1");
			assert.ok(
				sponsorFile.includes("Integrated Mid-Roll Ad"),
				"Must render Tier 2",
			);
			assert.ok(sponsorFile.includes("Quick Shout-Out"), "Must render Tier 3");
			assert.ok(
				sponsorFile.includes("Blog Post / Newsletter"),
				"Must render Tier 4",
			);
			assert.ok(sponsorFile.includes("Video Series"), "Must render Tier 5");
			assert.ok(
				sponsorFile.includes("sponsorship-form"),
				"Must include inquiry form",
			);
		});

		it("1.9 /api/sponsorship endpoint validates required fields and handles submissions", async () => {
			const sponsorshipModule = loadModule("src/pages/api/sponsorship.ts");
			assert.equal(typeof sponsorshipModule.POST, "function");

			// Valid JSON submission
			const validRes = await sponsorshipModule.POST({
				request: new Request("https://codingcat.dev/api/sponsorship", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "Jane Dev",
						email: "jane@example.com",
						company: "Tech Corp",
						tier: "Dedicated Video",
						message: "Looking for sponsorship in Q4",
					}),
				}),
			});
			assert.equal(validRes.status, 200);
			const validJson = await validRes.json();
			assert.equal(validJson.success, true);
			assert.equal(validJson.message, "Inquiry received");

			// Valid form-encoded submission
			const formParams = new URLSearchParams({
				name: "John Dev",
				email: "john@example.com",
				tier: "Quick Shout-Out",
			});
			const validFormRes = await sponsorshipModule.POST({
				request: new Request("https://codingcat.dev/api/sponsorship", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: formParams.toString(),
				}),
			});
			assert.equal(validFormRes.status, 200);
			const formJson = await validFormRes.json();
			assert.equal(formJson.success, true);

			// Missing email returns 400
			const missingEmailRes = await sponsorshipModule.POST({
				request: new Request("https://codingcat.dev/api/sponsorship", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: "Jane Dev", tier: "Dedicated Video" }),
				}),
			});
			assert.equal(missingEmailRes.status, 400);

			// Missing name returns 400
			const missingNameRes = await sponsorshipModule.POST({
				request: new Request("https://codingcat.dev/api/sponsorship", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: "jane@example.com",
						tier: "Dedicated Video",
					}),
				}),
			});
			assert.equal(missingNameRes.status, 400);

			// Missing tier returns 400
			const missingTierRes = await sponsorshipModule.POST({
				request: new Request("https://codingcat.dev/api/sponsorship", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: "Jane Dev", email: "jane@example.com" }),
				}),
			});
			assert.equal(missingTierRes.status, 400);
		});
	});

	// ── 2. RSS & JSON Feeds ───────────────────────────────────────────────
	describe("RSS & JSON Feeds", () => {
		const feeds = loadModule("src/lib/feeds.ts");

		it("2.1 buildRss2 produces valid RSS 2.0 with XML declaration and namespaces", () => {
			const mockSanity = createMockSanityContext();
			const now = new Date("2026-08-18T12:00:00Z");
			const xml = feeds.buildRss2({
				origin: "https://codingcat.dev",
				type: "post",
				items: [
					{
						_id: "post-1",
						_type: "post",
						title: "Test Post",
						slug: "test-post",
						excerpt: "A test excerpt",
						date: "2026-08-10T00:00:00Z",
						author: [{ title: "Alex Patterson", slug: "alex-patterson" }],
					},
				],
				now,
				sanity: mockSanity,
			});

			assert.ok(
				xml.startsWith(`<?xml version="1.0" encoding="utf-8"?>`),
				"Must have XML declaration",
			);
			assert.ok(xml.includes(`<rss version="2.0"`), "Must be RSS 2.0");
			assert.ok(
				xml.includes(`xmlns:dc="http://purl.org/dc/elements/1.1/"`),
				"Must declare dc namespace",
			);
			assert.ok(
				xml.includes(
					`xmlns:content="http://purl.org/rss/1.0/modules/content/"`,
				),
				"Must declare content namespace",
			);
			assert.ok(
				xml.includes("<title>CodingCat.dev - post feed</title>"),
				"Must have channel title",
			);
			assert.ok(
				xml.includes("<link>https://codingcat.dev/blog</link>"),
				"Must have channel link",
			);
		});

		it("2.2 buildRss2 wraps title and excerpt in CDATA and preserves Sanity _id as GUID", () => {
			const mockSanity = createMockSanityContext();
			const xml = feeds.buildRss2({
				origin: "https://codingcat.dev",
				type: "post",
				items: [
					{
						_id: "guid-sanity-12345",
						_type: "post",
						title: "Exploring <Next.js> & Astro",
						slug: "exploring-next-astro",
						excerpt: "Comparing <b>frameworks</b>",
						date: "2026-08-10T00:00:00Z",
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			assert.ok(
				xml.includes("<title><![CDATA[Exploring <Next.js> & Astro]]></title>"),
				"Title must be CDATA wrapped",
			);
			assert.ok(
				xml.includes(
					"<description><![CDATA[Comparing <b>frameworks</b>]]></description>",
				),
				"Excerpt must be CDATA wrapped",
			);
			assert.ok(
				xml.includes(`<guid isPermaLink="false">guid-sanity-12345</guid>`),
				"Sanity _id must be verbatim GUID with isPermaLink=false",
			);
		});

		it("2.3 buildPodcastRss declares itunes, atom, and podcast namespaces", () => {
			const mockSanity = createMockSanityContext();
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [],
				now: new Date("2026-08-18T12:00:00Z"),
				sanity: mockSanity,
			});

			assert.ok(
				xml.includes(
					`xmlns:itunes="http://www.itunes.apple.com/dtds/podcast-1.0.dtd"`,
				),
				"Must declare itunes namespace",
			);
			assert.ok(
				xml.includes(`xmlns:atom="http://www.w3.org/2005/Atom"`),
				"Must declare atom namespace",
			);
			assert.ok(
				xml.includes(`xmlns:podcast="https://podcastindex.org/namespace/1.0"`),
				"Must declare podcast namespace",
			);
			assert.ok(
				xml.includes(
					`<atom:link href="https://codingcat.dev/podcasts/rss.xml" rel="self" type="application/rss+xml" />`,
				),
				"Must have atom self link",
			);
			assert.ok(
				xml.includes('<itunes:category text="Technology" />'),
				"Must declare Technology category",
			);
			assert.ok(
				xml.includes("<itunes:explicit>false</itunes:explicit>"),
				"Must declare itunes:explicit",
			);
		});

		it("2.4 buildPodcastRss serializes audio enclosure with url, length, and audio/mpeg type", () => {
			const mockSanity = createMockSanityContext();
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "pod-1",
						_type: "podcast",
						title: "Episode 1: Astro Migration",
						slug: "episode-1-astro-migration",
						spotify: {
							enclosures: [
								{
									url: "https://anchor.fm/s/123/play/456/audio.mp3",
									length: 12345678,
									type: "audio/mpeg",
								},
							],
							itunes: {
								duration: "00:45:30",
								episodeType: "full",
							},
						},
						season: 2,
						episode: 5,
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			assert.ok(
				xml.includes(
					`<enclosure url="https://anchor.fm/s/123/play/456/audio.mp3" length="12345678" type="audio/mpeg" />`,
				),
				"Enclosure tag must match",
			);
			assert.ok(
				xml.includes("<itunes:duration>00:45:30</itunes:duration>"),
				"Duration tag must match",
			);
			assert.ok(
				xml.includes("<itunes:season>2</itunes:season>"),
				"Season tag must match",
			);
			assert.ok(
				xml.includes("<itunes:episode>5</itunes:episode>"),
				"Episode tag must match",
			);
		});

		it("2.5 buildJsonFeed outputs JSON Feed version 1 compliant structure", () => {
			const mockSanity = createMockSanityContext();
			const jsonStr = feeds.buildJsonFeed({
				origin: "https://codingcat.dev",
				type: "post",
				items: [
					{
						_id: "json-1",
						_type: "post",
						title: "JSON Feed Test",
						slug: "json-feed-test",
						excerpt: "Summary text",
						date: "2026-08-10T00:00:00Z",
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			const feed = JSON.parse(jsonStr);
			assert.equal(feed.version, "https://jsonfeed.org/version/1");
			assert.equal(feed.home_page_url, "https://codingcat.dev/blog");
			assert.equal(feed.feed_url, "https://codingcat.dev/blog/rss.json");
			assert.equal(feed.items.length, 1);
			assert.equal(feed.items[0].id, "json-1");
			assert.equal(
				feed.items[0].url,
				"https://codingcat.dev/post/json-feed-test",
			);
			assert.equal(feed.items[0].title, "JSON Feed Test");
		});

		it("2.6 Feeds enforce FEED_LIMIT constant = 50", () => {
			assert.equal(
				feeds.FEED_LIMIT,
				50,
				"FEED_LIMIT must be 50 to avoid feed bloat",
			);
		});
	});

	// ── 3. Sitemap ────────────────────────────────────────────────────────
	describe("Sitemap", () => {
		const sitemapModule = loadModule("src/pages/sitemap.xml.ts");

		it("3.1 sitemap.xml.ts exports GET handler", () => {
			assert.equal(
				typeof sitemapModule.GET,
				"function",
				"GET handler must be exported",
			);
		});

		it("3.2 Sitemap response includes correct Content-Type and Cache-Control headers", async () => {
			const mockSanity = createMockSanityContext({
				fetchPublished: async () => [],
			});
			const locals = {
				sanity: mockSanity,
				siteUrl: new URL("https://codingcat.dev"),
			};

			const res = await sitemapModule.GET({ locals });
			assert.equal(res.status, 200);
			assert.equal(
				res.headers.get("content-type"),
				"application/xml; charset=utf-8",
			);
			assert.equal(
				res.headers.get("cache-control"),
				"max-age=0, s-maxage=3600",
			);
		});

		it("3.3 Sitemap root and /search entries have correct priority and changefreq", async () => {
			const mockSanity = createMockSanityContext({
				fetchPublished: async () => [],
			});
			const locals = {
				sanity: mockSanity,
				siteUrl: new URL("https://codingcat.dev"),
			};

			const res = await sitemapModule.GET({ locals });
			const xml = await res.text();

			assert.ok(
				xml.includes("<loc>https://codingcat.dev</loc>"),
				"Root URL must be present",
			);
			assert.ok(
				xml.includes("<priority>1</priority>"),
				"Root URL priority must be 1",
			);
			assert.ok(
				xml.includes("<loc>https://codingcat.dev/search</loc>"),
				"/search must be present",
			);
			assert.ok(
				xml.includes("<priority>0.1</priority>"),
				"/search priority must be 0.1",
			);
			assert.ok(
				xml.includes("<changefreq>daily</changefreq>"),
				"/search changefreq must be daily",
			);
		});

		it("3.4 Sitemap maps page types to /:slug and content types to /:type/:slug", async () => {
			const mockSanity = createMockSanityContext({
				fetchPublished: async () => [
					{
						_type: "page",
						slug: "terms-of-use",
						_updatedAt: "2026-08-01T00:00:00.000Z",
					},
					{
						_type: "post",
						slug: "sample-tutorial",
						_updatedAt: "2026-08-02T00:00:00.000Z",
					},
					{
						_type: "podcast",
						slug: "sample-episode",
						_updatedAt: "2026-08-03T00:00:00.000Z",
					},
				],
			});
			const locals = {
				sanity: mockSanity,
				siteUrl: new URL("https://codingcat.dev"),
			};

			const res = await sitemapModule.GET({ locals });
			const xml = await res.text();

			assert.ok(
				xml.includes("<loc>https://codingcat.dev/terms-of-use</loc>"),
				"page type maps to /terms-of-use",
			);
			assert.ok(
				xml.includes("<loc>https://codingcat.dev/post/sample-tutorial</loc>"),
				"post type maps to /post/sample-tutorial",
			);
			assert.ok(
				xml.includes("<loc>https://codingcat.dev/podcast/sample-episode</loc>"),
				"podcast type maps to /podcast/sample-episode",
			);
		});

		it("3.5 Sitemap conforms to urlset schema xmlns http://www.sitemaps.org/schemas/sitemap/0.9", async () => {
			const mockSanity = createMockSanityContext({
				fetchPublished: async () => [],
			});
			const locals = {
				sanity: mockSanity,
				siteUrl: new URL("https://codingcat.dev"),
			};

			const res = await sitemapModule.GET({ locals });
			const xml = await res.text();
			assert.ok(
				xml.includes(
					`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
				),
				"Must declare sitemap schema namespace",
			);
		});
	});

	// ── 4. Robots.txt ─────────────────────────────────────────────────────
	describe("Robots.txt", () => {
		const robotsModule = loadModule("src/pages/robots.txt.ts");

		it("4.1 robots.txt.ts exports GET handler", () => {
			assert.equal(
				typeof robotsModule.GET,
				"function",
				"GET handler must be exported",
			);
		});

		it("4.2 Production robots allows root and disallows /api/ and /dashboard/", async () => {
			const locals = { siteUrl: new URL("https://codingcat.dev") };
			const res = await robotsModule.GET({ locals });
			const body = await res.text();

			assert.ok(body.includes("User-Agent: *"));
			assert.ok(body.includes("Allow: /"));
			assert.ok(body.includes("Disallow: /api/"));
			assert.ok(body.includes("Disallow: /dashboard/"));
			assert.ok(body.includes("Host: https://codingcat.dev"));
			assert.ok(body.includes("Sitemap: https://codingcat.dev/sitemap.xml"));
		});

		it("4.3 Non-production robots disallows all crawling (Disallow: /)", async () => {
			const locals = { siteUrl: new URL("https://codingcatdev.workers.dev") };
			const res = await robotsModule.GET({ locals });
			const body = await res.text();

			assert.ok(body.includes("User-Agent: *"));
			assert.ok(body.includes("Disallow: /"));
			assert.ok(
				!body.includes("Allow: /"),
				"Non-production must not contain Allow: /",
			);
			assert.ok(
				!body.includes("Host:"),
				"Non-production must not contain Host:",
			);
		});

		it("4.4 Robots response headers set text/plain; charset=utf-8 and cache-control", async () => {
			const locals = { siteUrl: new URL("https://codingcat.dev") };
			const res = await robotsModule.GET({ locals });

			assert.equal(res.status, 200);
			assert.equal(
				res.headers.get("content-type"),
				"text/plain; charset=utf-8",
			);
			assert.equal(
				res.headers.get("cache-control"),
				"max-age=0, s-maxage=3600",
			);
		});

		it("4.5 Production output matches baseline robots.txt byte-for-byte", async () => {
			const baseline = loadBaseline("robots.txt");
			const locals = { siteUrl: new URL("https://codingcat.dev") };
			const res = await robotsModule.GET({ locals });
			const body = await res.text();

			assert.equal(
				body.trim(),
				baseline.trim(),
				"Production robots.txt output must match baseline snapshot",
			);
		});
	});

	// ── 5. Dynamic OG Images ──────────────────────────────────────────────
	describe("Dynamic OG Images", () => {
		const ogUtils = loadModule("src/lib/og-utils.ts");

		it("5.1 OG cache header matches contract (public, max-age=86400, s-maxage=604800)", () => {
			assert.equal(
				ogUtils.OG_CACHE_HEADER,
				"public, max-age=86400, s-maxage=604800",
			);
		});

		it("5.2 Brand tokens define exact hex values for Satori compatibility", () => {
			assert.equal(ogUtils.BRAND.bg, "#000000");
			assert.equal(ogUtils.BRAND.primary, "#7c3aed");
			assert.equal(ogUtils.BRAND.text, "#ffffff");
			assert.equal(ogUtils.TYPE_COLORS.Blog, "#3b82f6");
			assert.equal(ogUtils.TYPE_COLORS.Podcast, "#f59e0b");
			assert.equal(ogUtils.TYPE_COLORS.Author, "#ec4899");
		});

		it("5.3 titleFontSize dynamically scales for lengths: <=40 (56), 41-60 (48), >60 (42)", () => {
			assert.equal(ogUtils.titleFontSize("Short Title"), 56);
			assert.equal(ogUtils.titleFontSize("A".repeat(40)), 56);
			assert.equal(ogUtils.titleFontSize("A".repeat(41)), 48);
			assert.equal(ogUtils.titleFontSize("A".repeat(60)), 48);
			assert.equal(ogUtils.titleFontSize("A".repeat(61)), 42);
			assert.equal(ogUtils.titleFontSize("A".repeat(120)), 42);
		});

		it("5.4 All 4 OG image endpoints exist and export GET handler with parameter parsing", () => {
			const endpoints = [
				{ file: "default.png.ts", expectedParams: ["title", "subtitle"] },
				{ file: "blog.png.ts", expectedParams: ["title", "author", "type"] },
				{
					file: "podcast.png.ts",
					expectedParams: ["title", "author", "episode"],
				},
				{ file: "person.png.ts", expectedParams: ["title", "type"] },
			];

			for (const { file, expectedParams } of endpoints) {
				const fullPath = path.resolve(SRC_DIR, "pages/api/og", file);
				assert.ok(fs.existsSync(fullPath), `OG endpoint ${file} must exist`);
				const fileContent = fs.readFileSync(fullPath, "utf-8");
				assert.ok(
					fileContent.includes("export const GET"),
					`${file} must export GET handler`,
				);
				assert.ok(
					fileContent.includes("ImageResponse"),
					`${file} must return ImageResponse`,
				);
				assert.ok(
					fileContent.includes("OG_CACHE_HEADER"),
					`${file} must set OG_CACHE_HEADER`,
				);
				for (const param of expectedParams) {
					assert.ok(
						fileContent.includes(param),
						`${file} must parse param ${param}`,
					);
				}
			}
		});

		it("5.5 Font loader loads Inter Bold and Regular fonts with correct metadata", () => {
			const fonts = ogUtils.loadFonts();
			assert.equal(fonts.length, 3);
			assert.equal(fonts[0].name, "Inter");
			assert.equal(fonts[0].weight, 700);
			assert.equal(fonts[1].weight, 400);
			assert.equal(fonts[2].weight, 500);
		});
	});

	// ── 6. Draft Mode ─────────────────────────────────────────────────────
	describe("Draft Mode", () => {
		const previewModule = loadModule("src/lib/sanity/preview.ts");

		it("6.1 PREVIEW_COOKIE and PERSPECTIVE_PARAM constants are properly defined", () => {
			assert.equal(previewModule.PREVIEW_COOKIE, "__sanity_preview");
			assert.equal(
				previewModule.PERSPECTIVE_PARAM,
				"sanity-preview-perspective",
			);
		});

		it("6.2 resolvePreview disables preview when cookie is absent", () => {
			const result = previewModule.resolvePreview({
				env: { SANITY_API_READ_TOKEN: "valid-token" },
				hasPreviewCookie: false,
				perspectiveParam: null,
			});
			assert.deepEqual(result, { enabled: false });
		});

		it("6.3 resolvePreview fails closed when read token is missing despite cookie", () => {
			const result = previewModule.resolvePreview({
				env: {}, // No SANITY_API_READ_TOKEN
				hasPreviewCookie: true,
				perspectiveParam: "drafts",
			});
			assert.deepEqual(
				result,
				{ enabled: false },
				"Must fail closed if SANITY_API_READ_TOKEN is missing",
			);
		});

		it("6.4 resolvePreview enables preview with drafts perspective when token and cookie are present", () => {
			const result = previewModule.resolvePreview({
				env: { SANITY_API_READ_TOKEN: "sk_secret_123" },
				hasPreviewCookie: true,
				perspectiveParam: null, // default
			});
			assert.equal(result.enabled, true);
			assert.equal(result.token, "sk_secret_123");
			assert.equal(result.perspective, "drafts");
		});

		it("6.5 resolvePreview parses perspective parameter correctly (published, drafts, releases)", () => {
			const resPub = previewModule.resolvePreview({
				env: { SANITY_API_READ_TOKEN: "tok" },
				hasPreviewCookie: true,
				perspectiveParam: "published",
			});
			assert.equal(resPub.perspective, "published");

			const resRelease = previewModule.resolvePreview({
				env: { SANITY_API_READ_TOKEN: "tok" },
				hasPreviewCookie: true,
				perspectiveParam: "summer-2026,autumn-2026",
			});
			assert.deepEqual(resRelease.perspective, ["summer-2026", "autumn-2026"]);
		});

		it("6.6 GET /api/draft-mode/enable sets __sanity_preview cookie and redirects", async () => {
			const enableModule = loadModule("src/pages/api/draft-mode/enable.ts");
			assert.equal(typeof enableModule.GET, "function");

			let setCookieName = null;
			let setCookieVal = null;
			let setCookieOpts = null;

			const res = await enableModule.GET({
				url: new URL(
					"https://codingcat.dev/api/draft-mode/enable?returnTo=/post/sample-draft",
				),
				cookies: {
					set: (name, val, opts) => {
						setCookieName = name;
						setCookieVal = val;
						setCookieOpts = opts;
					},
				},
				redirect: (dest, status) =>
					new Response(null, { status, headers: { Location: dest } }),
			});

			assert.equal(res.status, 307);
			assert.equal(res.headers.get("Location"), "/post/sample-draft");
			assert.equal(setCookieName, "__sanity_preview");
			assert.equal(setCookieVal, "true");
			assert.equal(setCookieOpts.httpOnly, true);
			assert.equal(setCookieOpts.secure, true);
			assert.equal(setCookieOpts.sameSite, "lax");
		});

		it("6.7 POST and GET /api/draft-mode/disable clears __sanity_preview cookie and redirects", async () => {
			const disableModule = loadModule("src/pages/api/draft-mode/disable.ts");
			assert.equal(typeof disableModule.POST, "function");
			assert.equal(typeof disableModule.GET, "function");

			let deletedCookie = null;
			const mockCookies = {
				delete: (name) => {
					deletedCookie = name;
				},
				set: () => {},
			};

			// POST request with form-encoded returnTo
			const formBody = new URLSearchParams({ returnTo: "/blog/page/1" });
			const postRes = await disableModule.POST({
				request: new Request("https://codingcat.dev/api/draft-mode/disable", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: formBody.toString(),
				}),
				url: new URL("https://codingcat.dev/api/draft-mode/disable"),
				cookies: mockCookies,
				redirect: (dest, status) =>
					new Response(null, { status, headers: { Location: dest } }),
			});

			assert.equal(postRes.status, 303);
			assert.equal(postRes.headers.get("Location"), "/blog/page/1");
			assert.equal(deletedCookie, "__sanity_preview");

			// GET request with query param returnTo
			deletedCookie = null;
			const getRes = await disableModule.GET({
				url: new URL(
					"https://codingcat.dev/api/draft-mode/disable?returnTo=/podcasts/page/1",
				),
				cookies: mockCookies,
				redirect: (dest, status) =>
					new Response(null, { status, headers: { Location: dest } }),
			});

			assert.equal(getRes.status, 307);
			assert.equal(getRes.headers.get("Location"), "/podcasts/page/1");
			assert.equal(deletedCookie, "__sanity_preview");
		});

		it("6.8 Draft mode endpoints reject backslashes and protocol-relative destinations to prevent open redirects", async () => {
			const enableModule = loadModule("src/pages/api/draft-mode/enable.ts");
			const disableModule = loadModule("src/pages/api/draft-mode/disable.ts");

			const mockCookies = {
				set: () => {},
				delete: () => {},
			};
			const mockRedirect = (dest, status) =>
				new Response(null, { status, headers: { Location: dest } });

			// 1. enable with returnTo=/\\evil.com
			const resEnableBackslash = await enableModule.GET({
				url: new URL(
					"https://codingcat.dev/api/draft-mode/enable?returnTo=/\\evil.com",
				),
				cookies: mockCookies,
				redirect: mockRedirect,
			});
			assert.equal(resEnableBackslash.headers.get("Location"), "/");

			// 2. enable with slug=\\evil.com
			const resEnableSlugBackslash = await enableModule.GET({
				url: new URL(
					"https://codingcat.dev/api/draft-mode/enable?slug=\\evil.com",
				),
				cookies: mockCookies,
				redirect: mockRedirect,
			});
			assert.equal(resEnableSlugBackslash.headers.get("Location"), "/");

			// 3. enable with protocol-relative returnTo=//evil.com
			const resEnableProtocolRelative = await enableModule.GET({
				url: new URL(
					"https://codingcat.dev/api/draft-mode/enable?returnTo=//evil.com",
				),
				cookies: mockCookies,
				redirect: mockRedirect,
			});
			assert.equal(resEnableProtocolRelative.headers.get("Location"), "/");

			// 4. disable GET with returnTo=/\\evil.com
			const resDisableBackslash = await disableModule.GET({
				url: new URL(
					"https://codingcat.dev/api/draft-mode/disable?returnTo=/\\evil.com",
				),
				cookies: mockCookies,
				redirect: mockRedirect,
			});
			assert.equal(resDisableBackslash.headers.get("Location"), "/");

			// 5. disable POST form with returnTo=/\\evil.com
			const resDisablePostForm = await disableModule.POST({
				request: new Request("https://codingcat.dev/api/draft-mode/disable", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({ returnTo: "/\\evil.com" }).toString(),
				}),
				url: new URL("https://codingcat.dev/api/draft-mode/disable"),
				cookies: mockCookies,
				redirect: mockRedirect,
			});
			assert.equal(resDisablePostForm.headers.get("Location"), "/");

			// 6. disable POST json with returnTo=/\\evil.com
			const resDisablePostJson = await disableModule.POST({
				request: new Request("https://codingcat.dev/api/draft-mode/disable", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ returnTo: "/\\evil.com" }),
				}),
				url: new URL("https://codingcat.dev/api/draft-mode/disable"),
				cookies: mockCookies,
				redirect: mockRedirect,
			});
			assert.equal(resDisablePostJson.headers.get("Location"), "/");
		});
	});

	// ── 7. Agent Readiness & Autonomous Discovery Endpoints ───────────────
	describe("Agent Readiness & Discovery Contracts", () => {
		const locals = {
			siteUrl: new URL("https://codingcat.dev"),
		};

		it("7.1 API Catalog conforms to RFC 9727 and RFC 9264 linkset+json", async () => {
			const apiCatalogModule = loadModule("src/pages/.well-known/api-catalog.ts");
			const res = await apiCatalogModule.GET({ locals });
			assert.equal(res.status, 200);
			assert.ok(
				res.headers.get("content-type")?.includes("application/linkset+json"),
			);
			const data = await res.json();
			assert.ok(Array.isArray(data.linkset), "Must include linkset array");
			assert.ok(
				data.linkset.some((e) => e.anchor === "https://codingcat.dev/api/search"),
				"Must include search anchor",
			);
			assert.ok(
				data.linkset.some((e) => e.anchor === "https://codingcat.dev/api/mcp"),
				"Must include mcp anchor",
			);
		});

		it("7.2 ARD AI Catalog manifest conforms to ARD v0.9 / ai-catalog model", async () => {
			const aiCatalogModule = loadModule("src/pages/.well-known/ai-catalog.json.ts");
			const res = await aiCatalogModule.GET({ locals });
			assert.equal(res.status, 200);
			assert.ok(
				res.headers.get("content-type")?.includes("application/json"),
			);
			assert.equal(res.headers.get("access-control-allow-origin"), "*");
			const data = await res.json();
			assert.equal(typeof data.specVersion, "string");
			assert.ok(data.host && data.host.identifier);
			assert.ok(Array.isArray(data.entries) && data.entries.length >= 2);
			for (const entry of data.entries) {
				assert.ok(entry.identifier.startsWith("urn:air:"));
				assert.ok(entry.displayName);
				assert.ok(entry.type);
				assert.ok(Boolean(entry.url) !== Boolean(entry.data)); // exactly one of url or data
				assert.ok(Array.isArray(entry.representativeQueries));
			}
		});

		it("7.3 OpenAPI 3.1 endpoint serves valid schema for search and mcp", async () => {
			const openApiModule = loadModule("src/pages/.well-known/openapi.json.ts");
			const res = await openApiModule.GET({ locals });
			assert.equal(res.status, 200);
			const data = await res.json();
			assert.equal(data.openapi, "3.1.0");
			assert.ok(data.paths["/api/search"]);
			assert.ok(data.paths["/api/mcp"]);
		});

		it("7.4 OAuth & OIDC discovery metadata publishes authorization endpoints", async () => {
			const oidcModule = loadModule("src/pages/.well-known/openid-configuration.ts");
			const oauthServerModule = loadModule("src/pages/.well-known/oauth-authorization-server.ts");

			const oidcRes = await oidcModule.GET({ locals });
			const oidcData = await oidcRes.json();
			assert.equal(oidcData.issuer, "https://codingcat.dev");
			assert.ok(oidcData.authorization_endpoint);
			assert.ok(oidcData.token_endpoint);

			const oauthRes = await oauthServerModule.GET({ locals });
			const oauthData = await oauthRes.json();
			assert.equal(oauthData.issuer, "https://codingcat.dev");
			assert.ok(oauthData.agent_auth, "Must include agent_auth block for Auth.md");
			assert.ok(oauthData.agent_auth.skill.includes("/auth.md"));
			assert.ok(oauthData.agent_auth.register_uri);
		});

		it("7.5 OAuth Protected Resource Metadata (RFC 9728) points to issuer and scopes", async () => {
			const prmModule = loadModule("src/pages/.well-known/oauth-protected-resource.ts");
			const res = await prmModule.GET({ locals });
			assert.equal(res.status, 200);
			const data = await res.json();
			assert.equal(data.resource, "https://codingcat.dev");
			assert.deepEqual(data.authorization_servers, ["https://codingcat.dev"]);
			assert.ok(Array.isArray(data.scopes_supported));
			assert.deepEqual(data.bearer_methods_supported, ["header"]);
		});

		it("7.6 Auth.md serves Markdown with H1 auth.md and agent instructions", async () => {
			const authMdModule = loadModule("src/pages/auth.md.ts");
			const res = await authMdModule.GET({ locals });
			assert.equal(res.status, 200);
			assert.ok(
				res.headers.get("content-type")?.includes("text/markdown"),
			);
			const body = await res.text();
			assert.ok(body.includes("# CodingCat.dev auth.md"));
			assert.ok(body.includes("/agent/claim"));
			assert.ok(body.includes("/agent/auth"));
		});
	});
});
