import http from 'http';
import cookie from 'cookie';

import { useRouter } from 'next/router';
import {
  validateCourseUser,
  postBySlugService,
  getSite,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';
import rehypePrism from '@mapbox/rehype-prism';

import PostLayout from '@/components/PostLayout';
import { Site } from '@/models/site.model';
import { AccessMode } from '@/models/access.model';
import { AuthIssue } from '@/models/user.model';

export default function Post({
  site,
  post,
  course,
  source,
}: {
  site: Site | null;
  post: PostModel;
  course: PostModel;
  source: Source | null;
}): JSX.Element {
  const router = useRouter();
  return (
    <PostLayout
      site={site}
      router={router}
      post={post}
      course={course}
      source={source}
    />
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
        site: Site | null;
        post: PostModel | null;
        course: PostModel | null;
        source: Source | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { coursePath, lessonPath } = params;

  if (!coursePath || !lessonPath) {
    return {
      notFound: true,
    };
  }
  const site = await getSite();
  const posts = await postBySlugService(PostType.lesson, lessonPath);
  const post = posts.length > 0 ? posts[0] : null;

  const courses = await postBySlugService(
    PostType.course,
    coursePath as string
  );
  const course = courses.length > 0 ? courses[0] : null;

  if (!post || !course) {
    return {
      notFound: true,
    };
  }

  /* AUTH */

  // This check allows any other access mode except closed and free
  // As these modes need to be signed in.
  if (
    course &&
    course.accessSettings &&
    [AccessMode.closed, AccessMode.free].includes(
      course?.accessSettings?.accessMode
    )
  ) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const auth = cookies.auth;
    // Check for user authentication from cookie
    let validUser = true;
    let failureType: AuthIssue = AuthIssue.mustsignin;
    if (auth) {
      const user = JSON.parse(auth) as {
        uid: string;
        email: string;
        token: string;
      };
      if (course && course.accessSettings && course.accessSettings.productId) {
        validUser = await validateCourseUser(
          user.token,
          course.accessSettings.productId
        );
        if (!validUser) {
          failureType = AuthIssue.unauthorized;
        }
      }
    } else {
      validUser = false;
      failureType = AuthIssue.mustsignin;
    }

    if (!validUser) {
      if (coursePath) {
        // return {
        //   redirect: {
        //     destination: `/course/${coursePath}?error=${failureType}`,
        //     permanent: false,
        //   },
        // };
        return {
          redirect: {
            destination: `/membership`,
            permanent: false,
          },
        };
      } else {
        return {
          notFound: true,
        };
      }
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
      course,
      source,
    },
  };
}
