import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
	createMockSanityContext,
	extractXmlTags,
	loadBaseline,
	loadModule,
	parseXmlAttributes,
	SRC_DIR,
	stegaClean,
} from "./helpers.mjs";

describe("Tier 2 - Boundary & Corner Cases", () => {
	// ── 1. Pagination Bounds Check ────────────────────────────────────────
	describe("Pagination Bounds Check", () => {
		const pagination = loadModule("src/lib/pagination.ts");

		it("1.1 Page 0 is rejected with 404 response", () => {
			const res = pagination.resolvePage({
				raw: "0",
				count: 50,
				base: "blog",
				redirect: (p, s) =>
					new Response(null, { status: s, headers: { Location: p } }),
			});
			assert.equal(res.ok, false);
			assert.equal(res.response.status, 404);
		});

		it("1.2 Negative page numbers are rejected with 404 response", () => {
			for (const raw of ["-1", "-10", "-999"]) {
				const res = pagination.resolvePage({
					raw,
					count: 50,
					base: "blog",
					redirect: () => new Response(),
				});
				assert.equal(res.ok, false);
				assert.equal(res.response.status, 404);
			}
		});

		it("1.3 Non-numeric and malformed string pages return 404", () => {
			for (const raw of [
				"abc",
				"page1",
				"1a",
				"NaN",
				"undefined",
				"null",
				"",
			]) {
				const res = pagination.resolvePage({
					raw,
					count: 50,
					base: "blog",
					redirect: () => new Response(),
				});
				assert.equal(res.ok, false);
				assert.equal(res.response.status, 404);
			}
		});

		it("1.4 Decimal, whitespace, and exponential notations return 404", () => {
			for (const raw of ["1.5", "2.0", " 1 ", "1 ", " 1", "1e2", "01"]) {
				const res = pagination.resolvePage({
					raw,
					count: 50,
					base: "blog",
					redirect: () => new Response(),
				});
				assert.equal(res.ok, false, `Raw input "${raw}" should be rejected`);
				assert.equal(res.response.status, 404);
			}
		});

		it("1.5 Page beyond total count returns 302 redirect to /:base/page/:totalPages", () => {
			const res = pagination.resolvePage({
				raw: "999",
				count: 25, // totalPages = 3
				base: "blog",
				redirect: (dest, status) =>
					new Response(null, { status, headers: { Location: dest } }),
			});
			assert.equal(res.ok, false);
			assert.equal(res.response.status, 302);
			assert.equal(res.response.headers.get("Location"), "/blog/page/3");
		});

		it("1.6 Zero count items clamps totalPages to 1 with page 1 bounds valid", () => {
			const res = pagination.resolvePage({
				raw: "1",
				count: 0,
				base: "podcasts",
				redirect: () => new Response(),
			});
			assert.equal(res.ok, true);
			assert.deepEqual(res.bounds, {
				page: 1,
				totalPages: 1,
				offset: 0,
				limit: 10,
			});
		});

		it("1.7 Valid middle and last page calculations are precise", () => {
			const count = 55; // 6 total pages
			const resPage3 = pagination.resolvePage({
				raw: "3",
				count,
				base: "authors",
				redirect: () => new Response(),
			});
			assert.equal(resPage3.ok, true);
			assert.deepEqual(resPage3.bounds, {
				page: 3,
				totalPages: 6,
				offset: 20,
				limit: 30,
			});

			const resPage6 = pagination.resolvePage({
				raw: "6",
				count,
				base: "authors",
				redirect: () => new Response(),
			});
			assert.equal(resPage6.ok, true);
			assert.deepEqual(resPage6.bounds, {
				page: 6,
				totalPages: 6,
				offset: 50,
				limit: 60,
			});
		});
	});

	// ── 2. Non-existent Slugs ─────────────────────────────────────────────
	describe("Non-existent Slugs", () => {
		it("2.1 Non-existent post returns 404 in [slug].astro handler contract", () => {
			const content = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/post/[slug].astro"),
				"utf-8",
			);
			assert.ok(content.includes("postQuery"), "Must query postQuery");
			assert.ok(
				content.includes("!post?._id"),
				"Checks post existence via _id",
			);
			assert.ok(
				content.includes("new Response(null, { status: 404 })"),
				"Returns 404 on missing post",
			);
		});

		it("2.2 Non-existent podcast returns 404 in [slug].astro handler contract", () => {
			const content = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/podcast/[slug].astro"),
				"utf-8",
			);
			assert.ok(content.includes("podcastQuery"), "Must query podcastQuery");
			assert.ok(
				content.includes("!podcast?._id"),
				"Checks podcast existence via _id",
			);
			assert.ok(
				content.includes("new Response(null, { status: 404 })"),
				"Returns 404 on missing podcast",
			);
		});

		it("2.3 Non-existent author returns 404 in [slug].astro handler contract", () => {
			const content = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/author/[slug].astro"),
				"utf-8",
			);
			assert.ok(content.includes("authorQuery"), "Must query authorQuery");
			assert.ok(
				content.includes("!person?._id"),
				"Checks author existence via _id",
			);
			assert.ok(
				content.includes("new Response(null, { status: 404 })"),
				"Returns 404 on missing author",
			);
		});

		it("2.4 Non-existent guest returns 404 in [slug].astro handler contract", () => {
			const content = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/guest/[slug].astro"),
				"utf-8",
			);
			assert.ok(content.includes("guestQuery"), "Must query guestQuery");
			assert.ok(
				content.includes("!person?._id"),
				"Checks guest existence via _id",
			);
			assert.ok(
				content.includes("new Response(null, { status: 404 })"),
				"Returns 404 on missing guest",
			);
		});

		it("2.5 Non-existent sponsor returns 404 in [slug].astro handler contract", () => {
			const content = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/sponsor/[slug].astro"),
				"utf-8",
			);
			assert.ok(content.includes("sponsorQuery"), "Must query sponsorQuery");
			assert.ok(
				content.includes("!sponsor?._id"),
				"Checks sponsor existence via _id",
			);
			assert.ok(
				content.includes("new Response(null, { status: 404 })"),
				"Returns 404 on missing sponsor",
			);
		});

		it("2.6 Non-existent catch-all static page slug returns 404", () => {
			const content = fs.readFileSync(
				path.resolve(SRC_DIR, "pages/[slug].astro"),
				"utf-8",
			);
			assert.ok(content.includes("pageQuery"), "Must query pageQuery");
			assert.ok(
				content.includes("!page?._id"),
				"Checks page existence via _id",
			);
			assert.ok(
				content.includes("new Response(null, { status: 404 })"),
				"Returns 404 on missing page document",
			);
		});
	});

	// ── 3. Podcast RSS GUID Verification ──────────────────────────────────
	describe("Podcast RSS GUID Verification", () => {
		const feeds = loadModule("src/lib/feeds.ts");

		it("3.1 Podcast RSS strictly preserves Sanity _id verbatim inside <guid>", () => {
			const mockSanity = createMockSanityContext();
			const testId = "9876abcd-ef01-2345-6789-abcdef012345";
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: testId,
						_type: "podcast",
						title: "Test Episode",
						slug: "test-episode",
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			const guidTags = extractXmlTags(xml, "guid");
			assert.equal(guidTags.length, 1);
			assert.equal(guidTags[0].content, testId);
			const attrs = parseXmlAttributes(guidTags[0].attributes);
			assert.equal(attrs.isPermaLink, "false");
		});

		it("3.2 Safeguard: GUID is never transformed into URL or slug", () => {
			const mockSanity = createMockSanityContext();
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "sanity-doc-id-xyz",
						_type: "podcast",
						title: "Episode with Custom Slug",
						slug: "custom-slug-name",
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			const guidTags = extractXmlTags(xml, "guid");
			assert.ok(
				!guidTags[0].content.includes("https://"),
				"GUID must not be a URL",
			);
			assert.ok(
				!guidTags[0].content.includes("custom-slug-name"),
				"GUID must not be a slug",
			);
			assert.equal(guidTags[0].content, "sanity-doc-id-xyz");
		});

		it("3.3 All 50 baseline podcast GUIDs use isPermaLink=false and match baseline snapshot", () => {
			const baselineXml = loadBaseline("podcasts_rss.xml");
			const guidTags = extractXmlTags(baselineXml, "guid");
			assert.equal(guidTags.length, 50, "Baseline has 50 podcast GUIDs");

			for (const g of guidTags) {
				const attrs = parseXmlAttributes(g.attributes);
				assert.equal(
					attrs.isPermaLink,
					"false",
					`GUID ${g.content} must have isPermaLink=false`,
				);
				assert.ok(
					g.content.length > 5,
					"GUID must be non-empty valid Sanity id",
				);
			}
		});

		it("3.4 Special characters in _id are escaped in XML guid tag", () => {
			const mockSanity = createMockSanityContext();
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "drafts.foo&bar<test>",
						_type: "podcast",
						title: "Draft Episode",
						slug: "draft-ep",
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			const guidTags = extractXmlTags(xml, "guid");
			assert.equal(guidTags[0].content, "drafts.foo&amp;bar&lt;test&gt;");
		});

		it("3.5 All GUIDs in feed items are unique", () => {
			const baselineXml = loadBaseline("podcasts_rss.xml");
			const guidTags = extractXmlTags(baselineXml, "guid");
			const guidSet = new Set(guidTags.map((g) => g.content));
			assert.equal(guidSet.size, 50, "All 50 GUIDs must be unique");
		});
	});

	// ── 4. Audio Enclosures ───────────────────────────────────────────────
	describe("Audio Enclosures", () => {
		const feeds = loadModule("src/lib/feeds.ts");

		it("4.1 Audio enclosure outputs url, length, and audio/mpeg type", () => {
			const mockSanity = createMockSanityContext();
			const enclosureData = {
				url: "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026/test.mp3",
				length: 45678901,
				type: "audio/mpeg",
			};

			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "ep-audio",
						_type: "podcast",
						title: "Audio Test",
						slug: "audio-test",
						spotify: { enclosures: [enclosureData] },
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			assert.ok(xml.includes(`url="${enclosureData.url}"`));
			assert.ok(xml.includes(`length="${enclosureData.length}"`));
			assert.ok(xml.includes(`type="audio/mpeg"`));
		});

		it("4.2 Missing enclosure length defaults to 0 and type defaults to audio/mpeg", () => {
			const mockSanity = createMockSanityContext();
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "ep-audio-defaults",
						_type: "podcast",
						title: "Defaults Test",
						slug: "defaults-test",
						spotify: {
							enclosures: [{ url: "https://example.com/podcast.mp3" }],
						},
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			assert.ok(
				xml.includes(
					`<enclosure url="https://example.com/podcast.mp3" length="0" type="audio/mpeg" />`,
				),
			);
		});

		it("4.3 Enclosure tag is omitted when spotify enclosures array is missing or empty", () => {
			const mockSanity = createMockSanityContext();
			const xmlNoSpotify = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "ep-no-spotify",
						_type: "podcast",
						title: "No Spotify Test",
						slug: "no-spotify-test",
						spotify: null,
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});
			assert.ok(
				!xmlNoSpotify.includes("<enclosure"),
				"Must not include enclosure tag when spotify is null",
			);

			const xmlEmptyEnclosures = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "ep-empty-enc",
						_type: "podcast",
						title: "Empty Enclosures Test",
						slug: "empty-enc-test",
						spotify: { enclosures: [] },
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});
			assert.ok(
				!xmlEmptyEnclosures.includes("<enclosure"),
				"Must not include enclosure tag when enclosures is empty",
			);
		});

		it("4.4 Enclosure URL with query parameters is safely XML escaped", () => {
			const mockSanity = createMockSanityContext();
			const rawUrl =
				"https://example.com/audio.mp3?token=abc&session=123&track=5";
			const xml = feeds.buildPodcastRss({
				origin: "https://codingcat.dev",
				type: "podcast",
				items: [
					{
						_id: "ep-query-url",
						_type: "podcast",
						title: "Query URL Test",
						slug: "query-url-test",
						spotify: { enclosures: [{ url: rawUrl, length: 1000 }] },
					},
				],
				now: new Date(),
				sanity: mockSanity,
			});

			assert.ok(
				xml.includes("token=abc&amp;session=123&amp;track=5"),
				"Query ampersands must be escaped",
			);
			assert.ok(
				!xml.includes("&session="),
				"Unescaped ampersand must not exist in enclosure",
			);
		});

		it("4.5 imageMimeType helper maps image extensions accurately", () => {
			const xmlLib = loadModule("src/lib/xml.ts");
			assert.equal(
				xmlLib.imageMimeType("https://cdn.example.com/img.jpg"),
				"image/jpg",
			);
			assert.equal(
				xmlLib.imageMimeType("https://cdn.example.com/img.jpeg"),
				"image/jpeg",
			);
			assert.equal(
				xmlLib.imageMimeType("https://cdn.example.com/img.png"),
				"image/png",
			);
			assert.equal(
				xmlLib.imageMimeType("https://cdn.example.com/img.webp"),
				"image/webp",
			);
			assert.equal(
				xmlLib.imageMimeType("https://cdn.example.com/img.svg"),
				"image/svg",
			);
			assert.equal(
				xmlLib.imageMimeType("https://cdn.example.com/img.custom"),
				"image/custom",
			);
		});
	});

	// ── 5. XML Escaping & CDATA Termination ───────────────────────────────
	describe("XML Escaping & CDATA Termination", () => {
		const xmlLib = loadModule("src/lib/xml.ts");

		it("5.1 escapeXml escapes all 5 XML predefined entities", () => {
			assert.equal(xmlLib.escapeXml("&"), "&amp;");
			assert.equal(xmlLib.escapeXml("<"), "&lt;");
			assert.equal(xmlLib.escapeXml(">"), "&gt;");
			assert.equal(xmlLib.escapeXml(`"`), "&quot;");
			assert.equal(xmlLib.escapeXml("'"), "&apos;");
		});

		it("5.2 escapeXml handles complex mixed strings without double escaping", () => {
			const input = `<div class="sample" id='test'>Tom & Jerry > Sylvester</div>`;
			const expected =
				"&lt;div class=&quot;sample&quot; id=&apos;test&apos;&gt;Tom &amp; Jerry &gt; Sylvester&lt;/div&gt;";
			assert.equal(xmlLib.escapeXml(input), expected);
		});

		it("5.3 cdata wraps text in CDATA enclosure", () => {
			assert.equal(xmlLib.cdata("Hello World"), "<![CDATA[Hello World]]>");
		});

		it("5.4 cdata neutralizes premature ]]> termination attack by splitting", () => {
			const attack = "Safe text ]]> Malicious XML injection";
			const result = xmlLib.cdata(attack);
			assert.equal(
				result,
				"<![CDATA[Safe text ]]]]><![CDATA[> Malicious XML injection]]>",
			);
			// Verify no raw ]]> exists outside proper enclosure
			assert.ok(!result.includes("Safe text ]]>"));
		});

		it("5.5 cdata handles multiple sequential ]]> instances", () => {
			const multi = "Alpha ]]> Beta ]]> Gamma ]]> Delta";
			const result = xmlLib.cdata(multi);
			assert.equal(
				result,
				"<![CDATA[Alpha ]]]]><![CDATA[> Beta ]]]]><![CDATA[> Gamma ]]]]><![CDATA[> Delta]]>",
			);
		});

		it("5.6 escapeXml and cdata handle empty strings gracefully", () => {
			assert.equal(xmlLib.escapeXml(""), "");
			assert.equal(xmlLib.cdata(""), "<![CDATA[]]>");
		});

		it("5.7 Unicode and emojis survive escapeXml and cdata intact", () => {
			const unicode = "🐱 CodingCat — 100% 🚀 & 💖";
			assert.equal(
				xmlLib.escapeXml(unicode),
				"🐱 CodingCat — 100% 🚀 &amp; 💖",
			);
			assert.equal(
				xmlLib.cdata(unicode),
				"<![CDATA[🐱 CodingCat — 100% 🚀 & 💖]]>",
			);
		});
	});

	// ── 6. Stega Cleaning ─────────────────────────────────────────────────
	describe("Stega Cleaning", () => {
		const STEGA_CHARS = "\u200B\u200C\u200D\uFEFF";

		it("6.1 stegaClean strips zero-width spaces and zero-width joiners from attributes", () => {
			const dirtyHref = `https://codingcat.dev/post/foo${STEGA_CHARS}`;
			const cleanHref = stegaClean(dirtyHref);
			assert.equal(cleanHref, "https://codingcat.dev/post/foo");
		});

		it("6.2 stegaClean ensures canonical URLs are pristine without stega markers", () => {
			const dirtyCanonical = `/blog/page/1${STEGA_CHARS}`;
			const cleanCanonical = stegaClean(dirtyCanonical);
			assert.equal(cleanCanonical, "/blog/page/1");
			assert.ok(!cleanCanonical.includes("\u200B"));
		});

		it("6.3 stegaClean cleans OpenGraph titles and descriptions", () => {
			const dirtyTitle = `Building Astro${STEGA_CHARS} Sites`;
			const cleanTitle = stegaClean(dirtyTitle);
			assert.equal(cleanTitle, "Building Astro Sites");
		});

		it("6.4 stegaClean cleans object values recursively or handles primitive types", () => {
			assert.equal(stegaClean(null), null);
			assert.equal(stegaClean(undefined), undefined);
			assert.equal(stegaClean("Clean string"), "Clean string");
			assert.equal(stegaClean(""), "");
		});

		it("6.5 stegaClean prevents zero-width corruption in feed GUIDs and audio URLs", () => {
			const dirtyGuid = `guid-1234${STEGA_CHARS}-5678`;
			const cleanGuid = stegaClean(dirtyGuid);
			assert.equal(cleanGuid, "guid-1234-5678");

			const dirtyAudio = `https://anchor.fm/test.mp3${STEGA_CHARS}`;
			const cleanAudio = stegaClean(dirtyAudio);
			assert.equal(cleanAudio, "https://anchor.fm/test.mp3");
		});
	});
});
