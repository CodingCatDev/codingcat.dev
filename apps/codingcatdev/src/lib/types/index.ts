export interface Content {
	id: string;
	authors?: Author[];
	cloudinary_conver?: boolean;
	html?: string;
	cover?: string;
	devto?: string;
	excerpt?: string;
	hashnode?: string;
	preview?: string;
	published?: ContentPublished;
	slug: string;
	start: Date;
	type: ContentType;
	title?: string;
	updated: Date;
	weight?: number;
	youtube?: string;
}

export interface Course extends Content {
	lesson?: Lesson[];
}
export interface Lesson extends Content {
	codepen?: string;
	courseSlug?: string;
	lesson?: Lesson[];
	section?: string;
	locked: boolean;
	stackblitz?: string;
}
export interface Podcast extends Content {
	season?: number;
	episode?: number;
	recording_date?: Date;
	podcast?: PodcastType;
	guests?: string[]; // Guest Slug

	// Exports
	devto?: string;
	hashnode?: string;
	spotify?: string;
}

export interface Author {
	cover?: string;
	name?: string;
	html?: string;
	slug: string;
	start: Date;
	published?: ContentPublished;
	socials: Socials;
	websites?: string[];
}

export enum ContentType {
	author = 'author',
	course = 'course',
	framework = 'framework',
	forum = 'forum',
	guest = 'guest',
	group = 'group',
	language = 'language',
	lesson = 'lesson',
	page = 'page',
	podcast = 'podcast',
	post = 'post',
	schedule = 'schedule',
	tutorial = 'tutorial'
}

export enum PodcastType {
	codingcatdev = 'codingcatdev',
}

export interface Socials {
	devto?: string;
	discord?: string;
	facebook?: string;
	github?: string;
	instagram?: string;
	linkedin?: string;
	email?: string;
	mastodon?: string;
	medium?: string;
	polywork?: string;
	stackoverflow?: string;
	tiktok?: string;
	twitch?: string;
	twitter?: string;
	youtube?: string;
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

export interface FileStub {
	type: 'file';
	name: string;
	basename: string;
	contents: string;
	text: boolean;
}

export interface DirectoryStub {
	type: 'directory';
	name: string;
	basename: string;
}

export type Stub = FileStub | DirectoryStub;
