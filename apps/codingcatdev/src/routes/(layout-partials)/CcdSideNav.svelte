<script lang="ts">
	// Stores
	import { storeCurrentUrl } from '$lib/stores/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

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
	<nav class="nav-list-nav">
		<ul>
			<li>
				<a
					on:click={onListItemClick}
					on:keypress
					href={`/`}
					class={classesActive('')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">Home</span>
				</a>
			</li>
		</ul>
	</nav>
	<hr />
	<nav class="nav-list-nav">
		<ul>
			<li>
				<a
					on:click={onListItemClick}
					on:keypress
					href={`/courses`}
					class={classesActive('courses')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">courses</span>
				</a>
			</li>
			<li>
				<a
					on:click={onListItemClick}
					on:keypress
					href={`/podcasts`}
					class={classesActive('podcasts')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">podcasts</span>
				</a>
			</li>
			<li>
				<a
					on:click={onListItemClick}
					on:keypress
					href={`/blog`}
					class={classesActive('blog')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">blog</span>
				</a>
			</li>
		</ul>
	</nav>
	<hr />
	<nav class="nav-list-nav">
		<ul>
			<li>
				<a
					on:click={onListItemClick}
					on:keypress
					href={`/sponsors`}
					class={classesActive('sponsors')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">Sponsors</span>
				</a>
			</li>
			<li>
				<a
					on:click={onListItemClick}
					on:keypress
					href={`/sponsorships`}
					class={classesActive('sponsorships')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">Sponsorships</span>
				</a>
			</li>
		</ul>
	</nav>
	<hr />
	<nav class="nav-list-nav">
		<ul>
			<li>
				<a
					on:click={onListItemClick}
					href={`/guests`}
					class={classesActive('guests')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">Guests</span>
				</a>
			</li>
			<li>
				<a
					on:keypress
					href={`/authors`}
					class={classesActive('authors')}
					data-sveltekit-preload-data="hover"
				>
					<span class="flex-auto text-3xl font-bold capitalize">Authors</span>
				</a>
			</li>
		</ul>
	</nav>
</section>
