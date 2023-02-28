<script>
	import AJAlt from '$lib/components/global/icons/AJAlt.svelte';
	import NavLinks from '$lib/components/layout/NavLinks.svelte';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
</script>

<header
	class="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content"
>
	<nav class="navbar bg-base-300">
		<div class="navbar-start">
			<a href="/" aria-label="Navigate to Homepage">
				<div class="flex items-center content-center h-full shrink-0">
					<AJAlt />
					<h2 class="hidden text-2xl text-basics-50 lg:block">CodingCat.dev</h2>
				</div>
			</a>
		</div>
		<div class="navbar-center">
			<NavLinks />
		</div>
		<div class="navbar-end">
			<!-- <SearchModal /> -->
			<ThemeToggle />
			<!-- <AvatarMenu {userMenu} {setUserMenu} /> -->
			<div class="flex-none hidden lg:block">
				<!-- {#if $user}
				<div class="dropdown dropdown-end dropdown-hover">
					<label tabIndex={0} class="m-1 btn btn-primary">
						{$user.name}
					</label>
					<ul tabIndex={0} class="p-2 shadow dropdown-content menu bg-primary rounded-box w-52">
						<li>
							<a on:click|once={logout}>Logout</a>
						</li>
					</ul>
				</div>
			{:else} -->
				<!-- <a class="btn btn-primary" on:click|once={createSession}> Login </a> -->
				<!-- {/if} -->
			</div>
			<!-- Button to Open Drawer -->
			<div class="flex-none lg:hidden">
				<label for="ccd-drawer" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-6 h-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</label>
			</div>
		</div>
	</nav>
</header>
