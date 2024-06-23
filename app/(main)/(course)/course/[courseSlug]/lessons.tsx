import Link from "next/link";

import CoverImage from "@/components/cover-image";
import type { LessonsInCourseQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { lessonsInCourseQuery } from "@/sanity/lib/queries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import Buy from "@/components/user-buy";
import UserGoProButton from "@/components/user-go-pro-button";

export default async function Lessons(params: { courseSlug: string }) {
  const course = await sanityFetch<LessonsInCourseQueryResult>({
    query: lessonsInCourseQuery,
    params,
  });
  return (
    <>
      {course?.sections && (
        <div className="flex flex-col">
          <hr className="mb-24 border-accent-2 mt-28" />
          <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
            Lessons
          </h2>
          {course?.sections?.map((section, i) => (
            <div key={i} className="flex flex-col">
              <div className="text-xl">
                <h3 className="mb-3 text-3xl leading-snug">{section?.title}</h3>
              </div>
              <section className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:p-6 auto-rows-fr">
                {section?.lesson?.map((post) => {
                  const {
                    _id,
                    _type,
                    title,
                    slug,
                    coverImage,
                    excerpt,
                    locked,
                  } = post;
                  return (
                    <Card
                      key={_id}
                      className="overflow-hidden shadow-md transition-all hover:scale-[1.02] hover:shadow-lg relative flex flex-col"
                    >
                      <CardHeader className="p-0">
                        <Link
                          href={`/course/${params.courseSlug}/${_type}/${slug}`}
                          className="block mb-5 group"
                        >
                          <CoverImage image={coverImage} priority={false} />
                        </Link>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <h3 className="mb-3 text-3xl leading-snug text-balance">
                          <Link
                            href={`/course/${params.courseSlug}/${_type}/${slug}`}
                            className="hover:underline"
                          >
                            {title}
                          </Link>
                        </h3>

                        {excerpt && (
                          <p className="mb-4 text-lg leading-relaxed text-pretty">
                            {excerpt}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-col items-start gap-2">
                        {locked && course?.stripeProduct && course?.title && (
                          <section className="flex flex-wrap gap-2">
                            <Buy
                              stripeProduct={course?.stripeProduct}
                              title={course.title}
                            />
                            <UserGoProButton />
                          </section>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </section>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
