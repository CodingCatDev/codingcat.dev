<script lang="ts">
	import type { Lesson } from '$lib/types';

	export let lesson: Lesson[];
	export let courseSlug: string;
</script>

<section class="flex gap-2 md:gap-8">
	{#each lesson as l}
		<a href={`/course/${courseSlug}/lesson/${l.slug}`} class="link-primary">
			<div class="bcu-card">
				<header class="bcu-card-header capitalize pb-2 text-xl font-bold">{l.title}</header>
			</div>
		</a>
	{/each}
</section>
