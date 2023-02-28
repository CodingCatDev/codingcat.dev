<script>
	const navLinks = `grid place-items-center links-secondary gap-1`;
	import Courses from '$lib/components/global/icons/nav/Courses.svelte';
	export let href = '/courses';
	export let name = 'Courses';
	export let component = Courses;
</script>

<a href={`${href}`} class={`${navLinks} nav-links btn btn-ghost`}>
	<span class="sr-only">{`${name}`}</span>
	<svelte:component this={component} />
	{`${name}`}
</a>
