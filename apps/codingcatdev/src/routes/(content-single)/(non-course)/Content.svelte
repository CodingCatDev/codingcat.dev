<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import RecentPostsList from './RecentPostsList.svelte';
	import {
		ContentType,
		type Content,
		type Course,
		type Lesson,
		type Podcast
	} from '$lib/types/index';
	import Video from '$lib/components/content/Video.svelte';
	export let data: {
		content: Lesson;
		course: Course[];
		tutorial: Content[];
		podcast: Podcast[];
		post: Content[];
	};
	console.log(data?.content);
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col xl:flex-row gap-8 justify-center p-1 xl:p-8">
			<div class="flex flex-col gap-2 md:gap-8 max-w-7xl">
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

			<div class="flex flex-col gap-6">
				<RecentPostsList contentType={ContentType.course} list={data.course} />
				<RecentPostsList contentType={ContentType.tutorial} list={data.tutorial} />
				<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
				<RecentPostsList contentType={ContentType.post} list={data.post} />
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
