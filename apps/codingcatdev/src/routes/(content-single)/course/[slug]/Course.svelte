<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Video from '$lib/components/content/Video.svelte';
	import type { Lesson } from '$lib/types';
	export let data: {
		course: Lesson;
	};
</script>

{#if data?.course}
	<div class="flex justify-center !text-token">
		<section class="justify-center p-1 course-single xl:p-8 sm:flex">
			<div class="p-1">
				{#if data?.course?.youtube}
					<Video
						sources={[
							{
								src: data.course.youtube,
								type: 'video/youtube'
							}
						]}
					/>
				{/if}

				<section class="flex-grow w-full prose lg:prose-xl xl:prose-2xl">
					{@html data.course.html}
				</section>
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
