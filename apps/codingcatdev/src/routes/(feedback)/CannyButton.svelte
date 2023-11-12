<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChatBubbleLeft } from '@steeze-ui/heroicons';
</script>

<div class="fixed bottom-8 right-8 z-50">
	<a href="/feedback" class="btn variant-filled-primary flex flex-col">
		<span class="hidden md:block">Feedback</span>
		<div><Icon src={ChatBubbleLeft} theme="solid" class="w-8 md:w-12" /></div></a
	>
</div>
