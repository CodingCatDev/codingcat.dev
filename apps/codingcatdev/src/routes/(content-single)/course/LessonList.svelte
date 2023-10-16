<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LockClosed } from '@steeze-ui/heroicons';
	import { LockOpen } from '@steeze-ui/heroicons';

	import type { Lesson } from '$lib/types';
	import { storeCurrentUrl } from '$lib/stores/stores';

	export let lesson: Lesson[];
	export let courseSlug: string;

	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token' : '';
</script>

<div class="card p-2 md:p-4">
	<!-- <header class="card-header capitalize pb-2 text-2xl font-bold flex justify-center">
		Lessons
	</header>
	<hr /> -->
	<nav class="nav-list-nav">
		<ul>
			{#each lesson as l}
				{#if l?.section}
					<div class="pb-2">
						<span class="flex py-2 mt-4 text-xl font-bold">
							{l.section}
						</span>
						<hr />
					</div>
				{/if}
				<li>
					<a
						href={`/course/${courseSlug}/lesson/${l.slug}`}
						class={`${classesActive(l.slug)} flex gap-1`}
					>
						<div class="w-6 shrink-0">
							{#if l?.locked}
								<Icon src={LockClosed} theme="solid" />
							{:else}
								<Icon src={LockOpen} theme="solid" />
							{/if}
						</div>
						<div>
							{l.title}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
