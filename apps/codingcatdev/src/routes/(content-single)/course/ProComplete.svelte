<script lang="ts">
	import { auth, firestore, updateUser } from '$lib/client/firebase';
	import { docStore, userStore } from 'sveltefire';
	import { CheckCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { LayoutData } from './$types';
	import type { Lesson } from '$lib/types';

	/* DATA */
	export let data: LayoutData;
	export let lesson: Lesson;

	const user = userStore(auth);
	const docRef = 'users/' + $user?.uid;
	const userDoc = docStore(firestore, docRef);
	const lessonRef = `/course/${data.course.slug}/lesson/${lesson.slug}`;
</script>

{#if $userDoc?.completed?.includes(lessonRef)}
	<button
		on:click={() =>
			updateUser(docRef, { completed: [...$userDoc?.completed.filter((c) => c !== lessonRef)] })}
		class="!p-0"
	>
		<Icon src={CheckCircle} theme="solid" />
	</button>
{:else}
	<button
		on:click={() =>
			updateUser(docRef, { completed: [...($userDoc?.completed || []), ...[lessonRef]] })}
		class="!p-0"
	>
		<Icon src={CheckCircle} />
	</button>
{/if}
