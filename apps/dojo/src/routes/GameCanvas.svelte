<script lang="ts">
	import { Container, autoDetectRenderer, Application } from 'pixi.js';
	import type { Renderer } from 'pixi.js';
	import { onDestroy, onMount } from 'svelte';
	import { Druid } from './monsters/Druid';

	let elemCanvas: HTMLCanvasElement;
	let gameRenderer: Renderer;
	const loading: any = { amount: 0, complete: false };

	onMount(async () => {
		gameRenderer = await autoDetectRenderer({
			preference: 'webgpu',
			clearBeforeRender: true,
			backgroundAlpha: 1,
			backgroundColor: 0xffffff,
			width: 800,
			height: 600,
			resolution: 1,
			antialias: false,
			hello: true
		});
		const pageContent = document.querySelector('#page-content');
		pageContent?.appendChild(gameRenderer.view.canvas as HTMLCanvasElement);
		const stage = new Container();

		// Create monsters
		const druid = await Druid.create();

		stage.addChild(druid.view);

		const renderUpdate = () => {
			gameRenderer.render(stage);
			requestAnimationFrame(renderUpdate);
		};

		renderUpdate();
	});

	onDestroy(() => {
		// Helps memory leak issues
		if (gameRenderer !== undefined) gameRenderer.destroy();
	});
</script>

<!-- Game Canvas -->
<canvas id="app" bind:this={elemCanvas} />
