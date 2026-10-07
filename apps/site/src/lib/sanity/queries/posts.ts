import { defineQuery } from "groq";
import { baseFieldsNoContent, contentFields } from "./shared";

/**
 * Counts are split per type rather than taking a $type parameter. A
 * $type-parameterised count makes TypeGen widen the result to a union of every
 * document type, which defeats the point of generating types at all.
 */
export const postCountQuery = defineQuery(
	`count(*[_type == "post" && defined(slug.current)])`,
);

export const postQuery =
	defineQuery(`*[_type == "post" && slug.current == $slug] [0] {
  ${baseFieldsNoContent},
  ${contentFields}
}`);

/** Newest post — the featured slot on /blog. */
export const latestPostQuery =
	defineQuery(`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
  ${baseFieldsNoContent},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`);

/** Paginated list. $offset/$limit are GROQ slice bounds: [$offset...$limit]. */
export const morePostQuery =
	defineQuery(`*[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  author[]->{
    ...,
    "title": coalesce(title, "Anonymous"),
    "slug": slug.current,
  }
}`);
