<script lang="ts">
	import type { Podcast } from '$lib/types';
	import HomeCampaign from './(home-partials)/(home-campaign)/HomeCampaign.svelte';
	import HomeLatestCourse from './(home-partials)/(home-latest-course)/HomeLatestCourse.svelte';
	import HomePodcast from './(home-partials)/(home-podcast)/HomePodcast.svelte';
	import HomeProBenefits from './(home-partials)/(home-pro-benefits)/HomeProBenefits.svelte';
	import HomeReviews from './(home-partials)/(home-reviews)/HomeReviews.svelte';
	import HomeTeam from './(home-partials)/(home-team)/HomeTeam.svelte';

	export let data: {
		podcasts: Podcast[];
	};
</script>

<div class="relative">
	<HomeCampaign />
	<HomeReviews />
	<HomeLatestCourse />
	<HomeProBenefits />
	<HomePodcast podcasts={data.podcasts} />
	<HomeTeam />
</div>
