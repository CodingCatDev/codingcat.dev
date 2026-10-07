import type { CoverImage } from "./sanity/types.gen";

/**
 * Structural shape shared by every listing query's items.
 *
 * The generated result types are per-query and mutually incompatible even
 * where the projections are identical (`moreAuthorQuery` has no `author`
 * field at all, `morePostQuery` does). Listing components accept this
 * widened shape so one card renders all five content types; the generated
 * types still guard the fetch itself, which is where the real risk is.
 */
export interface ContentListItem {
	_id: string;
	_type: string;
	title: string;
	slug: string | null;
	excerpt?: string | null;
	coverImage?: CoverImage | null;
	date?: string | null;
	author?: Array<PersonRef> | null;
	guest?: Array<PersonRef> | null;
}

export interface PersonRef {
	_id: string;
	title: string;
	slug: string | null;
	coverImage?: CoverImage | null;
}

/** Types rendered as a circular portrait rather than a 16:9 cover. */
const PERSON_TYPES = new Set(["author", "guest"]);

export const isPerson = (type: string) => PERSON_TYPES.has(type);

const PLURALS: Record<string, string> = {
	post: "Posts",
	podcast: "Podcasts",
	author: "Authors",
	guest: "Guests",
	sponsor: "Sponsors",
};

export const pluralize = (type: string) =>
	PLURALS[type] ?? `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;
