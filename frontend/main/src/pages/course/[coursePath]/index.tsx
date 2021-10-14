import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  getSite,
  getStripeProduct,
  postBySlugService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import rehypePrism from '@mapbox/rehype-prism';
import { millisecondToUSFormat } from '@/utils/basics/date';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import AJPrimary from '@/components/global/icons/AJPrimary';
import PostMedia from '@/components/PostMedia';
import { StripeProduct } from '@/models/stripe.model';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import matter from 'gray-matter';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { MDXRemoteSerializeResult, MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useSigninCheck } from 'reactfire';
import CourseBuyButton from '@/components/CourseBuyButton';

export default function Post({
  site,
  post,
  source,
  product,
}: {
  site: Site | null;
  post: PostModel;
  source: MDXRemoteSerializeResult | null;
  product: StripeProduct | null;
}): JSX.Element {
  const router = useRouter();
  const { status, data: signInCheckResult } = useSigninCheck();

  if (router.isFallback) {
    return (
      <Layout site={site}>
        <h2>Loading...</h2>
      </Layout>
    );
  }

  return (
    <Layout site={site}>
      <section className="top-0 z-10 grid 2xl:sticky">
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
          <div className="mt-2">{source && <MDXRemote {...source} />}</div>
        </section>
        <section className="flex flex-col mb-2">
          {post.type === PostType.course && (
            <div className="">
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
              {signInCheckResult.user && (
                <div className="grid grid-cols-1 gap-2 p-4 justify-items-center">
                  <CourseBuyButton
                    product={product}
                    user={signInCheckResult.user}
                    post={post}
                  />
                </div>
              )}
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
                    key={`section-${i}`}
                    className="grid grid-cols-1 gap-4 p-2 bg-basics-50"
                  >
                    <h3 className="font-sans text-lg border-b-2 text-secondary-600 dark:text-secondary-600 border-primary-900 dark:border-primary-900">
                      {section.title}
                    </h3>
                    <ol className="grid grid-cols-1 gap-4">
                      {section.lessons?.map((lesson, i) => {
                        return (
                          <li key={`lesson-${i}`}>
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

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { coursePath: string };
}): Promise<
  | {
      props: {
        site: Site | null;
        post: PostModel | null;
        source: MDXRemoteSerializeResult | null;
        product: StripeProduct | null;
      };
      revalidate: number;
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

  let source: MDXRemoteSerializeResult | null;
  let allContent = '';

  if (post && post.urlContent) {
    const c = await (await fetch(post.urlContent)).text();
    if (c) {
      const { content } = matter(c);

      if (post.urlContent.includes('next.js') && content) {
        allContent = content.replace(
          new RegExp(/<a href\="\/docs/g),
          '<a href="https://nextjs.org/docs'
        );
        allContent = allContent.replace(new RegExp(/.md/g), '');
      } else {
        if (!content) {
          console.log('missing content after matter');
        }
      }
    } else {
      console.log('URL Content Failed');
    }
  }

  if (post && post.content) {
    const { content } = matter(post.content);
    allContent = allContent + content;
  }
  if (allContent) {
    source = await serialize(allContent, {
      mdxOptions: {
        remarkPlugins: [parse, remark2react],
        rehypePlugins: [rehypePrism],
      },
    });
  } else {
    source = null;
  }

  return {
    props: {
      site,
      post,
      source,
      product,
    },
    revalidate: 3600,
  };
}
