import { defineQuery } from "groq";

/**
 * Hybrid semantic search utilizing Sanity dataset embeddings (text::semanticSimilarity)
 * combined with heavy boost() scoring on title, name, and excerpt to guarantee
 * direct title/name matches strictly outrank long transcript matches.
 */
export const semanticSearchQuery = defineQuery(`
  *[
    _type in ["post", "podcast", "course", "lesson", "transcript", "author", "guest", "sponsor", "newsletter"] &&
    (defined(slug.current) || _type == "transcript") &&
    coalesce(archived, false) != true &&
    (_type != "transcript" || !defined(contentRef) || contentRef->_type in ["post", "podcast", "course", "lesson"]) &&
    (
      $type == null ||
      $type == "all" ||
      ($type == "youtube" && (_type == "transcript" || defined(youtube) || defined(listenLinks.youtube) || defined(transcript->youtubeId))) ||
      _type == $type
    )
  ]
  | score(
      boost(title == $searchTerm, 100),
      boost(name == $searchTerm, 100),
      boost(title match $searchTerm + "*", 50),
      boost(name match $searchTerm + "*", 50),
      boost(title match $searchTerm, 30),
      boost(name match $searchTerm, 30),
      boost(excerpt match $searchTerm + "*", 8),
      boost(summary match $searchTerm + "*", 8),
      boost(description match $searchTerm + "*", 6),
      text::semanticSimilarity($searchTerm)
    )
  | order(_score desc)[0...28] {
    _id,
    _type,
    "title": coalesce(title, name, "Untitled"),
    "slug": coalesce(slug.current, contentRef->slug.current, youtubeId),
    "courseSlug": select(
      _type == "lesson" => *[_type == "course" && references(^._id)][0].slug.current,
      contentRef->_type == "lesson" => *[_type == "course" && references(^.contentRef._ref)][0].slug.current,
      null
    ),
    "parentType": contentRef->_type,
    "parentSlug": contentRef->slug.current,
    "excerpt": coalesce(excerpt, summary, description, transcript->summary),
    "transcriptSummary": coalesce(summary, transcript->summary),
    "youtube": coalesce(youtubeUrl, youtube, listenLinks.youtube, transcript->youtubeUrl, contentRef->youtube),
    "youtubeId": coalesce(youtubeId, transcript->youtubeId),
    "duration": coalesce(duration, transcript->duration),
    "durationSeconds": coalesce(durationSeconds, transcript->durationSeconds),
    "viewCount": coalesce(statistics.viewCount, statistics.youtube.viewCount, transcript->statistics.viewCount),
    listenLinks,
    "spotifyLink": spotify.link,
    coverImage,
    "date": coalesce(date, publishedAt, _createdAt),
    _score
  }
`);

/**
 * Fallback text-matching search query if dataset embeddings are pending or unconfigured.
 */
export const textSearchFallbackQuery = defineQuery(`
  *[
    _type in ["post", "podcast", "course", "lesson", "transcript", "author", "guest", "sponsor", "newsletter"] &&
    (defined(slug.current) || _type == "transcript") &&
    coalesce(archived, false) != true &&
    (_type != "transcript" || !defined(contentRef) || contentRef->_type in ["post", "podcast", "course", "lesson"]) &&
    (
      $type == null ||
      $type == "all" ||
      ($type == "youtube" && (_type == "transcript" || defined(youtube) || defined(listenLinks.youtube) || defined(transcript->youtubeId))) ||
      _type == $type
    ) && (
      title match $searchTerm + "*" ||
      name match $searchTerm + "*" ||
      excerpt match $searchTerm + "*" ||
      summary match $searchTerm + "*" ||
      description match $searchTerm + "*" ||
      fullText match $searchTerm + "*" ||
      transcript->summary match $searchTerm + "*" ||
      transcript->fullText match $searchTerm + "*"
    )
  ]
  | score(
      boost(title == $searchTerm, 100),
      boost(name == $searchTerm, 100),
      boost(title match $searchTerm + "*", 50),
      boost(name match $searchTerm + "*", 50),
      boost(title match $searchTerm, 30),
      boost(name match $searchTerm, 30),
      boost(excerpt match $searchTerm + "*", 8),
      boost(summary match $searchTerm + "*", 8),
      boost(description match $searchTerm + "*", 6)
    )
  | order(_score desc)[0...28] {
    _id,
    _type,
    "title": coalesce(title, name, "Untitled"),
    "slug": coalesce(slug.current, contentRef->slug.current, youtubeId),
    "courseSlug": select(
      _type == "lesson" => *[_type == "course" && references(^._id)][0].slug.current,
      contentRef->_type == "lesson" => *[_type == "course" && references(^.contentRef._ref)][0].slug.current,
      null
    ),
    "parentType": contentRef->_type,
    "parentSlug": contentRef->slug.current,
    "excerpt": coalesce(excerpt, summary, description, transcript->summary),
    "transcriptSummary": coalesce(summary, transcript->summary),
    "youtube": coalesce(youtubeUrl, youtube, listenLinks.youtube, transcript->youtubeUrl, contentRef->youtube),
    "youtubeId": coalesce(youtubeId, transcript->youtubeId),
    "duration": coalesce(duration, transcript->duration),
    "durationSeconds": coalesce(durationSeconds, transcript->durationSeconds),
    "viewCount": coalesce(statistics.viewCount, statistics.youtube.viewCount, transcript->statistics.viewCount),
    listenLinks,
    "spotifyLink": spotify.link,
    coverImage,
    "date": coalesce(date, publishedAt, _createdAt),
    _score
  }
`);
