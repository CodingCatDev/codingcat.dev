<script lang="ts">
	import LayoutWrapper from '../(layout-partials)/LayoutWrapper.svelte';

	// TODO: More actions
	// export let form: ActionData;

	import type { PageData } from './$types';
	import SignupAuth from './SignupAuth.svelte';
	export let data: PageData;
	$: action = `?/signup&redirectTo=${data.redirectTo ? data.redirectTo : '/dashboard'}`;
</script>

<LayoutWrapper>
	<section class="card flex flex-col gap-4 p-4">
		<SignupAuth {action} />
	</section>
</LayoutWrapper>
