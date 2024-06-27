"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Link from "next/link";

import type {
  LessonQueryResult,
  LessonsInCourseQueryResult,
} from "@/sanity.types";
import BadgePro from "@/components/badge-pro";
import NavLesson from "./nav-lesson";
import CoverMedia from "@/components/cover-media";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  FaCircleArrowLeft,
  FaCircleArrowRight,
  FaHouse,
} from "react-icons/fa6";
import LessonComplete from "./lesson-complete";
import { useLocalStorage } from "@uidotdev/usehooks";
import Bookmark from "@/components/bookmark";

export default function LessonPanel({
  lesson,
  course,
}: {
  lesson: NonNullable<LessonQueryResult>;
  course: NonNullable<LessonsInCourseQueryResult>;
}) {
  const [defaultLayout, saveDefaultLayout] = useLocalStorage(
    "react-resizable-panels:layout",
    [25, 75]
  );

  const onLayout = (sizes: number[]) => {
    saveDefaultLayout(sizes);
  };

  const getLessons = () => {
    const lessons: NonNullable<
      NonNullable<LessonsInCourseQueryResult>["sections"]
    >[0]["lesson"] = [];
    course?.sections?.map((section) =>
      section.lesson?.map((lesson) => lessons.push(lesson))
    );
    return lessons;
  };

  const lessonIndex = getLessons().findIndex((l) => l.slug === lesson.slug);
  const lessonNoContent = getLessons()[lessonIndex];

  const main = () => {
    return (
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b  px-6 dark:bg-gray-800/40">
          <div className="flex-1 w-full">
            <h1>{lesson?.title}</h1>
          </div>
          <BadgePro locked={lesson?.locked} />
        </header>
        <main className="flex-1 overflow-auto">
          <CoverMedia
            cloudinaryImage={lesson?.coverImage}
            cloudinaryVideo={lesson?.videoCloudinary}
            youtube={lesson?.youtube}
          />
        </main>
        <footer className="grid grid-cols-3 h-14 lg:h-[60px] gap-1 sm:gap-4 border-b px-6 dark:bg-gray-800/40">
          <div className="flex-0 flex justify-start items-center gap-1">
            <Bookmark content={lessonNoContent} />
            <p className="text-sm sm:text-xl">Bookmark</p>
          </div>
          <div className="flex justify-center items-center">
            {lessonIndex > 0 && (
              <Button variant="ghost" asChild>
                <Link href={getLessons()[lessonIndex - 1].slug || ""}>
                  <FaCircleArrowLeft />
                </Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link href={`/course/${course.slug}`}>
                <FaHouse />
              </Link>
            </Button>
            {lessonIndex < getLessons().length - 1 && (
              <Button variant="ghost" asChild>
                <Link href={getLessons()[lessonIndex + 1].slug || ""}>
                  <FaCircleArrowRight />
                </Link>
              </Button>
            )}
          </div>
          <div className="flex-0 flex justify-end items-center gap-1">
            <LessonComplete lesson={lessonNoContent} course={course} />
            <p className="text-sm sm:text-xl">Complete</p>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <>
      <div className="hidden lg:grid w-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="hidden border lg:flex lg:flex-col lg:gap-2"
          onLayout={onLayout}
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            minSize={20}
            collapsible
          >
            {course?.sections && (
              <>
                <div className="flex h-[60px] items-center border-b px-6">
                  <Link
                    href={"/course/" + course.slug}
                    className="flex items-center gap-2 font-semibold"
                    prefetch={false}
                  >
                    <span className="flex flex-wrap">{course.title}</span>
                  </Link>
                </div>

                <div className="flex-1 py-2 overflow-auto">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <NavLesson course={course} />
                  </nav>
                </div>
              </>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]}>
            {main()}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <section className="grid gap-2 lg:hidden">
        {main()}
        <ScrollArea className="rounded-md border h-[calc(100vh/4)]">
          {course?.sections && (
            <>
              <div className="flex-1 py-2 overflow-auto">
                <nav className="grid items-start px-4 text-sm font-medium">
                  <NavLesson course={course} />
                </nav>
              </div>
            </>
          )}
        </ScrollArea>
      </section>
    </>
  );
}
