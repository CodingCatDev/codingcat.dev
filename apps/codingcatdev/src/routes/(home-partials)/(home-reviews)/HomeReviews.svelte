<script>
	import { Icon } from '@steeze-ui/svelte-icon';
	import { VideoCamera, Star } from '@steeze-ui/heroicons';
</script>

<section class="relative pt-20">
	<div class="bg-surface-300 h-96">
		<div class="flex gap-8 absolute top-0 -left-20">
			<div class="bcu-card max-w-sm -rotate-2">
				<div class="p-4 space-y-4">
					<article>
						<p>The CSS Animations course is phenomenal. Very beginner-friendly!</p>
					</article>
					<footer class="flex justify-between">
						<a href="/course/css-animations">CSS Animations</a>
						<Icon src={VideoCamera} theme="mini" class="w-6" />
					</footer>
				</div>
			</div>
			<div class="bcu-card max-w-sm rotate-2">
				<div class="p-4 space-y-4">
					<div class="flex">
						<Icon src={Star} theme="mini" class="w-6" />
						<Icon src={Star} theme="mini" class="w-6" />
						<Icon src={Star} theme="mini" class="w-6" />
						<Icon src={Star} theme="mini" class="w-6" />
						<Icon src={Star} theme="mini" class="w-6" />
					</div>
					<article>
						<p>The CSS Animations course is phenomenal. Very beginner-friendly!</p>
					</article>
					<footer class="flex justify-between">
						<a href="/course/css-animations">CSS Animations</a>
						<Icon src={VideoCamera} theme="mini" class="w-6" />
					</footer>
				</div>
			</div>
		</div>
	</div>
</section>
