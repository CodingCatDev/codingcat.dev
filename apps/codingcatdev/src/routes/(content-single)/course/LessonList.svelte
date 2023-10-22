<script lang="ts">
	import type { Lesson } from '$lib/types';
	import { storeCurrentUrl } from '$lib/stores/stores';
	import BookMark from './BookMark.svelte';
	import CompletionLockMark from './CompletionLockMark.svelte';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token !text-white' : '';
</script>

{#if data?.course?.lesson}
	<div class="card p-2 md:p-4">
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
						<div class="w-12 flex gap-1">
							<CompletionLockMark locked={l?.locked} lesson={l} {data} />
							<BookMark />
						</div>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if}
