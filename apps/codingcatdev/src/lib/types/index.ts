export interface Content {
	id: string;
	authors?: Author[];
	cloudinary_conver?: boolean;
	content?: string;
	cover?: string;
	devto?: string;
	excerpt?: string;
	hashnode?: string;
	preview?: string;
	published?: string;
	slug: string;
	start: Date;
	type: ContentType;
	title?: string;
	weight?: number;
	youtube?: string;
}

export interface Course extends Content {
	lesson?: Lesson[];
}
export interface Lesson extends Content {
	courseSlug?: string;
	lesson?: Lesson[];
	section?: string;
}
export interface Podcast extends Content {
	season?: number;
	episode?: number;
}

export interface Author {
	id: string;
	displayName?: string;
	slug: string;
}

export enum ContentType {
	course = 'course',
	framework = 'framework',
	forum = 'forum',
	group = 'group',
	language = 'language',
	lesson = 'lesson',
	page = 'page',
	podcast = 'podcast',
	post = 'post',
	tutorial = 'tutorial'
}

export enum ContentPublished {
	archived = 'archived',
	draft = 'draft',
	published = 'published'
}

/**
 * Array of ContentTypes
 * @readonly
 * @return {string[]}
 */
export const getContentTypes = () => {
	return Object.keys(ContentType);
};

/**
 * Array of ContentTypes Plural
 * @readonly
 * @return {Map<string,string>}
 */
export const getContentTypePlurals = () => {
	const map = new Map();
	Object.keys(ContentType).map((t) => map.set(t, t === ContentType.post ? 'blog' : t + 's'));
	return map;
};

/**
 * Array of ContentTypes Plural
 * @readonly
 * @param {string} contentType
 * @return {string | undefined}
 */
export const getContentTypePlural = (contentType: ContentType) => {
	return getContentTypePlurals().get(contentType);
};

// /**
//  * @typedef {Object} BasePodcast
//  * @property {boolean} chapters_done
//  * @property {number=} episode
//  * @property {string=} recording_date
//  * @property {('idea' | 'scheduled' | 'recorded' | 'failed')} status
//  * @property {('CodingCat.dev')} podcast
//  * @property {number=} season
//  * @property {string=} spotify
//  */

// /**
//  * @typedef {Content & BasePodcast} Podcast
//  */
