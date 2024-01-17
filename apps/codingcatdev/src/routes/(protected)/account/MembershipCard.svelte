<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import ProButton from '../ProButton.svelte';
	import StripePortalButton from '../StripePortalButton.svelte';
</script>

{#if data?.user?.stripeRole}
	<div class="card p-8 flex flex-col gap-2 md:gap-8 w-full">
		<h2>Membership</h2>
		<div class="flex gap-2">
			Current Membership:<span class="chip variant-filled">{data?.user?.stripeRole}</span>
		</div>
		<StripePortalButton />
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
