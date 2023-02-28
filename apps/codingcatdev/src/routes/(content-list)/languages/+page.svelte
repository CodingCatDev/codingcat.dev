<script>
	import ContentCards from '$lib/components/content/ContentCards.svelte';
	import { ContentType } from '$lib/types/index';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<ContentCards type={ContentType.language} {data} />
