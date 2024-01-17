<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import LayoutWrapper from '../../(layout-partials)/LayoutWrapper.svelte';
	import AccountCard from './AccountCard.svelte';
	import MembershipCard from './MembershipCard.svelte';
	import UserSettings from './UserSettings.svelte';
	import { auth } from '$lib/client/firebase';
	import { userStore } from 'sveltefire';
	import Purchases from '../Purchases.svelte';

	const user = userStore(auth);
</script>

<LayoutWrapper>
	<div class="flex justify-center p-4 w-full">
		<div class="xl:max-w-7xl w-full flex-1">
			<div class="flex justify-between mb-4">
				<h1>Account and Settings</h1>
				<a class="btn variant-filled" href="/dashboard">Dashboard</a>
			</div>
			<div class="flex flex-col w-full jSustify-center items-start gap-4">
				<AccountCard {data} />
				<MembershipCard {data} />
				<Purchases />
				{#if $user?.uid}
					<UserSettings {data} />
				{/if}
			</div>
		</div>
	</div>
</LayoutWrapper>
