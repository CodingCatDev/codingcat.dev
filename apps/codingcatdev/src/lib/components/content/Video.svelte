<script lang="ts">
	export let src: string;
	export let title: string;

	$: finalSrc = `https://www.youtube.com/embed/${src.split('/').at(-1)}`;
</script>

<div class="aspect-video">
	<iframe
		src={finalSrc}
		{title}
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
		class="w-full h-full"
	/>
</div>
