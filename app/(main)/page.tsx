import CarbonAdBanner from "@/components/carbon-ad-banner";
import CoverImage from "@/components/cover-image";
import Buy from "@/components/user-buy";
import UserGoProButton from "@/components/user-go-pro-button";
import type { HomePageQueryResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";
import { homePageQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export default async function HomePage() {
	const [homePageFetch] = await Promise.all([
		sanityFetch({
			query: homePageQuery,
		}),
	]);

	const homePage = homePageFetch.data as HomePageQueryResult;

	return (
		<div className="flex flex-col min-h-dvh">
			<main className="flex-1">
				<section className="w-full pb-12 md:py-24 lg:py-32">
					<div className=" px-4 md:px-6 grid gap-8 md:grid-cols-2 lg:gap-16">
						{homePage?.featuredCourse && (
							<div className="space-y-4 flex flex-col items-start gap-2">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Featured Course
								</div>
								<Link
									href={`/${homePage?.featuredCourse?._type}/${homePage?.featuredCourse?.slug}`}
									className="w-full"
								>
									{homePage?.featuredCourse?.coverImage && (
										<CoverImage
											image={homePage?.featuredCourse?.coverImage}
											priority
										/>
									)}
									<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
										{homePage?.featuredCourse?.title}
									</h2>
									<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
										{homePage?.featuredCourse?.excerpt}
									</p>
								</Link>
								{homePage?.featuredCourse?.stripeProduct &&
									homePage?.featuredCourse?.title && (
										<div className="flex flex-col gap-2 min-[400px]:flex-row">
											<Buy
												stripeProduct={homePage?.featuredCourse?.stripeProduct}
												title={homePage?.featuredCourse?.title}
											/>
											<UserGoProButton />
										</div>
									)}
							</div>
						)}

						{homePage?.latestPodcast && (
							<div className="space-y-4 flex flex-col items-start gap-2">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Latest Podcast
								</div>
								<Link
									href={`/${homePage?.latestPodcast?._type}/${homePage?.latestPodcast?.slug}`}
									className="w-full"
								>
									{homePage?.latestPodcast?.coverImage && (
										<CoverImage
											image={homePage?.latestPodcast?.coverImage}
											priority
										/>
									)}
									<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
										{homePage?.latestPodcast?.title}
									</h2>
									<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
										{homePage?.latestPodcast?.excerpt}
									</p>
								</Link>
							</div>
						)}
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="relative mb-32 flex flex-col justify-center items-center">
						<div className="lg:absolute lg:-mt-36 px-8">
							<CarbonAdBanner />
						</div>
					</div>
					<div className=" px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Featured Courses
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Check out our best courses.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
							{homePage?.featuredCourses?.map((fc) => (
								<div key={fc._id} className="space-y-4">
									<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
										Featured Course
									</div>
									<Link href={`${fc?._type}/${fc?.slug}`}>
										{fc?.coverImage && <CoverImage image={fc?.coverImage} />}
									</Link>
									<Link href={`${fc?._type}/${fc?.slug}`}>
										<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
											{fc?.title}
										</h2>
									</Link>
									<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
										{fc?.excerpt}
									</p>
									{fc?.stripeProduct && fc?.title && (
										<div className="flex flex-col gap-2 min-[400px]:flex-row">
											<Buy
												stripeProduct={fc?.stripeProduct}
												title={fc?.title}
											/>
											<UserGoProButton />
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 ">
					<div className=" px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Top Podcasts
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Check out our latest and greatest podcast episodes covering a
									wide range of topics in web development.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
							{homePage?.topPodcasts
								?.slice(0, homePage?.topPodcasts.length / 2)
								.map((_p, i) => (
									<div
										className="grid gap-4"
										key={`podcast-group-${homePage?.topPodcasts[i * 2]?._id}-${homePage?.topPodcasts[i * 2 + 1]?._id}`}
									>
										{homePage?.topPodcasts
											?.slice(i * 2, i * 2 + 2)
											.map((podcast) => (
												<Link
													key={podcast?._id}
													href={`/${podcast?._type}/${podcast?.slug}`}
													className="flex flex-col gap-4 bg-background shadow-sm hover:scale-105 transform transition duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
													prefetch={false}
												>
													<div className="flex flex-col">
														{podcast.coverImage && (
															<CoverImage
																image={podcast.coverImage}
																width={320}
																height={180}
																className="aspect-video w-full object-cover object-center"
															/>
														)}
														<div className="flex flex-col gap-2 p-2 sm:p-6">
															<h3 className="text-xl sm:text-3xl font-semibold">
																{podcast.title}
															</h3>
															<p className="text-sm text-muted-foreground line-clamp-2">
																{podcast.excerpt}
															</p>
														</div>
													</div>
												</Link>
											))}
									</div>
								))}
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className=" px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									From the Blog
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Check out our latest blog posts on a variety of web
									development topics.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
							{homePage?.latestPosts
								?.slice(0, homePage?.latestPosts.length / 2)
								.map((_p, i) => (
									<div
										className="grid gap-4"
										key={`posts-group-${homePage?.latestPosts[i * 2]?._id}-${homePage?.latestPosts[i * 2 + 1]?._id}`}
									>
										{homePage?.latestPosts
											?.slice(i * 2, i * 2 + 2)
											.map((post) => (
												<Link
													key={post?._id}
													href={`/${post?._type}/${post?.slug}`}
													className="flex flex-col gap-4 shadow-sm hover:scale-105 transform transition duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-muted"
													prefetch={false}
												>
													<div className="flex flex-col">
														{post.coverImage && (
															<CoverImage
																image={post.coverImage}
																width={320}
																height={180}
																className="aspect-video w-full object-cover object-center"
															/>
														)}
														<div className="flex flex-col gap-2 p-2 sm:p-6">
															<h3 className="text-xl sm:text-3xl font-semibold">
																{post.title}
															</h3>
															<p className="text-sm text-muted-foreground line-clamp-2">
																{post.excerpt}
															</p>
														</div>
													</div>
												</Link>
											))}
									</div>
								))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
