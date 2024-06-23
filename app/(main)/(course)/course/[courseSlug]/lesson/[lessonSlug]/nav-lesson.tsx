"use client";

import type { LessonsInCourseQueryResult } from "@/sanity.types";
import Link from "next/link";

import { useActivePath } from "@/lib/hooks";
import { Separator } from "@/components/ui/separator";
import BadgePro from "@/components/badge-pro";
import LessonComplete from "./lesson-complete";

interface Props {
  course: LessonsInCourseQueryResult | undefined;
}
export default function NavLesson({ course }: Props) {
  const checkActivePath = useActivePath();
  return (
    <>
      {course?.sections?.map((section, i) => (
        <div key={i}>
          {section?.title && (
            <div className="flex flex-col gap-4 py-4" key={i}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                {section.title}
              </h3>
              <Separator />
            </div>
          )}
          {section.lesson?.map((l) => (
            <div
              className="flex gap-2 justify-center align-middle items-center"
              key={l._id}
            >
              <LessonComplete lesson={l} course={course} />

              <Link
                href={`/course/${course.slug}/lesson/${l.slug}`}
                className={`flex-1 ${
                  checkActivePath(`/course/${course.slug}/lesson/${l.slug}`)
                    ? "flex items-center gap-3 px-3 py-2 text-gray-900 transition-all bg-gray-100 rounded-lg hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                    : "flex items-center gap-3 px-3 py-2 text-gray-500 transition-all rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                }
                      `}
                prefetch={false}
              >
                <span>{l.title}</span>
              </Link>
              <div>
                <BadgePro locked={l.locked} hideLabel={true} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
