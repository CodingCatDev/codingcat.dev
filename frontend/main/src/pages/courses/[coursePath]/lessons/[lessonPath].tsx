import Head from 'next/head';
import Link from 'next/link';

import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
import { postBySlugService, postsService } from '@/services/serversideApi';

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
}): JSX.Element {
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
    if (router.asPath === `/courses/${course.slug}/lessons/${lesson.slug}`)
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
      <section className="p-10">
        {/* <div className="grid grid-flow-col grid-cols-12"> */}
        {/* MEDIA */}
        {/* <div className="col-span-full xl:col-span-8 2xl:col-span-8"> */}
        <section className="grid gap-10 xl:grid-cols-sidebar">
          <PostMedia post={post} />

          {/* </div> */}
          {/* <div className="col-span-full xl:col-span-4 2xl:col-span-4"> */}
          {/* LESSONS */}
          {/* <div className="flex justify-start p-4 bg-primary-200"> */}
          <section>
            {course.sections &&
              course.sections.map((section) => (
                <div
                  className="w-full bg-primary-900 dark:bg-primary-900"
                  key={section.title}
                >
                  <h2 className="p-4 m-0 font-sans text-2xl text-basics-50 dark:text-basics-50">
                    {section.title}
                  </h2>
                  <ul className="grid overflow-y-auto justify-items-stretch bg-basics-50">
                    {section.lessons &&
                      section.lessons.map((lesson) => (
                        <li key={lesson.id} className="ml-0 list-none">
                          <Link
                            href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                            key={lesson.id}
                          >
                            <div
                              className={`p-2 cursor-pointer
                              ${
                                isActiveLink(course, lesson)
                                  ? 'bg-primary-200'
                                  : 'bg-transparent'
                              }
                              `}
                            >
                              <a className="no-underline text-basics-900 hover:text-basics-600">
                                {lesson.title}
                              </a>
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </section>

          {/* BLOG POST */}
          <section className="leading-relaxed">
            <article className="text-basics-900 ">
              <ShowMDX markdown={post.content || ''} />
            </article>
          </section>
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
        </section>
      </section>
      <style global jsx>{`
        main a {
          text-decoration: underline;
        }
        main h1,
        main h2,
        main h3,
        main h4,
        main h5,
        main h6 {
          font-family: 'Nunito', sans-serif;
          margin: 1rem 0;
        }
        main article p:first-child a img {
          width: 100%;
        }
        main p {
          margin: 1rem 0;
        }
        main ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.lesson].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          type: doc.type,
          slug: doc.slug,
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
  params: { coursePath: string; lessonPath: string };
}): Promise<
  | {
      props: {
        post: PostModel | null;
        course: PostModel | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
> {
  const { coursePath, lessonPath } = params;

  if (!coursePath || !lessonPath) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await postBySlugService(PostType.lesson, lessonPath);
  const post = posts.length > 0 ? posts[0] : null;

  const courses = await postBySlugService(
    PostType.course,
    coursePath as string
  );
  const course = courses.length > 0 ? courses[0] : null;

  return {
    props: {
      post,
      course,
    },
    revalidate: 60,
  };
}
