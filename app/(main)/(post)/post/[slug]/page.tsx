import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

//Google Ads
import dynamic from "next/dynamic";
const GoogleAdBanner = dynamic(() => import("@/components/google-ad-banner"), {
  ssr: false,
});

import Avatar from "@/components/avatar";
import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import PortableText from "@/components/portable-text";

import type { PostQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import MoreHeader from "@/components/more-header";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import SponsorCard from "@/components/sponsor-card";
import CarbonAdBanner from "@/components/carbon-ad-banner";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await sanityFetch<PostQueryResult>({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors:
      post?.author?.map((a) => {
        return { name: a.title };
      }) || [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? ogImage : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const [post] = await Promise.all([
    sanityFetch<PostQueryResult>({
      query: postQuery,
      params,
    }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[{ title: "Blog", href: "/blog/page/1" }]}
      />
      <article>
        <h1 className="mb-12 text-4xl font-bold leading-tight tracking-tighter text-balance md:text-7xl md:leading-none lg:text-8xl">
          {post.title}
        </h1>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverMedia
            cloudinaryImage={post?.coverImage}
            cloudinaryVideo={post?.videoCloudinary}
            youtube={post?.youtube}
          />
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="max-w-2xl sm:max-w-none flex-1">
            <div className="mb-6">
              {(post?.author) && (
                <div className="flex flex-wrap gap-2">
                  {post?.author?.map((a) => (
                    <Avatar
                      key={a._id}
                      name={a.title}
                      href={`/author/${a?.slug}`}
                      coverImage={a?.coverImage}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4 text-lg">
              <DateComponent dateString={post.date} />
            </div>
          </div>
          <CarbonAdBanner />
        </div>
        {post?.sponsor?.length && (
          <section className="flex flex-col mt-10 mb-10">
            <h2 className="mb-4 text-2xl font-bold">Sponsors</h2>
            <hr className="border-accent-2" />
            <div className="my-12 ">
              <SponsorCard sponsors={post.sponsor} />
            </div>
            <hr className="border-accent-2" />
          </section>
        )}
        {post.content?.length && (
          <PortableText
            className="mx-auto prose-violet lg:prose-xl dark:prose-invert"
            value={post.content as PortableTextBlock[]}
          />
        )}
      </article>
      <aside>
        <MoreHeader title="Recent Posts" href="/blog/page/1" />
        <Suspense>
          <MoreContent type={post._type} skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
