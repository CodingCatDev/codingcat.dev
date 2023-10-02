<script>
	import HomeHero from './(home-partials)/HomeHero.svelte';
	import LightChange from './(home-partials)/LightChange.svelte';
</script>

<section
	class="grid justify-center grid-cols-1 p-8 mx-auto gap-2 2xl:gap-10 lg:grid-cols-2 lg:px-10 max-w-7xl"
>
	<HomeHero />

	<div class="bcu-card p-8 col-span-full">
		<div class="flex flex-wrap justify-center align-middle items-center">
			<div class="text-2xl max-w-xl flex flex-col gap-2 md:gap-8">
				<div>
					A <span
						class="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-100 font-bold bg-clip-text text-transparent box-decoration-clone text-3xl"
						>"Light Bulb Moment"
					</span>
					can be incredibly inspiring because it represents a sudden burst of insight and understanding.
				</div>
				<div>
					It's a reminder that sometimes all it takes is one brilliant idea to spark a chain
					reaction of creativity and innovation. So, never give up on the pursuit of knowledge and
					discovery, because you never know when your own "light bulb moment" might strike and
					change everything.
				</div>
			</div>
			<LightChange />
		</div>
	</div>
</section>
