import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "@/lib/sanity/queries";
import { resolveHref } from "@/lib/sanity/resolve-href";
import {
	CLAIRIC_MODEL_ID,
	type ClairicExtractedParameters,
	extractIntentWithClairic,
} from "./chat";

export interface SearchResultItem {
	id: string;
	type: "post" | "podcast" | "author" | "guest" | string;
	title: string;
	slug: string;
	href: string;
	excerpt?: string;
	date?: string;
	score?: number;
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
	const effectiveType =
		filterType !== "all"
			? filterType
			: extracted?.contentType && extracted.contentType !== "all"
				? extracted.contentType
				: null;
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
			const recentTypes =
				effectiveType === "podcast"
					? ["podcast"]
					: effectiveType === "post"
						? ["post"]
						: ["podcast", "post"];
			const recentResult = await locals.sanity.fetchPublished(
				`*[_type in $types && defined(slug.current)] | order(date desc, _createdAt desc)[0...20]{
					_id,
					_type,
					title,
					"slug": slug.current,
					excerpt,
					date
				}`,
				{ types: recentTypes },
			);
			if (Array.isArray(recentResult) && recentResult.length > 0) {
				rawHits = recentResult;
				isSemantic = true;
			}
		} catch {}
	} else if (extracted?.intent === "top_videos") {
		try {
			const topVideoResult = await locals.sanity.fetchPublished(
				`*[_type in ["podcast", "post"] && defined(slug.current) && defined(youtube)] | order(coalesce(statistics.youtube.viewCount, 0) desc, date desc)[0...20]{
					_id,
					_type,
					title,
					"slug": slug.current,
					excerpt,
					date
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

	// Format hits cleanly for clients
	const hits: SearchResultItem[] = rawHits
		.filter((item) => item?.slug)
		.map((item) => {
			const docType = item._type || "post";
			const slug = item.slug;
			const href = resolveHref(docType, slug) || `/${docType}/${slug}`;

			return {
				id: item._id,
				type: docType,
				title: item.title || item.name || "Untitled",
				slug,
				href,
				excerpt: item.excerpt || undefined,
				date: item.date || undefined,
				score: typeof item._score === "number" ? item._score : undefined,
			};
		});

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
