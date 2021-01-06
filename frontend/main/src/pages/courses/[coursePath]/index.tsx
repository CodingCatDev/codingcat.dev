import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
import { postByPermalinkService, postsService } from '@/services/serversideApi';

import {
  Post as PostModel,
  PostType,
  SectionLesson,
} from '@/models/post.model';
import ShowMDX from '@/components/ShowMDX';
import PostMedia from '@/components/PostMedia';

export default function Post({ post }: { post: PostModel }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  if (!post) {
    return (
      <Layout>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </Layout>
    );
  }
  function isActiveLink(course: PostModel, lesson: SectionLesson) {
    if (
      router.asPath === `/courses${course.permalink}/lessons${lesson.permalink}`
    )
      return true;
    return false;
  }

  return (
    <Layout>
      <div>
        <section className="sticky top-0 z-10 bg-primary-50">
          <BreakBarLeft>
            <h1 className="w-1/2 font-sans text-4xl text-basics-50 dark:text-basics-50">
              {post.title}
            </h1>
            <label htmlFor="search_blog" className="sr-only">
              Search bar
            </label>
            <input
              type="text"
              id="search_blog"
              placeholder="search"
              className="w-1/3 rounded-full"
            />
          </BreakBarLeft>
        </section>
        <div className="p-2 pt-8">
          <div className="grid p-4 xl:grid-flow-col xl:grid-cols-12 bg-primary-200 rounded-xl">
            {/* Pricing */}
            <div className="xl:col-end-13 xl:col-span-4 xl:self-center">
              <div className="m-2 shadow rounded-xl xl:ml-6 bg-basics-50">
                {post.coverPhoto?.path ? (
                  <>
                    <Image
                      src={post.coverPhoto?.path}
                      alt={post.title}
                      width="1920"
                      height="1080"
                      layout="responsive"
                      className="rounded-tl-xl rounded-tr-xl"
                    />
                  </>
                ) : (
                  <div>Image Placeholder</div>
                )}
                <div className="grid justify-center grid-cols-1">
                  <div className="grid justify-center px-2 py-1 mx-12 mt-6 text-xl bg-basics-100 text-basics-900 rounded-2xl">
                    Not Enrolled
                  </div>
                  <div className="grid justify-center px-2 py-1 mx-12 mt-6 mb-6 text-xl text-white bg-primary-900 hover:bg-primary-400 rounded-2xl">
                    Login to Enroll
                  </div>
                </div>
              </div>
            </div>
            {/* MEDIA */}
            <div className="grid grid-flow-col grid-cols-12 pt-2 pl-2 row-start-8 xl:col-span-8">
              <div className="col-span-full">
                <PostMedia post={post} />
              </div>
              <div className="col-span-full">
                {/* LESSONS */}
                <div className="flex justify-start">
                  {post.sections &&
                    post.sections.map((section) => (
                      <div className="w-full my-2" key={section.title}>
                        <div className="text-2xl font-bold">
                          {section.title}
                        </div>
                        <div className="flex flex-col justify-items-stretch bg-primary-900 rounded-xl">
                          {section.lessons &&
                            section.lessons.map((lesson) => (
                              <Link
                                href={`/courses${post.permalink}/lessons${lesson.permalink}`}
                                key={lesson.id}
                              >
                                <div
                                  className={`p-2 cursor-pointer hover:bg-primary-600
                            ${
                              isActiveLink(post, lesson) ? 'bg-primary-200' : ''
                            }
                            `}
                                >
                                  <a className="text-xl text-white no-underline hover:text-white">
                                    {lesson.title}
                                  </a>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* BLOG POST */}
        <section className="relative grid items-start justify-center gap-10 px-4 leading-relaxed 2xl:px-16 2xl:justify-start">
          <article className="text-basics-900 ">
            {/* {content} */}
            <ShowMDX markdown={post.content || ''} />
          </article>
        </section>
        <style global jsx>{`
          a {
            text-decoration: underline;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: 'Nunito', sans-serif;
            margin: 1rem 0;
          }
          article p:first-child a img {
            width: 100%;
          }
          p {
            margin: 1rem 0;
          }
          ul li {
            margin-left: 2rem;
            list-style-type: circle;
          }
        `}</style>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths: any = [];
  [PostType.course].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          coursePath: doc.permalink.substring(1).split('/'),
        },
      });
    }
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { coursePath: string };
}) {
  const { coursePath } = params;
  const posts = await postByPermalinkService([coursePath] as any);
  const post = posts.length > 0 ? posts[0] : null;
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}
