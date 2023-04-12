<script lang="ts">
	import type { Lesson } from '$lib/types';

	export let lesson: Lesson[];
	export let courseSlug: string;
</script>

<section
	class="grid grid-cols-[repeat(1,minmax(0,_1fr))] md:grid-cols-[repeat(2,minmax(0,_1fr))] lg:md:grid-cols-[repeat(3,minmax(0,_1fr))] xl:grid-cols-[repeat(4,minmax(0,_1fr))] gap-2 md:gap-8"
>
	{#each lesson as l}
		<a href={`/course/${courseSlug}/lesson/${l.slug}`} class="link-primary">
			<div class="bcu-card h-full">
				<header class="bcu-card-header capitalize pb-2 text-xl font-bold">{l.title}</header>
			</div>
		</a>
	{/each}
</section>
