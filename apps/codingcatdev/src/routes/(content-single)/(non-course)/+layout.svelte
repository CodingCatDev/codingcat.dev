<script lang="ts">
	import { AppShell, TableOfContents } from '@skeletonlabs/skeleton';
	import RecentPostsList from './RecentPostsList.svelte';
	import { ContentType } from '$lib/types';
	import { storeCurrentUrl } from '$lib/stores/stores';
	import Content from './Content.svelte';
	import Author from './Author.svelte';
	import Guest from './Guest.svelte';
	import Sponsor from './Sponsor.svelte';

	export let data;
</script>

<!-- App Shell -->
<AppShell
	regionPage="overflow-y-scroll"
	slotPageFooter="pt-4 bg-surface-50-900-token block xl:hidden"
	slotSidebarRight="hidden xl:block"
>
	<!-- Page Content -->
	{#if data.content.type === ContentType.author}
		<Author {data}>
			<slot />
		</Author>
	{:else if data.content.type === ContentType.guest}
		<Guest {data}>
			<slot />
		</Guest>
	{:else if data.content.type === ContentType.sponsor}
		<Sponsor {data}>
			<slot />
		</Sponsor>
	{:else}
		<Content {data}>
			<slot />
		</Content>
	{/if}
	<svelte:fragment slot="sidebarRight">
		<!-- Div takes up same room as fixed -->
		<div class="w-[19.5rem] xl:w-96" />
		<div class="fixed top-[5.125rem] bottom-24 w-[19.5rem] xl:w-96 py-10 overflow-y-auto">
			<div class="flex flex-col gap-2 px-8 md:gap-8">
				{#key $storeCurrentUrl}
					<TableOfContents />
				{/key}
				{#if data?.course}
					<RecentPostsList contentType={ContentType.course} list={data.course} />
				{/if}
				{#if data?.podcast}
					<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
				{/if}
				{#if data?.post}
					<RecentPostsList contentType={ContentType.post} list={data.post} />
				{/if}
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="pageFooter">
		<div class="flex flex-col gap-2 px-2 md:gap-8">
			{#if data?.course}
				<RecentPostsList contentType={ContentType.course} list={data.course} />
			{/if}
			{#if data?.podcast}
				<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
			{/if}
			{#if data?.post}
				<RecentPostsList contentType={ContentType.post} list={data.post} />
			{/if}
		</div>
	</svelte:fragment>
</AppShell>
