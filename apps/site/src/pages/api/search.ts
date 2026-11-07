import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "@/lib/sanity/queries";
import { resolveHref } from "@/lib/sanity/resolve-href";
import { youtubeId } from "@/lib/youtube";
import {
	CLAIRIC_MODEL_ID,
	type ClairicExtractedParameters,
	extractIntentWithClairic,
} from "./chat";

export interface SearchResultItem {
	id: string;
	type:
		| "post"
		| "podcast"
		| "course"
		| "lesson"
		| "transcript"
		| "youtube"
		| "author"
		| "guest"
		| "sponsor"
		| "newsletter"
		| string;
	title: string;
	slug: string;
	href: string;
	excerpt?: string;
	date?: string;
	score?: number;
	youtubeUrl?: string;
	youtubeId?: string;
	thumbnailUrl?: string;
	duration?: string;
	viewCount?: number;
}

function formatDurationLabel(
	rawDuration?: string | null,
	durationSeconds?: number | null,
): string | undefined {
	if (typeof durationSeconds === "number" && durationSeconds > 0) {
		const hrs = Math.floor(durationSeconds / 3600);
		const mins = Math.floor((durationSeconds % 3600) / 60);
		const secs = Math.floor(durationSeconds % 60);
		if (hrs > 0) {
			return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
		}
		return `${mins}:${String(secs).padStart(2, "0")}`;
	}
	if (!rawDuration || typeof rawDuration !== "string") {
		return undefined;
	}
	const trimmed = rawDuration.trim();
	const isoMatch = trimmed.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
	if (isoMatch) {
		const hrs = Number(isoMatch[1] || 0);
		const mins = Number(isoMatch[2] || 0);
		const secs = Number(isoMatch[3] || 0);
		if (hrs > 0) {
			return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
		}
		return `${mins}:${String(secs).padStart(2, "0")}`;
	}
	return trimmed || undefined;
}

export interface SearchResponse {
	query: string;
	type?: string;
	total: number;
	hits: SearchResultItem[];
	semantic: boolean;
	extraction?: ClairicExtractedParameters & { model: string };
}

