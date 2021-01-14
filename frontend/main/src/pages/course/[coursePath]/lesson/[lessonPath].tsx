import http from 'http';
import cookie from 'cookie';

import { useRouter } from 'next/router';
import {
  validateCourseUser,
  postBySlugService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';

import PostLayout from '@/components/PostLayout';

export default function Post({
  post,
  course,
  source,
}: {
  post: PostModel;
  course: PostModel;
  source: Source | null;
}): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  return (
    <PostLayout router={router} post={post} course={course} source={source} />
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
        source: Source | null;
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
      post,
      course,
      source,
    },
  };
}
