import { Glob } from "glob";
import matter from "gray-matter";
import fs from "fs";
import { createClient } from "@sanity/client";
import { micromark } from "micromark";
import { htmlToBlocks } from "@sanity/block-tools";
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
});

const TYPE = "sponsor";
const BASE = `../src/routes/(content-single)/(non-course)/${TYPE}/`;
const g = new Glob(`${BASE}**/*.md`, {});

const delay = async (ms) => new Promise((res) => setTimeout(res, ms));
const addArticle = async (post) => {
  return client.create(post, { dryRun: false });
};

const findPublic = (url) => {
  const split = url.split("/");
  const record = split.findIndex((str) => str === "main-codingcatdev-photo");
  let id = "";
  for (let i = record; i < split.length; i++) {
    if (i !== split.length - 1) {
      id += split[i];
      id += "/";
    } else {
      const lastSplit = split[i].replace(/\.[^/.]+$/, "");
      id += lastSplit;
    }
  }
  return id;
};

const getImage = async (url) => {
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
          of: [{ type: "block" }],
        },
      ],
    },
  ],
});
const blockContentType = defaultSchema
  .get("blogPost")
  .fields.find((field) => field.name === "content").type;

for await (const file of g) {
  const mdFile = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
  const { data, content } = await matter(mdFile); // data has frontmatter, code is html
  const fm = data;
  if (!fm) continue;
  // TODO: We might need to add a check on cononical if this page is already in dev.to
  if (
    fm?.slug &&
    fm?.name &&
    fm?.cover &&
    // fm.slug === 'alex-patterson' &&
    fm?.published === "published" &&
    new Date(fm?.start) < new Date()
  ) {
    console.log("Adding", { slug: fm?.slug });
    const core = {
      _createdAt: new Date(fm.start).toISOString(),
      _type: TYPE,
      _updatedAt: fm?.updated
        ? new Date(fm.updated).toISOString()
        : new Date(fm.start).toISOString(),
      slug: { current: fm.slug, _type: "slug" },
      title: fm.name,
      excerpt: fm.excerpt,
      content: htmlToBlocks(micromark(content), blockContentType, {
        parseHtml: (html) => new JSDOM(html).window.document,
      }),
    };
    if (fm?.socials) {
      core.socials = fm?.socials;
    }
    if (fm?.cover) {
      const image = await getImage(fm.cover);
      console.log(image);
      core.coverImage = image;
    }
    if (fm?.url) {
      core.url = fm.url;
    }

    const response = await addArticle(core);
    console.log("added", response._id);
  }
}
