<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { MagnifyingGlass } from '@steeze-ui/heroicons';
	import { modalStore, type ModalSettings } from '@codingcatdev/blackcatui';
	import SearchModal from '$lib/search/SearchModal.svelte';
	import { query } from './stores.js';

	const showSearch = () => {
		const d: ModalSettings = {
			type: 'component',
			component: {
				ref: SearchModal
			}
		};
		modalStore.trigger(d);
	};
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'k' && (navigator.platform === 'MacIntel' ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
			$query = '';
			if ($modalStore.length > 0) {
				modalStore.close();
			} else {
				showSearch();
			}
		}

		if (e.code === 'Escape') {
			close();
		}
	}}
/>

<button
	class="bcu-button p-2 px-4 space-x-4 variant-soft hover:variant-soft-primary flex align-middle"
	on:mousedown|preventDefault={() => showSearch()}
	on:touchend|preventDefault={() => showSearch()}
>
	<Icon src={MagnifyingGlass} theme="solid" class="w-6" />
	<span class="hidden md:inline-block badge variant-soft">⌘+K</span></button
>
