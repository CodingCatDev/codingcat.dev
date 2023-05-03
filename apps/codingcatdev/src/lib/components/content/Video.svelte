<script lang="ts">
	export let src: string;
	export let title: string;

	const youtubeParser = (url: string) => {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return match && match[7].length == 11 ? match[7] : false;
	};

	$: finalSrc = `https://www.youtube.com/embed/${youtubeParser(src)}`;
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
