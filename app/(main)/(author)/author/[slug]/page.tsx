import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type {
  AuthorQueryResult,
  AuthorQueryWithRelatedResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { authorQuery, authorQueryWithRelated } from "@/sanity/lib/queries";
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
  const author = await sanityFetch<AuthorQueryResult>({
    query: authorQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(author?.coverImage);

  return {
    title: author?.title,
    description: author?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function AuthorPage({ params }: Props) {
  const [author] = await Promise.all([
    sanityFetch<AuthorQueryWithRelatedResult>({
      query: authorQueryWithRelated,
      params,
    }),
  ]);

  if (!author?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[
          { title: "Authors", href: "/authors/page/1" },
          { title: author.title },
        ]}
      />
      <div className="w-full flex flex-col gap-4 md:gap-8">
        <div className="flex gap-2 md:gap-8">
          <div>
            <CoverMedia
              cloudinaryImage={author?.coverImage}
              cloudinaryVideo={author?.videoCloudinary}
              youtube={author?.youtube}
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
