<script lang="ts">
	import LayoutWrapper from '../(layout-partials)/LayoutWrapper.svelte';
	import GoogleAuth from './GoogleAuth.svelte';
	import TwitterAuth from './TwitterAuth.svelte';
	import GitHubAuth from './GitHubAuth.svelte';

	// TODO: More actions
	// export let form: ActionData;

	import type { PageData } from './$types';
	import EmailAuth from './EmailAuth.svelte';
	import HomeProBenefits from '../(home-partials)/(home-pro-benefits)/HomeProBenefits.svelte';
	export let data: PageData;
	$: action = `?/login&redirectTo=${data.redirectTo ? data.redirectTo : '/dashboard'}`;
</script>

<LayoutWrapper>
	<section class="bcu-card flex flex-col gap-4 p-4">
		<EmailAuth {action} />
		<a href={`/signup${action.replace('/login&', '')}`}>Sign Up</a>
		<hr />

		<GoogleAuth {action} />
		<!-- <TwitterAuth /> -->
		<GitHubAuth {action} />
	</section>
	<HomeProBenefits login={true} />
</LayoutWrapper>
