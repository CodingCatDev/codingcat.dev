<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bookmark } from '@steeze-ui/heroicons';
	import ProButton from '../ProButton.svelte';
	import type { PageData } from './$types';
	import { collectionStore, userStore } from 'sveltefire';
	import { auth, firestore } from '$lib/client/firebase';
	import type { Saved } from '$lib/types';
	const user = userStore(auth);

	export let data: PageData;
	const bookmarkedRef = 'users/' + $user?.uid + `/bookmarked`;
	const bookmarked = collectionStore<Saved>(firestore, bookmarkedRef);
</script>

<div>
	<div class="flex gap-1">
		<div class="w-8"><Icon src={Bookmark} theme="solid" /></div>
		<h3>Bookmarks</h3>
	</div>
	{#if !data?.user?.stripeRole}
		<div class="flex flex-col gap-2">
			<div class="text-xl">You must be a Pro member to preview upcoming courses.</div>
			<ProButton products={data.products} uid={data.user?.uid} />
		</div>
		<!-- {:else if data?.showDrafts}
		<ContentCards data={{ contentType: data.contentType, content: data.comingSoon }} /> -->
	{:else}
		<!-- <div class="flex">
			<div class="text-xl">
				You have chosen to not show drafts, if you would like to start seeing them again go to your <a
					href="/account">Account</a
				>.
			</div>
		</div> -->

		{#each $bookmarked as bookmark}
			<div>{bookmark.title}</div>
			{#if bookmark?.lesson}
				<div class="flex flex-col">
					{#each bookmark.lesson as lesson}
						<div>{lesson.title}</div>
					{/each}
				</div>
			{/if}
		{/each}
	{/if}
</div>
