<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LockClosed, LockOpen } from '@steeze-ui/heroicons';

	/* DATA */
	export let locked: boolean | undefined;
</script>

{#if locked}
	<Icon src={LockClosed} theme="solid" class="w-6" />
{:else}
	<Icon src={LockOpen} theme="solid" class="w-6" />
{/if}
