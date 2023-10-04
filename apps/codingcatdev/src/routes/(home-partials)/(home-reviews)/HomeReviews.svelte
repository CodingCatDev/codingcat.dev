<script>
	import { inView } from '$lib/actions/inView';
	import { ContentType } from '$lib/types';
	import { fly } from 'svelte/transition';
	import ReviewCard from './ReviewCard.svelte';
	let visible = false;
</script>

<section class="relative">
	<div
		class="absolute top-0 left-0 w-full -my-32"
		use:inView
		on:enter={() => (visible = true)}
		on:exit={() => (visible = false)}
	>
		{#if visible}
			<div
				class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto py-10 sm:justify-center"
			>
				<div in:fly={{ x: 200, delay: 300, duration: 300 }} out:fly>
					<ReviewCard
						position="left"
						stars={5}
						description="The CSS Animations course is phenomenal. Very beginner-friendly!"
						link={{ href: '/course/css-animations', name: 'CSS Animations' }}
						icon={ContentType.course}
					/>
				</div>
				<div in:fly={{ x: 200, delay: 400, duration: 300 }} out:fly>
					<ReviewCard
						position="right"
						stars={5}
						description="I LOVED the podcast episode with Rich Harris! Very well-informed discussion about the web!"
						link={{
							href: '/podcast/2-17-building-the-future-of-svelte-at-vercel',
							name: 'Building the Future of Svelte at Vercel'
						}}
						icon={ContentType.podcast}
					/>
				</div>
				<div in:fly={{ x: 200, delay: 500, duration: 300 }} out:fly>
					<ReviewCard
						position="left"
						stars={5}
						description="The Ultimate Svelte Guide course is one of the best out there!"
						link={{
							href: '/course/svelte',
							name: 'Learn Svelte: The Ultimate Guide'
						}}
						icon={ContentType.course}
					/>
				</div>
				<div in:fly={{ x: 200, delay: 600, duration: 300 }} out:fly>
					<ReviewCard
						position="right"
						stars={5}
						description="Fireship is the best, congratulations on the interview 🎉🎉"
						link={{
							href: 'http://localhost:5173/podcast/0-9-jeff-delaney-of-fireship-io',
							name: 'Fireship.io'
						}}
						icon={ContentType.podcast}
					/>
				</div>
				<div in:fly={{ x: 200, delay: 700, duration: 300 }} out:fly>
					<ReviewCard
						position="left"
						stars={5}
						description="Dude! This video series is the cleanest, simplest, best paced, that I've found on Svelte so far."
						link={{
							href: '/course/sveltekit-firebase/lesson/2_5-inputs-bindings-and-reactivity',
							name: 'Svelte Input Bindings'
						}}
						icon={ContentType.course}
					/>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Scrollbars are ugly on horizontal */
	.scroll-smooth::-webkit-scrollbar {
		display: none;
	}
</style>
