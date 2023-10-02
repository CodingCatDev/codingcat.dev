<script lang="ts">
	import { LightSwitch } from '@codingcatdev/blackcatui';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Github, Twitter, Youtube } from '@steeze-ui/simple-icons';
</script>

<hr />
<footer class="grid justify-center grid-cols-1 px-8 pt-12 mx-auto gap-2 2xl:gap-10 max-w-7xl">
	<div class="flex flex-col gap-6 md:gap-10">
		<section class="flex flex-col md:flex-row justify-between gap-8 md:space-y-0 items-center">
			<p class="text-xs">
				<a class="bcu-button variant-soft" href="https://alexpatterson.dev"
					>Made by Alex Patterson</a
				>
			</p>
			<p class="text-xs flex gap-2">
				Mode <LightSwitch />
			</p>
			<div class="flex gap-2">
				<a
					class="bcu-button variant-soft"
					href="https://github.com/codingcatdev/codingcat.dev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Github} class="w-4" />
					<span class="hidden md:inline-block ml-2">GitHub</span>
				</a>
				<a
					class="bcu-button variant-soft"
					href="https://twitter.com/CodingCatDev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Twitter} class="w-4" />
					<span class="hidden md:inline-block ml-2">Twitter</span>
				</a>
				<a
					class="bcu-button variant-soft"
					href="https://youtube.com/CodingCatDev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Youtube} class="w-4" />
					<span class="hidden md:inline-block ml-2">YouTube</span>
				</a>
			</div>
		</section>

		<!-- Links -->
		<section
			class="flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0 gap-4 md:gap-8 bcu-card p-8"
		>
			<div class="hidden md:grid grid-cols-2 gap-8">
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
				class="embeddable-buttondown-form flex flex-col flex-1 space-y-3"
			>
				<label for="email" class="bcu-label"><h6>Email</h6></label>
				<div class="flex gap-4 md:gap-8 flex-col md:flex-row">
					<input type="email" name="email" placeholder="you@example.com" class="text-black input" />
					<input type="hidden" value="1" name="embed" />
					<button class="bcu-button variant-filled-primary" type="submit">Subscribe</button>
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
