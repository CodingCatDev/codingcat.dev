<script lang="ts">
	import { auth, firestore, updateUser } from '$lib/client/firebase';
	import { docStore, userStore } from 'sveltefire';
	import { Bookmark } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { LayoutData } from './$types';
	import type { Lesson, UserDoc } from '$lib/types';

	/* DATA */
	export let data: LayoutData;
	export let lesson: Lesson;

	const user = userStore(auth);
	const docRef = 'users/' + $user?.uid;
	const userDoc = docStore<UserDoc>(firestore, docRef);
	const lessonRef = `/course/${data.course.slug}/lesson/${lesson.slug}`;
</script>

{#if $userDoc?.pro?.bookmarked?.filter((c) => c.path === lessonRef)?.length}
	<button
		on:click={() =>
			updateUser(docRef, {
				pro: {
					bookmarked: [...($userDoc?.pro?.bookmarked?.filter((c) => c.path !== lessonRef) || [])]
				}
			})}
		class="!p-0"
	>
		<Icon src={Bookmark} theme="solid" />
	</button>
{:else}
	<button
		on:click={() =>
			updateUser(docRef, {
				pro: {
					bookmarked: [
						...($userDoc?.pro?.bookmarked || []),
						...[{ date: Date.now(), path: lessonRef }]
					]
				}
			})}
		class="!p-0"
	>
		<Icon src={Bookmark} />
	</button>
{/if}
