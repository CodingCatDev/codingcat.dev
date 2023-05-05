<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	// Initialize the CMS object

	onMount(() => {
		// CMS.init();
	});
	// Now the registry is available via the CMS object.
	// CMS.registerPreviewTemplate('my-template', MyTemplate)
</script>

<div id="nc-root" />

{#if browser}
	<script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
{/if}
