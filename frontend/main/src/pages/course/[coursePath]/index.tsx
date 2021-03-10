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

  return (
    <Layout site={site}>
      <div
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
      </div>
      <section className="grid grid-cols-1">
        <section className="relative grid items-start content-start grid-cols-1 gap-4">
          {post.type === PostType.course && (
            <section className="z-10 grid max-w-md grid-cols-1 gap-2 p-2 mx-auto mt-4 xl:p-4 bg-basics-50 xl:absolute xl:right-10 xl:top-20">
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
                <div className="flex items-center flex-auto rounded-t-md bg-primary-900 dark:bg-primary-900">
                  <AJPrimary className="max-w-full p-4 mx-auto max-h-32 2xl:max-h-64" />
                </div>
              )}
              {/* Beginner/Intermediate/Advanced descriptor */}
              <p className="p-2 rounded-full text-basics-50 dark:text-basics-50 bg-secondary-600 dark:bg-secondary-600">
                Beginner
              </p>
              {member ? (
                <p className="text-2xl">Access Lessons Below</p>
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
            </section>
          )}
          <section className="grid content-center p-4 pt-6 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
            {/* Title */}
            <div className="grid grid-cols-1 gap-4 mx-auto">
              <h1 className="font-sans text-4xl lg:text-7xl">{post.title}</h1>
              {/* Course Description */}
              <p className="max-w-sm">{post.excerpt}</p>
              {/* Instructor */}
              {post.authors?.map((author, i) => (
                <div
                  className="p-2 xl:p-4 bg-secondary-600 rounded-t-md dark:bg-secondary-600"
                  key={i}
                >
                  <div className="flex gap-4 ">
                    {author.photoURL && (
                      <img
                        src={author.photoURL}
                        alt="instructor"
                        className="w-20 h-20 border-2 rounded-full border-primary-900"
                      />
                    )}
                    <div className="flex flex-col justify-center">
                      <h3 className="m-0 text-base font-light">Instructor</h3>
                      <h4 className="m-0 text-xl">{author.displayName}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Instructor Page with List of Instructors and their Bios */}
            {/* <p className="p-2 xl:p-4">
          Instructor description: Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Sint ad iusto nobis excepturi deserunt
          exercitationem ex aspernatur sit culpa fugit porro, facere eaque.
          Harum consequuntur corrupti odio blanditiis, culpa officia!
        </p> */}
          </section>
        </section>
      </section>

      {/* MEDIA */}
      <section className="flex-1 mx-auto mt-12 xl:w-3/4 xl:flex-auto">
        <PostMedia post={post} noImage={true} />
      </section>
      <section className="grid grid-cols-1 gap-10 p-4 mx-auto lg:p-0">
        {content}
        {post.sections &&
          post.sections.map((section, i) => {
            return (
              <section key={i} className="grid grid-cols-1 gap-4">
                <h3 className="font-sans text-4xl text-secondary-600 dark:text-secondary-600">
                  {section.title}
                </h3>
                <ul className="grid grid-cols-1 gap-2">
                  {section.lessons?.map((lesson, i) => {
                    return (
                      <li key={i}>
                        <Link
                          href={`/course/${post.slug}/lesson/${lesson.slug}`}
                          key={lesson.id}
                        >
                          <a>
                            <h4 className="font-sans text-3xl">
                              {lesson.title}
                            </h4>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
      </section>
      <style jsx>{`
        p {
          width: fit-content;
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
    return {
      notFound: true,
    };
  }

  const productId = post?.accessSettings?.productId;
  let product = null;
  if (productId) {
    product = await getStripeProduct(productId);
  }

  const source: Source | null =
    post && post.content
      ? await renderToString(post.content, {
          mdxOptions: {
            // remarkPlugins: [parse, mdx],
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
