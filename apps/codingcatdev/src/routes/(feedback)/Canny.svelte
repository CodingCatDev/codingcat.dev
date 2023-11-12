<script lang="ts">
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import type { Unsubscriber } from 'svelte/store';

	let container: HTMLDivElement;
	let modeUnsubscribe: Unsubscriber;
	onMount(async () => {
		modeUnsubscribe = modeCurrent.subscribe((m) => {
			container.style.backgroundColor = m ? 'white' : '#121212';
		});

		// @ts-ignore
		!(function (w, d, i, s) {
			function l() {
				if (!d.getElementById(i)) {
					var f = d.getElementsByTagName(s)[0],
						e = d.createElement(s);
					// @ts-ignore
					(e.type = 'text/javascript'),
						// @ts-ignore
						(e.async = !0),
						// @ts-ignore
						(e.src = 'https://canny.io/sdk.js'),
						// @ts-ignore
						f.parentNode.insertBefore(e, f);
				}
			}
			// @ts-ignore
			if ('function' != typeof w.Canny) {
				var c = function () {
					// @ts-ignore
					c.q.push(arguments);
				};
				// @ts-ignore
				(c.q = []),
					// @ts-ignore
					(w.Canny = c),
					'complete' === d.readyState
						? l()
						: // @ts-ignore
						w.attachEvent
						? // @ts-ignore
						  w.attachEvent('onload', l)
						: w.addEventListener('load', l, !1);
			}
		})(window, document, 'canny-jssdk', 'script');
	});
	afterUpdate(() => {
		// @ts-ignore
		if ('function' === typeof window.Canny) {
			// @ts-ignore
			Canny('render', {
				boardToken: '185218a5-57c7-2354-9eba-30105a9da7bd',
				basePath: '/feedback', // See step 2
				ssoToken: null, // See step 3,
				theme: $modeCurrent ? 'light' : 'dark'
			});
		}
	});
	onDestroy(() => {
		if (modeUnsubscribe) modeUnsubscribe();
	});
</script>

<div class="flex justify-center h-full w-full" bind:this={container}>
	<div class="w-full h-full max-w-5xl p-8" data-canny></div>
</div>
