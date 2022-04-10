import { AccessMode } from '@/models/access.model';
import {
  CodingCatBuilderContent,
  Section,
  SectionLesson,
} from '@/models/builder.model';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from 'reactfire';

export default function CourseSections({
  courseData,
}: {
  courseData: CodingCatBuilderContent;
}) {
  const [href, setHref] = useState('');
  const { data: user } = useUser();
  const router = useRouter();

  const course = courseData?.data;

  useEffect(() => {
    setHref(location.href);
  }, []);

  function isActiveLink(lesson: SectionLesson) {
    if (router.asPath === `${course.url}${lesson.url}`) return true;
    return false;
  }
  return (
    <>
      {course && course.sections && (
        <section className="grid content-start grid-cols-1 row-start-2 gap-4 2xl:col-start-2 2xl:row-start-1">
          {course.sections.map((section, i) => (
            <section
              key={`section-${i}`}
              className="flex flex-col rounded-t-md"
            >
              <div className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                {section.title}
              </div>
              <ul className="flex flex-col flex-grow rounded-b rounded-tr bg-basics-50 justify-items-stretch">
                {section.lessons &&
                  section.lessons.map((lesson, i) => (
                    <li key={`lesson-${i}`} className="ml-0 list-none">
                      <Link href={`${course.url}${lesson.url}`} passHref>
                        <div
                          className={`p-2 cursor-pointer hover:bg-primary-200 rounded m-1 flex flex-wrap justify-between
                              ${
                                isActiveLink(lesson)
                                  ? 'bg-primary-200'
                                  : 'bg-transparent'
                              }
                              `}
                        >
                          <a className="no-underline text-basics-900 hover:text-primary-900">
                            {lesson.title}
                          </a>
                          {/* {lesson?.accessSettings?.accessMode && (
                            <div className="no-underline text-basics-900 hover:text-primary-900">
                              {lesson?.accessSettings?.accessMode !=
                                AccessMode.free && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          )} */}
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </section>
      )}
    </>
  );
}
