<script>
	//TODO: Dynamic import?
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';

	/** @type {function=} */
	export let loader = undefined;

	/** @type {string} */
	export let src;

	/** @type {string} */
	export let alt;

	/** @type {string=} */
	export let classes;
</script>

{#if loader}
	{loader()}
{:else if src.match(/(res.cloudinary.com|media.codingcat.dev)/g)?.length}
	<CloudinaryImage {src} {alt} {classes} />
{:else}
	<img {src} {alt} class={classes} />
{/if}
