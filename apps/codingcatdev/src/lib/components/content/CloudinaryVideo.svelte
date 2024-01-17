<script lang="ts">
	/* USE <Image> component directly NOT this component */

	export let src: string;
	export let poster = '';
	export let classes: string = 'object-cover w-full bg-cover rounded bg-black/50 aspect-video';

	import { lazyload, HtmlVideoLayer, type VideoSources } from '@cloudinary/html';
	import { CloudinaryImage, CloudinaryVideo } from '@cloudinary/url-gen';
	import { format, quality } from '@cloudinary/url-gen/actions/delivery';
	import { auto } from '@cloudinary/url-gen/qualifiers/format';
	import { onMount } from 'svelte';

	let bindVideo: HTMLVideoElement | null = null;
	onMount(() => {
		const matchVideo = src.match(/upload\/(?:v\d+\/)?(.+?)\.[^\.]+$/)?.at(1);
		const removeVideoFront = src.replace('https://media.codingcat.dev/video/upload/', '');
		const newVideo = new CloudinaryVideo(
			matchVideo || removeVideoFront,
			{ cloudName: 'none' },
			{ secureDistribution: 'media.codingcat.dev', privateCdn: true, secure: true }
		)
			.delivery(format(auto()))
			.delivery(quality('auto'));
		let newImage;
		if (poster) {
			const matchImage = poster.match(/upload\/(?:v\d+\/)?(.+?)\.[^\.]+$/)?.at(1);
			const removeImageFront = poster.replace('https://media.codingcat.dev/image/upload/', '');
			newImage = new CloudinaryImage(
				matchImage || removeImageFront,
				{ cloudName: 'none' },
				{ secureDistribution: 'media.codingcat.dev', privateCdn: true, secure: true }
			)
				.delivery(format(auto()))
				.delivery(quality('auto'));
		}
		console.log('newImage', newImage);
		new HtmlVideoLayer(bindVideo, newVideo, undefined, undefined, undefined, newImage);
	});
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={bindVideo} class={`cld-video-player ${classes}`} controls autoplay />
