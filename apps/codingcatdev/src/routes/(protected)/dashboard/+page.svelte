<script lang="ts">
	import ProButton from '../ProButton.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-col gap-4 p-2">
	<div class="p-4 sm:p-10">
		<section class="flex flex-col gap-2 md:gap-8">
			<div class="flex justify-between">
				<h1>Dashboard</h1>
				<a class="bcu-button variant-filled" href="/account">Account & Settings</a>
			</div>
			<div class="flex flex-col md:flex-row gap-2">
				<div class="flex flex-col w-full gap-2">
					<div class="bcu-card variant-filled">Welcome Message</div>
					<div class="bcu-card variant-filled">Join Discord for LBT</div>
				</div>
				<ProButton products={data.products} />
			</div>
		</section>
	</div>
</div>
