#!/usr/bin/env node
import path from "node:path";
import { run } from "node:test";
import { spec } from "node:test/reporters";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIERS = [
	{
		tier: 1,
		name: "Tier 1 - Feature Coverage",
		file: path.resolve(__dirname, "tier1-features.test.mjs"),
		areas: [
			"Public content routes (/, /blog, /post/:slug, /podcasts, /podcast/:slug, /authors, /guests, /sponsors, /[slug], /404, /search, /sponsorships)",
			"RSS & JSON feeds (/blog/rss.xml, /blog/rss.json, /podcasts/rss.xml, /podcasts/rss.json)",
			"Sitemap XML endpoint (/sitemap.xml)",
			"Robots text endpoint (/robots.txt)",
			"Dynamic OG image endpoints (/api/og/default.png, blog.png, podcast.png, person.png)",
			"Draft mode contracts and preview resolution (/api/draft-mode/enable, disable)",
		],
	},
	{
		tier: 2,
		name: "Tier 2 - Boundary & Corner Cases",
		file: path.resolve(__dirname, "tier2-boundaries.test.mjs"),
		areas: [
			"Pagination bounds checking (page 0, negative pages, non-numeric, decimal/whitespace, out of bounds redirect 302, zero-item clamp)",
			"Non-existent slug resolution (404 status contracts across post, podcast, author, guest, sponsor, catch-all page)",
			'Podcast RSS GUID verification (verbatim Sanity _id preservation in <guid isPermaLink="false">, anti-resyndication safety)',
			"Audio enclosures validation (MP3 URLs, positive byte lengths, audio/mpeg type, empty fallback, special char escaping)",
			"XML entity escaping & CDATA termination defense (predefined XML entities, ]]> splitting injection defense)",
			"Stega cleaning enforcement (zero-width characters stripped from attributes, canonicals, OG tags, metadata)",
		],
	},
	{
		tier: 3,
		name: "Tier 3 - Cross-Feature Combinations",
		file: path.resolve(__dirname, "tier3-combinations.test.mjs"),
		areas: [
			"Redirect rules (listing stubs /blog/page -> /1 (302), /authors (302), /guests (302), /sponsors (302), legacy feeds (301))",
			"Canonical URL resolution via Astro.locals.siteUrl (production, dev worker, origin normalization, path joining)",
			"Dynamic OG fallback scaling & long titles (<=40: 56px, 41-60: 48px, >60: 42px, extreme length, special chars, monograms)",
			"Draft mode cookie handling & cache poisoning prevention (__sanity_preview -> no-store, private & noindex, nofollow)",
		],
	},
	{
		tier: 4,
		name: "Tier 4 - Real-World Application & Baseline Contract",
		file: path.resolve(__dirname, "tier4-baseline-contract.test.mjs"),
		areas: [
			"Baseline sitemap contract (exact match against 472 URLs: 1 root, 1 search, 69 posts, 194 podcasts, 7 pages, 5 authors, 186 guests, 9 sponsors)",
			"Baseline podcast RSS feed contract (exact match against 50 baseline items, iTunes tags, atom self link, GUID fidelity)",
			"Baseline blog RSS feed contract (exact match against 50 baseline items, CDATA descriptions, JSON feed parity)",
			"Baseline robots.txt contract (byte-for-byte exact line match against baseline in production environment)",
		],
	},
];

async function main() {
	console.log(
		"================================================================================",
	);
	console.log(
		"       @codingcatdev/site DUAL-TRACK AUTOMATED E2E TEST SUITE RUNNER           ",
	);
	console.log(
		"================================================================================",
	);

	const args = process.argv.slice(2);
	const tierArg = args.find((a) => a.startsWith("--tier="));
	const selectedTier = tierArg ? parseInt(tierArg.split("=")[1], 10) : null;

	const targetTiers = selectedTier
		? TIERS.filter((t) => t.tier === selectedTier)
		: TIERS;

	if (targetTiers.length === 0) {
		console.error("Error: Unknown tier. Available tiers: 1, 2, 3, 4.");
		process.exit(1);
	}

	const filesToRun = targetTiers.map((t) => t.file);
	console.log(
		"Running target tier(s): " +
			targetTiers.map((t) => `Tier ${t.tier}`).join(", ") +
			"\n",
	);

	const startTime = Date.now();
	let totalTests = 0;
	let passedTests = 0;
	let failedTests = 0;

	const stream = run({
		files: filesToRun,
	});

	const failureDetails = [];

	stream.compose(new spec()).pipe(process.stdout);

	stream.on("test:pass", () => {
		passedTests++;
		totalTests++;
	});

	stream.on("test:fail", (data) => {
		failedTests++;
		totalTests++;
		failureDetails.push(data);
	});

	await new Promise((resolve) => stream.on("end", resolve));

	const durationMs = Date.now() - startTime;

	console.log(
		"\n================================================================================",
	);
	console.log(
		"                         E2E TEST EXECUTION SUMMARY                             ",
	);
	console.log(
		"================================================================================",
	);
	for (const t of targetTiers) {
		console.log(`\n• ${t.name}:`);
		for (const a of t.areas) {
			console.log(`  ✓ ${a}`);
		}
	}

	console.log(
		"\n--------------------------------------------------------------------------------",
	);
	console.log(`Total Test Cases Executed : ${totalTests}`);
	console.log(`Passed                    : ${passedTests}`);
	console.log(`Failed                    : ${failedTests}`);
	console.log(`Duration                  : ${durationMs}ms`);
	console.log(
		"--------------------------------------------------------------------------------",
	);

	if (failedTests > 0) {
		console.error(`\n❌ TEST SUITE FAILED with ${failedTests} failure(s):`);
		for (const f of failureDetails) {
			console.error(`\n- Test: ${f.name}`);
			if (f.details?.error) {
				console.error(
					f.details.error.stack || f.details.error.message || f.details.error,
				);
			}
		}
		process.exit(1);
	} else {
		console.log(
			"\n✅ ALL E2E TEST SUITES PASSED! Dual-Track Verification Complete.",
		);
		process.exit(0);
	}
}

main().catch((err) => {
	console.error("Test runner encountered an error:", err);
	process.exit(1);
});
