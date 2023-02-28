<script>
	import '../../../../node_modules/video.js/dist/video-js.min.css';
	import videojs from 'video.js';
	// import 'videojs-youtube';
	import '@codingcatdev/videojs-codingcatdev-youtube';
	import { onMount, onDestroy, afterUpdate, beforeUpdate } from 'svelte';

	/**
	 * See https://videojs.com/guides/options/#sources
	 * @type {[{
	 * src: string
	 * type: string
	 * }]}*/
	export let sources;

	/** TODO: fix Player definition
	 * @type any */
	let player;

	const setPlayer = () => {
		player = videojs(
			'video-player',
			{
				controls: true,
				autoplay: false,
				preload: 'auto',
				fluid: true,
				restoreEl: true,
				plugins: {
					codingcatdevYoutube: {}
				},
				techOrder: ['youtube'],
				sources
			},
			undefined
		);
		player.codingcatdevYoutube();
		player.ready(() => {
			console.debug('videojs:player:ready');
		});
	};

	onMount(() => {
		console.debug('onMount');
		setPlayer();
		console.debug('onMount:videojs:player', player);
	});
	onDestroy(() => {
		console.debug('onDestroy');

		for (const p of videojs.getAllPlayers()) {
			p.dispose();
		}
	});
	beforeUpdate(() => {
		console.debug('beforeUpdate');
	});
	afterUpdate(() => {
		console.debug('afterUpdate');
		if (player && !player.isDisposed()) {
			player.dispose();
		}
		setPlayer();
		console.debug('afterUpdate:videojs:player', player);
	});
</script>

<svelte:head>
	<script>
		//This is a fake script tag because YT API needs one to append after.
		//https:\/\/www.youtube.com\/s\/player\/e5f6cbd5\/www-widgetapi.vflset\/www-widgetapi.js
		//This line var b = document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a, b)
	</script>
</svelte:head>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- <video bind:this={vid} /> -->
<video id="video-player" class="video-js">
	<p class="vjs-no-js">
		To view this video please enable JavaScript, and consider upgrading to a web browser that
		<a href="https://videojs.com/html5-video-support/" target="_blank" rel="noreferrer"
			>supports HTML5 video</a
		>
	</p>
</video>
