<script lang="ts">
	import { storeCurrentUrl } from '$lib/stores/stores';

	import type { LayoutData } from './$types';
	import ProCourseMark from './ProCourseMark.svelte';
	export let data: LayoutData;

	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token !text-white' : '';
</script>

{#if data?.course?.lesson}
	<div class="p-2 card md:p-4">
		<nav class="nav-list-nav">
			<ul>
				{#each data.course.lesson as l}
					{#if l?.section}
						<div class="pb-2">
							<span class="flex py-2 mt-4 text-xl font-bold">
								{l.section}
							</span>
							<hr />
						</div>
					{/if}
					<li class="flex justify-between">
						<a
							href={`/course/${data?.course?.slug}/lesson/${l.slug}`}
							class={`${classesActive(l.slug)} flex gap-1`}
						>
							{l.title}
						</a>
						<div class="flex w-12 gap-1">
							<ProCourseMark locked={l?.locked} lesson={l} {data} />
						</div>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if}
