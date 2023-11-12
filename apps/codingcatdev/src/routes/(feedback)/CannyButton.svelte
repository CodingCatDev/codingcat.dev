<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChatBubbleLeft } from '@steeze-ui/heroicons';
</script>

<div class="fixed bottom-8 right-8 z-50">
	<a href="/feedback" class="btn variant-filled-surface flex gap-1 items-center">
		<span class="hidden md:block">Feedback</span>
		<div><Icon src={ChatBubbleLeft} theme="solid" class="w-6" /></div></a
	>
</div>
