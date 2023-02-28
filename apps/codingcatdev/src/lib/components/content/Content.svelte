<script>
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import RecentPostsList from '$lib/components/content/RecentPostsList.svelte';
	import LessonList from '$lib/components/content/LessonList.svelte';
	import { ContentType } from '$lib/types/index';
	import Video from '$lib/components/content/Video.svelte';
	/** @typedef {import('$lib/types/index').Content} Content */
	/** @typedef {import('$lib/types/index').ContentList} ContentList */

	/**@type {{contentType: string, content: Content | null, course: ContentList, tutorial: ContentList, podcast: ContentList, post: ContentList}}*/
	export let data;
</script>

{#if data?.content}
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
					{@html data.content.content}
				</section>
			</div>
			{#if data?.content?.lesson && data?.content?.lesson.length > 0 && data?.content?.slug}
				<div class="hidden xl:block">
					<LessonList
						courseSlug={data?.content?.courseSlug || data?.content?.slug}
						lesson={data.content.lesson}
					/>
				</div>
			{:else}
				<div class="hidden xl:block">
					<RecentPostsList contentType={ContentType.course} list={data.course} />
					<RecentPostsList contentType={ContentType.tutorial} list={data.tutorial} />
					<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
					<RecentPostsList contentType={ContentType.post} list={data.post} />
				</div>
			{/if}
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
