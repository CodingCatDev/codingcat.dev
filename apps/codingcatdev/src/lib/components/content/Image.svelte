<script lang="ts">
	//TODO: Dynamic import?
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';
	export let loader: undefined | (() => {}) = undefined;
	export let src: string;
	export let alt: string;
	export let classes: string = 'object-cover w-full bg-cover rounded bg-black/50 aspect-video';
</script>

{#if loader}
	{loader()}
{:else if src.match(/(res.cloudinary.com|media.codingcat.dev)/g)?.length}
	<CloudinaryImage {src} {alt} {classes} />
{:else}
	<img {src} {alt} class={classes} />
{/if}
