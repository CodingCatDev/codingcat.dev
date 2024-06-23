"use client";
import type {
  LessonQueryResult,
  LessonsInCourseQueryResult,
} from "@/sanity.types";
import { useEffect, useState } from "react";
import LessonPanel from "./lesson-panel";

export default function LessonPanelClientOnly({
  lesson,
  course,
}: {
  lesson: NonNullable<LessonQueryResult>;
  course: NonNullable<LessonsInCourseQueryResult>;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  //TODO: Make this match better?
  if (!isClient) return <div className="mx-auto">Loading Lesson...</div>;

  return (
    <>
      <LessonPanel lesson={lesson} course={course} />
    </>
  );
}
