<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import type { Podcast } from '$lib/types';
	import { fly } from 'svelte/transition';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';
	import PodcastCard from './PodcastCard.svelte';
	import PodcastSvg from './PodcastSvg.svelte';
	export let podcasts: Podcast[];
	let visible = false;
</script>

<section class="bg-surface-800-100-token text-surface-100-800-token relative">
	<div class="grid justify-center grid-cols-1 px-8 mx-auto gap-2 2xl:gap-10 max-w-7xl relative">
		<div class="flex">
			<div class="flex flex-col basis-1/12 relative">
				<GitLineGradient />
				<PodcastSvg />
				<GitLineGradient rotate={true} />
			</div>
			<div
				class="basis-11/12 pl-4 sm:pl-2 pt-8 sm:pt-20 pb-96 lg:mb-72"
				use:inView
				on:enter={() => (visible = true)}
				on:exit={() => (visible = false)}
			>
				<div class="flex flex-col lg:flex-row gap-8 items-center">
					<div class="sm:basis-2/3 flex flex-col justify-center gap-8">
						<h2>CodingCat.dev Podcast</h2>
						<p>
							Tune in to our thought-provoking episodes featuring industry experts, thought leaders,
							and innovators.
						</p>
					</div>
					<div class="sm:basis-1/3 flex">
						<a href="/podcasts" class="btn variant-filled sm:btn-xl">View all episodes</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="absolute top-64 left-0 w-full z-10">
		<div
			class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto overflow-y-hidden py-10 sm:justify-center"
		>
			{#each podcasts as content, i}
				{#if visible}
					<div
						class="flex flex-none"
						in:fly={{ x: 200, delay: 300 * (i + 1), duration: 300 }}
						out:fly
					>
						<PodcastCard position={i % 2 ? 'left' : 'right'} {content} />
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	/* Scrollbars are ugly on horizontal */
	.scroll-smooth::-webkit-scrollbar {
		display: none;
	}
</style>
