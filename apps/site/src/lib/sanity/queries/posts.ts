import { defineQuery } from "groq";
import { baseFieldsNoContent, contentFields, personRefFields } from "./shared";

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
    ${personRefFields}
  }
}`);

/** Paginated list. $offset/$limit are GROQ slice bounds: [$offset...$limit]. */
export const morePostQuery =
	defineQuery(`*[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
  ${baseFieldsNoContent},
  author[]->{
    ${personRefFields}
  }
}`);

/**
 * Pool of recent published Posts, Podcasts, and Courses used to dynamically
 * score and match the best Related Video Deep Dive and Related Content cards
 * by tags and topic keywords whenever explicit references are not set.
 */
export const relatedCandidatesQuery =
	defineQuery(`*[_type in ["post", "podcast", "course"] && _id != $skip && !(_id in path("drafts.**")) && defined(slug.current) && coalesce(archived, false) != true] | order(date desc, _updatedAt desc) [0...40] {
  ${baseFieldsNoContent},
  youtube,
  tags[]{
    label,
    value
  },
  author[]->{
    ${personRefFields}
  },
  guest[]->{
    ${personRefFields}
  }
}`);
