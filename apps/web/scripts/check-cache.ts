/*
 * Audit Vercel edge-cache status for every page in the sitemap.
 *
 * Reads the `x-vercel-cache` response header for each URL in /sitemap.xml and
 * reports which pages are served from cache (HIT / STALE / PRERENDER /
 * REVALIDATED) vs. recomputed on the fly (MISS / BYPASS). MISS-heavy routes are
 * the ones costing fluid-compute time.
 *
 * Run:
 *   npx tsx ./scripts/check-cache.ts
 *   npx tsx ./scripts/check-cache.ts https://codingcat.dev
 *   npx tsx ./scripts/check-cache.ts --warm --concurrency=8 --json=cache-report.json
 *
 * Flags:
 *   <baseUrl>          Positional. Defaults to $SITE_URL / $NEXT_PUBLIC_BASE_URL
 *                      / https://codingcat.dev
 *   --warm             Request each URL twice; report the SECOND result (lets a
 *                      cold MISS warm into a HIT so you see the steady state).
 *   --concurrency=N    Parallel requests (default 10).
 *   --limit=N          Only check the first N URLs (handy for spot checks).
 *   --json=path        Also write a full JSON report to `path`.
 */

interface Result {
	url: string;
	status: number;
	cache: string; // x-vercel-cache value, or a synthetic label
	age: string | null;
	cacheControl: string | null;
	durationMs: number;
	error?: string;
}

interface Args {
	baseUrl: string;
	warm: boolean;
	concurrency: number;
	limit: number | null;
	jsonPath: string | null;
}

function parseArgs(argv: string[]): Args {
	let baseUrl =
		process.env.SITE_URL ||
		process.env.NEXT_PUBLIC_BASE_URL ||
		"https://codingcat.dev";
	let warm = false;
	let concurrency = 10;
	let limit: number | null = null;
	let jsonPath: string | null = null;

	for (const arg of argv) {
		if (arg === "--warm") warm = true;
		else if (arg.startsWith("--concurrency="))
			concurrency = Math.max(1, Number(arg.split("=")[1]) || 10);
		else if (arg.startsWith("--limit="))
			limit = Math.max(1, Number(arg.split("=")[1]) || 0) || null;
		else if (arg.startsWith("--json=")) jsonPath = arg.split("=")[1] || null;
		else if (!arg.startsWith("--")) baseUrl = arg;
	}

	return { baseUrl: baseUrl.replace(/\/$/, ""), warm, concurrency, limit, jsonPath };
}

/** Extract all <loc> values from a sitemap or sitemap-index document. */
function extractLocs(xml: string): string[] {
	const locs: string[] = [];
	const re = /<loc>\s*([^<]+?)\s*<\/loc>/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml)) !== null) {
		locs.push(m[1].trim());
	}
	return locs;
}

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url, { redirect: "follow" });
	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
	}
	return res.text();
}

/** Resolve all page URLs from /sitemap.xml, following a sitemap index if present. */
async function collectUrls(baseUrl: string): Promise<string[]> {
	const sitemapUrl = `${baseUrl}/sitemap.xml`;
	const root = await fetchText(sitemapUrl);

	const isIndex = /<sitemapindex[\s>]/.test(root);
	if (!isIndex) return extractLocs(root);

	const childSitemaps = extractLocs(root);
	const all: string[] = [];
	for (const child of childSitemaps) {
		try {
			all.push(...extractLocs(await fetchText(child)));
		} catch (err) {
			console.warn(`  ! Skipping child sitemap ${child}: ${(err as Error).message}`);
		}
	}
	return all;
}

async function checkUrl(url: string, warm: boolean): Promise<Result> {
	const doRequest = async (): Promise<Result> => {
		const started = Date.now();
		try {
			// GET (not HEAD) — x-vercel-cache is most reliable on GET. Body is
			// discarded so we don't buffer large HTML.
			const res = await fetch(url, { redirect: "follow" });
			await res.body?.cancel();
			return {
				url,
				status: res.status,
				cache: (res.headers.get("x-vercel-cache") || "(no header)").toUpperCase(),
				age: res.headers.get("age"),
				cacheControl: res.headers.get("cache-control"),
				durationMs: Date.now() - started,
			};
		} catch (err) {
			return {
				url,
				status: 0,
				cache: "(error)",
				age: null,
				cacheControl: null,
				durationMs: Date.now() - started,
				error: (err as Error).message,
			};
		}
	};

	if (warm) {
		await doRequest(); // prime the edge cache
	}
	return doRequest();
}

