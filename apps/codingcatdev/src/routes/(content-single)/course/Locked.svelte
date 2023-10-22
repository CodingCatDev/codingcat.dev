<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LockClosed, LockOpen } from '@steeze-ui/heroicons';

	/* DATA */
	export let locked: boolean;
</script>

{#if locked}
	<Icon src={LockClosed} theme="solid" />
{:else}
	<Icon src={LockOpen} theme="solid" />
{/if}
