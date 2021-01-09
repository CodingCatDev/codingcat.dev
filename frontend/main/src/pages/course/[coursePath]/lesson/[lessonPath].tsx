import http from 'http';
import cookie from 'cookie';
import Head from 'next/head';
import Link from 'next/link';

import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
import {
  validateCourseUser,
  postBySlugService,
} from '@/services/serversideApi';

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
      {/* DIV TO AVOID GRID GAP */}
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

        {/* MEDIA AREA */}
        {/* <section className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-sidebar xl:gap-0"> */}
        <section className="w-full">
          <div className="flex flex-col p-4 xl:flex-row xl:mx-auto">
            {/* MEDIA */}
            <section className="flex-1 xl:w-3/4 xl:flex-auto">
              <PostMedia post={post} />
            </section>
            {/* LESSONS */}
            <section className="relative xl:w-1/4">
              {course.sections &&
                course.sections.map((section) => (
                  <div
                    key={section.title}
                    className="flex flex-col xl:absolute xl:w-full xl:h-full bg-basics-50"
                  >
                    <h2 className="p-4 m-0 text-2xl font-bold xl:flex-shrink-0 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
                      {section.title}
                    </h2>
                    <ul className="flex flex-col flex-grow xl:overflow-auto scrollbar justify-items-stretch bg-basics-50">
                      {section.lessons &&
                        section.lessons.map((lesson) => (
                          <li key={lesson.id} className="ml-0 list-none">
                            <Link
                              href={`/course/${course.slug}/lesson/${lesson.slug}`}
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
                                <a className="no-underline text-basics-900 hover:text-primary-900 hover:underline">
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
          </div>
        </section>
        {/* BLOG POST */}
        <section className="max-w-5xl px-4 mx-auto leading-relaxed">
          <article className="text-basics-900 ">
            <ShowMDX markdown={post.content || ''} />
          </article>
        </section>
      </div>
      <style global jsx>{`
        main a {
          text-decoration: underline;
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

export async function getServerSideProps({
  params,
  req,
}: {
  params: { coursePath: string; lessonPath: string };
  req: http.IncomingMessage;
}): Promise<
  | {
      props: {
        post: PostModel | null;
        course: PostModel | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { coursePath, lessonPath } = params;

  const cookies = cookie.parse(req.headers.cookie || '');
  const auth = cookies.auth;
  // Check for user authentication from cookie
  let validUser = true;
  if (auth) {
    const user = JSON.parse(auth) as {
      uid: string;
      email: string;
      token: string;
    };
    validUser = await validateCourseUser(user.token);
  } else {
    validUser = false;
  }

  if (!validUser) {
    if (coursePath) {
      return {
        redirect: {
          destination: `/course/${coursePath}`,
          permanent: false,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }

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
  };
}
