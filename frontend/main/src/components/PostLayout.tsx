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

                        <ul className="grid grid-cols-1 gap-2 px-4 py-2">
                          <RecentPostsList
                            posts={recentPosts[PostType.course]}
                          />
                        </ul>
                      </div>
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Tutorials`}
                        </h2>
                        <ul className="grid grid-cols-1 gap-2 px-4 py-2">
                          <RecentPostsList
                            posts={recentPosts[PostType.tutorial]}
                          />
                        </ul>
                      </div>
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Podcasts`}
                        </h2>
                        <ul className="grid grid-cols-1 gap-2 px-4 py-2">
                          <RecentPostsList
                            posts={recentPosts[PostType.podcast]}
                          />
                        </ul>
                      </div>
                      <div className="rounded-t-md bg-basics-50">
                        <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          {`Latest Blog`}
                        </h2>
                        <ul className="grid grid-cols-1 gap-2 px-4 py-2">
                          <RecentPostsList posts={recentPosts[PostType.post]} />
                        </ul>
                      </div>
                    </section>
                  )}
                  {/* Author Content */}
                  {post.authors?.map((author, i) => (
                    <section className="bg-basics-50 rounded-t-md" key={i}>
                      <div className="p-2 xl:p-4 bg-secondary-600 rounded-t-md dark:bg-secondary-600">
                        <header className="flex gap-4 ">
                          {author.photoURL && (
                            <img
                              src={author.photoURL}
                              alt="instructor"
                              className="w-20 h-20 border-2 rounded-full border-primary-900"
                            />
                          )}

                          <div className="flex flex-col justify-center">
                            <h3 className="m-0 text-base font-light">
                              Instructor
                            </h3>
                            <h4 className="m-0 text-xl">
                              {author.displayName}
                            </h4>
                          </div>
                        </header>
                      </div>
                      <p className="p-2 xl:p-4">{author.basicInfo?.about}</p>
                    </section>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}
        {/* Main Blog Area */}
        <section className="w-full max-w-5xl p-4 mx-auto xl:px-10 bg-basics-50">
          {/* BLOG POST */}
          <article className="relative grid grid-cols-1 gap-4 leading-relaxed top-2 text-basics-900">
            {content}
          </article>
        </section>
      </div>
      <style global jsx>{`
        article {
          font-size: clamp(1rem, 1rem + 1vw, 1.5rem);
          margin: 0 auto;
          max-width: 65ch;
        }
        blockquote {
          padding: 1rem 2rem;
          border-left: 5px solid #4b0a75;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        main a {
          border-bottom: 2px solid #bc2261;
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
          margin: 4rem 0 2rem;
          width: fit-content;
        }
        img {
          width: 100%;
        }
        main p {
          margin: 0 0 3rem;
        }
        main ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }

        /*
 * Synthwave '84 Theme originally by Robb Owen [@Robb0wen] for Visual Studio Code
 * Demo: https://marc.dev/demo/prism-synthwave84
 *
 * Ported for PrismJS by Marc Backes [@themarcba]
 */
        code,
        pre {
          color: #f92aad;
          text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3;
          background: none;
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          font-size: 1em;
          text-align: left;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          word-wrap: normal;
          line-height: 1.5;
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);

          -moz-tab-size: 4;
          -o-tab-size: 4;
          tab-size: 4;

          -webkit-hyphens: none;
          -moz-hyphens: none;
          -ms-hyphens: none;
          hyphens: none;
        }

        /* Code blocks */
        pre {
          padding: 1em;
          margin: 0.5em 0;
          overflow: auto;
        }

        :not(pre) > code,
        pre {
          background-color: transparent !important;
          background-image: linear-gradient(to bottom, #2a2139 75%, #34294f);
        }

        /* Inline code */
        :not(pre) > code {
          padding: 0.1em;
          border-radius: 0.3em;
          white-space: normal;
        }

        .token.comment,
        .token.block-comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #8e8e8e;
        }

        .token.punctuation {
          color: #ccc;
        }

        .token.tag,
        .token.attr-name,
        .token.namespace,
        .token.number,
        .token.unit,
        .token.hexcode,
        .token.deleted {
          color: #e2777a;
        }

        .token.property,
        .token.selector {
          color: #72f1b8;
          text-shadow: 0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475;
        }

        .token.function-name {
          color: #6196cc;
        }

        .token.boolean,
        .token.selector .token.id,
        .token.function {
          color: #fdfdfd;
          text-shadow: 0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975,
            0 0 8px #03edf975;
        }

        .token.class-name {
          color: #fff5f6;
          text-shadow: 0 0 2px #000, 0 0 10px #fc1f2c75, 0 0 5px #fc1f2c75,
            0 0 25px #fc1f2c75;
        }

        .token.constant,
        .token.symbol {
          color: #f92aad;
          text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3;
        }

        .token.important,
        .token.atrule,
        .token.keyword,
        .token.selector .token.class,
        .token.builtin {
          color: #f4eee4;
          text-shadow: 0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575;
        }

        .token.string,
        .token.char,
        .token.attr-value,
        .token.regex,
        .token.variable {
          color: #f87c32;
        }

        .token.operator,
        .token.entity,
        .token.url {
          color: #67cdcc;
        }

        .token.important,
        .token.bold {
          font-weight: bold;
        }

        .token.italic {
          font-style: italic;
        }

        .token.entity {
          cursor: help;
        }

        .token.inserted {
          color: green;
        }
      `}</style>
    </Layout>
  );
}
