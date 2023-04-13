<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import { openStripePortal } from '$lib/client/firebase';
	import { ProgressCircle } from '@codingcatdev/blackcatui';
	import LayoutWrapper from '../../(layout-partials)/LayoutWrapper.svelte';
	import LogoutButton from '../../login/LogoutButton.svelte';
	import ProButton from '../ProButton.svelte';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';

	let redirecting = false;

	const onOpenMembership = async () => {
		redirecting = true;
		await openStripePortal();
	};
</script>

<LayoutWrapper>
	<h1>{data.user?.email}</h1>
	<LogoutButton />

	{#if data?.user?.stripeRole}
		<div class="bcu-card p-8 flex flex-col gap-2 md:gap-8">
			<h2>Membership</h2>

			Current Membership: {data?.user?.stripeRole}

			{#if redirecting}
				<button class="bcu-button variant-filled-surface flex gap-2">
					Redirecting
					<ProgressCircle
						stroke={100}
						meter="stroke-primary-50"
						track="stroke-primary-500/30"
						class="w-8"
					/>
				</button>
			{:else}
				<button
					class="bcu-button variant-filled-surface flex gap-2"
					on:click|once={onOpenMembership}
				>
					Open Membership
					<Icon src={ArrowTopRightOnSquare} theme="mini" class="w-8" />
				</button>
			{/if}
		</div>
	{:else}
		<ProButton products={data.products} uid={data.user?.uid} />
	{/if}
</LayoutWrapper>
