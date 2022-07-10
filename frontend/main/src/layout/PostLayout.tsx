import { NextRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';
import { Post, PostType } from '@/models/post.model';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import PostMedia from '@/components/PostMedia';
import RecentPostsList from '@/components/RecentPostsList';
import SponsorCards from '@/components/SponsorCards';

import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';
import { millisecondToUSFormat } from '@/utils/basics/date';
import SocialShare from '@/components/common/SocialShare';
import { useUser } from 'reactfire';
import { AccessMode } from '@/models/access.model';
import PostMediaLocked from '../components/PostMediaLocked';
import { renderBlocks } from '@/components/notion-custom-blocks/RenderBlocks';
import { CourseProgress } from '@/components/firebase/CourseProgress';

const PostAdminButton = dynamic<any>(
  () => import('@/components/PostAdminButton'),
  {
    ssr: false,
  }
);

const MemberValidShow = dynamic<any>(
  () => import('@/components/user/MemberValidShow'),
  {
    ssr: false,
  }
);
const MemberNotValidShow = dynamic<any>(
  () => import('@/components/user/MemberNotValidShow'),
  {
    ssr: false,
  }
);

import dynamic from 'next/dynamic';
import { isActiveLesson } from '@/utils/basics/links';
import ReactPlayer from 'react-player/lazy';

export default function PostLayout({
  post,
  router,
  course,
  recentPosts,
  preview,
  secret,
}: {
  post: Post;
  router: NextRouter;
  course?: Post;
  recentPosts?: { [key: string]: Post[] };
  preview?: boolean;
  secret: string | null;
}): JSX.Element {
  const [href, setHref] = useState('');
  const { data: user } = useUser();

  // Track Video Details and Pass to Progress
  const [videoProgress, setVideoProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  useEffect(() => {
    setHref(location.href);
    setPlaying(false);
    setVideoProgress(0);
    setCurrentLesson(post.id);
    console.log('Reset');
  }, [post]);

  function isLockedLesson() {
    // Only lockdown lessons
    if (post._type != PostType.lesson) {
      return false;
    }
    //If lesson, without assigned course (or course is not yet published)
    if (post._type == PostType.lesson && !course) {
      return true;
    }
    const lessons: Post[] = [];
    course?.sections?.map((s) => s?.lessons?.map((l) => lessons.push(l)));
    const currentLesson = lessons.find((l) => l.slug === post.slug);
    return currentLesson?.access_mode != AccessMode.free;
  }
  const pluralType = pluralize(post);

  function backButton() {
    switch (post._type) {
      case PostType.page:
        return (
          <>
            <Link href="/">
              <a role="link" className="no-underline btn-secondary">
                back to Home
              </a>
            </Link>
          </>
        );
      case PostType.lesson:
        return (
          <>
            {course && (
              <Link href={`/course/${course.slug}`}>
                <a role="link" className="no-underline btn-secondary">
                  back to Course
                </a>
              </Link>
            )}
          </>
        );
      default:
        return (
          <Link href={`/${pluralType}`}>
            <a role="link" className="no-underline btn-secondary">
              {`back to ${toTitleCase(pluralType)}`}
            </a>
          </Link>
        );
    }
  }

  const showPost = () => {
    return (
      <>
        <div className="m-0 leading-relaxed break-words top-2">
          <article>
            <aside className="hidden float-right ml-2 xl:inline-block">
              {recents()}
            </aside>
            {post?.guestBlocks && (
              <section className="flex flex-col guests">
                {renderBlocks(post.guestBlocks)}
              </section>
            )}
            {post?.blocks && (
              <section className="content">{renderBlocks(post.blocks)}</section>
            )}
            {post?.pickBlocks && (
              <section className="flex flex-col picks">
                {post?.pickBlocks && renderBlocks(post.pickBlocks)}
              </section>
            )}
          </article>
        </div>
        <div className="inline-block w-full xl:ml-2 xl:hidden">{recents()}</div>
      </>
    );
  };

  const recents = () => {
    return (
      <>
        {/* LESSONS */}
        {course && course.sections && (
          <section className="flex flex-col w-full mb-2">
            {course.sections.map((section) => (
              <section
                key={section._key}
                className="flex flex-col rounded-t-md"
              >
                <div className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:shrink-0 bg-secondary-600 text-basics-50">
                  {section.title}
                </div>
                <ul className="flex flex-col rounded-b rounded-tr grow bg-basics-50 dark:bg-basics-900 dark:text-primary-50 justify-items-stretch">
                  {section.lessons &&
                    section.lessons.map((lesson) => (
                      <li
                        key={lesson._id}
                        className={`list-none cursor-pointer p-1 rounded m-1 flex flex-col justify-between
                      ${
                        isActiveLesson(router, course, lesson)
                          ? 'bg-primary-900 text-basics-50'
                          : 'bg-transparent hover:bg-primary-900 hover:text-basics-50'
                      }
                      `}
                      >
                        <Link
                          href={`/course/${course.slug}/lesson/${lesson.slug}`}
                          key={lesson._id}
                          passHref
                        >
                          <div className="flex gap-2">
                            <a className="no-underline border-none hover:text-basics-50 dark:hover:text-basics-50">
                              {lesson.title}
                            </a>
                            {lesson?.access_mode && (
                              <div className="no-underline ">
                                {lesson?.access_mode != AccessMode.free && (
                                  <>
                                    {user && user.uid ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="M7 9h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z"
                                          className="currentColor"
                                        />
                                        <path
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="M9 7a3 3 0 0 1 5-2l1 1a1 1 0 0 0 2 0 5 5 0 0 0-1-3 5 5 0 0 0-9 4v2h2V7z"
                                          className="uim-tertiary"
                                        />
                                      </svg>
                                    ) : (
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
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </Link>
                        {user && user.uid && (
                          <div className="flex flex-wrap justify-between px-2 m-1">
                            {currentLesson && (
                              <CourseProgress
                                user={user}
                                courseId={course.id}
                                sectionId={section._key}
                                lessonId={lesson._id}
                                currentLesson={currentLesson}
                                videoProgress={videoProgress}
                                setVideoProgress={setVideoProgress}
                              />
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </section>
        )}
        {/* RECENTS */}
        {recentPosts && (
          <section className="flex flex-col w-full max-w-sm mb-2 xl:ml-2">
            {post?.sponsors && (
              <section className="pb-2">
                <SponsorCards sponsors={post.sponsors} />
              </section>
            )}
            <div className="rounded-md bg-basics-50 dark:bg-primary-900">
              <h2 className="w-full p-2 m-0 text-2xl font-bold 2xl:p-4 rounded-t-md 2xl:shrink-0 bg-secondary-600 text-basics-50">
                {`Latest Courses`}
              </h2>

              <ul className="flex flex-col rounded-b rounded-tr grow bg-basics-50 dark:bg-basics-900 dark:text-primary-50 justify-items-stretch">
                <RecentPostsList
                  router={router}
                  posts={recentPosts[PostType.course]}
                />
              </ul>
            </div>
            <div className="rounded-md bg-basics-50 dark:bg-primary-900">
              <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:shrink-0 bg-secondary-600 text-basics-50">
                {`Latest Tutorials`}
              </h2>
              <ul className="flex flex-col rounded-b rounded-tr grow bg-basics-50 dark:bg-basics-900 dark:text-primary-50 justify-items-stretch">
                <RecentPostsList
                  router={router}
                  posts={recentPosts[PostType.tutorial]}
                />
              </ul>
            </div>
            <div className="rounded-md bg-basics-50 dark:bg-primary-900">
              <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:shrink-0 bg-secondary-600 text-basics-50">
                {`Latest Podcasts`}
              </h2>
              <ul className="flex flex-col rounded-b rounded-tr grow bg-basics-50 dark:bg-basics-900 dark:text-primary-50 justify-items-stretch">
                <RecentPostsList
                  router={router}
                  posts={recentPosts[PostType.podcast]}
                />
              </ul>
            </div>
            <div className="rounded-md bg-basics-50 dark:bg-primary-900">
              <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:shrink-0 bg-secondary-600 text-basics-50">
                {`Latest Blog`}
              </h2>
              <ul className="flex flex-col rounded-b rounded-tr grow bg-basics-50 dark:bg-basics-900 dark:text-primary-50 justify-items-stretch">
                <RecentPostsList
                  router={router}
                  posts={recentPosts[PostType.post]}
                />
              </ul>
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <>
      {/* DIV TO AVOID GRID GAP */}
      <div className="relative">
        {/* MAIN CONTENT */}
        {post._type !== PostType.page && (
          <section className="">
            {/* MEDIA */}
            {!isLockedLesson() ? (
              <PostMedia
                post={post}
                playing={playing}
                setPlaying={setPlaying}
                videoProgress={videoProgress}
                setVideoProgress={setVideoProgress}
              />
            ) : user && user?.uid ? (
              <>
                <MemberValidShow user={user}>
                  <PostMedia
                    post={post}
                    playing={playing}
                    setPlaying={setPlaying}
                    videoProgress={videoProgress}
                    setVideoProgress={setVideoProgress}
                  />
                </MemberValidShow>
                <MemberNotValidShow user={user}>
                  <PostMediaLocked />
                </MemberNotValidShow>
              </>
            ) : (
              <PostMediaLocked />
            )}
          </section>
        )}

        <section className="top-0 z-10 grid">
          {preview && (
            <>
              <div className="flex justify-center py-4 text-3xl text-white dark:text-white bg-error-900 dark:bg-error-900">
                <span>**Preview Mode**</span>
                <button
                  className="btn-primary"
                  onClick={() =>
                    window.open(
                      `/api/endpreview?slug=/${
                        course ? `${course._type}/${course.slug}/` : ``
                      }${post._type}/${post.slug}`,
                      '_self'
                    )
                  }
                >
                  Turn Off
                </button>
              </div>
            </>
          )}
          <BreakBarLeft>
            <div className="grid w-full gap-4">
              <section className="grid items-center justify-between gap-2 lg:flex">
                <h1 className="self-center font-sans text-2xl lg:flex-1 sm:text-4xl text-basics-50">
                  {post.title}
                </h1>
                {user && user.uid && (
                  <PostAdminButton user={user} post={post} secret={secret} />
                )}
                <div className="shrink-0">{backButton()}</div>
              </section>
              <section className="grid items-end justify-between gap-4 lg:flex">
                {post.authors ? (
                  <>
                    {post.authors?.map((author, i) => (
                      <header
                        className="flex flex-wrap gap-2 2xl:flex-nowrap text-basics-50"
                        key={i}
                      >
                        <section className="flex items-center space-x-4 shrink-0">
                          {author?.photoURL && author.photoURL?.public_id && (
                            <Image
                              src={author.photoURL.public_id}
                              layout="fixed"
                              height="50"
                              width="50"
                              alt="instructor"
                              className="w-12 border-2 rounded-full border-primary-50 dark:border-primary-50"
                            />
                          )}

                          <div className="grid content-start">
                            <h3 className="m-0 text-base font-light">Author</h3>
                            <h4 className="m-0 font-sans text-xl">
                              {author.displayName}
                            </h4>
                          </div>
                        </section>
                        {post._createdAt && (
                          <section className="flex flex-wrap items-end justify-between w-full gap-4">
                            <section className="flex content-start space-x-4">
                              <p className="flex items-center m-0 space-x-2 text-base font-light">
                                <svg
                                  className="w-6"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>
                                  {millisecondToUSFormat(post._createdAt)}
                                </span>
                              </p>
                              {post._updatedAt && (
                                <p className="flex items-center m-0 space-x-2 text-base font-light">
                                  Last Updated:{' '}
                                  <span>
                                    {millisecondToUSFormat(post._updatedAt)}
                                  </span>
                                </p>
                              )}
                            </section>
                          </section>
                        )}
                      </header>
                    ))}
                  </>
                ) : (
                  <div></div>
                )}

                <div className="flex flex-wrap gap-4 md:flex-nowrap">
                  <SocialShare href={href} post={post} />
                </div>
              </section>
            </div>
          </BreakBarLeft>
        </section>

        {/* BLOG POST */}
        {!isLockedLesson() ? (
          <div className="flex flex-wrap gap-4 px-4 pb-4 mt-2 xl:flex-nowrap lg:px-10 lg:pb-10">
            <section className="flex flex-col w-full gap-4">
              <>{showPost()}</>
            </section>
          </div>
        ) : user && user?.uid ? (
          <>
            <MemberValidShow user={user}>
              <div className="flex flex-wrap gap-4 px-4 pb-4 mt-2 xl:flex-nowrap lg:px-10 lg:pb-10">
                <section className="flex flex-col w-full gap-4">
                  <>{showPost()}</>
                </section>
              </div>
            </MemberValidShow>
            <div className="inline-block w-full xl:hidden">{recents()}</div>
          </>
        ) : (
          <div className="inline-block w-full">{recents()}</div>
        )}
      </div>
      <style global jsx>{`
        article > * {
          list-style: auto;
        }

        article > p + blockquote {
          margin: 1rem 0;
        }

        article blockquote {
          display: grid;
        }

        article a {
          word-wrap: break-word;
          border-bottom: 2px solid #bc2261;
        }

        article > iframe {
          max-width: 100%;
        }
        .content ol {
          list-style: none;
          counter-reset: item;
        }
        .content li {
          counter-increment: item;
          margin-bottom: 5px;
        }
        .content li:before {
          margin-right: 10px;
          content: counter(item);
          background: #5e1286;
          border-radius: 100%;
          color: white;
          width: 26px;
          height: 26px;
          text-align: center;
          display: inline-block;
        }
        .content > * {
          margin-bottom: 1rem;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 2rem 0 1rem;
          font-family: 'Nunito', sans-serif;
          width: fit-content;
        }

        article h3 {
          font-size: 2rem;
        }
        article h4 {
          font-size: 1.8rem;
        }
        article h5 {
          font-size: 1.6rem;
        }
        article h6 {
          font-size: 1.2rem;
        }

        article > img {
          max-width: 100%;
        }

        article > ul,
        article > ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }

        iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </>
  );
}
