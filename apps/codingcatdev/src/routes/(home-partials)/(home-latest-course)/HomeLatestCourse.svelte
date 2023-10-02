<script>
	import Video from '$lib/components/content/Video.svelte';
	import CodeSvg from '../(home-campaign)/CodeSvg.svelte';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';
	import CheckOutArrow from './CheckOutArrow.svelte';
	import CoursesSvg from './CoursesSvg.svelte';
</script>

<div class=" bg-surface-800-100-token h-[800px]" />

<section
	class="grid justify-center grid-cols-1 px-8 mx-auto gap-2 2xl:gap-10 2xl:min-h-768 max-w-7xl relative z-10"
>
	<div class="flex">
		<div class="flex flex-col basis-1/12 relative">
			<GitLineGradient />
			<CoursesSvg />
			<GitLineGradient rotate={true} />
		</div>
		<div class="basis-11/12 pt-44 pl-4 sm:pl-2 -mt-80">
			<div
				class="max-w-6xl -mt-80 flex flex-col gap-8 sm:gap-24 text-surface-50-900-token relative"
			>
				<div class="max-w-lg flex flex-col gap-8 text-center relative items-center mx-auto">
					<h2>Svelte Front-to-Back</h2>
					<p class="!text-lg sm:!text-xl">
						Learn how to build performant full-stack web applications using the Svelte framework
						from start to production
					</p>
				</div>
				<div class="check-out-text">Check out our latest course!</div>
				<div class="check-out-arrow"><CheckOutArrow /></div>
				<div class="block">
					<Video class="rounded-2xl" src="https://youtu.be/sp7qvtvCFv8" title="Svelte" />
				</div>

				<!-- Lessons -->
				<div
					class="grid grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 gap-4 sm:gap-8 relative py-8 sm:py-0"
				>
					<div class="hidden absolute w-full h-full sm:flex justify-center items-center -z-10">
						<div class="bg-surface-800-100-token rounded-full h-24 w-24" />
					</div>
					<div class="bcu-card !text-surface-800-100-token !bg-surface-100-800-token">
						<div class="p-4 space-y-4">
							<div class="text-4xl font-bold text-primary-400-500-token">01</div>
							<h2>What is Svelte?</h2>
							<article>
								<p>
									Svelte is a modern JavaScript framework that is designed to be fast, simple, and
									scalable.
								</p>
							</article>
						</div>
					</div>
					<div class="bcu-card !text-surface-800-100-token !bg-surface-100-800-token">
						<div class="p-4 space-y-4">
							<div class="text-4xl font-bold text-primary-400-500-token">02</div>
							<h2>Getting Started</h2>
							<article>
								<p>Explanation of Svelte vs. SvelteKit and other metaframeworks</p>
							</article>
						</div>
					</div>
					<div class="bcu-card !text-surface-800-100-token !bg-surface-100-800-token">
						<div class="p-4 space-y-4">
							<div class="text-4xl font-bold text-primary-400-500-token">03</div>

							<h2>Starting To Code</h2>
							<article>
								<p>Setup VSCode and Get Started writing Svelte</p>
							</article>
						</div>
					</div>
					<div class="bcu-card !text-surface-800-100-token !bg-surface-100-800-token">
						<div class="p-4 space-y-4">
							<div class="text-4xl font-bold text-primary-400-500-token">04</div>

							<h2>Components and Props</h2>
							<article>
								<p>
									Components are reusable pieces of code that can be used to build complex user
									interfaces, props pass data within those components.
								</p>
							</article>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@media (max-width: 390px) {
		.check-out-text {
			display: none;
		}
		.check-out-arrow {
			display: none;
		}
	}
	@media (min-width: 390px) {
		.check-out-text {
			position: absolute;

			width: 144px;
			height: 166px;
			left: 0px;
			top: -120px;

			font-family: 'Shadows Into Light';
			font-style: normal;
			font-weight: 400;
			font-size: 24px;
			line-height: 130.14%;
			text-align: center;

			transform: rotate(-20deg);
		}
		.check-out-arrow {
			position: absolute;

			width: 41px;
			height: 243px;
			left: -40px;
			top: -140px;

			transform: rotate(6.1deg);
		}
	}
	@media (min-width: 640px) {
		.check-out-text {
			width: 144px;
			height: 166px;
			left: 100px;
			top: -150px;

			font-size: 34px;
		}
		.check-out-arrow {
			width: 41px;
			height: 243px;
			left: 80px;
			top: -120px;
		}
	}
	@media (min-width: 1024px) {
		.check-out-text {
			width: 344px;
			height: 166px;
			left: 0px;
			top: -140px;

			font-size: 64px;
		}
		.check-out-arrow {
			width: 141px;
			height: 343px;
			left: -80px;
			top: 20px;
		}
	}
	@media (min-width: 1280px) {
		.check-out-text {
			width: 344px;
			height: 166px;
			left: 0px;
			top: -100px;

			font-size: 64px;
		}
		.check-out-arrow {
			width: 141px;
			height: 343px;
			left: -80px;
			top: 60px;
		}
	}
</style>
