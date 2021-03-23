import DefaultErrorPage from 'next/error';
import { NextRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { Post, PostType, SectionLesson } from '@/models/post.model';
import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import hydrate, { Source } from 'next-mdx-remote/hydrate';
import PostMedia from '@/components/PostMedia';
import RecentPostsList from '@/components/RecentPostsList';

import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';
import { millisecondToDate, millisecondToUSFormat } from '@/utils/basics/date';
import { Site } from '@/models/site.model';
import SocialShare from '@/components/common/SocialShare';

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
  const [href, setHref] = useState('');
  useEffect(() => {
    setHref(location.href);
  }, []);

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
      <div className="relative">
        {/* MAIN CONTENT */}
        {post.type !== PostType.page && (
          <section className="max-w-5xl p-10 mx-auto">
            {/* MEDIA */}
            <PostMedia post={post} />
          </section>
        )}

        <section className="top-0 z-10 grid 2xl:sticky">
          <BreakBarLeft>
            <div className="grid w-full gap-4">
              {/* <section className="flex flex-wrap items-center justify-between w-full gap-4 lg:flex-nowrap"> */}
              <section className="grid items-center justify-between gap-2 lg:flex">
                <h1 className="self-center font-sans text-2xl lg:flex-1 sm:text-4xl text-basics-50 dark:text-basics-50">
                  {post.title}
                </h1>
                <div className="flex-shrink-0">{backButton()}</div>
              </section>
              <section className="grid items-end justify-between gap-4 lg:flex">
                {post.authors ? (
                  <>
                    {post.authors?.map((author, i) => (
                      <header
                        className="flex flex-wrap gap-2 2xl:flex-nowrap text-basics-50 dark:text-basics-50"
                        key={i}
                      >
                        <section className="flex items-center flex-shrink-0 space-x-4">
                          {author.photoURL && (
                            <img
                              src={author.photoURL}
                              alt="instructor"
                              className="w-12 border-2 rounded-full border-primary-50 dark:border-primary-50"
                            />
                          )}

                          <div className="grid content-start">
                            <h3 className="m-0 text-base font-light">Author</h3>
                            <h4 className="m-0 text-xl">
                              {author.displayName}
                            </h4>
                          </div>
                        </section>

                        {/* <section>Breadcrumbs &gt; on &gt; and on &gt;</section> */}
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
                                {millisecondToUSFormat(post.createdAt)}
                              </span>
                            </p>
                            <p className="flex items-center m-0 space-x-2 text-base font-light">
                              Last Updated:{' '}
                              <span>
                                {millisecondToUSFormat(post.updatedAt)}
                              </span>
                            </p>
                          </section>
                        </section>
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

        <section className="grid grid-cols-1 gap-4 p-10 2xl:grid-cols-sidebar 2xl:pl-10">
          {/* LESSONS */}
          {course && course.sections && (
            <section className="grid content-start grid-cols-1 row-start-2 gap-4 2xl:col-start-2 2xl:row-start-1">
              {course.sections.map((section) => (
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
            </section>
          )}
          {/* RECENTS */}
          {recentPosts && (
            <section className="grid content-start grid-cols-1 row-start-2 gap-4 2xl:col-start-2 2xl:row-start-1">
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="p-2 m-0 text-2xl font-bold 2xl:p-4 rounded-t-md 2xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Courses`}
                </h2>

                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.course]} />
                </ul>
              </div>
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Tutorials`}
                </h2>
                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.tutorial]} />
                </ul>
              </div>
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Podcasts`}
                </h2>
                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.podcast]} />
                </ul>
              </div>
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Blog`}
                </h2>
                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.post]} />
                </ul>
              </div>
            </section>
          )}
          {/* BLOG POST */}
          <article className="m-0 leading-relaxed top-2 text-basics-900">
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
        article > p {
          margin: 0 0 3rem;
        }

        article > p + blockquote {
          margin: 1rem 0;
        }
        main a {
          word-wrap: break-word;
          border-bottom: 2px solid #bc2261;
        }

        main iframe {
          max-width: 100%;
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
