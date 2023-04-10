<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bars3 } from '@steeze-ui/heroicons';

	// BlackCatUI
	import { AppBar, LightSwitch, drawerStore, type DrawerSettings } from '@codingcatdev/blackcatui';
	import AJAlt from '$lib/components/global/icons/AJAlt.svelte';

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'doc-sidenav' };
		drawerStore.open(s);
	}

	import { storeCurrentUrl } from '../(layout-partials)/stores';

	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token' : '';
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<!-- <svelte:window on:keydown|stopPropagation={onWindowKeydown} /> -->

<AppBar shadow="shadow-xl">
	<svelte:fragment slot="bcu-app-bar-lead">
		<div class="flex items-center gap-2">
			<!-- Hamburger Menu -->
			<button on:click={drawerOpen} class="w-10 lg:!hidden" aria-label="Open Drawer">
				<Icon src={Bars3} theme="solid" />
			</button>
			<!-- Logo -->
			<!-- <a class="lg:!ml-0 w-12 lg:w-16 overflow-hidden" href="/" title="Go to Homepage">
				<AjAlt />
			</a> -->
			<!-- Title -->
			<a href="/">
				<div class="w-12">
					<AJAlt />
				</div>
			</a>
			<a class="hidden hover:brightness-110 xl:flex xl:gap-1 sm:text-xl md:text-3xl" href="/">
				CodingCat.dev
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="bcu-app-bar-trail">
		<div class="hidden lg:block">
			<a
				href="/courses"
				class={`bcu-button hover:variant-soft-primary capitalize ${classesActive('courses')}`}
			>
				courses
			</a>
			<a
				href="/tutorials"
				class={`bcu-button hover:variant-soft-primary capitalize ${classesActive('tutorials')}`}
			>
				tutorials
			</a>
			<a
				href="/podcasts"
				class={`bcu-button hover:variant-soft-primary capitalize ${classesActive('podcasts')}`}
			>
				podcasts
			</a>
			<a
				href="/schedule"
				class={`bcu-button hover:variant-soft-primary capitalize ${classesActive('schedule')}`}
			>
				schedule
			</a>
			<a
				href="/blog"
				class={`bcu-button hover:variant-soft-primary capitalize ${classesActive('blog')}`}
			>
				blog
			</a>
		</div>
		<!-- Theme -->
		<div>
			<LightSwitch />
		</div>

		<!-- Social -->
		<!-- prettier-ignore -->
		<!-- <section class="hidden sm:inline-flex sm:gap-2">
			<a class="bcu-button-icon hover:variant-soft-primary" href="https://gdggr.org" target="_blank" rel="noreferrer">
				<Icon src={GlobeAmericas} theme="solid" />
			</a>
		</section> -->
	</svelte:fragment>
</AppBar>
