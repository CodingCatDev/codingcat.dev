import type { ContentListItem } from "./content";
import { resolveHref } from "./sanity/resolve-href";
import type { CoverImage } from "./sanity/types.gen";
import { matchTopicsForText, type TopicDefinition } from "./topics";
import { youtubeId } from "./youtube";

export interface TagItem {
	label?: string | null;
	value?: string | null;
}

export interface RelatedCandidate extends ContentListItem {
	youtube?: string | null;
	tags?: TagItem[] | null;
}

export interface ExplicitRelatedVideo {
	title?: string | null;
	description?: string | null;
	youtube?: string | null;
	reference?: {
		_id?: string;
		_type?: string;
		title?: string | null;
		slug?: string | null;
		excerpt?: string | null;
		coverImage?: CoverImage | null;
		youtube?: string | null;
	} | null;
}

export interface ResolvedRelatedVideo {
	title: string;
	description: string;
	youtube: string;
	coverImage?: CoverImage | null;
	href?: string;
	contentTypeLabel?: string;
	isExplicit: boolean;
}

const TYPE_BADGE_LABELS: Record<string, string> = {
	post: "Related Blog Post & Video",
	podcast: "Related Podcast Episode",
	course: "Related Course & Video",
	lesson: "Related Course Lesson",
};

function normalizeTagSet(tags?: TagItem[] | null): Set<string> {
	const out = new Set<string>();
	for (const t of tags ?? []) {
		if (t?.value) {
			out.add(t.value.trim().toLowerCase());
		}
		if (t?.label) {
			out.add(t.label.trim().toLowerCase());
		}
	}
	return out;
}

/**
 * Scores a candidate document against the current document's tags, matched
 * topic hubs, and title keywords.
 */
export function scoreCandidateRelevance(
	candidate: RelatedCandidate,
	currentDoc: {
		_id: string;
		_type?: string;
		title?: string | null;
		excerpt?: string | null;
		tags?: TagItem[] | null;
	},
	currentTopics: TopicDefinition[],
): number {
	if (!candidate?._id || candidate._id === currentDoc._id) {
		return -1;
	}

	let score = 0;

	// 1. Exact Sanity tag overlap (+12 per matching tag)
	const currentTags = normalizeTagSet(currentDoc.tags);
	const candTags = normalizeTagSet(candidate.tags);
	for (const tag of currentTags) {
		if (candTags.has(tag)) {
			score += 12;
		}
	}

	// 2. Topic hub overlap from title/excerpt (+10 per shared canonical topic hub)
	const candTopics = matchTopicsForText(candidate.title, candidate.excerpt);
	const currentTopicSlugs = new Set(currentTopics.map((t) => t.slug));
	for (const topic of candTopics) {
		if (currentTopicSlugs.has(topic.slug)) {
			score += 10;
		}
	}

	// 3. Keyword overlap between current tags and candidate title/excerpt (+5 per hit)
	const candHay =
		`${candidate.title ?? ""} ${candidate.excerpt ?? ""}`.toLowerCase();
	for (const tag of currentTags) {
		if (tag.length >= 2 && candHay.includes(tag)) {
			score += 5;
		}
	}

	// 4. Significant title word overlap (+2 per shared technical word >= 4 chars)
	const stopWords = new Set([
		"with",
		"from",
		"that",
		"this",
		"your",
		"what",
		"when",
		"where",
		"which",
		"into",
		"using",
		"build",
		"building",
		"guide",
		"deep",
		"dive",
		"explained",
		"2025",
		"2026",
	]);
	const currentWords = (currentDoc.title ?? "")
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((w) => w.length >= 4 && !stopWords.has(w));
	for (const w of currentWords) {
		if (candHay.includes(w)) {
			score += 2;
		}
	}

	return score;
}

/**
 * Resolves the Related Video Deep Dive for a document:
 * 1. Explicit `relatedVideo` configured on the Sanity document (either a referenced
 *    Sanity document with a YouTube URL or a custom YouTube URL override).
 * 2. Dynamic match from real published Sanity documents (`post`, `podcast`, `course`)
 *    that have a valid `youtube` video ID, ranked by tag + topic relevance.
 */
