<script>
	import AJLogoLeft from '$lib/components/global/icons/AJAlt.svelte';
	import KCAlt from '$lib/components/global/icons/KCAlt.svelte';
	import AJHeartAlt from '$lib/components/global/icons/AJHeartAlt.svelte';
	import Podcasts from '$lib/components/global/icons/nav/Podcasts.svelte';
	import BreakBarLeft from '$lib/components/home/BreakBarLeft.svelte';
	import BreakBarRight from '$lib/components/home/BreakBarRight.svelte';
	import Skills from '$lib/components/home/Skills.svelte';
	import ContentCards from '$lib/components/content/ContentCards.svelte';
	import { ContentType } from '$lib/types/index';

	/** @typedef {import('$lib/types/index').Content} Content */
	/** @typedef {import('$lib/types/index').Podcast} Podcast */
	/** @type {{
        course: Content[] | Podcast[];
        tutorial: Content[] | Podcast[];
        podcast: Content[] | Podcast[];
        post: Content[] | Podcast[];
    }}*/
	export let data;
</script>

<div>
	<!-- COURSES -->
	<BreakBarLeft>
		<Skills />
	</BreakBarLeft>
	<section class="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10 justify-items-center">
		<h2 class="mt-4 text-4xl light:text-primary-900 lg:text-5xl">Latest Courses</h2>
		<ContentCards type={ContentType.course} data={{ content: data.course }} />
		<a href="/courses">
			<button class="btn btn-lg btn-primary" type="button"> View All Courses </button>
		</a>
	</section>
	<!-- TUTORIALS -->
	<BreakBarRight>
		<AJLogoLeft cls="w-16 sm:w-16 md:w-20" />
		<h3
			class="absolute w-1/2 text-2xl text-center text-primary-content sm:left-0 sm:w-full left-1/4 text-basics-50 sm:text-4xl lg:text-4xl"
		>
			Learn with AJ and KC
		</h3>
		<KCAlt cls="w-14 sm:w-14 md:w-20" />
	</BreakBarRight>
	<section class="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10 justify-items-center">
		<h2 class="mt-4 text-4xl text-right light:text-primary-900 lg:text-5xl">Latest Tutorials</h2>
		<ContentCards type={ContentType.tutorial} data={{ content: data.tutorial }} />
		<a href="/tutorials">
			<button class="btn btn-lg btn-primary" type="button"> View All Tutorials </button>
		</a>
	</section>
	<!-- BLOG -->
	<BreakBarLeft>
		<div class="relative flex items-center w-full">
			<AJHeartAlt cls="w-16 sm:w-16 md:w-20" />
			<h3
				class="absolute w-3/4 ml-4 text-2xl text-center text-primary-content sm:left-0 sm:w-full left-16 text-basics-50 sm:text-4xl md:text-2xl lg:text-4xl"
			>
				Read what&#39;s going on in web dev
			</h3>
		</div>
	</BreakBarLeft>
	<section class="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10 justify-items-center">
		<h2 class="mt-4 text-4xl light:text-primary-900 lg:text-5xl">Blog Posts</h2>
		<ContentCards type={ContentType.post} data={{ content: data.post }} />
		<a href="/blog">
			<button class="btn btn-lg btn-primary" type="button"> View All Posts </button>
		</a>
	</section>
	<!-- PODCASTS -->
	<BreakBarRight>
		<div class="relative flex items-center justify-end w-full">
			<h3
				class="absolute left-0 w-3/4 ml-4 text-2xl text-center text-primary-content sm:w-full text-basics-50 sm:text-3xl md:text-3xl lg:text-4xl"
			>
				Listen to the latest tech news
			</h3>
			<Podcasts cls="w-16 sm:w-16 md:w-20" />
		</div>
	</BreakBarRight>
	<section class="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10 justify-items-center">
		<h2 class="mt-4 text-4xl text-right light:text-primary-900 lg:text-5xl">Latest Podcasts</h2>
		<ContentCards type={ContentType.podcast} data={{ content: data.podcast }} />

		<a href="/podcasts">
			<button class="btn btn-lg btn-primary" type="button"> View All Podcasts </button>
		</a>
	</section>
</div>
