<script lang="ts">
	import { Container, autoDetectRenderer, Application, TextureStyle } from 'pixi.js';
	import type { Renderer } from 'pixi.js';
	import { onDestroy, onMount } from 'svelte';
	import { MyPlayer } from './players/MyPlayer';
	import { World, height, resolution, width } from './world/World';

	let dojoElem: HTMLDivElement;
	let dojoRenderer: Renderer;
	let world: World;
	const loading: any = { amount: 0, complete: false };

	onMount(async () => {
		TextureStyle.defaultOptions.scaleMode = 'nearest';

		dojoRenderer = await autoDetectRenderer({
			preference: 'webgpu',
			clearBeforeRender: true,
			backgroundAlpha: 1,
			backgroundColor: 0xffffff,
			width,
			height,
			resolution,
			antialias: false,
			hello: true,
		});
		dojoElem.innerHTML = '';
		dojoElem.appendChild(dojoRenderer.view.canvas as HTMLCanvasElement);

		const stage = new Container();

		// Create World
		world = await World.create();
		stage.addChild(world.view);

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
		world.onKeyDown(e);
	}
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />
<div id="dojo" bind:this={dojoElem} />
