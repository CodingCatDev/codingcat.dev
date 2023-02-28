<script>
	import NavLink from '$lib/components/layout/NavLink.svelte';
	import Courses from '$lib/components/global/icons/nav/Courses.svelte';
	import Tutorials from '$lib/components/global/icons/nav/Tutorials.svelte';
	import Podcasts from '$lib/components/global/icons/nav/Podcasts.svelte';
	import Blog from '$lib/components/global/icons/nav/Blog.svelte';
	import Schedule from '$lib/components/global/icons/nav/Schedule.svelte';
</script>

<nav class="flex mx-auto">
	<div class="hidden md:flex gap-2 lg:gap-4 md:place-items-center">
		<NavLink href="/courses" name="Courses" component={Courses} />
		<NavLink href="/tutorials" name="Tutorials" component={Tutorials} />
		<NavLink href="/podcasts" name="Podcasts" component={Podcasts} />
		<NavLink href="/schedule" name="Schedule" component={Schedule} />
		<NavLink href="/blog" name="Blog" component={Blog} />
	</div>
</nav>
