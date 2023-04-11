<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import LessonList from './LessonList.svelte';
	import Video from '$lib/components/content/Video.svelte';
	import type { Lesson } from '$lib/types';
	export let data: {
		content: Lesson;
	};
	console.log(data?.content);
</script>

{#if data?.content}
	<div class="flex justify-center !text-token">
		<section class="justify-center p-1 content-single xl:p-8 sm:flex">
			<div class="p-1">
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

				<section class="flex-grow w-full prose lg:prose-xl xl:prose-2xl">
					{@html data.content.html}
				</section>
			</div>
			{#if data?.content?.lesson && data?.content?.lesson.length > 0 && data?.content?.slug}
				<div class="hidden xl:block">
					<LessonList
						courseSlug={data?.content?.courseSlug || data?.content?.slug}
						lesson={data.content.lesson}
					/>
				</div>
			{/if}
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
