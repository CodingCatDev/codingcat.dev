<script lang="ts">
	import LayoutWrapper from '../(layout-partials)/LayoutWrapper.svelte';
	import GoogleAuth from './GoogleAuth.svelte';
	import TwitterAuth from './TwitterAuth.svelte';
	import GitHubAuth from './GitHubAuth.svelte';

	// TODO: More actions
	// export let form: ActionData;

	import type { PageData } from './$types';
	import EmailAuth from './EmailAuth.svelte';
	export let data: PageData;
	$: action = `?/login&redirectTo=${data.redirectTo ? data.redirectTo : '/dashboard'}`;
</script>

<LayoutWrapper>
	<section class="bcu-card flex flex-col gap-4 p-4">
		<EmailAuth {action} />
		<hr />

		<GoogleAuth {action} />
		<!-- <TwitterAuth /> -->
		<GitHubAuth {action} />
	</section>
</LayoutWrapper>
