import Head from 'next/head';
import Link from 'next/link';

import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

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

export default function Post({
  post,
  course,
}: {
  post: PostModel;
  course: PostModel;
}) {
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
      {/* MEDIA AREA */}
      <div className="p-2 pt-8 z-9">
        <div className="grid grid-flow-col grid-cols-12">
          {/* MEDIA */}
          <div className="col-span-full xl:col-span-8 2xl:col-span-8">
            <PostMedia post={post} />
          </div>
          <div className="col-span-full xl:col-span-4 2xl:col-span-4">
            {/* LESSONS */}
            <div className="flex justify-start p-4 bg-primary-200">
              {course.sections &&
                course.sections.map((section) => (
                  <div className="w-full" key={section.title}>
                    {section.title}
                    <div className="flex flex-col justify-items-stretch">
                      {section.lessons &&
                        section.lessons.map((lesson) => (
                          <Link
                            href={`/courses${course.permalink}/lessons${lesson.permalink}`}
                            key={lesson.id}
                          >
                            <div
                              className={`p-2 cursor-pointer hover:bg-primary-600
                            ${
                              isActiveLink(course, lesson)
                                ? 'bg-primary-600'
                                : 'bg-primary-900'
                            }
                            `}
                            >
                              <a className="text-white hover:text-white">
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
      {/* BLOG POST */}
      <section className="relative grid items-start justify-center gap-10 px-4 leading-relaxed 2xl:px-16 2xl:justify-start">
        <article className="text-basics-900 ">
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
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths: any = [];
  [PostType.lesson].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          lessonPath: doc.permalink.substring(1).split('/'),
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
  params: { lessonPath: string; coursePath: string };
}) {
  const { lessonPath, coursePath } = params;
  const posts = await postByPermalinkService([lessonPath] as any);
  const courses = await postByPermalinkService([coursePath] as any);
  const post = posts.length > 0 ? posts[0] : null;
  const course = courses.length > 0 ? courses[0] : null;
  return {
    props: {
      post,
      course,
    },
    revalidate: 60,
  };
}
