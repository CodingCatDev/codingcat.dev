<script>
	/** @type {import('$lib/types/index').Content[]} */
	export let lesson;

	/** @type {string} */
	export let courseSlug;
</script>

<div class="pt-2">
	<ul class="card w-96 p-2 bg-base-content shadow-xl">
		{#each lesson as l}
			<li class={`list-none cursor-pointer p-1 rounded m-1 flex flex-col justify-between`}>
				<a href={`/course/${courseSlug}/lesson/${l.slug}`} class="link-primary">
					{l.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
