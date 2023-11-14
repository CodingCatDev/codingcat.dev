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
		await startDevServer();
	});

	onDestroy(() => {
		if (unSubWebContainerInstance) unSubWebContainerInstance();
	});

	async function startDevServer() {
		const installProcess = await webcontainerInstance.spawn('npm', ['install']);

		const installExitCode = await installProcess.exit;

		if (installExitCode !== 0) {
			throw new Error('Unable to run npm install');
		}

		// `npm run dev`
		await webcontainerInstance.spawn('npm', ['run', 'dev']);
	}
</script>

<iframe bind:this={iframeEl} {title} />
<textarea bind:this={textareaEl} />
