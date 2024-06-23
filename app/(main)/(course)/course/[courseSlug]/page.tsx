import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "@/components/avatar";
import CoverMedia from "@/components/cover-media";
import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import PortableText from "@/components/portable-text";

import type { CourseQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { courseQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Lessons from "./lessons";
import MoreHeader from "@/components/more-header";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import Buy from "@/components/user-buy";
import Link from "next/link";
import ShowPro from "./show-pro";
import UserGoProButton from "@/components/user-go-pro-button";

type Props = {
  params: { courseSlug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const course = await sanityFetch<CourseQueryResult>({
    query: courseQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(course?.coverImage);

  return {
    authors:
      course?.author?.map((a) => {
        return { name: a.title };
      }) || [],
    title: course?.title,
    description: course?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function CoursePage({ params }: Props) {
  const [course] = await Promise.all([
    sanityFetch<CourseQueryResult>({
      query: courseQuery,
      params,
    }),
  ]);

  if (!course?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <ShowPro />
      <BreadcrumbLinks
        links={[
          { title: "Courses", href: "/courses/page/1" },
          { title: course.title },
        ]}
      />
      <article>
        <h1 className="mb-12 text-4xl font-bold leading-tight tracking-tighter text-balance md:text-7xl md:leading-none lg:text-8xl">
          {course.title}
        </h1>
        <div className="hidden md:mb-12 md:block">
          <div className="flex flex-col gap-8">
            {course?.author && (
              <div className="flex">
                {course.author.map((a) => (
                  <Avatar
                    key={a._id}
                    href={`/author/${a?.slug}`}
                    name={a.title}
                    coverImage={a?.coverImage}
                  />
                ))}
              </div>
            )}
            <div className="text-lg">
              <DateComponent dateString={course.date} />
            </div>
          </div>
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16 flex flex-col gap-2 md:gap-8">
          <CoverMedia
            cloudinaryImage={course.coverImage}
            cloudinaryVideo={course.videoCloudinary}
            youtube={course.youtube}
          />
          {course?.stripeProduct && course?.title && (
            <section className="flex gap-2">
              <Buy stripeProduct={course.stripeProduct} title={course.title} />
              <UserGoProButton />
            </section>
          )}
        </div>
        <div className="block md:hidden">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              {course.author && (
                <div className="flex">
                  {course.author.map((a) => (
                    <Avatar
                      key={a._id}
                      href={`/author/${a?.slug}`}
                      name={a.title}
                      coverImage={a?.coverImage}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4 text-lg">
              <DateComponent dateString={course.date} />
            </div>
          </div>
        </div>
        {course.content?.length && (
          <PortableText
            className="mx-auto prose-violet lg:prose-xl dark:prose-invert"
            value={course.content as PortableTextBlock[]}
          />
        )}
      </article>
      <Suspense>
        <Lessons courseSlug={params.courseSlug} />
      </Suspense>
      <aside>
        <MoreHeader title="Recent Courses" href="/courses/page/1" />
        <Suspense>
          <MoreContent type={course._type} skip={course._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
