import { defineQuery } from "groq";
import { baseFieldsNoContent, rssContentFields } from "./shared";

/**
 * The Next app had a single rssQuery taking a $type parameter, which widens the
 * generated result to a union of every document type. Split per type so the
 * feed builders get precise types.
 */
export const rssPostQuery =
	defineQuery(`*[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  ${rssContentFields},
}`);

export const rssPodcastQuery =
	defineQuery(`*[_type == "podcast" && _id != $skip && defined(slug.current)] | order(date desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  ${rssContentFields},
  season,
  episode,
  spotify,
}`);

export const sitemapQuery =
	defineQuery(`*[_type in ["author", "guest", "page", "podcast", "post", "sponsor"] && defined(slug.current)] | order(_type asc) | order(_updatedAt desc) {
  _type,
  _updatedAt,
  "slug": slug.current,
}`);