export function resolveRelatedVideo(
	currentDoc: {
		_id: string;
		_type?: string;
		title?: string | null;
		excerpt?: string | null;
		tags?: TagItem[] | null;
		relatedVideo?: ExplicitRelatedVideo | null;
	},
	candidates: RelatedCandidate[],
	currentTopics: TopicDefinition[] = matchTopicsForText(
		currentDoc.title,
		currentDoc.excerpt,
	),
): ResolvedRelatedVideo | null {
	const explicit = currentDoc.relatedVideo;
	if (explicit) {
		const ref = explicit.reference;
		const ytUrl = (explicit.youtube || ref?.youtube || "").trim();
		if (youtubeId(ytUrl)) {
			const resolvedTitle =
				explicit.title?.trim() ||
				ref?.title?.trim() ||
				"CodingCat.dev Architecture Deep Dive";
			const resolvedDesc =
				explicit.description?.trim() ||
				ref?.excerpt?.trim() ||
				"Watch the full architecture walkthrough and implementation on the @CodingCatDev YouTube channel.";
			const href =
				ref?._type && ref?.slug ? resolveHref(ref._type, ref.slug) : undefined;
			return {
				title: resolvedTitle,
				description: resolvedDesc,
				youtube: ytUrl,
				coverImage: ref?.coverImage ?? null,
				href,
				contentTypeLabel: ref?._type ? TYPE_BADGE_LABELS[ref._type] : undefined,
				isExplicit: true,
			};
		}
	}

	// Dynamic fallback: filter candidates that have a valid YouTube video ID
	const validVideoCandidates = (candidates ?? []).filter(
		(c) =>
			c._id !== currentDoc._id && Boolean(c.youtube && youtubeId(c.youtube)),
	);

	if (validVideoCandidates.length === 0) {
		return null;
	}

	const scored = validVideoCandidates
		.map((c, idx) => ({
			candidate: c,
			score: scoreCandidateRelevance(c, currentDoc, currentTopics),
			recencyTieBreaker: validVideoCandidates.length - idx,
		}))
		.sort((a, b) =>
			b.score !== a.score
				? b.score - a.score
				: b.recencyTieBreaker - a.recencyTieBreaker,
		);

	const best = scored[0].candidate;
	const bestYoutube = best.youtube ?? "";
	const href = resolveHref(best._type, best.slug ?? undefined);

	return {
		title: best.title,
		description:
			best.excerpt ||
			"Watch the full architecture walkthrough and implementation on the @CodingCatDev YouTube channel.",
		youtube: bestYoutube,
		coverImage: best.coverImage ?? null,
		href,
		contentTypeLabel:
			TYPE_BADGE_LABELS[best._type] ?? "Related Video Deep Dive",
		isExplicit: false,
	};
}

/**
 * Resolves the bottom Related Content grid (`limit` items, default 2):
 * 1. Starts with any explicitly curated `relatedContent` references set on the document in Sanity.
 * 2. Fills any remaining slots dynamically by scoring `candidates` by tag/topic relevance
 *    (excluding the current document, any already-selected items, and optionally the featured video doc).
 */
export function resolveRelatedContentList(
	currentDoc: {
		_id: string;
		_type?: string;
		title?: string | null;
		excerpt?: string | null;
		tags?: TagItem[] | null;
		relatedContent?: RelatedCandidate[] | null;
	},
	candidates: RelatedCandidate[],
	options: {
		limit?: number;
		preferSameType?: boolean;
		excludeIds?: string[];
		currentTopics?: TopicDefinition[];
	} = {},
): ContentListItem[] {
	const limit = options.limit ?? 2;
	const currentTopics =
		options.currentTopics ??
		matchTopicsForText(currentDoc.title, currentDoc.excerpt);
	const seenIds = new Set<string>([
		currentDoc._id,
		currentDoc._id.replace(/^drafts\./, ""),
		...(options.excludeIds ?? []),
	]);

	const results: ContentListItem[] = [];

	// 1. Add explicitly curated relatedContent references first
	for (const item of currentDoc.relatedContent ?? []) {
		if (!item?._id || !item.slug) {
			continue;
		}
		const cleanId = item._id.replace(/^drafts\./, "");
		if (seenIds.has(item._id) || seenIds.has(cleanId)) {
			continue;
		}
		seenIds.add(item._id);
		seenIds.add(cleanId);
		results.push(item);
		if (results.length >= limit) {
			return results;
		}
	}

	// 2. Score and rank remaining candidates dynamically
	const scored = (candidates ?? [])
		.filter((c) => {
			if (!c?._id || !c.slug) {
				return false;
			}
			const cleanId = c._id.replace(/^drafts\./, "");
			return !seenIds.has(c._id) && !seenIds.has(cleanId);
		})
		.map((c, idx) => {
			let score = scoreCandidateRelevance(c, currentDoc, currentTopics);
			if (options.preferSameType && c._type === currentDoc._type) {
				score += 3;
			}
			return {
				candidate: c,
				score,
				recencyTieBreaker: candidates.length - idx,
			};
		})
		.sort((a, b) =>
			b.score !== a.score
				? b.score - a.score
				: b.recencyTieBreaker - a.recencyTieBreaker,
		);

	for (const entry of scored) {
		const cleanId = entry.candidate._id.replace(/^drafts\./, "");
		if (seenIds.has(entry.candidate._id) || seenIds.has(cleanId)) {
			continue;
		}
		seenIds.add(entry.candidate._id);
		seenIds.add(cleanId);
		results.push(entry.candidate);
		if (results.length >= limit) {
			break;
		}
	}

	return results;
}
