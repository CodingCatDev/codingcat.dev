<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import { openStripePortal } from '$lib/client/firebase';
	import { ProgressCircle } from '@skeletonlabs/skeleton';
	import ProButton from '../ProButton.svelte';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';

	let redirecting = false;

	const onOpenMembership = async () => {
		redirecting = true;
		await openStripePortal();
	};
</script>

{#if data?.user?.stripeRole}
	<div class="card p-8 flex flex-col gap-2 md:gap-8 w-full">
		<h2>Membership</h2>

		Current Membership: {data?.user?.stripeRole}

		{#if redirecting}
			<button class="btn variant-filled-surface flex gap-2">
				Redirecting
				<ProgressCircle
					stroke={100}
					meter="stroke-primary-50"
					track="stroke-primary-500/30"
					class="w-8"
				/>
			</button>
		{:else}
			<button class="btn variant-filled-surface flex gap-2" on:click|once={onOpenMembership}>
				Open Membership
				<Icon src={ArrowTopRightOnSquare} theme="mini" class="w-8" />
			</button>
		{/if}
	</div>
{:else}
	<div class="card flex flex-col md:flex-row justify-between gap-2 md:gap-8 w-full md:p-8">
		<div class="flex flex-col gap-2 md:gap-8">
			<div class="p-8 md:p-0">
				<h2 class="mb-8">Membership</h2>

				<p>Current Membership: Free-tier</p>
			</div>
		</div>
		<ProButton products={data.products} uid={data.user?.uid} />
	</div>
{/if}
