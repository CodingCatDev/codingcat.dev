import { NextRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import { Post, PostType, SectionLesson } from '@/models/post.model';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import PostMedia from '@/components/PostMedia';
import RecentPostsList from '@/components/RecentPostsList';

import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';
import { millisecondToUSFormat } from '@/utils/basics/date';
import SocialShare from '@/components/common/SocialShare';
import PostAdminButton from '@/components/PostAdminButton';
import { useUser } from 'reactfire';
import CodeHighlight from '@/components/CodeHighlight';
import CodeWiggle from '@/components/CodeWiggle';

export default function PostLayout({
  post,
  router,
  course,
  source,
  recentPosts,
  preview,
}: {
  post: Post;
  router: NextRouter;
  source: MDXRemoteSerializeResult | null;
  course?: Post;
  recentPosts?: { [key: string]: Post[] };
  preview?: boolean;
}): JSX.Element {
  const [href, setHref] = useState('');
  const { data: user } = useUser();
  const components: Record<string, React.ReactNode> = {
    pre: (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement>
    ) => <div {...props} className="overflow-auto" />,
    code: (
      props: JSX.IntrinsicAttributes & { children: string; className: string }
    ) => <CodeHighlight {...props} />,
    CodeWiggle: (
      props: JSX.IntrinsicAttributes & {
        children: string;
        className?: string | undefined;
      }
    ) => <CodeWiggle {...props} />,
  };

  useEffect(() => {
    setHref(location.href);
  }, []);

  function isActiveLink(course: Post, lesson: SectionLesson) {
    if (router.asPath === `/course/${course.slug}/lesson/${lesson.slug}`)
      return true;
    return false;
  }
  const pluralType = pluralize(post);

  function backButton() {
    switch (post.type) {
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

  return (
    <>
      {/* DIV TO AVOID GRID GAP */}
      <div className="relative">
        {/* MAIN CONTENT */}
        {post.type !== PostType.page && (
          <section className="max-w-5xl p-10 mx-auto">
            {/* MEDIA */}
            <PostMedia post={post} />
          </section>
        )}

        <section className="top-0 z-10 grid lg:sticky">
          {preview && (
            <>
              <div className="flex justify-center py-4 text-3xl text-white dark:text-white bg-error-900 dark:bg-error-900">
                <span>**Preview Mode**</span>
                <button
                  className="btn-primary"
                  onClick={() =>
                    window.open(
                      `/api/endpreview?slug=/${post.type}/${post.slug}`,
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
              {/* <section className="flex flex-wrap items-center justify-between w-full gap-4 lg:flex-nowrap"> */}
              <section className="grid items-center justify-between gap-2 lg:flex">
                <h1 className="self-center font-sans text-2xl lg:flex-1 sm:text-4xl text-basics-50 dark:text-basics-50">
                  {post.title}
                </h1>
                {user && user.uid && (
                  <PostAdminButton user={user} post={post} />
                )}
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
                            <Image
                              src={author.photoURL}
                              loader={() => author.photoURL || ''}
                              unoptimized={true}
                              layout="fixed"
                              height="50"
                              width="50"
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

        <section className="grid grid-cols-1 gap-4 p-1 lg:p-10 2xl:grid-cols-sidebar 2xl:pl-10">
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
                            passHref
                          >
                            <div
                              className={`p-2  cursor-pointer hover:bg-primary-200
                              ${
                                isActiveLink(course, lesson)
                                  ? 'bg-primary-200'
                                  : 'bg-transparent'
                              }
                              `}
                            >
                              <a className="no-underline text-basics-900 hover:text-primary-900">
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
          <article className="m-0 leading-relaxed break-words top-2 text-basics-900">
            {source && <MDXRemote {...source} components={components} />}
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
      `}</style>
    </>
  );
}
