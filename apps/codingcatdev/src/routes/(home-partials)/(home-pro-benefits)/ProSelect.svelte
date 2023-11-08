<script>
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';

	let subscription = 1;
	export let login = false;
</script>

<div class="card variant-filled-surface p-8 shadow-lg lg:w-full">
	<header class="card-header flex justify-center">
		<RadioGroup hover="hover:variant-ghost-surface" background="bg-surface-600">
			<RadioItem bind:group={subscription} name="justify" value={1}>Annual</RadioItem>
			<RadioItem bind:group={subscription} name="justify" value={0}>Monthly</RadioItem>
		</RadioGroup>
	</header>
	<section class="p-8 sm:p-20 flex justify-center">
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
				<a href="/login?redirectTo=/dashboard" class="btn variant-filled-surface w-full"
					>Let's do it!</a
				>
			</div>
		</footer>
	{/if}
</div>