export const GET: APIRoute = async ({ url, locals }) => {
	const query = url.searchParams.get("q")?.trim() ?? "";
	const filterType = url.searchParams.get("type")?.trim() || "all";

	if (!query || query.length < 2) {
		const emptyResponse: SearchResponse = {
			query,
			type: filterType,
			total: 0,
			hits: [],
			semantic: false,
		};
		return new Response(JSON.stringify(emptyResponse), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=60, s-maxage=300",
			},
		});
	}

	const cfEnv = env as unknown as Record<string, unknown> | undefined;
	const extracted = await extractIntentWithClairic(query, cfEnv?.AI);
	const rawEffectiveType =
		filterType !== "all"
			? filterType
			: extracted?.contentType && extracted.contentType !== "all"
				? extracted.contentType
				: null;
	const effectiveType =
		rawEffectiveType === "transcript" ? "youtube" : rawEffectiveType;
	const effectiveSearchTerm = extracted?.searchQuery || query;

	const params = {
		searchTerm: effectiveSearchTerm,
		type: effectiveType,
	};

	let rawHits: any[] = [];
	let isSemantic = false;

	// 0. If Clairic extracted a 'recent_content' or 'top_videos' intent, fetch directly
	if (extracted?.intent === "recent_content") {
		try {
			if (effectiveType === "youtube") {
				const recentYoutube = await locals.sanity.fetchPublished(
					`*[_type == "transcript" && (!defined(contentRef) || contentRef->_type in ["post", "podcast", "course", "lesson"])] | order(coalesce(publishedAt, _createdAt) desc)[0...20]{
						_id,
						_type,
						title,
						"slug": coalesce(contentRef->slug.current, youtubeId),
						"courseSlug": select(contentRef->_type == "lesson" => *[_type == "course" && references(^.contentRef._ref)][0].slug.current, null),
						"parentType": contentRef->_type,
						"parentSlug": contentRef->slug.current,
						"excerpt": coalesce(summary, description),
						"youtube": youtubeUrl,
						youtubeId,
						duration,
						durationSeconds,
						"viewCount": statistics.viewCount,
						"date": coalesce(publishedAt, _createdAt)
					}`,
					{},
				);
				if (Array.isArray(recentYoutube) && recentYoutube.length > 0) {
					rawHits = recentYoutube;
					isSemantic = true;
				}
			} else {
				const recentTypes =
					effectiveType === "podcast"
						? ["podcast"]
						: effectiveType === "post"
							? ["post"]
							: effectiveType === "course"
								? ["course"]
								: effectiveType === "lesson"
									? ["lesson"]
									: effectiveType === "newsletter"
										? ["newsletter"]
										: effectiveType === "sponsor"
											? ["sponsor"]
											: ["course", "podcast", "post", "newsletter"];
				const recentResult = await locals.sanity.fetchPublished(
					`*[_type in $types && defined(slug.current) && coalesce(archived, false) != true] | order(date desc, _createdAt desc)[0...20]{
						_id,
						_type,
						title,
						"slug": slug.current,
						"courseSlug": select(_type == "lesson" => *[_type == "course" && references(^._id)][0].slug.current, null),
						"excerpt": coalesce(excerpt, transcript->summary),
						"youtube": coalesce(youtube, listenLinks.youtube, transcript->youtubeUrl),
						"youtubeId": transcript->youtubeId,
						"duration": transcript->duration,
						"durationSeconds": transcript->durationSeconds,
						"viewCount": coalesce(statistics.youtube.viewCount, transcript->statistics.viewCount),
						date
					}`,
					{ types: recentTypes },
				);
				if (Array.isArray(recentResult) && recentResult.length > 0) {
					rawHits = recentResult;
					isSemantic = true;
				}
			}
		} catch {}
	} else if (extracted?.intent === "top_videos") {
		try {
			const topVideoResult = await locals.sanity.fetchPublished(
				`*[_type in ["podcast", "post", "course", "lesson", "transcript"] && (defined(slug.current) || _type == "transcript") && (defined(youtube) || defined(youtubeUrl)) && (_type != "transcript" || !defined(contentRef) || contentRef->_type in ["post", "podcast", "course", "lesson"])] | order(coalesce(statistics.viewCount, statistics.youtube.viewCount, transcript->statistics.viewCount, 0) desc, coalesce(date, publishedAt, _createdAt) desc)[0...20]{
					_id,
					_type,
					title,
					"slug": coalesce(slug.current, contentRef->slug.current, youtubeId),
					"courseSlug": select(
						_type == "lesson" => *[_type == "course" && references(^._id)][0].slug.current,
						contentRef->_type == "lesson" => *[_type == "course" && references(^.contentRef._ref)][0].slug.current,
						null
					),
					"parentType": contentRef->_type,
					"parentSlug": contentRef->slug.current,
					"excerpt": coalesce(excerpt, summary, description),
					"youtube": coalesce(youtubeUrl, youtube, listenLinks.youtube, transcript->youtubeUrl),
					"youtubeId": coalesce(youtubeId, transcript->youtubeId),
					"duration": coalesce(duration, transcript->duration),
					"durationSeconds": coalesce(durationSeconds, transcript->durationSeconds),
					"viewCount": coalesce(statistics.viewCount, statistics.youtube.viewCount, transcript->statistics.viewCount),
					"date": coalesce(date, publishedAt, _createdAt)
				}`,
				{},
			);
			if (Array.isArray(topVideoResult) && topVideoResult.length > 0) {
				rawHits = topVideoResult;
				isSemantic = true;
			}
		} catch {}
	}

	// 1. Attempt Sanity native dataset embeddings semantic search
	if (rawHits.length === 0) {
		try {
			const result = await locals.sanity.fetchPublished(
				semanticSearchQuery,
				params,
			);
			if (Array.isArray(result)) {
				rawHits = result;
				isSemantic = true;
			}
		} catch (semanticError) {
			// Log debug info and fall back to token-matching GROQ search
			console.warn(
				"[Sanity Search] Semantic search unavailable or embeddings pending, falling back to text match:",
				semanticError instanceof Error ? semanticError.message : semanticError,
			);
		}
	}

	// 2. If semantic query errored or yielded empty, try the text-match query
	if (!isSemantic || rawHits.length === 0) {
		try {
			const fallbackResult = await locals.sanity.fetchPublished(
				textSearchFallbackQuery,
				params,
			);
			if (Array.isArray(fallbackResult) && fallbackResult.length > 0) {
				rawHits = fallbackResult;
			} else if (effectiveSearchTerm !== query) {
				const rawFallback = await locals.sanity.fetchPublished(
					textSearchFallbackQuery,
					{
						searchTerm: query,
						type: filterType === "all" ? null : filterType,
					},
				);
				if (Array.isArray(rawFallback)) {
					rawHits = rawFallback;
				}
			}
		} catch (fallbackError) {
			console.error("[Sanity Search] Search query failed:", fallbackError);
			return new Response(
				JSON.stringify({
					query,
					type: filterType,
					total: 0,
					hits: [],
					semantic: false,
					error: "Search failed to query content index",
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	}

	// Format hits cleanly for clients and deduplicate parent + transcript pairs
	const mappedHits: SearchResultItem[] = rawHits
		.filter((item) => item && (item.slug || item.youtubeId || item.youtube))
		.map((item) => {
			const rawType = item._type || "post";
			const parentType =
				typeof item.parentType === "string" ? item.parentType : undefined;
			const slug = item.slug || item.parentSlug || item.youtubeId || "";
			const ytId =
				(typeof item.youtubeId === "string" && item.youtubeId) ||
				youtubeId(item.youtube);
			const youtubeUrl =
				item.youtube ||
				(ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined);
			const thumbnailUrl = ytId
				? `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`
				: undefined;
			const duration = formatDurationLabel(
				item.duration,
				typeof item.durationSeconds === "number"
					? item.durationSeconds
					: undefined,
			);
			const viewCount =
				typeof item.viewCount === "number" ? item.viewCount : undefined;

			const routeType =
				rawType === "transcript" && parentType ? parentType : rawType;
			const href =
				routeType === "lesson" && item.courseSlug && slug
					? `/course/${item.courseSlug}/lesson/${slug}`
					: routeType === "lesson"
						? "/courses"
						: routeType === "transcript"
							? youtubeUrl || "https://www.youtube.com/@CodingCatDev"
							: resolveHref(routeType, slug) ||
								(slug ? `/${routeType}/${slug}` : youtubeUrl || "/");

			const displayType = rawType === "transcript" ? "youtube" : rawType;

			return {
				id: item._id,
				type: displayType,
				title: item.title || item.name || "Untitled",
				slug,
				href,
				excerpt: item.excerpt || undefined,
				date: item.date || undefined,
				score: typeof item._score === "number" ? item._score : undefined,
				...(youtubeUrl ? { youtubeUrl } : {}),
				...(ytId ? { youtubeId: ytId } : {}),
				...(thumbnailUrl ? { thumbnailUrl } : {}),
				...(duration ? { duration } : {}),
				...(viewCount !== undefined ? { viewCount } : {}),
			};
		});

	const deduplicatedMap = new Map<string, SearchResultItem>();
	for (const hit of mappedHits) {
		const key = hit.href || hit.youtubeId || hit.id;
		const existing = deduplicatedMap.get(key);
		if (!existing) {
			deduplicatedMap.set(key, hit);
		} else {
			// Prefer the canonical CodingCat.dev document type over standalone "youtube" transcript if both match the same href, while merging YouTube metadata
			const preferIncoming =
				existing.type === "youtube" && hit.type !== "youtube";
			const merged: SearchResultItem = {
				...(preferIncoming ? hit : existing),
				youtubeUrl: hit.youtubeUrl || existing.youtubeUrl,
				youtubeId: hit.youtubeId || existing.youtubeId,
				thumbnailUrl: hit.thumbnailUrl || existing.thumbnailUrl,
				duration: hit.duration || existing.duration,
				viewCount: hit.viewCount ?? existing.viewCount,
				excerpt:
					(preferIncoming ? hit.excerpt : existing.excerpt) ||
					hit.excerpt ||
					existing.excerpt,
			};
			deduplicatedMap.set(key, merged);
		}
	}
	const hits = Array.from(deduplicatedMap.values()).slice(0, 24);

	const response: SearchResponse = {
		query,
		type: filterType,
		total: hits.length,
		hits,
		semantic: isSemantic,
		...(extracted
			? {
					extraction: {
						model: CLAIRIC_MODEL_ID,
						...extracted,
					},
				}
			: {}),
	};

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=60, s-maxage=300",
			"x-aj-extraction-model": CLAIRIC_MODEL_ID,
			"x-aj-extraction-source": extracted?.source || "none",
			"x-aj-intent": extracted?.intent || "unknown",
			"x-aj-extraction-latency-ms": String(extracted?.latencyMs ?? 0),
		},
	});
};
