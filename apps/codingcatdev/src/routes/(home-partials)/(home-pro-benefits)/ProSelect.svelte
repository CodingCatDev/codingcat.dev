<script>
	import { RadioGroup, RadioItem } from '@codingcatdev/blackcatui';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';

	let subscription = 1;
	export let login = false;
</script>

<div class="bcu-card bg-gradient-to-b from-surface-700 to-primary-500 p-8 shadow-lg lg:w-full">
	<header class="bcu-card-header flex justify-center">
		<RadioGroup hover="hover:variant-ghost-surface" background="bg-primary-200-700-token">
			<RadioItem bind:group={subscription} name="justify" value={1}>Annual</RadioItem>
			<RadioItem bind:group={subscription} name="justify" value={0}>Monthly</RadioItem>
		</RadioGroup>
	</header>
	<section class="p-8 sm:p-20 flex justify-center text-surface-100">
		<div class="flex flex-col items-center relative">
			{#if subscription}
				<div class="absolute text-2xl top-0 left-0">$</div>
				<h6 class="!text-9xl !font-medium">48</h6>
				<div class="mb-6">
					<span class="font-medium text-xs">Save $12 compared to monthly</span>
				</div>
			{:else}
				<div class="absolute text-2xl top-0 left-0">$</div>
				<h6 class="!text-9xl !font-medium">5</h6>
				<div class="mb-6"><span class="font-medium text-xs">Just $0.17 per day</span></div>
			{/if}
		</div>
	</section>
	{#if login}
		<footer class="bcu-card-footer text-surface-100-800-token">
			<div class="flex flex-col items-center gap-8">
				<a href="/terms-of-use" class="!text-surface-100-800-token">Terms & Conditions</a>
				<p>Login Above to Get Started</p>
			</div>
		</footer>
	{:else}
		<footer class="bcu-card-footer text-surface-100-800-token">
			<div class="flex flex-col items-center gap-8">
				<a href="/terms-of-use" class="!text-surface-100-800-token">Terms & Conditions</a>
				<a href="/login?redirectTo=/dashboard" class="bcu-button variant-filled-surface w-full"
					>Let's do it!</a
				>
			</div>
		</footer>
	{/if}
</div>
