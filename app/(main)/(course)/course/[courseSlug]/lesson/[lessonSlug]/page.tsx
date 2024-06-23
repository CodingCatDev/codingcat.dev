export const dynamic = "force-dynamic";

import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import type {
  LessonQueryResult,
  LessonsInCourseQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { lessonQuery, lessonsInCourseQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import LessonPanelClientOnly from "./lesson-client-only";
import MoreContent from "@/components/more-content";
import MoreHeader from "@/components/more-header";
import PortableText from "@/components/portable-text";
import { type PortableTextBlock } from "next-sanity";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { Idt } from "@/lib/firebase.types";
import { didUserPurchase } from "@/lib/server/firebase";

type Props = {
  params: { lessonSlug: string; courseSlug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await sanityFetch<LessonQueryResult>({
    query: lessonQuery,
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
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function LessonPage({ params }: Props) {
  const [lesson, course] = await Promise.all([
    sanityFetch<LessonQueryResult>({
      query: lessonQuery,
      params,
    }),
    sanityFetch<LessonsInCourseQueryResult>({
      query: lessonsInCourseQuery,
      params,
    }),
  ]);

  if (!lesson && !course) {
    return notFound();
  }

  // Check if user is either a pro or paid for lesson
  if (course?.stripeProduct && lesson?.locked) {
    //First check if user session is valid
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("app.at");
    if (!sessionCookie) return redirect(`/course/${course?.slug}?showPro=true`);
    const jwtPayload = jwtDecode(sessionCookie?.value) as Idt;
    if (!jwtPayload?.exp)
      return redirect(`/course/${course?.slug}?showPro=true`);
    const expiration = jwtPayload.exp;
    const isExpired = expiration * 1000 < Date.now();
    if (isExpired) return redirect(`/course/${course?.slug}?showPro=true`);

    //Check if user isn't pro
    if (!jwtPayload?.stripeRole) {
      const purchased = await didUserPurchase(
        course.stripeProduct,
        jwtPayload.user_id
      );
      if (!purchased) return redirect(`/course/${course?.slug}?showPro=true`);
    }
  }

  return (
    <>
      {lesson?._id && course?._id && (
        <div className="container px-5 mx-auto grid gap-2">
          <Suspense fallback={<>Loading Lesson Panel...</>}>
            <LessonPanelClientOnly lesson={lesson} course={course} />
          </Suspense>
          {lesson?.content?.length && (
            <PortableText
              className="mx-auto prose-violet lg:prose-xl dark:prose-invert"
              value={lesson.content as PortableTextBlock[]}
            />
          )}
          <aside>
            <MoreHeader title="Recent Courses" href="/course/page/1" />
            <Suspense>
              <MoreContent type="course" skip={lesson._id} limit={2} />
            </Suspense>
          </aside>
        </div>
      )}
    </>
  );
}
