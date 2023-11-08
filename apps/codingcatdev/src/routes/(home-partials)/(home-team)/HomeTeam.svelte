<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import GitLineGradient from '../(home-campaign)/GitLineGradient.svelte';
	import TeamSvg from './TeamSvg.svelte';
</script>

<section class="">
	<div class="grid justify-center grid-cols-1 px-8 mx-auto gap-2 2xl:gap-10 max-w-7xl relative">
		<div class="flex">
			<div class="flex flex-col basis-1/12 relative">
				<GitLineGradient />
				<TeamSvg />
				<GitLineGradient rotate={true} />
			</div>
			<div class="basis-11/12 pl-4 sm:pl-2 py-20 sm:py-48 flex flex-col gap-20">
				<div class="flex flex-col lg:flex-row gap-8 items-center">
					<div class="sm:basis-2/3 flex flex-col justify-center gap-8">
						<h2>Meet the team</h2>
						<p>
							Coding Cat is brought to you by Alex and Brittney. Together, they have over 20 years
							of experience training and coaching young developers.
						</p>
					</div>
					<div class="sm:basis-1/3 flex">
						<a href="/courses" class="btn variant-filled sm:btn-xl">Explore courses</a>
					</div>
				</div>
				<!-- Authors -->
				<div class="flex flex-col lg:flex-row gap-8 items-center">
					<div class="sm:basis-1/2 flex flex-col justify-center gap-8">
						<a class="card variant-soft-surface p-8" href="/author/alex-patterson">
							<div class="flex flex-col gap-8">
								<div class="flex flex-col sm:flex-row gap-8 justify-center items-center">
									<Avatar
										src="https://media.codingcat.dev/image/upload/c_thumb,g_face,w_200,h_200/main-codingcatdev-photo/headshots/Alex-Patterson-2022.jpg"
										class="shrink-0"
									/>
									<div class="flex flex-col">
										<h2>Alex Patterson</h2>
										<p>Full-time DevRel</p>
									</div>
								</div>
								<p>
									I am a professional full stack developer, and I am passionate about mentoring new
									developers and helping the community that has allowed me to li...
								</p>
							</div>
						</a>
					</div>
					<div class="sm:basis-1/2 flex flex-col justify-center gap-8">
						<a class="card variant-soft-surface p-8" href="/author/brittney-postma">
							<div class="flex flex-col gap-8">
								<div class="flex flex-col sm:flex-row gap-8 justify-center items-center">
									<Avatar
										src="https://media.codingcat.dev/image/upload/c_thumb,g_face,w_200,h_200/main-codingcatdev-photo/headshots/brittney.jpg"
										class="shrink-0"
									/>
									<div class="flex flex-col">
										<h2>Brittney Postma</h2>
										<p>Full-time Designer</p>
									</div>
								</div>
								<p>
									I love developing beautiful, fluid, and responsive websites using the Jamstack. I
									thrive on UI/UX development with an extensive knowledge of front-end libraries
									Rea...
								</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
