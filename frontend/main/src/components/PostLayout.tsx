import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { NextRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { useEffect } from 'react';
import { Post, PostType, SectionLesson } from '@/models/post.model';
import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import hydrate, { Source } from 'next-mdx-remote/hydrate';
import PostMedia from '@/components/PostMedia';
import RecentPostsList from '@/components/RecentPostsList';

import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';
import { Site } from '@/models/site.model';

export default function PostLayout({
  site,
  post,
  router,
  course,
  source,
  recentPosts,
}: {
  site: Site | null;
  post: Post;
  router: NextRouter;
  source: Source | null;
  course?: Post;
  recentPosts?: { [key: string]: Post[] };
}): JSX.Element {
  if (!post) {
    return (
      <Layout site={site}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </Layout>
    );
  }

  function isActiveLink(course: Post, lesson: SectionLesson) {
    if (router.asPath === `/courses/${course.slug}/lessons/${lesson.slug}`)
      return true;
    return false;
  }
  const pluralType = pluralize(post);

  function backButton() {
    switch (post.type) {
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

  const content = source ? hydrate(source) : null;
  return (
    <Layout site={site}>
      {/* DIV TO AVOID GRID GAP */}
      <div>
        {/* TOP BAR */}
        <section className="sticky top-0 z-10 bg-primary-50">
          <BreakBarLeft>
            <div className="flex flex-wrap items-center justify-between w-full gap-4">
              <h1 className="self-center font-sans text-2xl sm:text-6xl text-basics-50 dark:text-basics-50">
                {post.title}
              </h1>
              {backButton()}
            </div>
          </BreakBarLeft>
        </section>

        {/* MAIN CONTENT */}
        {post.type !== PostType.page && (
          <section className="w-full">
            <div className="flex flex-col px-4 py-10 xl:px-10 xl:flex-row xl:mx-auto">
              {/* MEDIA */}
              <section className="flex-1 xl:w-3/4 xl:flex-auto">
                <PostMedia post={post} />
              </section>
              <section className="relative xl:w-1/4">
                <div className="flex flex-col gap-4 p-2 overflow-y-auto xl:p-4 xl:absolute xl:w-full xl:h-full scrollbar bg-primary-900 dark:bg-primary-900">
                  {/* Pricing */}
                  {post.type === PostType.course && (
                    <section className="p-2 xl:p-4 bg-basics-50">
                      {post.coverPhoto?.path ? (
                        <>
                          <Image
                            src={post.coverPhoto?.path}
                            alt={post.title}
                            width="1920"
                            height="1080"
                            layout="responsive"
                            className=""
                          />
                        </>
                      ) : (
                        <div>Image Placeholder</div>
                      )}
                      <Link href="/">
                        <a className="grid px-4 pt-4 no-underline place-items-center">
                          <button className="btn-primary">Start Course</button>
                        </a>
                      </Link>
                    </section>
                  )}
                  {/* LESSONS */}
                  {course &&
                    course.sections &&
                    course.sections.map((section) => (
                      <section
                        key={section.id}
                        className="flex flex-col bg-basics-50 rounded-t-md"
                      >
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {section.title}
                        </h2>
                        <ul className="flex flex-col flex-grow justify-items-stretch">
                          {section.lessons &&
                            section.lessons.map((lesson) => (
                              <li key={lesson.id} className="ml-0 list-none">
                                <Link
                                  href={`/course/${course.slug}/lesson/${lesson.slug}`}
                                  key={lesson.id}
                                >
                                  <div
                                    className={`p-2  cursor-pointer
                              ${
                                isActiveLink(course, lesson)
                                  ? 'bg-primary-200'
                                  : 'bg-transparent'
                              }
                              `}
                                  >
                                    <a className="no-underline text-basics-900 hover:text-primary-900 hover:underline">
                                      {lesson.title}
                                    </a>
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </section>
                    ))}
                  {/* RECENTS */}
                  {recentPosts && (
                    <section className="hidden xl:grid-cols-1 xl:gap-4 xl:grid">
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Courses`}
                        </h2>

                        <ul className="mx-4 space-y-2">
                          <RecentPostsList
                            posts={recentPosts[PostType.course]}
                          />
                        </ul>
                      </div>
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Tutorials`}
                        </h2>
                        <ul className="mx-4 space-y-2">
                          <RecentPostsList
                            posts={recentPosts[PostType.tutorial]}
                          />
                        </ul>
                      </div>
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Podcasts`}
                        </h2>
                        <ul className="mx-4 space-y-2">
                          <RecentPostsList
                            posts={recentPosts[PostType.podcast]}
                          />
                        </ul>
                      </div>
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Blog`}
                        </h2>
                        <ul className="mx-4 space-y-2">
                          <RecentPostsList posts={recentPosts[PostType.post]} />
                        </ul>
                      </div>
                    </section>
                  )}
                  {/* Author Content */}
                  <section className="bg-basics-50">
                    <div className="p-2 xl:p-4 bg-secondary-600 rounded-t-md dark:bg-secondary-600">
                      <header className="flex gap-4 ">
                        <img
                          src="https://avatars0.githubusercontent.com/u/45889730?s=460&u=74587a01abf2a7f33ae964c69856f3fe71b175b6&v=4"
                          alt="instructor"
                          className="w-20 h-20 border-2 rounded-full border-primary-900"
                        />

                        <div className="flex flex-col justify-center">
                          <h3 className="m-0 text-base font-light">
                            Instructor
                          </h3>
                          <h4 className="m-0 text-xl">Instructor Name</h4>
                        </div>
                      </header>
                    </div>
                    <p className="p-2 xl:p-4">
                      Instructor description: Lorem ipsum dolor sit amet
                      consectetur adipisicing elit. Sint ad iusto nobis
                      excepturi deserunt exercitationem ex aspernatur sit culpa
                      fugit porro, facere eaque. Harum consequuntur corrupti
                      odio blanditiis, culpa officia!
                    </p>
                  </section>
                </div>
              </section>
            </div>
          </section>
        )}
        {/* Main Blog Area */}
        <section className="w-full max-w-5xl px-4 pt-4 mx-auto xl:px-10">
          {/* BLOG POST */}
          {/* <h2 className="m-0 vertical-text-clip">{post.title}</h2> */}
          <article className="relative grid grid-cols-1 gap-4 leading-relaxed top-2 text-basics-900">
            {content}
          </article>
        </section>
      </div>
      <style global jsx>{`
        main a {
          text-decoration: underline;
        }

        main h1,
        main h2 {
          font-family: 'Nunito', sans-serif;
          margin: 0;
        }

        main h2 {
          font-size: 3rem;
        }

        main h3 {
          font-size: 2.25rem;
        }

        main h3,
        main h4,
        main h5,
        main h6 {
          font-family: 'Nunito', sans-serif;
          margin: 1rem 0;
        }
        main article p:first-child a img {
          width: 100%;
        }
        main p {
          margin: 1rem 0;
        }
        main ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }
      `}</style>
    </Layout>
  );
}
