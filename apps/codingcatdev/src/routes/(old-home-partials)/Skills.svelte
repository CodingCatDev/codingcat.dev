<script>
	import ReactLogo from '$lib/components/global/icons/vendor/ReactLogo.svelte';
	import AngularLogo from '$lib/components/global/icons/vendor/AngularLogo.svelte';
	import VueLogo from '$lib/components/global/icons/vendor/VueLogo.svelte';
	import SvelteLogo from '$lib/components/global/icons/vendor/SvelteLogo.svelte';
	import CssLogo from '$lib/components/global/icons/vendor/CssLogo.svelte';
	import HtmlLogo from '$lib/components/global/icons/vendor/HtmlLogo.svelte';
</script>

<a href="/language/html">
	<span class="sr-only">HTML</span>
	<HtmlLogo props={{ class: 'h-16 md:h-20' }} />
</a>
<a href="/framework/angular">
	<span class="sr-only">Angular</span>
	<AngularLogo props={{ class: 'h-14 md:h-16' }} />
</a>
<a href="/framework/vue">
	<span class="sr-only">Vue</span>
	<VueLogo props={{ class: 'h-14 md:h-16' }} />
</a>
<a href="/framework/react">
	<span class="sr-only">React</span>
	<ReactLogo props={{ class: 'h-14 md:h-16' }} />
</a>
<a href="/framework/svelte">
	<span class="sr-only">Svelte</span>
	<SvelteLogo props={{ class: 'h-16 md:h-20' }} />
</a>
<a href="/language/css">
	<span class="sr-only">CSS</span>
	<CssLogo props={{ class: 'h-16 md:h-20' }} />
</a>
