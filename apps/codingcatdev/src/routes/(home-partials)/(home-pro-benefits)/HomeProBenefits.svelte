<script>
	import { RocketLaunch, Clock, ChatBubbleBottomCenter } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';
	import CheckBadgeSvg from './CheckBadgeSvg.svelte';
	import ProSelect from './ProSelect.svelte';
	import CheckOutArrow from '../(home-latest-course)/CheckOutArrow.svelte';
	import { inView } from '$lib/actions/inView';
	import { fade } from 'svelte/transition';
	let priceVisible = false;
	export let login = false;
</script>

<section class={`bg-primary-200-700-token ${login ? 'rounded-lg' : ''}`}>
	<div class="grid justify-center grid-cols-1 px-8 mx-auto gap-2 2xl:gap-10 max-w-7xl relative">
		<div class="flex">
			{#if !login}
				<div class="flex flex-col basis-1/12 relative">
					<GitLineGradient />
					<CheckBadgeSvg />
					<GitLineGradient rotate={true} />
				</div>
			{/if}

			<div class="basis-11/12 pl-4 sm:pl-2 py-20 sm:py-48">
				<div class="flex flex-col lg:flex-row gap-8 items-center">
					<div class="sm:basis-2/3 flex flex-col justify-center gap-8">
						<div class="flex flex-col gap-4">
							{#if priceVisible}
								<div class="check-out-text" in:fade={{ delay: 300, duration: 300 }} out:fade>
									Subscribe today!
								</div>
								<div class="check-out-arrow" in:fade={{ delay: 300, duration: 300 }} out:fade>
									<CheckOutArrow />
								</div>
							{/if}
							<h2>Subscribe for Premium Benefits</h2>
							<p class="max-w-lg">
								Are you ready to take your experience to the next level? Our premium plan unlocks
								exclusive benefits that will help you achieve your goals faster.
							</p>
						</div>
						<div class="flex flex-col gap-4">
							<div class="flex items-center">
								<div class="flex h-full pr-4">
									<Icon src={RocketLaunch} theme="solid" class="w-6" />
								</div>
								<div class="flex flex-col">
									<h3>Advanced courses and tutorials</h3>
									<p class="max-w-lg">
										Get access to advanced courses and tutorials that cover the latest technologies
										and best practices in web development
									</p>
								</div>
							</div>
							<div class="flex items-center">
								<div class="flex h-full pr-4">
									<Icon src={Clock} theme="solid" class="w-6" />
								</div>
								<div class="flex flex-col">
									<h3>Lifetime access to all content</h3>
									<p class="max-w-lg">
										You can learn at your own pace and revisit the material as often as you need to.
									</p>
								</div>
							</div>
							<div class="flex items-center">
								<div class="flex h-full pr-4">
									<Icon src={ChatBubbleBottomCenter} theme="solid" class="w-6" />
								</div>
								<div class="flex flex-col">
									<h3>Personalized support</h3>
									<p class="max-w-lg">
										You'll get priority access to our support team and receive tailored advice and
										guidance to help you overcome any challenges you may face via Discord.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div
						class="sm:basis-1/3 flex"
						use:inView
						on:enter={() => (priceVisible = true)}
						on:exit={() => (priceVisible = false)}
					>
						<ProSelect {login} />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@media (max-width: 1024px) {
		.check-out-arrow {
			display: none;
		}
		.check-out-text {
			display: none;
		}
	}
	@media (min-width: 1024px) {
		.check-out-text {
			position: absolute;

			width: 144px;
			height: 166px;
			right: 650px;
			top: 66px;

			font-family: 'Shadows Into Light';
			font-style: normal;
			font-weight: 400;
			font-size: 64px;
			line-height: 130.14%;
			text-align: center;

			transform: rotate(-20deg);
		}
		.check-out-arrow {
			position: absolute;
			transform: rotate(65deg) scale(1, -1);

			width: 141px;
			height: 343px;
			right: 400px;
			top: -60px;
		}
	}
</style>
