<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import LessonList from '$lib/components/content/LessonList.svelte';
	import Video from '$lib/components/content/Video.svelte';
	import Editor from '$lib/components/content/Editor.svelte';
	import type { Lesson } from '$lib/types';
	export let data: {
		content: Lesson;
	};
	console.log(data?.content);
</script>

{#if data?.content}
	<div
		class="grid md:grid-cols-[minmax(50%,_1fr)_1fr]  grid-cols-1 w-full h-full overflow-x-hidden"
	>
		<div class="p-1 md:max-h-screen md:overflow-y-auto ">
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
		<section class="grid grid-rows-[1fr_1fr] w-full h-screen md:h-full order-first md:order-none">
			<div class="container ">
				<section class="editor-container h-full w-full">
					<Editor />
				</section>
			</div>
			<div>Other</div>
		</section>
	</div>

	<!-- <div class="container h-[calc(100%_-_2rem)]">
		<section class="editor-container h-80">
			<Editor />
		</section>
	</div>
	<div class="flex justify-center">
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
	</div> -->
{:else}
	<p>No data found yet</p>
{/if}
