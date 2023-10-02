<script>
	import LinesHero from './LinesHeroSvg.svelte';
	import CodeSvg from './CodeSvg.svelte';
	import GitLineGradient from './GitLineGradient.svelte';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowRight } from '@steeze-ui/heroicons';
	import StarSvg from './StarSvg.svelte';

	import { Avatar } from '@codingcatdev/blackcatui';
	import Block from './Block.svelte';
	import Circle from './Circle.svelte';
	import AjPrimary from '$lib/components/global/icons/AJPrimary.svelte';
</script>

<!-- Absolutes -->
<div class="hidden lg:block w-12 h-12 absolute text-primary-300 top-8">
	<Block />
</div>
<div class="hidden lg:block w-12 h-12 absolute text-primary-500 top-64 right-0">
	<Circle />
</div>

<section
	class="grid justify-center grid-cols-1 px-8 pt-12 mx-auto gap-2 2xl:gap-10 max-w-7xl relative"
>
	<div class="flex">
		<div class="flex flex-col basis-1/12 relative">
			<div class="top-0 left-[calc(50%-14px)] h-[646px] absolute">
				<LinesHero />
				<div class="absolute text-primary-600 top-0 left-20 -z-10">
					<AjPrimary cls="block w-48" />
				</div>
			</div>
			<div class="block h-[646px] flex-none" />
			<CodeSvg />
			<GitLineGradient rotate={true} />
		</div>
		<div class="basis-11/12 pt-44 mt-44 pl-4 sm:pl-2 mb-40">
			<div class="flex w-full justify-center">
				<div class="max-w-2xl flex flex-col gap-8 text-center items-center">
					<div>
						<h1 class="sm:!text-6xl">
							<span class="relative">
								<div
									class="absolute w-8 h-8 -top-3 -left-3 sm:w-12 sm:h-12 sm:-top-4 sm:-left-6 md:w-16 md:h-16 md:-top-6 md:-left-8 -z-10"
								>
									<StarSvg />
								</div>
								U</span
							>nlock the power of Web Development
						</h1>
					</div>
					<div class="p-8 text-xl">
						Get the skills you need to become a better web developer today. High quality courses
						with projects to show off your new skills.
					</div>
					<div>
						<button class="bcu-button gap-1 variant-filled lg:text-3xl xl:text-4xl">
							Start learning for <span class="uppercase">free</span>
							<Icon src={ArrowRight} theme="mini" class="w-6" />
						</button>
					</div>
					<!-- TODO: Replace with actual users -->
					<div
						class="snap-x scroll-px-4 snap-mandatory scroll-smooth sm:flex gap-4 overflow-x-auto py-10 justify-center hidden"
					>
						<div>
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1682988242/main-codingcatdev-photo/podcast-guest/whitep4nth3r.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-20 md:-ml-12 lg:-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683058098/main-codingcatdev-photo/podcast-guest/guillermo-rauch.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-20 md:-ml-12 lg:-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683044362/main-codingcatdev-photo/podcast-guest/jlengstorf.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-20 md:-ml-12 lg:-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683042894/main-codingcatdev-photo/podcast-guest/jonmeyers_io.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-20 md:-ml-12 lg:-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683044101/main-codingcatdev-photo/podcast-guest/jeffdelaney23.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-20 md:-ml-12 lg:-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1682991864/main-codingcatdev-photo/podcast-guest/cassidoo.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-20 md:-ml-12 lg:-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683033670/main-codingcatdev-photo/podcast-guest/maxcell.jpg"
								class="snap-center shrink-0 border-2 border-primary-500"
							/>
						</div>
					</div>
					<div>
						<p>Join 5,000+ students and level up your skills</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
