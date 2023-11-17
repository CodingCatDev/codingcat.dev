<script lang="ts">
	/* USE <Image> component directly NOT this component */
	import { CldImage } from 'svelte-cloudinary';

	export let src: string;
	export let alt: string = 'Missing Alt';
	export let classes: string = 'object-cover w-full bg-cover rounded bg-black/50 aspect-video';
	const match = src.match(/upload\/(?:v\d+\/)?(.+?)\.[^\.]+$/)?.at(1);
	const removeFront = src.replace('https://media.codingcat.dev/image/upload/', '');
	$: resolvedSrc = match || removeFront;
</script>

{resolvedSrc}
<CldImage
	width={1920}
	height={1080}
	layout="constrained"
	src={resolvedSrc}
	{alt}
	class={classes}
	preserveTransformations
	config={{
		url: {
			secureDistribution: 'media.codingcat.dev',
			privateCdn: true
		}
	}}
/>