/** Minimal concurrency-limited map. */
async function mapWithConcurrency<T, R>(
	items: T[],
	limit: number,
	fn: (item: T, index: number) => Promise<R>,
	onProgress?: (done: number, total: number) => void,
): Promise<R[]> {
	const results = new Array<R>(items.length);
	let next = 0;
	let done = 0;

	async function worker() {
		while (next < items.length) {
			const i = next++;
			results[i] = await fn(items[i], i);
			done++;
			onProgress?.(done, items.length);
		}
	}

	const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
	await Promise.all(workers);
	return results;
}

// `x-vercel-cache` values considered "served from cache" (good).
const CACHED = new Set(["HIT", "STALE", "PRERENDER", "REVALIDATED"]);

function isCached(cache: string): boolean {
	return CACHED.has(cache);
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	console.log(`Auditing Vercel cache for: ${args.baseUrl}`);
	console.log(
		`Mode: ${args.warm ? "warm (2 passes, reporting 2nd)" : "single pass"}  •  concurrency=${args.concurrency}`,
	);

	console.log("\nFetching sitemap…");
	let urls = await collectUrls(args.baseUrl);
	if (urls.length === 0) {
		console.error("No URLs found in sitemap. Aborting.");
		process.exit(1);
	}
	if (args.limit) urls = urls.slice(0, args.limit);
	console.log(`Found ${urls.length} URL(s).\n`);

	const results = await mapWithConcurrency(
		urls,
		args.concurrency,
		(url) => checkUrl(url, args.warm),
		(done, total) => {
			// Single updating line on a TTY; periodic lines when piped/CI.
			if (process.stdout.isTTY) {
				process.stdout.write(`\rChecking… ${done}/${total}`);
			} else if (done === total || done % 50 === 0) {
				console.log(`Checking… ${done}/${total}`);
			}
		},
	);
	if (process.stdout.isTTY) process.stdout.write("\n");
	process.stdout.write("\n");

	// Group by cache status.
	const byStatus = new Map<string, Result[]>();
	for (const r of results) {
		const list = byStatus.get(r.cache) ?? [];
		list.push(r);
		byStatus.set(r.cache, list);
	}

	const cachedCount = results.filter((r) => isCached(r.cache)).length;
	const missing = results
		.filter((r) => !isCached(r.cache))
		.sort((a, b) => b.durationMs - a.durationMs);

	// Summary table by status.
	console.log("=== Cache status summary ===");
	const sortedStatuses = [...byStatus.entries()].sort(
		(a, b) => b[1].length - a[1].length,
	);
	for (const [status, list] of sortedStatuses) {
		const pct = ((list.length / results.length) * 100).toFixed(1);
		const tag = isCached(status) ? "cached " : "MISS/uncached";
		console.log(
			`  ${status.padEnd(14)} ${String(list.length).padStart(4)}  (${pct}%)  ${tag}`,
		);
	}
	console.log(
		`\n  Cached: ${cachedCount}/${results.length} (${((cachedCount / results.length) * 100).toFixed(1)}%)`,
	);

	// Detail the misses — these are the fluid-compute cost.
	if (missing.length) {
		console.log(`\n=== Not served from edge cache (${missing.length}) ===`);
		console.log(
			`  ${"CACHE".padEnd(12)} ${"STATUS".padEnd(7)} ${"ms".padStart(6)}  URL`,
		);
		for (const r of missing) {
			const path = r.url.replace(args.baseUrl, "") || "/";
			const extra = r.error ? `  (${r.error})` : "";
			console.log(
				`  ${r.cache.padEnd(12)} ${String(r.status).padEnd(7)} ${String(r.durationMs).padStart(6)}  ${path}${extra}`,
			);
		}
	} else {
		console.log("\nAll pages are served from the edge cache. 🎉");
	}

	if (args.jsonPath) {
		const { writeFile } = await import("node:fs/promises");
		const report = {
			baseUrl: args.baseUrl,
			generatedAt: new Date().toISOString(),
			mode: args.warm ? "warm" : "single",
			total: results.length,
			cached: cachedCount,
			summary: Object.fromEntries(
				[...byStatus.entries()].map(([k, v]) => [k, v.length]),
			),
			results,
		};
		await writeFile(args.jsonPath, JSON.stringify(report, null, 2));
		console.log(`\nWrote JSON report → ${args.jsonPath}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
