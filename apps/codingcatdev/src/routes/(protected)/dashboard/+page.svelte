<script lang="ts">
	import ProButton from '../ProButton.svelte';
	import type { PageData } from './$types';
	import DashboardWelcome from './DashboardWelcome.svelte';
	import DashboardCTA from './DashboardCTA.svelte';
	import ContentCards from '../../(content-list)/ContentCards.svelte';
	import { ContentType } from '$lib/types';

	export let data: PageData;
</script>

<div class="flex justify-center p-4">
	<div class="xl:max-w-7xl mt-10 flex-1">
		<section class="flex flex-col gap-2 md:gap-8">
			<div class="flex justify-between">
				<h1>Dashboard</h1>
				<a class="btn variant-filled" href="/account">Account</a>
			</div>
			<div class="flex flex-col items-center md:items-stretch md:flex-row gap-4">
				<DashboardWelcome {data} />
				{#if !data?.user?.stripeRole}
					<ProButton products={data.products} uid={data.user?.uid} />
				{/if}
			</div>
			<DashboardCTA />
			<div>
				<h3>✨ New and Featured</h3>
				<div class="p-4">
					<ContentCards {data} />
				</div>
			</div>
			<div>
				<h3>📅 Coming Soon</h3>
				<div class="p-4">
					{#if data?.showDrafts}
						<ContentCards data={{ contentType: data.contentType, content: data.comingSoon }} />
					{:else}
						<div class="flex flex-col gap-2">
							<div class="text-xl">You must be a Pro member to preview upcoming courses.</div>
							<ProButton products={data.products} uid={data.user?.uid} />
						</div>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>
