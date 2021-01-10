import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
    if (router.asPath === `/course/${course.slug}/lesson/${lesson.slug}`)
      return true;
    return false;
  }

  return (
    <Layout>
      {/* DIV TO AVOID GRID GAP */}
      <div>
        {/* TOP BAR */}
        <section className="sticky top-0 z-10 bg-primary-50">
          <BreakBarLeft>
            <h1 className="w-1/2 font-sans text-4xl text-basics-50 dark:text-basics-50">
              {post.title}
            </h1>
            <Link href={`/courses`}>
              <a role="link" className="no-underline btn-secondary">
                back to Courses
              </a>
            </Link>
          </BreakBarLeft>
        </section>

        {/* MAIN CONTENT */}
        <section className="grid gap-4 px-4 py-10 xl:p-10 xl:grid-cols-sidebar">
          {/* Pricing */}
          <div className="grid grid-cols-1 gap-4">
            <section className="rounded-md bg-basics-50 xl:self-start">
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
                <div>Image Placeholder</div>
              )}
              <Link href="/">
                <a className="grid p-10 no-underline place-items-center">
                  <button className="btn-primary">Start Course</button>
                </a>
              </Link>
            </section>

            {/* Course Content - Similar to lesson content, should it be extracted to it's own component? */}
            {/* LESSONS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <section className="w-full rounded-md bg-basics-50">
                {post.sections &&
                  post.sections.map((section) => (
                    <div key={section.title}>
                      <h2 className="p-4 m-0 text-2xl font-bold rounded-t-md bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
                        {section.title}
                      </h2>
                      <ul className="grid overflow-y-auto justify-items-stretch">
                        {section.lessons &&
                          section.lessons.map((lesson) => (
                            <li key={lesson.id} className="ml-0 list-none">
                              <Link
                                href={`/course/${post.slug}/lesson/${lesson.slug}`}
                                key={lesson.id}
                              >
                                {/* Should active link be on the course page? */}
                                <div
                                  className={`p-2 cursor-pointer
                            ${
                              isActiveLink(post, lesson)
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

              {/* Author Content */}
              <section className="grid gap-4 p-4 rounded-md sm:self-start bg-basics-50">
                <header className="flex space-x-4">
                  <img
                    src="https://avatars0.githubusercontent.com/u/45889730?s=460&u=74587a01abf2a7f33ae964c69856f3fe71b175b6&v=4"
                    alt="instructor"
                    className="w-20 h-20 border-2 rounded-full border-primary-900"
                  />

                  <div className="flex flex-col justify-center">
                    <h3 className="m-0 text-base font-light">Instructor</h3>
                    <h4 className="m-0 text-xl">Instructor Name</h4>
                  </div>
                </header>
                <p>
                  Instructor description: Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Sint ad iusto nobis excepturi deserunt
                  exercitationem ex aspernatur sit culpa fugit porro, facere
                  eaque. Harum consequuntur corrupti odio blanditiis, culpa
                  officia!
                </p>
              </section>
            </div>
          </div>

          <section className="xl:row-start-1 xl:row-end-2">
            {/* MEDIA */}
            <section>
              <PostMedia post={post} />
            </section>

            {/* BLOG POST */}
            <section className="leading-relaxed">
              <article className="text-basics-900 ">
                {/* {content} */}
                <ShowMDX markdown={post.content || ''} />
              </article>
            </section>
          </section>
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

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.course].forEach(async (postType) => {
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
  params: { coursePath: string };
}): Promise<
  | {
      props: {
        post: PostModel | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
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

  const posts = await postBySlugService(PostType.course, coursePath);
  const post = posts.length > 0 ? posts[0] : null;

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}
