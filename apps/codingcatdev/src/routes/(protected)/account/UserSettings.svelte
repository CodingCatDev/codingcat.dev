<script lang="ts">
	import { auth, firestore, updateUser } from '$lib/client/firebase';
	import type { UserDoc } from '$lib/types';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { userStore, docStore } from 'sveltefire';
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import type { PageData } from './$types';
	export let data: PageData;

	const user = userStore(auth);
	const docRef = 'users/' + $user?.uid;
	const userDoc = docStore<UserDoc>(firestore, docRef);

	const updateShowDrafts = async (e: Event) => {
		const target = e?.target as HTMLInputElement;
		const update = await updateUser(docRef, {
			pro: {
				settings: {
					showDrafts: target?.checked
				}
			}
		});
		toastStore.trigger({
			message: 'Saved.',
			background: 'variant-filled-success'
		});
	};
</script>

<div class="flex flex-col justify-between w-full gap-2 card md:flex-row md:gap-8">
	<div class="flex flex-col w-full gap-4 p-8 md:flex-row md:justify-between md:gap-8">
		<div class="md:w-1/3">
			<h2 class="mb-8">User Settings</h2>
			<p>Settings for your account.</p>
		</div>
		<div class="flex flex-col gap-4 p-8 card md:w-2/3">
			<!-- TODO: Add enhanced -->
			<div class="flex flex-col gap-2">
				<SlideToggle
					name="showDrafts"
					checked={$userDoc?.pro?.settings?.showDrafts}
					disabled={!data?.user?.stripeRole}
					on:change={(e) => updateShowDrafts(e)}
				>
					<div class="flex gap-2">
						Show Drafts
						<div class="chip variant-filled-primary">Pro Feature</div>
					</div>
				</SlideToggle>
			</div>
		</div>
	</div>
</div>
