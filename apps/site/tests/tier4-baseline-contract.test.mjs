import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	extractXmlTags,
	loadBaseline,
	loadBaselineJson,
	loadModule,
	parseXmlAttributes,
} from "./helpers.mjs";

describe("Tier 4 - Real-World Application & Baseline Contract", () => {
	// ── 1. Baseline Sitemap Contract ──────────────────────────────────────
	describe("Baseline Sitemap Contract (apps/site/baseline/sitemap.xml)", () => {
		const sitemapXml = loadBaseline("sitemap.xml");
		const urls = extractXmlTags(sitemapXml, "url");

		it("1.1 Baseline sitemap contains exactly 472 indexed URLs", () => {
			assert.equal(urls.length, 472, "Total indexed URLs must be exactly 472");
		});

		it("1.2 URL distribution and classification matches baseline contract", () => {
			const counts = {
				root: 0,
				search: 0,
				post: 0,
				podcast: 0,
				page: 0,
				author: 0,
				guest: 0,
				sponsor: 0,
			};

			for (const u of urls) {
				const locMatch = u.content.match(/<loc>(.*?)<\/loc>/);
				assert.ok(locMatch, "Each url block must contain loc");
				const loc = locMatch[1];
				const path = loc.replace("https://codingcat.dev", "");

				if (path === "" || path === "/") {
					counts.root++;
				} else if (path === "/search") {
					counts.search++;
				} else if (path.startsWith("/post/")) {
					counts.post++;
				} else if (path === "/podcast" || path.startsWith("/podcast/")) {
					counts.podcast++;
				} else if (path.startsWith("/author/")) {
					counts.author++;
				} else if (path.startsWith("/guest/")) {
					counts.guest++;
				} else if (path.startsWith("/sponsor/")) {
					counts.sponsor++;
				} else {
					counts.page++;
				}
			}

			assert.equal(counts.root, 1, "1 root URL");
			assert.equal(counts.search, 1, "1 search URL");
			assert.equal(counts.post, 69, "69 post URLs");
			assert.equal(counts.podcast, 194, "194 podcast URLs");
			assert.equal(counts.author, 5, "5 author URLs");
			assert.equal(counts.guest, 186, "186 guest URLs");
			assert.equal(counts.sponsor, 9, "9 sponsor URLs");
			assert.equal(counts.page, 7, "7 static page URLs");
		});

		it("1.3 Priority directives strictly match baseline specification", () => {
			for (const u of urls) {
				const loc = u.content.match(/<loc>(.*?)<\/loc>/)[1];
				const prio = u.content.match(/<priority>(.*?)<\/priority>/)[1];
				const path = loc.replace("https://codingcat.dev", "");

				if (path === "" || path === "/") {
					assert.equal(prio, "1", "Root priority must be 1");
				} else if (path === "/search") {
					assert.equal(prio, "0.1", "Search priority must be 0.1");
				} else {
					assert.equal(prio, "0.5", `Content ${path} priority must be 0.5`);
				}
			}
		});

		it("1.4 Changefreq directives strictly match baseline specification", () => {
			for (const u of urls) {
				const loc = u.content.match(/<loc>(.*?)<\/loc>/)[1];
				const freq = u.content.match(/<changefreq>(.*?)<\/changefreq>/)[1];
				const path = loc.replace("https://codingcat.dev", "");

				if (path === "/search") {
					assert.equal(freq, "daily", "Search changefreq must be daily");
				} else {
					assert.equal(
						freq,
						"monthly",
						`URL ${path} changefreq must be monthly`,
					);
				}
			}
		});

		it("1.5 Every lastmod timestamp is a valid ISO 8601 UTC date", () => {
			const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
			for (const u of urls) {
				const lastmod = u.content.match(/<lastmod>(.*?)<\/lastmod>/)[1];
				assert.ok(
					isoRegex.test(lastmod),
					`lastmod ${lastmod} must be valid ISO 8601 UTC`,
				);
			}
		});

		it("1.6 All loc entries conform to origin https://codingcat.dev with no trailing slash or duplicate slashes", () => {
			for (const u of urls) {
				const loc = u.content.match(/<loc>(.*?)<\/loc>/)[1];
				assert.ok(
					loc.startsWith("https://codingcat.dev"),
					`loc ${loc} must start with canonical origin`,
				);
				assert.ok(
					!loc.includes("//", 8),
					`loc ${loc} must not have double slashes`,
				);
				if (loc !== "https://codingcat.dev") {
					assert.ok(
						!loc.endsWith("/"),
						`loc ${loc} must not have trailing slash`,
					);
				}
			}
		});
	});

	// ── 2. Baseline Podcast Feed Contract ─────────────────────────────────
	describe("Baseline Podcast Feed Contract (apps/site/baseline/podcasts_rss.xml)", () => {
		const podcastXml = loadBaseline("podcasts_rss.xml");
		const items = extractXmlTags(podcastXml, "item");

		it("2.1 Baseline podcast feed contains exactly 50 recent episodes", () => {
			assert.equal(items.length, 50, "Must contain exactly 50 podcast items");
		});

		it("2.2 Channel declaration conforms to baseline namespaces and iTunes metadata", () => {
			assert.ok(
				podcastXml.includes('xmlns:atom="http://www.w3.org/2005/Atom"'),
			);
			assert.ok(
				podcastXml.includes(
					'xmlns:itunes="http://www.itunes.apple.com/dtds/podcast-1.0.dtd"',
				),
			);
			assert.ok(
				podcastXml.includes(
					'xmlns:content="http://purl.org/rss/1.0/modules/content/"',
				),
			);
			assert.ok(
				podcastXml.includes(
					'xmlns:podcast="https://podcastindex.org/namespace/1.0"',
				),
			);
			assert.ok(podcastXml.includes("<title>CodingCat.dev Podcast</title>"));
			assert.ok(
				podcastXml.includes("<link>https://codingcat.dev/podcasts</link>"),
			);
			assert.ok(
				podcastXml.includes(
					'<atom:link href="https://codingcat.dev/podcasts/rss.xml" rel="self" type="application/rss+xml" />',
				),
			);
			assert.ok(
				podcastXml.includes("<itunes:author>Alex Patterson</itunes:author>"),
			);
			assert.ok(podcastXml.includes('<itunes:category text="Technology" />'));
		});

		it("2.3 Every episode GUID preserves Sanity _id verbatim with isPermaLink=false", () => {
			for (const it of items) {
				const guidTag = extractXmlTags(it.content, "guid")[0];
				assert.ok(guidTag, "Must have guid tag");
				const attrs = parseXmlAttributes(guidTag.attributes);
				assert.equal(attrs.isPermaLink, "false", "Must have isPermaLink=false");
				// Must NOT be a URL
				assert.ok(
					!guidTag.content.startsWith("http"),
					`GUID ${guidTag.content} must not be URL`,
				);
				assert.ok(guidTag.content.length >= 10, "GUID must be valid Sanity id");
			}
		});

		it("2.4 Audio enclosures carry valid CloudFront/Anchor MP3 URLs and length attributes", () => {
			let enclosureCount = 0;
			for (const it of items) {
				const enclosureMatch = it.content.match(
					/<enclosure\s+url="([^"]*)"\s+length="([^"]*)"\s+type="([^"]*)"\s*\/>/,
				);
				if (enclosureMatch) {
					enclosureCount++;
					const [, url, length, type] = enclosureMatch;
					assert.ok(
						url.startsWith("https://"),
						`Enclosure URL ${url} must be HTTPS`,
					);
					assert.ok(
						Number(length) > 0,
						`Enclosure length ${length} must be positive`,
					);
					assert.equal(type, "audio/mpeg", "Enclosure type must be audio/mpeg");
				}
			}
			assert.ok(
				enclosureCount >= 40,
				"Majority of baseline episodes have audio enclosures",
			);
		});

		it("2.5 iTunes metadata tags are populated on episodes", () => {
			for (const it of items) {
				assert.ok(
					it.content.includes("<itunes:title>"),
					"Episode must have itunes:title",
				);
				assert.ok(
					it.content.includes("<itunes:author>"),
					"Episode must have itunes:author",
				);
				assert.ok(
					it.content.includes("<itunes:episodeType>"),
					"Episode must have itunes:episodeType",
				);
			}
		});

		it("2.6 Episode pubDate values conform to RFC 822 format", () => {
			const rfc822Regex =
				/^[A-Za-z]{3},\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT$/;
			for (const it of items) {
				const pubDate = it.content.match(/<pubDate>(.*?)<\/pubDate>/)[1];
				assert.ok(
					rfc822Regex.test(pubDate),
					`pubDate ${pubDate} must be RFC 822`,
				);
			}
		});
	});

	// ── 3. Baseline Blog Feed Contract ────────────────────────────────────
	describe("Baseline Blog Feed Contract (apps/site/baseline/blog_rss.xml)", () => {
		const blogXml = loadBaseline("blog_rss.xml");
		const items = extractXmlTags(blogXml, "item");

		it("3.1 Baseline blog feed contains exactly 50 recent articles", () => {
			assert.equal(items.length, 50, "Must contain exactly 50 blog posts");
		});

		it("3.2 Blog channel metadata matches baseline specification", () => {
			assert.ok(blogXml.includes("<title>CodingCat.dev - post feed</title>"));
			assert.ok(blogXml.includes("<link>https://codingcat.dev/blog</link>"));
			assert.ok(
				blogXml.includes(
					"<description>CodingCat.dev - post feed</description>",
				),
			);
			assert.ok(blogXml.includes("<language>en</language>"));
			assert.ok(blogXml.includes("<url>https://codingcat.dev/icon.svg</url>"));
		});

		it("3.3 Blog items contain title, link, guid, pubDate, content:encoded, and author", () => {
			for (const it of items) {
				assert.ok(
					it.content.includes("<title><![CDATA["),
					"Title must be CDATA",
				);
				assert.ok(
					it.content.includes("<link>https://codingcat.dev/post/"),
					"Link must be post URL",
				);
				assert.ok(
					it.content.includes('<guid isPermaLink="false">'),
					"Guid must have isPermaLink=false",
				);
				assert.ok(it.content.includes("<pubDate>"), "Must have pubDate");
				assert.ok(
					it.content.includes("<content:encoded><![CDATA["),
					"Content must be CDATA",
				);
				assert.ok(it.content.includes("<author>"), "Must declare author");
			}
		});

		it("3.4 Baseline JSON feeds match item count and schema versions", () => {
			const blogJson = loadBaselineJson("blog_rss.json");
			const podcastJson = loadBaselineJson("podcasts_rss.json");

			assert.equal(blogJson.version, "https://jsonfeed.org/version/1");
			assert.equal(blogJson.items.length, 50);
			assert.equal(blogJson.feed_url, "https://codingcat.dev/blog/rss.json");

			assert.equal(podcastJson.version, "https://jsonfeed.org/version/1");
			assert.equal(podcastJson.items.length, 50);
			assert.equal(
				podcastJson.feed_url,
				"https://codingcat.dev/podcasts/rss.json",
			);
		});

		it("3.5 Parity: XML GUID matches JSON feed ID across all 50 blog items", () => {
			const blogJson = loadBaselineJson("blog_rss.json");
			for (let i = 0; i < 50; i++) {
				const xmlGuid = extractXmlTags(items[i].content, "guid")[0].content;
				const jsonId = blogJson.items[i].id;
				assert.equal(xmlGuid, jsonId, `Item ${i} GUID must match JSON feed ID`);
			}
		});
	});

	// ── 4. Baseline Robots.txt Contract ───────────────────────────────────
	describe("Baseline Robots Contract (apps/site/baseline/robots.txt)", () => {
		const baselineRobots = loadBaseline("robots.txt");
		const robotsModule = loadModule("src/pages/robots.txt.ts");

		it("4.1 Baseline robots contains User-Agent: * block with /api/ and /dashboard/ disallowed", () => {
			assert.ok(baselineRobots.includes("User-Agent: *"));
			assert.ok(baselineRobots.includes("Allow: /"));
			assert.ok(baselineRobots.includes("Disallow: /api/"));
			assert.ok(baselineRobots.includes("Disallow: /dashboard/"));
		});

		it("4.2 Baseline robots declares Host and Sitemap pointing to codingcat.dev", () => {
			assert.ok(baselineRobots.includes("Host: https://codingcat.dev"));
			assert.ok(
				baselineRobots.includes("Sitemap: https://codingcat.dev/sitemap.xml"),
			);
		});

		it("4.3 Generated robots response matches baseline verbatim in production", async () => {
			const res = await robotsModule.GET({
				locals: { siteUrl: new URL("https://codingcat.dev") },
			});
			const generated = await res.text();
			assert.equal(generated.trim(), baselineRobots.trim());
		});

		it("4.4 Non-production environment outputs Disallow: / to prevent indexation", async () => {
			const res = await robotsModule.GET({
				locals: { siteUrl: new URL("https://codingcatdev.workers.dev") },
			});
			const generated = await res.text();
			assert.equal(generated.trim(), "User-Agent: *\nDisallow: /");
		});

		it("4.5 Robots headers include text/plain; charset=utf-8 and max-age=0, s-maxage=3600", async () => {
			const res = await robotsModule.GET({
				locals: { siteUrl: new URL("https://codingcat.dev") },
			});
			assert.equal(
				res.headers.get("content-type"),
				"text/plain; charset=utf-8",
			);
			assert.equal(
				res.headers.get("cache-control"),
				"max-age=0, s-maxage=3600",
			);
		});
	});
});
