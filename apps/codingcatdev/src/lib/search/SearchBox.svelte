<!-- @component
Renders a search box as an overlay that can be used to search the documentation.
It appears when the user clicks on the `Search` component or presses the corresponding keyboard shortcut.
-->
<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { searching, query, recent } from './stores.js';
	import { focusable_children, trap } from '../actions/focus';
	import SearchResults from './SearchResults.svelte';
	import SearchWorker from './search-worker.js?worker';

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
		close();
	});

	function close() {
		if ($searching) {
			$searching = false;
			const scroll = -parseInt(document.body.style.top || '0');
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.tabIndex = -1;
			document.body.focus();
			document.body.removeAttribute('tabindex');
			window.scrollTo(0, scroll);
		}

		search = null;
	}

	/** @param {string} href */
	function navigate(href) {
		$recent = [href, ...$recent.filter((/** @type {string} */ x) => x !== href)];
		close();
	}

	$: if (ready) {
		const id = uid++;
		pending.add(id);

		worker.postMessage({ type: 'query', id, payload: $query });
	}

	$: if (ready) {
		worker.postMessage({ type: 'recents', payload: $recent });
	}

	$: if ($searching) {
		document.body.style.top = `-${window.scrollY}px`;
		document.body.style.position = 'fixed';
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'k' && (navigator.platform === 'MacIntel' ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
			$query = '';

			if ($searching) {
				close();
			} else {
				$searching = true;
			}
		}

		if (e.code === 'Escape') {
			close();
		}
	}}
/>

{#if $searching && ready}
	<div class="modal-background" on:click={close} />

	<div
		bind:this={modal}
		class="modal"
		on:keydown={(
			/** @type {{ key: string; preventDefault: () => void; currentTarget: HTMLElement; }} */ e
		) => {
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				const group = focusable_children(e.currentTarget);

				// when using arrow keys (as opposed to tab), don't focus buttons
				const selector = 'a, input';

				if (e.key === 'ArrowDown') {
					group.next(selector);
				} else {
					group.prev(selector);
				}
			}
		}}
		use:trap
	>
		<div class="search-box">
			<!-- svelte-ignore a11y-autofocus -->
			<input
				autofocus
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						/** @type {HTMLElement | undefined} */ (
							modal.querySelector('a[data-has-node]')
						)?.click();
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
			/>

			<button aria-label="Close" on:click={close}> Close </button>

			<span id="search-description" class="visually-hidden">Results will update as you type</span>

			<div class="results">
				{#if search?.query}
					<div class="results-container" on:click={() => ($searching = false)}>
						<SearchResults
							results={search.results}
							query={search.query}
							on:select={(e) => {
								navigate(e.detail.href);
							}}
						/>
					</div>
				{:else}
					<h2 class="info" class:empty={recent_searches.length === 0}>
						{recent_searches.length ? 'Recent searches' : 'No recent searches'}
					</h2>
					{#if recent_searches.length}
						<div class="results-container">
							<ul>
								{#each recent_searches as search, i}
									<!-- svelte-ignore a11y-mouse-events-have-key-events -->
									<li class="recent">
										<a on:click={() => navigate(search.href)} href={search.href}>
											<small>{search.breadcrumbs.join('/')}</small>
											<strong>{search.breadcrumbs.at(-1)}</strong>
										</a>

										<button
											aria-label="Delete"
											on:click={(e) => {
												$recent = $recent.filter((/** @type {any} */ href) => href !== search.href);
												e.stopPropagation();
												e.preventDefault();
											}}
										>
											delete
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<div aria-live="assertive" class="visually-hidden">
	{#if $searching && search?.results.length === 0}
		<p>No results</p>
	{/if}
</div>
