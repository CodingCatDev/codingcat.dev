<script lang="ts">
	import { AppShell, TableOfContents } from '@codingcatdev/blackcatui';
	import RecentPostsList from './RecentPostsList.svelte';
	import { ContentType } from '$lib/types';

	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<!-- App Shell -->
<AppShell regionPage="overflow-y-scroll" slotPageFooter="pt-4 bg-surface-50-900-token" }>
	<!-- Page Content -->
	<slot />
	<svelte:fragment slot="bcu-app-shell-sidebar-right">
		<!-- Div takes up same room as fixed -->
		<div class="w-[19.5rem] xl:w-96" />
		<div
			class="fixed z-20 top-[5.125rem] bottom-24 w-[19.5rem] xl:w-96 py-10 overflow-y-auto hidden xl:block"
		>
			<div class="px-8 flex flex-col gap-2 md:gap-8">
				<TableOfContents target=".markdown" />
				<RecentPostsList contentType={ContentType.course} list={data.course} />
				<RecentPostsList contentType={ContentType.tutorial} list={data.tutorial} />
				<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
				<RecentPostsList contentType={ContentType.post} list={data.post} />
			</div>
		</div>
	</svelte:fragment>
	<!-- <svelte:fragment slot="bcu-app-shell-page-footer">new</svelte:fragment> -->
</AppShell>
