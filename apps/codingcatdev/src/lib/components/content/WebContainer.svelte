<script lang="ts">
	import { WebContainer, type Unsubscribe } from '@webcontainer/api';
	import { onDestroy, onMount } from 'svelte';
	import { files } from './files';

	export let title = 'Web Container';
	let webcontainerInstance: WebContainer;
	let iframeEl: HTMLIFrameElement;
	let textareaEl: HTMLTextAreaElement;

	let unSubWebContainerInstance: Unsubscribe;
	onMount(async () => {
		textareaEl.value = files['index.js'].file.contents;
		if (!webcontainerInstance) webcontainerInstance = await WebContainer.boot();
		await webcontainerInstance.mount(files);
		unSubWebContainerInstance = webcontainerInstance.on(
			'server-ready',
			(port, url) => (iframeEl.src = url)
		);
		const installProcess = await webcontainerInstance.spawn('npm', ['install']);

		installProcess.output.pipeTo(
			new WritableStream({
				write(data) {
					console.debug(data);
				}
			})
		);

		const installExitCode = await installProcess.exit;

		if (installExitCode !== 0) {
			throw new Error('Unable to run npm install');
		}

		// `npm run dev`
		const startProcess = await webcontainerInstance.spawn('npm', ['run', 'start']);
		startProcess.output.pipeTo(
			new WritableStream({
				write(data) {
					console.debug(data);
				}
			})
		);
	});

	onDestroy(() => {
		if (unSubWebContainerInstance) unSubWebContainerInstance();
	});
</script>

<div class="container">
	<div class="editor">
		<textarea bind:this={textareaEl}>I am a textarea</textarea>
	</div>
	<div class="preview">
		<iframe bind:this={iframeEl} {title}></iframe>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		height: 100vh;
	}

	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		height: 100%;
		width: 100%;
	}

	textarea {
		width: 100%;
		height: 100%;
		resize: none;
		border-radius: 0.5rem;
		background: black;
		color: white;
		padding: 0.5rem 1rem;
	}

	iframe {
		height: 100%;
		width: 100%;
		border-radius: 0.5rem;
	}
</style>
