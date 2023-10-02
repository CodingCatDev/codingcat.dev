<script>
	import { ContentType } from '$lib/types';
	import ReviewCard from './ReviewCard.svelte';
</script>

<section class="relative pt-20">
	<div class="bg-surface-300 h-96">
		<div class="absolute top-0 left-0 w-full">
			<div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto py-10">
				<ReviewCard
					position="left"
					stars={5}
					description="The CSS Animations course is phenomenal. Very beginner-friendly!"
					link={{ href: '/course/css-animations', name: 'CSS Animations' }}
					icon={ContentType.course}
				/>
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
	</div>
</section>
