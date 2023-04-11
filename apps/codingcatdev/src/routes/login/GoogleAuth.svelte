<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Google } from '@steeze-ui/simple-icons';

	import { GoogleAuthProvider } from 'firebase/auth';
	const provider = new GoogleAuthProvider();
</script>

<button class="bcu-button flex gap-2 variant-ringed-primary" type="button">
	<Icon src={Google} class="w-4" />
	<div class="text-lg">Google</div>
</button>
