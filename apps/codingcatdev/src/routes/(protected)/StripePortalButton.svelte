<script lang="ts">
	import { openStripePortal } from '$lib/client/firebase';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	let redirecting = false;

	const onOpenMembership = async () => {
		redirecting = true;
		await openStripePortal();
	};
</script>

{#if redirecting}
	<button class="btn variant-filled-surface flex gap-2">
		Redirecting
		<ProgressRadial
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
