<script lang="ts">
	import { Container, autoDetectRenderer } from 'pixi.js';
	import type { Renderer } from 'pixi.js';
	import { onDestroy, onMount } from 'svelte';
	import { Druid } from './monsters/Druid';

	let dojoElem: HTMLDivElement;
	let dojoRenderer: Renderer;
	let druid: Druid;
	const loading: any = { amount: 0, complete: false };

	onMount(async () => {
		dojoRenderer = await autoDetectRenderer({
			preference: 'webgpu',
			clearBeforeRender: true,
			backgroundAlpha: 1,
			backgroundColor: 0xffffff,
			width: 800,
			height: 600,
			resolution: 4,
			antialias: true,
			hello: true,
		});
		dojoElem.innerHTML = '';
		dojoElem.appendChild(dojoRenderer.view.canvas as HTMLCanvasElement);
		const stage = new Container();

		// Create monsters
		druid = await Druid.create(stage);

		const renderUpdate = () => {
			dojoRenderer.render(stage);
			requestAnimationFrame(renderUpdate);
		};

		renderUpdate();
	});

	onDestroy(() => {
		// Helps memory leak issues
		if (dojoRenderer !== undefined && dojoElem !== undefined) {
			dojoElem.innerHTML = '';
			dojoRenderer.destroy();
		}
	});

	function onKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowLeft':
				console.debug('move left');
				druid.left();
				break;
			case 'ArrowRight':
				console.log('move right');
				druid.right();
				break;
			case 'ArrowUp':
				console.log('move up');
				druid.up();

				break;
			case 'ArrowDown':
				console.log('move down');
				druid.down();

				break;
		}
	}
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />
<div id="dojo" bind:this={dojoElem} />
