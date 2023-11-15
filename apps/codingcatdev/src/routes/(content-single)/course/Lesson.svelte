<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import Video from '$lib/components/content/Video.svelte';
	import { browser } from '$app/environment';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	import Image from '$lib/components/content/Image.svelte';
	import ProCourseMark from './ProCourseMark.svelte';
	import type { LayoutData } from './$types';
	import LessonList from './LessonList.svelte';
	import Output from './Output.svelte';
	export let data: LayoutData;
</script>

<Output exercise={data.exercise} {paused} />
