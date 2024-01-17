<script lang="ts">
	export let src: string;
	export let title: string;

	const spotifyParser = (url: string) => {
		return new URL(url).pathname.split('/').at(-1);
	};
	$: finalSrc = `https://open.spotify.com/embed/episode/${spotifyParser(
		src
	)}?utm_source=generator&theme=0`;
</script>

<iframe
	frameborder="0"
	{title}
	allowfullscreen
	allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
	loading="lazy"
	width="100%"
	height="160"
	src={finalSrc}
/>
