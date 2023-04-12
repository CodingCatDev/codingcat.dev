<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Video from '$lib/components/content/Video.svelte';
	import type { Lesson } from '$lib/types';
	export let data: {
		content: Lesson;
	};
	console.log(data?.content);
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col xl:flex-row gap-8 justify-center p-1 xl:p-8 w-full">
			<div class="flex flex-col gap-2 md:gap-8 max-w-7xl w-full">
				{#if data?.content?.youtube}
					<Video
						sources={[
							{
								src: data.content.youtube,
								type: 'video/youtube'
							}
						]}
					/>
				{/if}
				<section class="flex-grow w-full markdown flex flex-col gap-2 md:gap-8">
					{@html data.content.html}
				</section>
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
