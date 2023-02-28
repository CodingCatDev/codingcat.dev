<script>
	/** @type {string} */
	export let src;

	/** @type {string} */
	export let alt;

	/** @type {string=} */
	export let classes;

	import { lazyload, HtmlImageLayer } from '@cloudinary/html';
	import { CloudinaryImage } from '@cloudinary/url-gen';
	import { format, quality } from '@cloudinary/url-gen/actions/delivery';
	import { auto } from '@cloudinary/url-gen/qualifiers/format';
	import { onMount } from 'svelte';

	/** @type {HTMLImageElement| null}*/
	let bindImage = null;
	onMount(() => {
		const newImage = new CloudinaryImage(
			src.match(/upload\/(?:v\d+\/)?(.+?)\.[^\.]+$/)?.at(1),
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
