import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type {
  GuestQueryResult,
  GuestQueryWithRelatedResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { guestQuery, guestQueryWithRelated } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import { BreadcrumbLinks } from "@/components/breadrumb-links";

import UserSocials from "@/components/user-socials";
import UserRelated from "@/components/user-related";
import Avatar from "@/components/avatar";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const guest = await sanityFetch<GuestQueryResult>({
    query: guestQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(guest?.coverImage);

  return {
    title: guest?.title,
    description: guest?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function GuestPage({ params }: Props) {
  const [guest] = await Promise.all([
    sanityFetch<GuestQueryWithRelatedResult>({
      query: guestQueryWithRelated,
      params,
    }),
  ]);

  if (!guest?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[
          { title: "Guests", href: "/guests/page/1" },
          { title: guest.title },
        ]}
      />
      <div className="w-full flex flex-col gap-4 md:gap-8">
        <div className="flex gap-2 md:gap-8">
          {guest?.coverImage && (
            <div>
              <Avatar
                coverImage={guest?.coverImage}
                imgSize="w-24 h-24 mr-4"
                height={96}
                width={96}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 md:gap-">
            <h1 className="text-xl font-bold leading-tight tracking-tighter text-balance md:text-2xl md:leading-none lg:text-4xl">
              {guest.title}
            </h1>
            {guest?.socials && (
              <div className="flex flex-wrap gap-2">
                <UserSocials socials={guest.socials} />
              </div>
            )}
          </div>
        </div>
        <article>
          {guest.content?.length && (
            <PortableText
              className="prose-violet lg:prose-xl dark:prose-invert"
              value={guest.content as PortableTextBlock[]}
            />
          )}
        </article>
      </div>
      <UserRelated {...guest?.related} />
    </div>
  );
}
