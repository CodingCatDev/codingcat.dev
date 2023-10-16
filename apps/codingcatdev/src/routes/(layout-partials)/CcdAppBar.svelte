<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bars3 } from '@steeze-ui/heroicons';

	// BlackCatUI
	import {
		AppBar,
		getDrawerStore,
		type DrawerSettings,
		Avatar,
		popup,
		LightSwitch
	} from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	import AJAlt from '$lib/components/global/icons/AJAlt.svelte';

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'doc-sidenav' };
		drawerStore.open(s);
	}

	import { storeCurrentUrl, storeUser } from '$lib/stores/stores';
	import LogoutButton from '../login/LogoutButton.svelte';
	import { Search } from '$lib/search';

	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token hover:text-token' : '';
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<!-- <svelte:window on:keydown|stopPropagation={onWindowKeydown} /> -->
<AppBar shadow="shadow-xl">
	<svelte:fragment slot="lead">
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
			<a href={$storeUser?.uid ? '/dashboard' : '/'} class="flex items-center">
				<div class="w-12">
					<AJAlt />
				</div>
				<span class="hidden hover:brightness-110 xl:flex xl:gap-1 sm:text-xl md:text-3xl">
					CodingCat.dev
				</span>
			</a>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<div class="hidden lg:block">
			<a
				href="/courses"
				class={`btn hover:variant-soft-primary capitalize ${classesActive('courses')}`}
			>
				courses
			</a>
			<a
				href="/podcasts"
				class={`btn hover:variant-soft-primary capitalize ${classesActive('podcasts')}`}
			>
				podcasts
			</a>
			<a href="/blog" class={`btn hover:variant-soft-primary capitalize ${classesActive('blog')}`}>
				blog
			</a>
		</div>
		<div class="flex justify-center"><Search /></div>
		{#if $storeUser?.uid}
			<button
				class="btn hover:variant-soft-primary"
				aria-label="Popup Showing Theme Options"
				use:popup={{
					event: 'click',
					target: 'theme',
					placement: 'bottom-end',
					middleware: { offset: { crossAxis: -20, mainAxis: 20 } }
				}}
			>
				{#if $storeUser?.picture}
					<Avatar
						class="w-8 h-8 text-4xl"
						src={$storeUser.picture}
						alt="User Photo"
						referrerpolicy="no-referrer"
					/>
				{:else}
					<Avatar class="w-8 h-8 text-4xl">
						<div class="text-sm">AJ</div>
					</Avatar>
				{/if}
			</button>
			<!-- popup -->
			<div data-popup="theme">
				<div class="flex flex-col gap-4 p-4 shadow-xl card">
					<div class="mb-2 space-y-4">
						<section class="flex items-center justify-between">
							<h6>Mode</h6>
							<LightSwitch />
						</section>
					</div>
					<hr />
					<div class="flex flex-col gap-2 mt-2">
						<div class="text-sm text-ellipsis">{$storeUser?.email}</div>
						<div class="flex gap-2">
							<a class="btn variant-ringed-primary" href="/dashboard">Dashboard</a>
							<LogoutButton />
						</div>
					</div>
				</div>
			</div>
		{:else}
			<a class="btn variant-filled-primary" href="/login">Login</a>
		{/if}
	</svelte:fragment>
</AppBar>
