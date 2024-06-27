import { Feed, type Author as FeedAuthor } from "feed";
import { sanityFetch } from "@/sanity/lib/fetch";
import { RssQueryResult } from "@/sanity.types";
import { rssQuery } from "@/sanity/lib/queries";
import { toHTML } from "@portabletext/to-html";

const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = productionDomain
  ? `https://${productionDomain}`
  : "https://codingcat.dev";

export async function buildFeed(params: {
  type: string;
  skip?: string;
  limit?: number;
  offset?: number;
}) {
  const data = await sanityFetch<RssQueryResult>({
    query: rssQuery,
    params: {
      type: params.type,
      skip: params.skip || "none",
      limit: params.limit || 10000,
      offset: params.offset || 0,
    },
  });

  const feed = new Feed({
    title: `${site} - ${params.type} feed`,
    description: `${site} - ${params.type} feed`,
    id: `${site}`,
    link: `${site}`,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `https://media.codingcat.dev/image/upload/f_png,c_thumb,g_face,w_1200,h_630/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png`,
    favicon: `${site}/favicon.ico`,
    copyright: `All rights reserved 2021, ${site}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${site}/blog/rss.xml`,
    },
    author: {
      name: "Alex Patterson",
      email: "alex@codingcat.dev",
      link: `${site}`,
    },
  });

  for (const item of data) {
    feed.addItem({
      title: item.title || "",
      content: item.content ? toHTML(item.content as any) : "",
      link: `${site}/${item._type}/${item.slug}`,
      description: `${item.excerpt}`,
      image: item.coverImage?.secure_url || feed.items.at(0)?.image,
      date: item.date ? new Date(item.date) : new Date(),
      id: item._id,
      author: item.author
        ? item.author.map((a) => ({
            name: a.title,
            link: `${site}/author/${a.slug}`,
          }))
        : [
            {
              name: "Alex Patterson",
              email: "alex@codingcat.dev",
              link: `${site}/author/alex-patterson`,
            },
          ],
    });
  }
  return feed;
}
