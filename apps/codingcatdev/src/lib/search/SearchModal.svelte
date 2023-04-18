<!-- @component
Renders a search box as an overlay that can be used to search the documentation.
It appears when the user clicks on the `Search` component or presses the corresponding keyboard shortcut.
-->
<script>
	import { Icon } from '@steeze-ui/svelte-icon';
	import { XMark } from '@steeze-ui/heroicons';

	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { query, recent } from './stores';
	import SearchResults from './SearchResults.svelte';
	import SearchWorker from './search-worker?worker';
	import { modalStore } from '@codingcatdev/blackcatui';

	/** @type {HTMLElement} */
	let modal;

	/** @type {any} */
	let search = null;
	/** @type {any[]} */
	let recent_searches = [];

	/** @type {Worker} */
	let worker;
	let ready = false;

	let uid = 1;
	const pending = new Set();

	onMount(async () => {
		worker = new SearchWorker();

		worker.addEventListener('message', (event) => {
			const { type, payload } = event.data;

			if (type === 'ready') {
				ready = true;
			}

			if (type === 'results') {
				search = payload;
			}

			if (type === 'recents') {
				recent_searches = payload;
			}
		});

		worker.postMessage({
			type: 'init',
			payload: {
				origin: location.origin
			}
		});
	});

	afterNavigate(() => {
		// TODO this also needs to apply when only the hash changes
		// (should before/afterNavigate fire at that time? unclear)
		modalStore.close();
	});

	/** @param {string} href */
	function navigate(href) {
		$recent = [href, ...$recent.filter((/** @type {string} */ x) => x !== href)];
		modalStore.close();
	}

	$: if (ready) {
		const id = uid++;
		pending.add(id);

		worker.postMessage({ type: 'query', id, payload: $query });
	}

	$: if (ready) {
		worker.postMessage({ type: 'recents', payload: $recent });
	}
</script>

<div class="bcu-card p-2 md:p-8 flex flex-col gap-2 md:gap-8 w-full h-full md:w-[80%] md:h-[80%]">
	<div class="flex gap-2">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			autofocus
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					/** @type {HTMLElement | undefined} */ (modal.querySelector('a[data-has-node]'))?.click();
				}
			}}
			on:input={(e) => {
				$query = e.currentTarget.value;
			}}
			value={$query}
			placeholder="Search"
			aria-describedby="search-description"
			aria-label="Search"
			spellcheck="false"
			class="input p-2"
		/>
		<button class="bcu-button variant-ringed" on:click={() => modalStore.close()}>
			<Icon src={XMark} theme="solid" class="w-6 h-6" />
		</button>
	</div>
	{#if search?.query}
		<div class=" overflow-y-auto">
			<SearchResults
				results={search.results}
				query={search.query}
				on:select={(e) => {
					navigate(e.detail.href);
				}}
			/>
		</div>
	{/if}
</div>
