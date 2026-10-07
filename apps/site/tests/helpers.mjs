import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stegaClean } from "@sanity/client/stega";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, "..");
const BASELINE_DIR = path.resolve(SITE_ROOT, "baseline");
const SRC_DIR = path.resolve(SITE_ROOT, "src");

const require = createRequire(import.meta.url);
const astroPath = require.resolve("astro", { paths: [SITE_ROOT] });
const jitiPath = require.resolve("jiti", { paths: [astroPath] });
const { createJiti } = require(jitiPath);

// Initialize jiti for loading TypeScript modules with @/ alias
const jiti = createJiti(path.resolve(SRC_DIR, "index.ts"), {
	alias: {
		"@": SRC_DIR,
		"cloudflare:workers": path.resolve(__dirname, "cf-mock.mjs"),
		[path.resolve(SRC_DIR, "assets/fonts/Inter-Bold.ttf")]: path.resolve(
			__dirname,
			"font-bold-mock.mjs",
		),
		[path.resolve(SRC_DIR, "assets/fonts/Inter-Regular.ttf")]: path.resolve(
			__dirname,
			"font-reg-mock.mjs",
		),
		"../assets/fonts/Inter-Bold.ttf": path.resolve(
			__dirname,
			"font-bold-mock.mjs",
		),
		"../assets/fonts/Inter-Regular.ttf": path.resolve(
			__dirname,
			"font-reg-mock.mjs",
		),
	},
});

export function loadModule(relPath) {
	const fullPath = path.resolve(SITE_ROOT, relPath);
	return jiti(fullPath);
}

export function loadBaseline(filename) {
	const fullPath = path.resolve(BASELINE_DIR, filename);
	return fs.readFileSync(fullPath, "utf-8");
}

export function loadBaselineJson(filename) {
	return JSON.parse(loadBaseline(filename));
}

export { stegaClean, SITE_ROOT, BASELINE_DIR, SRC_DIR };

/**
 * Creates a mock SanityRequestContext for feed, sitemap, and page testing.
 */
export function createMockSanityContext(overrides = {}) {
	const config = {
		projectId: "hfh83o0w",
		dataset: "production",
		apiVersion: "2025-09-30",
		studioUrl: "https://codingcat.dev.sanity.studio/production",
		...overrides.config,
	};

	const preview = {
		enabled: false,
		...overrides.preview,
	};

	return {
		config,
		preview,
		loadQuery: async (query, params) => {
			if (overrides.loadQuery) {
				return overrides.loadQuery(query, params);
			}
			return null;
		},
		fetchPublished: async (query, params) => {
			if (overrides.fetchPublished) {
				return overrides.fetchPublished(query, params);
			}
			return [];
		},
		urlForImage: (source) => {
			if (!source) {
				return undefined;
			}
			return {
				width: (w) => ({
					height: (h) => ({
						url: () =>
							`https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/mock-image-${w}x${h}.jpg`,
					}),
					url: () =>
						`https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/mock-image-${w}.jpg`,
				}),
				height: (h) => ({
					url: () =>
						`https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/mock-image-x${h}.jpg`,
				}),
				url: () =>
					`https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/mock-image.jpg`,
			};
		},
		resolveOpenGraphImage: (image, width, height) => {
			if (!image) {
				return undefined;
			}
			return {
				url: `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/mock-og.png`,
				width: width ?? 1200,
				height: height ?? 630,
				alt: image.alt,
			};
		},
		...overrides,
	};
}

/**
 * Helper to inspect XML tags and attributes
 */
export function extractXmlTags(xml, tagName) {
	const regex = new RegExp(`<${tagName}([^>]*)>([\\s\\S]*?)</${tagName}>`, "g");
	const matches = [];
	let match = regex.exec(xml);
	while (match !== null) {
		matches.push({
			attributes: match[1].trim(),
			content: match[2],
			raw: match[0],
		});
		match = regex.exec(xml);
	}
	return matches;
}

export function extractSelfClosingTags(xml, tagName) {
	const regex = new RegExp(`<${tagName}\\s+([^>]*?)\\/>`, "g");
	const matches = [];
	let match = regex.exec(xml);
	while (match !== null) {
		matches.push({
			attributes: match[1].trim(),
			raw: match[0],
		});
		match = regex.exec(xml);
	}
	return matches;
}

export function parseXmlAttributes(attrString) {
	const attrs = {};
	const regex = /([a-zA-Z0-9_:-]+)="([^"]*)"/g;
	let match = regex.exec(attrString);
	while (match !== null) {
		attrs[match[1]] = match[2];
		match = regex.exec(attrString);
	}
	return attrs;
}
