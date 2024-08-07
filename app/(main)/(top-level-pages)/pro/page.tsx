import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type { PageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import ProBenefits from "@/components/pro-benefits";
import { Suspense } from "react";

type Props = {
  params: false;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await sanityFetch<PageQueryResult>({
    query: pageQuery,
    params: {
      slug: "pro",
    },
    stega: false,
  });
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
  const [page] = await Promise.all([
    sanityFetch<PageQueryResult>({
      query: pageQuery,
      params: {
        slug: "pro",
      },
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <div className="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
        {page.coverImage &&
          <Suspense>
            <ProBenefits coverImage={page.coverImage} />
          </Suspense>
        }
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
