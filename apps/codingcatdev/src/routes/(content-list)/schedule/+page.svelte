<script>
	import ContentCards from '../ContentCards.svelte';
	import { ContentType } from '$lib/types/index';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<ContentCards type={ContentType.post} {data} />
