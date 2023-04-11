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
		<section class="flex gap-8 justify-center p-1 xl:p-8">
			<div class="">
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
				<section class="flex-grow w-full markdown">
					{@html data.content.html}
				</section>
			</div>

			<div class="hidden xl:flex flex-col gap-6">
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
