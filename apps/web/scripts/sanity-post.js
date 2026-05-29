import { Glob } from "glob";
import matter from "gray-matter";
import fs from "fs";
import { createClient } from "@sanity/client";
import { micromark } from "micromark";
import { htmlToBlocks, normalizeBlock, randomKey } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	useCdn: false,
	token: process.env.SANITY_API_READ_TOKEN,
});

import { v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
	secure: true,
	cloud_name: "ajonp",
	api_key: "none",
	api_secret: "none",
});

const TYPE = "podcast";
const BASE = `../src/routes/(content-single)/(non-course)/${TYPE}/`;
const g = new Glob(`${BASE}*/*.md`, {});

const delay = async (ms) => new Promise((res) => setTimeout(res, ms));
const addArticle = async (post) => {
	return client.create(post, { dryRun: false });
};

const findAuthors = async () => {
	return client.fetch(
		`*[_type == "author"]{
			_id,
			slug
		  }`,
	);
};

const findGuests = async () => {
	return client.fetch(
		`*[_type == "guest"]{
			_id,
			slug
		  }`,
	);
};

const findSponsors = async () => {
	return client.fetch(
		`*[_type == "sponsor"]{
			_id,
			slug
		  }`,
	);
};

console.log("Fetching Data");
const AUTHORS = await findAuthors();
const GUESTS = await findGuests();
const SPONSORS = await findSponsors();
console.log("Data Fetched");

const findPublic = (url) => {
	const split = url.split("/");
	let record = split.findIndex((str) => str === "main-codingcatdev-photo");
	if (record == -1) {
		record = split.findIndex((str) => str === "ccd-cloudinary");
	}
	if (record == -1) {
		record = split.findIndex((str) => str === "ajonp-ajonp-com");
	}
	if (record == -1) {
		record = split.length - 1;
	}
	let id = "";
	for (let i = record; i < split.length; i++) {
		if (i !== split.length - 1) {
			id += split[i];
			id += "/";
		} else {
			const lastSplit = split[i].replace(
				/\.(jpe?g|png|gif|bmp|mp4|webm|ogg|avi)$/i,
				"",
			);
			id += lastSplit;
		}
	}
	return decodeURI(id);
};

const getImage = async (url, video) => {
	if (video)
		return cloudinary.api.resource(findPublic(url), { resource_type: "video" });
	return cloudinary.api.resource(findPublic(url));
};

const defaultSchema = Schema.compile({
	name: "myBlog",
	types: [
		{
			type: "object",
			name: "blogPost",
			fields: [
				{
					title: "content",
					name: "content",
					type: "array",
					of: [
						{ type: "block" },
						{ type: "code" },
						{ type: "cloudinary.asset" },
					],
				},
			],
		},
		{
			type: "object",
			name: "code",
			code: "string",
		},
		{
			type: "object",
			name: "cloudinary.asset",
		},
	],
});
const blockContentType = defaultSchema
	.get("blogPost")
	.fields.find((field) => field.name === "content").type;

function isPreformattedText(el) {
	return el && el.children && el.tagName && el.tagName.toLowerCase() === "pre";
}

function getChildNodes(el, codeElement, tag) {
	return codeElement && codeElement.tagName.toLowerCase() === tag
		? codeElement.childNodes
		: el.childNodes;
}

function extractTextFromNodes(childNodes) {
	return Array.from(childNodes)
		.map((node) => node.textContent || "")
		.join("");
}

function getLanguageAlias(codeElement) {
	return codeElement.className.replace("language-", "");
}

function mapLanguageAliasToActualLanguage(languageAlias) {
	const languageMapping = {
		js: "javascript",
		ts: "typescript",
	};
	return languageMapping[languageAlias] || languageAlias;
}

function deserializeCodeBlockElement(el, next, block) {
	if (!isPreformattedText(el)) return undefined;

	const codeElement = el.children[0];
	const childNodes = getChildNodes(el, codeElement, "code");
	const codeText = extractTextFromNodes(childNodes);
	const language = mapLanguageAliasToActualLanguage(
		getLanguageAlias(codeElement),
	);

	return block({
		_type: "code",
		code: codeText,
		language,
	});
}

function deserializeImgBlockElement(el, next, block) {
	const tag = el && el.tagName && el.tagName.toLowerCase() === "p";
	if (!tag) return undefined;
	const child = el?.children[0];
	if (!child) return undefined;
	const img =
		child.tagName && child.tagName.toLowerCase() === "img" ? child : false;
	if (!img) return undefined;

	const partialBlock = {
		_type: "cloudinary.asset",
		src: img.src,
	};

	return block(partialBlock);
}

