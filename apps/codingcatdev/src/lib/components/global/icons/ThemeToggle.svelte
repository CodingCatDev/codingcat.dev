<script>
	import Page from 'src/routes/+page.svelte';
	import { onMount } from 'svelte/types/runtime/internal/lifecycle';

	export let loaded = false;
	/**
	 * Updates loaded
	 * @param {boolean} l
	 */
	export const setLoaded = (l) => {
		loaded = l;
	};

	/** @typedef {'dark'|'light'} themeType */
	/** @type {themeType} */
	export let theme = 'dark';

	/**
	 * Sets Theme
	 * @param {themeType} t
	 */
	export const setTheme = (t) => {
		theme = t;
	};
	const toggle = () => {
		if (theme !== 'dark') {
			// dark(); // TODO: Replace sound click
			setTheme('dark');
		} else {
			// light(); // TODO: Replace sound click
			setTheme('light');
		}
	};

	// TODO: Replace sound click
	// const [dark] = useSound('/static/sounds/switch-off.mp3');
	// const [light] = useSound('/static/sounds/switch-on.mp3');

	onMount(async () => {
		loaded = true;
	});
</script>

<button
	class="self-center p-1 m-2 rounded-full hover:bg-primary-800 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-basics-50 text-yellow-50 dark:text-yellow-50"
	aria-label="Toggle dark mode"
	role="switch"
	aria-checked={theme === 'light' ? false : true}
	on:click={toggle}
>
	{#if loaded === true}
		{#if theme != 'dark'}
			<svg
				class="w-8"
				xmlns="http://www.w3.org/2000/svg"
				fill="white"
				viewBox="0 0 24 24"
				stroke="white"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		{:else}
			<svg
				class="w-8"
				fill="white"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				stroke="white"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
		{/if}
	{/if}
</button>
