/**
 * Runtime pagination bounds for `output: "server"`.
 *
 * There is no `getStaticPaths` anywhere in this app, so `/blog/page/9999`
 * is a live request rather than a build-time 404. This resolves the page
 * number against the real document count on every request.
 *
 * URL form is `/{base}/page/{n}`, 1-indexed, matching the Next app — those
 * URLs are indexed and must not change.
 */
export const PAGE_SIZE = 10;

export interface PageBounds {
	page: number;
	totalPages: number;
	/** GROQ slice start. */
	offset: number;
	/** GROQ slice end — `[$offset...$limit]` is exclusive of `$limit`. */
	limit: number;
}

export type PageResolution =
	| { ok: true; bounds: PageBounds }
	| { ok: false; response: Response };

export function resolvePage({
	raw,
	count,
	base,
	pageSize = PAGE_SIZE,
	redirect,
}: {
	raw: string | undefined;
	count: number;
	base: string;
	pageSize?: number;
	redirect: (path: string, status?: 301 | 302 | 307 | 308) => Response;
}): PageResolution {
	// Reject anything that is not a bare positive integer. `Number("1e3")`,
	// `Number(" 2 ")` and `Number("2.0")` all coerce successfully, which would
	// let a single page be served under unlimited distinct URLs.
	if (!raw || !/^[1-9]\d*$/.test(raw)) {
		return { ok: false, response: new Response(null, { status: 404 }) };
	}

	const page = Number(raw);
	const totalPages = Math.max(1, Math.ceil(count / pageSize));

	if (page > totalPages) {
		// 302, not 301: the content grows, so today's out-of-range page is
		// tomorrow's valid one and must not be permanently cached.
		return {
			ok: false,
			response: redirect(`/${base}/page/${totalPages}`, 302),
		};
	}

	const offset = (page - 1) * pageSize;
	return {
		ok: true,
		bounds: { page, totalPages, offset, limit: offset + pageSize },
	};
}
