<script>
	import ContentCards from '../ContentCards.svelte';
	import { ContentType } from '$lib/types/index';

	export let data;
</script>

<ContentCards type={ContentType.tutorial} {data} />
