<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Video from '$lib/components/content/Video.svelte';
	import type { Lesson, Course } from '$lib/types';
	import { browser } from '$app/environment';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';
	export let data: {
		course: Course;
		content: Lesson;
	};
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col xl:flex-row gap-8 justify-center p-2 xl:p-8 w-full">
			<div class="flex flex-col gap-2 md:gap-8 max-w-7xl w-full">
				<ol class="bcu-breadcrumb">
					<li class="bcu-crumb"><a href="/courses">Courses</a></li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li class="bcu-crumb">
						<a href={`/course/${data.course.slug}`}>{data.course.title}</a>
					</li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.title}</li>
				</ol>
				{#if data?.content?.youtube}
					<Video src={data.content.youtube} title={`${data.content.title}`} />
				{:else if data?.content?.cover}
					<CloudinaryImage src={data.content.cover} alt={data.content.title} />
				{/if}
				{#if data?.content?.title}
					<h1>{data?.content?.title}</h1>
				{/if}
				{#if browser && data?.content?.stackblitz}
					<section class=" aspect-video">
						<iframe
							title={`repo for ${data?.content?.title}`}
							src={data.content.stackblitz}
							frameborder="0"
							height="100%"
							width="100%"
						/>
					</section>
				{/if}
				<section class="flex flex-col flex-grow w-full gap-2 markdown md:gap-8">
					<CopyCodeInjector>
						{@html data.content.html}
					</CopyCodeInjector>
				</section>
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
