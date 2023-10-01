<section class="relative flex items-center justify-between w-full gap-4 p-4 vertical-clip">
	<slot />
</section>

<style>
	section:after {
		content: '';
		position: absolute;
		width: 1.5rem;
		bottom: 0;
		left: 4%;
		border: 1.5rem solid transparent;
		border-top-color: hsl(var(--s));
		border-bottom: 0;
		border-right: -1.5rem;
		margin-bottom: -1.5rem;
	}
	.vertical-clip {
		background-color: hsl(var(--ac));
		background: radial-gradient(46.71% 197.88% at 50% 43.5%, hsl(var(--p)) 0%, hsl(var(--s)) 100%);
	}
</style>
