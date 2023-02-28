<script>
	export let overlayMenuActive = false;
	export let setOverlayMenuActive = (menuActive = false) => {
		overlayMenuActive = menuActive;
	};
</script>

<button
	class="inline-flex items-center justify-center p-1 text-xl rounded-md text-basics-50 hover:bg-primary-700 dark:hover:bg-primary-700 dark:text-basics-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
	aria-expanded="false"
	on:click={() => setOverlayMenuActive(!overlayMenuActive)}
>
	<span class="sr-only">Open main menu</span>
	{#if !overlayMenuActive}
		<svg
			class="block w-10"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	{:else}
		<svg
			class="block w-10"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	{/if}
</button>
