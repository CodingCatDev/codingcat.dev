<script lang="ts">
	import GuestCards from './GuestCards.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<GuestCards {data} />
