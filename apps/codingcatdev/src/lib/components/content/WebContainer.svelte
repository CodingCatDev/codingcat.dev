<script lang="ts">
	import { WebContainer, type Unsubscribe } from '@webcontainer/api';
	import { onDestroy, onMount } from 'svelte';
	import 'xterm/css/xterm.css';

	export let title = 'Web Container';
	export let files = {
		'index.js': {
			file: {
				contents: 'Loading...'
			}
		}
	};
	let webcontainerInstance: WebContainer;
	let iframeEl: HTMLIFrameElement;
	let textareaElValue = 'Loading...';
	let terminalEl: HTMLElement;

	let unSubWebContainerInstance: Unsubscribe;
	onMount(async () => {
		textareaElValue = files['index.js'].file.contents;

		const Terminal = (await import('xterm')).Terminal;
		const terminal = new Terminal({
			convertEol: true
		});
		terminal.open(terminalEl);

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
					terminal.write(data);
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
					terminal.write(data);
				}
			})
		);
	});

	onDestroy(() => {
		if (unSubWebContainerInstance) unSubWebContainerInstance();
	});

	async function writeIndexJS(content: string) {
		await webcontainerInstance.fs.writeFile('/index.js', content);
	}
</script>

<div class="container">
	<div class="editor">
		<textarea bind:value={textareaElValue} on:input={(e) => writeIndexJS(e.currentTarget.value)}
		></textarea>
	</div>
	<div class="preview">
		<iframe bind:this={iframeEl} {title}></iframe>
	</div>
	<div class="terminal" bind:this={terminalEl}></div>
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
