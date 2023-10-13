<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import LayoutWrapper from '../../(layout-partials)/LayoutWrapper.svelte';
	import AccountCard from './AccountCard.svelte';
	import MembershipCard from './MembershipCard.svelte';
	import SupportCard from './SupportCard.svelte';
</script>

<LayoutWrapper>
	<div class="flex justify-center p-4 w-full">
		<div class="xl:max-w-7xl w-full flex-1">
			<div class="flex justify-between mb-4">
				<h1>Account and Settings</h1>
				<a class="bcu-button variant-filled" href="/dashboard">Dashboard</a>
			</div>
			<div class="flex flex-col w-full jSustify-center items-start gap-4">
				<AccountCard {data} />
				<MembershipCard {data} />
				<SupportCard />
			</div>
		</div>
	</div>
</LayoutWrapper>
