<script lang="ts">
	import { Container, autoDetectRenderer } from 'pixi.js';
	import type { Renderer } from 'pixi.js';
	import { onDestroy, onMount } from 'svelte';
	import { Druid } from './monsters/Druid';

	let elemCanvas: HTMLCanvasElement;
	let renderer: Renderer;
	const loading: any = { amount: 0, complete: false };

	onMount(async () => {
		renderer = await autoDetectRenderer({
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
		elemCanvas.appendChild(renderer.view.canvas as HTMLCanvasElement);
		const stage = new Container();

		// Create monsters
		const druid = await Druid.create();

		stage.addChild(druid.view);

		const renderUpdate = () => {
			renderer.render(stage);
			requestAnimationFrame(renderUpdate);
		};

		renderUpdate();
	});

	onDestroy(() => {
		// Helps memory leak issues
		if (renderer !== undefined) renderer.destroy();
	});
</script>

<!-- Game Canvas -->
<canvas id="app" bind:this={elemCanvas} />
