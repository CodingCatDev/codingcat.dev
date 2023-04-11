<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Github } from '@steeze-ui/simple-icons';

	//Firebase
	import { ccdSignInWithPopUp } from '$lib/client/firebase';
	import { GithubAuthProvider } from 'firebase/auth';
	const provider = new GithubAuthProvider();

	// Display
	import { enhance } from '$app/forms';
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	action="?/login"
	use:enhance={async ({ action, cancel, controller, data, form }) => {
		await ccdSignInWithPopUp(provider);

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the logic that would be triggered if this callback wasn't set

			update();
		};
	}}
>
	<button class="bcu-button flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Github} class="w-4" />
		<div class="text-lg">GitHub</div>
	</button>
</form>
