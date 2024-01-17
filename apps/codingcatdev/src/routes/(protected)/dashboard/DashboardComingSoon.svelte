<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bookmark, Calendar, CalendarDays } from '@steeze-ui/heroicons';
	import ContentCards from '../../(content-list)/ContentCards.svelte';
	import ProButton from '../ProButton.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div>
	<div class="flex gap-1">
		<div class="w-8"><Icon src={CalendarDays} theme="solid" /></div>
		<h3>Coming Soon</h3>
	</div>
	{#if !data?.user?.stripeRole}
		<div class="flex flex-col gap-2">
			<div class="text-xl">You must be a Pro member to preview upcoming courses.</div>
			<ProButton products={data.products} uid={data.user?.uid} />
		</div>
	{:else if data?.showDrafts}
		<ContentCards
			data={{ contentType: data.contentType, content: data.comingSoon, user: data.user }}
		/>
	{:else}
		<div class="flex">
			<div class="text-xl">
				You have chosen to not show drafts, if you would like to start seeing them again go to your <a
					href="/account">Account</a
				>.
			</div>
		</div>
	{/if}
</div>
