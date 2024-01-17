<script lang="ts">
	import { browser } from '$app/environment';
</script>

<slot />

{#if browser}
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{/if}
