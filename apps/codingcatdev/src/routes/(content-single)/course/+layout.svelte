<script>
	import { AppShell, TableOfContents } from '@codingcatdev/blackcatui';
	import Course from './Course.svelte';
	import LessonList from './LessonList.svelte';
	import Lesson from './Lesson.svelte';
	import Image from '$lib/components/content/Image.svelte';
	import { storeCurrentUrl } from '$lib/stores/stores';

	export let data;
</script>

{#if data?.content}
	<!-- App Shell -->
	<AppShell
		regionPage="overflow-y-scroll"
		slotPageFooter="pt-4 bg-surface-50-900-token block lg:hidden"
		slotSidebarRight="hidden lg:block"
	>
		<!-- Page Content -->
		<Lesson {data}>
			<slot />
		</Lesson>
		<svelte:fragment slot="bcu-app-shell-sidebar-right">
			<!-- Div takes up same room as fixed -->
			<div class="w-[19.5rem] xl:w-96" />
			<div class="fixed top-[5.125rem] bottom-24 w-[19.5rem] xl:w-96 py-10 overflow-y-auto ">
				<div class="flex flex-col gap-2 px-8 md:gap-8">
					<!-- Sponsors -->
					{#if data?.sponsors?.length}
						<span class="bcu-toc-label px-4 pt-0 font-bold">Sponsors</span>
						<section class="flex flex-col gap-2 md:flex-row md:gap-8">
							{#each data?.sponsors as sponsor (sponsor.slug)}
								<a
									class="overflow-hidden bcu-card bg-initial card-hover md:flex-1"
									href={`${sponsor.url}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<header>
										{#if sponsor?.cover}
											<Image
												src={sponsor.cover}
												alt={sponsor.name}
												classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video"
											/>
										{/if}
									</header>
									<div class="p-4 space-y-4">
										<h3 data-toc-ignore="">{sponsor?.name}</h3>
										<article>
											<p>
												{sponsor?.description}
											</p>
										</article>
									</div>
								</a>
							{/each}
						</section>
					{/if}
					{#key $storeCurrentUrl}
						<TableOfContents />
					{/key}
					{#if data?.course?.lesson && data?.course?.lesson.length > 0 && data?.course?.slug}
						<LessonList courseSlug={data?.course?.slug} lesson={data.course.lesson} />
					{/if}
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="bcu-app-shell-page-footer">
			{#if data?.course?.lesson && data?.course?.lesson.length > 0 && data?.course?.slug}
				<LessonList courseSlug={data?.course?.slug} lesson={data.course.lesson} />
			{/if}
		</svelte:fragment>
	</AppShell>
{:else}
	<Course {data}>
		<slot />
	</Course>
{/if}
