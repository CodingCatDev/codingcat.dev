<script>
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';

	let subscription = 1;
	export let login = false;
</script>

<div class="p-8 shadow-lg card variant-filled-surface lg:w-full">
	<header class="flex justify-center card-header">
		<RadioGroup hover="hover:variant-ghost-surface" background="bg-surface-600">
			<RadioItem bind:group={subscription} name="justify" value={1}>Annual</RadioItem>
			<RadioItem bind:group={subscription} name="justify" value={0}>Monthly</RadioItem>
		</RadioGroup>
	</header>
	<section class="flex justify-center p-8 sm:p-20">
		<div class="relative flex flex-col items-center">
			{#if subscription}
				<div class="absolute top-0 left-0 text-2xl">$</div>
				<h6 class="!text-9xl !font-medium">199</h6>
				<div class="mb-6">
					<span class="text-xs font-medium">Save $149 compared to monthly</span>
				</div>
			{:else}
				<div class="absolute top-0 left-0 text-2xl">$</div>
				<h6 class="!text-9xl !font-medium">29</h6>
				<div class="mb-6"><span class="text-xs font-medium">Just $0.79 per day</span></div>
			{/if}
		</div>
	</section>
	{#if login}
		<footer class="card-footer">
			<div class="flex flex-col items-center gap-8">
				<a href="/terms-of-use" class="!text-on-surface-token">Terms & Conditions</a>
				<p>Login Above to Get Started</p>
			</div>
		</footer>
	{:else}
		<footer class="card-footer">
			<div class="flex flex-col items-center gap-8">
				<a href="/terms-of-use" class="!text-on-surface-token">Terms & Conditions</a>
				<a href="/login?redirectTo=/dashboard" class="w-full btn variant-filled-surface"
					>Let's do it!</a
				>
			</div>
		</footer>
	{/if}
</div>
