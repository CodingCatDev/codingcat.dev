<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Video from '$lib/components/content/Video.svelte';
	import { browser } from '$app/environment';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	import Image from '$lib/components/content/Image.svelte';
	import ProCourseMark from './ProCourseMark.svelte';
	import type { LayoutData } from './$types';
	import LessonList from './LessonList.svelte';
	export let data: LayoutData;
</script>

{#if data?.content}
	{#key data?.content?.slug}
		<div class="flex justify-center">
			<section class="flex flex-col xl:flex-row gap-8 justify-center p-2 xl:p-8 w-full">
				<div class="flex flex-col gap-2 md:gap-8 max-w-7xl w-full">
					<ol class="breadcrumb">
						<li class="crumb"><a href="/courses">Courses</a></li>
						<li class="crumb-separator" aria-hidden>&rsaquo;</li>
						<li class="crumb">
							<a href={`/course/${data.course.slug}`}>{data.course.title}</a>
						</li>
						<li class="crumb-separator" aria-hidden>&rsaquo;</li>
						<li>{data.content.title}</li>
					</ol>
					<div class="w-full lg:grid lg:grid-cols-12 lg:space-y-0 relative">
						<div class="col-span-9">
							{#if data?.content?.youtube}
								<Video src={data.content.youtube} title={`${data.content.title}`} />
							{:else if data?.content?.cover}
								<Image src={data.content.cover} alt={data.content.title} />
							{/if}
						</div>
						<div class="flex flex-col col-span-3">
							<LessonList {data} />
						</div>
					</div>
					<div class="flex gap-2">
						{#if data?.course?.lesson?.filter((l) => l.locked).length}
							<span class="chip variant-filled-primary py-1 px-4 rounded-full font-bold text-xl"
								>Pro</span
							>
						{:else}
							<span class="chip variant-ringed py-1 px-4 rounded-full font-bold text-xl">Free</span>
						{/if}
						<ProCourseMark {data} lesson={data.content} />
					</div>
					{#if data?.authors}
						<section class="flex">
							{#each data?.authors as author (author.slug)}
								<a
									class="btn flex gap-2 items-center variant-ghost p-2 rounded-md"
									href={`/author/${author.slug}`}
								>
									{#if author?.cover}
										<div class="w-8 md:w-12">
											{#key author.slug}
												<Image src={author.cover} alt={author?.name} />
											{/key}
										</div>
									{/if}
									<div>{author?.name}</div>
								</a>
							{/each}
						</section>
					{/if}
					{#if data?.content?.title}
						<h1>{data?.content?.title}</h1>
					{/if}
					{#if browser && data?.content?.codepen}
						<section class=" aspect-video">
							<iframe
								scrolling="no"
								title={`codepen for ${data?.content?.title}`}
								src={`https://codepen.io/${data.content.codepen.replace(
									'pen',
									'embed'
								)}?default-tab=html%2Cresult`}
								allowtransparency={true}
								allowfullscreen={true}
								frameborder="0"
								height="100%"
								width="100%"
							>
								See the Pen <a href={`https://codepen.io/${data.content.codepen}`}>
									on <a href="https://codepen.io">CodePen</a>.
								</a></iframe
							>
						</section>
					{/if}
					{#if browser && data?.content?.stackblitz}
						<section class=" aspect-video">
							<iframe
								title={`stackblitz for ${data?.content?.title}`}
								src={data.content.stackblitz}
								frameborder="0"
								height="100%"
								width="100%"
								loading="lazy"
							/>
						</section>
					{/if}
					<section class="flex flex-col flex-grow w-full gap-2 markdown md:gap-8">
						<CopyCodeInjector>
							<slot />
						</CopyCodeInjector>
					</section>
				</div>
			</section>
		</div>
	{/key}
{:else}
	<p>No data found yet</p>
{/if}
