import { ContentType, type Content } from './types';

export function get_depth(name: string) {
	return name.split('/').length - 1;
}

export const contentLists = [
	...Object.values(ContentType)
		.filter((t) => ![ContentType.post, ContentType.page].includes(t))
		.map((t) => `${t}s`),
	'blog'
];

export const pluralize = (content: Content) => {
	return `${content.type === ContentType.post ? 'blog' : content.type + 's'}`;
};

export const unpluralize = (slug: string) => {
	return `${slug === 'blog' ? ContentType.post : slug.slice(0, -1)}` as ContentType;
};
