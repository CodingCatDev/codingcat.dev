import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type {
  SponsorQueryResult,
  SponsorQueryWithRelatedResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sponsorQuery, sponsorQueryWithRelated } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import { BreadcrumbLinks } from "@/components/breadrumb-links";

import UserSocials from "@/components/user-socials";
import UserRelated from "@/components/user-related";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sponsor = await sanityFetch<SponsorQueryResult>({
    query: sponsorQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(sponsor?.coverImage);

  return {
    title: sponsor?.title,
    description: sponsor?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function SponsorPage({ params }: Props) {
  const [sponsor] = await Promise.all([
    sanityFetch<SponsorQueryWithRelatedResult>({
      query: sponsorQueryWithRelated,
      params,
    }),
  ]);

  if (!sponsor?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[
          { title: "Sponsors", href: "/sponsors/page/1" },
          { title: sponsor.title },
        ]}
      />
      <div className="w-full flex flex-col gap-4 md:gap-8">
        <CoverMedia
          cloudinaryImage={sponsor?.coverImage}
          cloudinaryVideo={sponsor?.videoCloudinary}
          youtube={sponsor?.youtube}
        />
        <div className="flex flex-col gap-2 md:gap-">
          <h1 className="text-xl font-bold leading-tight tracking-tighter text-balance md:text-2xl md:leading-none lg:text-4xl">
            {sponsor.title}
          </h1>
          {sponsor?.socials && (
            <div className="flex flex-wrap gap-2">
              <UserSocials socials={sponsor.socials} />
            </div>
          )}
        </div>
        <article>
          {sponsor.content?.length && (
            <PortableText
              className="prose-violet lg:prose-xl dark:prose-invert"
              value={sponsor.content as PortableTextBlock[]}
            />
          )}
        </article>
      </div>
      <UserRelated {...sponsor?.related} />
    </div>
  );
}
