import Link from "next/link";
import { Suspense } from "react";

import Avatar from "@/components/avatar";
import CoverImage from "@/components/cover-image";
import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import Onboarding from "@/components/onboarding";

import type { PodcastsQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { podcastsQuery } from "@/sanity/lib/queries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MoreHeader from "@/components/more-header";

function HeroPodcast({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
  guest,
}: Pick<
  Exclude<PodcastsQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug" | "guest"
>) {
  return (
    <article>
      <Link className="block mb-8 group md:mb-16" href={`/podcast/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="mb-4 text-4xl leading-tight text-pretty lg:text-6xl">
            <Link href={`/podcast/${slug}`} className="hover:underline">
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
          {(author || guest) && (
            <div className="flex flex-wrap gap-2">
              {author?.map((a) => (
                <Avatar
                  key={a._id}
                  name={a.title}
                  href={`/author/${a?.slug}`}
                  coverImage={a?.coverImage}
                />
              ))}
              {guest?.map((a) => (
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
      </div>
    </article>
  );
}

export default async function Page() {
  const [heroPost] = await Promise.all([
    sanityFetch<PodcastsQueryResult>({ query: podcastsQuery }),
  ]);
  return (
    <div className="container px-5 mx-auto">
      {heroPost ? (
        <HeroPodcast
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
          guest={heroPost.guest}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside>
          <MoreHeader title="Latest Podcasts" href="/podcasts/page/1" />
          <Suspense fallback={<p>Loading feed...</p>}>
            <MoreContent type={heroPost._type} skip={heroPost._id} limit={4} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}
