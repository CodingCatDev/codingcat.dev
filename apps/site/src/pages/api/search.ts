import type { APIRoute } from "astro";
import {
	semanticSearchQuery,
	textSearchFallbackQuery,
} from "@/lib/sanity/queries";
import { resolveHref } from "@/lib/sanity/resolve-href";

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

	const params = {
		searchTerm: query,
		type: filterType === "all" ? null : filterType,
	};

	let rawHits: any[] = [];
	let isSemantic = false;

	// 1. Attempt Sanity native dataset embeddings semantic search
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

	// 2. If semantic query errored or yielded empty, try the text-match query
	if (!isSemantic) {
		try {
			const fallbackResult = await locals.sanity.fetchPublished(
				textSearchFallbackQuery,
				params,
			);
			if (Array.isArray(fallbackResult)) {
				rawHits = fallbackResult;
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
	};

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=60, s-maxage=300",
		},
	});
};
