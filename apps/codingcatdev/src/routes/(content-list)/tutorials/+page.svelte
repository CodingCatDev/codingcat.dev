<script lang="ts">
	import ContentCards from '../ContentCards.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<ContentCards {data} />
