import Link from "next/link";
import { Suspense } from "react";

import Avatar from "@/components/avatar";
import CoverImage from "@/components/cover-image";
import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import Onboarding from "@/components/onboarding";

import type { CoursesQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { coursesQuery } from "@/sanity/lib/queries";
import MoreHeader from "@/components/more-header";

function HeroCourse({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<CoursesQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article>
      <Link className="block mb-8 group md:mb-16" href={`/course/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="mb-4 text-4xl leading-tight text-pretty lg:text-6xl">
            <Link href={`/course/${slug}`} className="hover:underline">
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
    sanityFetch<CoursesQueryResult>({ query: coursesQuery }),
  ]);
  return (
    <div className="container px-5 mx-auto">
      {heroPost ? (
        <HeroCourse
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
        <aside>
          <MoreHeader title="Latest Courses" href="/courses/page/1" />
          <Suspense fallback={<p>Loading feed...</p>}>
            <MoreContent type={heroPost._type} skip={heroPost._id} limit={4} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}
