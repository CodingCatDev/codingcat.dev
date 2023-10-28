<script lang="ts">
	import { auth, firestore } from '$lib/client/firebase';
	import { docStore, userStore } from 'sveltefire';
	import { Bookmark } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { LayoutData } from './$types';
	import type { Bookmarked, Lesson } from '$lib/types';
	import { deleteDoc, doc, setDoc } from 'firebase/firestore';

	/* DATA */
	export let lesson: Lesson | undefined = undefined;
	export let data: LayoutData;

	const user = userStore(auth);
	const collectionRef = 'users/' + $user?.uid + `/bookmarked`;
	const courseId = `${data.course.type}.${data.course.slug}`;
	const lessonId = `${lesson?.type}.${lesson?.slug}`;
	const ref = `${collectionRef}/${courseId}`;
	const bookmarked = docStore<Bookmarked>(firestore, ref);

	const completeAllLessons = () => {
		const updated = Date.now();
		const complete = true;

		return data.course.lesson
			? data.course.lesson?.map((l) => {
					return {
						id: `${l.type}.${l.slug}`,
						complete,
						updated
					};
			  })
			: [];
	};
	const completeLesson = () => {
		const course = {
			id: courseId,
			updated: Date.now(),
			lesson: [
				...($bookmarked?.lesson || []),
				...[
					{
						id: lessonId,
						updated: Date.now(),
						complete: true
					}
				]
			]
		};
		return {
			...course,
			complete: data.course.lesson?.length === course.lesson.length
		};
	};
</script>

<!-- Lesson -->
{#if lesson}
	{#if $bookmarked?.lesson?.filter((l) => l.id === lessonId && l.complete === true).length}
		<button
			on:click={(e) => {
				e.preventDefault();
				setDoc(
					doc(firestore, ref),
					{
						...$bookmarked,
						id: courseId,
						complete: false,
						updated: Date.now(),
						lesson: [...($bookmarked?.lesson?.filter((b) => b.id !== lessonId) || [])]
					},
					{ merge: true }
				);
			}}
			class="!p-0"
		>
			<Icon src={Bookmark} theme="solid" />
		</button>
	{:else}
		<button
			on:click={(e) => {
				e.preventDefault();
				setDoc(doc(firestore, ref), completeLesson(), { merge: true });
			}}
			class="!p-0"
		>
			<Icon src={Bookmark} />
		</button>
	{/if}
{:else}
	<!-- Course -->
	{#if $bookmarked?.complete}
		<button
			on:click={(e) => {
				e.preventDefault();
				deleteDoc(doc(firestore, ref));
			}}
			class="!p-0"
		>
			<Icon src={Bookmark} theme="solid" />
		</button>
	{:else}
		<button
			on:click={(e) => {
				e.preventDefault();
				setDoc(
					doc(firestore, ref),
					{
						id: courseId,
						complete: true,
						updated: Date.now(),
						lesson: completeAllLessons() //If you complete course complete all lessons
					},
					{ merge: true }
				);
			}}
			class="!p-0"
		>
			<Icon src={Bookmark} />
		</button>
	{/if}
{/if}
