import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Post,
  Post as PostModel,
  PostType,
  SectionLesson,
} from '@/models/post.model';
import { millisecondToUSFormat } from '@/utils/basics/date';
import AJPrimary from '@/components/global/icons/AJPrimary';
import PostMedia from '@/components/PostMedia';
import { StripeProduct } from '@/models/stripe.model';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import { MDXRemoteSerializeResult, MDXRemote } from 'next-mdx-remote';
import { useSigninCheck } from 'reactfire';
import CourseBuyButton from '@/components/CourseBuyButton';
import { components } from '@/components/code/MDXComponents';

export default function Course({
  post,
  source,
  product,
  preview,
}: {
  post: PostModel;
  source: MDXRemoteSerializeResult | null;
  product: StripeProduct | null;
  preview?: boolean;
}): JSX.Element {
  const { status, data: signInCheckResult } = useSigninCheck();
  const router = useRouter();

  function isActiveLink(course: Post, lesson: SectionLesson) {
    if (router.asPath === `/course/${course.slug}/lesson/${lesson.slug}`)
      return true;
    return false;
  }

  return (
    <>
      <section className="top-0 z-10 grid 2xl:sticky">
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
          <div className="grid w-full gap-4 ">
            <section className="grid items-center justify-between gap-2 lg:flex">
              <h1 className="font-sans text-5xl lg:flex-1 sm:text-4xl text-basics-50 dark:text-basics-50">
                {post.title}
              </h1>
              <div className="flex-shrink-0">
                <Link href={`/courses`}>
                  <a role="link" className="no-underline btn-secondary">
                    {/* capitalize Courses */}
                    {`back to ${
                      post.type.charAt(0).toUpperCase() + post.type.slice(1)
                    }s`}
                  </a>
                </Link>
              </div>
            </section>
            <section className="grid items-end justify-between gap-4 lg:flex text-basics-50 dark:text-basics-50">
              {post.authors ? (
                <>
                  <section className="flex items-center gap-2">
                    {post.authors?.map((author, i) => (
                      <section
                        className="flex items-center flex-shrink-0 space-x-4"
                        key={i}
                      >
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
                          <h4 className="m-0 text-xl">{author.displayName}</h4>
                        </div>
                      </section>
                    ))}
                  </section>

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
                      <span>{millisecondToUSFormat(post.createdAt)}</span>
                    </p>
                    <p className="flex items-center m-0 space-x-2 text-base font-light">
                      Last Updated:{' '}
                      <span>{millisecondToUSFormat(post.updatedAt)}</span>
                    </p>
                  </section>
                </>
              ) : (
                <div></div>
              )}
            </section>
          </div>
        </BreakBarLeft>
      </section>
      <div className="grid grid-cols-1 gap-4 px-4 pb-4 lg:px-10 lg:pb-10 lg:grid-cols-sidebar">
        <section>
          <PostMedia post={post} noImage={true} />
          <div className="mt-2">
            {source && <MDXRemote {...source} components={components} />}
          </div>
        </section>
        <section className="flex flex-col mb-2">
          {post.type === PostType.course && (
            <div className="">
              {post.coverPhoto?.public_id ? (
                <>
                  <Image
                    src={post.coverPhoto?.public_id}
                    alt={post.title}
                    width="480"
                    height="270"
                    layout="responsive"
                    className="rounded-md rounded-b-none cursor-pointer"
                  />
                </>
              ) : (
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute flex items-center flex-auto w-full h-full rounded-t-md bg-primary-900 dark:bg-primary-900">
                    <AJPrimary className="w-full h-full p-4" />
                  </div>
                </div>
              )}
              {signInCheckResult?.user ? (
                <div className="grid grid-cols-1 gap-2 p-4 justify-items-center">
                  <CourseBuyButton
                    product={product}
                    user={signInCheckResult.user}
                    post={post}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 p-4 justify-items-center">
                  <Link href="/user/profile">
                    <a className="border-none">
                      <button className="btn-primary">Membership Login</button>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          )}
          <section>
            <div className="flex items-center justify-between p-4 mb-2 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50 rounded-t-md">
              <h2 className="text-xl">Course Content</h2>
              {/* Beginner/Intermediate/Advanced descriptor */}
              <p className="p-2 text-base rounded-full text-basics-50 dark:text-basics-50 bg-secondary-600 dark:bg-secondary-600">
                Beginner
              </p>
            </div>
            {/* LESSONS */}
            {post && post.sections && (
              <section className="grid content-start grid-cols-1 row-start-2 gap-4 2xl:col-start-2 2xl:row-start-1">
                {post.sections.map((section) => (
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
                              href={`/course/${post.slug}/lesson/${lesson.slug}`}
                              key={lesson.id}
                              passHref
                            >
                              <div
                                className={`p-2  cursor-pointer hover:bg-primary-200
                              ${
                                isActiveLink(post, lesson)
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
          </section>
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
