<script lang="ts">
	import ProButton from '../ProButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex justify-center p-4">
	<div class="xl:max-w-7xl mt-10 flex-1">
		<section class="flex flex-col gap-2 md:gap-8">
			<div class="flex justify-between">
				<h1>Dashboard</h1>
				<a class="bcu-button variant-filled" href="/account">Account</a>
			</div>
			<div class="flex flex-col items-center md:items-start md:flex-row gap-4">
				<div class="flex flex-col w-full gap-2 mr-2">
					<div class="bcu-card variant-filled p-6 flex flex-col gap-4">
						<h2 class="text-md p-2">Welcome, {data.user?.email}!</h2>
						<p class="p-2">Now that you're here, get involved!</p>
					</div>
					<div class="bcu-card py-8 flex flex-col xl:flex-row justify-around items-center gap-2">
						<div>Join the Discord!</div>
						<!-- TODO: make these links w/ hover effects -->
						<div>Sign up for the Newsletter</div>
						<!-- TODO: make these links w/ hover effects -->
						<div>Go Pro for More!</div>
						<!-- TODO: make these links -->
					</div>
				</div>
				{#if !data?.user?.stripeRole}
					<ProButton products={data.products} uid={data.user?.uid} />
				{/if}
			</div>
		</section>
	</div>
</div>
