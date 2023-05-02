<script lang="ts">
	import AuthorCards from './AuthorCards.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<AuthorCards {data} />
