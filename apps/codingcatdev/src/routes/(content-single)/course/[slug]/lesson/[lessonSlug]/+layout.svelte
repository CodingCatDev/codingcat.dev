<script lang="ts">
	import { AppShell, TableOfContents } from '@codingcatdev/blackcatui';
	import LessonList from './LessonList.svelte';
	import { storeCurrentUrl } from '$lib/stores/stores';

	export let data;
</script>

<!-- App Shell -->
<AppShell
	regionPage="overflow-y-scroll"
	slotPageFooter="pt-4 bg-surface-50-900-token block lg:hidden"
	slotSidebarRight="hidden lg:block"
>
	<!-- Page Content -->
	<slot />
	<svelte:fragment slot="bcu-app-shell-sidebar-right">
		<!-- Div takes up same room as fixed -->
		<div class="w-[19.5rem] xl:w-96" />
		<div class="fixed top-[5.125rem] bottom-24 w-[19.5rem] xl:w-96 py-10 overflow-y-auto ">
			<div class="flex flex-col gap-2 px-8 md:gap-8">
				{#key $storeCurrentUrl}
					<TableOfContents target=".markdown" />
				{/key}
				{#if data?.course?.lesson && data?.course?.lesson.length > 0 && data?.course?.slug}
					<LessonList courseSlug={data?.course?.slug} lesson={data.course.lesson} />
				{/if}
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="bcu-app-shell-page-footer">
		{#if data?.course?.lesson && data?.course?.lesson.length > 0 && data?.course?.slug}
			<LessonList courseSlug={data?.course?.slug} lesson={data.course.lesson} />
		{/if}
	</svelte:fragment>
</AppShell>
