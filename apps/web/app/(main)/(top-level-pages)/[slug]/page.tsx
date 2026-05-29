import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type { PageQueryResult } from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { pageQuery, pageSlugsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { draftMode } from "next/headers";
import { Suspense } from "react";

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
	const { data } = await sanityFetchStaticParams({ query: pageSlugsQuery });
	return data as { slug: string }[];
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [{ slug }, { perspective }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);

	const page = (
		await sanityFetchMetadata({
			query: pageQuery,
			params: { slug },
			perspective,
		})
	).data as PageQueryResult;
	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(page?.coverImage);

	return {
		title: page?.title,
		description: page?.excerpt,
		openGraph: {
			images: ogImage ? ogImage : previousImages,
		},
	} satisfies Metadata;
}

export default async function PagePage({ params }: Props) {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicPagePage params={params} />
			</Suspense>
		);
	}
	const { slug } = await params;
	return <CachedPagePage slug={slug} perspective="published" stega={false} />;
}

async function DynamicPagePage({ params }: Pick<Props, "params">) {
	const [{ slug }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);
	return <CachedPagePage slug={slug} perspective={perspective} stega={stega} />;
}

async function CachedPagePage({
	slug,
	perspective,
	stega,
}: { slug: string } & DynamicFetchOptions) {
	"use cache";
	const page = (
		await sanityFetch({ query: pageQuery, params: { slug }, perspective, stega })
	).data as PageQueryResult;

	if (!page?._id) {
		return notFound();
	}

	return (
		<div className="container px-5 mx-auto">
			<div className="w-full flex flex-col gap-4 md:gap-8 my-8 md:my-12">
				<div className="flex flex-col gap-2 md:gap-">
					<h1 className="text-xl font-bold leading-tight tracking-tighter text-balance md:text-2xl md:leading-none lg:text-4xl">
						{page.title}
					</h1>
				</div>
				<article>
					{page.content?.length && (
						<PortableText
							className="prose-violet lg:prose-xl dark:prose-invert"
							value={page.content as PortableTextBlock[]}
						/>
					)}
				</article>
			</div>
		</div>
	);
}
