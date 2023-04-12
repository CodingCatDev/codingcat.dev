<script lang="ts">
	// Stores
	import { storeCurrentUrl } from '$lib/stores/stores';
	import { drawerStore } from '@codingcatdev/blackcatui';

	// Props
	export let embedded = false;

	// ListItem Click Handler
	function onListItemClick(): void {
		// On Drawer embed Only:
		if (!embedded) return;
		drawerStore.close();
	}

	$: classesBase = `p-4 pb-20 space-y-4 overflow-y-auto ${$$props.class ?? ''}`;
	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token' : '';
</script>

<!-- Nav Links -->
<section class={classesBase}>
	<div class="text-3xl font-bold">Menu</div>
	<hr />
	<nav class="nav-list-nav">
		<ul>
			<li on:click={onListItemClick} on:keypress>
				<a href={`/courses`} class={classesActive('courses')} data-sveltekit-preload-data="hover">
					<span class="flex-auto text-3xl font-bold capitalize">courses</span>
				</a>
			</li>
			<li on:click={onListItemClick} on:keypress>
				<a
					href={`/tutorials`}
					class={classesActive('tutorials')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">tutorials</span>
				</a>
			</li>
			<li on:click={onListItemClick} on:keypress>
				<a href={`/podcasts`} class={classesActive('podcasts')} data-sveltekit-preload-data="hover">
					<span class="flex-auto text-3xl font-bold capitalize">podcasts</span>
				</a>
			</li>
			<li on:click={onListItemClick} on:keypress>
				<a href={`/schedule`} class={classesActive('schedule')} data-sveltekit-preload-data="hover">
					<span class="flex-auto text-3xl font-bold capitalize">schedule</span>
				</a>
			</li>
			<li on:click={onListItemClick} on:keypress>
				<a href={`/blog`} class={classesActive('blog')} data-sveltekit-preload-data="hover">
					<span class="flex-auto text-3xl font-bold capitalize">blog</span>
				</a>
			</li>
		</ul>
	</nav>
</section>
