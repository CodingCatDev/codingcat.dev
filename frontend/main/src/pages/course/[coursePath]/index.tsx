import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  getSite,
  getStripeProduct,
  postBySlugService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate, { Source } from 'next-mdx-remote/hydrate';
import rehypePrism from '@mapbox/rehype-prism';
import { millisecondToDate, millisecondToUSFormat } from '@/utils/basics/date';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import AJPrimary from '@/components/global/icons/AJPrimary';
import PostMedia from '@/components/PostMedia';
import { useState } from 'react';
import CourseBuy from '@/components/CourseBuy';
import { StripeProduct } from '@/models/stripe.model';
import { AccessMode } from '@/models/access.model';
import OutsideClick from '@/components/OutsideClick';
import { useUser } from '@/utils/auth/useUser';
import { useEffect } from 'react';
import { isUserCourseSub, isUserMember, isUserTeam } from '@/services/api';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import BreakBarLeft from '@/components/home/BreakBarLeft';

export default function Post({
  site,
  post,
  source,
  product,
}: {
  site: Site | null;
  post: PostModel;
  source: Source | null;
  product: StripeProduct | null;
}): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Layout site={site}>
        <h2>Loading...</h2>
      </Layout>
    );
  }
  const [showMustSignin, setShowMustSignin] = useState(false);
  const [member, setMember] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.uid && product) {
      const isUserTeam$ = isUserTeam(user.uid);
      const isUserMember$ = isUserMember(user.uid);
      const isUserCourseSub$ = isUserCourseSub(user.uid, product.id);
      combineLatest([isUserTeam$, isUserMember$, isUserCourseSub$])
        .pipe(take(1))
        .subscribe((c) => {
          setMember(c.includes(true));
        });
    }
  }, [user]);

  const content = source ? hydrate(source) : null;
  console.log(post);
  return (
    <Layout site={site}>
      {/* Could not see where this was used. */}
      {/* <div
        className={`${
          showMustSignin ? 'block' : 'hidden'
        } fixed inset-0 z-50 overflow-hidden bg-primary-100 bg-opacity-80`}
      >
        <section
          className="absolute inset-y-0 left-0 grid w-full h-full place-items-center justify-items-center"
          aria-labelledby="slide-over-heading"
        >
          <OutsideClick toggle={setShowMustSignin} value={false}>
            <section className="flex items-center p-8 m-auto space-x-20 space-between bg-primary-900 dark:bg-primary-50 rounded-xl">
              <div className="grid gap-4 text-2xl text-primary-50 dark:text-primary-900">
                <div>Please Sign in First.</div>
                <Link href="/membership">
                  <a>
                    <button className="btn-secondary">Sign In</button>
                  </a>
                </Link>
                <div>
                  Then you can purchase courses directly, or become a member.
                </div>
              </div>
            </section>
          </OutsideClick>
        </section>
      </div> */}
      <section className="top-0 z-10 grid 2xl:sticky">
        <BreakBarLeft>
          <div className="grid w-full gap-4 ">
            <section className="grid items-center justify-between gap-2 lg:flex">
              <h1 className="font-sans text-5xl lg:flex-1 sm:text-4xl text-basics-50 dark:text-basics-50">
                {post.title}
              </h1>
              <div className="flex-shrink-0">
                <Link href={`/${post.type}`}>
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
                  {post.authors?.map((author, i) => (
                    <>
                      <section
                        className="flex items-center flex-shrink-0 space-x-4"
                        key={i}
                      >
                        {author.photoURL && (
                          <img
                            src={author.photoURL}
                            alt="instructor"
                            className="w-12 border-2 rounded-full border-primary-50 dark:border-primary-50"
                          />
                        )}

                        <div className="grid content-start">
                          <h3 className="m-0 text-base font-light">Author</h3>
                          <h4 className="m-0 text-xl">{author.displayName}</h4>
                        </div>
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
                  ))}
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
          {content}
        </section>
        <section className="grid grid-cols-1 gap-10">
          {post.type === PostType.course && (
            <div className="bg-basics-50">
              {post.coverPhoto?.path ? (
                <>
                  <Image
                    src={post.coverPhoto?.path}
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
              <div className="grid grid-cols-1 gap-2 p-4 justify-items-center">
                {member ? (
                  // start course with link instead of telling user to go down on a page?
                  <>
                    {post.sections && (
                      // not sure if this will get the correct slug, I think going to the first lesson here is better UX.
                      <>
                        {/*  <Link
                         href={`/course/${post.sections[0].lessons[0].slug}/lesson/1`}
                       >
                         <a>
                           <button className="btn-primary">Start Course</button>
                         </a>
                       </Link> */}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {product && (
                      <p className="p-2 text-xl text-basics-900">
                        ${post.accessSettings?.price}
                      </p>
                    )}
                    <div className="flex items-center justify-center space-x-4 flex-nowrap">
                      {product && (
                        <CourseBuy
                          product={product}
                          setShowMustSignin={setShowMustSignin}
                        />
                      )}
                      {post.accessSettings?.accessMode !== AccessMode.open ? (
                        <Link href="/membership">
                          <a>
                            <button className="btn-primary">
                              Become a Member
                            </button>
                          </a>
                        </Link>
                      ) : (
                        <p className="text-2xl">No Membership Needed ❤️</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <section>
            <div className="flex items-center justify-between p-4 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50 rounded-t-md">
              <h2 className="text-xl">Course Content</h2>
              {/* Beginner/Intermediate/Advanced descriptor */}
              <p className="p-2 text-base rounded-full text-basics-50 dark:text-basics-50 bg-secondary-600 dark:bg-secondary-600">
                Beginner
              </p>
            </div>
            {post.sections &&
              post.sections.map((section, i) => {
                return (
                  <section
                    key={i}
                    className="grid grid-cols-1 gap-4 p-2 bg-basics-50"
                  >
                    <h3 className="font-sans text-lg border-b-2 text-secondary-600 dark:text-secondary-600 border-primary-900 dark:border-primary-900">
                      {section.title}
                    </h3>
                    <ol className="grid grid-cols-1 gap-4">
                      {section.lessons?.map((lesson, i) => {
                        return (
                          <li key={i}>
                            <Link
                              href={`/course/${post.slug}/lesson/${lesson.slug}`}
                              key={lesson.id}
                            >
                              <a>
                                <h4 className="font-sans text-base">
                                  <span className="">{i + 1}.</span>{' '}
                                  {lesson.title}
                                </h4>
                              </a>
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                );
              })}
          </section>
        </section>
      </div>
      <style global jsx>{`
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Nunito', sans-serif;
          margin: 0;
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { coursePath: string };
}): Promise<
  | {
      props: {
        site: Site | null;
        post: PostModel | null;
        source: Source | null;
        product: StripeProduct | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { coursePath } = params;

  if (!coursePath) {
    console.log('No Course Path Found.');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const site = await getSite();
  const posts = await postBySlugService(PostType.course, coursePath);
  const post = posts.length > 0 ? posts[0] : null;

  if (!post) {
    console.log('No Post Found.');

    return {
      notFound: true,
    };
  }

  const productId = post?.accessSettings?.productId;
  let product = null;
  if (productId) {
    product = await getStripeProduct(productId);
    if (product) {
      console.log('Product Found and passed.');
    }
  }

  const source: Source | null =
    post && post.content
      ? await renderToString(post.content, {
          mdxOptions: {
            // remarkPlugins: [parse, mdx],
            rehypePlugins: [rehypePrism],
          },
        })
      : null;

  return {
    props: {
      site,
      post,
      source,
      product,
    },
  };
}
