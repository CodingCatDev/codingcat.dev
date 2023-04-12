<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Video from '$lib/components/content/Video.svelte';
	import type { Course } from '$lib/types';
	import LessonCards from './LessonCards.svelte';
	export let data: {
		course: Course;
	};
</script>

{#if data?.course}
	<div class="flex flex-col justify-center !text-token  p-1 xl:p-8">
		<section class="justify-center flex flex-col gap-2 md:gap-8">
			<div class="flex flex-col gap-2 md:gap-8">
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

				<section class="flex-grow w-full markdown flex flex-col gap-2 md:gap-8">
					{@html data.course.html}
				</section>
			</div>
			{#if data?.course?.lesson}
				<div class="flex flex-col gap-2 md:gap-8">
					<h2>Lessons</h2>
					<LessonCards lesson={data.course.lesson} courseSlug={data.course.slug} />
				</div>
			{/if}
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
