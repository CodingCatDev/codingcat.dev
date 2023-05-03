<script lang="ts">
	/* USE <Image> component directly NOT this component */

	export let src: string;
	export let alt: string = 'Missing Alt';
	export let classes: string = 'object-cover w-full bg-cover rounded bg-black/50 aspect-video';

	import { lazyload, HtmlImageLayer } from '@cloudinary/html';
	import { CloudinaryImage } from '@cloudinary/url-gen';
	import { format, quality } from '@cloudinary/url-gen/actions/delivery';
	import { auto } from '@cloudinary/url-gen/qualifiers/format';
	import { onMount } from 'svelte';

	let bindImage: HTMLImageElement | null = null;
	onMount(() => {
		const match = src.match(/upload\/(?:v\d+\/)?(.+?)\.[^\.]+$/)?.at(1);
		const removeFront = src.replace('https://media.codingcat.dev/image/upload/', '');
		const newImage = new CloudinaryImage(
			match || removeFront,
			{ cloudName: 'none' },
			{ secureDistribution: 'media.codingcat.dev', privateCdn: true, secure: true }
		)
			.delivery(format(auto()))
			.delivery(quality('auto'));
		new HtmlImageLayer(bindImage, newImage, [
			lazyload()
			// TODO: Research these one more
			// responsive({ steps: [800, 1000, 1400] })
			// accessibility(),
			// placeholder({ mode: 'blur' })
		]);
	});
</script>

<img bind:this={bindImage} {alt} class={classes} loading="lazy" decoding="async" />
