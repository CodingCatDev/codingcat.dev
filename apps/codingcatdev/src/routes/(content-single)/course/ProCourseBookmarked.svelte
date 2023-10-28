<script lang="ts">
	import type { Course, Lesson } from '$lib/types';
	import ProCourseSaved from './ProCourseSaved.svelte';
	import { Bookmark } from '@steeze-ui/heroicons';

	/* DATA */
	export let lesson: Lesson | undefined = undefined;
	export let data: {
		course: Course;
	};
</script>

<ProCourseSaved {data} {lesson} savedRef="/bookmarked" savedIconSource={Bookmark} />
