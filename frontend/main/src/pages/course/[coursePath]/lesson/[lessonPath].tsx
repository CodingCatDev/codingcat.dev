import http from 'http';
import cookie from 'cookie';

import { useRouter } from 'next/router';
import {
  validateCourseUser,
  postBySlugService,
  getSite,
} from '@/services/serversideApi';
import { NextSeo } from 'next-seo';

import { Post as PostModel, PostType } from '@/models/post.model';
import rehypePrism from '@mapbox/rehype-prism';

import PostLayout from '@/components/PostLayout';
import { Site } from '@/models/site.model';
import { AccessMode } from '@/models/access.model';
import { AuthIssue } from '@/models/user.model';
import matter from 'gray-matter';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Layout from '@/layout/Layout';

export default function Post({
  site,
  post,
  course,
  source,
}: {
  site: Site | null;
  post: PostModel;
  course: PostModel;
  source: MDXRemoteSerializeResult | null;
}): JSX.Element {
  const router = useRouter();
  return (
    <>
      <NextSeo
        title={post.title}
        description={post.excerpt}
        canonical={`https://codingcat.dev${router.asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev${router.asPath}`,
          title: post.title,
          description: post.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/c_fit,w_1200,h_630/${post.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/${post.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <PostLayout
          router={router}
          post={post}
          course={course}
          source={source}
        />
      </Layout>
    </>
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
        source: MDXRemoteSerializeResult | null;
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
    console.log('Course or Post slug not found.');
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
        console.log('Not a member, no product');
        return {
          redirect: {
            destination: `/user/profile`,
            permanent: false,
          },
        };
      } else {
        console.log('Invalid User', failureType);
        return {
          notFound: true,
        };
      }
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
      course,
      source,
    },
  };
}
