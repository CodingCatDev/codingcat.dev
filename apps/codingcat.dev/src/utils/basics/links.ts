import { Post, SectionLesson } from '@/models/post.model';
import { NextRouter } from 'next/router';

export const isActiveLesson = (
  router: NextRouter,
  course: Post,
  lesson: SectionLesson
) => {
  if (router.asPath === `/course/${course.slug}/lesson/${lesson.slug}`)
    return true;
  return false;
};

export const isActiveLink = (router: NextRouter, path: string) => {
  if (router?.asPath === path) return true;
  return false;
};
