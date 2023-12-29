<script lang="ts">
	export let url: string;
	$: github = url.replace('https://github.com/', '');
</script>

<section class="flex w-full items-center align-middle gap-2 flex-wrap">
	<a href={`https://codespaces.new/${github}`} target="_blank">
		<img
			src="https://github.com/codespaces/badge.svg"
			alt="Open in GitHub Codespaces"
			style="max-width: 100%;"
		/>
	</a>
	<a href={`https://stackblitz.com/github/${github}`} target="_blank">
		<img
			alt="Open in StackBlitz"
			src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
		/>
	</a>

	<a href={`https://gitpod.io/#https://github.com/${github}`} target="_blank">
		<img alt="Open in Gitpod" src="https://gitpod.io/button/open-in-gitpod.svg" />
	</a>

	<a href={`https://githubbox.com/${github}`} target="_blank">
		<img
			alt="Open in CodeSandbox"
			src="https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox"
		/>
	</a>
</section>
