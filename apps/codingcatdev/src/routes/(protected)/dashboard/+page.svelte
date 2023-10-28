<script lang="ts">
	import ProButton from '../ProButton.svelte';
	import DashboardWelcome from './DashboardWelcome.svelte';
	import DashboardCTA from './DashboardCTA.svelte';
	import DashboardNewFeatured from './DashboardNewFeatured.svelte';

	import type { PageData } from './$types';
	import DashboardComingSoon from './DashboardComingSoon.svelte';
	import DashboardBookmarks from './DashboardBookmarks.svelte';
	import { auth } from '$lib/client/firebase';
	import { userStore } from 'sveltefire';
	import DashboardCompleted from './DashboardCompleted.svelte';

	export let data: PageData;

	const user = userStore(auth);
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
			<DashboardNewFeatured {data} />
			<DashboardComingSoon {data} />
			{#if $user?.uid}
				<DashboardBookmarks {data} />
				<DashboardCompleted {data} />
			{/if}
			<DashboardCTA />
		</section>
	</div>
</div>
