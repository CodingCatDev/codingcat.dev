import type { Metadata, ResolvingMetadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type { PageQueryResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";
import { pageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import CoverImage from "@/components/cover-image";

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const page = (
		await sanityFetch({
			query: pageQuery,
			params: {
				slug: "sponsorships",
			},
			stega: false,
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

export default async function SponsorshipsPage({
	params,
	searchParams,
}: Props) {
	const page = (
		await sanityFetch({
			query: pageQuery,
			params: {
				slug: "sponsorships",
			},
			stega: false,
		})
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
				<div className="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">

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
