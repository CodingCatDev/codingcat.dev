<script lang="ts">
	import LayoutWrapper from '../../(layout-partials)/LayoutWrapper.svelte';
	import LogoutButton from '../../login/LogoutButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<LayoutWrapper>
	<h1>{data.user?.email}</h1>
	<LogoutButton />
</LayoutWrapper>
