<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Google } from '@steeze-ui/simple-icons';

	//Firebase
	import { ccdSignInWithPopUp } from '$lib/client/firebase';
	import { GoogleAuthProvider } from 'firebase/auth';
	const provider = new GoogleAuthProvider();

	// Display
	import { enhance } from '$app/forms';
	export let action: string;
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	{action}
	use:enhance={async () => {
		await ccdSignInWithPopUp(provider);

		return async ({ update }) => {
			// `update` is a function which triggers the logic that would be triggered if this callback wasn't set
			update();
		};
	}}
>
	<button class="bcu-button flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Google} class="w-4" />
		<div class="text-lg">Google</div>
	</button>
</form>
