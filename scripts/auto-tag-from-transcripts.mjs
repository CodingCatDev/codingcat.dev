import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
	process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const isDryRun = process.argv.includes("--dry-run") || !token;

const client = createClient({
	projectId,
	dataset,
	...(token ? { token } : {}),
	apiVersion: "2025-09-30",
	useCdn: false,
});

/**
 * Curated taxonomy of Companies/Platforms and Programming Languages/Frameworks/Topics.
 * - `strongPatterns`: matching once in title/excerpt/summary/tags/content or >= 2 times in fullText triggers the tag.
 * - `contextPatterns`: matching in title/excerpt/tags or >= 3 times in fullText triggers the tag.
 */
export const TAG_TAXONOMY = [
	// --- Cloud & Infrastructure Companies ---
	{
		label: "AWS",
		value: "aws",
		category: "company",
		strongPatterns: [
			/\baws\b/i,
			/\bamazon web services\b/i,
			/\bamazon bedrock\b/i,
			/\baws amplify\b/i,
			/\baws lambda\b/i,
			/\baws cdk\b/i,
			/\baws sam\b/i,
			/\bappsync\b/i,
			/\bdynamodb\b/i,
			/\bcloudformation\b/i,
			/\blocalstack\b/i,
			/\bsagemaker\b/i,
			/\bamazon s3\b/i,
			/\bamazon cognito\b/i,
			/\baws community builder/i,
		],
	},
	{
		label: "Google Cloud",
		value: "google-cloud",
		category: "company",
		strongPatterns: [
			/\bgoogle cloud\b/i,
			/\bgcp\b/i,
			/\bvertex ai\b/i,
			/\bcloud run\b/i,
			/\bbigquery\b/i,
		],
	},
	{
		label: "Firebase",
		value: "firebase",
		category: "company",
		strongPatterns: [
			/\bfirebase\b/i,
			/\bfirestore\b/i,
			/\bgenkit\b/i,
			/\bproject idx\b/i,
		],
	},
	{
		label: "Cloudflare",
		value: "cloudflare",
		category: "company",
		strongPatterns: [
			/\bcloudflare\b/i,
			/\bcloudflare workers\b/i,
			/\bwrangler\b/i,
			/\bcloudflare pages\b/i,
			/\bcloudflare d1\b/i,
			/\bcloudflare r2\b/i,
		],
	},
	{
		label: "Microsoft Azure",
		value: "azure",
		category: "company",
		strongPatterns: [
			/\bmicrosoft azure\b/i,
			/\bazure\b/i,
			/\bcosmos db\b/i,
		],
	},
	{
		label: "Vercel",
		value: "vercel",
		category: "company",
		strongPatterns: [/\bvercel\b/i, /\bturborepo\b/i, /\bv0\.dev\b/i],
	},
	{
		label: "Netlify",
		value: "netlify",
		category: "company",
		strongPatterns: [/\bnetlify\b/i],
	},
	{
		label: "Sanity",
		value: "sanity",
		category: "company",
		strongPatterns: [
			/\bsanity\.io\b/i,
			/\bsanity studio\b/i,
			/\bsanity cms\b/i,
			/\bportable text\b/i,
			/\bgroq\b/i,
		],
	},
	{
		label: "Supabase",
		value: "supabase",
		category: "company",
		strongPatterns: [/\bsupabase\b/i],
	},
	{
		label: "Appwrite",
		value: "appwrite",
		category: "company",
		strongPatterns: [/\bappwrite\b/i],
	},
	{
		label: "Convex",
		value: "convex",
		category: "company",
		strongPatterns: [/\bconvex\.dev\b/i, /\bconvex\b/i],
	},
	{
		label: "Builder.io",
		value: "builder-io",
		category: "company",
		strongPatterns: [
			/\bbuilder\.io\b/i,
			/\bqwik\b/i,
			/\bmitosis\b/i,
			/\bpartytown\b/i,
		],
	},
	{
		label: "Algolia",
		value: "algolia",
		category: "company",
		strongPatterns: [/\balgolia\b/i],
	},
	{
		label: "Auth0",
		value: "auth0",
		category: "company",
		strongPatterns: [/\bauth0\b/i],
	},
	{
		label: "Clerk",
		value: "clerk",
		category: "company",
		strongPatterns: [/\bclerk\.com\b/i, /\bclerk\.dev\b/i, /\bclerk auth\b/i],
	},
	{
		label: "Stripe",
		value: "stripe",
		category: "company",
		strongPatterns: [/\bstripe\b/i],
	},
	{
		label: "Cloudinary",
		value: "cloudinary",
		category: "company",
		strongPatterns: [/\bcloudinary\b/i],
	},
	{
		label: "GitHub",
		value: "github",
		category: "company",
		strongPatterns: [
			/\bgithub\b/i,
			/\bgithub actions\b/i,
			/\bgithub copilot\b/i,
			/\bcodespaces\b/i,
		],
	},
	{
		label: "Docker",
		value: "docker",
		category: "company",
		strongPatterns: [/\bdocker\b/i, /\bdockerfile\b/i, /\bkubernetes\b/i, /\bk8s\b/i],
	},
	{
		label: "Shopify",
		value: "shopify",
		category: "company",
		strongPatterns: [/\bshopify\b/i, /\bshopify hydrogen\b/i],
	},
	{
		label: "Prisma",
		value: "prisma",
		category: "company",
		strongPatterns: [/\bprisma\b/i],
	},
	{
		label: "Drizzle",
		value: "drizzle",
		category: "company",
		strongPatterns: [/\bdrizzle orm\b/i, /\bdrizzle\b/i],
	},
	{
		label: "Turso",
		value: "turso",
		category: "company",
		strongPatterns: [/\bturso\b/i, /\blibsql\b/i],
	},
	{
		label: "Neon",
		value: "neon",
		category: "company",
		strongPatterns: [/\bneon\.tech\b/i, /\bneon postgres\b/i],
	},
	{
		label: "MongoDB",
		value: "mongodb",
		category: "company",
		strongPatterns: [/\bmongodb\b/i, /\bmongo atlas\b/i],
	},
	{
		label: "Redis",
		value: "redis",
		category: "company",
		strongPatterns: [/\bredis\b/i, /\bupstash\b/i],
	},
	{
		label: "Storyblok",
		value: "storyblok",
		category: "company",
		strongPatterns: [/\bstoryblok\b/i],
	},
	{
		label: "Contentful",
		value: "contentful",
		category: "company",
		strongPatterns: [/\bcontentful\b/i],
	},
	{
		label: "Hygraph",
		value: "hygraph",
		category: "company",
		strongPatterns: [/\bhygraph\b/i, /\bgraphcms\b/i],
	},
	{
		label: "Sentry",
		value: "sentry",
		category: "company",
		strongPatterns: [/\bsentry\.io\b/i, /\bsentry\b/i],
	},
	{
		label: "Postman",
		value: "postman",
		category: "company",
		strongPatterns: [/\bpostman\b/i],
	},
	{
		label: "PostHog",
		value: "posthog",
		category: "company",
		strongPatterns: [/\bposthog\b/i],
	},
	{
		label: "LaunchDarkly",
		value: "launchdarkly",
		category: "company",
		strongPatterns: [/\blaunchdarkly\b/i],
	},
	{
		label: "AuthZed",
		value: "authzed",
		category: "company",
		strongPatterns: [/\bauthzed\b/i, /\bspicedb\b/i],
	},

	// --- Programming Languages & Frameworks ---
	{
		label: "JavaScript",
		value: "javascript",
		category: "language",
		strongPatterns: [/\bjavascript\b/i, /\becmascript\b/i, /\bvanilla js\b/i],
	},
	{
		label: "TypeScript",
		value: "typescript",
		category: "language",
		strongPatterns: [/\btypescript\b/i],
	},
	{
		label: "React",
		value: "react",
		category: "framework",
		strongPatterns: [
			/\breact\b/i,
			/\breactjs\b/i,
			/\breact\.js\b/i,
			/\breact server components\b/i,
		],
	},
	{
		label: "Next.js",
		value: "nextjs",
		category: "framework",
		strongPatterns: [/\bnext\.js\b/i, /\bnextjs\b/i],
	},
	{
		label: "Svelte",
		value: "svelte",
		category: "framework",
		strongPatterns: [/\bsvelte\b/i, /\bsveltekit\b/i],
	},
	{
		label: "Vue",
		value: "vue",
		category: "framework",
		strongPatterns: [/\bvue\.js\b/i, /\bvuejs\b/i, /\bnuxt\b/i, /\bnuxtjs\b/i],
	},
	{
		label: "Angular",
		value: "angular",
		category: "framework",
		strongPatterns: [/\bangular\b/i, /\banalogjs\b/i, /\bngrx\b/i],
	},
	{
		label: "Astro",
		value: "astro",
		category: "framework",
		strongPatterns: [/\bastro\.build\b/i, /\bastrojs\b/i, /\bastro\b/i],
	},
	{
		label: "Remix",
		value: "remix",
		category: "framework",
		strongPatterns: [/\bremix\.run\b/i, /\bremix\b/i],
	},
	{
		label: "SolidJS",
		value: "solidjs",
		category: "framework",
		strongPatterns: [/\bsolidjs\b/i, /\bsolid\.js\b/i, /\bsolidstart\b/i],
	},
	{
		label: "Node.js",
		value: "nodejs",
		category: "language",
		strongPatterns: [/\bnode\.js\b/i, /\bnodejs\b/i, /\bdeno\b/i, /\bbun\.sh\b/i],
	},
	{
		label: "Python",
		value: "python",
		category: "language",
		strongPatterns: [/\bpython\b/i, /\bfastapi\b/i, /\bdjango\b/i, /\bpytorch\b/i],
	},
	{
		label: "Rust",
		value: "rust",
		category: "language",
		strongPatterns: [/\brust\b/i, /\brustlang\b/i, /\btauri\b/i, /\bwebassembly\b/i, /\bwasm\b/i],
	},
	{
		label: "Go",
		value: "go",
		category: "language",
		strongPatterns: [/\bgolang\b/i],
	},
	{
		label: "PHP",
		value: "php",
		category: "language",
		strongPatterns: [/\bphp\b/i, /\blaravel\b/i, /\bwordpress\b/i, /\bsymfony\b/i, /\bzend engine\b/i],
	},
	{
		label: "C#",
		value: "csharp",
		category: "language",
		strongPatterns: [/\bc#\b/i, /\bdotnet\b/i, /\.net\b/i, /\bblazor\b/i],
	},
	{
		label: "Flutter",
		value: "flutter",
		category: "framework",
		strongPatterns: [/\bflutter\b/i, /\bdart\b/i],
	},
	{
		label: "React Native",
		value: "react-native",
		category: "framework",
		strongPatterns: [/\breact native\b/i, /\bexpo\b/i],
	},
	{
		label: "Tailwind CSS",
		value: "tailwindcss",
		category: "framework",
		strongPatterns: [/\btailwind\b/i, /\btailwindcss\b/i, /\bdaisyui\b/i],
	},
	{
		label: "CSS",
		value: "css",
		category: "language",
		strongPatterns: [/\bcss\b/i, /\bcss3\b/i, /\bsass\b/i, /\bscss\b/i],
	},
	{
		label: "HTML",
		value: "html",
		category: "language",
		strongPatterns: [/\bhtml5?\b/i, /\bweb components\b/i, /\bhtmx\b/i],
	},
	{
		label: "GraphQL",
		value: "graphql",
		category: "language",
		strongPatterns: [/\bgraphql\b/i, /\bapollo\b/i],
	},
	{
		label: "SQL",
		value: "sql",
		category: "language",
		strongPatterns: [/\bpostgres\b/i, /\bpostgresql\b/i, /\bmysql\b/i, /\bsqlite\b/i, /\bsql\b/i],
	},
	{
		label: "AI",
		value: "ai",
		category: "topic",
		strongPatterns: [
			/\b(?:artificial intelligence|genai|generative ai|llm|llms|openai|chatgpt|anthropic|claude|gemini|langchain|vector database|rag|machine learning|ai agent|ai agents)\b/i,
		],
	},
	{
		label: "MCP",
		value: "mcp",
		category: "topic",
		strongPatterns: [/\bmodel context protocol\b/i, /\bmcp server\b/i, /\bmcp\b/i],
	},
	{
		label: "Security",
		value: "security",
		category: "topic",
		strongPatterns: [
			/\bcybersecurity\b/i,
			/\bcve-\d{4}-\d+/i,
			/\bvulnerability\b/i,
			/\bauthentication\b/i,
			/\bauthorization\b/i,
			/\boauth\b/i,
			/\bpasskeys?\b/i,
			/\brbac\b/i,
			/\bzero trust\b/i,
		],
	},
	{
		label: "Serverless",
		value: "serverless",
		category: "topic",
		strongPatterns: [/\bserverless\b/i, /\bjamstack\b/i, /\bedge functions?\b/i],
	},
	{
		label: "DevOps",
		value: "devops",
		category: "topic",
		strongPatterns: [/\bdevops\b/i, /\bci\/cd\b/i, /\bterraform\b/i, /\bobservability\b/i, /\bmonitoring\b/i],
	},
	{
		label: "Accessibility",
		value: "a11y",
		category: "topic",
		strongPatterns: [/\baccessibility\b/i, /\ba11y\b/i, /\bwcag\b/i],
	},
	{
		label: "Design",
		value: "design",
		category: "topic",
		strongPatterns: [/\bfigma\b/i, /\bdesign system/i, /\bui\/ux\b/i],
	},
	{
		label: "Career",
		value: "career",
		category: "topic",
		strongPatterns: [/\bdevrel\b/i, /\bdeveloper relations\b/i, /\bdeveloper advocacy\b/i, /\btech career\b/i],
	},
];

function extractPortableTextPlain(blocks) {
	if (!Array.isArray(blocks)) return "";
	const parts = [];
	for (const b of blocks) {
		if (b?._type === "block" && Array.isArray(b.children)) {
			parts.push(b.children.map((c) => c.text || "").join(""));
		} else if (b?._type === "code" && b.code) {
			parts.push(b.language || "");
		}
	}
	return parts.join("\n");
}

function extractYouTubeVideoId(url) {
	if (!url || typeof url !== "string") return null;
	const m =
		url.match(/(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([A-Za-z0-9_-]{11})/) ||
		url.match(/^([A-Za-z0-9_-]{11})$/);
	return m ? m[1] : null;
}

function countPatternMatches(text, patterns) {
	if (!text) return 0;
	let total = 0;
	for (const p of patterns) {
		const globalRegex = new RegExp(
			p.source,
			p.flags.includes("g") ? p.flags : p.flags + "g",
		);
		const matches = text.match(globalRegex);
		if (matches) total += matches.length;
	}
	return total;
}

function stripSponsorBoilerplate(text) {
	if (!text) return "";
	return text
		.replace(/Sponsors?:[\s\S]*?(?=Recorded:|\n00:00|$)/gi, "")
		.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s*[-–]?\s*Sponsors?:.*$/gim, "")
		.replace(
			/brought to you by (?:cloudinary|algolia|storyblok|builder\.io|auth0|fauna|supabase)[\s\S]{0,300}/gi,
			"",
		)
		.replace(/Have you already discovered Storyblok\?[\s\S]{0,300}/gi, "");
}

export function inferTagsForDocument(doc, transcript) {
	const existingTags = Array.isArray(doc.tags) ? doc.tags : [];
	const byValue = new Map();

	for (const t of existingTags) {
		const val = (t?.value || t?.label || "").trim().toLowerCase();
		const label = (t?.label || t?.value || "").trim();
		if (val && label) {
			byValue.set(val, {
				_key: t._key || `tag_${val.replace(/[^a-z0-9]/g, "_")}`,
				_type: "tag",
				label,
				value: val,
				score: 100,
			});
		}
	}

	const titleAndSlug = [
		doc.title || "",
		typeof doc.slug === "object" ? doc.slug?.current || "" : doc.slug || "",
		transcript?.title || "",
	].join("\n");

	const ytTagsText = Array.isArray(transcript?.tags)
		? transcript.tags.join("\n")
		: "";

	const excerptAndDesc = stripSponsorBoilerplate(
		[doc.excerpt || "", transcript?.description || ""].join("\n"),
	);

	const bodyText = stripSponsorBoilerplate(extractPortableTextPlain(doc.content));
	const spokenText = stripSponsorBoilerplate(transcript?.fullText || "");

	const scoredCandidates = [];

	for (const entry of TAG_TAXONOMY) {
		if (byValue.has(entry.value)) continue;

		const titleHits = countPatternMatches(titleAndSlug, entry.strongPatterns);
		const ytTagHits = countPatternMatches(ytTagsText, entry.strongPatterns);
		const descHits = countPatternMatches(excerptAndDesc, entry.strongPatterns);
		const bodyHits = countPatternMatches(bodyText, entry.strongPatterns);
		const spokenHits = countPatternMatches(spokenText, entry.strongPatterns);

		const score =
			(titleHits > 0 ? 10 : 0) +
			(ytTagHits > 0 ? 6 : 0) +
			(descHits > 0 ? 5 : 0) +
			Math.min(8, bodyHits * 2) +
			Math.floor(spokenHits / 3);

		if (score >= 5) {
			scoredCandidates.push({
				_key: `tag_${entry.value.replace(/[^a-z0-9]/g, "_")}`,
				_type: "tag",
				label: entry.label,
				value: entry.value,
				score,
			});
		}
	}

	scoredCandidates.sort((a, b) => b.score - a.score);

	for (const cand of scoredCandidates) {
		if (byValue.size >= 8) break;
		byValue.set(cand.value, cand);
	}

	// Ensure WebDev fallback tag if nothing else matched
	if (byValue.size === 0) {
		byValue.set("webdev", {
			_key: "tag_webdev",
			_type: "tag",
			label: "WebDev",
			value: "webdev",
			score: 1,
		});
	}

	return Array.from(byValue.values()).map(({ _key, _type, label, value }) => ({
		_key,
		_type,
		label,
		value,
	}));
}

export async function autoTagAllContent({ dryRun = isDryRun } = {}) {
	console.log(
		`\n=== Running Transcript & Content Auto-Tagger (dataset: ${dataset}, dryRun: ${dryRun}) ===`,
	);

	const docs = await client.fetch(
		`*[_type in ["post", "podcast"] && !(_id in path("drafts.**"))]{
			_id,
			_type,
			title,
			"slug": slug.current,
			excerpt,
			youtube,
			tags,
			transcript,
			sponsor,
			content,
			devto,
			hashnode,
			awsbuilder
		}`,
	);

	const transcripts = await client.fetch(
		`*[_type == "transcript" && !(_id in path("drafts.**"))]{
			_id,
			videoId,
			title,
			description,
			tags,
			topicCategories,
			summary,
			fullText,
			contentRef
		}`,
	);

	console.log(
		`Loaded ${docs.length} content documents and ${transcripts.length} transcripts.`,
	);

	const transcriptById = new Map();
	const transcriptByContentId = new Map();
	const transcriptByVideoId = new Map();

	for (const tr of transcripts) {
		transcriptById.set(tr._id, tr);
		if (tr.contentRef?._ref) {
			transcriptByContentId.set(tr.contentRef._ref, tr);
		}
		if (tr.videoId) {
			transcriptByVideoId.set(tr.videoId, tr);
		}
	}

	let updatedCount = 0;
	let linkedTranscriptCount = 0;
	const tagStats = new Map();
	const awsMatchedDocs = [];

	for (const doc of docs) {
		const ytId = extractYouTubeVideoId(doc.youtube);
		const linkedTranscript =
			(doc.transcript?._ref && transcriptById.get(doc.transcript._ref)) ||
			transcriptByContentId.get(doc._id) ||
			(ytId && transcriptByVideoId.get(ytId)) ||
			null;

		const inferredTags = inferTagsForDocument(doc, linkedTranscript);

		for (const t of inferredTags) {
			tagStats.set(t.label, (tagStats.get(t.label) || 0) + 1);
		}

		if (inferredTags.some((t) => t.value === "aws")) {
			awsMatchedDocs.push({
				_id: doc._id,
				_type: doc._type,
				title: doc.title,
				slug: doc.slug,
				hasSponsor: Array.isArray(doc.sponsor) && doc.sponsor.length > 0,
				hasTranscript: Boolean(linkedTranscript),
				tags: inferredTags.map((t) => t.label),
			});
		}

		const prevValues = (doc.tags || []).map((t) => t.value).join(",");
		const nextValues = inferredTags.map((t) => t.value).join(",");
		const needsTranscriptLink =
			linkedTranscript && doc.transcript?._ref !== linkedTranscript._id;

		if (prevValues !== nextValues || needsTranscriptLink) {
			updatedCount++;
			if (needsTranscriptLink) linkedTranscriptCount++;

			if (!dryRun) {
				const patchObj = { tags: inferredTags };
				if (needsTranscriptLink) {
					patchObj.transcript = {
						_type: "reference",
						_ref: linkedTranscript._id,
					};
				}
				await client
					.patch(doc._id)
					.set(patchObj)
					.commit()
					.catch((err) =>
						console.error(`Failed patching ${doc._id}:`, err.message),
					);
			}
		}
	}

	console.log(`\n=== Auto-Tagging Summary ===`);
	console.log(`Total content docs scanned: ${docs.length}`);
	console.log(`Docs needing tag/transcript updates: ${updatedCount}`);
	console.log(`Docs newly linked to transcripts: ${linkedTranscriptCount}`);
	console.log(
		`AWS-tagged content found: ${awsMatchedDocs.length} (${awsMatchedDocs.filter((d) => !d.hasSponsor).length} unsponsored & eligible for builder.aws.com)`,
	);

	console.log(`\n=== Top Inferred Tags Across Catalog ===`);
	const sortedTags = Array.from(tagStats.entries()).sort((a, b) => b[1] - a[1]);
	for (const [label, count] of sortedTags.slice(0, 35)) {
		console.log(`- ${label}: ${count}`);
	}

	console.log(`\n=== AWS-Tagged Posts & Podcasts ===`);
	for (const item of awsMatchedDocs) {
		console.log(
			`- [${item._type}] ${item.title} (https://codingcat.dev/${item._type}/${item.slug}) | sponsored=${item.hasSponsor} | tags=${item.tags.join(", ")}`,
		);
	}

	return { updatedCount, awsMatchedDocs };
}

if (import.meta.url === `file://${process.argv[1]}`) {
	autoTagAllContent().catch((err) => {
		console.error("Auto-tag error:", err);
		process.exit(1);
	});
}
