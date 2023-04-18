import { parseModules, preview } from "$lib/server/content";
import { ContentPublished } from "$lib/types";

export const content = async () => {

	const course = import.meta.glob(['../../../content/course/*.md']);
	const podcast = import.meta.glob(['../../../content/podcast/*.md']);
	const post = import.meta.glob(['../../../content/post/*.md']);
	const tutorial = import.meta.glob(['../../../content/tutorial/*.md']);

	const p = await Promise.all([
		parseModules(course),
		parseModules(podcast),
		parseModules(post),
		parseModules(tutorial)
	])

	const combinedContent = [...p[0], ...p[1], ...p[2], ...p[3]];

	const fullContent = combinedContent
		.filter(preview ? () => true : (c) => c.published === ContentPublished.published)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf());

	const blocks = [];

	//TODO: use full text instead of excerpt
	for (const c of fullContent) {
		blocks.push({
			breadcrumbs: [`${c.type}/${c.title}`], href: `/${c.type}/${c.slug}`, content: c.excerpt
		})
	}
	return blocks;
	// return [
	// 	{ breadcrumbs: ['Introduction'], href: '/docs/introduction', content: '' },
	// 	{
	// 		breadcrumbs: ['Introduction', 'Before we begin'],
	// 		href: '/docs/introduction#before-we-begin',
	// 		content:
	// 			"If you're new to Svelte or SvelteKit we recommend checking out the interactive tutorial.\n\nIf you get stuck, reach out for help in the Discord chatroom."
	// 	},
	// 	{
	// 		breadcrumbs: ['Introduction', 'What is SvelteKit?'],
	// 		href: '/docs/introduction#what-is-sveltekit',
	// 		content:
	// 			"SvelteKit is a framework for rapidly developing robust, performant web applications using Svelte. If you're coming from React, SvelteKit is similar to Next. If you're coming from Vue, SvelteKit is similar to Nuxt."
	// 	},
	// 	{
	// 		breadcrumbs: ['Introduction', 'What is Svelte?'],
	// 		href: '/docs/introduction#what-is-svelte',
	// 		content:
	// 			"In short, Svelte is a way of writing user interface components — like a navigation bar, comment section, or contact form — that users see and interact with in their browsers. The Svelte compiler converts your components to JavaScript that can be run to render the HTML for the page and to CSS that styles the page. You don't need to know Svelte to understand the rest of this guide, but it will help. If you'd like to learn more, check out the Svelte tutorial."
	// 	},
	// 	{
	// 		breadcrumbs: ['Introduction', 'What does SvelteKit provide on top of Svelte?'],
	// 		href: '/docs/introduction#what-does-sveltekit-provide-on-top-of-svelte',
	// 		content:
	// 			'Svelte renders UI components. You can compose these components and render an entire page with just Svelte, but you need more than just Svelte to write an entire app.\n\nSvelteKit provides basic functionality like a router — which updates the UI when a link is clicked — and server-side rendering (SSR). But beyond that, building an app with all the modern best practices is fiendishly complicated. Those practices include build optimizations, so that you load only the minimal required code; offline support; preloading pages before the user initiates navigation; configurable rendering that allows you to render different parts of your app on the server with SSR, in the browser client-side rendering, or at build-time with prerendering; and many other things. SvelteKit does all the boring stuff for you so that you can get on with the creative part.\n\nIt reflects changes to your code in the browser instantly to provide a lightning-fast and feature-rich development experience by leveraging Vite with a Svelte plugin to do Hot Module Replacement (HMR).'
	// 	},
	// ]

}
