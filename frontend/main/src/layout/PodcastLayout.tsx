import { NextRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import { Post, PostType, SectionLesson } from '@/models/post.model';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import PostMedia from '@/components/PostMedia';
import RecentPostsList from '@/components/RecentPostsList';
import SponsorCards from '@/components/SponsorCards';

import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';
import { millisecondToUSFormat } from '@/utils/basics/date';
import SocialShare from '@/components/common/SocialShare';
import PostAdminButton from '@/components/PostAdminButton';
import { useUser } from 'reactfire';
import { components } from '@/components/code/MDXComponents';
import { AccessMode } from '@/models/access.model';
import MemberValidShow from '../components/user/MemberValidShow';
import MemberNotValidShow from '../components/user/MemberNotValidShow';
import PostMediaLocked from '../components/PostMediaLocked';

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
  return (
    <>
      {/* DIV TO AVOID GRID GAP */}
      <div className="relative">
        {/* MAIN CONTENT */}
        {post._type !== PostType.page && (
          <section className="">
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
                      `/api/endpreview?slug=/${post._type}/${post.slug}`,
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
            <header className="grid w-full gap-4">
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
                {post.authors && (
                  <section className="flex items-center flex-shrink-0 gap-4 no-wrap">
                    {post.authors?.map((author, i) => (
                      <article
                        className="flex flex-wrap items-center justify-start gap-2 2xl:flex-nowrap text-basics-50 dark:text-basics-50"
                        key={i}
                      >
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
                        <span className="m-0 font-sans text-xl">
                          {author.displayName}
                        </span>
                      </article>
                    ))}
                  </section>
                )}
                {post.publishedAt && (
                  <section className="flex flex-wrap items-center gap-2">
                    <p className="flex items-center m-0 space-x-2 font-light text-white">
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
                      <span>{millisecondToUSFormat(post.publishedAt)}</span>
                    </p>
                  </section>
                )}
                <div className="flex flex-wrap gap-4 md:flex-nowrap">
                  <SocialShare href={href} post={post} />
                </div>
              </section>
            </header>
          </BreakBarLeft>
        </section>
        <section className="flex flex-wrap gap-4 px-4 pb-4 mt-2 xl:flex-nowrap lg:px-10 lg:pb-10">
          <section className="flex flex-col flex-grow gap-4">
            {/* BLOG POST */}
            <article className="m-0 leading-relaxed break-words top-2 text-basics-900">
              {source && <MDXRemote {...source} components={components} />}
            </article>
          </section>
          {/* RECENTS */}
          {recentPosts && (
            <section className="flex flex-col w-full mb-2 xl:max-w-md">
              {post?.sponsors && (
                <section className="hidden 2xl:block">
                  <SponsorCards sponsors={post.sponsors} />
                </section>
              )}
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="w-full p-2 m-0 text-2xl font-bold 2xl:p-4 rounded-t-md 2xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Courses`}
                </h2>

                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.course]} />
                </ul>
              </div>
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Tutorials`}
                </h2>
                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.tutorial]} />
                </ul>
              </div>
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Podcasts`}
                </h2>
                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.podcast]} />
                </ul>
              </div>
              <div className="rounded-md bg-basics-50 dark:bg-primary-900">
                <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  {`Latest Blog`}
                </h2>
                <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
                  <RecentPostsList posts={recentPosts[PostType.post]} />
                </ul>
              </div>
            </section>
          )}
        </section>
      </div>
      <style global jsx>{`
        article {
          font-size: clamp(1rem, 1rem + 1vw, 1.5rem);
          margin: 0 auto;
          max-width: 65ch;
        }
        article > * {
          margin-bottom: 2rem;
          list-style: auto;
        }

        article > p + blockquote {
          margin: 1rem 0;
        }

        article a {
          word-break: break-all;
          word-wrap: break-word;
          border-bottom: 2px solid #bc2261;
        }

        article > iframe {
          max-width: 100%;
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

        article > img {
          max-width: 100%;
        }

        article > ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }
      `}</style>
    </>
  );
}
