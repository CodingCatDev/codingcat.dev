import type { Metadata, ResolvingMetadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type { PageQueryResult } from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchMetadata,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { pageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import ProBenefits from "@/components/pro-benefits";
import { Suspense } from "react";
import { draftMode } from "next/headers";

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	_props: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { perspective } = await getDynamicFetchOptions();
	const page = (
		await sanityFetchMetadata({
			query: pageQuery,
			params: { slug: "pro" },
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

export default async function ProPage() {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicProPage />
			</Suspense>
		);
	}
	return <CachedProPage perspective="published" stega={false} />;
}

async function DynamicProPage() {
	const { perspective, stega } = await getDynamicFetchOptions();
	return <CachedProPage perspective={perspective} stega={stega} />;
}

async function CachedProPage({ perspective, stega }: DynamicFetchOptions) {
	"use cache";
	const page = (
		await sanityFetch({
			query: pageQuery,
			params: { slug: "pro" },
			perspective,
			stega,
		})
	).data as PageQueryResult;

	if (!page?._id) {
		return notFound();
	}

	return (
		<div className="container px-5 mx-auto">
			<div className="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
				{page.coverImage && (
					<Suspense>
						<ProBenefits coverImage={page.coverImage} />
					</Suspense>
				)}
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
	);
}
