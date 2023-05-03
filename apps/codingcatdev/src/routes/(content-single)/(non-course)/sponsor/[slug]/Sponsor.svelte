<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';

	import { ContentType, type Content, type Podcast, type Course, type Sponsor } from '$lib/types';
	import { pluralize } from '$lib/utils';
	import Image from '$lib/components/content/Image.svelte';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	import ContentList from '../../ContentList.svelte';
	export let data: {
		content: Sponsor;
		contentType: ContentType;
		sponsorCourses: Course[];
		sponsorTutorials: Content[];
		sponsorPosts: Content[];
		sponsorPodcasts: Podcast[];
	};
	$: title = pluralize({ type: data.contentType } as Content);
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col justify-center w-full gap-8 p-2 xl:flex-row xl:p-8">
			<div class="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
				<ol class="bcu-breadcrumb">
					<li class="capitalize bcu-crumb">
						<a href={`/${title}`}>{title}</a>
					</li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.name}</li>
				</ol>
				<h1>{data?.content?.name}</h1>
				{#if data?.content?.cover}
					<div class="w-40 md:w-80">
						{#key data.content.cover}
							<Image
								src={data.content.cover}
								alt={data.content.name}
								classes="object-cover w-full bg-cover rounded bg-black/50 aspect-square"
							/>
						{/key}
					</div>
				{/if}

				<section class="flex flex-col flex-grow w-full gap-2 markdown md:gap-8">
					<CopyCodeInjector>
						{@html data.content.html}
					</CopyCodeInjector>
				</section>
				{#if data?.sponsorPodcasts?.length}
					<h2>Podcasts</h2>
					<ContentList contentItems={data.sponsorPodcasts} contentType={ContentType.podcast} />
				{/if}
				{#if data?.sponsorCourses?.length}
					<h2>Courses</h2>
					<ContentList contentItems={data.sponsorCourses} contentType={ContentType.course} />
				{/if}
				{#if data?.sponsorTutorials?.length}
					<h2>Tutorials</h2>
					<ContentList contentItems={data.sponsorTutorials} contentType={ContentType.tutorial} />
				{/if}
				{#if data?.sponsorPosts?.length}
					<h2>Posts</h2>
					<ContentList contentItems={data.sponsorPosts} contentType={ContentType.post} />
				{/if}
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
