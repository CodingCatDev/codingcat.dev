import { defineQuery } from "groq";

/**
 * Hybrid semantic search utilizing Sanity dataset embeddings (text::semanticSimilarity)
 * combined with boost() scoring on title and excerpt.
 */
export const semanticSearchQuery = defineQuery(`
  *[_type in ["post", "podcast", "author", "guest"] && defined(slug.current) && ($type == null || $type == "all" || _type == $type)]
  | score(
      boost(title match $searchTerm + "*", 5),
      boost(excerpt match $searchTerm + "*", 2),
      text::semanticSimilarity($searchTerm)
    )
  | order(_score desc)[0...24] {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    date,
    _score
  }
`);

/**
 * Fallback text-matching search query if dataset embeddings are pending or unconfigured.
 */
export const textSearchFallbackQuery = defineQuery(`
  *[_type in ["post", "podcast", "author", "guest"] && defined(slug.current) && ($type == null || $type == "all" || _type == $type) && (
    title match $searchTerm + "*" ||
    excerpt match $searchTerm + "*"
  )]
  | score(
      boost(title match $searchTerm + "*", 5),
      boost(excerpt match $searchTerm + "*", 2)
    )
  | order(_score desc)[0...24] {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    date,
    _score
  }
`);
