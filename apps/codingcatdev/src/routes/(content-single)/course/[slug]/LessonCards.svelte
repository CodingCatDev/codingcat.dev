<script lang="ts">
	import type { Lesson } from '$lib/types';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LockClosed } from '@steeze-ui/heroicons';
	import { LockOpen } from '@steeze-ui/heroicons';

	export let lesson: Lesson[];
	export let courseSlug: string;
</script>

<section
	class="grid grid-cols-[repeat(1,minmax(0,_1fr))] md:grid-cols-[repeat(2,minmax(0,_1fr))] lg:md:grid-cols-[repeat(3,minmax(0,_1fr))]  gap-2 md:gap-8"
>
	{#each lesson as l}
		<a href={`/course/${courseSlug}/lesson/${l.slug}`} class="!no-underline !text-token">
			<div class="bcu-card h-full p-4">
				<header class="bcu-card-header capitalize py-6 text-2xl font-bold relative">
					<div class="w-6 absolute top-0 right-0">
						{#if l?.locked}
							<Icon src={LockClosed} theme="solid" />
						{:else}
							<Icon src={LockOpen} theme="solid" />
						{/if}
					</div>
					<div>
						{l.title}
					</div>
				</header>
				<p class="p-4 !opacity-80">
					{l?.excerpt || 'More info in course.'}
				</p>
			</div>
		</a>
	{/each}
</section>
