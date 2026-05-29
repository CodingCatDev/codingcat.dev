import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type {
	AuthorQueryResult,
	AuthorQueryWithRelatedResult,
} from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import {
	authorQuery,
	authorQueryWithRelated,
	authorSlugsQuery,
} from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import { BreadcrumbLinks } from "@/components/breadrumb-links";

import UserSocials from "@/components/user-socials";
import UserRelated from "@/components/user-related";
import { draftMode } from "next/headers";
import { Suspense } from "react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
	const { data } = await sanityFetchStaticParams({ query: authorSlugsQuery });
	return data as { slug: string }[];
}

export async function generateMetadata(
	{ params }: { params: Params },
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [{ slug }, { perspective }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);

	const author = (
		await sanityFetchMetadata({
			query: authorQuery,
			params: { slug },
			perspective,
		})
	).data as AuthorQueryResult;

	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(author?.coverImage);

	return {
		title: author?.title,
		description: author?.excerpt,
		openGraph: {
			images: ogImage ? ogImage : previousImages,
		},
	} satisfies Metadata;
}

export default async function AuthorPage({ params }: { params: Params }) {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicAuthorPage params={params} />
			</Suspense>
		);
	}
	const { slug } = await params;
	return <CachedAuthorPage slug={slug} perspective="published" stega={false} />;
}

async function DynamicAuthorPage({ params }: { params: Params }) {
	const [{ slug }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);
	return (
		<CachedAuthorPage slug={slug} perspective={perspective} stega={stega} />
	);
}

async function CachedAuthorPage({
	slug,
	perspective,
	stega,
}: { slug: string } & DynamicFetchOptions) {
	"use cache";
	const author = (
		await sanityFetch({
			query: authorQueryWithRelated,
			params: { slug },
			perspective,
			stega,
		})
	).data as AuthorQueryWithRelatedResult;

	if (!author?._id) {
		return notFound();
	}

	return (
		<div className="container px-5 mx-auto">
			<BreadcrumbLinks
				links={[{ title: "Authors", href: "/authors/page/1" }]}
			/>
			<div className="w-full flex flex-col gap-4 md:gap-8">
				<div className="flex gap-2 md:gap-8">
					<div>
						<CoverMedia
							cloudinaryImage={author?.coverImage}
							cloudinaryVideo={author?.videoCloudinary}
							youtube={author?.youtube}
							className="w-24 h-24 md:w-32 md:h-32 rounded-md"
						/>
					</div>
					<div className="flex flex-col gap-2 md:gap-">
						<h1 className="text-xl font-bold leading-tight tracking-tighter text-balance md:text-2xl md:leading-none lg:text-4xl">
							{author.title}
						</h1>
						{author?.socials && (
							<div className="flex flex-wrap gap-2">
								<UserSocials socials={author.socials} />
							</div>
						)}
					</div>
				</div>
				<article>
					{author.content?.length && (
						<PortableText
							className="prose-violet lg:prose-xl dark:prose-invert"
							value={author.content as PortableTextBlock[]}
						/>
					)}
				</article>
			</div>
			<UserRelated {...author?.related} />
		</div>
	);
}
