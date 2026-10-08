import { defineQuery } from "groq";

/**
 * Hybrid semantic search utilizing Sanity dataset embeddings (text::semanticSimilarity)
 * combined with heavy boost() scoring on title, name, and excerpt to guarantee
 * direct title/name matches strictly outrank long transcript matches.
 */
export const semanticSearchQuery = defineQuery(`
  *[_type in ["post", "podcast", "author", "guest"] && defined(slug.current) && ($type == null || $type == "all" || _type == $type)]
  | score(
      boost(title == $searchTerm, 100),
      boost(name == $searchTerm, 100),
      boost(title match $searchTerm + "*", 50),
      boost(name match $searchTerm + "*", 50),
      boost(title match $searchTerm, 30),
      boost(name match $searchTerm, 30),
      boost(excerpt match $searchTerm + "*", 8),
      text::semanticSimilarity($searchTerm)
    )
  | order(_score desc)[0...24] {
    _id,
    _type,
    "title": coalesce(title, name, "Untitled"),
    "slug": slug.current,
    "excerpt": coalesce(excerpt, transcript->summary),
    "transcriptSummary": transcript->summary,
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
    name match $searchTerm + "*" ||
    excerpt match $searchTerm + "*" ||
    transcript->summary match $searchTerm + "*" ||
    transcript->fullText match $searchTerm + "*"
  )]
  | score(
      boost(title == $searchTerm, 100),
      boost(name == $searchTerm, 100),
      boost(title match $searchTerm + "*", 50),
      boost(name match $searchTerm + "*", 50),
      boost(title match $searchTerm, 30),
      boost(name match $searchTerm, 30),
      boost(excerpt match $searchTerm + "*", 8)
    )
  | order(_score desc)[0...24] {
    _id,
    _type,
    "title": coalesce(title, name, "Untitled"),
    "slug": slug.current,
    "excerpt": coalesce(excerpt, transcript->summary),
    "transcriptSummary": transcript->summary,
    coverImage,
    date,
    _score
  }
`);
