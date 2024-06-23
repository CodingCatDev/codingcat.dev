import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import PortableText from "@/components/portable-text";

import type { PodcastQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { podcastQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import MoreHeader from "@/components/more-header";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import SponsorCard from "@/components/sponsor-card";
import Avatar from "@/components/avatar";
import Picks from "./picks";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const podcast = await sanityFetch<PodcastQueryResult>({
    query: podcastQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(podcast?.coverImage);

  return {
    authors:
      podcast?.author?.map((a) => {
        return { name: a.title };
      }) || [],
    title: podcast?.title,
    description: podcast?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PodcastPage({ params }: Props) {
  const [podcast] = await Promise.all([
    sanityFetch<PodcastQueryResult>({
      query: podcastQuery,
      params,
    }),
  ]);

  if (!podcast?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[
          { title: "Podcasts", href: "/podcasts/page/1" },
          { title: podcast.title },
        ]}
      />
      <article>
        <h1 className="mb-12 text-4xl font-bold leading-tight tracking-tighter text-balance md:text-7xl md:leading-none lg:text-8xl">
          {podcast.title}
        </h1>
        <div className="hidden md:mb-12 md:block">
          <div className="flex flex-col gap-8">
            {(podcast?.author || podcast?.guest) && (
              <div className="flex flex-wrap gap-2">
                {podcast?.author?.map((a) => (
                  <Avatar
                    key={a._id}
                    name={a.title}
                    href={`/author/${a?.slug}`}
                    coverImage={a?.coverImage}
                  />
                ))}
                {podcast?.guest?.map((a) => (
                  <Avatar
                    key={a._id}
                    name={a.title}
                    href={`/guest/${a?.slug}`}
                    coverImage={a?.coverImage}
                  />
                ))}
              </div>
            )}
            <div className="text-lg">
              <DateComponent dateString={podcast.date} />
            </div>
          </div>
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverMedia
            cloudinaryImage={podcast?.coverImage}
            cloudinaryVideo={podcast?.videoCloudinary}
            youtube={podcast?.youtube}
          />
        </div>
        <div className="block md:hidden">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              {(podcast?.author || podcast?.guest) && (
                <div className="flex flex-wrap gap-2">
                  {podcast?.author?.map((a) => (
                    <Avatar
                      key={a._id}
                      name={a.title}
                      href={`/author/${a?.slug}`}
                      coverImage={a?.coverImage}
                    />
                  ))}
                  {podcast?.guest?.map((a) => (
                    <Avatar
                      key={a._id}
                      name={a.title}
                      href={`/guest/${a?.slug}`}
                      coverImage={a?.coverImage}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4 text-lg">
              <DateComponent dateString={podcast.date} />
            </div>
          </div>
        </div>
        {podcast?.sponsor?.length && (
          <section className="flex flex-col mx-auto max-w-[100ch]">
            <h2 className="mb-4 text-2xl font-bold">Sponsors</h2>
            <hr className="mb-10 border-accent-2 mt-10" />
            <div className="my-12 ">
              <SponsorCard sponsors={podcast.sponsor} />
            </div>
          </section>
        )}
        {podcast?.content?.length && (
          <PortableText
            className="mx-auto prose-violet lg:prose-xl dark:prose-invert"
            value={podcast.content as PortableTextBlock[]}
          />
        )}
      </article>
      {podcast?.pick?.length && (
        <>
          <hr className="mb-8 sm:mb-24 border-accent-2 mt-8 sm:mt-28" />
          <div className="flex flex-col md:flex-row md:justify-between">
            <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
              Picks
            </h2>
          </div>

          <section className="p-0 sm:p-12">
            <div className="grid gap-2 sm:gap-8">
              <Picks picks={podcast.pick} />
            </div>
          </section>
        </>
      )}
      <aside>
        <MoreHeader title="Recent Podcasts" href="/podcasts/page/1" />
        <Suspense>
          <MoreContent type={podcast._type} skip={podcast._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
