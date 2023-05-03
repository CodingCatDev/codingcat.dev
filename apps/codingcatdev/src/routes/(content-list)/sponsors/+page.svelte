<script lang="ts">
	import SponsorCards from './SponsorCards.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<SponsorCards {data} />
