<script lang="ts">
	import type { Content } from '$lib/types';

	export let lesson: Content[];
	export let courseSlug: string;
</script>

<div class="bcu-card">
	<header class="bcu-card-header capitalize pb-2 text-xl font-bold">Lessons</header>
	<hr />
	<ul>
		{#each lesson as l}
			<li class={`list-none cursor-pointer p-1 rounded m-1 flex flex-col justify-between`}>
				<a href={`/course/${courseSlug}/lesson/${l.slug}`} class="link-primary">
					{l.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
