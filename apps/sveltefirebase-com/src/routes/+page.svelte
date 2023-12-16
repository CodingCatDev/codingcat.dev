<script>
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		Frame,
		Dashboard,
		Image,
		CheckCircled,
		LockClosed,
		Rocket,
		Gear,
		Globe
	} from '@steeze-ui/radix-icons';
	import { Tiktok, Youtube } from '@steeze-ui/simple-icons';
	import BuyButton from './BuyButton.svelte';
</script>

<main>
	<div class="px-10">
		<div
			class="relative flex flex-col p-2 pt-20 text-white md:items-center md:text-center overflow-x-clip"
		>
			<img
				src="/favicon.svg"
				class="w-[80%] max-w-2xl absolute opacity-20 -top-0 invisible md:visible z-0"
				alt="Svelte Icon"
			/>

			<div class="flex flex-col items-center">
				<h1
					class="max-w-6xl mx-auto mb-4 text-5xl font-bold tracking-wider md:text-6xl lg:text-8xl md:mb-6"
				>
					<span>Build Purrfect <span class="block">Websites with Svelte!</span></span>
				</h1>
				<p class="max-w-4xl text-xl italic font-light tracking-wider text-gray-200 md:text-2xl">
					<span>
						Learn to build Purrfect websites with Svelte, the web framework that scales with you!
					</span>
				</p>
			</div>

			<div class="absolute top-0 -right-56 opacity-10">
				<div>
					<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg"></div>
					<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-8 ml-10"></div>
					<div
						class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-32 ml-40"
					></div>
				</div>
			</div>
			<div class="absolute bottom-0 -left-48 opacity-10">
				<div>
					<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg"></div>
					<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-8 ml-10"></div>
					<div
						class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-32 ml-40"
					></div>
				</div>
			</div>
		</div>
	</div>
	<div class="relative z-10 flex justify-center my-10 text-white">
		<div class="flex items-center mb-0 gap-x-4">
			<img
				class="inline-block w-16 h-16 rounded-full"
				alt="Alex Patterson in a codingcat hat"
				width="64"
				height="64"
				src="https://media.codingcat.dev/image/upload/f_auto,q_auto/v1701023146/main-codingcatdev-photo/headshots/cool-calm-alex.jpg"
				loading="lazy"
				decoding="async"
			/>
			<p>
				Taught by <a class="font-bold underline underline-offset-4" href="https://alexpatterson.dev"
					>Alex Patterson</a
				>
			</p>
		</div>
	</div>
	<div class="w-full max-w-3xl px-10 mx-auto text-left translate-y-40">
		<div class="relative p-4 py-6 pt-12 bg-white md:p-10 rounded-2xl">
			<h2 class="mb-2 text-3xl font-bold text-primary-500 md:text-4xl md:mb-4">
				Updated for Svelte 5!
			</h2>

			<p class="mb-4 text-xl text-left text-gray-700 text-light">
				This course has been been completely reworked to work with Svelte 5
			</p>

			<a
				class="inline-block w-full px-8 py-4 mb-2 text-sm text-center text-white transition-transform duration-200 rounded-lg bg-primary-500 sm:text-xl md:text-2xl hover:scale-105"
				href="#pricing"
			>
				Start Learning
			</a>
		</div>
	</div>
	<section class="py-20 bg-primary-600" id="overview">
		<div
			class="grid items-center justify-between max-w-6xl grid-cols-1 px-10 mx-auto mt-40 text-center sm:grid-cols-1 lg:grid-cols-3 gap-y-24 lg:gap-y-4"
		>
			<p>
				<span class="relative block font-bold text-center text-white text-8xl">Full</span>
				<span class="text-2xl text-gray-100">Demos</span>
			</p>
			<p>
				<span class="relative block font-bold text-center text-white text-8xl">40+</span>
				<span class="text-2xl text-gray-100">In-depth lessons</span>
			</p>
			<p>
				<span class="relative block font-bold text-center text-white text-8xl">5+</span>
				<span class="text-2xl text-gray-100">Hours of video</span>
			</p>
		</div>
	</section>
	<section id="whatYouBuild" class="relative px-8 py-24 text-white false lg:py-40 overflow-x-clip">
		<div class="max-w-2xl mx-auto mb-20">
			<h2 class="text-4xl font-bold md:text-6xl text-left md:text-center mb-6 leading-[3rem]">
				What you will build 💪
			</h2>
		</div>

		<div class="absolute top-20 -left-48 opacity-10">
			<div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-8 ml-10"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-32 ml-40"></div>
			</div>
		</div>

		<div class="mb-20 xl:pl-30">
			<div
				class="text-xl flex flex-col lg:flex-row gap-y-24 my-8 lg:gap-x-10 items-center relative mb-20"
			>
				<div
					class="relative flex flex-col items-center my-8 mb-20 text-xl lg:flex-row gap-y-24 lg:gap-x-10"
				>
					<div class="items-center p-8 text-left border border-white gap-x-4 lg:w-2/3 rounded-xl">
						<div class="flex items-center justify-center mb-1 gap-x-2 lg:justify-start">
							<h3 class="mb-2 text-3xl font-bold text-white">Whisker Word Blog</h3>
						</div>
						<span class="block text-xl">
							In this course, you&#39;ll build a medium style blog with features like tags,
							pagination, authentication, comments, and more! You&#39;ll also learn to use purrfect
							technologies like
							<a class="underline underline-offset-4" href="https://tailwindcss.com/"
								>Tailwind CSS</a
							>,
							<a class="underline underline-offset-4" href="https://www.typescriptlang.org/"
								>TypeScript</a
							>,
							<a class="underline underline-offset-4" href="https://firebase.com/">Firebase</a>, and
							<a class="underline underline-offset-4" href="https://cloudinary.com/">Cloudinary</a>!
						</span>
						<div class="flex items-center justify-center mt-10 sm:flex-row gap-x-6 gap-y-10">
							<a href="https://tailwindcss.com/" class="transition-transform hover:scale-110"
								><img src="/images/logos/tailwind.svg" class="h-8" alt="Tailwind Icon" /></a
							>
							<a href="https://www.typescriptlang.org/" class="transition-transform hover:scale-110"
								><img src="/images/logos/typescript.svg" class="h-8" alt="TypeScript Icon" /></a
							>
							<a href="https://firebase.com/" class="transition-transform hover:scale-110"
								><img src="/images/logos/firebase.svg" class="h-8" alt="Firebase Icon" /></a
							>
							<a href="https://cloudinary.com/" class="transition-transform hover:scale-110"
								><img src="/images/logos/cloudinary.svg" class="h-8" alt="Cloudinary Icon" /></a
							>
						</div>
					</div>
				</div>
				<div class="order-2 translate-x-0 lg:w-2/3 lg:relative lg:translate-x-10">
					<div
						class="absolute right-0 bg-primary-400 rounded-lg -top-5 -bottom-5 left-10 opacity-20"
					></div>
					<img
						src="https://media.codingcat.dev/image/upload/f_auto,q_auto/v1701028803/main-codingcatdev-photo/whisker-word.jpg"
						alt="Whisker Word"
						class="relative z-10 rounded-lg"
					/>
				</div>
			</div>

			<ul
				class="grid grid-cols-1 p-8 pl-4 mx-auto mb-8 text-xl font-bold text-white list-disc gap-y-3 lg:gap-y-4 md:grid-cols-2 lg:grid-cols-3 md:text-2xl justify-items-center"
			>
				<li class="flex items-center gap-x-2">Static Site Generation</li>
				<li class="flex items-center gap-x-2">Server-side Rendering</li>
				<li class="flex items-center gap-x-2">Image Optimization</li>
				<li class="flex items-center gap-x-2">Integrations</li>
				<li class="flex items-center gap-x-2">Tailwind CSS</li>
				<li class="flex items-center gap-x-2">TypeScript Types</li>
				<li class="flex items-center gap-x-2">API Routes/Endpoints</li>
				<li class="flex items-center gap-x-2">Pagination</li>
				<li class="flex items-center gap-x-2">SEO and Meta Tags</li>
				<li class="flex items-center gap-x-2">RSS Feeds</li>
				<li class="flex items-center gap-x-2">Deploying and Hosting</li>
			</ul>
		</div>
	</section>
	<section
		id="topics"
		class="relative px-8 py-24 text-white bg-primary-600 lg:py-40 overflow-x-clip"
	>
		<div class="max-w-2xl mx-auto mb-20">
			<h2 class="text-4xl font-bold md:text-6xl text-left md:text-center mb-6 leading-[3rem]">
				What topics are covered in this course?
			</h2>

			<p
				class="max-w-2xl mx-auto mb-20 text-lg leading-relaxed tracking-wide text-left md:text-2xl md:text-center"
			>
				One thing you can be sure of is that we take no short-cuts! You will learn core Svelte
				concepts hands-on and in-depth.
			</p>
		</div>
		<div class="absolute top-40 -right-56 opacity-10">
			<div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-8 ml-10"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-32 ml-40"></div>
			</div>
		</div>

		<div class="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 gap-y-12">
			<div>
				<Icon src={Frame} class="w-12 h-12 my-4" theme="solid" />
				<h3 class="mb-2 text-2xl font-bold">Static Site Generation vs Server-side Rendering</h3>
				<p class="text-lg leading-relaxed tracking-wide opacity-90">
					Learn about the multiple strategies Svelte provides for rendering pages in the browser
				</p>
			</div>
			<div>
				<Icon src={Dashboard} class="w-12 h-12 my-4" theme="solid" />
				<h3 class="mb-2 text-2xl font-bold">Firestore</h3>
				<p class="text-lg leading-relaxed tracking-wide opacity-90">
					Create, organize, and maintain databases with both serverside and clientside realtime
					database.
				</p>
			</div>
			<div>
				<Icon src={Image} class="w-12 h-12 my-4" theme="solid" />
				<h3 class="mb-2 text-2xl font-bold">Image Optimization</h3>
				<p class="text-lg leading-relaxed tracking-wide opacity-90">
					Use the Svelte Image component to optimized images with lazy loading for faster load times
				</p>
			</div>
			<div>
				<Icon src={CheckCircled} class="w-12 h-12 my-4" theme="solid" />
				<h3 class="mb-2 text-2xl font-bold">TypeScript</h3>
				<p class="text-lg leading-relaxed tracking-wide opacity-90">
					Use TypeScript to define prop types, database table models, and frontmatter schemas for
					Content Collections
				</p>
			</div>
			<div>
				<Icon src={LockClosed} class="w-12 h-12 my-4" theme="solid" />
				<h3 class="mb-2 text-2xl font-bold">Authentication</h3>
				<p class="text-lg leading-relaxed tracking-wide opacity-90">
					Learn to build a basic auth strategy using Server-side Rendering, Firebase, and cookies.
				</p>
			</div>
			<div class="">
				<Icon src={Rocket} class="w-12 h-12 my-4" theme="solid" />
				<h3 class="mb-2 text-2xl font-bold">Deploying and Hosting</h3>
				<p class="text-lg leading-relaxed tracking-wide opacity-90">
					Deploy and host your website with Svelte and get your site live in no time
				</p>
			</div>
		</div>
	</section>
	<section
		id="whoIsItFor"
		class="relative px-8 py-24 text-white undefined lg:py-40 overflow-x-clip"
	>
		<div class="max-w-2xl mx-auto mb-20">
			<h2 class="text-4xl font-bold md:text-6xl text-left md:text-center mb-6 leading-[3rem]">
				Is this course for
				<span class="px-2 py-1 border-2 border-white rounded-lg"> you? </span>
			</h2>

			<p
				class="max-w-2xl mx-auto mb-20 text-lg leading-relaxed tracking-wide text-left md:text-2xl md:text-center"
			>
				This course is built for beginner to intermediate web developers who have
			</p>
		</div>

		<div class="absolute top-20 -left-48 opacity-10">
			<div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-8 ml-10"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-32 ml-40"></div>
			</div>
		</div>

		<div class="max-w-6xl mx-auto">
			<div class="flex flex-col max-w-2xl mx-auto mb-20 lg:flex-row gap-y-8 gap-x-10 lg:max-w-4xl">
				<div class="flex items-center gap-x-4">
					<Icon src={Gear} class="w-20 h-20" theme="solid" />
					<p class="text-xl opacity-90">A fundamental knowledge of HTML, CSS, and JavaScript</p>
				</div>
				<div class="flex items-center gap-x-4">
					<Icon src={Gear} class="w-20 h-20" theme="solid" />
					<p class="text-xl opacity-90">A desire to learn new skills to put on their resume</p>
				</div>
				<div class="flex items-center gap-x-4">
					<Icon src={Gear} class="w-20 h-20" theme="solid" />
					<p class="text-xl opacity-90">
						Some experience with a framework (encouraged but not required)
					</p>
				</div>
			</div>
			<p class="max-w-xl mx-auto text-lg text-center opacity-80">
				*Still not sure if it's for you? Send me an email at <a
					href="mailto:alex@codingcat.dev"
					class="underline cursor">alex@codingcat.dev</a
				> with any outstanding questions!
			</p>
		</div>
	</section>
	<section id="yourInstructor" class="px-8 pb-32 text-white bg-primary-600 pt-60">
		<div class="max-w-6xl mx-auto">
			<h2 class="mb-20 text-4xl font-bold text-center md:text-6xl lg:text-left lg:mb-4">
				Hi, I&#39;m Alex Patterson
			</h2>

			<div class="flex flex-col items-center justify-between -my-10 lg:flex-row gap-x-10 md:-my-4">
				<div class="order-2 grow-1 lg:order-first">
					<p class="mb-10 text-xl tracking-wider">
						I&#39;m a full-stack developer with a passion for teaching developers, and I&#39;m here
						to help you learn the latest and greatest in web development.
					</p>
				</div>

				<div class="flex flex-col items-center gap-y-4 mb-10 lg:mb-0 w-full md:min-w-[400px]">
					<div
						class="inline-block max-w-sm p-2 rounded-full bg-gradient-to-r from-primary-600 via-primary-500 via-70% to-secondary-500 to-97%"
					>
						<img
							class="inline-block rounded-full md:h-80 md:w-80"
							alt="Alex Patterson taking a selfie"
							width="600"
							height="600"
							src="https://media.codingcat.dev/image/upload/f_auto,q_auto/v1701023146/main-codingcatdev-photo/headshots/cool-calm-alex.jpg"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<div class="flex gap-x-4">
						<a href="https://twitter.com/codingcatdev" class="w-8 h-8 fill-white">
							<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
								><title>X</title><path
									d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
								/></svg
							>
						</a>
						<a href="https://www.youtube.com/c/codingcatdev" class="">
							<Icon src={Youtube} class="w-8 h-8" theme="solid" />
						</a>
						<a href="https://www.tiktok.com/@codingcatdev " class="">
							<Icon src={Tiktok} class="w-8 h-8" theme="solid" />
						</a>
						<a href="https://codingcat.dev/" class="">
							<Icon src={Globe} class="w-8 h-8" theme="solid" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section id="pricing" class="relative px-8 py-24 text-white false lg:py-40 overflow-x-clip">
		<div class="max-w-2xl mx-auto mb-20">
			<h2 class="text-4xl font-bold md:text-6xl text-left md:text-center mb-6 leading-[3rem]">
				Ready to Start Learning?
			</h2>

			<p
				class="max-w-2xl mx-auto mb-20 text-lg leading-relaxed tracking-wide text-left md:text-2xl md:text-center"
			>
				Learn everything you need to know about one of the most exciting frameworks in JavaScript!
			</p>
		</div>

		<div class="absolute top-20 -left-48 opacity-10">
			<div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-8 ml-10"></div>
				<div class="h-64 w-64 border-[1px] border-gray-100 rounded-lg -translate-y-32 ml-40"></div>
			</div>
		</div>

		<div
			class="grid grid-cols-1 gap-y-10 lg:grid-cols-[1fr,1fr] justify-stretch items-center ml[10px] max-w-xl lg:max-w-6xl mx-auto"
		>
			<div class="shadow-xl lg:min-w-[500px] bg-white rounded-xl p-10 flex flex-col">
				<h3 class="text-2xl font-bold text-center text-primary-600">Half-stack (Basic Package)</h3>
				<p class="mb-4 text-xl text-center text-gray-500">Static Site Generation Only</p>
				<p class="flex items-start justify-center mb-10 font-bold text-gray-700 text-7xl">
					<span class="text-sm">US</span> $75
					<span class="text-sm">00</span>
				</p>
				<ul class="flex flex-col mb-4 gap-y-4">
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Svelte Components, Integrations, and Islands
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Dynamic Routes, Pagination, and SEO
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Image Optimization
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Deploying to Vercel and Netlify
					</li>
				</ul>

				<BuyButton
					products={[{ price: 'price_1ONlQ4BRZJZU8OtitkhgDim4', id: 'prod_PC9jdJ5xQ90vXk' }]}
					title="Half-stack (Basic Package)"
				/>
				<p class="mb-4 text-sm text-gray-700 text-light">*30 day money-back guarantee</p>
			</div>
			<div
				class="shadow-xl lg:min-w-[500px] bg-white rounded-xl p-10 flex flex-col shadow-primary-900 border-8 border-primary-400 py-20 -ml-[10px]"
			>
				<h3 class="text-2xl font-bold text-center text-primary-600">
					Full-stack (Premium Package)
				</h3>
				<p class="mb-4 text-xl text-center text-gray-500">
					Static Site Generation + Server-side Rendering
				</p>
				<p class="flex items-start justify-center mb-10 font-bold text-gray-700 text-7xl">
					<span class="text-sm">US</span> $150
					<span class="text-sm">00</span>
				</p>
				<ul class="flex flex-col mb-4 gap-y-4">
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Automatic Cover Images with Cloudinary
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Handling Forms and API Routes
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Database Integration Using Firebase
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Authentication with Firebase on the Server
					</li>
					<li class="relative flex items-center text-lg text-gray-900 gap-2">
						<span>
							<Icon src={CheckCircled} class="w-8 h-8" theme="solid" />
						</span> Everything From the Basic Package
					</li>
				</ul>

				<BuyButton
					products={[{ price: 'price_1ONlQqBRZJZU8OtizR5Evn73', id: 'prod_PC9k21bMz8VfkU' }]}
					title="Full-stack (Premium Package)"
				/>
				<p class="mb-4 text-sm text-gray-700 text-light">*30 day money-back guarantee</p>
			</div>
		</div>
	</section>
	<!-- <NewsletterSection /> -->
	<section id="faq" class="relative px-8 py-24 text-white undefined lg:py-40 overflow-x-clip">
		<div class="max-w-2xl mx-auto mb-20">
			<h2 class="text-4xl font-bold md:text-6xl text-left md:text-center mb-6 leading-[3rem]">
				Got questions?
			</h2>
		</div>

		<div class="relative max-w-6xl mx-auto">
			<div class="grid grid-cols-1 gap-20 mb-10 lg:grid-cols-2 md:mb-20">
				<div>
					<h3 class="mb-2 text-2xl font-bold lg:text-4xl lg:mb-6">Is this course right for me?</h3>
					<p class="text-lg tracking-wide text-white lg:text-xl">
						This course is made for beginner to intermediate JavaScript developers. The expectation
						is that you have basic knowledge of JavaScript and HTML/CSS. Framework experience is
						encouraged but not required.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-2xl font-bold lg:text-4xl lg:mb-6">What is your refund policy?</h3>
					<p class="text-lg tracking-wide text-white lg:text-xl">
						We offer a 30-day money-back guarantee. If you are not satisfied with the course, you
						can request a refund within 30 days of purchase.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-2xl font-bold lg:text-4xl lg:mb-6">
						Is there parity pricing available?
					</h3>
					<p class="text-lg tracking-wide text-white lg:text-xl">
						Yes! We offer parity pricing. If the cost of this course is prohibitive in your country,
						please <a href="https://beacons.ai/codingcatdev">contact me</a> for more information.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-2xl font-bold lg:text-4xl lg:mb-6">Is there a student discount?</h3>
					<p class="text-lg tracking-wide text-white lg:text-xl">
						Yes! We offer a 50% discount for students. Please send me an email from your university
						email or a picture of your student id.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-2xl font-bold lg:text-4xl lg:mb-6">
						What if I need help during the course?
					</h3>
					<p class="text-lg tracking-wide text-white lg:text-xl">
						By purchasing this course, you'll have access to a private Discord channel where you can
						ask questions and get help from the instructor and other students.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-2xl font-bold lg:text-4xl lg:mb-6">
						What if I have more questions?
					</h3>
					<p class="text-lg tracking-wide text-white lg:text-xl">
						If you have any questions that are not answered here, please <a
							href="https://beacons.ai/codingcatdev">contact me</a
						>!
					</p>
				</div>
			</div>
			<img
				src="/favicon.svg"
				class="w-[80%] max-w-2xl absolute opacity-5 left-[50%] -translate-x-1/2 -top-10"
				alt="Svelte Icon"
			/>
		</div>
	</section>
	<!-- <Pricing /> -->
	<section class="relative px-8 text-white bg-primary-600 false overflow-x-clip">
		<div class="max-w-2xl mx-auto mb-20"></div>

		<div class="py-20">
			<div class="flex flex-col items-center content-center mb-6">
				<p class="mb-4 text-lg">What are you waiting for?</p>
				<a
					href="#pricing"
					class="px-6 py-3 text-sm font-bold text-primary-500 transition-transform bg-white rounded-lg sm:text-xl hover:scale-105"
				>
					Start learning today!
				</a>
			</div>
			<p class="text-center opacity-80">Copyright. {new Date().getFullYear()} CodingCatDev, LLC</p>
		</div>
	</section>
</main>
