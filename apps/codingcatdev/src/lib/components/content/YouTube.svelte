<script lang="ts">
	export let src: string;
	export let title: string;

	const youtubeParser = (url: string) => {
		const regExp =
			/.*(?:youtu.be\/|(?:youtube.com\/live\/)|(?:youtube.com\/shorts\/)|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
		let match = url.match(regExp);
		return match && match[1].length == 11 ? match[1] : false;
	};
	$: finalSrc = `https://www.youtube.com/embed/${youtubeParser(src)}`;
	$: isShort = src.includes('short');
</script>

{#if isShort}
	<div class="flex justify-center">
		<div class="aspect-[9/16] flex-1 max-w-md">
			<iframe
				src={finalSrc}
				{title}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
				class={`w-full h-full rounded-md ${$$props.class}`}
				loading="lazy"
			></iframe>
		</div>
	</div>
{:else}
	<div class="aspect-video">
		<iframe
			src={finalSrc}
			{title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class={`w-full h-full rounded-md ${$$props.class}`}
			loading="lazy"
		/>
	</div>
{/if}
