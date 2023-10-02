<script>
	import LinesHero from './LinesHeroSvg.svelte';
	import CodeSvg from './CodeSvg.svelte';
	import GitLineGradient from './GitLineGradient.svelte';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowRight } from '@steeze-ui/heroicons';
	import StarSvg from './StarSvg.svelte';

	import { Avatar } from '@codingcatdev/blackcatui';
</script>

<section
	class="grid justify-center grid-cols-1 p-8 mx-auto gap-2 2xl:gap-10 2xl:min-h-768 max-w-7xl"
>
	<div class="flex">
		<div class="flex flex-col basis-1/12 relative">
			<div class="top-0 left-[calc(50%-14px)] h-[646px] absolute">
				<LinesHero />
			</div>
			<div class="block h-[646px] flex-none" />
			<CodeSvg />
			<GitLineGradient />
		</div>
		<div class="basis-11/12 pt-44 mt-44 pl-4 sm:pl-2">
			<div class="flex w-full justify-center">
				<div class="max-w-lg flex flex-col gap-8 text-center relative items-center">
					<div class="absolute w-16 h-16 -top-8 -left-2 -z-10">
						<StarSvg />
					</div>
					<h1>Unlock the power of Web Development</h1>
					<div class="p-8 text-xl">
						Get the skills you need to become a better web developer today. High quality courses
						with projects to show off your new skills.
					</div>
					<div>
						<button class="bcu-button gap-1 variant-filled">
							Start learning for <span class="uppercase">free</span>
							<Icon src={ArrowRight} theme="mini" class="w-6" />
						</button>
					</div>
					<!-- TODO: Replace with actual users -->
					<div class="flex">
						<div>
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1682988242/main-codingcatdev-photo/podcast-guest/whitep4nth3r.jpg"
								class="border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683058098/main-codingcatdev-photo/podcast-guest/guillermo-rauch.jpg"
								class="border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683044362/main-codingcatdev-photo/podcast-guest/jlengstorf.jpg"
								class="border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683042894/main-codingcatdev-photo/podcast-guest/jonmeyers_io.jpg"
								class="border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683044101/main-codingcatdev-photo/podcast-guest/jeffdelaney23.jpg"
								class="border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1682991864/main-codingcatdev-photo/podcast-guest/cassidoo.jpg"
								class="border-2 border-primary-500"
							/>
						</div>
						<div class="-ml-8 z-10">
							<Avatar
								src="https://media.codingcat.dev/image/upload/v1683033670/main-codingcatdev-photo/podcast-guest/maxcell.jpg"
								class="border-2 border-primary-500"
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
