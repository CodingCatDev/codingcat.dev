<script lang="ts">
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import { Star } from '@steeze-ui/heroicons';
	import { ContentType } from '$lib/types';
	export let position: 'left' | 'right';
	export let stars: number;
	export let description: string;
	export let link: { href: string; name: string };
	export let icon: ContentType;

	import Courses from '$lib/components/global/icons/nav/Courses.svelte';
	import Podcasts from '$lib/components/global/icons/nav/Podcasts.svelte';

	$: positionStyle =
		position === 'left'
			? '-rotate-2 !bg-primary-300 !text-primary-300-token'
			: 'rotate-2 !bg-white !text-primary-300-token';
</script>

<div class={`bcu-card w-96 snap-center shrink-0 ${positionStyle} ${$$props.class}`}>
	<div class="p-4 space-y-4">
		<div class="flex !text-primary-500">
			{#each Array(stars) as star}
				<Icon src={Star} theme="mini" class="w-6" />
			{/each}
		</div>
		<article>
			<p>{description}</p>
		</article>
		<footer class="flex justify-between">
			<a class="text-sm" href={link.href}>{link.name}</a>
			{#if icon === ContentType.course}
				<Courses />
			{/if}
			{#if icon === ContentType.podcast}
				<Podcasts />
			{/if}
		</footer>
	</div>
</div>
