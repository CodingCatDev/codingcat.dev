<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Discord, Github, Twitter, Youtube } from '@steeze-ui/simple-icons';
</script>

<hr />
<footer class="grid justify-center grid-cols-1 gap-2 px-8 pt-12 mx-auto 2xl:gap-10 max-w-7xl">
	<div class="flex flex-col gap-6 md:gap-10">
		<section class="flex flex-col items-center justify-between gap-8 md:flex-row md:space-y-0">
			<p class="text-xs">
				<a class="btn variant-soft" href="https://alexpatterson.dev">Made by Alex Patterson</a>
			</p>
			<p class="flex gap-2 text-xs">
				Mode <LightSwitch />
			</p>
			<div class="flex gap-2">
				<a
					class="btn variant-soft"
					href="https://discord.com/invite/fRJTRjR"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Discord} class="w-4" />
					<span class="hidden ml-2 md:inline-block">Discord</span>
				</a>
				<a
					class="btn variant-soft"
					href="https://github.com/codingcatdev/codingcat.dev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Github} class="w-4" />
					<span class="hidden ml-2 md:inline-block">GitHub</span>
				</a>
				<a
					class="btn variant-soft"
					href="https://twitter.com/CodingCatDev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Twitter} class="w-4" />
					<span class="hidden ml-2 md:inline-block">Twitter</span>
				</a>
				<a
					class="btn variant-soft"
					href="https://youtube.com/CodingCatDev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Youtube} class="w-4" />
					<span class="hidden ml-2 md:inline-block">YouTube</span>
				</a>
			</div>
		</section>

		<!-- Links -->
		<section
			class="flex flex-col items-center justify-between gap-4 p-8 space-y-5 md:flex-row md:items-start md:space-y-0 md:gap-8 card"
		>
			<div class="hidden grid-cols-2 gap-8 md:grid">
				<div class="space-y-6">
					<h6>Stuff</h6>
					<ul class="space-y-3">
						<li><a href="/ftc-disclosure">FTC Disclosure</a></li>
						<li><a href="/privacy-policy">Privacy Policy</a></li>
						<li><a href="/terms-of-use">Terms</a></li>
					</ul>
				</div>
				<div class="space-y-6">
					<h6>More Stuff</h6>
					<ul class="space-y-3">
						<li><a href="/sponsorships">Sponsorships</a></li>
					</ul>
				</div>
			</div>

			<form
				action="https://buttondown.email/api/emails/embed-subscribe/codingcatdev"
				method="post"
				target="popupwindow"
				class="flex flex-col flex-1 space-y-3 embeddable-buttondown-form"
			>
				<label for="email" class="label"><h6>Email</h6></label>
				<div class="flex flex-col gap-4 md:gap-8 md:flex-row">
					<input type="email" name="email" placeholder="you@example.com" class="text-black input" />
					<input type="hidden" value="1" name="embed" />
					<button class="btn variant-filled-primary" type="submit">Subscribe</button>
				</div>
				<p>
					<a href="https://buttondown.email" target="_blank" class="text-xs">
						Powered by Buttondown.
					</a>
				</p>
			</form>
		</section>
	</div>
</footer>
