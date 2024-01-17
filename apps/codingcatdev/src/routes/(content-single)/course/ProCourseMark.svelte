<script lang="ts">
	import Locked from './Locked.svelte';
	import type { LayoutData } from './$types';
	import { ContentType, type Content, type Course, type Lesson, type Saved } from '$lib/types';
	import ProCourseCompleted from './ProCourseCompleted.svelte';
	import ProCourseBookmarked from './ProCourseBookmarked.svelte';
	import ProSaved from './ProSaved.svelte';
	import { auth } from '$lib/client/firebase';
	import { userStore } from 'sveltefire';
	import { Bookmark } from '@steeze-ui/heroicons';

	/* DATA */
	export let data: {
		content?: Content;
		course?: Course | Saved;
		user?: LayoutData['user'];
	};
	export let lesson: Lesson | undefined = undefined;
	export let locked: boolean | undefined = undefined;
	export let contentType: ContentType | undefined = undefined;

	const user = userStore(auth);
</script>

{#if data?.user?.stripeRole && $user?.uid}
	{#if data?.course !== undefined}
		<div class="flex w-12 gap-1">
			<ProCourseCompleted
				data={{
					course: data.course
				}}
				{lesson}
			/>
			<ProCourseBookmarked
				data={{
					course: data.course
				}}
				{lesson}
			/>
		</div>
	{:else if data?.content}
		<div class="flex">
			<ProSaved
				data={{
					content: data.content
				}}
				savedRef="/bookmarked"
				savedIconSource={Bookmark}
			/>
		</div>
	{/if}
{:else if contentType === ContentType.lesson}
	<div class="flex w-12 gap-1">
		<Locked {locked} />
	</div>
{/if}