async function replaceBlock(blocks) {
	const newBlocks = [];
	for (let block of blocks) {
		if (block._type === "cloudinary.asset") {
			const cld = await getImage(block.src);
			block = normalizeBlock({
				_type: "cloudinary.asset",
				...cld,
			});
		} else if (block?.markDefs?.find((m) => m._type === "link")) {
			block.markDefs = block.markDefs.map((m) =>
				m._type === "link" ? { ...m, blank: true } : m,
			);
		}
		newBlocks.push(block);
	}
	return newBlocks;
}

for await (const file of g) {
	const mdFile = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
	const { data, content } = await matter(mdFile); // data has frontmatter, code is html
	const fm = data;
	if (!fm) continue;
	// TODO: We might need to add a check on cononical if this page is already in dev.to
	if (
		fm?.title &&
		fm?.cover
		// fm.title === `The Myth of 'Just Press Record' in Podcasting`
		// fm?.published === 'published' &&
		// new Date(fm?.start) < new Date()
	) {
		console.log("Adding", { slug: file.split("/").at(-2) });

		const blocks = htmlToBlocks(micromark(content), blockContentType, {
			parseHtml: (html) => new JSDOM(html).window.document,
			rules: [
				{ deserialize: deserializeCodeBlockElement },
				{ deserialize: deserializeImgBlockElement },
			],
		});

		const core = {
			_createdAt: new Date(fm.start).toISOString(),
			_type: TYPE,
			_updatedAt: fm?.updated
				? new Date(fm.updated).toISOString()
				: new Date(fm.start).toISOString(),
			slug: { current: file.split("/").at(-2), _type: "slug" },
			title: fm.title,
			excerpt: fm.excerpt,
			content: await replaceBlock(blocks),
		};

		if (fm?.authors) {
			const author = [];
			fm.authors.map((o) => {
				const authorRef = AUTHORS.find((a) => a.slug.current === o);
				author.push({
					_type: "reference",
					_key: randomKey(12),
					_ref: authorRef._id,
				});
			});
			core.author = author;
		}
		if (fm?.episode) {
			core.episode = fm?.episode;
		}
		if (fm?.season) {
			core.season = fm?.season;
		}
		if (fm?.podcast) {
			if (fm.podcast === "code-with-coding-cat") {
				core.podcastType = {
					_type: "reference",
					_ref: "cf97c2c5-bf45-4f4f-a72e-3b25fb5ea13d",
				};
			} else {
				core.podcastType = {
					_type: "reference",
					_ref: "658c8b83-3072-45f3-9995-8588d8242a6f",
				};
			}
		}
		if (fm?.cover) {
			const image = await getImage(fm.cover);
			core.coverImage = image;
		}
		if (fm?.devto) {
			core.devto = fm?.devto;
		}
		if (fm?.guests) {
			const guest = [];
			fm.guests.map((o) => {
				const authorRef = GUESTS.find((a) => a.slug.current === o);
				guest.push({
					_type: "reference",
					_key: randomKey(12),
					_ref: authorRef._id,
				});
			});
			core.guest = guest;
		}
		if (fm?.hashnode) {
			core.hashnode = fm?.hashnode;
		}
		if (fm?.locked) {
			core.locked = fm?.locked;
		}
		if (fm?.picks) {
			const picks = [];
			fm.picks.map((o) => {
				const authorRef = [...AUTHORS, ...GUESTS].find(
					(a) => a.slug.current === o.author,
				);
				picks.push({
					_key: randomKey(12),
					user: {
						_type: "reference",
						_ref: authorRef._id,
					},
					name: o.name,
					site: o.site,
				});
			});
			core.pick = picks;
		}
		if (fm?.recording_date) {
			core.recordingDate = new Date(fm.recording_date).toISOString();
		}
		if (fm?.sponsors) {
			const sponsor = [];
			fm.sponsors.map((o) => {
				const authorRef = SPONSORS.find((a) => a.slug.current === o);
				sponsor.push({
					_type: "reference",
					_key: randomKey(12),
					_ref: authorRef._id,
				});
			});
			core.sponsor = sponsor;
		}
		if (fm?.spotify) {
			core.spotify = fm?.spotify;
		}
		if (fm?.videoCloudinary) {
			const image = await getImage(fm.videoCloudinary, true);
			core.videoCloudinary = image;
		}
		if (fm?.youtube) {
			core.youtube = fm.youtube;
		}
		// console.log(JSON.stringify(await replacBlock(blocks)));
		const response = await addArticle(core);
		console.log("added", response._id);
	}
}
