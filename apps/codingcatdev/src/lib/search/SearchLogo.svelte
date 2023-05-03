<script>
	import AjPrimary from '$lib/components/global/icons/AJPrimary.svelte';
	import Blog from '$lib/components/global/icons/nav/Blog.svelte';
	import Courses from '$lib/components/global/icons/nav/Courses.svelte';
	import Podcasts from '$lib/components/global/icons/nav/Podcasts.svelte';
	import Tutorials from '$lib/components/global/icons/nav/Tutorials.svelte';
	import { ContentType } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	/** @type {string} */
	export let breadcrumb;

	/**
	 * @param {string} title
	 */
	function getLogo(title) {
		const contentType = title.split('/').at(0);

		switch (contentType) {
			case ContentType.course:
				return { contentType, component: Courses };
			case ContentType.podcast:
				return { contentType, component: Podcasts };
			case ContentType.tutorial:
				return { contentType, component: Tutorials };
			case ContentType.post:
				return { contentType, component: Blog };
			default:
				return { contentType, component: AjPrimary };
		}
	}
	$: logo = getLogo(breadcrumb);
</script>

<div class="flex flex-col w-10 justify-center align-middle items-center">
	<svelte:component this={logo.component} />
	{logo.contentType}
</div>
