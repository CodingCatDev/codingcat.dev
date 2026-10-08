import { defineQuery } from "groq";

/**
 * Hybrid semantic search utilizing Sanity dataset embeddings (text::semanticSimilarity)
 * combined with heavy boost() scoring on title, name, and excerpt to guarantee
 * direct title/name matches strictly outrank long transcript matches.
 */
export const semanticSearchQuery = defineQuery(`
  *[_type in ["post", "podcast", "author", "guest"] && defined(slug.current) && ($type == null || $type == "all" || _type == $type)]
  | score(
      boost(lower(coalesce(title, name)) == lower($searchTerm), 100),
      boost(coalesce(title, name) match $searchTerm + "*", 50),
      boost(coalesce(title, name) match $searchTerm, 30),
      boost(_type in ["author", "guest"] && coalesce(name, title) match $searchTerm + "*", 20),
      boost(excerpt match $searchTerm + "*", 8),
      boost(transcript->summary match $searchTerm + "*", 3),
      boost(transcript->fullText match $searchTerm + "*", 1),
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
    coalesce(title, name) match $searchTerm + "*" ||
    coalesce(title, name) match $searchTerm ||
    excerpt match $searchTerm + "*" ||
    transcript->summary match $searchTerm + "*" ||
    transcript->fullText match $searchTerm + "*"
  )]
  | score(
      boost(lower(coalesce(title, name)) == lower($searchTerm), 100),
      boost(coalesce(title, name) match $searchTerm + "*", 50),
      boost(coalesce(title, name) match $searchTerm, 30),
      boost(_type in ["author", "guest"] && coalesce(name, title) match $searchTerm + "*", 20),
      boost(excerpt match $searchTerm + "*", 8),
      boost(transcript->summary match $searchTerm + "*", 3),
      boost(transcript->fullText match $searchTerm + "*", 1)
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
