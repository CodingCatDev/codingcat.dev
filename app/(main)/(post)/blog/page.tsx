import Link from "next/link";
import { Suspense } from "react";

import Avatar from "@/components/avatar";
import CoverImage from "@/components/cover-image";
import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import Onboarding from "@/components/onboarding";

import type { BlogQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { blogQuery } from "@/sanity/lib/queries";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<BlogQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article>
      <Link className="block mb-8 group md:mb-16" href={`/post/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="mb-4 text-4xl leading-tight text-pretty lg:text-6xl">
            <Link href={`/post/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={date} />
          </div>
        </div>
        <div>
          {excerpt && (
            <p className="mb-4 text-lg leading-relaxed text-pretty">
              {excerpt}
            </p>
          )}
          {author && (
            <div className="flex">
              {author.map((a) => (
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
      </div>
    </article>
  );
}

export default async function Page() {
  const [heroPost] = await Promise.all([
    sanityFetch<BlogQueryResult>({ query: blogQuery }),
  ]);
  return (
    <div className="container px-5 mx-auto">
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <Onboarding />
      )}

      {heroPost?._id && (
        <>
          <div className="mb-16">
            <Separator />
          </div>
          <aside>
            <div className="flex flex-col md:flex-row md:justify-between">
              <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
                Latest Posts
              </h2>
              <Button
                asChild
                className="mb-8 text-3xl font-bold md:text-4xl p-2 md:p-8"
              >
                <Link href="/blog/page/1">Read More</Link>
              </Button>
            </div>
            <Suspense fallback={<p>Loading feed...</p>}>
              <MoreContent
                type={heroPost._type}
                skip={heroPost._id}
                limit={4}
              />
            </Suspense>
          </aside>
        </>
      )}
    </div>
  );
}
